import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfDataDataset, LfLLMToolCall } from "@lf-widgets/foundations";
import {
  mergeToolCalls,
  mergeToolExecutionDatasets,
  normalizeToolCallsForStreaming,
} from "./helpers.tools";
import { LfChat } from "./lf-chat";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfChat],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-chat", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    expect(component.lfContextWindow).toBe(8192);
    expect(component.lfEmpty).toBe("Your chat history is empty!");
    expect(component.lfEndpointUrl).toBe("http://localhost:5001");
    expect(component.lfTools).toEqual([]);
    expect(component.lfFrequencyPenalty).toBe(0);
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-chat lf-context-window="4096" lf-empty="No messages"></lf-chat>`,
    );
    const component = page.rootInstance as LfChat;

    expect(component.lfContextWindow).toBe(4096);
    expect(component.lfEmpty).toBe("No messages");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    const props = await component.getProps();
    expect(props.lfContextWindow).toBe(8192);
    expect(props.lfEmpty).toBe("Your chat history is empty!");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });

  it("merges streaming tool call chunks into a single complete call", () => {
    const rawCalls: Array<LfLLMToolCall & { index?: number }> = [
      {
        // Initial chunk with empty arguments
        index: 0,
        id: "call_1",
        type: "function",
        function: {
          name: "get_weather",
          arguments: "",
        },
      },
      {
        // Follow-up chunk with populated arguments
        index: 0,
        id: "call_1",
        function: {
          arguments: '{"location":"Tokyo"}',
          name: "get_weather",
        },
      },
    ];

    const merged = normalizeToolCallsForStreaming(rawCalls);

    expect(merged).toHaveLength(1);
    expect(merged[0].id).toBe("call_1");
    expect(merged[0].function.name).toBe("get_weather");
    expect(merged[0].function.arguments).toBe('{"location":"Tokyo"}');
  });

  it("merges tool execution datasets while preserving children", () => {
    const existing: LfDataDataset = {
      nodes: [
        {
          id: "tool-exec-root",
          value: "Working...",
          icon: "loading",
          children: [
            { id: "call_1", value: "get_weather", children: [] },
          ] as any,
        } as any,
      ],
    };

    const incoming: LfDataDataset = {
      nodes: [
        {
          id: "tool-exec-root",
          value: "Completed",
          icon: "success",
          children: [{ id: "call_2", value: "get_docs", children: [] }] as any,
        } as any,
      ],
    };

    const merged = mergeToolExecutionDatasets(existing, incoming);

    expect(merged.nodes[0].value).toBe("Completed");
    expect(merged.nodes[0].icon).toBe("success");
    const childIds = (merged.nodes[0].children || []).map((c: any) => c.id);
    expect(childIds).toEqual(expect.arrayContaining(["call_1", "call_2"]));
  });

  it("merges tool calls and de-duplicates by id", () => {
    const existing: LfLLMToolCall[] = [
      {
        id: "call_1",
        type: "function",
        function: { name: "get_weather", arguments: '{"location":"London"}' },
      },
    ];

    const incoming: LfLLMToolCall[] = [
      {
        id: "call_1",
        type: "function",
        function: { name: "get_weather", arguments: '{"location":"Tokyo"}' },
      },
      {
        id: "call_2",
        type: "function",
        function: { name: "get_docs", arguments: "{}" },
      },
    ];

    const merged = mergeToolCalls(existing, incoming);
    const ids = merged.map((c) => c.id);

    expect(ids).toEqual(["call_1", "call_2"]);
  });
});

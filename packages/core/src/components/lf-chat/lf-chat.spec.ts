import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import {
  LfDataDataset,
  LfLLMToolCall,
  LfLLMToolDefinition,
} from "@lf-widgets/foundations";
import {
  mergeToolCalls,
  mergeToolExecutionDatasets,
  normalizeToolCallsForStreaming,
} from "./helpers.tools";
import { getEffectiveConfig } from "./helpers.config";
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

    expect(component.lfConfig).toEqual({});
    expect(component.lfStyle).toBe("");
    expect(component.lfUiSize).toBe("medium");
    expect(component.lfValue).toEqual([]);
  });

  it("should set props via lfConfig", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    component.lfConfig = {
      llm: { contextWindow: 4096 },
      ui: { emptyMessage: "No messages" },
    };
    await page.waitForChanges();

    expect(component.lfConfig?.llm?.contextWindow).toBe(4096);
    expect(component.lfConfig?.ui?.emptyMessage).toBe("No messages");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    const props = await component.getProps();
    expect(props.lfConfig).toEqual({});
    expect(props.lfStyle).toBe("");
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

  it("merges builtin tools with user tools from config without duplicates", () => {
    const userTool: LfLLMToolDefinition = {
      type: "function",
      function: {
        name: "user_tool",
        description: "User provided tool",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    };

    const builtinTool: LfLLMToolDefinition = {
      type: "function",
      function: {
        name: "builtin_tool",
        description: "Builtin framework tool",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      meta: {
        category: "general",
      },
    };

    const adapter: any = {
      controller: {
        get: {
          compInstance: {
            lfConfig: {
              llm: {},
              tools: {
                definitions: [userTool],
              },
              ui: {},
              attachments: {},
            },
          },
          manager: {
            debug: {
              logs: {
                new: jest.fn(),
              },
            },
            llm: {
              getBuiltinToolDefinitions: () => ({
                general: { builtin_tool: builtinTool },
              }),
              getBuiltinToolHandlers: () => ({}),
            },
          },
        },
      },
    };

    const effective = getEffectiveConfig(adapter);
    const names = effective.tools.definitions.map((t) => t.function.name);

    expect(names).toEqual(
      expect.arrayContaining(["user_tool", "builtin_tool"]),
    );
  });

  it("prefers user tools over builtin tools with the same name", () => {
    const userTool: LfLLMToolDefinition = {
      type: "function",
      function: {
        name: "get_weather",
        description: "User override for weather",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    };

    const builtinTool: LfLLMToolDefinition = {
      type: "function",
      function: {
        name: "get_weather",
        description: "Builtin weather tool",
        parameters: {
          type: "object",
          properties: {},
        },
      },
      meta: {
        category: "general",
      },
    };

    const adapter: any = {
      controller: {
        get: {
          compInstance: {
            lfConfig: {
              llm: {},
              tools: {
                definitions: [userTool],
              },
              ui: {},
              attachments: {},
            },
          },
          manager: {
            debug: {
              logs: {
                new: jest.fn(),
              },
            },
            llm: {
              getBuiltinToolDefinitions: () => ({
                general: { get_weather: builtinTool },
              }),
              getBuiltinToolHandlers: () => ({}),
            },
          },
        },
      },
    };

    const effective = getEffectiveConfig(adapter);
    const definitions = effective.tools.definitions;

    expect(definitions).toHaveLength(1);
    expect(definitions[0].function.name).toBe("get_weather");
    expect(definitions[0].function.description).toBe(
      "User override for weather",
    );
  });

  it("renders lf-article when a message has articleContent", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    component.history = [
      {
        role: "assistant",
        content: "Here is a rich result",
        articleContent: {
          nodes: [
            {
              id: "root",
              value: "Article root",
            },
          ],
        },
      },
    ] as any;
    component.status = "ready";

    await page.waitForChanges();

    const article = page.root?.shadowRoot?.querySelector("lf-article");
    expect(article).not.toBeNull();
  });

  it("renders message attachments chipset when message has attachments", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    component.history = [
      {
        role: "user",
        content: "Here is an image",
        attachments: [
          {
            id: "img-1",
            type: "image_url",
            name: "screenshot.png",
            image_url: { url: "data:image/png;base64,test" },
          },
        ],
      },
    ] as any;
    component.status = "ready";

    await page.waitForChanges();

    const chipset = page.root?.shadowRoot?.querySelector(
      ".toolbar__message-attachments lf-chip",
    );
    expect(chipset).not.toBeNull();
  });

  it("renders file icon for file attachments", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    component.history = [
      {
        role: "user",
        content: "Here is a file",
        attachments: [
          {
            id: "file-1",
            type: "file",
            name: "document.pdf",
            url: "blob:http://localhost/test",
          },
        ],
      },
    ] as any;
    component.status = "ready";

    await page.waitForChanges();

    const chipset = page.root?.shadowRoot?.querySelector(
      ".toolbar__message-attachments lf-chip",
    );
    expect(chipset).not.toBeNull();
  });

  it("does not render message attachments when there are none", async () => {
    const page = await createPage(`<lf-chat></lf-chat>`);
    const component = page.rootInstance as LfChat;

    component.history = [
      {
        role: "user",
        content: "Just a message without attachments",
      },
    ] as any;
    component.status = "ready";

    await page.waitForChanges();

    const chipset = page.root?.shadowRoot?.querySelector(
      ".toolbar__message-attachments",
    );
    expect(chipset).toBeNull();
  });
});

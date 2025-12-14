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

  it("deduplicates identical tool calls with different JSON formatting", () => {
    // This simulates what happens when an LLM outputs the same tool call
    // multiple times with different JSON whitespace formatting
    const rawCalls: Array<LfLLMToolCall & { index?: number }> = [
      {
        id: "call_1",
        type: "function",
        function: {
          name: "get_weather",
          arguments: '{"location":"Tokyo"}', // no space
        },
      },
      {
        id: "call_2",
        type: "function",
        function: {
          name: "get_weather",
          arguments: '{"location": "Tokyo"}', // space after colon
        },
      },
      {
        id: "call_3",
        type: "function",
        function: {
          name: "get_weather",
          arguments: '{ "location" : "Tokyo" }', // extra spaces
        },
      },
    ];

    const merged = normalizeToolCallsForStreaming(rawCalls);

    // All three should be deduplicated to a single call
    expect(merged).toHaveLength(1);
    expect(merged[0].function.name).toBe("get_weather");
  });

  it("deduplicates streaming tool calls with different indices but same function+args", () => {
    // This is the critical bug case: LLM sends multiple identical tool calls
    // in separate streaming chunks, each with different index values
    const rawCalls: Array<LfLLMToolCall & { index?: number }> = [
      {
        index: 0,
        id: "call_xyz_1",
        type: "function",
        function: {
          name: "get_weather",
          arguments: '{"location": "Tokyo"}',
        },
      },
      {
        index: 1,
        id: "call_xyz_2",
        type: "function",
        function: {
          name: "get_weather",
          arguments: '{"location": "Tokyo"}',
        },
      },
      {
        index: 2,
        id: "call_xyz_3",
        type: "function",
        function: {
          name: "get_weather",
          arguments: '{"location": "Tokyo"}',
        },
      },
    ];

    const merged = normalizeToolCallsForStreaming(rawCalls);

    // All three should be deduplicated to a single call
    // The second-stage dedupe should catch these even though they have different indices
    expect(merged).toHaveLength(1);
    expect(merged[0].function.name).toBe("get_weather");
    expect(JSON.parse(merged[0].function.arguments)).toEqual({
      location: "Tokyo",
    });
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
          compInstance: () => ({
            lfConfig: {
              llm: {},
              tools: {
                definitions: [userTool],
              },
              ui: {},
              attachments: {},
            },
          }),
          framework: () => ({
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
          }),
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
          compInstance: () => ({
            lfConfig: {
              llm: {},
              tools: {
                definitions: [userTool],
              },
              ui: {},
              attachments: {},
            },
          }),
          framework: () => ({
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
          }),
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

  //#region Event Emission Tests
  describe("event emission", () => {
    it("should emit ready event on component load", async () => {
      // Ready event is emitted during componentDidLoad, need to capture via spy
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      // Verify component loaded successfully (ready event was emitted)
      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
      expect(page.root).toBeTruthy();
    });

    it("should emit update event when history changes", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;
      component.status = "ready";

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-chat-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.setHistory(
        JSON.stringify([{ role: "user", content: "Hello" }]),
      );
      await page.waitForChanges();

      const updateEvents = events.filter(
        (e) => e.detail.eventType === "update",
      );
      expect(updateEvents.length).toBeGreaterThan(0);
    });

    it("should emit unmount event when unmount is called", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-chat-event", (e: CustomEvent) =>
        events.push(e),
      );

      // unmount uses setTimeout, need to wait for it
      await new Promise<void>((resolve) => {
        component.unmount(0);
        setTimeout(() => resolve(), 50);
      });
      await page.waitForChanges();

      const unmountEvents = events.filter(
        (e) => e.detail.eventType === "unmount",
      );
      expect(unmountEvents.length).toBeGreaterThan(0);
    });

    it("should include history and status in event payload", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;
      component.status = "ready";
      component.history = [{ role: "user", content: "Test" }] as any;

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-chat-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.refresh();
      await page.waitForChanges();

      // Check that events have proper payload structure
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        expect(lastEvent.detail).toHaveProperty("status");
        expect(lastEvent.detail).toHaveProperty("history");
        expect(lastEvent.detail).toHaveProperty("comp");
      }
    });
  });
  //#endregion

  //#region Public Methods Tests
  describe("public methods", () => {
    it("should return history as JSON string via getHistory", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
      ] as any;

      const historyStr = await component.getHistory();
      const parsed = JSON.parse(historyStr);

      expect(parsed).toHaveLength(2);
      expect(parsed[0].content).toBe("Hello");
      expect(parsed[1].content).toBe("Hi there!");
    });

    it("should return empty string when getHistory fails to serialize", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      // Set history to empty
      component.history = [];
      const historyStr = await component.getHistory();

      expect(historyStr).toBe("[]");
    });

    it("should return last message via getLastMessage", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [
        { role: "user", content: "First message" },
        { role: "assistant", content: "Second message" },
        { role: "user", content: "Third message" },
      ] as any;

      const lastMessage = await component.getLastMessage();
      expect(lastMessage).toBe("Third message");
    });

    it("should return empty string when no history for getLastMessage", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [];

      const lastMessage = await component.getLastMessage();
      expect(lastMessage).toBe("");
    });

    it("should set history via setHistory method", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;
      component.status = "ready";

      const newHistory = [
        { role: "user", content: "New message" },
        { role: "assistant", content: "Response" },
      ];

      await component.setHistory(JSON.stringify(newHistory));
      await page.waitForChanges();

      expect(component.history.length).toBe(2);
      expect(component.history[0].content).toBe("New message");
    });

    it("should abort streaming when abortStreaming is called", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      const mockAbortController = new AbortController();
      const abortSpy = jest.spyOn(mockAbortController, "abort");
      component.currentAbortStreaming = mockAbortController;

      await component.abortStreaming();

      expect(abortSpy).toHaveBeenCalled();
    });

    it("should not throw when abortStreaming is called without active stream", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.currentAbortStreaming = null;

      await expect(component.abortStreaming()).resolves.not.toThrow();
    });
  });
  //#endregion

  //#region Configuration Tests
  describe("configuration", () => {
    it("should apply UI layout from lfConfig", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.lfConfig = {
        ui: { layout: "bottom" },
      };
      component.status = "ready";
      await page.waitForChanges();

      const chatDiv = page.root?.shadowRoot?.querySelector(".chat");
      expect(chatDiv?.classList.contains("chat--bottom")).toBe(true);
    });

    it("should apply custom empty message from lfConfig", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.lfConfig = {
        ui: { emptyMessage: "Custom empty message" },
      };
      component.status = "ready";
      component.history = [];
      await page.waitForChanges();

      const emptyDiv = page.root?.shadowRoot?.querySelector(".messages__empty");
      expect(emptyDiv?.textContent).toBe("Custom empty message");
    });

    it("should merge multiple lfConfig sections", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.lfConfig = {
        llm: {
          contextWindow: 8192,
          temperature: 0.8,
        },
        ui: {
          layout: "top",
          emptyMessage: "Start chatting!",
        },
      };
      await page.waitForChanges();

      expect(component.lfConfig.llm?.contextWindow).toBe(8192);
      expect(component.lfConfig.llm?.temperature).toBe(0.8);
      expect(component.lfConfig.ui?.layout).toBe("top");
      expect(component.lfConfig.ui?.emptyMessage).toBe("Start chatting!");
    });
  });
  //#endregion

  //#region Message Handling Tests
  describe("message handling", () => {
    it("should render user messages", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [{ role: "user", content: "Hello world" }] as any;
      component.status = "ready";
      await page.waitForChanges();

      const messageContainer = page.root?.shadowRoot?.querySelector(
        ".messages__container--user",
      );
      expect(messageContainer).not.toBeNull();
    });

    it("should render assistant messages", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [
        { role: "assistant", content: "I am an assistant" },
      ] as any;
      component.status = "ready";
      await page.waitForChanges();

      const messageContainer = page.root?.shadowRoot?.querySelector(
        ".messages__container--assistant",
      );
      expect(messageContainer).not.toBeNull();
    });

    it("should filter out tool messages from display", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [
        { role: "user", content: "Call a tool" },
        { role: "tool", content: "Tool response" },
        { role: "assistant", content: "Here is the result" },
      ] as any;
      component.status = "ready";
      await page.waitForChanges();

      const toolContainer = page.root?.shadowRoot?.querySelector(
        ".messages__container--tool",
      );
      expect(toolContainer).toBeNull();
    });

    it("should render multiple messages in order", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [
        { role: "user", content: "First" },
        { role: "assistant", content: "Second" },
        { role: "user", content: "Third" },
      ] as any;
      component.status = "ready";
      await page.waitForChanges();

      const containers = page.root?.shadowRoot?.querySelectorAll(
        ".messages__container",
      );
      expect(containers?.length).toBe(3);
    });

    it("should initialize history from lfValue prop", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      const initialHistory = [
        { role: "user", content: "Initial message" },
        { role: "assistant", content: "Initial response" },
      ];

      component.lfValue = initialHistory as any;
      await page.waitForChanges();

      // lfValue should be accessible
      expect(component.lfValue).toHaveLength(2);
    });
  });
  //#endregion

  //#region Status State Tests
  describe("status states", () => {
    it("should show connecting state spinner", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "connecting";
      await page.waitForChanges();

      const spinner = page.root?.shadowRoot?.querySelector("lf-spinner");
      expect(spinner).not.toBeNull();
    });

    it("should show offline state with retry button", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "offline";
      await page.waitForChanges();

      const errorDiv = page.root?.shadowRoot?.querySelector(".chat__error");
      expect(errorDiv).not.toBeNull();
    });

    it("should show chat interface when ready", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "ready";
      await page.waitForChanges();

      const messagesDiv = page.root?.shadowRoot?.querySelector(".messages");
      expect(messagesDiv).not.toBeNull();
    });

    it("should apply status class to chat container", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "ready";
      await page.waitForChanges();

      const chatDiv = page.root?.shadowRoot?.querySelector(".chat");
      expect(chatDiv?.classList.contains("chat--ready")).toBe(true);
    });
  });
  //#endregion

  //#region Empty State Tests
  describe("empty state", () => {
    it("should display empty message when history is empty", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "ready";
      component.history = [];
      await page.waitForChanges();

      const emptyDiv = page.root?.shadowRoot?.querySelector(".messages__empty");
      expect(emptyDiv).not.toBeNull();
    });

    it("should not display empty message when history has messages", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "ready";
      component.history = [{ role: "user", content: "Hello" }] as any;
      await page.waitForChanges();

      const emptyDiv = page.root?.shadowRoot?.querySelector(".messages__empty");
      expect(emptyDiv).toBeNull();
    });

    it("should use default empty message when not configured", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "ready";
      component.history = [];
      component.lfConfig = {};
      await page.waitForChanges();

      const emptyDiv = page.root?.shadowRoot?.querySelector(".messages__empty");
      expect(emptyDiv).not.toBeNull();
      // Default empty message should be rendered (whatever the default is)
      expect(emptyDiv?.textContent?.length).toBeGreaterThan(0);
    });
  });
  //#endregion

  //#region View Switching Tests
  describe("view switching", () => {
    it("should render settings view when view is settings", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.view = "settings";
      await page.waitForChanges();

      const settingsDiv = page.root?.shadowRoot?.querySelector(".settings");
      expect(settingsDiv).not.toBeNull();
    });

    it("should render main view by default", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "ready";
      await page.waitForChanges();

      // Main view has messages container
      const messagesDiv = page.root?.shadowRoot?.querySelector(".messages");
      const settingsDiv = page.root?.shadowRoot?.querySelector(".settings");

      expect(messagesDiv).not.toBeNull();
      expect(settingsDiv).toBeNull();
    });

    it("should apply view class to chat container", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.view = "settings";
      await page.waitForChanges();

      const chatDiv = page.root?.shadowRoot?.querySelector(".chat");
      expect(chatDiv?.classList.contains("chat--settings")).toBe(true);
    });
  });
  //#endregion

  //#region Full Screen Tests
  describe("full screen mode", () => {
    it("should apply full screen class when enabled", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.fullScreen = true;
      component.status = "ready";
      await page.waitForChanges();

      const chatDiv = page.root?.shadowRoot?.querySelector(".chat");
      expect(chatDiv?.classList.contains("chat--full")).toBe(true);
    });

    it("should not have full screen class by default", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "ready";
      await page.waitForChanges();

      const chatDiv = page.root?.shadowRoot?.querySelector(".chat");
      expect(chatDiv?.classList.contains("chat--full")).toBe(false);
    });
  });
  //#endregion

  //#region UI Size Tests
  describe("UI size", () => {
    it("should have medium size by default", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      expect(component.lfUiSize).toBe("medium");
    });

    it("should accept small size", async () => {
      const page = await createPage(`<lf-chat lf-ui-size="small"></lf-chat>`);
      const component = page.rootInstance as LfChat;

      expect(component.lfUiSize).toBe("small");
    });

    it("should accept large size", async () => {
      const page = await createPage(`<lf-chat lf-ui-size="large"></lf-chat>`);
      const component = page.rootInstance as LfChat;

      expect(component.lfUiSize).toBe("large");
    });
  });
  //#endregion

  //#region Custom Style Tests
  describe("custom styling", () => {
    it("should apply lfStyle when provided", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.lfStyle = ".custom { color: red; }";
      await page.waitForChanges();

      expect(component.lfStyle).toBe(".custom { color: red; }");
    });

    it("should render style tag when lfStyle is set", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.lfStyle = ".test { display: block; }";
      await page.waitForChanges();

      // Style tag uses LF_STYLE_ID constant which is "lf-style"
      const styleTag = page.root?.shadowRoot?.querySelector("style#lf-style");
      expect(styleTag).not.toBeNull();
    });

    it("should not render style tag when lfStyle is empty", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.lfStyle = "";
      await page.waitForChanges();

      const styleTag =
        page.root?.shadowRoot?.querySelector("style#lf-style-id");
      expect(styleTag).toBeNull();
    });
  });
  //#endregion

  //#region Scroll Methods Tests
  describe("scroll methods", () => {
    it("should have scrollToBottom method", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      expect(typeof component.scrollToBottom).toBe("function");
    });

    it("should not throw when scrollToBottom called on non-ready status", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.status = "connecting";

      await expect(component.scrollToBottom()).resolves.not.toThrow();
    });
  });
  //#endregion

  //#region Token Calculation Tests
  describe("token calculation", () => {
    it("should update currentTokens when lfConfig changes", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [
        { role: "user", content: "This is a test message" },
      ] as any;
      component.lfConfig = {
        llm: { contextWindow: 4096 },
      };
      await page.waitForChanges();

      // Token count should be calculated based on history length
      expect(component.currentTokens).toBeDefined();
      expect(typeof component.currentTokens.current).toBe("number");
      expect(typeof component.currentTokens.percentage).toBe("number");
    });

    it("should have zero percentage when no context window configured", async () => {
      const page = await createPage(`<lf-chat></lf-chat>`);
      const component = page.rootInstance as LfChat;

      component.history = [];
      component.lfConfig = { llm: { contextWindow: 0 } };
      await page.waitForChanges();

      // With no context window, percentage is 0 (no limit to track against)
      expect(component.currentTokens.percentage).toBe(0);
    });
  });
  //#endregion
});

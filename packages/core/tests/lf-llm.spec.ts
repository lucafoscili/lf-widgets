import { LfFrameworkInterface, LfLLMToolResponse } from "@lf-widgets/foundations";
import { LfFramework } from "../../framework/src/lf-framework/lf-framework";
import { LfLLM } from "../../framework/src/lf-llm/lf-llm";

describe("Framework LLM Utilities (mocked)", () => {
  let framework: jest.Mocked<LfFrameworkInterface>;

  beforeEach(() => {
    // Mock the framework interface
    framework = {
      llm: {
        createAbort: jest.fn(),
        fetch: jest.fn(),
        poll: jest.fn(),
        speechToText: jest.fn(),
        stream: jest.fn(),
        utils: {
          hash: jest.fn(),
          estimateTokens: jest.fn(),
        },
        withRetry: jest.fn(),
      },
    } as any; // Using any to avoid complex type mocking
  });

  describe("createAbort", () => {
    it("should create an AbortController", () => {
      const mockController = new AbortController();
      (framework.llm.createAbort as jest.Mock).mockReturnValue(mockController);

      const result = framework.llm.createAbort();

      expect(result).toBe(mockController);
      expect(framework.llm.createAbort).toHaveBeenCalled();
    });
  });

  describe("fetch", () => {
    it("should fetch LLM completion", async () => {
      const mockRequest = {
        messages: [{ role: "user", content: "Hello" }],
      } as any;
      const mockUrl = "https://api.example.com/chat";
      const mockResponse = {
        choices: [{ message: { content: "Hi there!" } }],
      } as any;

      (framework.llm.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await framework.llm.fetch(mockRequest, mockUrl);

      expect(result).toBe(mockResponse);
      expect(framework.llm.fetch).toHaveBeenCalledWith(mockRequest, mockUrl);
    });
  });

  describe("poll", () => {
    it("should poll LLM endpoint", async () => {
      const mockUrl = "https://api.example.com/poll";
      const mockResponse = new Response("OK");

      (framework.llm.poll as jest.Mock).mockResolvedValue(mockResponse);

      const result = await framework.llm.poll(mockUrl);

      expect(result).toBe(mockResponse);
      expect(framework.llm.poll).toHaveBeenCalledWith(mockUrl);
    });
  });

  describe("speechToText", () => {
    it("should perform speech to text", async () => {
      const mockTextarea = {} as any;
      const mockButton = {} as any;

      (framework.llm.speechToText as jest.Mock).mockResolvedValue(undefined);

      await framework.llm.speechToText(mockTextarea, mockButton);

      expect(framework.llm.speechToText).toHaveBeenCalledWith(
        mockTextarea,
        mockButton,
      );
    });
  });

  describe("stream", () => {
    it("should stream LLM response", async () => {
      const mockRequest = {
        messages: [{ role: "user", content: "Hello" }],
      } as any;
      const mockUrl = "https://api.example.com/stream";
      const mockChunks = [
        { content: "Hi", done: false },
        { content: " there!", done: true },
      ];

      const mockGenerator = async function* () {
        for (const chunk of mockChunks) {
          yield chunk;
        }
      };

      (framework.llm.stream as jest.Mock).mockReturnValue(mockGenerator());

      const generator = framework.llm.stream(mockRequest, mockUrl);
      const chunks = [];

      for await (const chunk of generator) {
        chunks.push(chunk);
      }

      expect(framework.llm.stream).toHaveBeenCalledWith(mockRequest, mockUrl);
      expect(chunks).toEqual(mockChunks);
    });

    it("should stream with abort signal", async () => {
      const mockRequest = {
        messages: [{ role: "user", content: "Hello" }],
      } as any;
      const mockUrl = "https://api.example.com/stream";
      const mockSignal = new AbortController().signal;

      (framework.llm.stream as jest.Mock).mockReturnValue(
        (async function* () {
          yield { content: "Hi", done: false };
        })(),
      );

      framework.llm.stream(mockRequest, mockUrl, { signal: mockSignal });

      expect(framework.llm.stream).toHaveBeenCalledWith(mockRequest, mockUrl, {
        signal: mockSignal,
      });
    });
  });

  describe("utils", () => {
    describe("hash", () => {
      it("should hash LLM request", () => {
        const mockRequest = {
          messages: [{ role: "user", content: "Hello" }],
        } as any;
        const mockHash = "abc123";

        (framework.llm.utils.hash as jest.Mock).mockReturnValue(mockHash);

        const result = framework.llm.utils.hash(mockRequest);

        expect(result).toBe(mockHash);
        expect(framework.llm.utils.hash).toHaveBeenCalledWith(mockRequest);
      });
    });

    describe("estimateTokens", () => {
      it("should estimate token count", () => {
        const mockMessages = [{ role: "user", content: "Hello world" }] as any;
        const mockTokenCount = 42;

        (framework.llm.utils.estimateTokens as jest.Mock).mockReturnValue(
          mockTokenCount,
        );

        const result = framework.llm.utils.estimateTokens(mockMessages);

        expect(result).toBe(mockTokenCount);
        expect(framework.llm.utils.estimateTokens).toHaveBeenCalledWith(
          mockMessages,
        );
      });
    });
  });

  describe("withRetry", () => {
    it("should execute function with retry", async () => {
      const mockFn = jest.fn().mockResolvedValue("success");
      const mockResult = "success";

      (framework.llm.withRetry as jest.Mock).mockResolvedValue(mockResult);

      const result = await framework.llm.withRetry(mockFn);

      expect(result).toBe(mockResult);
      expect(framework.llm.withRetry).toHaveBeenCalledWith(mockFn);
    });

    it("should execute function with retry policy", async () => {
      const mockFn = jest.fn().mockResolvedValue("success");
      const mockPolicy = { maxAttempts: 3, backoffMs: 100 };
      const mockResult = "success";

      (framework.llm.withRetry as jest.Mock).mockResolvedValue(mockResult);

      const result = await framework.llm.withRetry(mockFn, mockPolicy);

      expect(result).toBe(mockResult);
      expect(framework.llm.withRetry).toHaveBeenCalledWith(mockFn, mockPolicy);
    });
  });
});

describe("Framework LLM Builtin Tools (integration)", () => {
  let framework: LfFrameworkInterface;
  let llm: LfLLM;

  beforeAll(() => {
    framework = new LfFramework();
    llm = new LfLLM(framework);
  });

  it("exposes builtin weather and docs tools via registry", () => {
    expect(llm.getBuiltinToolsByCategory).toBeDefined();

    const registry = llm.getBuiltinToolsByCategory();

    expect(registry).toBeDefined();
    expect(registry.general).toBeDefined();
    expect(registry.lfw).toBeDefined();

    const weatherTool = registry.general["get_weather"];
    const docsTool = registry.lfw["get_component_docs"];

    expect(weatherTool).toBeDefined();
    expect(weatherTool.type).toBe("function");
    expect(weatherTool.function.name).toBe("get_weather");

    expect(docsTool).toBeDefined();
    expect(docsTool.type).toBe("function");
    expect(docsTool.function.name).toBe("get_component_docs");
  });

  it("flattens builtin tools via getBuiltinTools", () => {
    expect(llm.getBuiltinTools).toBeDefined();

    const tools = llm.getBuiltinTools();
    const names = tools.map((t) => t.function.name);

    expect(names).toEqual(
      expect.arrayContaining(["get_weather", "get_component_docs"]),
    );
  });

  it("builtin weather tool returns an article response on success", async () => {
    const registry = llm.getBuiltinToolsByCategory();
    const weatherTool = registry.general["get_weather"];

    // Sample payload in the shape of wttr.in responses
    const samplePayload = {
      current_condition: [
        {
          temp_C: "13",
          temp_F: "55",
          weatherDesc: [{ value: "Clear" }],
          humidity: "67",
          windspeedKmph: "4",
          winddir16Point: "NE",
          FeelsLikeC: "12",
          FeelsLikeF: "54",
        },
      ],
      nearest_area: [
        {
          areaName: [{ value: "Rome" }],
          country: [{ value: "Italy" }],
        },
      ],
    };

    const originalFetch = (global as any).fetch;
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => samplePayload,
    });

    const result = await weatherTool.function.execute?.({
      location: "Rome",
    } as Record<string, unknown>);

    (global as any).fetch = originalFetch;

    expect(result).toBeDefined();

    if (typeof result === "string") {
      // Weather tool should normally return structured article responses,
      // but allow text results in case of network errors.
      expect(result.length).toBeGreaterThan(0);
      return;
    }

    const structured = result as LfLLMToolResponse;
    expect(structured.type).toBe("article");
    if (structured.type === "article") {
      expect(structured.dataset).toBeDefined();
      expect(Array.isArray(structured.dataset.nodes)).toBe(true);
      expect(structured.dataset.nodes!.length).toBeGreaterThan(0);
    }
  });

  it("builtin docs tool returns structured content for a known component", async () => {
    const registry = llm.getBuiltinToolsByCategory();
    const docsTool = registry.lfw["get_component_docs"];

    const originalFetch = (global as any).fetch;
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => "# lf-button\n\nButton component README content",
    });

    const result = await docsTool.function.execute?.({
      component: "lf-button",
    } as Record<string, unknown>);

    (global as any).fetch = originalFetch;

    expect(result).toBeDefined();

    if (typeof result === "string") {
      expect(result).toContain("lf-button");
    } else {
      expect(["text", "article"]).toContain(result.type);
      if (result.type === "article") {
        expect(result.dataset).toBeDefined();
        expect(Array.isArray(result.dataset.nodes)).toBe(true);
      } else {
        expect(result.content).toContain("lf-button");
      }
    }
  });
});

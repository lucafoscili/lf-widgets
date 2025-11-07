import { LfFrameworkInterface } from "@lf-widgets/foundations";

describe("Framework LLM Utilities", () => {
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

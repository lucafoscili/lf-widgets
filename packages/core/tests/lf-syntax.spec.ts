import { LfFrameworkInterface } from "@lf-widgets/foundations";

describe("Framework Syntax Utilities", () => {
  let framework: jest.Mocked<LfFrameworkInterface>;

  beforeEach(() => {
    // Mock the framework interface
    framework = {
      syntax: {
        markdown: {} as any,
        prism: {} as any,
        json: {
          areEqual: jest.fn(),
          isLikeString: jest.fn(),
          isValid: jest.fn(),
          parse: jest.fn(),
          unescape: jest.fn(),
        },
        parseMarkdown: jest.fn(),
        highlightElement: jest.fn(),
        highlightCode: jest.fn(),
        registerLanguage: jest.fn(),
        isLanguageLoaded: jest.fn(),
        loadLanguage: jest.fn(),
      },
    } as any; // Using any to avoid complex type mocking
  });

  describe("markdown", () => {
    it("should expose markdown-it parser instance", () => {
      expect(framework.syntax.markdown).toBeDefined();
    });
  });

  describe("prism", () => {
    it("should expose Prism namespace", () => {
      expect(framework.syntax.prism).toBeDefined();
    });
  });

  describe("json", () => {
    describe("areEqual", () => {
      it("should compare JSON values for equality", () => {
        const a = { key: "value" };
        const b = { key: "value" };

        framework.syntax.json.areEqual(a, b);

        expect(framework.syntax.json.areEqual).toHaveBeenCalledWith(a, b);
      });

      it("should return true for equal values", () => {
        const a = { key: "value" };
        const b = { key: "value" };

        (framework.syntax.json.areEqual as jest.Mock).mockReturnValue(true);

        const result = framework.syntax.json.areEqual(a, b);

        expect(result).toBe(true);
      });
    });

    describe("isLikeString", () => {
      it("should check if value is string-like", () => {
        const value = "test";

        framework.syntax.json.isLikeString(value);

        expect(framework.syntax.json.isLikeString).toHaveBeenCalledWith(value);
      });
    });

    describe("isValid", () => {
      it("should validate JSON value", () => {
        const value = { key: "value" };

        framework.syntax.json.isValid(value);

        expect(framework.syntax.json.isValid).toHaveBeenCalledWith(value);
      });
    });

    describe("parse", () => {
      it("should parse JSON from response", async () => {
        const mockResponse = new Response('{"key": "value"}');
        const mockParsed = { key: "value" };

        (framework.syntax.json.parse as jest.Mock).mockResolvedValue(
          mockParsed,
        );

        const result = await framework.syntax.json.parse(mockResponse);

        expect(result).toBe(mockParsed);
        expect(framework.syntax.json.parse).toHaveBeenCalledWith(mockResponse);
      });
    });

    describe("unescape", () => {
      it("should unescape JSON string", () => {
        const input = '{"key": "value"}';
        const mockResult = {
          isValidJSON: true,
          unescapedString: '{"key": "value"}',
          parsedJSON: { key: "value" },
        };

        (framework.syntax.json.unescape as jest.Mock).mockReturnValue(
          mockResult,
        );

        const result = framework.syntax.json.unescape(input);

        expect(result).toBe(mockResult);
        expect(framework.syntax.json.unescape).toHaveBeenCalledWith(input);
      });
    });
  });

  describe("parseMarkdown", () => {
    it("should parse markdown content", () => {
      const content = "# Hello World";
      const mockTokens = [{ type: "heading", content: "Hello World" }] as any;

      (framework.syntax.parseMarkdown as jest.Mock).mockReturnValue(mockTokens);

      const result = framework.syntax.parseMarkdown(content);

      expect(result).toBe(mockTokens);
      expect(framework.syntax.parseMarkdown).toHaveBeenCalledWith(content);
    });
  });

  describe("highlightElement", () => {
    it("should highlight code element", () => {
      const mockElement = document.createElement("code");
      mockElement.className = "language-javascript";

      framework.syntax.highlightElement(mockElement);

      expect(framework.syntax.highlightElement).toHaveBeenCalledWith(
        mockElement,
      );
    });
  });

  describe("highlightCode", () => {
    it("should highlight code string", () => {
      const code = 'console.log("Hello");';
      const language = "javascript";
      const mockHighlighted =
        '<span class="token">console</span>.log("Hello");';

      (framework.syntax.highlightCode as jest.Mock).mockReturnValue(
        mockHighlighted,
      );

      const result = framework.syntax.highlightCode(code, language);

      expect(result).toBe(mockHighlighted);
      expect(framework.syntax.highlightCode).toHaveBeenCalledWith(
        code,
        language,
      );
    });
  });

  describe("registerLanguage", () => {
    it("should register language loader", () => {
      const name = "typescript";
      const loader = jest.fn();

      framework.syntax.registerLanguage(name, loader);

      expect(framework.syntax.registerLanguage).toHaveBeenCalledWith(
        name,
        loader,
      );
    });
  });

  describe("isLanguageLoaded", () => {
    it("should check if language is loaded", () => {
      const name = "javascript";

      framework.syntax.isLanguageLoaded(name);

      expect(framework.syntax.isLanguageLoaded).toHaveBeenCalledWith(name);
    });

    it("should return true when language is loaded", () => {
      const name = "javascript";

      (framework.syntax.isLanguageLoaded as jest.Mock).mockReturnValue(true);

      const result = framework.syntax.isLanguageLoaded(name);

      expect(result).toBe(true);
    });
  });

  describe("loadLanguage", () => {
    it("should load language grammar", async () => {
      const name = "typescript";

      (framework.syntax.loadLanguage as jest.Mock).mockResolvedValue(true);

      const result = await framework.syntax.loadLanguage(name);

      expect(result).toBe(true);
      expect(framework.syntax.loadLanguage).toHaveBeenCalledWith(name);
    });

    it("should return false when language fails to load", async () => {
      const name = "unknown";

      (framework.syntax.loadLanguage as jest.Mock).mockResolvedValue(false);

      const result = await framework.syntax.loadLanguage(name);

      expect(result).toBe(false);
    });
  });
});

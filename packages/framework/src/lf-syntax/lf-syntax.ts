import {
  LfFrameworkInterface,
  LfSyntaxInterface,
} from "@lf-widgets/foundations";
import MarkdownIt from "markdown-it";
import * as Prism from "prismjs";
import {
  areJSONEqual,
  isJSONLikeString,
  isValidJSON,
  parseJson,
  unescapeJson,
} from "./helpers.json";

type SyntaxLoaderModule = Record<string, (prism: typeof Prism) => void>;

const LANGUAGE_LOADERS = {
  css: () =>
    import("./languages/prism.css.highlight") as Promise<SyntaxLoaderModule>,
  javascript: () =>
    import(
      "./languages/prism.javascript.highlight"
    ) as Promise<SyntaxLoaderModule>,
  json: () =>
    import("./languages/prism.json.highlight") as Promise<SyntaxLoaderModule>,
  jsx: () =>
    import("./languages/prism.jsx.highlight") as Promise<SyntaxLoaderModule>,
  markdown: () =>
    import(
      "./languages/prism.markdown.highlight"
    ) as Promise<SyntaxLoaderModule>,
  markup: () =>
    import("./languages/prism.markup.highlight") as Promise<SyntaxLoaderModule>,
  python: () =>
    import("./languages/prism.python.highlight") as Promise<SyntaxLoaderModule>,
  regex: () =>
    import("./languages/prism.regex.highlight") as Promise<SyntaxLoaderModule>,
  scss: () =>
    import("./languages/prism.scss.highlight") as Promise<SyntaxLoaderModule>,
  tsx: () =>
    import("./languages/prism.tsx.highlight") as Promise<SyntaxLoaderModule>,
  typescript: () =>
    import(
      "./languages/prism.typescript.highlight"
    ) as Promise<SyntaxLoaderModule>,
} as const;

type SyntaxLanguageKey = keyof typeof LANGUAGE_LOADERS;

const LANGUAGE_EXPORT_NAMES: Record<SyntaxLanguageKey, string> = {
  css: "LF_SYNTAX_CSS",
  javascript: "LF_SYNTAX_JAVASCRIPT",
  json: "LF_SYNTAX_JSON",
  jsx: "LF_SYNTAX_JSX",
  markdown: "LF_SYNTAX_MARKDOWN",
  markup: "LF_SYNTAX_MARKUP",
  python: "LF_SYNTAX_PYTHON",
  regex: "LF_SYNTAX_REGEX",
  scss: "LF_SYNTAX_SCSS",
  tsx: "LF_SYNTAX_TSX",
  typescript: "LF_SYNTAX_TYPESCRIPT",
};

const LANGUAGE_ALIASES: Record<string, SyntaxLanguageKey> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  md: "markdown",
  html: "markup",
  htm: "markup",
};

/**
 * LfSyntax provides centralized syntax processing for both markdown parsing
 * and code syntax highlighting across the framework.
 *
 * Features:
 * - Single MarkdownIt instance for consistent markdown parsing
 * - Single Prism instance for code highlighting
 * - Lazy language loading with deduplication
 * - Memory-efficient singleton pattern
 *
 * @example
 * ```typescript
 * // Parse markdown
 * const tokens = syntax.parseMarkdown("**bold** text");
 *
 * // Register and highlight code
 * syntax.registerLanguage("typescript", TYPESCRIPT_LOADER);
 * syntax.highlightElement(codeElement);
 * ```
 */
export class LfSyntax implements LfSyntaxInterface {
  #LF_MANAGER: LfFrameworkInterface;
  #markdown: MarkdownIt;
  #prism: typeof Prism;
  #loadedLanguages: Set<string> = new Set();

  constructor(lfFramework: LfFrameworkInterface) {
    this.#LF_MANAGER = lfFramework;

    // Initialize markdown parser with sensible defaults
    this.#markdown = new MarkdownIt({
      html: false, // Don't allow raw HTML for security
      linkify: false, // Don't auto-convert URLs (explicit links only)
      typographer: false, // Don't replace quotes/dashes
    });

    // Store Prism reference
    this.#prism = Prism;
  }

  //#region JSON
  json = {
    areEqual: areJSONEqual,
    isLikeString: isJSONLikeString,
    isValid: isValidJSON,
    parse: parseJson,
    unescape: unescapeJson,
  };
  //#endregion

  //#region Markdown
  /**
   * Parse markdown content into an array of tokens using the markdown-it parser.
   *
   * @param content - The markdown string to parse
   * @returns Array of Token objects representing the parsed structure
   *
   * @example
   * ```typescript
   * const tokens = syntax.parseMarkdown("# Hello\n\n**World**");
   * // Returns tokens for heading and paragraph with bold text
   * ```
   */
  parseMarkdown = (content: string): ReturnType<MarkdownIt["parse"]> => {
    return this.#markdown.parse(content, {});
  };

  /**
   * Get the underlying MarkdownIt instance for advanced configuration or plugin usage.
   *
   * @returns The MarkdownIt parser instance
   *
   * @example
   * ```typescript
   * const md = syntax.markdown;
   * md.use(somePlugin);
   * ```
   */
  get markdown(): MarkdownIt {
    return this.#markdown;
  }
  //#endregion

  //#region Syntax Highlighting
  /**
   * Highlight a DOM element containing code using Prism.
   * The element should have a `language-*` class and contain the code to highlight.
   *
   * @param element - The HTML element to highlight (typically <pre> or <code>)
   *
   * @example
   * ```typescript
   * const preElement = document.querySelector('pre.language-javascript');
   * syntax.highlightElement(preElement);
   * ```
   */
  highlightElement = (element: HTMLElement): void => {
    this.#prism.highlightElement(element);
  };

  /**
   * Highlight a code string directly and return the HTML string with syntax highlighting.
   *
   * @param code - The code string to highlight
   * @param language - The language identifier (e.g., 'javascript', 'python')
   * @returns HTML string with syntax highlighting markup
   *
   * @remarks
   * Returns the original code if the language grammar is not loaded.
   * Use `registerLanguage()` to load language grammars before highlighting.
   *
   * @example
   * ```typescript
   * const highlighted = syntax.highlightCode('const x = 5;', 'javascript');
   * // Returns: '<span class="token keyword">const</span> x <span class="token operator">=</span> ...'
   * ```
   */
  highlightCode = (code: string, language: string): string => {
    const grammar = this.#prism.languages[language];
    if (!grammar) {
      const { debug } = this.#LF_MANAGER;
      debug.logs.new(
        this.#LF_MANAGER,
        `[LfSyntax] Language "${language}" not loaded for syntax highlighting`,
        "warning",
      );
      return code;
    }
    return this.#prism.highlight(code, grammar, language);
  };

  /**
   * Register a language module for syntax highlighting.
   * Languages are loaded lazily and cached to prevent duplicate registration.
   *
   * @param name - The language identifier (e.g., 'typescript', 'python')
   * @param loader - Function that registers the language grammar with Prism
   *
   * @remarks
   * If the language is already loaded, this is a no-op.
   * Language loaders typically come from Prism language modules.
   *
   * @example
   * ```typescript
   * syntax.registerLanguage('typescript', (prism) => {
   *   // Language grammar registration code
   * });
   * ```
   */
  registerLanguage = (
    name: string,
    loader: (prism: typeof Prism) => void,
  ): void => {
    if (!this.#loadedLanguages.has(name)) {
      loader(this.#prism);
      if (this.#prism.languages[name]) {
        this.#loadedLanguages.add(name);
      } else {
        const { debug } = this.#LF_MANAGER;
        debug.logs.new(
          this.#LF_MANAGER,
          `[LfSyntax] Failed to register Prism language "${name}" (loader did not define grammar)`,
          "warning",
        );
      }
    }
  };

  /**
   * Check if a language grammar has been registered.
   *
   * @param name - The language identifier to check
   * @returns true if the language is loaded, false otherwise
   *
   * @example
   * ```typescript
   * if (!syntax.isLanguageLoaded('python')) {
   *   syntax.registerLanguage('python', PYTHON_LOADER);
   * }
   * ```
   */
  isLanguageLoaded = (name: string): boolean => {
    const normalized = (name ?? "").toLowerCase();
    if (this.#loadedLanguages.has(normalized)) {
      return true;
    }
    const canonical = LANGUAGE_ALIASES[normalized];
    if (canonical) {
      return this.#loadedLanguages.has(canonical);
    }
    return this.#loadedLanguages.has(normalized);
  };

  loadLanguage = async (name: string): Promise<boolean> => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }

    const normalized = (name ?? "").toLowerCase();

    if (!normalized) {
      return false;
    }

    const canonical =
      LANGUAGE_ALIASES[normalized] ??
      ((normalized as SyntaxLanguageKey) in LANGUAGE_LOADERS
        ? (normalized as SyntaxLanguageKey)
        : undefined);

    if (!canonical) {
      this.#LF_MANAGER.debug.logs.new(
        this.#LF_MANAGER,
        `[LfSyntax] No loader defined for language "${normalized}".`,
        "warning",
      );
      return false;
    }

    if (this.isLanguageLoaded(canonical)) {
      if (canonical !== normalized) {
        this.#loadedLanguages.add(normalized);
      }
      return true;
    }

    try {
      const module = await LANGUAGE_LOADERS[canonical]();
      const exportName = LANGUAGE_EXPORT_NAMES[canonical];
      const loader = module?.[exportName];

      if (typeof loader === "function") {
        this.registerLanguage(canonical, loader);
        if (canonical !== normalized) {
          this.#loadedLanguages.add(normalized);
        }
        return this.isLanguageLoaded(canonical);
      }

      this.#LF_MANAGER.debug.logs.new(
        this.#LF_MANAGER,
        `[LfSyntax] Loader for language "${canonical}" did not expose "${exportName}".`,
        "warning",
      );
    } catch (error) {
      this.#LF_MANAGER.debug.logs.new(
        this.#LF_MANAGER,
        `[LfSyntax] Failed to load language "${canonical}": ${error}`,
        "error",
      );
    }

    return false;
  };

  /**
   * Get the underlying Prism instance for advanced usage or plugin integration.
   *
   * @returns The Prism syntax highlighter instance
   *
   * @example
   * ```typescript
   * const prism = syntax.prism;
   * // Use Prism API directly
   * ```
   */
  get prism(): typeof Prism {
    return this.#prism;
  }
  //#endregion
}

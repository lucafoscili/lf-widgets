import { LfFrameworkInterface } from "@lf-widgets/foundations";
import MarkdownIt from "markdown-it";
import * as Prism from "prismjs";

// Forward declaration for interface (will be exported from foundations)
interface LfSyntaxInterface {
  parseMarkdown: (content: string) => ReturnType<MarkdownIt["parse"]>;
  readonly markdown: MarkdownIt;
  highlightElement: (element: HTMLElement) => void;
  highlightCode: (code: string, language: string) => string;
  registerLanguage: (
    name: string,
    loader: (prism: typeof Prism) => void,
  ) => void;
  isLanguageLoaded: (name: string) => boolean;
  readonly prism: typeof Prism;
}

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
      this.#loadedLanguages.add(name);
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
    return this.#loadedLanguages.has(name);
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

import type MarkdownIt from "markdown-it";
import type * as PrismNamespace from "prismjs";
export interface LfSyntaxUnescapeJSONPayload {
  /** Indicates whether the unescaped string is valid JSON. */
  isValidJSON: boolean;
  /** The unescaped string representation. */
  unescapedString: string;
  /** The parsed JSON object, if applicable; otherwise undefined. */
  parsedJSON?: Record<string, unknown>;
}
/**
 * Tokens representing the markdown inside the syntax highlighting utilities.
 */
export type MarkdownToken = ReturnType<MarkdownIt["parse"]>[number];
/**
 * Primary interface exposing the syntax highlighting utilities.
 */
export interface LfSyntaxInterface {
  /** Shared markdown-it parser instance used across the framework. */
  readonly markdown: MarkdownIt;
  /** Prism namespace used to register languages and run highlighting. */
  readonly prism: typeof PrismNamespace;
  /** JSON utility functions for syntax processing. */
  json: {
    areEqual: (a: unknown, b: unknown) => boolean;
    isLikeString: (value: unknown) => value is string;
    isValid: (value: unknown) => boolean;
    parse: <T>(response: Response) => Promise<T | Record<string, unknown>>;
    unescape: (input: any) => LfSyntaxUnescapeJSONPayload;
  };
  /** Parses markdown into tokens using the shared markdown-it parser. */
  parseMarkdown: (content: string) => MarkdownToken[];
  /** Highlights a DOM element containing code (expects `language-*` class). */
  highlightElement: (element: HTMLElement) => void;
  /** Highlights raw code and returns HTML with Prism markup. */
  highlightCode: (code: string, language: string) => string;
  /** Registers a Prism language loader; subsequent calls become no-ops once loaded. */
  registerLanguage: (
    name: string,
    loader: (prism: typeof PrismNamespace) => void,
  ) => void;
  /** Checks whether a language grammar has already been loaded. */
  isLanguageLoaded: (name: string) => boolean;
  /** Lazily loads a language grammar by name if a loader is available. */
  loadLanguage: (name: string) => Promise<boolean>;
}

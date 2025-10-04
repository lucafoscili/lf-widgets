import type MarkdownIt from "markdown-it";
import type * as PrismNamespace from "prismjs";
/**
 * Tokens representing the markdown inside the syntax highlighting utilities.
 */
export type MarkdownToken = ReturnType<MarkdownIt["parse"]>[number];
/**
 * Primary interface exposing the syntax highlighting utilities.
 */
export interface LfSyntaxInterface {
  readonly markdown: MarkdownIt;
  readonly prism: typeof PrismNamespace;
  parseMarkdown: (content: string) => MarkdownToken[];
  highlightElement: (element: HTMLElement) => void;
  highlightCode: (code: string, language: string) => string;
  registerLanguage: (
    name: string,
    loader: (prism: typeof PrismNamespace) => void,
  ) => void;
  isLanguageLoaded: (name: string) => boolean;
  loadLanguage: (name: string) => Promise<boolean>;
}

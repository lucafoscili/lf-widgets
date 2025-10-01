import type MarkdownIt from "markdown-it";
import type * as PrismNamespace from "prismjs";

export type MarkdownToken = ReturnType<MarkdownIt["parse"]>[number];

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
}

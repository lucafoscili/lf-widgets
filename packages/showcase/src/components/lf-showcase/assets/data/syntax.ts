import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Syntax";

export const getSyntaxFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "parseMarkdown",
      {
        code: `const tokens = syntax.parseMarkdown("**Hello** _world_!"); 
// Returns an array of Token objects from markdown-it`,
        description:
          "Parse markdown content into an array of tokens using the markdown-it parser.",
      },
    ],
    [
      "markdown",
      {
        code: `const md = syntax.markdown; 
md.use(somePlugin); 
// Access the underlying MarkdownIt instance for advanced configuration`,
        description:
          "Get the underlying MarkdownIt instance for advanced configuration or plugin usage.",
      },
    ],
    [
      "highlightElement",
      {
        code: `const preElement = document.querySelector('pre.language-javascript'); 
syntax.highlightElement(preElement); 
// Applies syntax highlighting to the element`,
        description:
          "Highlight a DOM element containing code using Prism. The element should have a language-* class.",
      },
    ],
    [
      "highlightCode",
      {
        code: `const highlighted = syntax.highlightCode('const x = 5;', 'javascript'); 
// Returns: '<span class="token keyword">const</span> x <span class="token operator">=</span> ...'`,
        description:
          "Highlight a code string directly and return the HTML string with syntax highlighting markup.",
      },
    ],
    [
      "registerLanguage",
      {
        code: `syntax.registerLanguage('typescript', (prism) => { 
  // Language grammar registration code 
}); 
// Registers TypeScript language for syntax highlighting`,
        description:
          "Register a language module for syntax highlighting. Languages are loaded lazily and cached.",
      },
    ],
    [
      "isLanguageLoaded",
      {
        code: `if (!syntax.isLanguageLoaded('python')) { 
  syntax.registerLanguage('python', PYTHON_LOADER); 
} 
// Check before loading to avoid duplicates`,
        description:
          "Check if a language grammar has been registered to avoid duplicate loading.",
      },
    ],
    [
      "prism",
      {
        code: `const prism = syntax.prism; 
// Use Prism API directly for advanced use cases`,
        description:
          "Get the underlying Prism instance for advanced usage or plugin integration.",
      },
    ],
  ]);
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: FRAMEWORK_NAME,
        children: [
          {
            id: DOC_IDS.section,
            value: "Overview",
            children: [
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "LfSyntax",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " provides centralized syntax processing for both markdown parsing and code syntax highlighting.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "It offers a single MarkdownIt instance for consistent markdown parsing and a single Prism instance for code highlighting with lazy language loading.",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
            ],
          },
          {
            id: DOC_IDS.section,
            value: "Features",
            children: [
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "Markdown Parsing:",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " Single MarkdownIt instance for consistent parsing across all components",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "Syntax Highlighting:",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " Single Prism instance with lazy language loading and deduplication",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "Performance:",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " Memory-efficient singleton pattern prevents duplicate parser instances",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "Extensibility:",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " Access underlying MarkdownIt and Prism instances for plugins and advanced configuration",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
            ],
          },
          {
            id: DOC_IDS.section,
            value: "API",
            children: Array.from(CODE.keys()).map((key) =>
              PARAGRAPH_FACTORY.api(
                key,
                CODE.get(key)?.description ?? "",
                CODE.get(key)?.code ?? "",
              ),
            ),
          },
        ],
      },
    ],
  };
  //#endregion

  return {
    documentation,
  };
};

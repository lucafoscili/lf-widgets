import {
  LfFrameworkInterface,
  LfLLMToolHandlers,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";

//#region Docs
/**
 * Creates the handler function for the component docs tool.
 * Fetches README from GitHub and returns an article with the markdown.
 */
export const createDocsToolHandler = (
  framework: LfFrameworkInterface,
): LfLLMToolHandlers[string] => {
  const buildArticleFromReadme = async (
    componentName: string,
  ): Promise<LfLLMToolResponse> => {
    const normalizedTag = componentName.startsWith("lf-")
      ? componentName
      : `lf-${componentName.replace(/^lf-/, "")}`;

    const path = `packages/core/src/components/${normalizedTag}/readme.md`;
    const url = `https://raw.githubusercontent.com/lucafoscili/lf-widgets/main/${path}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return {
          type: "text",
          content: `Documentation for "${normalizedTag}" is not available from GitHub README (status: ${response.status}).`,
        };
      }

      const markdown = await response.text();
      const content = `Here is the official README.md for the ${normalizedTag} component.\n\n${markdown}`;

      const article = framework.data.article;
      const builder = article.builder.create({
        id: "docs-article",
      });

      builder.section.add.withLeaf({
        sectionId: "docs-readme",
        sectionTitle: "",
        text: `Here's the official documentation for the **${normalizedTag}** component! 📄`,
        layout: "stack",
        leaf: article.shapes.accordionCodeBlock({
          id: "docs-readme-accordion",
          title: "README.md",
          icon: "file",
          language: "markdown",
          code: markdown,
        }),
      });

      const dataset = builder.getDataset();

      return {
        type: "article",
        content,
        dataset,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? "Unknown");
      return {
        type: "text",
        content: `Error fetching GitHub README for "${normalizedTag}": ${message}`,
      };
    }
  };
  //#endregion

  return async (args: Record<string, unknown>): Promise<LfLLMToolResponse> => {
    const rawComponent = args.component;
    const componentName =
      typeof rawComponent === "string" ? rawComponent.trim() : "";

    try {
      if (!componentName) {
        return {
          type: "text",
          content:
            "Please provide a specific lf-widgets component tag (e.g. 'lf-button', 'lf-chat'). I will load its README.md from GitHub and base the answer strictly on that content.",
        };
      }

      return await buildArticleFromReadme(componentName);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? "Unknown");
      return {
        type: "text",
        content: `Error fetching documentation: ${message}`,
      };
    }
  };
};
//#endregion

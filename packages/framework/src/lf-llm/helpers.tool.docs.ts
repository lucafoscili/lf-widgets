import {
  LfFrameworkInterface,
  LfLLMTool,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";

export const createComponentDocsTool = (
  framework: LfFrameworkInterface,
): LfLLMTool => {
  //#region Article
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
        title: normalizedTag,
      });

      builder.section.add.withLeaf({
        sectionId: "docs-readme",
        sectionTitle: "README.md",
        text: "",
        layout: "stack",
        leaf: article.shapes.codeBlock({
          id: "docs-readme",
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

  //#region Execute
  const execute = async (
    args: Record<string, unknown>,
  ): Promise<LfLLMToolResponse> => {
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
  //#endregion

  return {
    type: "function",
    function: {
      name: "get_component_docs",
      description: [
        "Retrieve authoritative documentation for an lf-widgets web component.",
        "Always use this tool whenever the user asks about lf-widgets components.",
        "If documentation cannot be fetched, clearly say that docs are unavailable instead of fabricating details.",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          component: {
            type: "string",
            description:
              "Component tag to query (e.g. 'lf-button', 'lf-chat'). Leave empty for a high-level framework overview.",
          },
        },
      },
      execute,
    },
  };
};

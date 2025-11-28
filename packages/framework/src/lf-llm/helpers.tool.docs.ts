import {
  LfFrameworkInterface,
  LfLLMTool,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";

/**
 * Creates the builtin `get_component_docs` tool. It reads from the generated
 * doc.json metadata (served by the host application) and returns either a
 * short text summary or a richer article dataset with overview + usage.
 */
export const createComponentDocsTool = (
  framework: LfFrameworkInterface,
): LfLLMTool => {
  const execute = async (
    args: Record<string, unknown>,
  ): Promise<LfLLMToolResponse> => {
    const rawComponent = args.component;
    const componentName =
      typeof rawComponent === "string" ? rawComponent.trim() : "";

    try {
      const response = await fetch("/build/doc.json");
      if (!response.ok) {
        return {
          type: "text",
          content: `Documentation fetch failed. The doc.json file might not be available. Status: ${response.status}`,
        };
      }

      const doc = (await response.json()) as any;
      const components: any[] = Array.isArray(doc.components)
        ? doc.components
        : [];

      if (!componentName) {
        const count = components.length;
        const tags = components.map((c) => c.tag).join(", ") || "none";

        const summaryLines = [
          "lf-widgets Framework Overview:",
          `- Total Components: ${count}`,
          `- Available Components: ${tags}`,
          "",
          "Ask about a specific component (e.g. 'lf-button', 'lf-chat') for detailed information.",
        ];

        return {
          type: "text",
          content: summaryLines.join("\n"),
        };
      }

      const tagCandidates = [
        componentName,
        `lf-${componentName.replace(/^lf-/, "")}`,
      ];
      const comp =
        components.find((c) => tagCandidates.includes(c.tag)) ?? null;

      if (!comp) {
        const available = components.map((c) => c.tag).join(", ");
        return {
          type: "text",
          content: `Component "${componentName}" not found. Available components: ${available}`,
        };
      }

      const tag = String(comp.tag);
      const overview =
        typeof comp.overview === "string" && comp.overview.length > 0
          ? comp.overview
          : "No description available.";

      const summary = `${tag}: ${overview}`;

      const article = framework.data.article;
      const builder = article.builder.create({
        id: "docs-article",
        title: tag,
      });

      const section = builder.addSection({
        id: "docs-section",
        title: "Overview & usage",
      });

      builder.addParagraph(section.id, {
        id: "docs-overview",
        text: overview,
      });

      builder.addLeaf({
        sectionId: section.id,
        node: article.shapes.codeBlock({
          id: "docs-usage",
          language: "html",
          code: `<${tag}></${tag}>`,
        }),
      });

      const dataset = builder.getDataset();

      return {
        type: "article",
        content: summary,
        dataset,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error ?? "Unknown");
      return {
        type: "text",
        content: `Error fetching documentation: ${message}`,
      };
    }
  };

  return {
    type: "function",
    function: {
      name: "get_component_docs",
      description:
        "Retrieve documentation for an lf-widgets component using the generated doc.json metadata.",
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

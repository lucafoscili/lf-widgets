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
  const fetchDocJson = async (): Promise<any | null> => {
    try {
      const response = await fetch("/build/doc.json");
      if (!response.ok) {
        return null;
      }

      const doc = (await response.json()) as any;
      return doc && typeof doc === "object" ? doc : null;
    } catch {
      return null;
    }
  };

  const buildArticleFromMeta = (
    tag: string,
    overview: string,
  ): LfLLMToolResponse => {
    const summary = `${tag}: ${overview}`;

    const article = framework.data.article;
    const builder = article.builder.create({
      id: "docs-article",
      title: tag,
    });

    builder.addSectionWithLeaf({
      sectionId: "docs-section",
      sectionTitle: "Overview & usage",
      text: overview,
      layout: "stack",
      leaf: article.shapes.codeBlock({
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
  };

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
      const lines = markdown.split(/\r?\n/);
      const firstNonEmpty = lines.find((line) => line.trim().length > 0) || "";
      const cleanedTitle = firstNonEmpty.replace(/^#+\s*/, "").trim();

      const summary =
        cleanedTitle.length > 0
          ? `${normalizedTag} README: ${cleanedTitle}`
          : `${normalizedTag}: README.md loaded from GitHub.`;

      const article = framework.data.article;
      const builder = article.builder.create({
        id: "docs-article",
        title: normalizedTag,
      });

      builder.addSectionWithLeaf({
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
        content: summary,
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

  const execute = async (
    args: Record<string, unknown>,
  ): Promise<LfLLMToolResponse> => {
    const rawComponent = args.component;
    const componentName =
      typeof rawComponent === "string" ? rawComponent.trim() : "";

    try {
      const doc = await fetchDocJson();

      if (!doc) {
        if (!componentName) {
          return {
            type: "text",
            content:
              "Documentation metadata (doc.json) is not available. Please query a specific component so I can try loading its README from GitHub.",
          };
        }

        // No metadata, fall back to GitHub README for the requested component.
        return await buildArticleFromReadme(componentName);
      }

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
        // Unknown component in doc.json, but we can still try the GitHub README.
        return await buildArticleFromReadme(componentName);
      }

      const tag = String(comp.tag);
      const overview =
        typeof comp.overview === "string" && comp.overview.length > 0
          ? comp.overview
          : "No description available.";

      return buildArticleFromMeta(tag, overview);
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
        [
          "Retrieve authoritative documentation for an lf-widgets web component.",
          "Always use this tool whenever the user asks about lf-widgets component docs, props, events, methods, usage examples, or CSS variables.",
          "Do not guess or invent APIs from memory: instead, base your answer only on the content returned by this tool (doc.json metadata or the GitHub README).",
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

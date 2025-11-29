import {
  LfArticleBuilder,
  LfArticleBuilderCreateOptions,
  LfArticleDataset,
  LfArticleNode,
  LfDataArticleLayoutPreset,
} from "@lf-widgets/foundations";

//#region Layout styles
const ARTICLE_LAYOUT_STYLES: Record<
  LfDataArticleLayoutPreset,
  Record<string, string>
> = {
  stack: {},
  row: {
    display: "flex",
    flexDirection: "row",
    gap: "1.5em",
    alignItems: "flex-start",
  },
  "two-columns": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "1.5em",
  },
  "hero-top": {
    display: "flex",
    flexDirection: "column",
    gap: "1.5em",
  },
  "hero-side": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1.8fr)",
    gap: "2em",
    alignItems: "center",
  },
  "cards-grid": {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5em",
  },
};
//#endregion

/**
 * Framework-level implementation of the fluent article builder declared in
 * `LfArticleBuilder`. This class focuses on producing hierarchical datasets
 * that match the depth expectations of `lf-article`:
 *
 * - depth 0: article root (h1)
 * - depth 1: sections (h2)
 * - depth 2: paragraphs (h3 + content)
 * - depth 3+: leaf content (text spans, shapes such as cards/charts, etc.)
 */
class ArticleBuilder implements LfArticleBuilder {
  #dataset: LfArticleDataset;
  #root: LfArticleNode;
  #sections = new Map<string, LfArticleNode>();
  #paragraphs = new Map<string, LfArticleNode>();
  #counter = 0;
  #defaultLayout?: LfDataArticleLayoutPreset;

  constructor(options?: LfArticleBuilderCreateOptions) {
    const id = options?.id ?? "article-root";
    this.#defaultLayout = options?.layout;

    this.#root = {
      id,
      value: options?.title ?? "",
      cssStyle: this.#applyLayout(this.#defaultLayout, options?.cssStyle),
      children: [],
    };

    const datasetProps = options?.dataset ?? {};

    this.#dataset = {
      ...datasetProps,
      nodes: [this.#root],
    };
  }

  #applyLayout(
    layout: LfDataArticleLayoutPreset | undefined,
    cssStyle?: LfArticleNode["cssStyle"],
  ): LfArticleNode["cssStyle"] {
    if (!layout || layout === "stack") {
      return cssStyle;
    }

    const layoutStyle = ARTICLE_LAYOUT_STYLES[layout];
    if (!layoutStyle) {
      return cssStyle;
    }

    return {
      ...layoutStyle,
      ...(cssStyle ?? {}),
    };
  }

  #nextId(prefix: string): string {
    this.#counter += 1;
    return `${prefix}-${this.#counter}`;
  }

  section: LfArticleBuilder["section"] = {
    get: (id: string) => this.getSection(id),
    add: {
      empty: (options) => this.addSection(options),
      withText: (options) => this.addSectionWithText(options),
      withLeaf: (options) => this.addSectionWithLeaf(options),
    },
  };

  addSection(options: {
    id?: string;
    title?: string;
    cssStyle?: LfArticleNode["cssStyle"];
    layout?: LfDataArticleLayoutPreset;
  }): LfArticleNode {
    const id = options.id ?? this.#nextId("section");
    const layout = options.layout ?? this.#defaultLayout;

    const section: LfArticleNode = {
      id,
      value: options.title ?? "",
      cssStyle: this.#applyLayout(layout, options.cssStyle),
      children: [],
    };

    if (!this.#root.children) {
      this.#root.children = [];
    }
    this.#root.children.push(section);

    this.#sections.set(section.id, section);

    return section;
  }

  getDataset(): LfArticleDataset {
    return this.#dataset;
  }

  getSection(id: string): LfArticleNode | undefined {
    return this.#sections.get(id);
  }

  toDataset(): LfArticleDataset {
    return this.getDataset();
  }

  addParagraph(
    sectionId: string,
    options?: {
      id?: string;
      title?: string;
      text?: string;
      cssStyle?: LfArticleNode["cssStyle"];
    },
  ): LfArticleNode {
    const existingSection = this.#sections.get(sectionId);
    const section = existingSection ?? this.addSection({ id: sectionId });

    const id = options?.id ?? this.#nextId("paragraph");

    const paragraph: LfArticleNode = {
      id,
      value: options?.title ?? "",
      cssStyle: options?.cssStyle,
      children: [],
    };

    if (!section.children) {
      section.children = [];
    }
    section.children.push(paragraph);

    this.#paragraphs.set(paragraph.id, paragraph);

    if (options?.text && options.text.trim().length > 0) {
      paragraph.children!.push({
        id: `${paragraph.id}-text`,
        value: options.text,
      });
    }

    return paragraph;
  }

  getParagraph(id: string): LfArticleNode | undefined {
    return this.#paragraphs.get(id);
  }

  addLeaf(options: {
    sectionId: string;
    paragraphId?: string;
    node: LfArticleNode;
  }): LfArticleNode {
    const { sectionId, paragraphId, node } = options;

    let section = this.#sections.get(sectionId);
    if (!section) {
      section = this.addSection({ id: sectionId });
    }

    let paragraph: LfArticleNode | undefined;

    if (paragraphId) {
      paragraph = this.#paragraphs.get(paragraphId);
    }

    if (!paragraph) {
      paragraph = this.addParagraph(section.id, {
        id: paragraphId,
      });
    }

    if (!paragraph.children) {
      paragraph.children = [];
    }
    paragraph.children.push(node);

    return node;
  }

  addSectionWithText(options: {
    sectionId?: string;
    sectionTitle: string;
    text: string;
    paragraphId?: string;
    paragraphTitle?: string;
    sectionCssStyle?: LfArticleNode["cssStyle"];
    paragraphCssStyle?: LfArticleNode["cssStyle"];
    layout?: LfDataArticleLayoutPreset;
  }): {
    section: LfArticleNode;
    paragraph: LfArticleNode;
  } {
    const section = this.addSection({
      id: options.sectionId,
      title: options.sectionTitle,
      cssStyle: options.sectionCssStyle,
      layout: options.layout,
    });

    const paragraph = this.addParagraph(section.id, {
      id: options.paragraphId,
      title: options.paragraphTitle,
      text: options.text,
      cssStyle: this.#applyLayout(options.layout, options.paragraphCssStyle),
    });

    return { section, paragraph };
  }

  addSectionWithLeaf(options: {
    sectionId?: string;
    sectionTitle: string;
    text?: string;
    paragraphId?: string;
    paragraphTitle?: string;
    sectionCssStyle?: LfArticleNode["cssStyle"];
    paragraphCssStyle?: LfArticleNode["cssStyle"];
    leaf: LfArticleNode;
    layout?: LfDataArticleLayoutPreset;
  }): {
    section: LfArticleNode;
    paragraph: LfArticleNode;
    leaf: LfArticleNode;
  } {
    const { section, paragraph } = this.addSectionWithText({
      sectionId: options.sectionId,
      sectionTitle: options.sectionTitle,
      text: options.text ?? "",
      paragraphId: options.paragraphId,
      paragraphTitle: options.paragraphTitle,
      sectionCssStyle: options.sectionCssStyle,
      paragraphCssStyle: options.paragraphCssStyle,
      layout: options.layout,
    });

    this.addLeaf({
      sectionId: section.id,
      paragraphId: paragraph.id,
      node: options.leaf,
    });

    return { section, paragraph, leaf: options.leaf };
  }
}

export const createArticleBuilder = (
  options?: LfArticleBuilderCreateOptions,
): LfArticleBuilder => new ArticleBuilder(options);

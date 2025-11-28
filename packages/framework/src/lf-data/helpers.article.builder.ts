import {
  LfArticleBuilder,
  LfArticleBuilderCreateOptions,
  LfArticleDataset,
  LfArticleNode,
} from "@lf-widgets/foundations";

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

  constructor(options?: LfArticleBuilderCreateOptions) {
    const id = options?.id ?? "article-root";

    this.#root = {
      id,
      value: options?.title ?? "",
      cssStyle: options?.cssStyle,
      children: [],
    };

    const datasetProps = options?.dataset ?? {};

    this.#dataset = {
      ...datasetProps,
      nodes: [this.#root],
    };
  }

  getDataset(): LfArticleDataset {
    return this.#dataset;
  }

  toDataset(): LfArticleDataset {
    return this.getDataset();
  }

  #nextId(prefix: string): string {
    this.#counter += 1;
    return `${prefix}-${this.#counter}`;
  }

  addSection(options: {
    id?: string;
    title?: string;
    cssStyle?: LfArticleNode["cssStyle"];
  }): LfArticleNode {
    const id = options.id ?? this.#nextId("section");

    const section: LfArticleNode = {
      id,
      value: options.title ?? "",
      cssStyle: options.cssStyle,
      children: [],
    };

    if (!this.#root.children) {
      this.#root.children = [];
    }
    this.#root.children.push(section);

    this.#sections.set(section.id, section);

    return section;
  }

  getSection(id: string): LfArticleNode | undefined {
    return this.#sections.get(id);
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
}

export const createArticleBuilder = (
  options?: LfArticleBuilderCreateOptions,
): LfArticleBuilder => new ArticleBuilder(options);


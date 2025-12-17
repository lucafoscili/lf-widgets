import {
  LF_ARTICLE_BLOCKS,
  LF_ARTICLE_PARTS,
  LfArticleFCProps,
  LfArticleNode,
} from "@lf-widgets/foundations";
import { Fragment, FunctionalComponent, h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

/**
 * LfArticleFC - Functional Component for Article
 *
 * This is a stateless functional component that renders an article.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-article Web Component (thin wrapper)
 * 2. Inside other components for composed usage
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfArticleFC: FunctionalComponent<LfArticleFCProps> = ({
  adapter,
  className,
  dataset,
  empty = "Empty data.",
  framework,
  hasNodes,
  id,
  style,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_ARTICLE_BLOCKS;
  const parts = LF_ARTICLE_PARTS;

  const { elements, handlers } = adapter;
  const { refs } = elements;

  //#region Recursive template rendering
  /**
   * Recursively renders article nodes based on depth.
   * Depth 0 = article, 1 = section, 2 = paragraph, 3+ = wrapper/content
   */
  const recursive = (node: LfArticleNode, depth: number): VNode => {
    switch (depth) {
      case 0:
        return articleTemplate(node, depth);
      case 1:
        return sectionTemplate(node, depth);
      case 2:
        return paragraphTemplate(node, depth);
      default:
        return node.children?.length
          ? wrapperTemplate(node, depth)
          : contentTemplate(node, depth);
    }
  };
  //#endregion

  //#region Article template (depth 0)
  const articleTemplate = (node: LfArticleNode, depth: number): VNode => {
    const { children, cssStyle, value } = node;
    const nodeId = node.id || `article-${depth}`;

    return (
      <Fragment>
        <article
          class={bemClass(blocks.article._)}
          data-depth={depth.toString()}
          part={parts.article}
          style={cssStyle}
          ref={(el: HTMLElement) => {
            if (el && refs.articles instanceof Map) {
              refs.articles.set(nodeId, el);
            }
          }}
        >
          {value && <h1>{value}</h1>}
          {children && children.map((c) => recursive(c, depth + 1))}
        </article>
      </Fragment>
    );
  };
  //#endregion

  //#region Section template (depth 1)
  const sectionTemplate = (node: LfArticleNode, depth: number): VNode => {
    const { children, cssStyle, value } = node;
    const nodeId = node.id || `section-${depth}`;

    return (
      <Fragment>
        <section
          class={bemClass(blocks.section._)}
          data-depth={depth.toString()}
          part={parts.section}
          style={cssStyle}
          ref={(el: HTMLElement) => {
            if (el && refs.sections instanceof Map) {
              refs.sections.set(nodeId, el);
            }
          }}
        >
          {value && <h2>{value}</h2>}
          {children && children.map((c) => recursive(c, depth + 1))}
        </section>
      </Fragment>
    );
  };
  //#endregion

  //#region Paragraph template (depth 2)
  const paragraphTemplate = (node: LfArticleNode, depth: number): VNode => {
    const { children, cssStyle, value } = node;
    const nodeId = node.id || `paragraph-${depth}`;

    return (
      <Fragment>
        <p
          class={bemClass(blocks.paragraph._)}
          data-depth={depth.toString()}
          part={parts.paragraph}
          style={cssStyle}
          ref={(el: HTMLElement) => {
            if (el && refs.paragraphs instanceof Map) {
              refs.paragraphs.set(nodeId, el);
            }
          }}
        >
          {value && <h3>{value}</h3>}
          {children && children.map((c) => recursive(c, depth + 1))}
        </p>
      </Fragment>
    );
  };
  //#endregion

  //#region Wrapper template (depth 3+ with children)
  const wrapperTemplate = (node: LfArticleNode, depth: number): VNode => {
    const { children, cssStyle, tagName, value } = node;
    const nodeId = node.id || `content-${depth}`;

    const isList = !!children?.some((c) => c.tagName === "li");
    const ComponentTag = isList ? "ul" : tagName ? tagName : "div";

    return (
      <Fragment>
        {value && <div>{value}</div>}
        <ComponentTag
          class={bemClass(blocks.content._)}
          data-depth={depth.toString()}
          part={parts.content}
          style={cssStyle}
          ref={(el: HTMLElement) => {
            if (el && refs.contents instanceof Map) {
              refs.contents.set(nodeId, el);
            }
          }}
        >
          {children && children.map((c) => recursive(c, depth + 1))}
        </ComponentTag>
      </Fragment>
    );
  };
  //#endregion

  //#region Content template (depth 3+ without children - leaf nodes)
  const contentTemplate = (node: LfArticleNode, depth: number): VNode => {
    const { cells, cssStyle, tagName, value } = node;
    const key = cells && Object.keys(cells)[0];
    const cell = cells?.[key];

    const { content } = blocks;

    // If there's a cell, render LfShape
    if (cell) {
      return (
        <LfShape
          cell={cell}
          index={0}
          shape={cell.shape}
          eventDispatcher={handlers.shape}
          framework={framework}
        ></LfShape>
      );
    }

    // Otherwise render text content
    const ComponentTag = tagName ? tagName : "span";
    return (
      <ComponentTag
        class={bemClass(content._, content.body, {
          [ComponentTag]: Boolean(ComponentTag),
        })}
        data-depth={depth.toString()}
        part={parts.content}
        style={cssStyle}
      >
        {value}
      </ComponentTag>
    );
  };
  //#endregion

  // Render empty state if no nodes
  if (!hasNodes()) {
    return (
      <div
        class={`${bemClass(blocks.emptyData._)}${className ? ` ${className}` : ""}`}
        id={id}
        part={parts.emptyData}
        style={style}
      >
        <div class={bemClass(blocks.emptyData._, blocks.emptyData.text)}>
          {empty}
        </div>
      </div>
    );
  }

  // Render article nodes
  const nodeElements: VNode[] = [];
  const { nodes } = dataset!;

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    nodeElements.push(recursive(node, 0));
  }

  return (
    <div class={className} id={id} style={style}>
      <Fragment>{nodeElements}</Fragment>
    </div>
  );
};

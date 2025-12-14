import {
  LfArticleAdapter,
  LfArticleAdapterJsx,
  LfArticleNode,
} from "@lf-widgets/foundations";
import { Fragment, h, VNode } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

/**
 * Prepares JSX factory functions for the article component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (hasNodes)
 * - Uses handlers for LfShape event forwarding
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepArticleJsx = (
  getAdapter: () => LfArticleAdapter,
): LfArticleAdapterJsx => {
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
    const adapter = getAdapter();
    const { controller, elements } = adapter;
    const { blocks, cyAttributes, framework, parts } = controller.get;

    const mgr = framework();
    const b = blocks();
    const p = parts();
    const cy = cyAttributes();

    const { children, cssStyle, value } = node;
    const { bemClass } = mgr.theme;
    const { refs } = elements;

    const nodeId = node.id || `article-${depth}`;

    return (
      <Fragment>
        <article
          class={bemClass(b.article._)}
          data-cy={cy.node}
          data-depth={depth.toString()}
          part={p.article}
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
    const adapter = getAdapter();
    const { controller, elements } = adapter;
    const { blocks, cyAttributes, framework, parts } = controller.get;

    const mgr = framework();
    const b = blocks();
    const p = parts();
    const cy = cyAttributes();

    const { children, cssStyle, value } = node;
    const { bemClass } = mgr.theme;
    const { refs } = elements;

    const nodeId = node.id || `section-${depth}`;

    return (
      <Fragment>
        <section
          class={bemClass(b.section._)}
          data-cy={cy.node}
          data-depth={depth.toString()}
          part={p.section}
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
    const adapter = getAdapter();
    const { controller, elements } = adapter;
    const { blocks, cyAttributes, framework, parts } = controller.get;

    const mgr = framework();
    const b = blocks();
    const p = parts();
    const cy = cyAttributes();

    const { children, cssStyle, value } = node;
    const { bemClass } = mgr.theme;
    const { refs } = elements;

    const nodeId = node.id || `paragraph-${depth}`;

    return (
      <Fragment>
        <p
          class={bemClass(b.paragraph._)}
          data-cy={cy.node}
          data-depth={depth.toString()}
          part={p.paragraph}
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
    const adapter = getAdapter();
    const { controller, elements } = adapter;
    const { blocks, cyAttributes, framework, parts } = controller.get;

    const mgr = framework();
    const b = blocks();
    const p = parts();
    const cy = cyAttributes();

    const { children, cssStyle, tagName, value } = node;
    const { bemClass } = mgr.theme;
    const { refs } = elements;

    const isList = !!children?.some((c) => c.tagName === "li");
    const ComponentTag = isList ? "ul" : tagName ? tagName : "div";

    const nodeId = node.id || `content-${depth}`;

    return (
      <Fragment>
        {value && <div>{value}</div>}
        <ComponentTag
          class={bemClass(b.content._)}
          data-cy={cy.node}
          data-depth={depth.toString()}
          part={p.content}
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
    const adapter = getAdapter();
    const { controller, handlers } = adapter;
    const { blocks, framework, parts } = controller.get;

    const mgr = framework();
    const b = blocks();
    const p = parts();

    const { cells, cssStyle, tagName, value } = node;
    const key = cells && Object.keys(cells)[0];
    const cell = cells?.[key];

    const { content } = b;

    // If there's a cell, render LfShape
    if (cell) {
      return (
        <LfShape
          cell={cell}
          index={0}
          shape={cell.shape}
          eventDispatcher={handlers.shape}
          framework={mgr}
        ></LfShape>
      );
    }

    // Otherwise render text content
    const ComponentTag = tagName ? tagName : "span";
    return (
      <ComponentTag
        class={mgr.theme.bemClass(content._, content.body, {
          [ComponentTag]: Boolean(ComponentTag),
        })}
        data-depth={depth.toString()}
        part={p.content}
        style={cssStyle}
      >
        {value}
      </ComponentTag>
    );
  };
  //#endregion

  //#region Main JSX factory
  return {
    article: () => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { compInstance, blocks, framework, parts } = controller.get;
      const { hasNodes } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { lfDataset, lfEmpty } = comp;
      const { bemClass } = mgr.theme;
      const { emptyData } = b;

      // Render empty state if no nodes
      if (!hasNodes()) {
        return (
          <div class={bemClass(emptyData._)} part={p.emptyData}>
            <div class={bemClass(emptyData._, emptyData.text)}>{lfEmpty}</div>
          </div>
        );
      }

      // Render article nodes
      const elements: VNode[] = [];
      const { nodes } = lfDataset;

      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        elements.push(recursive(node, 0));
      }

      return <Fragment>{elements}</Fragment>;
    },
  };
  //#endregion
};

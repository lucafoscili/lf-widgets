import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LF_ARTICLE_EVENTS, LF_ARTICLE_TAGNAMES } from "./article.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-article` component. It merges the shared component contract with the component-specific props.
 */
export interface LfArticleInterface
  extends LfComponent<"LfArticle">,
    LfArticlePropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-article`.
 */
export interface LfArticleElement
  extends HTMLStencilElement,
    Omit<LfArticleInterface, LfComponentClassProperties> {}
//#endregion

//#region Dataset
/**
 * Dataset wrapper consumed by the component for data-driven rendering.
 */
export interface LfArticleDataset extends LfDataDataset {
  /**
   * Ordered collection of root nodes that describe the article structure.
   *
   * Each entry is rendered sequentially and passed through the depth-specific
   * templates (article, section, paragraph, content) used by the component.
   */
  nodes?: LfArticleNode[];
}
/**
 * Tree node description used by the component in `lf-article`.
 */
export interface LfArticleNode extends LfDataNode {
  /**
   * Nested nodes that become sections, paragraphs, or wrapper content depending
   * on the traversal depth. Children retain their array order when rendered.
   */
  children?: LfArticleNode[];
  /**
   * Optional HTML tag applied when rendering this node.
   *
   * Without an override the component picks sensible defaults (for example
   * "div" wrappers or "span" leaf nodes). If any child declares the "li" tag
   * the parent automatically upgrades to a "ul" wrapper to keep the markup valid.
   */
  tagName?: (typeof LF_ARTICLE_TAGNAMES)[number];
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-article`.
 */
export type LfArticleEvent = (typeof LF_ARTICLE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-article` events.
 */
export interface LfArticleEventPayload
  extends LfEventPayload<"LfArticle", LfArticleEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-article` component.
 */
export interface LfArticlePropsInterface {
  /**
   * Hierarchical dataset that drives the rendered article. Nodes control
   * headings, wrapper elements, and the optional `LfShape` cells used for rich
   * content. When omitted or empty the component renders the empty state.
   */
  lfDataset?: LfArticleDataset;
  /**
   * Message displayed inside the empty-state container when no dataset nodes
   * are available. Defaults to "Empty data." in the Stencil implementation.
   */
  lfEmpty?: string;
  /**
   * Raw CSS string injected into the component shadow root. Use it to tweak
   * layout or typography without touching the global theme helpers.
   */
  lfStyle?: string;
}
//#endregion

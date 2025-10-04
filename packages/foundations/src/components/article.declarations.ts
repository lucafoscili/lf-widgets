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
  nodes?: LfArticleNode[];
}
/**
 * Tree node description used by the component in `lf-article`.
 */
export interface LfArticleNode extends LfDataNode {
  children?: LfArticleNode[];
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
  lfDataset?: LfArticleDataset;
  lfEmpty?: string;
  lfStyle?: string;
}
//#endregion

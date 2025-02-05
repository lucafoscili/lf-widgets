import {
  HTMLStencilElement,
  LfComponent,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LF_ARTICLE_EVENTS, LF_ARTICLE_TAGNAMES } from "./article.constants";

//#region Class
export interface LfArticleInterface
  extends LfComponent<"LfArticle">,
    LfArticlePropsInterface {}
export interface LfArticleElement
  extends HTMLStencilElement,
    LfArticleInterface {}
//#endregion

//#region Dataset
export interface LfArticleDataset extends LfDataDataset {
  nodes?: LfArticleNode[];
}
export interface LfArticleNode extends LfDataNode {
  children?: LfArticleNode[];
  tagName?: (typeof LF_ARTICLE_TAGNAMES)[number];
}
//#endregion

//#region Events
export type LfArticleEvent = (typeof LF_ARTICLE_EVENTS)[number];
export interface LfArticleEventPayload
  extends LfEventPayload<"LfArticle", LfArticleEvent> {}
//#endregion

//#region Props
export interface LfArticlePropsInterface {
  lfDataset?: LfArticleDataset;
  lfEmpty?: string;
  lfStyle?: string;
}
//#endregion

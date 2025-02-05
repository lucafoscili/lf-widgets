import { LfArticlePropsInterface } from "./article.declarations";

//#region Blocks
export const LF_ARTICLE_BLOCKS = {
  article: { _: "article" },
  content: { _: "content", body: "body" },
  emptyData: { _: "empty-data", text: "text" },
  paragraph: { _: "paragraph" },
  section: { _: "section" },
} as const;
//#endregion

//#region Events
export const LF_ARTICLE_EVENTS = ["lf-event", "ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_ARTICLE_PARTS = {
  article: "article",
  content: "content",
  emptyData: "empty-data",
  paragraph: "paragraph",
  section: "section",
} as const;
//#endregion

//#region Props
export const LF_ARTICLE_PROPS = [
  "lfDataset",
  "lfEmpty",
  "lfStyle",
] as const satisfies (keyof LfArticlePropsInterface)[];
//#endregion

//#region Tagnames
export const LF_ARTICLE_TAGNAMES = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "p",
  "pre",
  "span",
  "strong",
  "ul",
] as const;
//#endregion

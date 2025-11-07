import {
  LF_THEME_COLORS,
  LF_THEME_FONTS,
  LfArticleNode,
} from "@lf-widgets/foundations";

//#region Components
export const COMPONENTS = [
  "accordion",
  "article",
  "badge",
  "button",
  "canvas",
  "card",
  "carousel",
  "chart",
  "chat",
  "chip",
  "code",
  "compare",
  "drawer",
  "header",
  "image",
  "list",
  "masonry",
  "messenger",
  "photoframe",
  "placeholder",
  "progressbar",
  "slider",
  "splash",
  "spinner",
  "toggle",
  "tabbar",
  "textfield",
  "toast",
  "tree",
  "typewriter",
  "upload",
] as const;
//#endregion

//#region Documentation
export const DOC_STYLES = {
  hiddenSeparator: {
    ["display"]: "block",
    ["margin"]: "1.5em 0",
    ["width"]: "100%",
  },
  monoPrimaryContent: {
    "--lf-article-color-body": `var(${LF_THEME_COLORS.primary})`,
    "--lf-article-font-family-body": `var(${LF_THEME_FONTS.familyMonospace})`,
  },
  monoPrimaryH3: {
    "--lf-article-color-h3": `var(${LF_THEME_COLORS.primary})`,
    "--lf-article-font-family-h3": `var(${LF_THEME_FONTS.familyMonospace})`,
    "--lf-article-font-size-h3": "var(--lf-font-size)",
  },
  monoPrimaryH3Large: {
    "--lf-article-color-h3": `var(${LF_THEME_COLORS.primary})`,
    "--lf-article-font-family-h3": `var(${LF_THEME_FONTS.familySecondary})`,
    "--lf-article-font-size-h3": `calc(var(${LF_THEME_FONTS.size}) * 1.25)`,
  },
  separator: {
    ["border"]: `1px solid var(${LF_THEME_COLORS.border})`,
    ["display"]: "block",
    ["margin"]: "2em auto",
    ["opacity"]: "0.375",
    ["width"]: "25%",
  },
  underConstruction: {
    ["boxSizing"]: "border-box",
    ["display"]: "block",
    ["fontSize"]: "1.5em",
    ["letterSpacing"]: "1px",
    ["margin"]: "auto",
    ["padding"]: "1em",
    ["textAlign"]: "center",
    ["textTransform"]: "uppercase",
    ["width"]: "100%",
  },
} as const;
export const DOC_NODES: Record<
  "hiddenSeparator" | "lineBreak" | "separator",
  LfArticleNode
> = {
  hiddenSeparator: {
    cssStyle: DOC_STYLES.hiddenSeparator,
    id: "content",
    value: "",
  },
  lineBreak: {
    id: "content",
    tagName: "br",
    value: "",
  },
  separator: {
    cssStyle: DOC_STYLES.separator,
    id: "content",
    value: "",
  },
} as const;
export const DOC_IDS = {
  content: "content",
  contentList: "content-list",
  contentListItem: "content-list-item",
  contentWrapper: "content-wrapper",
  paragraph: "paragraph",
  section: "section",
  root: "root",
} as const;
export const CSS_VARS = {
  columns: "--lf-showcase-columns",
} as const;
//#endregion

//#region Fixtures
export const FIXTURES_DUMMY = "uncategorized" as const;
export const FIXTURES_CATEGORIES = [
  FIXTURES_DUMMY,
  "bar",
  "brush",
  "bubble",
  "button",
  "calendar",
  "candlestick",
  "choice",
  "debug",
  "dualAxis",
  "empty",
  "filter",
  "flat",
  "floating",
  "funnel",
  "heatmap",
  "icon",
  "image",
  "input",
  "javascript",
  "keywords",
  "languages",
  "line",
  "material",
  "mixed",
  "outlined",
  "pie",
  "positions",
  "radar",
  "raised",
  "sankey",
  "scatter",
  "sizes",
  "states",
  "tags",
  "textarea",
  "upload",
  "weather",
  "widget",
] as const;
//#endregion

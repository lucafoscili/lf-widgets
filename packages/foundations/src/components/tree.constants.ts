import { LfTreePropsInterface } from "./tree.declarations";

//#region Automatic CSS variables
export const LF_TREE_CSS_VARIABLES = {
  multiplier: "--lf_tree_padding_multiplier",
} as const;
//#endregion

//#region Blocks
export const LF_TREE_BLOCKS = {
  emptyData: { _: "empty-data", text: "text" },
  node: {
    _: "node",
    content: "content",
    dropdown: "dropdown",
    expand: "expand",
    icon: "icon",
    padding: "padding",
    value: "value",
    grid: "grid",
    gridCell: "grid-cell",
  },
  noMatches: { _: "no-matches", filter: "filter", icon: "icon", text: "text" },
  tree: {
    _: "tree",
    filter: "filter",
    nodesWrapper: "nodes-wrapper",
    header: "header",
  },
  header: { _: "header", row: "row", cell: "cell" },
} as const;
//#endregion

//#region Events
export const LF_TREE_EVENTS = [
  "click",
  // New explicit expand event (Phase 1); "click" with args.expansion kept for backward compat
  "expand",
  "lf-event",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_TREE_PARTS = {
  emptyData: "empty-data",
  node: "node",
  tree: "tree",
} as const;
//#endregion

//#region Props
export const LF_TREE_PROPS = [
  "lfAccordionLayout",
  "lfDataset",
  "lfEmpty",
  "lfFilter",
  "lfInitialExpansionDepth",
  "lfRipple",
  "lfSelectable",
  "lfStyle",
  "lfUiSize",
] as const satisfies (keyof LfTreePropsInterface)[];
//#endregion

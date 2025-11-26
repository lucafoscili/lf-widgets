import { LfBreadcrumbsPropsInterface } from "./breadcrumbs.declarations";

//#region Blocks
export const LF_BREADCRUMBS_BLOCKS = {
  breadcrumbs: {
    _: "breadcrumbs",
    dot: "dot",
    empty: "empty",
    icon: "icon",
    item: "item",
    label: "label",
    list: "list",
    ripple: "ripple",
    separator: "separator",
    truncation: "truncation",
  },
} as const;
//#endregion

//#region Events
export const LF_BREADCRUMBS_EVENTS = [
  "click",
  "expand",
  "lf-event",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_BREADCRUMBS_PARTS = {
  breadcrumbs: "breadcrumbs",
  current: "current",
  empty: "empty",
  icon: "icon",
  item: "item",
  label: "label",
  list: "list",
  ripple: "ripple",
  separator: "separator",
  truncation: "truncation",
} as const;
//#endregion

//#region Props
export const LF_BREADCRUMBS_PROPS = [
  "lfDataset",
  "lfEmpty",
  "lfInteractive",
  "lfMaxItems",
  "lfRipple",
  "lfSeparator",
  "lfShowRoot",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfBreadcrumbsPropsInterface)[];
//#endregion

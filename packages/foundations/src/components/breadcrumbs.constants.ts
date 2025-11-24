import { LfBreadcrumbsPropsInterface } from "./breadcrumbs.declarations";

//#region Blocks
export const LF_BREADCRUMBS_BLOCKS = {
  breadcrumbs: {
    _: "breadcrumbs",
    list: "list",
    item: "item",
    separator: "separator",
    icon: "icon",
    label: "label",
    truncation: "truncation",
    empty: "empty",
  },
} as const;
//#endregion

//#region Events
export const LF_BREADCRUMBS_EVENTS = [
  "click",
  "lf-event",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_BREADCRUMBS_PARTS = {
  breadcrumbs: "breadcrumbs",
  icon: "icon",
  empty: "empty",
  item: "item",
  label: "label",
  list: "list",
  separator: "separator",
  truncation: "truncation",
  current: "current",
} as const;
//#endregion

//#region Props
export const LF_BREADCRUMBS_PROPS = [
  "lfCurrentNodeId",
  "lfDataset",
  "lfEmpty",
  "lfInteractive",
  "lfMaxItems",
  "lfRipple",
  "lfSeparator",
  "lfShowRoot",
  "lfStyle",
  "lfUiSize",
] as const satisfies (keyof LfBreadcrumbsPropsInterface)[];
//#endregion

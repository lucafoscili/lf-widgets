import { LfListPropsInterface } from "./list.declarations";

//#region Blocks
export const LF_LIST_BLOCKS = {
  deleteIcon: { _: "delete", icon: "icon" },
  emptyData: { _: "empty-data", text: "text" },
  list: { _: "list", filter: "filter", item: "item" },
  node: {
    _: "node",
    icon: "icon",
    subtitle: "subtitle",
    text: "text",
    title: "title",
  },
} as const;
//#endregion

//#region Events
export const LF_LIST_EVENTS = [
  "blur",
  "click",
  "delete",
  "focus",
  "lf-event",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_LIST_PARTS = {
  deleteIcon: "delete-icon",
  emptyData: "empty-data",
  filter: "filter",
  icon: "icon",
  list: "list",
  node: "node",
  subtitle: "subtitle",
  title: "title",
} as const;
//#endregion

//#region Props
export const LF_LIST_PROPS = [
  "lfDataset",
  "lfEmpty",
  "lfEnableDeletions",
  "lfFilter",
  "lfNavigation",
  "lfRipple",
  "lfSelectable",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfListPropsInterface)[];
//#endregion

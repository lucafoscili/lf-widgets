import { LfListPropsInterface } from "./list.declarations";

//#region Blocks
export const LF_LIST_BLOCKS = {
  delete: { _: "delete", icon: "icon" },
  emptyData: { _: "empty-data", text: "text" },
  filter: { _: "filter", textfield: "textfield" }, // NEW
  list: { _: "list", item: "item" },
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
  "filter", // NEW
  "focus",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_LIST_PARTS = {
  delete: "delete",
  emptyData: "empty-data",
  filter: "filter", // NEW
  list: "list",
  node: "node",
} as const;
//#endregion

//#region Props
export const LF_LIST_PROPS = [
  "lfDataset",
  "lfEmpty",
  "lfEnableDeletions",
  "lfFilter", // NEW
  "lfFilterPlaceholder", // NEW
  "lfNavigation",
  "lfRipple",
  "lfSelectable",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfListPropsInterface)[];
//#endregion

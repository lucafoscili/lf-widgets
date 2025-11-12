import { LfSelectPropsInterface } from "./select.declarations";

//#region Blocks
export const LF_SELECT_BLOCKS = {
  _: "select",
  list: "list",
  textfield: "textfield",
} as const;
//#endregion

//#region Events
// Unify events from textfield and list components
export const LF_SELECT_EVENTS = [
  "blur",
  "change",
  "click",
  "focus",
  "input",
  "ready",
  "select",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_SELECT_PARTS = {
  list: "list",
  select: "select",
  textfield: "textfield",
} as const;
//#endregion

//#region Props
export const LF_SELECT_PROPS = [
  "lfDataset",
  "lfListProps",
  "lfStyle",
  "lfTextfieldProps",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfSelectPropsInterface)[];
//#endregion

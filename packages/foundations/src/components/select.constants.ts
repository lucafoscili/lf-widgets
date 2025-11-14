import { LfSelectPropsInterface } from "./select.declarations";

//#region Blocks
export const LF_SELECT_BLOCKS = {
  select: {
    _: "select",
    list: "list",
    textfield: "textfield",
  },
} as const;
//#endregion

//#region Events
export const LF_SELECT_EVENTS = ["lf-event", "ready", "unmount"] as const;
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
  "lfNavigation",
  "lfStyle",
  "lfTextfieldProps",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfSelectPropsInterface)[];
//#endregion

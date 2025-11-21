import { LfMultiInputPropsInterface } from "./multiinput.declarations";

//#region Blocks
export const LF_MULTIINPUT_BLOCKS = {
  multiinput: {
    _: "multiinput",
    chips: "chips",
    history: "history",
    textfield: "textfield",
  },
} as const;
//#endregion

//#region Events
export const LF_MULTIINPUT_EVENTS = [
  "input",
  "change",
  "select-history",
  "clear-history",
  "lf-event",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_MULTIINPUT_PARTS = {
  chips: "chips",
  history: "history",
  multiinput: "multiinput",
  textfield: "textfield",
} as const;
//#endregion

//#region Props
export const LF_MULTIINPUT_PROPS = [
  "lfAllowFreeInput",
  "lfChipProps",
  "lfDataset",
  "lfMaxHistory",
  "lfMode",
  "lfStyle",
  "lfTextfieldProps",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfMultiInputPropsInterface)[];
//#endregion

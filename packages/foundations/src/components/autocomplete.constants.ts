import { LfAutocompletePropsInterface } from "./autocomplete.declarations";

//#region Blocks
export const LF_AUTOCOMPLETE_BLOCKS = {
  autocomplete: {
    _: "autocomplete",
    textfield: "textfield",
  },
  dropdown: {
    _: "dropdown",
    list: "list",
    spinner: "spinner",
  },
} as const;
//#endregion

//#region Events
export const LF_AUTOCOMPLETE_EVENTS = [
  "input",
  "request",
  "change",
  "lf-event",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_AUTOCOMPLETE_PARTS = {
  autocomplete: "autocomplete",
  dropdown: "dropdown",
  list: "list",
  spinner: "spinner",
  textfield: "textfield",
} as const;
//#endregion

//#region Props
export const LF_AUTOCOMPLETE_PROPS = [
  "lfAllowFreeInput",
  "lfCache",
  "lfCacheTTL",
  "lfDataset",
  "lfDebounceMs",
  "lfListProps",
  "lfMaxCacheSize",
  "lfMinChars",
  "lfNavigation",
  "lfSpinnerProps",
  "lfStyle",
  "lfTextfieldProps",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfAutocompletePropsInterface)[];
//#endregion

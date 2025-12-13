import { LfAutocompletePropsInterface } from "./autocomplete.declarations";

//#region Blocks
/**
 * BEM block structure for the autocomplete component.
 * Maps directly to CSS classes and DOM refs.
 * @see Section 6.3 of 4_0_0_REFACTORING.md
 */
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

//#region IDs
/**
 * DOM element IDs used by the autocomplete component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_AUTOCOMPLETE_IDS = {
  autocomplete: "autocomplete",
  textfield: "textfield",
  dropdown: "dropdown",
  list: "list",
  spinner: "spinner",
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

import { LfButtonPropsInterface } from "./button.declarations";

//#region Blocks
/**
 * BEM block structure for the button component.
 * Maps directly to CSS classes and DOM refs.
 * @see Section 6.3 of 4_0_0_REFACTORING.md
 */
export const LF_BUTTON_BLOCKS = {
  button: {
    _: "button",
    dropdown: "dropdown",
    dropdownRipple: "dropdown-ripple",
    icon: "icon",
    label: "label",
    list: "list",
    spinner: "spinner",
  },
} as const;
//#endregion

//#region IDs
/**
 * DOM element IDs used by the button component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_BUTTON_IDS = {
  button: "button",
  dropdown: "dropdown",
  dropdownRipple: "dropdown-ripple",
  icon: "icon",
  label: "label",
  list: "list",
  spinner: "spinner",
} as const;
//#endregion

//#region Events
export const LF_BUTTON_EVENTS = [
  "blur",
  "click",
  "focus",
  "lf-event",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_BUTTON_PARTS = {
  button: "button",
  dropdown: "dropdown",
  dropdownRipple: "dropdown-ripple",
  icon: "icon",
  label: "label",
  list: "list",
  spinner: "spinner",
} as const;
//#endregion

//#region Props
export const LF_BUTTON_PROPS = [
  "lfAriaLabel",
  "lfDataset",
  "lfIcon",
  "lfIconOff",
  "lfLabel",
  "lfRipple",
  "lfShowSpinner",
  "lfStretchX",
  "lfStretchY",
  "lfStyle",
  "lfStyling",
  "lfToggable",
  "lfTrailingIcon",
  "lfType",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfButtonPropsInterface)[];
//#endregion

//#region Slots
export const LF_BUTTON_SLOT = "spinner" as const;
//#endregion

//#region State
export const LF_BUTTON_STATE = ["off", "on"] as const;
//#endregion

//#region Stylings
export const LF_BUTTON_STYLINGS = [
  "flat",
  "floating",
  "icon",
  "outlined",
  "raised",
] as const;
//#endregion

//#region Types
export const LF_BUTTON_TYPES = ["button", "reset", "submit"] as const;
//#endregion

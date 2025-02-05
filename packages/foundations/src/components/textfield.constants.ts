import { LfTextfieldPropsInterface } from "./textfield.declarations";
import { LfThemeBEMModifier } from "../framework/theme.declarations";

//#region Blocks
export const LF_TEXTFIELD_BLOCKS = {
  notchedOutline: {
    _: "notched-outline",
    leading: "leading",
    notch: "notch",
    trailing: "trailing",
  },
  textfield: {
    _: "textfield",
    counter: "counter",
    helperLine: "helper-line",
    helperText: "helper-text",
    icon: "icon",
    input: "input",
    label: "label",
    resizer: "resizer",
    rippleSurface: "ripple-surface",
  },
} as const;
//#endregion

//#region Events
export const LF_TEXTFIELD_EVENTS = [
  "blur",
  "change",
  "click",
  "focus",
  "input",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_TEXTFIELD_PARTS = {
  counter: "counter",
  icon: "icon",
  input: "input",
  label: "label",
  textfield: "textfield",
} as const;
//#endregion

//#region Props
export const LF_TEXTFIELD_PROPS = [
  "lfHelper",
  "lfHtmlAttributes",
  "lfIcon",
  "lfLabel",
  "lfStretchY",
  "lfStyle",
  "lfStyling",
  "lfTrailingIcon",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfTextfieldPropsInterface)[];
//#endregion

//#region Statuses
export const LF_TEXTFIELD_MODIFIERS = [
  "disabled",
  "filled",
  "focused",
  "full-width",
  "has-icon",
  "has-label",
] as const satisfies Partial<keyof LfThemeBEMModifier>[];
//#endregion

//#region Stylings
export const LF_TEXTFIELD_STYLINGS = [
  "flat",
  "outlined",
  "raised",
  "textarea",
] as const;
//#endregion

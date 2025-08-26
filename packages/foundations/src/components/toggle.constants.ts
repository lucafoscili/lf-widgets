import { LfTogglePropsInterface } from "./toggle.declarations";

//#region Blocks
export const LF_TOGGLE_BLOCKS = {
  formField: {
    _: "form-field",
    label: "label",
  },
  toggle: {
    _: "toggle",
    label: "label",
    nativeControl: "native-control",
    thumb: "thumb",
    thumbUnderlay: "thumb-underlay",
    track: "track",
  },
} as const;
//#endregion

//#region Events
export const LF_TOGGLE_EVENTS = [
  "blur",
  "change",
  "focus",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_TOGGLE_PARTS = {
  label: "label",
  nativeControl: "native-control",
  toggle: "toggle",
  thumb: "thumb",
  track: "track",
} as const;
//#endregion

//#region Props
export const LF_TOGGLE_PROPS = [
  "lfAriaLabel",
  "lfLabel",
  "lfLeadingLabel",
  "lfRipple",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfTogglePropsInterface)[];
//#endregion

//#region State
export const LF_TOGGLE_STATES = ["off", "on"] as const;
//#endregion

import { LfSliderPropsInterface } from "./slider.declarations";

//#region Automatic CSS variables
export const LF_SLIDER_CSS_VARIABLES = {
  value: "--lf_slider_value",
} as const;
//#endregion

//#region Blocks
export const LF_SLIDER_BLOCKS = {
  formField: {
    _: "form-field",
    label: "label",
  },
  slider: {
    _: "slider",
    nativeControl: "native-control",
    thumb: "thumb",
    thumbUnderlay: "thumb-underlay",
    track: "track",
    value: "value",
  },
} as const;
//#endregion

//#region Events
export const LF_SLIDER_EVENTS = [
  "blur",
  "change",
  "focus",
  "input",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_SLIDER_PARTS = {
  formField: "form-field",
  label: "label",
  nativeControl: "native-control",
  slider: "slider",
  thumb: "thumb",
  thumbUnderlay: "thumb-underlay",
  track: "track",
  value: "value",
} as const;
//#endregion

//#region Props
export const LF_SLIDER_PROPS = [
  "lfLabel",
  "lfLeadingLabel",
  "lfMax",
  "lfMin",
  "lfRipple",
  "lfStep",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfSliderPropsInterface)[];
//#endregion

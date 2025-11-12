import { LfRadioPropsInterface } from "./radio.declarations";

//#region Blocks
export const LF_RADIO_BLOCKS = {
  _: "radio",
  control: {
    _: "control",
    circle: "circle",
    dot: "dot",
    input: "input",
    ripple: "ripple",
  },
  item: {
    _: "item",
    label: "label",
  },
} as const;
//#endregion

//#region Events
export const LF_RADIO_EVENTS = [
  "blur",
  "change",
  "click",
  "focus",
  "pointerdown",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_RADIO_PARTS = {
  circle: "circle",
  control: "control",
  dot: "dot",
  input: "input",
  item: "item",
  label: "label",
  radio: "radio",
  ripple: "ripple",
} as const;
//#endregion

//#region Props
export const LF_RADIO_PROPS = [
  "lfAriaLabel",
  "lfDataset",
  "lfLeadingLabel",
  "lfOrientation",
  "lfRipple",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfRadioPropsInterface)[];
//#endregion

//#region Orientations
export const LF_RADIO_ORIENTATIONS = ["horizontal", "vertical"] as const;
//#endregion

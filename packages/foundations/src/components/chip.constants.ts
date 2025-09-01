import { LfChipPropsInterface } from "./chip.declarations";

//#region Automatic CSS variables
export const LF_CHIP_CSS_VARS = {
  indentOffset: "--lf_chip_indent_offset",
} as const;
//#endregion

//#region Blocks
export const LF_CHIP_BLOCKS = {
  chip: { _: "chip", node: "node" },
  item: {
    _: "item",
    checkmark: "checkmark",
    checkmarkPath: "checkmark-path",
    checkmarkSvg: "checkmark-svg",
    icon: "icon",
    indent: "indent",
    primaryAction: "primary-action",
    text: "text",
  },
  wrapper: {
    _: "wrapper",
    indent: "indent",
    node: "node",
  },
} as const;
//#endregion

//#region Events
export const LF_CHIP_EVENTS = [
  "blur",
  "click",
  "delete",
  "focus",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_CHIP_PARTS = {
  chip: "chip",
  indent: "indent",
  item: "item",
} as const;
//#endregion

//#region Props
export const LF_CHIP_PROPS = [
  "lfAriaLabel",
  "lfDataset",
  "lfRipple",
  "lfStyle",
  "lfStyling",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfChipPropsInterface)[];
//#endregion

//#region Styling
export const LF_CHIP_STYLING = [
  "choice",
  "filter",
  "input",
  "standard",
] as const;
//#endregion

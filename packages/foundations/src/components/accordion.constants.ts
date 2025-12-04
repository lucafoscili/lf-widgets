import { LfAccordionPropsInterface } from "./accordion.declarations";

//#region Blocks
export const LF_ACCORDION_BLOCKS = {
  accordion: { _: "accordion" },
  node: {
    _: "node",
    content: "content",
    expand: "expand",
    header: "header",
    icon: "icon",
    text: "text",
  },
} as const;
//#endregion

//#region Events
export const LF_ACCORDION_EVENTS = [
  "click",
  "lf-event",
  "pointerdown",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_ACCORDION_PARTS = {
  accordion: "accordion",
  content: "content",
  expand: "expand",
  header: "header",
  icon: "icon",
  text: "text",
} as const;
//#endregion

//#region Props
export const LF_ACCORDION_PROPS = [
  "lfDataset",
  "lfRipple",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
] as const satisfies (keyof LfAccordionPropsInterface)[];
//#endregion

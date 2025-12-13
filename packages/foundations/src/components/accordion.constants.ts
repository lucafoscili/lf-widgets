import { LfAccordionPropsInterface } from "./accordion.declarations";

//#region Blocks
/**
 * BEM block structure for the accordion component.
 * Maps directly to CSS classes and DOM refs.
 * @see Section 6.3 of 4_0_0_REFACTORING.md
 */
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

//#region IDs
/**
 * DOM element IDs used by the accordion component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_ACCORDION_IDS = {
  accordion: "accordion",
  content: "content",
  expand: "expand",
  header: "header",
  icon: "icon",
  text: "text",
} as const;
//#endregion

//#region Events
export const LF_ACCORDION_EVENTS = [
  "click",
  "expand",
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
  "lfExpanded",
  "lfRipple",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
] as const satisfies (keyof LfAccordionPropsInterface)[];
//#endregion

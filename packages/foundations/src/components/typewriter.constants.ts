import { LfTypewriterPropsInterface } from "./typewriter.declarations";

//#region Blocks
/**
 * BEM block structure for the typewriter component.
 * Maps directly to CSS classes and DOM refs.
 * @see Section 6.3 of 4_0_0_REFACTORING.md
 */
export const LF_TYPEWRITER_BLOCKS = {
  typewriter: {
    _: "typewriter",
    cursor: "cursor",
    text: "text",
  },
} as const;
//#endregion

//#region Cursors
export const LF_TYPEWRITER_CURSORS = ["enabled", "disabled", "auto"] as const;
//#endregion

//#region Events
export const LF_TYPEWRITER_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region IDs
/**
 * DOM element IDs used by the typewriter component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_TYPEWRITER_IDS = {
  cursor: "cursor",
  text: "text",
  typewriter: "typewriter",
} as const;
//#endregion

//#region Parts
export const LF_TYPEWRITER_PARTS = {
  cursor: "cursor",
  text: "text",
  typewriter: "typewriter",
} as const;
//#endregion

//#region Props
export const LF_TYPEWRITER_PROPS = [
  "lfCursor",
  "lfDeleteSpeed",
  "lfLoop",
  "lfPause",
  "lfSpeed",
  "lfStyle",
  "lfTag",
  "lfUpdatable",
  "lfValue",
] as const satisfies (keyof LfTypewriterPropsInterface)[];
//#endregion

//#region Tags
export const LF_TYPEWRITER_TAGS = [
  "div",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "pre",
  "code",
  "p",
  "a",
] as const;
//#endregion

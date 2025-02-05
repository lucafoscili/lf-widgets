import { LfTypewriterPropsInterface } from "./typewriter.declarations";

//#region Blocks
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

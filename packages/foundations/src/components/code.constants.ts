import { LfCodePropsInterface } from "./code.declarations";

//#region Blocks
export const LF_CODE_BLOCKS = {
  code: {
    _: "code",
    header: {
      _: "header",
      copy: "copy",
      title: "title",
    },
  },
} as const;
//#endregion

//#region IDs
/**
 * DOM element IDs used by the code component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_CODE_IDS = {
  code: "code",
  header: "header",
  copy: "copy",
  pre: "pre",
  title: "title",
} as const;
//#endregion

//#region Events
export const LF_CODE_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_CODE_PARTS = {
  code: "code",
  copy: "copy",
  header: "header",
  prism: "prism",
  title: "title",
} as const;
//#endregion

//#region Props
export const LF_CODE_PROPS = [
  "lfFadeIn",
  "lfFormat",
  "lfLanguage",
  "lfPreserveSpaces",
  "lfShowCopy",
  "lfShowHeader",
  "lfStickyHeader",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfCodePropsInterface)[];
//#endregion

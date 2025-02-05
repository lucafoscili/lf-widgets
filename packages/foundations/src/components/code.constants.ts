import { LfCodePropsInterface } from "./code.declarations";

//#region Blocks
export const LF_CODE_BLOCKS = {
  code: { _: "code", header: "header", title: "title" },
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
  "lfFormat",
  "lfLanguage",
  "lfPreserveSpaces",
  "lfShowCopy",
  "lfStickyHeader",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfCodePropsInterface)[];
//#endregion

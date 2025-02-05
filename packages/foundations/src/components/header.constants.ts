import { LfHeaderPropsInterface } from "./header.declarations";

//#region Blocks
export const LF_HEADER_BLOCKS = {
  header: { _: "header", section: "section" },
} as const;
//#endregion

//#region Events
export const LF_HEADER_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_HEADER_PARTS = {
  header: "header",
  section: "section",
} as const;
//#endregion

//#region Props
export const LF_HEADER_PROPS = [
  "lfStyle",
] as const satisfies (keyof LfHeaderPropsInterface)[];
//#endregion

//#region Slots
export const LF_HEADER_SLOT = "content" as const;
//#endregion

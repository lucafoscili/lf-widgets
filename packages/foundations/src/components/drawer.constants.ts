import { LfDrawerPropsInterface } from "./drawer.declarations";

//#region Blocks
export const LF_DRAWER_BLOCKS = {
  drawer: { _: "drawer", content: "content" },
} as const;
//#endregion

//#region Display
export const LF_DRAWER_DISPLAYS = ["dock", "slide"] as const;
//#endregion

//#region Events
export const LF_DRAWER_EVENTS = ["close", "open", "ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_DRAWER_PARTS = {
  content: "content",
  drawer: "drawer",
} as const;
//#endregion

//#region Position
export const LF_DRAWER_POSITIONS = ["left", "right"] as const;
//#endregion

//#region Props
export const LF_DRAWER_PROPS = [
  "lfDisplay",
  "lfPosition",
  "lfResponsive",
  "lfStyle",
  "lfValue",
] as const satisfies (keyof LfDrawerPropsInterface)[];
//#endregion

//#region Slots
export const LF_DRAWER_SLOT = "content" as const;
//#endregion

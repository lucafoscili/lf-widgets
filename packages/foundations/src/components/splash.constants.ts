import { LfSplashPropsInterface } from "./splash.declarations";

//#region Blocks
export const LF_SPLASH_BLOCKS = {
  splash: {
    _: "splash",
    content: "content",
    label: "label",
    widget: "widget",
  },
} as const;
//#endregion

//#region Events
export const LF_SPLASH_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_SPLASH_PARTS = {
  content: "content",
  label: "label",
  splash: "splash",
  widget: "widget",
} as const;

//#region Props
export const LF_SPLASH_PROPS = [
  "lfLabel",
  "lfStyle",
] as const satisfies (keyof LfSplashPropsInterface)[];
//#endregion

//#region States
export const LF_SPLASH_STATES = ["initializing", "unmounting"] as const;
//#endregion

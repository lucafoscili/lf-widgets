import { LfToastPropsInterface } from "./toast.declarations";

//#region Automatic CSS variables
export const LF_TOAST_CSS_VARIABLES = {
  timer: "--lf_toast_timer",
} as const;
//#endregion

//#region Blocks
export const LF_TOAST_BLOCKS = {
  toast: {
    _: "toast",
    accent: "accent",
    icon: "icon",
    message: "message",
    messageWrapper: "message-wrapper",
  },
} as const;
//#endregion

//#region Events
export const LF_TOAST_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_TOAST_PARTS = {
  icon: "icon",
  message: "message",
} as const;
//#endregion

//#region Props
export const LF_TOAST_PROPS = [
  "lfCloseCallback",
  "lfCloseIcon",
  "lfIcon",
  "lfMessage",
  "lfStyle",
  "lfTimer",
  "lfUiSize",
  "lfUiState",
] as const satisfies (keyof LfToastPropsInterface)[];
//#endregion

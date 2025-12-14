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

//#region IDs
/**
 * DOM element IDs used by the toast component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_TOAST_IDS = {
  toast: "toast",
  accent: "accent",
  icon: "icon",
  closeButton: "close-button",
  message: "message",
  messageWrapper: "message-wrapper",
} as const;
//#endregion

//#region Events
export const LF_TOAST_EVENTS = ["close", "ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_TOAST_PARTS = {
  icon: "icon",
  closeButton: "close-button",
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

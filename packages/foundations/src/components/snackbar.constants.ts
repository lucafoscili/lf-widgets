import { LfSnackbarPropsInterface } from "./snackbar.declarations";

//#region Automatic CSS variables
export const LF_SNACKBAR_CSS_VARIABLES = {
  duration: "--lf_snackbar_duration",
} as const;
//#endregion

//#region Blocks
export const LF_SNACKBAR_BLOCKS = {
  snackbar: {
    _: "snackbar",
    actionButton: "action-button",
    actions: "actions",
    closeButton: "close-button",
    content: "content",
    icon: "icon",
    message: "message",
  },
} as const;
//#endregion

//#region Events
export const LF_SNACKBAR_EVENTS = [
  "action",
  "close",
  "ready",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_SNACKBAR_PARTS = {
  actionButton: "action-button",
  closeButton: "close-button",
  icon: "icon",
  message: "message",
} as const;
//#endregion

//#region Positions
export const LF_SNACKBAR_POSITIONS = [
  "bottom-center",
  "bottom-left",
  "bottom-right",
  "inline",
  "top-center",
  "top-left",
  "top-right",
] as const;
//#endregion

//#region Props
export const LF_SNACKBAR_PROPS = [
  "lfAction",
  "lfActionCallback",
  "lfCloseIcon",
  "lfDuration",
  "lfIcon",
  "lfMessage",
  "lfPosition",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
] as const satisfies (keyof LfSnackbarPropsInterface)[];
//#endregion

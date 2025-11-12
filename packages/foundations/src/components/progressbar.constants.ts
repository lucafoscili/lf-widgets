import { LfProgressbarPropsInterface } from "./progressbar.declarations";

//#region Automatic CSS variables
export const LF_PROGRESSBAR_CSS_VARIABLES = {
  transform: "--lf_progressbar_transform",
  width: "--lf_progressbar_percentage_width",
} as const;
//#endregion

//#region Blocks
export const LF_PROGRESSBAR_BLOCKS = {
  pie: { _: "pie", halfCircle: "half-circle", track: "track" },
  progressbar: {
    _: "progressbar",
    icon: "icon",
    label: "label",
    mu: "mu",
    percentage: "percentage",
    text: "text",
  },
} as const;
//#endregion

//#region Events
export const LF_PROGRESSBAR_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_PROGRESSBAR_PARTS = {
  icon: "icon",
  label: "label",
  mu: "mu",
  percentage: "percentage",
  progressbar: "progressbar",
  text: "text",
  track: "track",
} as const;
//#endregion

//#region Props
export const LF_PROGRESSBAR_PROPS = [
  "lfAnimated",
  "lfCenteredLabel",
  "lfIcon",
  "lfIsRadial",
  "lfLabel",
  "lfStyle",
  "lfUiSize",
  "lfUiState",
  "lfValue",
] as const satisfies (keyof LfProgressbarPropsInterface)[];
//#endregion

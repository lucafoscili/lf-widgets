import { LfSpinnerPropsInterface } from "./spinner.declarations";

//#region Blocks
/**
 * BEM block structure for the spinner component.
 * Maps directly to CSS classes and DOM refs.
 * @see Section 6.3 of 4_0_0_REFACTORING.md
 */
export const LF_SPINNER_BLOCKS = {
  spinner: {
    _: "spinner",
    wrapper: "wrapper",
    master: "master",
    bar: "bar",
    widget: "widget",
    fader: "fader",
  },
} as const;
//#endregion

//#region IDs
/**
 * DOM element IDs used by the spinner component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_SPINNER_IDS = {
  spinner: "spinner",
  wrapper: "wrapper",
  master: "master",
  bar: "bar",
  widget: "widget",
  fader: "fader",
} as const;
//#endregion

//#region Events
export const LF_SPINNER_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_SPINNER_PARTS = {
  spinner: "spinner",
  wrapper: "wrapper",
  master: "master",
} as const;
//#endregion

//#region Props
export const LF_SPINNER_PROPS = [
  "lfActive",
  "lfBarVariant",
  "lfDimensions",
  "lfFader",
  "lfFaderTimeout",
  "lfFullScreen",
  "lfLayout",
  "lfStyle",
  "lfTimeout",
] as const satisfies (keyof LfSpinnerPropsInterface)[];
//#endregion

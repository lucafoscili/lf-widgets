import { LfSpinnerPropsInterface } from "./spinner.declarations";

//#region Layouts
/**
 * Available spinner layout types.
 * Each layout has a unique visual style optimized for different use cases.
 */
export const LF_SPINNER_LAYOUTS = [
  "ring", // Classic rotating ring with gap
  "dots", // 3 bouncing dots in a row
  "bars", // Equalizer-style vertical bars
  "spinner", // Chasing dots in a circle
  "grid", // 3x3 pulsing grid
  "icon", // Custom icon with animation
  "pulse", // Single pulsing circle
  "wave", // Wave animation
] as const;

/**
 * Union type of available spinner layouts.
 */
export type LfSpinnerLayout = (typeof LF_SPINNER_LAYOUTS)[number];
//#endregion

//#region Blocks
/**
 * BEM block structure for the spinner component.
 * Maps directly to CSS classes and DOM refs.
 * @see Section 6.3 of 4_0_0_REFACTORING.md
 */
export const LF_SPINNER_BLOCKS = {
  spinner: {
    _: "spinner",
    content: "content",
    fader: "fader",
    icon: "icon",
    bar: "bar",
    barFill: "bar-fill",
  },
} as const;
//#endregion

//#region CSS Variables
/**
 * CSS custom properties exposed by the spinner component.
 */
export const LF_SPINNER_CSS_VARS = {
  size: "--lf-spinner-size",
  color: "--lf-spinner-color",
  colorBg: "--lf-spinner-color-bg",
  speed: "--lf-spinner-speed",
  stroke: "--lf-spinner-stroke",
} as const;
//#endregion

//#region IDs
/**
 * DOM element IDs used by the spinner component.
 * Structure mirrors BLOCKS for consistency.
 */
export const LF_SPINNER_IDS = {
  spinner: "spinner",
  content: "content",
  fader: "fader",
  bar: "bar",
} as const;
//#endregion

//#region Events
export const LF_SPINNER_EVENTS = ["ready", "unmount"] as const;
//#endregion

//#region Parts
export const LF_SPINNER_PARTS = {
  spinner: "spinner",
  content: "content",
  fader: "fader",
  bar: "bar",
} as const;
//#endregion

//#region Props
export const LF_SPINNER_PROPS = [
  "lfActive",
  "lfBarVariant",
  "lfFader",
  "lfFaderTimeout",
  "lfFullScreen",
  "lfIcon",
  "lfLayout",
  "lfStyle",
  "lfTimeout",
  "lfUiSize",
  "lfUiState",
] as const satisfies (keyof LfSpinnerPropsInterface)[];
//#endregion

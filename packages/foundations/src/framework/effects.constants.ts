//#region
export const LF_EFFECTS_FOCUSABLES = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable]",
] as const;
//#endregion

//#region Effects
export const LF_EFFECTS_LIST = [
  "backdrop",
  "lightbox",
  "neon-glow",
  "ripple",
  "tilt",
] as const;

export const LF_EFFECTS_NEON_MODES = ["filled", "outline"] as const;

export const LF_EFFECTS_NEON_PULSE_SPEEDS = [
  "burst",
  "fast",
  "normal",
  "slow",
] as const;
//#endregion

//#region Vars
export const LF_EFFECTS_VARS = {
  neonGlow: {
    color: "--lf-ui-neon-color",
    intensity: "--lf-ui-neon-intensity",
    mode: "--lf-ui-neon-mode",
    pulseDuration: "--lf-ui-neon-pulse-duration",
    reflectionBlur: "--lf-ui-neon-reflection-blur",
    reflectionOffset: "--lf-ui-neon-reflection-offset",
    reflectionOpacity: "--lf-ui-neon-reflection-opacity",
  },
  ripple: {
    background: "--lf-ui-ripple-background",
    height: "--lf-ui-ripple-height",
    width: "--lf-ui-ripple-width",
    x: "--lf-ui-ripple-x",
    y: "--lf-ui-ripple-y",
  },
  tilt: {
    x: "--lf-ui-tilt-x",
    y: "--lf-ui-tilt-y",
    lightX: "--lf-ui-tilt-light-x",
    lightY: "--lf-ui-tilt-light-y",
  },
  lightbox: {
    portal: "portal",
  },
} as const;
//#endregion

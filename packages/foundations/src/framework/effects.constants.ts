//#region Focusables
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

//#region Layer
/**
 * Data attributes for effect layers.
 */
export const LF_EFFECTS_LAYER_ATTRIBUTES = {
  /** Marks an element as a host for effect layers */
  host: "data-lf-effect-host",
  /** The effect layer identifier attribute */
  layer: "data-lf-effect-layer",
  /** The registration order attribute */
  order: "data-lf-effect-order",
} as const;

/**
 * Base z-index for effect layers.
 * Layers are stacked starting from this value.
 */
export const LF_EFFECTS_LAYER_BASE_Z_INDEX = 1;

/**
 * Default layer configuration values.
 */
export const LF_EFFECTS_LAYER_DEFAULTS = {
  insertPosition: "prepend",
  inheritBorderRadius: true,
  pointerEvents: false,
} as const;

/**
 * Layer insert positions.
 */
export const LF_EFFECTS_LAYER_POSITIONS = ["prepend", "append"] as const;

/**
 * CSS variable used by the layer manager to compose transforms.
 * All effects contribute their transforms via this single variable.
 */
export const LF_EFFECTS_TRANSFORM_VAR = "--lf-effects-transform";

/**
 * Priority levels for transform composition order.
 * Lower priority = applied first in the transform chain.
 * Transform order matters: perspective should be first, then rotations, then scale, then translate.
 */
export const LF_EFFECTS_TRANSFORM_PRIORITY = {
  /** Perspective - always first for 3D context */
  perspective: 0,
  /** Rotations (tilt, flip, etc.) */
  rotate: 10,
  /** Scale (pulse, zoom, etc.) */
  scale: 20,
  /** Translate (bounce, shake, slide, etc.) */
  translate: 30,
} as const;
//#endregion

//#region Effects
export const LF_EFFECTS_LIST = [
  "backdrop",
  "lightbox",
  "neon-glow",
  "ripple",
  "tilt",
] as const;

/**
 * Effects that can be registered/unregistered on elements.
 * Unlike ripple (fire-and-forget), these persist until explicitly removed.
 */
export const LF_EFFECTS_REGISTERABLE = ["neon-glow", "tilt"] as const;

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
    /** Highlight position X (0-100%) */
    lightX: "--lf-ui-tilt-light-x",
    /** Highlight position Y (0-100%) */
    lightY: "--lf-ui-tilt-light-y",
  },
  lightbox: {
    portal: "portal",
  },
} as const;
//#endregion

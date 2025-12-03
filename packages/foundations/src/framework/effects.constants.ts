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
  /** The effect layer identifier attribute */
  layer: "data-lf-effect-layer",
  /** Opt-in to disable inherited border-radius */
  noRadius: "data-lf-no-radius",
  /** The registration order attribute */
  order: "data-lf-effect-order",
  /** Opt-in to enable pointer events on layer */
  pointerEvents: "data-lf-pointer-events",
} as const;

/**
 * Per-effect host attributes.
 * Each effect has its own host attribute for targeted CSS styling.
 * This allows granular control over host properties per effect type.
 */
export const LF_EFFECTS_HOST_ATTRIBUTES = {
  /** Host attribute for neon-glow effect */
  neonGlow: "data-lf-neon-glow-host",
  /** Host attribute for ripple effect */
  ripple: "data-lf-ripple-host",
  /** Host attribute for tilt effect */
  tilt: "data-lf-tilt-host",
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
export const LF_EFFECTS_TRANSFORM_VAR = "--lf-ui-effects-transform";

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
 * These persist until explicitly removed.
 */
export const LF_EFFECTS_REGISTERABLE = ["neon-glow", "ripple", "tilt"] as const;

/**
 * Layer names for each effect.
 * Used as values for data-lf-effect-layer attribute and CSS selectors.
 */
export const LF_EFFECTS_LAYER_NAMES = {
  neonGlow: {
    border: "neon-glow-border",
    glow: "neon-glow",
    reflection: "neon-glow-reflection",
  },
  ripple: {
    surface: "ripple",
  },
  tilt: {
    highlight: "tilt-highlight",
  },
} as const;

/**
 * Effect identifiers used for transform registration.
 */
export const LF_EFFECTS_IDS = {
  neonGlow: "neon-glow",
  ripple: "ripple",
  tilt: "tilt",
} as const;

export const LF_EFFECTS_NEON_MODES = ["filled", "outline"] as const;

export const LF_EFFECTS_NEON_PULSE_SPEEDS = [
  "burst",
  "fast",
  "normal",
  "slow",
] as const;

/**
 * Default values for neon-glow effect options.
 */
export const LF_EFFECTS_NEON_DEFAULTS: {
  desync: boolean;
  intensity: number;
  mode: "outline" | "filled";
  pulseSpeed: "burst" | "fast" | "normal" | "slow";
  reflection: boolean;
  reflectionBlur: number;
  reflectionOffset: number;
  reflectionOpacity: number;
} = {
  desync: false,
  intensity: 0.7,
  mode: "outline",
  pulseSpeed: "burst",
  reflection: false,
  reflectionBlur: 12,
  reflectionOffset: 2.5,
  reflectionOpacity: 0.5,
};

/**
 * Default values for ripple effect options.
 */
export const LF_EFFECTS_RIPPLE_DEFAULTS: {
  autoSurfaceRadius: boolean;
  borderRadius: string;
  color: string;
  duration: number;
  easing: string;
  scale: number;
} = {
  autoSurfaceRadius: true,
  borderRadius: "",
  color: "",
  duration: 500,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  scale: 1,
};

/**
 * Default values for tilt effect options.
 */
export const LF_EFFECTS_TILT_DEFAULTS: {
  intensity: number;
} = {
  intensity: 10,
};
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
    borderRadius: "--lf-ui-ripple-border-radius",
    duration: "--lf-ui-ripple-duration",
    easing: "--lf-ui-ripple-easing",
    height: "--lf-ui-ripple-height",
    opacity: "--lf-ui-ripple-opacity",
    scale: "--lf-ui-ripple-scale",
    width: "--lf-ui-ripple-width",
    x: "--lf-ui-ripple-x",
    y: "--lf-ui-ripple-y",
  },
  tilt: {
    /** Highlight position X (0-100%) */
    lightX: "--lf-ui-tilt-light-x",
    /** Highlight position Y (0-100%) */
    lightY: "--lf-ui-tilt-light-y",
    /** Rotation around X axis (degrees) */
    rotateX: "--lf-ui-tilt-rotate-x",
    /** Rotation around Y axis (degrees) */
    rotateY: "--lf-ui-tilt-rotate-y",
  },
} as const;
//#endregion

import { LfColorInput } from "./color.declarations";
import {
  LF_EFFECTS_LIST,
  LF_EFFECTS_NEON_MODES,
  LF_EFFECTS_NEON_PULSE_SPEEDS,
} from "./effects.constants";

//#region Neon Glow
/**
 * Display mode for neon glow effect.
 * - "outline": Glow on border only, transparent interior
 * - "filled": Glow on border with translucent filled interior
 */
export type LfEffectsNeonGlowMode = (typeof LF_EFFECTS_NEON_MODES)[number];

/**
 * Pulse animation speed preset.
 */
export type LfEffectsNeonGlowPulseSpeed =
  (typeof LF_EFFECTS_NEON_PULSE_SPEEDS)[number];

/**
 * Configuration options for the neon glow effect.
 */
export interface LfEffectsNeonGlowOptions {
  /** Custom glow color. Defaults to theme secondary color. */
  color?: LfColorInput;
  /**
   * Enables entropy-driven animation timing.
   * When true, adds a random delay (0-5s) to desynchronize multiple elements.
   * Creates organic, non-uniform flickering like independent neon signs.
   * Defaults to false.
   */
  desync?: boolean;
  /** Glow intensity from 0 to 1. Defaults to 0.7. */
  intensity?: number;
  /** Display mode: "outline" or "filled". Defaults to "outline". */
  mode?: LfEffectsNeonGlowMode;
  /**
   * Pulse animation speed preset.
   * - "burst": Long pauses with intermittent flickers (~8s cycle) - cyberpunk style
   * - "fast": Rapid pulsing (1.2s)
   * - "normal": Moderate pulsing (2s)
   * - "slow": Gentle pulsing (3.5s)
   * Defaults to "burst".
   */
  pulseSpeed?: LfEffectsNeonGlowPulseSpeed;
  /** Whether to show reflection below element. Defaults to true. */
  reflection?: boolean;
  /** Reflection blur amount in pixels. Defaults to 8. */
  reflectionBlur?: number;
  /** Reflection vertical offset in pixels. Defaults to 4. */
  reflectionOffset?: number;
  /** Reflection opacity from 0 to 1. Defaults to 0.3. */
  reflectionOpacity?: number;
}
//#endregion

//#region Class
/**
 * Primary interface exposing the visual effects helpers.
 */
export interface LfEffectsInterface {
  /** Backdrop overlay helper used by modal/lightbox effects. */
  backdrop: {
    /** Hides the backdrop and removes it from the DOM. */
    hide: () => void;
    /** Returns true when the backdrop element is present. */
    isVisible: () => boolean;
    /** Shows the backdrop and optionally registers a close callback. */
    show: (onClose?: () => void) => void;
  };
  /** Checks if the element already has effects registered. */
  isRegistered: (element: HTMLElement) => boolean;
  /** API for cloning an element into a fullscreen lightbox overlay. */
  lightbox: {
    /** Closes the lightbox if open. */
    hide: () => void;
    /** Returns true when a lightbox clone is currently displayed. */
    isVisible: () => boolean;
    /** Opens the lightbox with the provided element; accepts optional close callback. */
    show: (element: HTMLElement, closeCb?: (...args: any[]) => void) => void;
  };
  /** Effect registration helpers. */
  register: {
    /** Adds neon glow effect to the element with optional configuration. */
    neonGlow: (
      element: HTMLElement,
      options?: LfEffectsNeonGlowOptions,
    ) => void;
    /** Adds tilt effect behaviour to the element with optional intensity override. */
    tilt: (element: HTMLElement, intensity?: number) => void;
  };
  /** Triggers a ripple animation on the provided element. */
  ripple: (
    e: PointerEvent,
    element: HTMLElement,
    autoSurfaceRadius?: boolean,
  ) => void;
  set: {
    /** Overrides stored intensity presets for specific effects. */
    intensity: (key: keyof LfEffectsIntensities, value: number) => void;
    /** Overrides timeout durations (lightbox fade, ripple cleanup, etc.). */
    timeout: (key: keyof LfEffectsTimeouts, value: number) => void;
  };
  /** Removes registered effects from elements. */
  unregister: {
    /** Removes neon glow effect from the element. */
    neonGlow: (element: HTMLElement) => void;
    /** Removes tilt effect listeners for the element. */
    tilt: (element: HTMLElement) => void;
  };
}
//#endregion

//#region Utilities
/** Mapping from effect name to numeric intensity overrides. */
export type LfEffectsIntensities = Partial<{
  [index: LfEffectsValues[number]]: number;
}>;
/** Mapping from effect name to custom timeout durations (ms). */
export type LfEffectsTimeouts = Partial<{
  [index: LfEffectsValues[number]]: number;
}>;
/** Enumeration of known effect identifiers (tilt, ripple, etc.). */
export type LfEffectsValues = (typeof LF_EFFECTS_LIST)[number];
//#endregion

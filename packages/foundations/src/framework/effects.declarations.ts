import { LF_EFFECTS_LIST } from "./effects.constants";

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

import { LfColorInput } from "./color.declarations";
import {
  LF_EFFECTS_LAYER_POSITIONS,
  LF_EFFECTS_LIST,
  LF_EFFECTS_NEON_MODES,
  LF_EFFECTS_NEON_PULSE_SPEEDS,
  LF_EFFECTS_REGISTERABLE,
} from "./effects.constants";

//#region Layer Manager
/**
 * Insert position for effect layers.
 * - "prepend": Insert before content (default for visual underlays)
 * - "append": Insert after content (for overlays that should be on top)
 */
export type LfEffectLayerPosition = (typeof LF_EFFECTS_LAYER_POSITIONS)[number];

/**
 * Configuration for registering an effect layer.
 * Used by the layer manager to create isolated DOM elements for effects.
 */
export interface LfEffectLayerConfig {
  /**
   * Unique effect identifier (e.g., "neon-glow", "tilt", "ripple").
   * Used as the value for data-lf-effect-layer attribute.
   */
  name: string;

  /**
   * Where to insert the layer relative to content.
   * - "prepend": Before content (default for visual underlays like glow)
   * - "append": After content (for overlays like highlights)
   * @default "prepend"
   */
  insertPosition?: LfEffectLayerPosition;

  /**
   * Whether the layer should inherit border-radius from the host.
   * @default true
   */
  inheritBorderRadius?: boolean;

  /**
   * Whether the layer should capture pointer events.
   * Most effects should be pointer-events: none, but ripple needs interaction.
   * @default false
   */
  pointerEvents?: boolean;

  /**
   * Optional: Override z-index calculation.
   * If not provided, z-index is assigned dynamically based on registration order.
   * Use sparingly — prefer dynamic ordering for composability.
   */
  zIndexOverride?: number;

  /**
   * Callback invoked after layer is created and inserted into DOM.
   * Use for setting up animations, observers, event listeners.
   *
   * @param layer - The created layer element
   * @param host - The host element the layer belongs to
   */
  onSetup?: (layer: HTMLElement, host: HTMLElement) => void;

  /**
   * Callback invoked before layer is removed from DOM.
   * Use for cleanup (disconnect observers, remove listeners).
   *
   * @param layer - The layer element being removed
   * @param host - The host element the layer belongs to
   */
  onCleanup?: (layer: HTMLElement, host: HTMLElement) => void;
}

/**
 * Tracked layer data for cleanup and reordering.
 */
export interface LfEffectLayerData {
  /** The DOM element representing this layer */
  layer: HTMLElement;
  /** The configuration used to create this layer */
  config: LfEffectLayerConfig;
  /** Registration order (used for z-index calculation) */
  order: number;
}

/**
 * Layer manager API for creating and managing effect layers.
 * Handles DOM injection, z-index ordering, and lifecycle callbacks.
 */
export interface LfEffectLayerManager {
  /**
   * Creates and injects a layer for the given effect.
   * Handles both shadow DOM and light DOM scenarios.
   *
   * @param host - The element to attach the layer to
   * @param config - Layer configuration
   * @returns The created layer element
   */
  register: (host: HTMLElement, config: LfEffectLayerConfig) => HTMLElement;

  /**
   * Removes a layer and runs cleanup callbacks.
   *
   * @param host - The element the layer is attached to
   * @param effectName - The effect name to unregister
   */
  unregister: (host: HTMLElement, effectName: string) => void;

  /**
   * Gets an existing layer for an effect on the host.
   *
   * @param host - The element to check
   * @param effectName - The effect name to look for
   * @returns The layer element, or null if not found
   */
  getLayer: (host: HTMLElement, effectName: string) => HTMLElement | null;

  /**
   * Gets all layers registered on a host, ordered by z-index.
   *
   * @param host - The element to check
   * @returns Array of layer elements, sorted by registration order
   */
  getAllLayers: (host: HTMLElement) => HTMLElement[];

  /**
   * Recalculates z-indices for all layers on a host.
   * Called automatically after register/unregister.
   *
   * @param host - The element whose layers should be reordered
   */
  reorderLayers: (host: HTMLElement) => void;

  /**
   * Registers a transform contribution from an effect.
   * The layer manager composes all transforms into a single CSS variable.
   *
   * @param host - The element to apply transforms to
   * @param effectName - Unique identifier for this effect's transform
   * @param transform - CSS transform value (e.g., "rotateX(5deg) rotateY(10deg)")
   * @param priority - Order priority (lower = applied first). Use LF_EFFECTS_TRANSFORM_PRIORITY.
   */
  registerTransform: (
    host: HTMLElement,
    effectName: string,
    transform: string,
    priority?: number,
  ) => void;

  /**
   * Updates an existing transform contribution.
   * More efficient than unregister + register for dynamic effects like tilt.
   *
   * @param host - The element with the transform
   * @param effectName - The effect name to update
   * @param transform - New CSS transform value
   */
  updateTransform: (
    host: HTMLElement,
    effectName: string,
    transform: string,
  ) => void;

  /**
   * Removes a transform contribution from an effect.
   * Recomposes the remaining transforms automatically.
   *
   * @param host - The element with the transform
   * @param effectName - The effect name to remove
   */
  unregisterTransform: (host: HTMLElement, effectName: string) => void;
}
//#endregion

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

//#region Ripple
/**
 * Configuration options for the ripple effect.
 */
export interface LfEffectsRippleOptions {
  /**
   * Auto-apply parent's border-radius to surface.
   * When true, inherits border-radius from the parent element.
   * Defaults to true.
   */
  autoSurfaceRadius?: boolean;
  /**
   * Custom ripple color (CSS color value).
   * If not provided, uses the parent element's color or backgroundColor.
   */
  color?: string;
  /**
   * Animation duration in milliseconds.
   * Controls how long the ripple animation takes.
   * Defaults to 500.
   */
  duration?: number;
  /**
   * CSS easing function for the ripple animation.
   * Defaults to "cubic-bezier(0.4, 0, 0.2, 1)".
   */
  easing?: string;
  /**
   * Scale factor for ripple size.
   * 1 = element size, 2 = double size, etc.
   * Defaults to 1.
   */
  scale?: number;
}
//#endregion

//#region Registerable Effects
/**
 * Effect names that can be registered/unregistered on elements.
 * These persist until explicitly removed.
 */
export type LfEffectName = (typeof LF_EFFECTS_REGISTERABLE)[number];
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
  /**
   * Checks if an element has effects registered.
   * @param element - The element to check
   * @param effectName - Optional: check for a specific effect. If omitted, checks for any effect.
   * @returns true if the element has the specified effect (or any effect if not specified)
   */
  isRegistered: (element: HTMLElement, effectName?: LfEffectName) => boolean;
  /**
   * Layer manager for creating and managing isolated effect layers.
   * Use this for effects that need their own DOM element to avoid pseudo-element conflicts.
   */
  layers: LfEffectLayerManager;
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
    /**
     * Registers ripple effect on an element.
     * Creates a ripple surface layer and attaches pointerdown listener.
     * @param element - The element to add ripple effect to
     * @param options - Configuration options (duration, color, scale, easing)
     */
    ripple: (element: HTMLElement, options?: LfEffectsRippleOptions) => void;
    /** Adds tilt effect behaviour to the element with optional intensity override. */
    tilt: (element: HTMLElement, intensity?: number) => void;
  };
  /**
   * @deprecated Use register.ripple() for new implementations.
   * Triggers a one-off ripple animation on the provided element.
   * Kept for backward compatibility with existing component internals.
   */
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
    /** Removes ripple effect from the element. */
    ripple: (element: HTMLElement) => void;
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

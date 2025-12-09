import {
  LF_EFFECTS_HOST_ATTRIBUTES,
  LF_EFFECTS_LAYER_NAMES,
  LF_EFFECTS_SPOTLIGHT_DEFAULTS,
  LF_EFFECTS_SPOTLIGHT_PRESETS,
  LF_EFFECTS_VARS,
  LfEffectsSpotlightOptions,
  LfEffectsSpotlightState,
} from "@lf-widgets/foundations";
import { layerManager } from "./helpers.layers";

//#region Constants
const LAYER_NAMES = LF_EFFECTS_LAYER_NAMES.spotlight;
const HOST_ATTRIBUTE = LF_EFFECTS_HOST_ATTRIBUTES.spotlight;
const DEFAULTS = LF_EFFECTS_SPOTLIGHT_DEFAULTS;
const PRESETS = LF_EFFECTS_SPOTLIGHT_PRESETS;
const VARS = LF_EFFECTS_VARS.spotlight;
//#endregion

//#region Types
interface SpotlightElementData {
  pointerenterHandler: () => void;
  pointerleaveHandler: () => void;
  pointermoveHandler?: (e: PointerEvent) => void;
  state: LfEffectsSpotlightState;
  options: Required<LfEffectsSpotlightOptions>;
  layerCleanup: (() => void)[];
  cachedRect?: DOMRect;
}
//#endregion

//#region State
const elementData = new WeakMap<HTMLElement, SpotlightElementData>();
//#endregion

//#region Helpers
/**
 * Merges defaults, preset, and user options (user options take precedence).
 */
const applyPreset = (
  options: LfEffectsSpotlightOptions,
): Required<LfEffectsSpotlightOptions> => {
  const preset = options.beam ? PRESETS[options.beam] : {};
  return {
    ...DEFAULTS,
    ...preset,
    ...options,
  } as Required<LfEffectsSpotlightOptions>;
};

/**
 * Applies CSS custom properties to the element based on options.
 */
const updateCSSVars = (
  element: HTMLElement,
  options: Required<LfEffectsSpotlightOptions>,
): void => {
  const style = element.style;
  style.setProperty(VARS.color, options.color);
  style.setProperty(VARS.angle, `${options.angle}deg`);
  style.setProperty(VARS.intensity, String(options.intensity));
  style.setProperty(VARS.originX, `${options.originX}%`);
  style.setProperty(VARS.fadeIn, `${options.fadeInDuration}ms`);
  style.setProperty(VARS.fadeOut, `${options.fadeOutDuration}ms`);
  style.setProperty(VARS.surfaceGlow, String(options.surfaceGlowIntensity));
  style.setProperty(VARS.swayDuration, `${options.swayDuration}ms`);
  style.setProperty(VARS.swayAmplitude, `${options.swayAmplitude}deg`);
};

/**
 * Clears all spotlight CSS custom properties from the element.
 */
const clearCSSVars = (element: HTMLElement): void => {
  Object.values(VARS).forEach((prop) => {
    element.style.removeProperty(prop);
  });
};

/**
 * Transitions the spotlight to a new state.
 */
const transitionToState = (
  element: HTMLElement,
  newState: LfEffectsSpotlightState,
): void => {
  const data = elementData.get(element);
  if (!data) return;

  data.state = newState;
  element.dataset.lfSpotlight = newState;
};
//#endregion

//#region Public API
/**
 * Spotlight effect implementation.
 * Creates a theatrical spotlight/light beam effect that illuminates elements from above.
 */
export const spotlightEffect = {
  /**
   * Registers the spotlight effect on an element.
   * Creates light beam and surface glow layers with configurable options.
   *
   * @param element - The element to apply the spotlight effect to
   * @param options - Configuration options for the spotlight
   */
  register: (
    element: HTMLElement,
    options: LfEffectsSpotlightOptions = {},
  ): void => {
    // Skip if already registered
    if (elementData.has(element)) return;

    const mergedOptions = applyPreset(options);
    const cleanupFns: (() => void)[] = [];

    // Set host attribute and initial state
    element.setAttribute(HOST_ATTRIBUTE, "");
    element.dataset.lfSpotlight =
      mergedOptions.trigger === "always" ? "on" : "off";

    // Enable sway if configured
    if (mergedOptions.sway) {
      element.dataset.lfSpotlightSway = "";
    }

    // Register beam layer
    if (layerManager) {
      const beamLayer = layerManager.register(element, {
        name: LAYER_NAMES.beam,
        hostAttribute: HOST_ATTRIBUTE,
        insertPosition: "prepend",
      });

      if (beamLayer) {
        cleanupFns.push(() =>
          layerManager.unregister(element, LAYER_NAMES.beam),
        );
      }

      // Register surface glow layer (if enabled)
      if (mergedOptions.surfaceGlow) {
        const glowLayer = layerManager.register(element, {
          name: LAYER_NAMES.glow,
          hostAttribute: HOST_ATTRIBUTE,
          insertPosition: "prepend",
        });

        if (glowLayer) {
          cleanupFns.push(() =>
            layerManager.unregister(element, LAYER_NAMES.glow),
          );
        }
      }
    }

    // Apply CSS custom properties
    updateCSSVars(element, mergedOptions);

    // Event handlers
    const pointerenterHandler = (): void => {
      if (mergedOptions.trigger !== "hover") return;

      // Cache rect for pointer-follow performance
      const data = elementData.get(element);
      if (data && mergedOptions.followPointer) {
        data.cachedRect = element.getBoundingClientRect();
      }

      transitionToState(element, "fading");

      // Transition to "on" after fade-in completes
      setTimeout(() => {
        const currentData = elementData.get(element);
        if (currentData?.state === "fading") {
          transitionToState(element, "on");
        }
      }, mergedOptions.fadeInDuration);
    };

    const pointerleaveHandler = (): void => {
      if (mergedOptions.trigger !== "hover") return;

      transitionToState(element, "dimming");

      // Transition to "off" after fade-out completes
      setTimeout(() => {
        const currentData = elementData.get(element);
        if (currentData?.state === "dimming") {
          transitionToState(element, "off");
        }
      }, mergedOptions.fadeOutDuration);
    };

    // Optional pointer follow handler
    let pointermoveHandler: ((e: PointerEvent) => void) | undefined;
    if (mergedOptions.followPointer) {
      pointermoveHandler = (e: PointerEvent): void => {
        const data = elementData.get(element);
        if (!data?.cachedRect) return;

        const { left, width } = data.cachedRect;
        const x = ((e.clientX - left) / width) * 100;
        // Clamp to 0-100 range
        const clampedX = Math.max(0, Math.min(100, x));
        element.style.setProperty(VARS.originX, `${clampedX}%`);
      };
    }

    // Attach event listeners based on trigger mode
    if (mergedOptions.trigger === "hover") {
      element.addEventListener("pointerenter", pointerenterHandler);
      element.addEventListener("pointerleave", pointerleaveHandler);

      if (pointermoveHandler) {
        element.addEventListener("pointermove", pointermoveHandler);
      }
    }

    // Store element data
    elementData.set(element, {
      pointerenterHandler,
      pointerleaveHandler,
      pointermoveHandler,
      state: mergedOptions.trigger === "always" ? "on" : "off",
      options: mergedOptions,
      layerCleanup: cleanupFns,
    });
  },

  /**
   * Unregisters the spotlight effect from an element.
   * Removes layers, event listeners, and cleans up CSS custom properties.
   *
   * @param element - The element to remove the spotlight effect from
   */
  unregister: (element: HTMLElement): void => {
    const data = elementData.get(element);
    if (!data) return;

    // Remove event listeners
    element.removeEventListener("pointerenter", data.pointerenterHandler);
    element.removeEventListener("pointerleave", data.pointerleaveHandler);

    if (data.pointermoveHandler) {
      element.removeEventListener("pointermove", data.pointermoveHandler);
    }

    // Cleanup layers
    data.layerCleanup.forEach((cleanup) => cleanup());

    // Remove host attribute and state data attributes
    element.removeAttribute(HOST_ATTRIBUTE);
    delete element.dataset.lfSpotlight;
    delete element.dataset.lfSpotlightSway;

    // Clear CSS custom properties
    clearCSSVars(element);

    // Remove from WeakMap
    elementData.delete(element);
  },
};
//#endregion

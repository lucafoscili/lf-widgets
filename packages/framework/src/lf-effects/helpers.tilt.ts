import { LF_EFFECTS_VARS, LfEffectLayerManager } from "@lf-widgets/foundations";
import {
  createAdoptedStylesManager,
  createCachedCssGetter,
} from "./helpers.adopted-styles";

//#region Constants
const LAYER_NAME = "tilt-highlight";
//#endregion

//#region CSS Configuration
/**
 * Gets the cached tilt :host() CSS string using shared utilities.
 * Includes both [data-lf-tilt] and :host([data-lf-tilt]) selectors for shadow DOM.
 */
const getTiltCss = createCachedCssGetter({
  selectorFilter: (k) =>
    k.includes("data-lf-tilt") ||
    k.includes(`data-lf-effect-layer="${LAYER_NAME}"`) ||
    k.startsWith(":host([data-lf-tilt]"),
  hostTransform: (selector) => {
    if (selector.startsWith(":host(")) return selector;
    if (!selector.startsWith("[data-lf-tilt]")) return selector;
    return selector.replace(/^\[data-lf-tilt\]/, ":host([data-lf-tilt])");
  },
});
//#endregion

//#region State
/**
 * Tracks element-specific data for cleanup (event listeners and layer).
 */
const elementData = new WeakMap<
  HTMLElement,
  {
    pointermoveHandler: (e: PointerEvent) => void;
    pointerleaveHandler: () => void;
    layerCleanup?: () => void;
  }
>();

/**
 * Shared adopted styles manager for tilt effect.
 */
const stylesManager = createAdoptedStylesManager(getTiltCss);

/**
 * Reference to the layer manager (set during registration).
 */
let layerManagerRef: LfEffectLayerManager | null = null;
//#endregion

//#region Public API
export const tiltEffect = {
  /**
   * Sets the layer manager reference for creating highlight layers.
   * Must be called before registering tilt effects.
   *
   * @param manager - The layer manager instance from lf-effects
   */
  setLayerManager: (manager: LfEffectLayerManager): void => {
    layerManagerRef = manager;
  },

  /**
   * Registers the tilt effect on an element.
   * Creates a 3D tilt/hover effect with dynamic radial highlight using layers.
   *
   * @param element - The element to apply the tilt effect to
   * @param intensity - Tilt intensity in degrees (default: 10)
   */
  register: (element: HTMLElement, intensity = 10): void => {
    const { tilt } = LF_EFFECTS_VARS;
    const elementShadowRoot = element.shadowRoot;

    if (elementShadowRoot) {
      stylesManager.adopt(elementShadowRoot);
    }

    let layerCleanup: (() => void) | undefined;
    if (layerManagerRef) {
      const layer = layerManagerRef.register(element, {
        name: LAYER_NAME,
        onSetup: (layerEl) => {
          // Inherit border-radius from the element
          const computedStyle = getComputedStyle(element);
          layerEl.style.borderRadius = computedStyle.borderRadius;
        },
      });

      if (layer) {
        layerCleanup = () => layerManagerRef?.unregister(element, LAYER_NAME);
      }
    }

    const pointermoveHandler = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      const { height, left, top, width } = element.getBoundingClientRect();

      // Calculate normalized position (0-1)
      const normalizedX = (clientX - left) / width;
      const normalizedY = (clientY - top) / height;

      // Calculate rotation angles from center (0.5 offset)
      const rotateY = (normalizedX - 0.5) * intensity;
      const rotateX = -(normalizedY - 0.5) * intensity;

      // Calculate highlight position (0-100%)
      const lightX = normalizedX * 100;
      const lightY = normalizedY * 100;

      element.style.setProperty(tilt.rotateX, `${rotateX}deg`);
      element.style.setProperty(tilt.rotateY, `${rotateY}deg`);
      element.style.setProperty(tilt.lightX, `${lightX}%`);
      element.style.setProperty(tilt.lightY, `${lightY}%`);
    };

    const pointerleaveHandler = () => {
      element.style.setProperty(tilt.rotateX, "0deg");
      element.style.setProperty(tilt.rotateY, "0deg");
      element.style.setProperty(tilt.lightX, "50%");
      element.style.setProperty(tilt.lightY, "50%");
    };

    elementData.set(element, {
      pointermoveHandler,
      pointerleaveHandler,
      layerCleanup,
    });

    element.addEventListener("pointermove", pointermoveHandler);
    element.addEventListener("pointerleave", pointerleaveHandler);

    element.dataset.lfTilt = "";
  },

  /**
   * Unregisters the tilt effect from an element.
   * Removes event listeners, layers, and cleans up CSS custom properties.
   *
   * @param element - The element to remove the tilt effect from
   */
  unregister: (element: HTMLElement): void => {
    const { tilt } = LF_EFFECTS_VARS;
    const data = elementData.get(element);
    const elementShadowRoot = element.shadowRoot;

    if (data) {
      element.removeEventListener("pointermove", data.pointermoveHandler);
      element.removeEventListener("pointerleave", data.pointerleaveHandler);

      if (data.layerCleanup) {
        data.layerCleanup();
      }

      elementData.delete(element);
    }

    if (elementShadowRoot) {
      stylesManager.release(elementShadowRoot);
    }

    element.style.removeProperty(tilt.rotateX);
    element.style.removeProperty(tilt.rotateY);
    element.style.removeProperty(tilt.lightX);
    element.style.removeProperty(tilt.lightY);

    delete element.dataset.lfTilt;
  },
};
//#endregion

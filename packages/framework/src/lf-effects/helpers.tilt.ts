import {
  LF_EFFECTS_HOST_ATTRIBUTES,
  LF_EFFECTS_IDS,
  LF_EFFECTS_LAYER_NAMES,
  LF_EFFECTS_TILT_DEFAULTS,
  LF_EFFECTS_TRANSFORM_PRIORITY,
  LF_EFFECTS_VARS,
} from "@lf-widgets/foundations";
import { layerManager } from "./helpers.layers";

//#region Constants
const LAYER_NAME = LF_EFFECTS_LAYER_NAMES.tilt.highlight;
const EFFECT_NAME = LF_EFFECTS_IDS.tilt;
const HOST_ATTRIBUTE = LF_EFFECTS_HOST_ATTRIBUTES.tilt;
const DEFAULTS = LF_EFFECTS_TILT_DEFAULTS;
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
//#endregion

//#region Public API
/**
 * Tilt effect implementation.
 *
 */
export const tiltEffect = {
  /**
   * Registers the tilt effect on an element.
   * Creates a 3D tilt/hover effect with dynamic radial highlight using layers.
   * Uses CSS variables for rotation values to avoid string recomposition on every frame.
   *
   * @param element - The element to apply the tilt effect to
   * @param intensity - Tilt intensity in degrees (default: 10)
   */
  register: (element: HTMLElement, intensity = DEFAULTS.intensity): void => {
    const { tilt } = LF_EFFECTS_VARS;

    // Initialize CSS variables for rotation (0deg default)
    element.style.setProperty(tilt.rotateX, "0deg");
    element.style.setProperty(tilt.rotateY, "0deg");

    let layerCleanup: (() => void) | undefined;
    if (layerManager) {
      // Register highlight layer (inherits border-radius via layer defaults)
      const layer = layerManager.register(element, {
        name: LAYER_NAME,
        hostAttribute: HOST_ATTRIBUTE,
      });

      if (layer) {
        layerCleanup = () => layerManager.unregister(element, LAYER_NAME);
      }

      layerManager.registerTransform(
        element,
        EFFECT_NAME,
        `perspective(1000px) rotateX(var(${tilt.rotateX}, 0deg)) rotateY(var(${tilt.rotateY}, 0deg))`,
        LF_EFFECTS_TRANSFORM_PRIORITY.perspective,
        HOST_ATTRIBUTE,
      );
    }

    const pointermoveHandler = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      const { height, left, top, width } = element.getBoundingClientRect();

      // Calculate normalized position (0-1)
      const normalizedX = (clientX - left) / width;
      const normalizedY = (clientY - top) / height;

      // Calculate rotation angles from center (0.5 offset)
      const rotateYVal = (normalizedX - 0.5) * intensity;
      const rotateXVal = -(normalizedY - 0.5) * intensity;

      // Calculate highlight position (0-100%)
      const lightX = normalizedX * 100;
      const lightY = normalizedY * 100;

      element.style.setProperty(tilt.rotateX, `${rotateXVal}deg`);
      element.style.setProperty(tilt.rotateY, `${rotateYVal}deg`);
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
  },

  /**
   * Unregisters the tilt effect from an element.
   * Removes event listeners, layers, transforms, and cleans up CSS custom properties.
   *
   * @param element - The element to remove the tilt effect from
   */
  unregister: (element: HTMLElement): void => {
    const { tilt } = LF_EFFECTS_VARS;
    const data = elementData.get(element);

    if (data) {
      element.removeEventListener("pointermove", data.pointermoveHandler);
      element.removeEventListener("pointerleave", data.pointerleaveHandler);

      if (data.layerCleanup) {
        data.layerCleanup();
      }

      elementData.delete(element);
    }

    // Unregister transform from layer manager
    layerManager.unregisterTransform(element, EFFECT_NAME);

    // Clean up all tilt CSS variables
    element.style.removeProperty(tilt.lightX);
    element.style.removeProperty(tilt.lightY);
    element.style.removeProperty(tilt.rotateX);
    element.style.removeProperty(tilt.rotateY);
  },
};
//#endregion

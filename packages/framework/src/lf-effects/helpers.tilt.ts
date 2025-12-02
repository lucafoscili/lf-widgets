import {
  LF_EFFECTS_TRANSFORM_PRIORITY,
  LF_EFFECTS_VARS,
  LfEffectLayerManager,
} from "@lf-widgets/foundations";

//#region Constants
const LAYER_NAME = "tilt-highlight";
const EFFECT_NAME = "tilt";
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
 * Reference to the layer manager (set during registration).
 */
let layerManagerRef: LfEffectLayerManager | null = null;
//#endregion

//#region Public API
/**
 * Tilt effect implementation.
 *
 */
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
   * Uses CSS variables for rotation values to avoid string recomposition on every frame.
   *
   * @param element - The element to apply the tilt effect to
   * @param intensity - Tilt intensity in degrees (default: 10)
   */
  register: (element: HTMLElement, intensity = 10): void => {
    const { tilt } = LF_EFFECTS_VARS;

    // Initialize CSS variables for rotation (0deg default)
    element.style.setProperty(tilt.rotateX, "0deg");
    element.style.setProperty(tilt.rotateY, "0deg");

    let layerCleanup: (() => void) | undefined;
    if (layerManagerRef) {
      // Register highlight layer
      const layer = layerManagerRef.register(element, {
        name: LAYER_NAME,
        onSetup: (layerEl) => {
          const computedStyle = getComputedStyle(element);
          layerEl.style.borderRadius = computedStyle.borderRadius;
        },
      });

      if (layer) {
        layerCleanup = () => layerManagerRef?.unregister(element, LAYER_NAME);
      }

      layerManagerRef.registerTransform(
        element,
        EFFECT_NAME,
        `perspective(1000px) rotateX(var(${tilt.rotateX}, 0deg)) rotateY(var(${tilt.rotateY}, 0deg))`,
        LF_EFFECTS_TRANSFORM_PRIORITY.perspective,
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

    element.dataset.lfTilt = "";
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
    layerManagerRef?.unregisterTransform(element, EFFECT_NAME);

    // Clean up all tilt CSS variables
    element.style.removeProperty(tilt.lightX);
    element.style.removeProperty(tilt.lightY);
    element.style.removeProperty(tilt.rotateX);
    element.style.removeProperty(tilt.rotateY);

    delete element.dataset.lfTilt;
  },
};
//#endregion

import {
  LF_EFFECTS_HOST_ATTRIBUTES,
  LF_EFFECTS_LAYER_NAMES,
  LF_EFFECTS_RIPPLE_DEFAULTS,
  LF_EFFECTS_VARS,
  LfEffectsRippleOptions,
} from "@lf-widgets/foundations";
import { layerManager } from "./helpers.layers";

//#region Constants
const LAYER_NAME = LF_EFFECTS_LAYER_NAMES.ripple.surface;
const HOST_ATTRIBUTE = LF_EFFECTS_HOST_ATTRIBUTES.ripple;
const DEFAULTS: Required<LfEffectsRippleOptions> = LF_EFFECTS_RIPPLE_DEFAULTS;
//#endregion

//#region State
/**
 * Tracks element-specific data for cleanup.
 * WeakMap ensures automatic cleanup when element is garbage collected.
 */
interface RippleElementData {
  handler: (e: PointerEvent) => void;
  options: Required<LfEffectsRippleOptions>;
}

const elementData = new WeakMap<HTMLElement, RippleElementData>();
//#endregion

//#region Helpers
/**
 * Gets computed styles from host element for ripple theming.
 */
const getHostStyle = (
  element: HTMLElement,
): Pick<CSSStyleDeclaration, "backgroundColor" | "borderRadius" | "color"> => {
  const { backgroundColor, borderRadius, color } = getComputedStyle(element);
  return {
    backgroundColor,
    borderRadius,
    color,
  };
};

/**
 * Creates and animates a single ripple element.
 *
 * @param e - The pointer event that triggered the ripple
 * @param surface - The ripple surface layer element
 * @param host - The host element (for computing styles)
 * @param options - Ripple configuration options
 */
const createRipple = (
  e: PointerEvent,
  surface: HTMLElement,
  host: HTMLElement,
  options: Required<LfEffectsRippleOptions>,
): void => {
  const { color, duration, easing, scale } = options;
  const { backgroundColor, color: hostColor } = getHostStyle(host);

  const { left, height: h, top, width: w } = surface.getBoundingClientRect();

  const rippleX = e.clientX - left - w / 2;
  const rippleY = e.clientY - top - h / 2;

  const { background, height, width, x, y } = LF_EFFECTS_VARS.ripple;
  const {
    duration: durationVar,
    easing: easingVar,
    scale: scaleVar,
  } = LF_EFFECTS_VARS.ripple;

  const ripple = document.createElement("span");
  ripple.dataset.lfRipple = "";

  // Use custom color or fallback to host's color/backgroundColor
  const rippleColor = color || hostColor || backgroundColor;

  ripple.style.setProperty(background, rippleColor);
  ripple.style.setProperty(height, `${h}px`);
  ripple.style.setProperty(width, `${w}px`);
  ripple.style.setProperty(x, `${rippleX}px`);
  ripple.style.setProperty(y, `${rippleY}px`);
  ripple.style.setProperty(durationVar, `${duration}ms`);
  ripple.style.setProperty(easingVar, easing);
  ripple.style.setProperty(scaleVar, String(scale));

  surface.appendChild(ripple);

  // Remove ripple after animation completes
  setTimeout(
    () =>
      requestAnimationFrame(() => {
        ripple.remove();
      }),
    duration,
  );
};
//#endregion

//#region Public API
export const rippleEffect = {
  /**
   * Registers ripple effect on an element.
   * Creates a ripple surface layer and attaches pointerdown listener.
   *
   * @param element - The host element to add ripple effect to
   * @param options - Configuration options
   */
  register: (
    element: HTMLElement,
    options: LfEffectsRippleOptions = {},
  ): void => {
    // Already registered?
    if (elementData.has(element)) {
      return;
    }

    const resolvedOptions: Required<LfEffectsRippleOptions> = {
      ...DEFAULTS,
      ...options,
    };

    const hasBorderRadius = Boolean(resolvedOptions.borderRadius);

    const surface = layerManager.register(element, {
      name: LAYER_NAME,
      hostAttribute: HOST_ATTRIBUTE,
      insertPosition: "append", // Surface should be on top for pointer events
      inheritBorderRadius: hasBorderRadius
        ? false
        : resolvedOptions.autoSurfaceRadius,
      pointerEvents: false, // Ripple surface doesn't capture events; host does
    });

    if (hasBorderRadius) {
      surface.style.borderRadius = resolvedOptions.borderRadius;
    }

    const handler = (e: PointerEvent) => {
      createRipple(e, surface, element, resolvedOptions);
    };

    elementData.set(element, { handler, options: resolvedOptions });

    element.addEventListener("pointerdown", handler);
  },

  /**
   * Unregisters ripple effect from an element.
   * Removes the surface layer and event listener.
   *
   * @param element - The host element to remove ripple effect from
   */
  unregister: (element: HTMLElement): void => {
    const data = elementData.get(element);

    if (data) {
      element.removeEventListener("pointerdown", data.handler);
      elementData.delete(element);
    }

    layerManager.unregister(element, LAYER_NAME);
  },
};
//#endregion

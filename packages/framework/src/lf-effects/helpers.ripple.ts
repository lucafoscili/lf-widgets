import {
  LF_EFFECTS_VARS,
  LfEffectsRippleOptions,
} from "@lf-widgets/foundations";
import { layerManager } from "./helpers.layers";

//#region Constants
const LAYER_NAME = "ripple-surface";

const DEFAULTS: Required<LfEffectsRippleOptions> = {
  autoSurfaceRadius: true,
  color: "",
  duration: 500,
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  scale: 1,
};
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

    // Create ripple surface layer via layer manager
    const surface = layerManager.register(element, {
      name: LAYER_NAME,
      insertPosition: "append", // Surface should be on top for pointer events
      inheritBorderRadius: resolvedOptions.autoSurfaceRadius,
      pointerEvents: false, // Ripple surface doesn't capture events; host does
    });

    // Create pointerdown handler
    const handler = (e: PointerEvent) => {
      createRipple(e, surface, element, resolvedOptions);
    };

    // Store for cleanup
    elementData.set(element, { handler, options: resolvedOptions });

    // Attach event listener to host element
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

  /**
   * @deprecated Use register() for new implementations.
   * Creates and triggers a one-off ripple effect on an element.
   * The ripple auto-removes after the animation completes.
   * Kept for backward compatibility with existing component internals.
   *
   * @param e - The pointer event that triggered the ripple
   * @param element - The ripple surface element to append the ripple to
   * @param timeout - Duration before ripple removal (default: 500ms)
   * @param autoSurfaceRadius - Whether to auto-apply parent's border radius (default: true)
   */
  trigger: (
    e: PointerEvent,
    element: HTMLElement,
    timeout = 500,
    autoSurfaceRadius = true,
  ): void => {
    if (!element) {
      return;
    }

    const { backgroundColor, borderRadius, color } = getHostStyle(
      element.parentElement ?? element,
    );

    const ripple = document.createElement("span");

    const { left, height: h, top, width: w } = element.getBoundingClientRect();

    const rippleX = e.clientX - left - w / 2;
    const rippleY = e.clientY - top - h / 2;

    if (autoSurfaceRadius) {
      element.style.borderRadius = borderRadius;
    }

    const { background, height, width, x, y } = LF_EFFECTS_VARS.ripple;

    ripple.dataset.lfRipple = "";

    ripple.style.setProperty(background, color || backgroundColor);
    ripple.style.setProperty(height, `${h}px`);
    ripple.style.setProperty(width, `${w}px`);
    ripple.style.setProperty(x, `${rippleX}px`);
    ripple.style.setProperty(y, `${rippleY}px`);

    element.appendChild(ripple);

    setTimeout(
      () =>
        requestAnimationFrame(() => {
          ripple.remove();
        }),
      timeout,
    );
  },
};
//#endregion

import { LF_EFFECTS_VARS } from "@lf-widgets/foundations";

//#region Helpers
/**
 * Gets computed styles from parent element for ripple theming.
 */
const getParentStyle = (
  element: HTMLElement,
): Pick<CSSStyleDeclaration, "backgroundColor" | "borderRadius" | "color"> => {
  const { parentElement } = element;
  if (!parentElement) {
    return {
      backgroundColor: "",
      borderRadius: "",
      color: "",
    };
  }
  const { backgroundColor, borderRadius, color } =
    getComputedStyle(parentElement);
  return {
    backgroundColor,
    borderRadius,
    color,
  };
};
//#endregion

//#region Public API
export const rippleEffect = {
  /**
   * Creates and triggers a ripple effect on an element.
   * The ripple auto-removes after the animation completes.
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

    const ripple = document.createElement("span");

    const { left, height: h, top, width: w } = element.getBoundingClientRect();
    const { backgroundColor, borderRadius, color } = getParentStyle(element);

    const rippleX = e.clientX - left - w / 2;
    const rippleY = e.clientY - top - h / 2;

    if (autoSurfaceRadius) {
      element.style.borderRadius = borderRadius;
    }

    const { background, height, width, x, y } = LF_EFFECTS_VARS.ripple;

    // Set hierarchical data attribute (composable)
    ripple.dataset.lfRipple = "";

    ripple.style.setProperty(background, color || backgroundColor);
    ripple.style.setProperty(height, `${h}px`);
    ripple.style.setProperty(width, `${w}px`);
    ripple.style.setProperty(x, `${rippleX}px`);
    ripple.style.setProperty(y, `${rippleY}px`);

    element.appendChild(ripple);

    setTimeout(
      () =>
        requestAnimationFrame(async () => {
          ripple.remove();
        }),
      timeout,
    );
  },
};
//#endregion

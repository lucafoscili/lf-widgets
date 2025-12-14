import {
  LfPhotoframeAdapter,
  LfPhotoframeAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-photoframe.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepPhotoframeComputed = (
  getAdapter: () => LfPhotoframeAdapter,
): LfPhotoframeAdapterControllerComputed => ({
  /**
   * Whether the component is currently in the viewport.
   * Used to determine when to load the value image.
   */
  isInViewport: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().isInViewport;
  },

  /**
   * Whether to show the placeholder image.
   * True when the value image hasn't loaded yet.
   */
  showPlaceholder: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    return !comp.isInViewport || !comp.isReady;
  },

  /**
   * Whether the value image has loaded and is ready to display.
   */
  isReady: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().isReady;
  },

  /**
   * Whether the images should be replaced (in viewport and ready).
   * Used to trigger the CSS transition from placeholder to value image.
   */
  shouldReplace: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    return comp.isInViewport && comp.isReady;
  },
});

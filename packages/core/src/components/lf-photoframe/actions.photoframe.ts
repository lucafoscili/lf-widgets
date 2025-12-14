import {
  LfPhotoframeAdapter,
  LfPhotoframeAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-photoframe.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepPhotoframeActions = (
  getAdapter: () => LfPhotoframeAdapter,
): LfPhotoframeAdapterControllerActions => ({
  /**
   * Manually triggers the load sequence by setting isInViewport to true.
   * Useful for programmatically loading the value image without waiting
   * for the IntersectionObserver.
   */
  triggerLoad: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    if (!comp.isInViewport) {
      comp.isInViewport = true;
    }
  },
});

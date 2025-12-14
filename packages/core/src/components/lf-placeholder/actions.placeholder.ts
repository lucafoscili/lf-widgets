import {
  LfPlaceholderAdapter,
  LfPlaceholderAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-placeholder.
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
export const prepPlaceholderActions = (
  getAdapter: () => LfPlaceholderAdapter,
): LfPlaceholderAdapterControllerActions => ({
  /**
   * Manually triggers the placeholder to load the component.
   * Sets isInViewport to true to force rendering regardless of actual viewport state.
   */
  triggerLoad: () => {
    const { compInstance, framework } = getAdapter().controller.get;
    const comp = compInstance();
    const mgr = framework();

    if (!comp.isInViewport) {
      mgr.debug.logs.new(
        comp,
        "triggerLoad called, forcing component render.",
        "informational",
      );
      comp.isInViewport = true;
    }
  },
});

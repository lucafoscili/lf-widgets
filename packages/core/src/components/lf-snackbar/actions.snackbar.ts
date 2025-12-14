import {
  LfSnackbarAdapter,
  LfSnackbarAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-snackbar.
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
export const prepSnackbarActions = (
  getAdapter: () => LfSnackbarAdapter,
): LfSnackbarAdapterControllerActions => ({
  /**
   * Closes/unmounts the snackbar.
   * Clears any existing timer and removes the component from DOM.
   */
  close: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    comp.unmount();
  },
});

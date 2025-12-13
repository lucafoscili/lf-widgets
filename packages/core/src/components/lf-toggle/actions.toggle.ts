import {
  LfToggleAdapter,
  LfToggleAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-toggle.
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
export const prepToggleActions = (
  getAdapter: () => LfToggleAdapter,
): LfToggleAdapterControllerActions => ({
  /**
   * Toggles the toggle state between "on" and "off".
   * Only works when:
   * - Toggle is not disabled
   */
  toggle: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    if (comp.lfUiState !== "disabled") {
      comp.value = comp.value === "on" ? "off" : "on";
    }
  },
});

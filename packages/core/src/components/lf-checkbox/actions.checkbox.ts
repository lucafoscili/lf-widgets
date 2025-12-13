import {
  LfCheckboxAdapter,
  LfCheckboxAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-checkbox.
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
export const prepCheckboxActions = (
  getAdapter: () => LfCheckboxAdapter,
): LfCheckboxAdapterControllerActions => ({
  /**
   * Toggles the checkbox state.
   * Cycles from off/indeterminate to on, or from on to off.
   * Only works when the checkbox is not disabled.
   */
  toggle: () => {
    const { controller } = getAdapter();
    const { compInstance } = controller.get;
    const { isDisabled } = controller.computed;
    const comp = compInstance();

    if (!isDisabled()) {
      if (comp.value === "indeterminate" || comp.value === "off") {
        comp.value = "on";
      } else {
        comp.value = "off";
      }
    }
  },
});

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
 * "Adapter as Core" Pattern:
 * - Uses adapter's setter which writes to closure and calls onStateChange
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
    const { get, set } = controller;
    const { isDisabled } = controller.computed;
    const currentValue = get.value();

    if (!isDisabled()) {
      if (currentValue === "indeterminate" || currentValue === "off") {
        set.value("on");
      } else {
        set.value("off");
      }
    }
  },
});

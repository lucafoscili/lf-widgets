import {
  LfCheckboxAdapter,
  LfCheckboxAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-checkbox.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * "Adapter as Core" Pattern:
 * - Reads from adapter's value getter (closure state), not WC state
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepCheckboxComputed = (
  getAdapter: () => LfCheckboxAdapter,
): LfCheckboxAdapterControllerComputed => ({
  /**
   * Whether the checkbox is checked.
   * Controls the checked attribute and aria-checked state.
   */
  isChecked: () => {
    const { value } = getAdapter().controller.get;
    return value() === "on";
  },

  /**
   * Whether the checkbox is disabled based on lfUiState.
   * Used to control pointer-events and aria-disabled.
   */
  isDisabled: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfUiState === "disabled";
  },

  /**
   * Whether the checkbox is in indeterminate state.
   * Controls the indeterminate attribute and mixed aria-checked.
   */
  isIndeterminate: () => {
    const { value } = getAdapter().controller.get;
    return value() === "indeterminate";
  },
});

import {
  LfToggleAdapter,
  LfToggleAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Prepares computed values for the toggle adapter.
 *
 * "Adapter as Core" Architecture:
 * - Computed values read internal state via `controller.get.value()`
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping computed logic separate
 *
 * @param getAdapter - Function to retrieve the current adapter instance
 * @returns Computed object with predicates
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepToggleComputed = (
  getAdapter: () => LfToggleAdapter,
): LfToggleAdapterControllerComputed => ({
  /**
   * Whether the toggle is disabled based on lfUiState.
   */
  isDisabled: () =>
    getAdapter().controller.get.compInstance().lfUiState === "disabled",

  /**
   * Whether the toggle is in "on" state.
   * Reads from adapter's internal state via the getter.
   */
  isOn: () => getAdapter().controller.get.value() === "on",
});

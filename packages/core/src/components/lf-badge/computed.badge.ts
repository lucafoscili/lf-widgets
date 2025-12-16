import {
  LfBadgeAdapter,
  LfBadgeAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Prepares computed values for the badge adapter.
 *
 * "Adapter as Core" Architecture:
 * - Computed values read internal state via `controller.get.*`
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping computed logic separate
 *
 * Note: Badge is stateless (display-only), so there are no computed values.
 * The file exists for pattern consistency and future-proofing.
 *
 * @param getAdapter - Function to retrieve the current adapter instance
 * @returns Empty computed object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepBadgeComputed = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterControllerComputed => {
  // Suppress unused variable warning - kept for pattern consistency
  void getAdapter;

  return {
    // Example for future computed values:
    // isDisabled: () =>
    //   getAdapter().controller.get.compInstance().lfUiState === "disabled",
  };
};

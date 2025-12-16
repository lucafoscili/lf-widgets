import {
  LfBadgeAdapter,
  LfBadgeAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Prepares actions for the badge adapter.
 *
 * "Adapter as Core" Architecture:
 * - Actions read internal state via `controller.get.*`
 * - Actions write via `controller.set.*` which triggers onStateChange
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping action logic separate
 *
 * Note: Badge is stateless (display-only), so there are no actions.
 * The file exists for pattern consistency and future-proofing.
 *
 * @param getAdapter - Function to retrieve the current adapter instance
 * @returns Empty actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepBadgeActions = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterControllerActions => {
  // Suppress unused variable warning - kept for pattern consistency
  void getAdapter;

  return {
    // Example for future actions:
    // toggle: () => {
    //   const adapter = getAdapter();
    //   const currentValue = adapter.controller.get.someState();
    //   adapter.controller.set.someState(!currentValue);
    // },
  };
};

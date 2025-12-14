import {
  LfBadgeAdapter,
  LfBadgeAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Prepares computed values for the badge adapter.
 * Badge is a simple component with no computed values.
 *
 * @param _getAdapter - Function to retrieve the current adapter instance
 * @returns Empty computed object
 */
export const prepBadgeComputed = (
  _getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterControllerComputed => ({});

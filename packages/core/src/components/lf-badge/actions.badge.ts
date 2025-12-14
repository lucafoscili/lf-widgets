import {
  LfBadgeAdapter,
  LfBadgeAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Prepares actions for the badge adapter.
 * Badge is a simple component with no multi-step operations.
 *
 * @param _getAdapter - Function to retrieve the current adapter instance
 * @returns Empty actions object
 */
export const prepBadgeActions = (
  _getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterControllerActions => ({});

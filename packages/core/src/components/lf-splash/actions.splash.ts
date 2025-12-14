import {
  LfSplashAdapter,
  LfSplashAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-splash.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param _getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepSplashActions = (
  _getAdapter: () => LfSplashAdapter,
): LfSplashAdapterControllerActions => ({
  // No actions needed for this simple display component
});

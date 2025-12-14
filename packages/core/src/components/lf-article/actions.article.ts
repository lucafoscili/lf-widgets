import {
  LfArticleAdapter,
  LfArticleAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-article.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * Note: lf-article is primarily a display component, so actions are minimal.
 *
 * @param _getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepArticleActions = (
  _getAdapter: () => LfArticleAdapter,
): LfArticleAdapterControllerActions => ({
  // No complex actions needed for article component currently
});

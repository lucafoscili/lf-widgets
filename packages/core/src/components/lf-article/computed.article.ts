import {
  LfArticleAdapter,
  LfArticleAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-article.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepArticleComputed = (
  getAdapter: () => LfArticleAdapter,
): LfArticleAdapterControllerComputed => ({
  /**
   * Whether the dataset has any nodes to render.
   * Used to determine if we should show content or empty state.
   */
  hasNodes: () => {
    const { compInstance } = getAdapter().controller.get;
    const { lfDataset } = compInstance();
    return Boolean(lfDataset?.nodes?.length);
  },
});

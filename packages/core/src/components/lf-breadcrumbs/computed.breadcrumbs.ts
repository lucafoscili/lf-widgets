import {
  LfBreadcrumbsAdapter,
  LfBreadcrumbsAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-breadcrumbs.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepBreadcrumbsComputed = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterControllerComputed => ({
  /**
   * Whether the breadcrumbs are interactive.
   * Controls clickability and keyboard navigation.
   */
  isInteractive: () => {
    const { compInstance } = getAdapter().controller.get;
    const value = compInstance().lfInteractive;
    return value !== false && value !== ("false" as unknown as boolean);
  },

  /**
   * Whether the breadcrumbs are currently expanded (showing all items).
   * When false, truncation may be applied based on lfMaxItems.
   */
  isExpanded: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().expanded;
  },

  /**
   * Whether the dataset is empty or has no valid nodes.
   * Used to determine if empty message should be shown.
   */
  isEmpty: () => {
    const { path } = getAdapter().controller.get;
    const currentPath = path();
    return !currentPath || currentPath.length === 0;
  },
});

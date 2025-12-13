import {
  LfDataNode,
  LfListAdapter,
  LfListAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-list.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepListComputed = (
  getAdapter: () => LfListAdapter,
): LfListAdapterControllerComputed => ({
  /**
   * Whether the list is disabled based on lfUiState.
   * Used to control pointer-events and aria-disabled.
   */
  isDisabled: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfUiState === "disabled";
  },

  /**
   * Whether the list is empty (no nodes in dataset).
   */
  isEmpty: () => {
    const { compInstance } = getAdapter().controller.get;
    return !compInstance().lfDataset?.nodes?.length;
  },

  /**
   * Whether the filtered list is empty (nodes exist but all are hidden).
   */
  isFilteredEmpty: () => {
    const { compInstance, hiddenNodes } = getAdapter().controller.get;
    const nodes = compInstance().lfDataset?.nodes || [];
    const hidden = hiddenNodes();
    return (
      nodes.length > 0 && nodes.every((node: LfDataNode) => hidden.has(node))
    );
  },
});

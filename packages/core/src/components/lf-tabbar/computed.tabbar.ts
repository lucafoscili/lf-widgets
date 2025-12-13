import {
  LfTabbarAdapter,
  LfTabbarAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-tabbar.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepTabbarComputed = (
  getAdapter: () => LfTabbarAdapter,
): LfTabbarAdapterControllerComputed => ({
  /**
   * Whether a specific node is the currently selected tab.
   * @param nodeIndex - Index of the node to check
   * @returns true if the node is selected
   */
  isSelected: (nodeIndex: number) => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().value?.index === nodeIndex;
  },

  /**
   * Whether the tabbar has any valid nodes to display.
   * Used to decide if rendering should proceed.
   */
  hasNodes: () => {
    const { compInstance, framework } = getAdapter().controller.get;
    const { lfDataset } = compInstance();
    return framework().data.node.exists(lfDataset);
  },
});

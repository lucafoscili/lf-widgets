import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-tree.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepTreeActions = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterControllerActions => ({
  /**
   * Toggles the expansion state of a node.
   * Delegates to the expansion state toggle method.
   */
  toggleExpansion: (node: LfDataNode) => {
    const { controller } = getAdapter();
    controller.set.state.expansion.toggle(node);
  },

  /**
   * Sets the selection to a specific node.
   * Only works when:
   * - Selection is enabled (lfSelectable is true)
   * - Node is not disabled
   */
  setSelection: (node: LfDataNode) => {
    const { controller } = getAdapter();
    const { computed, set } = controller;

    if (computed.canSelectNode(node)) {
      set.state.selection.set(node);
    }
  },

  /**
   * Clears the current selection.
   */
  clearSelection: () => {
    const { controller } = getAdapter();
    controller.set.state.selection.clear();
  },
});

import {
  LfChipAdapter,
  LfChipAdapterControllerActions,
  LfDataNode,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-chip.
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
export const prepChipActions = (
  getAdapter: () => LfChipAdapter,
): LfChipAdapterControllerActions => ({
  /**
   * Toggles the expansion state of a node.
   * Only applies to nodes with children.
   */
  toggleExpansion: (node: LfDataNode) => {
    const { compInstance } = getAdapter().controller.get;
    const { hasChildren } = getAdapter().controller.computed;
    const comp = compInstance();

    if (!hasChildren(node)) {
      return;
    }

    const expanded = new Set(comp.expandedNodes);
    if (expanded.has(node)) {
      expanded.delete(node);
    } else {
      expanded.add(node);
    }
    comp.expandedNodes = expanded;
  },

  /**
   * Toggles the selection state of a node.
   */
  toggleSelection: (node: LfDataNode) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    const selected = new Set(comp.selectedNodes);
    if (selected.has(node)) {
      selected.delete(node);
    } else {
      selected.add(node);
    }
    comp.selectedNodes = selected;
  },

  /**
   * Deletes a node from the dataset.
   */
  deleteNode: (node: LfDataNode) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    const nodeIndex = comp.lfDataset?.nodes?.indexOf(node);
    if (nodeIndex !== undefined && nodeIndex > -1) {
      comp.lfDataset.nodes.splice(nodeIndex, 1);
    }
  },
});

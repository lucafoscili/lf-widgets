import {
  LfDataNode,
  LfListAdapter,
  LfListAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-list.
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
export const prepListActions = (
  getAdapter: () => LfListAdapter,
): LfListAdapterControllerActions => ({
  /**
   * Applies a filter value immediately.
   * Updates the filter state and recalculates hidden nodes.
   */
  applyFilter: (value: string) => {
    const { controller } = getAdapter();
    const { compInstance, hiddenNodes } = controller.get;
    const { filter } = controller.set;
    const comp = compInstance();
    const nodes = comp.lfDataset?.nodes || [];

    filter.setValue(value);

    const hidden = hiddenNodes();
    hidden.clear();

    if (value.trim() && nodes.length) {
      for (const node of nodes) {
        const nodeText = getNodeText(node);
        if (!nodeText.toLowerCase().includes(value.toLowerCase())) {
          hidden.add(node);
        }
      }
    }
  },

  /**
   * Deletes a node from the dataset.
   * Removes the node at the specified index and triggers a refresh.
   */
  deleteNode: (index: number) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    if (index > -1 && comp.lfDataset?.nodes) {
      comp.lfDataset.nodes.splice(index, 1);
      comp.refresh();
    }
  },

  /**
   * Focuses the element at the specified index.
   */
  focusElement: (index: number) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    const nodeElement = comp.rootElement.shadowRoot?.querySelector(
      `[data-index="${index}"]`,
    ) as HTMLElement;
    if (nodeElement) {
      nodeElement.focus();
    }
  },

  /**
   * Handles node selection.
   * Only selects if the list is selectable and the index is valid.
   */
  selectNode: (index: number) => {
    const { controller } = getAdapter();
    const { compInstance } = controller.get;
    const comp = compInstance();

    if (
      comp.lfSelectable &&
      index !== null &&
      index !== undefined &&
      !isNaN(index)
    ) {
      controller.set.selected(index);
    }
  },
});

/**
 * Helper to get searchable text from a node.
 */
function getNodeText(node: LfDataNode): string {
  return `${String(node.value || "")} ${String(node.description || "")}`.trim();
}

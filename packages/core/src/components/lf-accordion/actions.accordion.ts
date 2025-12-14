import {
  LfAccordionAdapter,
  LfAccordionAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-accordion.
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
export const prepAccordionActions = (
  getAdapter: () => LfAccordionAdapter,
): LfAccordionAdapterControllerActions => ({
  /**
   * Toggles a node's expanded or selected state.
   * - If node has cells (expandible): toggles expansion
   * - If node is a leaf: toggles selection
   */
  toggle: (node, e) => {
    const adapter = getAdapter();
    const { controller, dispatcher } = adapter;
    const { compInstance } = controller.get;
    const { isExpandible, isExpanded, isSelected } = controller.computed;

    const comp = compInstance();

    if (isExpandible(node)) {
      // Clone Set before mutation to trigger reactivity
      const newExpandedSet = new Set(comp.expandedNodeIds);
      if (isExpanded(node)) {
        newExpandedSet.delete(node.id);
      } else {
        newExpandedSet.add(node.id);
      }
      comp.expandedNodeIds = newExpandedSet;
      dispatcher.emit("expand", { originalEvent: e });
    } else {
      // Clone Set before mutation to trigger reactivity
      const newSelectedSet = new Set(comp.selectedNodeIds);
      if (isSelected(node)) {
        newSelectedSet.delete(node.id);
      } else {
        newSelectedSet.add(node.id);
      }
      comp.selectedNodeIds = newSelectedSet;
      dispatcher.emit("click", { originalEvent: e });
    }

    comp.refresh();
  },
});

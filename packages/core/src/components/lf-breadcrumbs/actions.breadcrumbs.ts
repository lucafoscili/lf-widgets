import {
  LfBreadcrumbsAdapter,
  LfBreadcrumbsAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-breadcrumbs.
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
export const prepBreadcrumbsActions = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterControllerActions => ({
  /**
   * Toggles the expanded state of the breadcrumbs.
   * When expanded, all items are shown; when collapsed, truncation applies.
   */
  toggleExpand: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    comp.expanded = !comp.expanded;
  },

  /**
   * Sets the current node by ID and triggers a re-render.
   * @param nodeId - The ID of the node to set as current
   */
  setCurrentNode: (nodeId: string) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    comp.currentNodeId = nodeId;
  },
});

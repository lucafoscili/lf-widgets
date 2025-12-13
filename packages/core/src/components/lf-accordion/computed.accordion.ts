import {
  LfAccordionAdapter,
  LfAccordionAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-accordion.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepAccordionComputed = (
  getAdapter: () => LfAccordionAdapter,
): LfAccordionAdapterControllerComputed => ({
  /**
   * Whether the node is currently expanded.
   * Used to control visibility of content section.
   */
  isExpanded: (node) => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().expandedNodeIds.has(node.id);
  },

  /**
   * Whether the node has expandable content (cells).
   * Determines if the expand icon should render.
   */
  isExpandible: (node) => {
    return node.cells != null && Object.keys(node.cells).length > 0;
  },

  /**
   * Whether the node is currently selected.
   * Used to style selected items.
   */
  isSelected: (node) => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().selectedNodeIds.has(node.id);
  },
});

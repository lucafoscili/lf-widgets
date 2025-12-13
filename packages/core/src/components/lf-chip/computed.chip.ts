import {
  LfChipAdapter,
  LfChipAdapterControllerComputed,
  LfDataNode,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-chip.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepChipComputed = (
  getAdapter: () => LfChipAdapter,
): LfChipAdapterControllerComputed => ({
  /**
   * Whether the node has children.
   */
  hasChildren: (node: LfDataNode) => {
    return !!(node.children && node.children.length);
  },

  /**
   * Whether the node has only an icon (no text value).
   */
  hasIconOnly: (node: LfDataNode) => {
    return !!(node.icon && !node.value);
  },

  /**
   * Whether the chip styling is "choice".
   */
  isChoice: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfStyling === "choice";
  },

  /**
   * Whether the chip is clickable (choice or filter styling).
   */
  isClickable: () => {
    const { compInstance } = getAdapter().controller.get;
    const styling = compInstance().lfStyling;
    return styling === "choice" || styling === "filter";
  },

  /**
   * Whether the given node is expanded.
   */
  isExpanded: (node: LfDataNode) => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().expandedNodes.has(node);
  },

  /**
   * Whether the chip styling is "filter".
   */
  isFilter: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfStyling === "filter";
  },

  /**
   * Whether the chip styling is "input".
   */
  isInput: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfStyling === "input";
  },

  /**
   * Whether the given node is selected.
   */
  isSelected: (node: LfDataNode) => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().selectedNodes.has(node);
  },

  /**
   * Whether children of the node should be shown.
   */
  showChildren: (node: LfDataNode) => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().expandedNodes.has(node);
  },
});

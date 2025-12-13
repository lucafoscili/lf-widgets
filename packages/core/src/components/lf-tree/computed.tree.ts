import {
  LfDataNode,
  LfTreeAdapter,
  LfTreeAdapterControllerComputed,
} from "@lf-widgets/foundations";
import { getNodeId } from "./state.utils";

/**
 * Factory to create computed predicates for lf-tree.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepTreeComputed = (
  getAdapter: () => LfTreeAdapter,
): LfTreeAdapterControllerComputed => ({
  /**
   * Whether multi-selection is allowed.
   * Currently always returns false (single-select only).
   */
  allowsMultiSelect: () => {
    return false;
  },

  /**
   * Whether a given node can be selected.
   * Checks if selection is enabled and node is not disabled.
   */
  canSelectNode: (node: LfDataNode | null | undefined) => {
    if (!node) {
      return false;
    }
    const { compInstance } = getAdapter().controller.get;
    if (!compInstance().lfSelectable) {
      return false;
    }
    return node.isDisabled !== true;
  },

  /**
   * Whether a node is currently expanded.
   * Checks the expanded state set.
   */
  isExpanded: (node: LfDataNode) => {
    const { state } = getAdapter().controller.get;
    const nodeId = getNodeId(node);
    return nodeId ? state.expansion.nodes().has(nodeId) : false;
  },

  /**
   * Whether grid mode is active.
   * Grid mode is enabled when lfGrid is true and columns are defined.
   */
  isGrid: () => {
    const { compInstance, columns } = getAdapter().controller.get;
    const comp = compInstance();
    return !!(comp.lfGrid && columns()?.length);
  },

  /**
   * Whether a node is hidden (filtered out).
   * Checks the hidden nodes set.
   */
  isHidden: (node: LfDataNode) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    // Access the hiddenNodes state directly from the component
    return (comp as any).hiddenNodes?.has(node) ?? false;
  },

  /**
   * Whether a node is currently selected.
   * Checks if the node matches the selected node.
   */
  isSelected: (node: LfDataNode) => {
    const { state } = getAdapter().controller.get;
    return state.selection.node() === node;
  },

  /**
   * Whether selection is enabled.
   * Based on lfSelectable prop.
   */
  selectable: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfSelectable;
  },
});

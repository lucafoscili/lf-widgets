import { LfTreeAdapter, LfTreeTraversedNode } from "@lf-widgets/foundations";

/**
 * Collects all visible nodes from a tree structure and returns them as a flattened array
 * with traversal metadata.
 *
 * This function performs a depth-first traversal of the tree, collecting nodes that are
 * not hidden. When a filter value is present, all nodes are treated as expanded to show
 * search results. The function builds a flat list of nodes with their depth, expansion,
 * visibility, and selection states.
 *
 * @param adapter - The tree adapter containing the controller and dataset
 * @returns An array of traversed nodes with metadata including depth, expanded state,
 *          hidden state, and selected state
 *
 * @example
 * ```typescript
 * const visibleNodes = collectVisibleNodes(treeAdapter);
 * // Returns: [
 * //   { node: rootNode1, depth: 0, expanded: true, hidden: false, selected: false },
 * //   { node: childNode1, depth: 1, expanded: false, hidden: false, selected: true },
 * //   ...
 * // ]
 * ```
 */
export const collectVisibleNodes = (
  adapter: LfTreeAdapter,
): LfTreeTraversedNode[] => {
  const { controller } = adapter;
  const { get } = controller;
  const dataset = get.dataset();
  const filterValue = get.filterValue?.() || "";

  return get.manager.data.node.traverseVisible(dataset?.nodes, {
    isExpanded: get.isExpanded,
    isHidden: get.isHidden,
    isSelected: get.isSelected,
    forceExpand: !!filterValue,
  }) as LfTreeTraversedNode[];
};

import { LfDataCell, LfDataDataset, LfDataNode } from "@lf-widgets/foundations";
import { cellStringify } from "./helpers.cell";

//#region findNodeByCell
/**
 * Finds a node in a dataset by searching for a specific cell within the nodes' cell collections.
 * The search is performed recursively through the node hierarchy.
 *
 * @param dataset - The dataset containing the hierarchical node structure to search through
 * @param targetCell - The cell to find within the nodes
 * @returns The node containing the target cell, or null if not found
 *
 * @example
 * ```typescript
 * const node = findNodeByCell(myDataset, targetCell);
 * if (node) {
 *   // Cell was found in this node
 * }
 * ```
 */
export const findNodeByCell = (
  dataset: LfDataDataset,
  targetCell: LfDataCell,
) => {
  function recursive(nodes: LfDataNode[]): LfDataNode | null {
    for (const node of nodes) {
      if (node.cells) {
        for (const cellKey in node.cells) {
          if (node.cells[cellKey] === targetCell) {
            return node;
          }
        }
      }
      if (node.children) {
        const foundNode = recursive(node.children);
        if (foundNode) return foundNode;
      }
    }
    return null;
  }

  return recursive(dataset.nodes);
};
//#endregion

//#region nodeExists
/**
 * Checks if a dataset has valid nodes.
 * @param dataset - The dataset to check for nodes existence
 * @returns True if the dataset exists and has at least one node, false otherwise
 */
export const nodeExists = (dataset: LfDataDataset) => {
  return !!(dataset && dataset.nodes?.length);
};
//#endregion

//#region nodeFilter
/**
 * Filters nodes in a dataset based on specified criteria and returns matching nodes along with their ancestors.
 *
 * @param dataset - The dataset containing nodes to filter
 * @param filters - An object containing key-value pairs to match against node properties
 * @param partialMatch - If true, performs partial string matching instead of exact matching. Defaults to false
 *
 * @returns An object containing:
 * - matchingNodes: Set of nodes that match the filter criteria
 * - remainingNodes: Set of nodes that don't match the filter criteria
 * - ancestorNodes: Set of ancestor nodes of matching leaf nodes
 *
 * @example
 * const result = nodeFilter(dataset, { name: "test" }, true);
 * // Will match nodes where name includes "test"
 *
 * @example
 * const result = nodeFilter(dataset, { id: 123 });
 * // Will match nodes where id equals 123 exactly
 */
export const nodeFilter = (
  dataset: LfDataDataset,
  filters: Partial<LfDataNode>,
  partialMatch: boolean = false,
) => {
  const matchingNodes: Set<LfDataNode> = new Set();
  const remainingNodes: Set<LfDataNode> = new Set();
  const ancestorNodes: Set<LfDataNode> = new Set();

  const recursive = (
    node: LfDataNode,
    ancestor: LfDataNode,
    ancestorSet: Set<LfDataNode>,
  ) => {
    const hasChildren = node.children?.length;
    let matches = false;
    for (const key in filters) {
      const k = key as keyof LfDataNode;
      const nodeValue = node[k];
      const filterValue = filters[k];
      const nodeValueStr = cellStringify(nodeValue).toLowerCase();
      const filterValueStr = cellStringify(filterValue).toLowerCase();

      if (partialMatch) {
        if (!nodeValueStr.includes(filterValueStr)) {
          continue;
        }
      } else {
        if (nodeValue !== filterValue) {
          continue;
        }
      }
      matches = true;
      break;
    }

    if (ancestor) {
      ancestorSet.add(ancestor);
    }

    if (matches) {
      matchingNodes.add(node);
    } else {
      remainingNodes.add(node);
    }

    if (hasChildren) {
      node.children.forEach((child) => {
        recursive(child, node, ancestorSet);
      });
    } else {
      if (matches) {
        ancestorSet.forEach((node) => {
          ancestorNodes.add(node);
        });
      }
    }
  };

  dataset.nodes.forEach((node) => {
    const ancestorSet: Set<LfDataNode> = new Set();
    recursive(node, null, ancestorSet);
  });

  return {
    matchingNodes,
    remainingNodes,
    ancestorNodes,
  };
};
//#endregion

//#region nodeFixIds
/**
 * Updates the IDs of nodes in a tree structure based on their depth and position.
 * Each node's ID is set to a string representing its path in the tree (e.g., "0.1.2").
 *
 * @param nodes - An array of LfDataNode objects representing the tree structure
 * @returns The same array of nodes with updated IDs
 *
 * @example
 * const nodes = [
 *   {
 *     id: "old-id",
 *     children: [{ id: "child-id" }]
 *   }
 * ];
 * nodeFixIds(nodes); // nodes[0].id becomes "0", nodes[0].children[0].id becomes "0.0"
 */
export const nodeFixIds = (nodes: LfDataNode[]) => {
  function updateNodeIds(node: LfDataNode, depth: string = "0"): void {
    node.id = depth;

    if (node.children) {
      node.children.forEach((child: any, index: number) => {
        const newDepth = `${depth}.${index}`;
        updateNodeIds(child, newDepth);
      });
    }
  }
  nodes.forEach((node: LfDataNode) => {
    updateNodeIds(node, "0");
  });
  return nodes;
};
//#endregion

//#region nodeGetAncestors
/**
 * Returns an array of nodes representing the path from root to the given node (ancestors chain).
 * The array starts with the root node and ends with the given node.
 * @param node - The node to get ancestors for
 * @param nodes - The array containing all nodes in the tree structure
 * @returns An array of nodes representing the path from root to the given node, ordered from root to leaf
 */
export const nodeGetAncestors = (node: LfDataNode, nodes: LfDataNode[]) => {
  const ancestors: LfDataNode[] = [];
  let current: LfDataNode = node;

  while (current) {
    ancestors.push(current);
    current = nodeGetParent(nodes, current);
  }
  ancestors.reverse();
  return ancestors;
};

//#endregion

//#region nodeGetDrilldownInfo
/**
 * Analyzes a tree of nodes to determine its maximum depth and the maximum number of children for any node.
 *
 * @param nodes - The array of root nodes to analyze
 * @returns An object containing:
 *          - maxChildren: The maximum number of children found in any single node
 *          - maxDepth: The maximum depth level reached in the tree structure
 *
 * @example
 * ```typescript
 * const nodes = [
 *   {
 *     children: [
 *       { children: [] },
 *       { children: [] }
 *     ]
 *   }
 * ];
 * const info = nodeGetDrilldownInfo(nodes);
 * // Returns { maxChildren: 2, maxDepth: 2 }
 * ```
 */
export const nodeGetDrilldownInfo = (nodes: LfDataNode[]) => {
  let maxChildren = 0;
  let maxDepth = 0;

  const getDepth = function (n: LfDataNode) {
    const depth = 0;
    if (n.children) {
      n.children.forEach(function (d) {
        const tmpDepth = getDepth(d);
        if (tmpDepth > depth) {
          maxDepth = tmpDepth;
        }
      });
    }
    return depth;
  };

  const recursive = (arr: LfDataNode[]) => {
    maxDepth++;
    for (let index = 0; index < arr.length; index++) {
      const node = arr[index];
      getDepth(node);
      if (Array.isArray(node.children) && maxChildren < node.children.length) {
        maxChildren = node.children.length;
        recursive(node.children);
      }
    }
  };

  recursive(nodes);
  return {
    maxChildren,
    maxDepth,
  };
};
//#endregion

//#region nodeGetParent
/**
 * Finds and returns the parent node of a given child node within a tree structure.
 *
 * @param nodes - An array of nodes representing the tree structure
 * @param child - The child node whose parent needs to be found
 * @returns The parent node if found, null otherwise
 *
 * @example
 * const nodes = [
 *   { id: 1, children: [
 *     { id: 2 },
 *     { id: 3 }
 *   ]}
 * ];
 * const child = { id: 2 };
 * const parent = nodeGetParent(nodes, child); // Returns node with id: 1
 */
export const nodeGetParent = (nodes: LfDataNode[], child: LfDataNode) => {
  let parent: LfDataNode = null;
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    recursive(node);

    // Recursive function to traverse nodes and find the parent node
    function recursive(node: LfDataNode) {
      const hasChildren = !!node.children;

      if (hasChildren && node.children.includes(child)) {
        parent = node;
        return;
      }
      for (
        let index = 0;
        !parent && hasChildren && index < node.children.length;
        index++
      ) {
        recursive(node.children[index]);
      }
    }
  }
  return parent;
};
//#endregion

//#region nodePop
/**
 * Removes a node from a tree structure and returns the removed node.
 * The function searches through the tree recursively and removes the first occurrence of the specified node.
 *
 * @param nodes - An array of LfDataNode objects representing the tree structure
 * @param node2remove - The node to be removed from the tree
 * @returns A copy of the removed node, or null if the node was not found
 *
 * @example
 * const tree = [{ id: 1, children: [{ id: 2 }] }];
 * const nodeToRemove = { id: 2 };
 * const removedNode = nodePop(tree, nodeToRemove);
 */
export const nodePop = (nodes: LfDataNode[], node2remove: LfDataNode) => {
  let removed: LfDataNode = null;
  for (let index = 0; index < nodes.length; index++) {
    recursive(nodes[index], nodes);

    function recursive(node: LfDataNode, array: LfDataNode[]) {
      const i = array.indexOf(node2remove);
      if (i > -1) {
        removed = { ...node2remove };
        array.splice(i, 1);
        return;
      }
      for (
        let index = 0;
        node.children && index < node.children.length;
        index++
      ) {
        if (node.children[index]) {
          recursive(node.children[index], node.children);
        }
      }
    }
  }
  return removed;
};
//#endregion

//#region nodeSort
/**
 * Sorts an array of LfDataNode elements based on their string representation.
 * @param stringify - A function that converts node values to strings for comparison
 * @param nodes - The array of LfDataNode elements to sort
 * @param direction - The sort direction ('asc' for ascending, 'desc' for descending)
 * @returns The sorted array of nodes (sorts in place and returns the same array)
 */
export const nodeSort = (
  stringify: (value: unknown) => string,
  nodes: LfDataNode[],
  direction: "asc" | "desc" = "asc",
) => {
  nodes.sort((a, b) => {
    let result = 0;
    const strA = stringify(a.value);
    const strB = stringify(b.value);
    if (strA < strB) {
      result = -1;
    } else if (strA > strB) {
      result = 1;
    }

    return direction === "desc" ? result * -1 : result;
  });
  return nodes;
};
//#endregion

//#region nodeSetProperties
/**
 * Sets properties on the specified nodes, optionally recursively.
 * @param nodes - Array of nodes to update
 * @param properties - Object containing the properties to set on the nodes
 * @param recursively - If true, applies properties to all descendant nodes
 * @param exclude - Optional array of nodes to exclude from property updates
 * @returns Array of nodes that were updated
 */
export const nodeSetProperties = (
  nodes: LfDataNode[],
  properties: Partial<LfDataNode>,
  recursively?: boolean,
  exclude?: LfDataNode[],
) => {
  const updated: LfDataNode[] = [];
  if (!exclude) {
    exclude = [];
  }
  if (recursively) {
    nodes = nodeToStream(nodes);
  }
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    for (const key in properties) {
      if (!exclude.includes(node)) {
        (node[key as keyof LfDataNode] as any) =
          properties[key as keyof LfDataNode];
        updated.push(node);
      }
    }
  }
  return updated;
};
//#endregion

//#region nodeToStream
/**
 * Converts a nested tree structure of LfDataNodes into a flattened array.
 * The function performs a depth-first traversal of the tree, adding each node to the result array.
 *
 * @param nodes - An array of LfDataNode objects representing the root nodes of the tree structure
 * @returns A flattened array containing all nodes from the tree in depth-first order
 *
 * @example
 * const tree = [
 *   { id: '1', children: [
 *     { id: '2' },
 *     { id: '3' }
 *   ]}
 * ];
 * const stream = nodeToStream(tree);
 * // Result: [{ id: '1' }, { id: '2' }, { id: '3' }]
 */
export const nodeToStream = (nodes: LfDataNode[]) => {
  function recursive(node: LfDataNode) {
    streamlined.push(node);
    for (
      let index = 0;
      node.children && index < node.children.length;
      index++
    ) {
      recursive(node.children[index]);
    }
  }

  const streamlined: LfDataNode[] = [];
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    recursive(node);
  }
  return streamlined;
};
//#endregion

//#region removeNodeByCell
/**
 * Removes a node from a dataset by finding the node that contains the specified cell.
 * The function traverses the dataset tree recursively to find and remove the node.
 *
 * @param dataset - The dataset containing the nodes to search through
 * @param targetCell - The cell used to identify the node to remove
 * @returns The removed node if found and removed successfully, null otherwise
 *
 * @example
 * ```typescript
 * const dataset = {nodes: [...]};
 * const cell = {value: 'test'};
 * const removedNode = removeNodeByCell(dataset, cell);
 * ```
 */
export const removeNodeByCell = (
  dataset: LfDataDataset,
  targetCell: LfDataCell,
) => {
  function recursive(nodes: LfDataNode[], nodeToRemove: LfDataNode): boolean {
    const index = nodes.indexOf(nodeToRemove);
    if (index !== -1) {
      nodes.splice(index, 1);
      return true;
    }

    for (const node of nodes) {
      if (node.children && recursive(node.children, nodeToRemove)) {
        return true;
      }
    }

    return false;
  }

  const targetNode = findNodeByCell(dataset, targetCell);
  if (!targetNode) {
    return null;
  }

  return recursive(dataset.nodes, targetNode) ? targetNode : null;
};
//#endregion

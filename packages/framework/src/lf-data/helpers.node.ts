import {
  LfDataCell,
  LfDataDataset,
  LfDataNode,
  LfDataNodePredicate,
  LfDataNodeResolutionResult,
  LfDataNodeSanitizeIdsOptions,
  LfDataNodeSanitizeIdsResult,
  LfDataNodeTarget,
} from "@lf-widgets/foundations";
import { cellStringify } from "./helpers.cell";

//#region buildNodeLookup
/**
 * Build a lookup map of nodes by their id from a dataset.
 *
 * Traverses the top-level nodes in the provided dataset and all reachable
 * descendants (via each node's `children` array) and returns a Map that
 * maps each node's id (stringified) to the corresponding node object.
 *
 * - If `dataset` is `undefined` or contains no top-level `nodes`, an empty
 *   Map is returned.
 * - Nodes with `null` or `undefined` ids are skipped and not included in the
 *   returned Map.
 * - The function does not mutate nodes or the dataset; it only reads node
 *   properties and builds a new Map.
 *
 * @param dataset - Optional dataset containing a `nodes` array of `LfDataNode`.
 * @returns A Map where keys are node ids converted to strings and values are
 *          the corresponding `LfDataNode` objects. The Map will be empty if
 *          the dataset has no nodes.
 *
 * @remarks
 * - Traversal is performed with an explicit queue/stack mechanism; all nodes
 *   reachable via `children` arrays are visited exactly once. Time complexity
 *   is O(n) and space complexity is O(n), where n is the total number of
 *   visited nodes.
 */
const buildNodeLookup = (dataset: LfDataDataset | undefined) => {
  const lookup = new Map<string, LfDataNode>();
  if (!dataset?.nodes?.length) {
    return lookup;
  }

  const queue: LfDataNode[] = [...dataset.nodes];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    if (current.id != null) {
      lookup.set(String(current.id), current);
    }

    if (Array.isArray(current.children) && current.children.length) {
      queue.unshift(...current.children);
    }
  }

  return lookup;
};
//#endregion

//#region normaliseTargetInput
/**
 * Normalize the provided target input into an array of targets.
 *
 * This helper accepts a single target, an array of targets, or a nullish value
 * and returns an array suitable for downstream processing.
 * Behaviour:
 * - If `target` is `null` or `undefined`, an empty array is returned.
 * - If `target` is already an array, that array is returned unchanged.
 * - Otherwise a new single-element array containing the provided target is returned.
 *
 * @param target - The input target(s) to normalize. May be `null`/`undefined`, a single target (e.g. `string` or `LfDataNode`), or an array of such targets.
 * @returns An array of `string | LfDataNode` representing the normalized target(s).
 *
 * @example
 * // single value
 * normaliseTargetInput('foo'); // -> ['foo']
 *
 * @example
 * // array value
 * const arr = ['a', 'b'];
 * normaliseTargetInput(arr) === arr; // -> true (returned as-is)
 *
 * @example
 * // nullish value
 * normaliseTargetInput(null); // -> []
 */
const normaliseTargetInput = (target: LfDataNodeTarget) => {
  if (target == null) {
    return [] as Array<string | LfDataNode>;
  }

  return Array.isArray(target) ? target : [target];
};
//#endregion

//#region extractCellMetadata
/**
 * Extracts and validates typed metadata from a cell within a node.
 *
 * This helper provides a standardized pattern for extracting structured data from cells
 * that store metadata in their `value` property. Typical use cases include navigation
 * directories, selection payloads, or custom application state stored in cells.
 *
 * The extraction follows this flow:
 * 1. Validates the node and cell existence
 * 2. Attempts to extract the raw value from cell.value
 * 3. Validates the value matches expected schema (if provided)
 * 4. Applies optional transformation
 * 5. Returns typed result or undefined/null based on schema.nullable
 *
 * @template T - The expected type of the metadata after validation and transformation
 * @param node - The node containing the cell to extract metadata from
 * @param cellId - The identifier of the cell within node.cells (e.g., 'lfCode', 'lfText')
 * @param schema - Optional validation and transformation configuration
 * @returns The extracted and validated metadata, undefined if invalid, or null if schema.nullable
 *
 * @example
 * // Extract directory metadata from navigation cell
 * const dirMetadata = extractCellMetadata<DirectoryInfo>(
 *   node,
 *   'lfCode',
 *   {
 *     validate: (val): val is DirectoryInfo =>
 *       typeof val === 'object' && val !== null && 'path' in val,
 *     transform: (val) => ({ ...val, normalized: normalizePath(val.path) })
 *   }
 * );
 *
 * @example
 * // Simple extraction without validation
 * const rawMeta = extractCellMetadata(node, 'lfText');
 */
export const extractCellMetadata = <T = unknown>(
  node: LfDataNode | null | undefined,
  cellId: string,
  schema?: {
    validate?: (value: unknown) => value is T;
    transform?: (value: T) => T;
    nullable?: boolean;
  },
): T | undefined | null => {
  // Guard: node must exist and have cells
  if (!node || typeof node !== "object" || !node.cells) {
    return schema?.nullable ? null : undefined;
  }

  // Guard: cell must exist within node.cells
  const cell = node.cells[cellId];
  if (!cell || typeof cell !== "object") {
    return schema?.nullable ? null : undefined;
  }

  // Extract raw value from cell
  const rawValue = (cell as { value?: unknown }).value;
  if (rawValue === undefined || rawValue === null) {
    return schema?.nullable ? null : undefined;
  }

  // If no schema provided, return raw value cast to T
  if (!schema) {
    return rawValue as T;
  }

  // Validate against schema if provided
  if (schema.validate && !schema.validate(rawValue)) {
    return schema.nullable ? null : undefined;
  }

  // Apply transformation if provided
  const validated = rawValue as T;
  if (schema.transform) {
    try {
      return schema.transform(validated);
    } catch {
      return schema.nullable ? null : undefined;
    }
  }

  return validated;
};
//#endregion

//#region nodeFind
/**
 * Performs a breadth-first search across the dataset nodes and returns the first match for the
 * supplied predicate.
 */
export const nodeFind = (
  dataset: LfDataDataset | undefined,
  predicate: LfDataNodePredicate,
) => {
  if (!dataset || !Array.isArray(dataset.nodes) || !predicate) {
    return undefined;
  }

  const queue: LfDataNode[] = [...dataset.nodes];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    if (predicate(current)) {
      return current;
    }

    if (Array.isArray(current.children) && current.children.length) {
      queue.unshift(...current.children);
    }
  }

  return undefined;
};
//#endregion

//#region nodeResolveTargets
/**
 * Converts arbitrary node targets (ids, references, arrays) into a de-duplicated set of identifiers
 * and dataset-aligned node references when available.
 */
export const nodeResolveTargets = (
  dataset: LfDataDataset | undefined,
  target: LfDataNodeTarget,
): LfDataNodeResolutionResult => {
  const lookup = buildNodeLookup(dataset);
  const inputs = normaliseTargetInput(target);

  if (!inputs.length) {
    return { ids: [], nodes: [] };
  }

  const ids: string[] = [];
  const seenIds = new Set<string>();
  const nodesById = new Map<string, LfDataNode>();

  for (const entry of inputs) {
    if (entry == null) {
      continue;
    }

    let id: string | null = null;
    let resolvedNode: LfDataNode | undefined;

    if (typeof entry === "string") {
      if (!entry) {
        continue;
      }
      id = entry;
      resolvedNode = lookup.get(entry);
    } else {
      const candidateId = entry.id;
      if (candidateId == null) {
        continue;
      }
      id = String(candidateId);
      resolvedNode = lookup.get(id) ?? entry;
    }

    if (!id) {
      continue;
    }

    if (!nodesById.has(id) && resolvedNode) {
      nodesById.set(id, resolvedNode);
    } else if (!nodesById.has(id)) {
      const datasetNode = lookup.get(id);
      if (datasetNode) {
        nodesById.set(id, datasetNode);
      }
    } else if (lookup.has(id)) {
      nodesById.set(id, lookup.get(id));
    }

    if (!seenIds.has(id)) {
      seenIds.add(id);
      ids.push(id);
    }
  }

  const nodes: LfDataNode[] = [];
  for (const id of ids) {
    const resolved = nodesById.get(id) ?? lookup.get(id);
    if (resolved) {
      nodes.push(resolved);
    }
  }

  return { ids, nodes };
};
//endregion

//#region nodeSanitizeIds
/**
 * Validates a collection of candidate identifiers (or node references) against the supplied dataset,
 * returning only the identifiers that map to existing nodes. Optional predicates allow selective
 * filtering (e.g. excluding disabled nodes) while the limit guard supports single-selection scenarios.
 */
export const nodeSanitizeIds = (
  dataset: LfDataDataset | undefined,
  candidates: Iterable<string | number | LfDataNode> | null | undefined,
  options: LfDataNodeSanitizeIdsOptions = {},
): LfDataNodeSanitizeIdsResult => {
  const empty: LfDataNodeSanitizeIdsResult = { ids: [], nodes: [] };
  if (!dataset?.nodes?.length || !candidates) {
    return empty;
  }

  const lookup = buildNodeLookup(dataset);
  const { predicate, limit } = options;
  const ids: string[] = [];
  const nodes: LfDataNode[] = [];
  const seen = new Set<string>();

  for (const entry of candidates) {
    if (entry == null) {
      continue;
    }

    let id: string | null = null;
    let resolvedNode: LfDataNode | undefined;

    if (typeof entry === "string" || typeof entry === "number") {
      id = String(entry);
      resolvedNode = lookup.get(id);
    } else {
      const candidateId = entry.id;
      if (candidateId == null) {
        continue;
      }
      id = String(candidateId);
      resolvedNode = lookup.get(id);
    }

    if (!id || seen.has(id) || !resolvedNode) {
      continue;
    }

    if (predicate && !predicate(resolvedNode)) {
      continue;
    }

    ids.push(id);
    nodes.push(resolvedNode);
    seen.add(id);

    if (limit && ids.length >= limit) {
      break;
    }
  }

  return { ids, nodes };
};
//#endregion

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

//#region nodeTraverseVisible
/**
 * Produces a depth-first flattened list of nodes enriched with visibility / UI state flags.
 * Expansion, hidden and selection logic is delegated to predicate functions to keep this
 * utility framework-level and decoupled from component instance state containers.
 *
 * @param nodes - Root nodes to traverse
 * @param predicates - Predicate functions controlling expansion, hidden and selection state
 * @returns Array of traversed nodes with depth & state metadata
 */
export const nodeTraverseVisible = (
  nodes: LfDataNode[] | undefined,
  options: {
    isExpanded?: (node: LfDataNode) => boolean;
    isHidden?: (node: LfDataNode) => boolean;
    isSelected?: (node: LfDataNode) => boolean;
    forceExpand?: boolean;
  },
) => {
  const out: {
    node: LfDataNode;
    depth: number;
    expanded?: boolean;
    hidden?: boolean;
    selected?: boolean;
  }[] = [];
  if (!nodes?.length) return out;
  const {
    isExpanded = () => true,
    isHidden = () => false,
    isSelected = () => false,
    forceExpand,
  } = options || {};
  const walk = (node: LfDataNode, depth: number) => {
    const expanded = forceExpand ? true : isExpanded(node);
    const hidden = isHidden(node);
    const selected = isSelected(node);
    if (!hidden) out.push({ node, depth, expanded, hidden, selected });
    if (expanded && node.children) {
      for (const child of node.children) walk(child, depth + 1);
    }
  };
  for (const n of nodes) walk(n, 0);
  return out;
};
//#endregion

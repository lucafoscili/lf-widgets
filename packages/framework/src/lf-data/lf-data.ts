import {
  LfDataCell,
  LfDataColumn,
  LfDataDataset,
  LfDataInterface,
  LfDataNode,
  LfDataNodeMergeChildrenOptions,
  LfDataNodeOperations,
  LfDataNodePlaceholderOptions,
  LfDataNodePredicate,
  LfDataNodeSanitizeIdsOptions,
  LfDataNodeTarget,
  LfDataShapes,
  LfDataShapesMap,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import {
  cellExists,
  cellGetAllShapes,
  cellGetShape,
  cellStringify,
} from "./helpers.cell";
import { columnFind } from "./helpers.column";
import {
  extractCellMetadata,
  findNodeByCell,
  nodeDecoratePlaceholders,
  nodeExists,
  nodeFilter,
  nodeFind,
  nodeFixIds,
  nodeGetDrilldownInfo,
  nodeGetParent,
  nodeMergeChildren,
  nodePop,
  nodeResolveTargets,
  nodeSanitizeIds,
  nodeSetProperties,
  nodeToStream,
  nodeTraverseVisible,
  removeNodeByCell,
} from "./helpers.node";

export class LfData implements LfDataInterface {
  constructor(_lfFramework: LfFrameworkInterface) {}

  //#region Cell
  /**
   * Contains methods and utilities for cell management.
   * @property {Object} cell - The cell management object
   * @property {(node: LfDataNode) => boolean} cell.exists - Checks if a cell exists in the given node
   * @property {Object} cell.shapes - Contains methods for managing cell shapes
   * @property {(cell: LfDataCell<LfDataShapes>, deepCopy?: boolean) => LfDataCell<LfDataShapes>} cell.shapes.get - Retrieves a shape from a cell
   * @property {(dataset: LfDataDataset, deepCopy?: boolean) => LfDataCell<LfDataShapes>[]} cell.shapes.getAll - Retrieves all shapes from a dataset
   * @property {(value: LfDataCell<LfDataShapes>["value"]) => string} cell.stringify - Converts a cell value to string
   */
  cell: LfDataInterface["cell"] = {
    exists: (node: LfDataNode) => cellExists(node),
    shapes: {
      get: (
        cell: LfDataCell<LfDataShapes>,
        deepCopy = true,
      ): LfDataCell<LfDataShapes> =>
        cellGetShape(cell, deepCopy) as LfDataCell<LfDataShapes>,
      getAll: (dataset: LfDataDataset, deepCopy = true): LfDataShapesMap =>
        cellGetAllShapes(dataset, deepCopy),
    },
    stringify: (value: LfDataCell<LfDataShapes>["value"]) =>
      cellStringify(value),
  };
  //#endregion

  //#region Column
  /**
   * Contains methods for handling column-related operations in datasets.
   * @property {Object} column - Column operations object.
   * @property {Function} column.find - Searches for columns in a dataset based on given filters.
   * @param {LfDataDataset | LfDataColumn[]} dataset - The dataset or array of columns to search in.
   * @param {Partial<LfDataColumn>} filters - The filter criteria to match columns against.
   * @returns {LfDataColumn[]} An array of columns matching the filter criteria.
   */
  column = {
    find: (
      dataset: LfDataDataset | LfDataColumn[],
      filters: Partial<LfDataColumn>,
    ) => columnFind(dataset, filters),
  };
  //#endregion

  //#region Node
  /**
   * Object containing operations for manipulating and querying node data structures.
   * @property {(dataset: LfDataDataset) => boolean} exists - Checks whether a dataset exposes any nodes.
   * @property {(dataset: LfDataDataset, filters: Partial<LfDataNode>, partialMatch?: boolean) => ReturnType<typeof nodeFilter>} filter - Filters nodes based on given criteria.
   * @property {(dataset: LfDataDataset, cell: LfDataCell) => LfDataNode} findNodeByCell - Finds a node by cell reference.
   * @property {(nodes: LfDataNode[]) => LfDataNode[]} fixIds - Fixes/normalizes node IDs.
   * @property {(nodes: LfDataNode[]) => LfDataNodeDrilldownInfo} getDrilldownInfo - Retrieves drilldown information from nodes.
   * @property {(nodes: LfDataNode[], child: LfDataNode) => LfDataNode} getParent - Gets the parent node of a given child node.
   * @property {(nodes: LfDataNode[], node2remove: LfDataNode) => LfDataNode} pop - Removes a specific node from the node structure.
   * @property {(dataset: LfDataDataset, cell: LfDataCell) => LfDataNode | null} removeNodeByCell - Removes a node identified by cell reference.
   * @property {(nodes: LfDataNode[], properties: Partial<LfDataNode>, recursively?: boolean, exclude?: LfDataNode[]) => LfDataNode[]} setProperties - Sets properties on nodes.
   * @property {(nodes: LfDataNode[]) => LfDataNode[]} toStream - Converts a hierarchical set of nodes to a flat array.
   * @property {(nodes: LfDataNode[] | undefined, predicates: Parameters<typeof nodeTraverseVisible>[1]) => ReturnType<typeof nodeTraverseVisible>} traverseVisible - Walks the dataset honouring UI predicates.
   * @property {<T extends LfDataDataset | undefined>(dataset: T, options: LfDataNodePlaceholderOptions) => T} decoratePlaceholders - Injects placeholder nodes when lazy loading is required.
   * @property {(dataset: LfDataDataset | undefined, predicate: LfDataNodePredicate) => LfDataNode | undefined} find - Finds the first node matching the predicate.
   * @property {<T extends LfDataDataset | undefined>(dataset: T, options: LfDataNodeMergeChildrenOptions) => T} mergeChildren - Replaces a parent's children with the provided branch.
   */
  node: LfDataNodeOperations = {
    exists: (dataset) => nodeExists(dataset),
    filter: (dataset, filters, partialMatch = false) =>
      nodeFilter(dataset, filters, partialMatch),
    findNodeByCell: (dataset, cell) => findNodeByCell(dataset, cell),
    fixIds: (nodes) => nodeFixIds(nodes),
    getDrilldownInfo: (nodes) => nodeGetDrilldownInfo(nodes),
    getParent: (nodes, child) => nodeGetParent(nodes, child),
    pop: (nodes, node2remove) => nodePop(nodes, node2remove),
    removeNodeByCell: (dataset, cell) => removeNodeByCell(dataset, cell),
    setProperties: (nodes, properties, recursively?, exclude?) =>
      nodeSetProperties(nodes, properties, recursively, exclude),
    toStream: (nodes) => nodeToStream(nodes),
    traverseVisible: (
      nodes: LfDataNode[] | undefined,
      predicates: {
        isExpanded: (node: LfDataNode) => boolean;
        isHidden: (node: LfDataNode) => boolean;
        isSelected: (node: LfDataNode) => boolean;
        forceExpand?: boolean;
      },
    ) => nodeTraverseVisible(nodes, predicates),
    decoratePlaceholders: <T extends LfDataDataset | undefined>(
      dataset: T,
      options: LfDataNodePlaceholderOptions,
    ) => nodeDecoratePlaceholders(dataset, options),
    find: (
      dataset: LfDataDataset | undefined,
      predicate: LfDataNodePredicate,
    ) => nodeFind(dataset, predicate),
    mergeChildren: <T extends LfDataDataset | undefined>(
      dataset: T,
      options: LfDataNodeMergeChildrenOptions,
    ) => nodeMergeChildren(dataset, options),
    resolveTargets: (
      dataset: LfDataDataset | undefined,
      target: LfDataNodeTarget,
    ) => nodeResolveTargets(dataset, target),
    sanitizeIds: (
      dataset: LfDataDataset | undefined,
      candidates: Iterable<string | number | LfDataNode> | null | undefined,
      options?: LfDataNodeSanitizeIdsOptions,
    ) => nodeSanitizeIds(dataset, candidates, options),
    extractCellMetadata: <T = unknown>(
      node: LfDataNode | null | undefined,
      cellId: string,
      schema?: {
        validate?: (value: unknown) => value is T;
        transform?: (value: T) => T;
        nullable?: boolean;
      },
    ) => extractCellMetadata<T>(node, cellId, schema),
  };
  //#endregion
}

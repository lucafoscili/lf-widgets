import {
  LfComponentName,
  LfFrameworkInterface,
  LfDataCell,
  LfDataColumn,
  LfDataDataset,
  LfDataInterface,
  LfDataNode,
  LfDataNodeOperations,
  LfDataShapeCallback,
  LfDataShapeComponentMap,
  LfDataShapeEventDispatcher,
  LfDataShapeRefCallback,
  LfDataShapes,
  LfDataShapesMap,
} from "@lf-widgets/foundations";
import {
  cellDecorateShapes,
  cellExists,
  cellGetAllShapes,
  cellGetShape,
  cellStringify,
} from "./helpers.cell";
import { columnFind } from "./helpers.column";
import {
  findNodeByCell,
  nodeExists,
  nodeFilter,
  nodeFixIds,
  nodeGetDrilldownInfo,
  nodeGetParent,
  nodePop,
  nodeSetProperties,
  nodeToStream,
} from "./helpers.node";

export class LfData implements LfDataInterface {
  #MANAGER: LfFrameworkInterface;
  #SHAPES_MAP: LfDataShapeComponentMap = {
    badge: "LfBadge",
    button: "LfButton",
    canvas: "LfCanvas",
    card: "LfCard",
    chart: "LfChart",
    chat: "LfChat",
    chip: "LfChip",
    code: "LfCode",
    image: "LfImage",
    number: "LfTextfield",
    photoframe: "LfPhotoframe",
    slot: "LfTextfield",
    text: "LfTextfield",
    toggle: "LfToggle",
    typewriter: "LfTypewriter",
    upload: "LfUpload",
  };

  constructor(lfFramework: LfFrameworkInterface) {
    this.#MANAGER = lfFramework;
  }

  //#region Cell
  /**
   * Contains methods and utilities for cell management.
   * @property {Object} cell - The cell management object
   * @property {(node: LfDataNode) => boolean} cell.exists - Checks if a cell exists in the given node
   * @property {Object} cell.shapes - Contains methods for managing cell shapes
   * @property {<C extends LfComponentName, S extends LfDataShapes | "text">(shape: S, items: Partial<LfDataCell<S>>[], eventDispatcher: LfDataShapeEventDispatcher, defaultProps?: Partial<LfDataCell<S>>[], defaultCb?: S extends "text" ? never : LfDataShapeCallback<C, S>) => void} cell.shapes.decorate - Decorates cells with shapes
   * @property {(cell: LfDataCell<LfDataShapes>, deepCopy?: boolean) => LfDataCell<LfDataShapes>} cell.shapes.get - Retrieves a shape from a cell
   * @property {(dataset: LfDataDataset, deepCopy?: boolean) => LfDataCell<LfDataShapes>[]} cell.shapes.getAll - Retrieves all shapes from a dataset
   * @property {(value: LfDataCell<LfDataShapes>["value"]) => string} cell.stringify - Converts a cell value to string
   */
  cell: LfDataInterface["cell"] = {
    exists: (node: LfDataNode) => cellExists(node),
    shapes: {
      decorate: <C extends LfComponentName, S extends LfDataShapes | "text">(
        shape: S,
        items: Partial<LfDataCell<S>>[],
        eventDispatcher: LfDataShapeEventDispatcher,
        defaultProps?: Partial<LfDataCell<S>>[],
        defaultCb?: S extends "text" ? never : LfDataShapeCallback<C, S>,
        refsCb?: Array<LfDataShapeRefCallback<C>>,
      ) =>
        cellDecorateShapes(
          this.#MANAGER,
          this.#SHAPES_MAP[shape],
          shape,
          items,
          eventDispatcher,
          defaultProps,
          defaultCb,
          refsCb,
        ),
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
   * @property {(dataset: LfDataDataset) => boolean} exists - Checks if a node exists in the dataset.
   * @property {(dataset: LfDataDataset, filters: Partial<LfDataNode>, partialMatch?: boolean) => any} filter - Filters nodes based on given criteria.
   * @property {(dataset: LfDataDataset, cell: LfDataCell) => LfDataNode} findNodeByCell - Finds a node by cell reference.
   * @property {(nodes: LfDataNode[]) => LfDataNode[]} fixIds - Fixes/normalizes node IDs.
   * @property {(nodes: LfDataNode[]) => LfDataNodeDrilldownInfo} getDrilldownInfo - Retrieves drilldown information from nodes.
   * @property {(nodes: LfDataNode[], child: LfDataNode) => LfDataNode} getParent - Gets the parent node of a given child node.
   * @property {(nodes: LfDataNode[], node2remove: LfDataNode) => LfDataNode} pop - Removes a specific node from the node structure.
   * @property {(dataset: LfDataDataset, cell: LfDataCell) => LfDataNode} removeNodeByCell - Removes a node identified by cell reference.
   * @property {(nodes: LfDataNode[], properties: Partial<LfDataNode>, recursively?: boolean, exclude?: LfDataNode[]) => LfDataNode[]} setProperties - Sets properties on nodes.
   * @property {(nodes: LfDataNode[]) => LfDataNode[]} toStream - Converts nodes structure to a stream format.
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
    removeNodeByCell: (dataset, cell) => findNodeByCell(dataset, cell),
    setProperties: (nodes, properties, recursively?, exclude?) =>
      nodeSetProperties(nodes, properties, recursively, exclude),
    toStream: (nodes) => nodeToStream(nodes),
  };
  //#endregion
}

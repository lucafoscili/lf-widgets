import { LfBadgePropsInterface } from "../components/badge.declarations";
import { LfButtonPropsInterface } from "../components/button.declarations";
import { LfCanvasPropsInterface } from "../components/canvas.declarations";
import { LfCardPropsInterface } from "../components/card.declarations";
import { LfChartPropsInterface } from "../components/chart.declarations";
import {
  LfChatHistory,
  LfChatPropsInterface,
} from "../components/chat.declarations";
import { LfChipPropsInterface } from "../components/chip.declarations";
import { LfCodePropsInterface } from "../components/code.declarations";
import { LfImagePropsInterface } from "../components/image.declarations";
import { LfPhotoframePropsInterface } from "../components/photoframe.declarations";
import { LfProgressbarPropsInterface } from "../components/progressbar.declarations";
import { LfTextfieldPropsInterface } from "../components/textfield.declarations";
import { LfTogglePropsInterface } from "../components/toggle.declarations";
import { LfTypewriterPropsInterface } from "../components/typewriter.declarations";
import { LfUploadPropsInterface } from "../components/upload.declarations";
import {
  LfComponent,
  LfComponentName,
  LfComponentRootElement,
} from "../foundations/components.declarations";
import {
  LfEventPayload,
  LfEventType,
} from "../foundations/events.declarations";
import { LF_DATA_SHAPE_MAP, LF_DATA_SHAPES } from "./data.constants";
import { LfFrameworkAllowedKeysMap } from "./framework.declarations";

//#region Class
/**
 * Primary interface exposing the data framework.
 */
export interface LfDataInterface {
  cell: {
    /**
     * Utility helpers that operate on individual dataset cells.
     */
    exists: (node: LfDataNode) => boolean;
    shapes: {
      /**
       * Retrieves a typed copy of the cell. When `deepCopy` is true the payload is cloned to guard
       * against accidental mutation by callers.
       */
      get: (
        cell: LfDataCell<LfDataShapes>,
        deepCopy?: boolean,
      ) => LfDataCell<LfDataShapes>;
      /**
       * Collects every shape instance declared in the dataset. Optional cloning mirrors the behaviour
       * of `cell.shapes.get` for bulk consumers.
       */
      getAll: (dataset: LfDataDataset, deepCopy?: boolean) => LfDataShapesMap;
    };
    /**
     * Normalises any cell value into a string for rendering (numbers, arrays, etc.).
     */
    stringify: (value: LfDataCell<LfDataShapes>["value"]) => string;
  };
  column: {
    /**
     * Finds columns matching the provided partial descriptor. Works against full datasets or already
     * extracted column arrays.
     */
    find: (
      dataset: LfDataDataset | LfDataColumn[],
      filters: Partial<LfDataColumn>,
    ) => LfDataColumn[];
  };
  /**
   * Rich set of node-centric operations used to traverse, filter, and mutate hierarchical datasets.
   */
  node: LfDataNodeOperations;
}
//#endregion

//#region Utilities
/**
 * Dataset container consumed by the data framework.
 */
export interface LfDataDataset {
  /** Ordered column definitions describing dataset schemas. */
  columns?: LfDataColumn[];
  /** Top-level tree of nodes rendered by components. */
  nodes?: LfDataNode[];
}
/**
 * Column descriptor used by the data framework dataset utilities.
 */
export interface LfDataColumn {
  /** Shape identifier or custom column id. */
  id: LfDataShapes | string;
  /** Human readable column name surfaced in UIs. */
  title: string;
}
/**
 * Data node representation managed by the data framework.
 */
export interface LfDataNode {
  /** Stable identifier used for lookups. */
  id: string;
  /** Dictionary of shape entries assigned to this node. */
  cells?: LfDataCellContainer;
  /** Child nodes forming the hierarchical dataset. */
  children?: LfDataNode[];
  /** Inline styles applied when rendering this node. */
  cssStyle?: { [key: string]: string };
  /** Optional secondary text shown alongside the node value. */
  description?: string;
  /** Icon identifier rendered near the node (if supported by the component). */
  icon?: string;
  /** Flag used by components to disable interactions on the node. */
  isDisabled?: boolean;
  /** Flag indicating the node can expand even when child data hasn't been materialised yet. */
  hasChildren?: boolean;
  /** Primary content displayed for the node (text or numeric). */
  value?: string | number;
}

/**
 * Predicate applied to data nodes when searching within hierarchical datasets.
 */
export type LfDataNodePredicate = (node: LfDataNode) => boolean;

/**
 * Union of inputs accepted by node resolution helpers.
 */
export type LfDataNodeTarget =
  | string
  | LfDataNode
  | Array<string | LfDataNode>
  | null;

/**
 * Resolution result carrying node identifiers and concrete references derived from caller input.
 */
export interface LfDataNodeResolutionResult {
  /** Ordered, de-duplicated list of node identifiers. */
  ids: string[];
  /** Dataset-aligned node references whenever available. */
  nodes: LfDataNode[];
}

/**
 * Options controlling how node identifiers are validated when restoring persisted state.
 */
export interface LfDataNodeSanitizeIdsOptions {
  /** Optional limit applied to the amount of identifiers returned. */
  limit?: number;
  /** Predicate that determines whether a node should be included in the sanitised results. */
  predicate?: (node: LfDataNode) => boolean;
}

/**
 * Result returned by sanitisation helpers when validating persisted node identifiers.
 */
export interface LfDataNodeSanitizeIdsResult {
  /** Sanitised list of identifiers that exist within the provided dataset. */
  ids: string[];
  /** Dataset-aligned node references matching the sanitised identifiers. */
  nodes: LfDataNode[];
}
/**
 * Cell descriptor storing typed values for the data framework.
 */
export interface LfDataBaseCell {
  /** Raw text value carried by the cell. */
  value: string;
  /** Shape type describing which component renders this cell. */
  shape?: LfDataShapes;
  /** Optional DOM attributes forwarded to the rendered component. */
  htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
}
/**
 * Cell descriptor storing typed values for the data framework.
 */
export type LfDataCell<T extends LfDataShapes = LfDataShapes> =
  T extends "badge"
    ? Partial<LfBadgePropsInterface> & {
        shape: "badge";
        value: string;
        htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
      }
    : T extends "button"
      ? Partial<LfButtonPropsInterface> & {
          shape: "button";
          value: string;
          htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
        }
      : T extends "canvas"
        ? Partial<LfCanvasPropsInterface> & {
            shape: "canvas";
            value: string;
            htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
          }
        : T extends "card"
          ? Partial<LfCardPropsInterface> & {
              shape: "card";
              value: string;
              htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
            }
          : T extends "chart"
            ? Partial<LfChartPropsInterface> & {
                shape: "chart";
                value: string;
                htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
              }
            : T extends "chat"
              ? Partial<LfChatPropsInterface> & {
                  shape: "chat";
                  value: LfChatHistory;
                  htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                }
              : T extends "chip"
                ? Partial<LfChipPropsInterface> & {
                    shape: "chip";
                    value: string;
                    htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                  }
                : T extends "code"
                  ? Partial<LfCodePropsInterface> & {
                      shape: "code";
                      value: string;
                      htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                    }
                  : T extends "image"
                    ? Partial<LfImagePropsInterface> & {
                        shape: "image";
                        value: string;
                        htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                      }
                    : T extends "number"
                      ? {
                          shape: "number";
                          value: number;
                          htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                        }
                      : T extends "photoframe"
                        ? Partial<LfPhotoframePropsInterface> & {
                            shape: "photoframe";
                            value: string;
                            htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                          }
                        : T extends "progressbar"
                          ? Partial<LfProgressbarPropsInterface> & {
                              shape: "progressbar";
                              value: number;
                              htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                            }
                          : T extends "slot"
                            ? {
                                shape: "slot";
                                value: string;
                                htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                              }
                            : T extends "textfield"
                              ? Partial<LfTextfieldPropsInterface> & {
                                  shape: "textfield";
                                  value: string;
                                  htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                                }
                              : T extends "toggle"
                                ? Partial<LfTogglePropsInterface> & {
                                    shape: "toggle";
                                    value: boolean;
                                    htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                                  }
                                : T extends "upload"
                                  ? Partial<LfUploadPropsInterface> & {
                                      shape: "upload";
                                      value: string;
                                      htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                                    }
                                  : T extends "typewriter"
                                    ? Partial<LfTypewriterPropsInterface> & {
                                        shape: "typewriter";
                                        value: string;
                                        htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                                      }
                                    : T extends "text"
                                      ? {
                                          shape?: "text";
                                          value: string;
                                          htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
                                        }
                                      : LfDataBaseCell;
/**
 * Data shape helper describing cell name to for the data framework.
 */
export type LfDataCellNameToShape = typeof LF_DATA_SHAPE_MAP;
/**
 * Utility type used by the data framework.
 */
export type LfDataCellFromName<T extends keyof LfDataCellNameToShape> =
  LfDataCell<LfDataCellNameToShape[T]>;
/**
 * Container holding typed cell values consumed by the data framework.
 */
export interface LfDataCellContainer {
  lfBadge?: LfDataCellFromName<"lfBadge">;
  lfButton?: LfDataCellFromName<"lfButton">;
  lfCanvas?: LfDataCellFromName<"lfCanvas">;
  lfCard?: LfDataCellFromName<"lfCard">;
  lfChart?: LfDataCellFromName<"lfChart">;
  lfChat?: LfDataCellFromName<"lfChat">;
  lfChip?: LfDataCellFromName<"lfChip">;
  lfCode?: LfDataCellFromName<"lfCode">;
  lfImage?: LfDataCellFromName<"lfImage">;
  lfNumber?: LfDataCellFromName<"lfNumber">;
  lfPhotoframe?: LfDataCellFromName<"lfPhotoframe">;
  lfProgressbar?: LfDataCellFromName<"lfProgressbar">;
  lfSlot?: LfDataCellFromName<"lfSlot">;
  lfText?: LfDataCellFromName<"lfText">;
  lfTextfield?: LfDataCellFromName<"lfTextfield">;
  lfToggle?: LfDataCellFromName<"lfToggle">;
  lfUpload?: LfDataCellFromName<"lfUpload">;
}
/**
 * Container holding typed cell values consumed by the data framework.
 */
export interface LfDataCellContainer {
  [index: string]: LfDataCell<LfDataShapes>;
}
/**
 * Data shape helper describing data for the data framework.
 */
export type LfDataShapes = (typeof LF_DATA_SHAPES)[number];
/**
 * Dictionary mapping shapes within the data framework.
 */
export type LfDataShapesMap = {
  [K in LfDataShapes]?: LfDataCell<K>[];
};
/**
 * Dictionary mapping shape component within the data framework.
 */
export type LfDataShapeComponentMap = {
  [K in LfDataShapes]: LfComponentName;
};
/**
 * Operations helper manipulating data nodes inside the data framework.
 */
export interface LfDataNodeOperations {
  /** Returns true when the dataset contains at least one node. */
  exists: (dataset: LfDataDataset) => boolean;
  /** Filters nodes matching the provided partial properties; optionally performs partial string matches. */
  filter: (
    dataset: LfDataDataset,
    filters: Partial<LfDataNode>,
    partialMatch: boolean,
  ) => {
    matchingNodes: Set<LfDataNode>;
    remainingNodes: Set<LfDataNode>;
    ancestorNodes: Set<LfDataNode>;
  };
  /** Returns the first node that references the provided cell instance. */
  findNodeByCell: (dataset: LfDataDataset, cell: LfDataCell) => LfDataNode;
  /** Normalises node ids, filling gaps after mutations. */
  fixIds: (nodes: LfDataNode[]) => LfDataNode[];
  /** Finds the parent node for the supplied child reference. */
  getParent: (nodes: LfDataNode[], child: LfDataNode) => LfDataNode;
  /** Removes the target node from the tree and returns it. */
  pop: (nodes: LfDataNode[], node2remove: LfDataNode) => LfDataNode;
  /** Flattens the hierarchical structure into an array stream. */
  toStream: (nodes: LfDataNode[]) => LfDataNode[];
  /** Depth-first traversal utility that honours visibility/selection predicates. */
  traverseVisible: (
    nodes: LfDataNode[] | undefined,
    options: {
      isExpanded?: (node: LfDataNode) => boolean;
      isHidden?: (node: LfDataNode) => boolean;
      isSelected?: (node: LfDataNode) => boolean;
      forceExpand?: boolean;
    },
  ) => Array<{
    node: LfDataNode;
    depth: number;
    expanded?: boolean;
    hidden?: boolean;
    selected?: boolean;
  }>;
  /** Finds the first node that satisfies the supplied predicate. */
  find: (
    dataset: LfDataDataset | undefined,
    predicate: LfDataNodePredicate,
  ) => LfDataNode | undefined;
  /** Normalises arbitrary node targets into dataset-aware identifiers and node references. */
  resolveTargets: (
    dataset: LfDataDataset | undefined,
    target: LfDataNodeTarget,
  ) => LfDataNodeResolutionResult;
  /**
   * Validates persisted node identifiers against the current dataset, returning dataset-aligned nodes and ids.
   */
  sanitizeIds: (
    dataset: LfDataDataset | undefined,
    candidates: Iterable<string | number | LfDataNode> | null | undefined,
    options?: LfDataNodeSanitizeIdsOptions,
  ) => LfDataNodeSanitizeIdsResult;
  /**
   * Extracts typed metadata from a cell within a node. Supports optional schema validation.
   * Returns undefined when the cell is missing, invalid, or fails schema validation.
   */
  extractCellMetadata: <T = unknown>(
    node: LfDataNode | null | undefined,
    cellId: string,
    schema?: LfDataCellMetadataSchema<T>,
  ) => T | undefined;
}
/**
 * Schema for validating and transforming cell metadata during extraction.
 */
export interface LfDataCellMetadataSchema<T = unknown> {
  /** Optional validation predicate that returns true if the parsed value is acceptable. */
  validate?: (value: unknown) => value is T;
  /** Optional transformation function applied after successful validation. */
  transform?: (value: T) => T;
  /** When true, returns null instead of undefined for missing/invalid cells. */
  nullable?: boolean;
}
/**
 * Utility interface used by the data framework.
 */
export interface LfDataFindCellFilters {
  /** Limit the search to specific column identifiers. */
  columns?: string[];
  /** Numeric range constraint applied to candidate cells. */
  range?: LfDataFilterRange;
  /** Exact string value to look for. */
  value?: string;
}
/**
 * Utility interface used by the data framework.
 */
export interface LfDataFilterRange {
  /** Lower bound (inclusive) for range-based filters. */
  min?: number | string;
  /** Upper bound (inclusive) for range-based filters. */
  max?: number | string;
}
/**
 * Callback signature invoked when a rendered shape emits an event.
 *
 * `text` shapes are excluded because they do not emit component events.
 */
export type LfDataShapeCallback<
  C extends LfComponentName,
  S extends LfDataShapes | "text",
> = S extends "text"
  ? never
  : (e: CustomEvent<LfEventPayload<C, LfEventType<LfComponent<C>>>>) => void;
/**
 * Optional factory returning default cells for each shape. Used when auto-generating datasets.
 */
export type LfDataShapeDefaults = Partial<{
  [S in LfDataShapes]: () => LfDataCell<S>[];
}>;
/**
 * Promise-based helper used to forward shape events to the hosting framework.
 */
export type LfDataShapeEventDispatcher = <T extends LfComponentName>(
  e: CustomEvent<LfEventPayload<T, LfEventType<LfComponent<T>>>>,
) => Promise<void>;
/**
 * Receives a reference to the rendered component so adapters can capture DOM nodes.
 */
export type LfDataShapeRefCallback<C extends LfComponentName> = (
  ref: LfComponentRootElement<C>,
) => void;
/**
 * Configuration options for the random dataset in the data framework.
 */
export interface LfDataRandomDatasetOptions {
  /** Number of columns to generate when seeding sample datasets. */
  columnCount?: number;
  /** Total nodes to generate across the hierarchy. */
  nodeCount?: number;
  /** Maximum depth of the generated tree. */
  maxDepth?: number;
  /** Average number of children per node. */
  branchingFactor?: number;
}
//#endregion

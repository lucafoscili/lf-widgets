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
    exists: (node: LfDataNode) => boolean;
    shapes: {
      get: (
        cell: LfDataCell<LfDataShapes>,
        deepCopy?: boolean,
      ) => LfDataCell<LfDataShapes>;
      getAll: (dataset: LfDataDataset, deepCopy?: boolean) => LfDataShapesMap;
    };
    stringify: (value: LfDataCell<LfDataShapes>["value"]) => string;
  };
  column: {
    find: (
      dataset: LfDataDataset | LfDataColumn[],
      filters: Partial<LfDataColumn>,
    ) => LfDataColumn[];
  };
  node: LfDataNodeOperations;
}
//#endregion

//#region Utilities
/**
 * Dataset container consumed by the data framework.
 */
export interface LfDataDataset {
  columns?: LfDataColumn[];
  nodes?: LfDataNode[];
}
/**
 * Column descriptor used by the data framework dataset utilities.
 */
export interface LfDataColumn {
  id: LfDataShapes | string;
  title: string;
}
/**
 * Data node representation managed by the data framework.
 */
export interface LfDataNode {
  id: string;
  cells?: LfDataCellContainer;
  children?: LfDataNode[];
  cssStyle?: { [key: string]: string };
  description?: string;
  icon?: string;
  isDisabled?: boolean;
  value?: string | number;
}
/**
 * Cell descriptor storing typed values for the data framework.
 */
export interface LfDataBaseCell {
  value: string;
  shape?: LfDataShapes;
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
                        : T extends "slot"
                          ? {
                              shape: "slot";
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
  lfSlot?: LfDataCellFromName<"lfSlot">;
  lfText?: LfDataCellFromName<"lfText">;
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
  exists: (dataset: LfDataDataset) => boolean;
  filter: (
    dataset: LfDataDataset,
    filters: Partial<LfDataNode>,
    partialMatch: boolean,
  ) => {
    matchingNodes: Set<LfDataNode>;
    remainingNodes: Set<LfDataNode>;
    ancestorNodes: Set<LfDataNode>;
  };
  findNodeByCell: (dataset: LfDataDataset, cell: LfDataCell) => LfDataNode;
  fixIds: (nodes: LfDataNode[]) => LfDataNode[];
  getDrilldownInfo: (nodes: LfDataNode[]) => LfDataNodeDrilldownInfo;
  getParent: (nodes: LfDataNode[], child: LfDataNode) => LfDataNode;
  pop: (nodes: LfDataNode[], node2remove: LfDataNode) => LfDataNode;
  removeNodeByCell: (dataset: LfDataDataset, cell: LfDataCell) => LfDataNode;
  setProperties: (
    nodes: LfDataNode[],
    properties: Partial<LfDataNode>,
    recursively?: boolean,
    exclude?: LfDataNode[],
  ) => LfDataNode[];
  toStream: (nodes: LfDataNode[]) => LfDataNode[];
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
}
/**
 * Utility interface used by the data framework.
 */
export interface LfDataNodeDrilldownInfo {
  maxChildren?: number;
  maxDepth?: number;
}
/**
 * Utility interface used by the data framework.
 */
export interface LfDataFindCellFilters {
  columns?: string[];
  range?: LfDataFilterRange;
  value?: string;
}
/**
 * Utility interface used by the data framework.
 */
export interface LfDataFilterRange {
  min?: number | string;
  max?: number | string;
}
/**
 * Callback signature invoked by the data framework when handling shape.
 */
export type LfDataShapeCallback<
  C extends LfComponentName,
  S extends LfDataShapes | "text",
> = S extends "text"
  ? never
  : (e: CustomEvent<LfEventPayload<C, LfEventType<LfComponent<C>>>>) => void;
/**
 * Default configuration applied to the shape inside the data framework.
 */
export type LfDataShapeDefaults = Partial<{
  [S in LfDataShapes]: () => LfDataCell<S>[];
}>;
/**
 * Promise-based helper used by the data framework for shape event.
 */
export type LfDataShapeEventDispatcher = <T extends LfComponentName>(
  e: CustomEvent<LfEventPayload<T, LfEventType<LfComponent<T>>>>,
) => Promise<void>;
/**
 * Callback signature invoked by the data framework when handling shape ref.
 */
export type LfDataShapeRefCallback<C extends LfComponentName> = (
  ref: LfComponentRootElement<C>,
) => void;
/**
 * Configuration options for the random dataset in the data framework.
 */
export interface LfDataRandomDatasetOptions {
  columnCount?: number;
  nodeCount?: number;
  maxDepth?: number;
  branchingFactor?: number;
}
//#endregion

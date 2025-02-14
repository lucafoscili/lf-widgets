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
export interface LfDataDataset {
  columns?: LfDataColumn[];
  nodes?: LfDataNode[];
}
export interface LfDataColumn {
  id: LfDataShapes | string;
  title: string;
}
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
export interface LfDataBaseCell {
  value: string;
  shape?: LfDataShapes;
  htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
}
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
export type LfDataCellNameToShape = typeof LF_DATA_SHAPE_MAP;
export type LfDataCellFromName<T extends keyof LfDataCellNameToShape> =
  LfDataCell<LfDataCellNameToShape[T]>;
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
export interface LfDataCellContainer {
  [index: string]: LfDataCell<LfDataShapes>;
}
export type LfDataShapes = (typeof LF_DATA_SHAPES)[number];
export type LfDataShapesMap = {
  [K in LfDataShapes]?: LfDataCell<K>[];
};
export type LfDataShapeComponentMap = {
  [K in LfDataShapes]: LfComponentName;
};
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
}
export interface LfDataNodeDrilldownInfo {
  maxChildren?: number;
  maxDepth?: number;
}
export interface LfDataFindCellFilters {
  columns?: string[];
  range?: LfDataFilterRange;
  value?: string;
}
export interface LfDataFilterRange {
  min?: number | string;
  max?: number | string;
}
export type LfDataShapeCallback<
  C extends LfComponentName,
  S extends LfDataShapes | "text",
> = S extends "text"
  ? never
  : (e: CustomEvent<LfEventPayload<C, LfEventType<LfComponent<C>>>>) => void;
export type LfDataShapeDefaults = Partial<{
  [S in LfDataShapes]: () => LfDataCell<S>[];
}>;
export type LfDataShapeEventDispatcher = <T extends LfComponentName>(
  e: CustomEvent<LfEventPayload<T, LfEventType<LfComponent<T>>>>,
) => Promise<void>;
export type LfDataShapeRefCallback<C extends LfComponentName> = (
  ref: LfComponentRootElement<C>,
) => void;
export interface LfDataRandomDatasetOptions {
  columnCount?: number;
  nodeCount?: number;
  maxDepth?: number;
  branchingFactor?: number;
}
//#endregion

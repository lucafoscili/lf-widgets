import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
} from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import { LfCanvasElement, LfCanvasEventPayload } from "./canvas.declarations";
import {
  LF_IMAGEVIEWER_BLOCKS,
  LF_IMAGEVIEWER_EVENTS,
  LF_IMAGEVIEWER_PARTS,
} from "./imageviewer.constants";
import {
  LfMasonryElement,
  LfMasonryEventPayload,
  LfMasonrySelectedShape,
} from "./masonry.declarations";
import { LfSpinnerElement } from "./spinner.declarations";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
} from "./textfield.declarations";
import {
  LfTreeElement,
  LfTreeEventPayload,
  LfTreePropsInterface,
} from "./tree.declarations";

// #region Navigation tree
/**
 * Configuration options for the navigation tree within `lf-imageviewer`.
 */
export interface LfImageviewerNavigationTreeOptions {
  defaultOpen?: boolean;
  enabled?: boolean;
  layout?: {
    columns?: number;
    mode?: "accordion" | "grid";
  };
  maxWidth?: number | string;
  minWidth?: number | string;
  position?: "start" | "end";
  width?: number | string;
}
/**
 * Runtime state snapshot for the navigation tree within `lf-imageviewer`.
 */
export interface LfImageviewerNavigationTreeState {
  collapsedWidth: number;
  defaultOpen: boolean;
  enabled: boolean;
  layout: {
    columns: number;
    mode: "accordion" | "grid";
  };
  maxWidth: number;
  minWidth: number;
  open: boolean;
  position: "start" | "end";
  width: number;
}
// #endregion

//#region Class
/**
 * Primary interface implemented by the `lf-imageviewer` component. It merges the shared component contract with the component-specific props.
 */
export interface LfImageviewerInterface
  extends LfComponent<"LfImageviewer">,
    LfImageviewerPropsInterface {
  addSnapshot: (value: string) => Promise<void>;
  clearHistory: (index?: number) => Promise<void>;
  clearSelection: () => Promise<void>;
  getComponents: () => Promise<LfImageviewerAdapterRefs>;
  getCurrentSnapshot: () => Promise<{
    shape: LfMasonrySelectedShape;
    value: string;
  }>;
  reset: () => Promise<void>;
  setSpinnerStatus: (status: boolean) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-imageviewer`.
 */
export interface LfImageviewerElement
  extends HTMLStencilElement,
    Omit<LfImageviewerInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-imageviewer` into host integrations.
 */
export interface LfImageviewerAdapter
  extends LfComponentAdapter<LfImageviewerInterface> {
  controller: {
    get: LfImageviewerAdapterControllerGetters;
    set: LfImageviewerAdapterControllerSetters;
  };
  elements: {
    jsx: LfImageviewerAdapterJsx;
    refs: LfImageviewerAdapterRefs;
  };
  handlers: LfImageviewerAdapterHandlers;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfImageviewerAdapterJsx extends LfComponentAdapterJsx {
  details: {
    canvas: () => VNode;
    clearHistory: () => VNode;
    deleteShape: () => VNode;
    redo: () => VNode;
    save: () => VNode;
    spinner: () => VNode;
    tree: () => VNode;
    undo: () => VNode;
  };
  navigation: {
    load: () => VNode;
    masonry: () => VNode;
    textfield: () => VNode;
    tree: () => VNode;
    treeToggle: () => VNode;
  };
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfImageviewerAdapterRefs extends LfComponentAdapterRefs {
  details: {
    canvas: LfCanvasElement;
    clearHistory: LfButtonElement;
    deleteShape: LfButtonElement;
    redo: LfButtonElement;
    save: LfButtonElement;
    spinner: LfSpinnerElement;
    tree: LfTreeElement;
    undo: LfButtonElement;
  };
  navigation: {
    load: LfButtonElement;
    masonry: LfMasonryElement;
    tree: LfTreeElement;
    treeToggle: LfButtonElement;
    textfield: LfTextfieldElement;
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfImageviewerAdapterHandlers
  extends LfComponentAdapterHandlers {
  details: {
    button: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    canvas: (e: CustomEvent<LfCanvasEventPayload>) => void;
    tree: (e: CustomEvent<LfTreeEventPayload>) => void;
  };
  navigation: {
    button: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    masonry: (e: CustomEvent<LfMasonryEventPayload>) => void;
    tree: (e: CustomEvent<LfTreeEventPayload>) => void;
    treeToggle: (e: CustomEvent<LfButtonEventPayload>) => void;
    textfield: (e: CustomEvent<LfTextfieldEventPayload>) => void;
  };
}
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfImageviewerAdapterInitializerGetters = Pick<
  LfImageviewerAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "currentShape"
  | "cyAttributes"
  | "history"
  | "lfAttribute"
  | "manager"
  | "navigationTree"
  | "parts"
  | "spinnerStatus"
  | "treeProps"
>;
/**
 * Subset of adapter setters required during initialisation.
 */
export type LfImageviewerAdapterInitializerSetters = Pick<
  LfImageviewerAdapterControllerSetters,
  "currentShape" | "history" | "navigationTreeOpen"
>;
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfImageviewerAdapterControllerGetters
  extends LfComponentAdapterGetters<LfImageviewerInterface> {
  blocks: typeof LF_IMAGEVIEWER_BLOCKS;
  compInstance: LfImageviewerInterface;
  currentShape: () => { shape: LfMasonrySelectedShape; value: string };
  cyAttributes: typeof CY_ATTRIBUTES;
  history: {
    current: () => LfMasonrySelectedShape[];
    currentSnapshot: () => {
      shape: LfMasonrySelectedShape;
      value: string;
    };
    full: () => LfImageviewerHistory;
    index: () => number;
  };
  lfAttribute: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  navigationTree: () => LfImageviewerNavigationTreeState;
  parts: typeof LF_IMAGEVIEWER_PARTS;
  spinnerStatus: () => boolean;
  treeProps: () => Partial<LfTreePropsInterface>;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfImageviewerAdapterControllerSetters
  extends LfComponentAdapterSetters {
  currentShape: (node: LfMasonrySelectedShape) => void;
  history: {
    index: (index: number) => void;
    new: (shape: LfMasonrySelectedShape, isSnapshot?: boolean) => void;
    pop: (index?: number) => void;
  };
  navigationTreeOpen: (open: boolean) => void;
  spinnerStatus: (active: boolean) => void;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-imageviewer`.
 */
export type LfImageviewerEvent = (typeof LF_IMAGEVIEWER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-imageviewer` events.
 */
export interface LfImageviewerEventPayload
  extends LfEventPayload<"LfImageviewer", LfImageviewerEvent> {}
//#endregion

//#region State
/**
 * History snapshot maintained by the component to enable undo/redo flows.
 */
export type LfImageviewerHistory = {
  [index: number]: Array<LfMasonrySelectedShape>;
};
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-imageviewer` component.
 */
export interface LfImageviewerPropsInterface {
  lfDataset?: LfDataDataset;
  lfLoadCallback?: LfImageviewerLoadCallback;
  lfNavigationTree?: boolean | LfImageviewerNavigationTreeOptions;
  lfStyle?: string;
  lfTreeProps?: Partial<LfTreePropsInterface>;
  lfValue?: LfDataDataset;
}
/**
 * Callback invoked when the component finishes loading assets or data.
 */
export type LfImageviewerLoadCallback = (
  imageviewer: LfImageviewerInterface,
  dir: string,
) => Promise<void>;
//#endregion

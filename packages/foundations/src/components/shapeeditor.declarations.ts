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
import { LfDataDataset, LfDataShapes } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_SHAPEEDITOR_BLOCKS,
  LF_SHAPEEDITOR_EVENTS,
  LF_SHAPEEDITOR_PARTS,
} from "./shapeeditor.constants";
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

//#region Class
/**
 * Primary interface implemented by the `lf-shapeeditor` component.
 * A universal 4-panel interactive explorer that transforms any LfShape type
 * into an explorable, configurable, and previewable experience.
 */
export interface LfShapeeditorInterface
  extends LfComponent<"LfShapeeditor">,
    LfShapeeditorPropsInterface {
  addSnapshot: (value: string) => Promise<void>;
  clearHistory: (index?: number) => Promise<void>;
  clearSelection: () => Promise<void>;
  getComponents: () => Promise<LfShapeeditorAdapterRefs>;
  getCurrentSnapshot: () => Promise<{
    shape: LfMasonrySelectedShape;
    value: string;
  }>;
  reset: () => Promise<void>;
  setSpinnerStatus: (status: boolean) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-shapeeditor`.
 */
export interface LfShapeeditorElement
  extends HTMLStencilElement,
    Omit<LfShapeeditorInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-shapeeditor` into host integrations.
 */
export interface LfShapeeditorAdapter
  extends LfComponentAdapter<LfShapeeditorInterface> {
  controller: {
    get: LfShapeeditorAdapterControllerGetters;
    set: LfShapeeditorAdapterControllerSetters;
  };
  elements: {
    jsx: LfShapeeditorAdapterJsx;
    refs: LfShapeeditorAdapterRefs;
  };
  handlers: LfShapeeditorAdapterHandlers;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfShapeeditorAdapterJsx extends LfComponentAdapterJsx {
  details: {
    clearHistory: () => VNode;
    deleteShape: () => VNode;
    redo: () => VNode;
    save: () => VNode;
    shape: () => VNode;
    spinner: () => VNode;
    tree: () => VNode;
    undo: () => VNode;
  };
  navigation: {
    load: () => VNode;
    masonry: () => VNode;
    navToggle: () => VNode;
    textfield: () => VNode;
    tree: () => VNode;
  };
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfShapeeditorAdapterRefs extends LfComponentAdapterRefs {
  details: {
    clearHistory: LfButtonElement;
    deleteShape: LfButtonElement;
    redo: LfButtonElement;
    save: LfButtonElement;
    shape: HTMLElement;
    spinner: LfSpinnerElement;
    tree: LfTreeElement;
    undo: LfButtonElement;
  };
  navigation: {
    load: LfButtonElement;
    masonry: LfMasonryElement;
    navToggle: LfButtonElement;
    tree: LfTreeElement;
    textfield: LfTextfieldElement;
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfShapeeditorAdapterHandlers
  extends LfComponentAdapterHandlers {
  details: {
    button: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    shape: (e: CustomEvent) => void;
    tree: (e: CustomEvent<LfTreeEventPayload>) => void;
  };
  navigation: {
    button: (e: CustomEvent<LfButtonEventPayload>) => Promise<void>;
    masonry: (e: CustomEvent<LfMasonryEventPayload>) => void;
    navToggle: (e: CustomEvent<LfButtonEventPayload>) => void;
    tree: (e: CustomEvent<LfTreeEventPayload>) => void;
    textfield: (e: CustomEvent<LfTextfieldEventPayload>) => void;
  };
}
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfShapeeditorAdapterInitializerGetters = Pick<
  LfShapeeditorAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "currentShape"
  | "cyAttributes"
  | "history"
  | "lfAttribute"
  | "manager"
  | "navigation"
  | "parts"
  | "spinnerStatus"
>;
/**
 * Subset of adapter setters required during initialisation.
 */
export type LfShapeeditorAdapterInitializerSetters = Pick<
  LfShapeeditorAdapterControllerSetters,
  "currentShape" | "history" | "navigation"
>;
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfShapeeditorAdapterControllerGetters
  extends LfComponentAdapterGetters<LfShapeeditorInterface> {
  blocks: typeof LF_SHAPEEDITOR_BLOCKS;
  compInstance: LfShapeeditorInterface;
  currentShape: () => { shape: LfMasonrySelectedShape; value: string };
  cyAttributes: typeof CY_ATTRIBUTES;
  history: {
    current: () => LfMasonrySelectedShape[];
    currentSnapshot: () => {
      shape: LfMasonrySelectedShape;
      value: string;
    };
    full: () => LfShapeeditorHistory;
    index: () => number;
  };
  lfAttribute: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  navigation: { hasNav: () => boolean; isTreeOpen: () => boolean };
  parts: typeof LF_SHAPEEDITOR_PARTS;
  spinnerStatus: () => boolean;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfShapeeditorAdapterControllerSetters
  extends LfComponentAdapterSetters {
  currentShape: (node: LfMasonrySelectedShape) => void;
  history: {
    index: (index: number) => void;
    new: (shape: LfMasonrySelectedShape, isSnapshot?: boolean) => void;
    pop: (index?: number) => void;
  };
  navigation: { isTreeOpen: (open: boolean) => void; toggleTree: () => void };
  spinnerStatus: (active: boolean) => void;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-shapeeditor`.
 */
export type LfShapeeditorEvent = (typeof LF_SHAPEEDITOR_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-shapeeditor` events.
 */
export interface LfShapeeditorEventPayload
  extends LfEventPayload<"LfShapeeditor", LfShapeeditorEvent> {}
//#endregion

//#region State
/**
 * History snapshot maintained by the component to enable undo/redo flows.
 */
export type LfShapeeditorHistory = {
  [index: number]: Array<LfMasonrySelectedShape>;
};
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-shapeeditor` component.
 */
export interface LfShapeeditorPropsInterface {
  lfDataset?: LfDataDataset;
  lfLoadCallback?: LfShapeeditorLoadCallback;
  lfNavigation?: LfShapeeditorNavigation;
  lfShape?: LfDataShapes;
  lfStyle?: string;
  lfValue?: LfDataDataset;
}
/**
 * Callback invoked when the component finishes loading assets or data.
 */
export type LfShapeeditorLoadCallback = (
  shapeeditor: LfShapeeditorInterface,
  dir: string,
) => Promise<void>;
/**
 * Configuration options for the navigation panel.
 * @property isTreeOpen - When true, the navigation tree panel is expanded by default.
 * @property treeProps - Additional props to pass to the underlying `lf-tree` component.
 */
export interface LfShapeeditorNavigation {
  isTreeOpen?: boolean;
  treeProps?: Partial<LfTreePropsInterface>;
}
//#endregion

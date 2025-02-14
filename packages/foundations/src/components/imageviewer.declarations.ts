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
import { LfTreeElement, LfTreeEventPayload } from "./tree.declarations";

//#region Class
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
export interface LfImageviewerElement
  extends HTMLStencilElement,
    Omit<LfImageviewerInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
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
  };
}
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
    textfield: LfTextfieldElement;
  };
}
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
    textfield: (e: CustomEvent<LfTextfieldEventPayload>) => void;
  };
}
export type LfImageviewerAdapterInitializerGetters = Pick<
  LfImageviewerAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "currentShape"
  | "cyAttributes"
  | "history"
  | "lfAttribute"
  | "manager"
  | "parts"
  | "spinnerStatus"
>;
export type LfImageviewerAdapterInitializerSetters = Pick<
  LfImageviewerAdapterControllerSetters,
  "currentShape" | "history"
>;
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
  parts: typeof LF_IMAGEVIEWER_PARTS;
  spinnerStatus: () => boolean;
}
export interface LfImageviewerAdapterControllerSetters
  extends LfComponentAdapterSetters {
  currentShape: (node: LfMasonrySelectedShape) => void;
  history: {
    index: (index: number) => void;
    new: (shape: LfMasonrySelectedShape, isSnapshot?: boolean) => void;
    pop: (index?: number) => void;
  };
  spinnerStatus: (active: boolean) => void;
}
//#endregion

//#region Events
export type LfImageviewerEvent = (typeof LF_IMAGEVIEWER_EVENTS)[number];
export interface LfImageviewerEventPayload
  extends LfEventPayload<"LfImageviewer", LfImageviewerEvent> {}
//#endregion

//#region State
export type LfImageviewerHistory = {
  [index: number]: Array<LfMasonrySelectedShape>;
};
//#endregion

//#region Props
export interface LfImageviewerPropsInterface {
  lfDataset?: LfDataDataset;
  lfLoadCallback?: LfImageviewerLoadCallback;
  lfStyle?: string;
  lfValue?: LfDataDataset;
}
export type LfImageviewerLoadCallback = (
  imageviewer: LfImageviewerInterface,
  dir: string,
) => Promise<void>;
//#endregion

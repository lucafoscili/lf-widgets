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
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import {
  LfDataCell,
  LfDataDataset,
  LfDataShapeDefaults,
  LfDataShapes,
  LfDataShapesMap,
} from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_COMPARE_BLOCKS,
  LF_COMPARE_EVENTS,
  LF_COMPARE_PARTS,
  LF_COMPARE_VIEWS,
} from "./compare.constants";
import { LfTreeElement, LfTreeEventPayload } from "./tree.declarations";

//#region Class
export interface LfCompareInterface
  extends LfComponent<"LfCompare">,
    LfComparePropsInterface {}
export interface LfCompareElement
  extends HTMLStencilElement,
    LfCompareInterface {}
//#endregion

//#region Adapter
export interface LfCompareAdapter
  extends LfComponentAdapter<LfCompareInterface> {
  controller: {
    get: LfCompareAdapterControllerGetters;
    set: LfCompareAdapterControllerSetters;
  };
  elements: {
    jsx: LfCompareAdapterJsx;
    refs: LfCompareAdapterRefs;
  };
  handlers: LfCompareAdapterHandlers;
}
export type LfCompareAdapterInitializerGetters = Pick<
  LfCompareAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "isOverlay"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "shapes"
>;
export type LfCompareAdapterInitializerSetters = Pick<
  LfCompareAdapterControllerSetters,
  | "leftPanelOpened"
  | "leftShape"
  | "rightPanelOpened"
  | "rightShape"
  | "splitView"
>;
export interface LfCompareAdapterControllerGetters
  extends LfComponentAdapterGetters<LfCompareInterface> {
  blocks: typeof LF_COMPARE_BLOCKS;
  compInstance: LfCompareInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  defaults: LfCompareAdapterDefaults;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  isOverlay: () => boolean;
  parts: typeof LF_COMPARE_PARTS;
  shapes: () => LfDataShapesMap[LfDataShapes];
}
export interface LfCompareAdapterControllerSetters
  extends LfComponentAdapterSetters {
  leftPanelOpened: (value?: boolean) => void;
  leftShape: (shape: LfDataCell) => void;
  rightPanelOpened: (value?: boolean) => void;
  rightShape: (shape: LfDataCell) => void;
  splitView: (value: boolean) => void;
}
export interface LfCompareAdapterJsx extends LfComponentAdapterJsx {
  changeView: () => VNode;
  leftButton: () => VNode;
  leftTree: () => VNode;
  rightButton: () => VNode;
  rightTree: () => VNode;
}
export interface LfCompareAdapterRefs extends LfComponentAdapterRefs {
  changeView: LfButtonElement;
  leftButton: LfButtonElement;
  leftTree: LfTreeElement;
  rightButton: LfButtonElement;
  rightTree: LfTreeElement;
  slider: HTMLDivElement;
}
export interface LfCompareAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: CustomEvent<LfButtonEventPayload>) => void;
  tree: (e: CustomEvent<LfTreeEventPayload>) => void;
}
export interface LfCompareAdapterDefaults {
  left: LfDataShapeDefaults;
  right: LfDataShapeDefaults;
}
//#endregion

//#region Events
export type LfCompareEvent = (typeof LF_COMPARE_EVENTS)[number];
export interface LfCompareEventPayload
  extends LfEventPayload<"LfCompare", LfCompareEvent> {}
//#endregion

//#region Props
export interface LfComparePropsInterface {
  lfDataset?: LfDataDataset;
  lfShape?: LfDataShapes;
  lfStyle?: string;
  lfView?: LfCompareView;
}
export type LfCompareView = (typeof LF_COMPARE_VIEWS)[number];
//#endregion

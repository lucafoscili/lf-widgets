import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
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
  LfDataShapes,
  LfDataShapesMap,
} from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_MASONRY_BLOCKS,
  LF_MASONRY_EVENTS,
  LF_MASONRY_PARTS,
  LF_MASONRY_VIEWS,
} from "./masonry.constants";

//#region Class
export interface LfMasonryInterface
  extends LfComponent<"LfMasonry">,
    LfMasonryPropsInterface {
  setSelectedShape: (index: number) => Promise<void>;
}
export interface LfMasonryElement
  extends HTMLStencilElement,
    LfMasonryInterface {}
//#endregion

//#region Adapter
export interface LfMasonryAdapter
  extends LfComponentAdapter<LfMasonryInterface> {
  controller: {
    get: LfMasonryAdapterGetters;
  };
  elements: {
    jsx: LfMasonryAdapterJsx;
    refs: LfMasonryAdapterRefs;
  };
  handlers: LfMasonryAdapterHandlers;
}
export interface LfMasonryAdapterJsx extends LfComponentAdapterJsx {
  addColumn: () => VNode;
  removeColumn: () => VNode;
  changeView: () => VNode;
}
export interface LfMasonryAdapterRefs extends LfComponentAdapterRefs {
  addColumn: LfButtonElement;
  removeColumn: LfButtonElement;
  changeView: LfButtonElement;
}
export interface LfMasonryAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: CustomEvent<LfButtonEventPayload>) => void;
}
export type LfMasonryAdapterInitializerGetters = Pick<
  LfMasonryAdapterGetters,
  | "blocks"
  | "compInstance"
  | "currentColumns"
  | "cyAttributes"
  | "isMasonry"
  | "isVertical"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "shapes"
>;
export interface LfMasonryAdapterGetters
  extends LfComponentAdapterGetters<LfMasonryInterface> {
  blocks: typeof LF_MASONRY_BLOCKS;
  compInstance: LfMasonryInterface;
  currentColumns: () => number;
  cyAttributes: typeof CY_ATTRIBUTES;
  isMasonry: () => boolean;
  isVertical: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  parts: typeof LF_MASONRY_PARTS;
  shapes: () => LfDataShapesMap;
}
//#endregion

//#region Events
export type LfMasonryEvent = (typeof LF_MASONRY_EVENTS)[number];
export interface LfMasonryEventPayload
  extends LfEventPayload<"LfMasonry", LfMasonryEvent> {
  selectedShape: LfMasonrySelectedShape;
}
//#endregion

//#region States
export type LfMasonrySelectedShape = {
  index?: number;
  shape?: Partial<LfDataCell<LfDataShapes>>;
};
//#endregion

//#region Props
export interface LfMasonryPropsInterface {
  lfActions?: boolean;
  lfColumns?: LfMasonryColumns;
  lfDataset?: LfDataDataset;
  lfSelectable?: boolean;
  lfShape?: LfDataShapes;
  lfStyle?: string;
  lfView?: LfMasonryView;
}
export type LfMasonryColumns = number[] | number;
export type LfMasonryView = (typeof LF_MASONRY_VIEWS)[number];
//#endregion

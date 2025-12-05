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
  LfComponentClassProperties,
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
/**
 * Primary interface implemented by the `lf-masonry` component. It merges the shared component contract with the component-specific props.
 */
export interface LfMasonryInterface
  extends LfComponent<"LfMasonry">,
    LfMasonryPropsInterface {
  getSelectedShape: () => Promise<LfMasonrySelectedShape>;
  redecorateShapes: () => Promise<void>;
  setSelectedShape: (index: number) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-masonry`.
 */
export interface LfMasonryElement
  extends HTMLStencilElement,
    Omit<LfMasonryInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-masonry` into host integrations.
 */
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
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfMasonryAdapterJsx extends LfComponentAdapterJsx {
  addColumn: () => VNode;
  removeColumn: () => VNode;
  changeView: () => VNode;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfMasonryAdapterRefs extends LfComponentAdapterRefs {
  addColumn: LfButtonElement;
  removeColumn: LfButtonElement;
  changeView: LfButtonElement;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfMasonryAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: CustomEvent<LfButtonEventPayload>) => void;
}
/**
 * Subset of adapter getters required during initialisation.
 */
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
/**
 * Utility interface used by the `lf-masonry` component.
 */
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
/**
 * Union of event identifiers emitted by `lf-masonry`.
 */
export type LfMasonryEvent = (typeof LF_MASONRY_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-masonry` events.
 */
export interface LfMasonryEventPayload
  extends LfEventPayload<"LfMasonry", LfMasonryEvent> {
  selectedShape: LfMasonrySelectedShape;
}
//#endregion

//#region States
/**
 * Utility type used by the `lf-masonry` component.
 */
export type LfMasonrySelectedShape = {
  index?: number;
  shape?: Partial<LfDataCell<LfDataShapes>>;
};
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-masonry` component.
 */
export interface LfMasonryPropsInterface {
  lfActions?: boolean;
  lfCaptureSelection?: boolean;
  lfCollapseColumns?: boolean;
  lfColumns?: LfMasonryColumns;
  lfDataset?: LfDataDataset;
  lfSelectable?: boolean;
  lfShape?: LfDataShapes;
  lfStyle?: string;
  lfView?: LfMasonryView;
}
/**
 * Utility type used by the `lf-masonry` component.
 */
export type LfMasonryColumns = number[] | number;
/**
 * Utility type used by the `lf-masonry` component.
 */
export type LfMasonryView = (typeof LF_MASONRY_VIEWS)[number];
//#endregion

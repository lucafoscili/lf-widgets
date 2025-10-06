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
/**
 * Primary interface implemented by the `lf-compare` component. It merges the shared component contract with the component-specific props.
 */
export interface LfCompareInterface
  extends LfComponent<"LfCompare">,
    LfComparePropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-compare`.
 */
export interface LfCompareElement
  extends HTMLStencilElement,
    Omit<LfCompareInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-compare` into host integrations.
 */
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
/**
 * Subset of adapter getters required during initialisation.
 */
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
/**
 * Subset of adapter setters required during initialisation.
 */
export type LfCompareAdapterInitializerSetters = Pick<
  LfCompareAdapterControllerSetters,
  | "leftPanelOpened"
  | "leftShape"
  | "rightPanelOpened"
  | "rightShape"
  | "splitView"
>;
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
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
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfCompareAdapterControllerSetters
  extends LfComponentAdapterSetters {
  leftPanelOpened: (value?: boolean) => void;
  leftShape: (shape: LfDataCell) => void;
  rightPanelOpened: (value?: boolean) => void;
  rightShape: (shape: LfDataCell) => void;
  splitView: (value: boolean) => void;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfCompareAdapterJsx extends LfComponentAdapterJsx {
  changeView: () => VNode;
  leftButton: () => VNode;
  leftTree: () => VNode;
  rightButton: () => VNode;
  rightTree: () => VNode;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfCompareAdapterRefs extends LfComponentAdapterRefs {
  changeView: LfButtonElement;
  leftButton: LfButtonElement;
  leftTree: LfTreeElement;
  rightButton: LfButtonElement;
  rightTree: LfTreeElement;
  slider: HTMLDivElement;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfCompareAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: CustomEvent<LfButtonEventPayload>) => void;
  tree: (e: CustomEvent<LfTreeEventPayload>) => void;
}
/**
 * Component-specific defaults used when instantiating adapter-managed layouts.
 */
export interface LfCompareAdapterDefaults {
  left: LfDataShapeDefaults;
  right: LfDataShapeDefaults;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-compare`.
 */
export type LfCompareEvent = (typeof LF_COMPARE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-compare` events.
 */
export interface LfCompareEventPayload
  extends LfEventPayload<"LfCompare", LfCompareEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-compare` component.
 */
export interface LfComparePropsInterface {
  lfDataset?: LfDataDataset;
  lfShape?: LfDataShapes;
  lfStyle?: string;
  lfView?: LfCompareView;
}
/**
 * Utility type used by the `lf-compare` component.
 */
export type LfCompareView = (typeof LF_COMPARE_VIEWS)[number];
//#endregion

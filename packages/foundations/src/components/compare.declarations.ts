import {
  LfComponentAdapter,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
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
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (toggles, batch changes)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfCompareAdapter
  extends LfComponentAdapter<
    LfCompareInterface,
    LfCompareEventPayload,
    LfCompareAdapterHandlers,
    LfCompareAdapterJsx,
    LfCompareAdapterRefs,
    LfCompareAdapterControllerGetters,
    LfCompareAdapterControllerSetters,
    LfCompareAdapterControllerComputed,
    LfCompareAdapterControllerActions
  > {
  controller: {
    get: LfCompareAdapterControllerGetters;
    set: LfCompareAdapterControllerSetters;
    computed: LfCompareAdapterControllerComputed;
    actions: LfCompareAdapterControllerActions;
  };
  dispatcher: LfCompareAdapterDispatcher;
  elements: {
    jsx: LfCompareAdapterJsx;
    refs: LfCompareAdapterRefs;
  };
  handlers: LfCompareAdapterHandlers;
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 * Contains ONLY pure state reads - predicates go in `computed`.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfCompareAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfCompareInterface,
    typeof LF_COMPARE_BLOCKS,
    Record<string, unknown>,
    typeof LF_COMPARE_PARTS
  > {
  /** Component-specific defaults */
  defaults: () => LfCompareAdapterDefaults;
  /** Current left panel open state */
  leftPanelOpened: () => boolean;
  /** Current right panel open state */
  rightPanelOpened: () => boolean;
  /** Current left shape */
  leftShape: () => LfDataCell;
  /** Current right shape */
  rightShape: () => LfDataCell;
  /** Available shapes */
  shapes: () => LfDataShapesMap[LfDataShapes];
  /** Slider position (0-100) */
  sliderPosition: () => number;
  /** Current view mode */
  view: () => LfCompareView;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 * Each setter performs exactly ONE state change.
 */
export interface LfCompareAdapterControllerSetters
  extends LfComponentAdapterSetters {
  leftPanelOpened: (value: boolean) => void;
  leftShape: (shape: LfDataCell) => void;
  rightPanelOpened: (value: boolean) => void;
  rightShape: (shape: LfDataCell) => void;
  sliderPosition: (value: number) => void;
  splitView: (value: boolean) => void;
}
/**
 * Derived values and predicates computed from state.
 * Pure functions with no side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCompareAdapterControllerComputed {
  /** Whether the current view is overlay mode */
  isOverlay: () => boolean;
  /** Whether the slider is at the start position (0) */
  isAtStart: () => boolean;
  /** Whether the slider is at the end position (100) */
  isAtEnd: () => boolean;
  /** Whether there are shapes available to compare */
  hasShapes: () => boolean;
}
/**
 * Multi-step operations that may batch changes or toggle state.
 * May have side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCompareAdapterControllerActions {
  /** Toggle left panel visibility */
  toggleLeftPanel: () => void;
  /** Toggle right panel visibility */
  toggleRightPanel: () => void;
  /** Set slider position with bounds checking (clamps 0-100) */
  setPositionWithBounds: (position: number) => void;
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
  changeView: HTMLButtonElement;
  leftButton: HTMLButtonElement;
  leftTree: LfTreeElement;
  rightButton: HTMLButtonElement;
  rightTree: LfTreeElement;
  slider: HTMLDivElement;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfCompareAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: MouseEvent, id: string, value?: boolean) => void;
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

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfCompareAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfCompareEventPayload>;
export type LfCompareAdapterDispatcherDetailOverrides = {
  [E in LfCompareEvent]: E extends "lf-event"
    ? LfCompareAdapterDispatchDetailBase & {
        originalEvent: CustomEvent;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfCompareAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfCompareAdapterDispatchDetailBase;
};
export type LfCompareAdapterDispatcher = LfComponentAdapterDispatcher<
  LfCompareEventPayload,
  LfCompareAdapterDispatcherDetailOverrides
>;
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

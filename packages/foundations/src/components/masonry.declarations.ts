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
  LfDataShapes,
  LfDataShapesMap,
} from "../framework/data.declarations";

import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_MASONRY_BLOCKS,
  LF_MASONRY_EVENTS,
  LF_MASONRY_IDS,
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
export interface LfMasonryAdapter
  extends LfComponentAdapter<
    LfMasonryInterface,
    LfMasonryEventPayload,
    LfMasonryAdapterHandlers,
    LfMasonryAdapterJsx,
    LfMasonryAdapterRefs,
    LfMasonryAdapterControllerGetters,
    LfMasonryAdapterControllerSetters,
    LfMasonryAdapterControllerComputed,
    LfMasonryAdapterControllerActions
  > {
  controller: {
    get: LfMasonryAdapterControllerGetters;
    set: LfMasonryAdapterControllerSetters;
    computed: LfMasonryAdapterControllerComputed;
    actions: LfMasonryAdapterControllerActions;
  };
  dispatcher: LfMasonryAdapterDispatcher;
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
  changeView: LfButtonElement;
  removeColumn: LfButtonElement;
  shapes: Map<string, HTMLElement>;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfMasonryAdapterHandlers extends LfComponentAdapterHandlers {
  button: (e: CustomEvent<LfButtonEventPayload>) => void;
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 * Contains ONLY pure state reads - predicates go in `computed`.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfMasonryAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfMasonryInterface,
    typeof LF_MASONRY_BLOCKS,
    typeof LF_MASONRY_IDS,
    typeof LF_MASONRY_PARTS
  > {
  /** Current column count */
  currentColumns: () => number;
  /** Selected shape index */
  selectedIndex: () => number | undefined;
  /** Currently selected shape */
  selectedShape: () => LfMasonrySelectedShape;
  /** All shapes keyed by shape type */
  shapes: () => LfDataShapesMap;
  /** Current view type */
  view: () => LfMasonryView;
}
/**
 * Simple single-value assignments exposed by the adapter.
 * Each setter performs exactly ONE state change.
 * Multi-step operations go in `actions`.
 */
export interface LfMasonryAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set selected index */
  selectedIndex: (index: number | undefined) => void;
  /** Set selected shape state */
  selectedShape: (shape: LfMasonrySelectedShape) => void;
  /** Set current view */
  view: (view: LfMasonryView) => void;
}
/**
 * Derived values and predicates computed from state.
 * Pure functions with no side effects.
 */
export interface LfMasonryAdapterControllerComputed {
  /** Predicate: whether component has any shapes */
  hasShapes: () => boolean;
  /** Predicate: whether a shape is selected */
  hasSelection: () => boolean;
  /** Predicate: whether specific index is selected */
  isSelected: (index: number) => boolean;
  /** Predicate: whether view is masonry */
  isMasonry: () => boolean;
  /** Predicate: whether view is vertical */
  isVertical: () => boolean;
}
/**
 * Multi-step operations that may batch changes or toggle state.
 * May have side effects.
 */
export interface LfMasonryAdapterControllerActions {
  /** Select a shape by index (updates state + emits event) */
  select: (index: number) => void;
  /** Clear the current selection */
  clearSelection: () => void;
  /** Toggle selection for an index */
  toggleSelection: (index: number) => void;
  /** Cycle through view modes */
  cycleView: () => void;
  /** Add a column to the masonry */
  addColumn: () => void;
  /** Remove a column from the masonry */
  removeColumn: () => void;
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

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfMasonryAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfMasonryEventPayload>;
export type LfMasonryAdapterDispatcherDetailOverrides = {
  [E in LfMasonryEvent]: E extends "lf-event"
    ? LfMasonryAdapterDispatchDetailBase & {
        originalEvent: CustomEvent;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfMasonryAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfMasonryAdapterDispatchDetailBase;
};
export type LfMasonryAdapterDispatcher = LfComponentAdapterDispatcher<
  LfMasonryEventPayload,
  LfMasonryAdapterDispatcherDetailOverrides
>;
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

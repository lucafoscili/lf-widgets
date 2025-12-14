import {
  LfComponentAdapter,
  LfComponentAdapterActions,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterComputed,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import {
  LF_DRAWER_BLOCKS,
  LF_DRAWER_DISPLAYS,
  LF_DRAWER_EVENTS,
  LF_DRAWER_IDS,
  LF_DRAWER_PARTS,
  LF_DRAWER_POSITIONS,
} from "./drawer.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-drawer` component. It merges the shared component contract with the component-specific props.
 */
export interface LfDrawerInterface
  extends LfComponent<"LfDrawer">,
    LfDrawerPropsInterface {
  close: () => Promise<void>;
  isOpened: () => Promise<boolean>;
  open: () => Promise<void>;
  toggle: () => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-drawer`.
 */
export interface LfDrawerElement
  extends HTMLStencilElement,
    Omit<LfDrawerInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-drawer` into host integrations.
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
export interface LfDrawerAdapter
  extends LfComponentAdapter<
    LfDrawerInterface,
    LfDrawerEventPayload,
    LfDrawerAdapterHandlers,
    LfDrawerAdapterJsx,
    LfDrawerAdapterRefs,
    LfDrawerAdapterControllerGetters,
    never,
    LfDrawerAdapterControllerComputed,
    LfDrawerAdapterControllerActions
  > {
  controller: {
    get: LfDrawerAdapterControllerGetters;
    computed: LfDrawerAdapterControllerComputed;
    actions: LfDrawerAdapterControllerActions;
  };
  elements: {
    jsx: LfDrawerAdapterJsx;
    refs: LfDrawerAdapterRefs;
  };
  handlers: LfDrawerAdapterHandlers;
  dispatcher: LfDrawerAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_DRAWER_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfDrawerAdapterRefs extends LfComponentAdapterRefs {
  /** Drawer container element */
  drawer: HTMLDivElement | null;
  /** Drawer content slot container */
  content: HTMLDivElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfDrawerAdapterJsx extends LfComponentAdapterJsx {
  /** Drawer container with slot */
  drawer: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfDrawerAdapterHandlers extends LfComponentAdapterHandlers {
  /** Handles keyboard events for focus trap and close */
  keyboard: (e: KeyboardEvent) => void;
  /** Handles backdrop click to close drawer */
  backdropClick: () => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfDrawerAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfDrawerInterface,
    (typeof LF_DRAWER_BLOCKS)["drawer"],
    (typeof LF_DRAWER_IDS)["drawer"],
    typeof LF_DRAWER_PARTS
  > {
  /** Get previously focused element before drawer opened */
  previouslyFocusedElement: () => HTMLElement | null;
}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfDrawerAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the drawer is currently open */
  isOpen: () => boolean;
  /** Whether the drawer is in responsive mode (breakpoint > 0) */
  isResponsive: () => boolean;
  /** Whether the drawer is in slide (modal) display mode */
  isSlide: () => boolean;
  /** Whether the drawer is in dock (fixed) display mode */
  isDock: () => boolean;
  /** Whether the drawer should show as modal (slide mode + open) */
  isModal: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfDrawerAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Opens the drawer with focus management */
  open: () => void;
  /** Closes the drawer with focus restoration */
  close: () => void;
  /** Toggles drawer open/closed state */
  toggle: () => void;
  /** Handles focus trapping within the drawer */
  trapFocus: (e: KeyboardEvent) => void;
  /** Focuses the first focusable element in the drawer */
  focusFirstElement: () => void;
  /** Applies responsive mode based on viewport width */
  applyResponsiveMode: () => void;
  /** Handles backdrop visibility changes between display modes */
  handleBackdropChange: (
    oldVal: LfDrawerDisplay,
    newVal: LfDrawerDisplay,
  ) => void;
  /** Stores the previously focused element */
  setPreviouslyFocusedElement: (el: HTMLElement | null) => void;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-drawer`.
 */
export type LfDrawerEvent = (typeof LF_DRAWER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-drawer` events.
 */
export interface LfDrawerEventPayload
  extends LfEventPayload<"LfDrawer", LfDrawerEvent> {}
//#endregion

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfDrawerAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfDrawerEventPayload>;
export type LfDrawerAdapterDispatcherDetailOverrides = {
  [E in LfDrawerEvent]: E extends "ready" | "unmount"
    ? Omit<LfDrawerAdapterDispatchDetailBase, "originalEvent"> & {
        originalEvent?: never;
      }
    : LfDrawerAdapterDispatchDetailBase;
};
export type LfDrawerAdapterDispatcher = LfComponentAdapterDispatcher<
  LfDrawerEventPayload,
  LfDrawerAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-drawer` component.
 */
export interface LfDrawerPropsInterface {
  lfDisplay?: LfDrawerDisplay;
  lfPosition?: LfDrawerPosition;
  lfResponsive?: number;
  lfStyle?: string;
  lfValue?: boolean;
}
/**
 * Utility type used by the `lf-drawer` component.
 */
export type LfDrawerDisplay = (typeof LF_DRAWER_DISPLAYS)[number];
/**
 * Utility type used by the `lf-drawer` component.
 */
export type LfDrawerPosition = (typeof LF_DRAWER_POSITIONS)[number];
//#endregion

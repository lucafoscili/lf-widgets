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
import { LfFrameworkInterface } from "../framework/framework.declarations";
import {
  LfThemeIcon,
  LfThemeUISize,
  LfThemeUIState,
} from "../framework/theme.declarations";
import {
  LF_TOAST_BLOCKS,
  LF_TOAST_EVENTS,
  LF_TOAST_IDS,
  LF_TOAST_PARTS,
} from "./toast.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-toast` component. It merges the shared component contract with the component-specific props.
 */
export interface LfToastInterface
  extends LfComponent<"LfToast">,
    LfToastPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfToastEventPayload) => void;
  };
}
/**
 * DOM element type for the custom element registered as `lf-toast`.
 */
export interface LfToastElement
  extends HTMLStencilElement,
    Omit<LfToastInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-toast` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (hasCloseIcon, hasIcon, hasTimer)
 * - controller.actions: Complex operations (close)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks (closeButton)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfToastAdapter
  extends LfComponentAdapter<
    LfToastInterface,
    LfToastEventPayload,
    LfToastAdapterHandlers,
    LfToastAdapterJsx,
    LfToastAdapterRefs,
    LfToastAdapterControllerGetters,
    undefined,
    LfToastAdapterControllerComputed,
    LfToastAdapterControllerActions
  > {
  controller: {
    get: LfToastAdapterControllerGetters;
    computed: LfToastAdapterControllerComputed;
    actions: LfToastAdapterControllerActions;
  };
  elements: {
    jsx: LfToastAdapterJsx;
    refs: LfToastAdapterRefs;
  };
  handlers: LfToastAdapterHandlers;
  dispatcher: LfToastAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_TOAST_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfToastAdapterRefs extends LfComponentAdapterRefs {
  toast: HTMLDivElement | null;
  icon: HTMLElement | null;
  closeButton: HTMLElement | null;
  message: HTMLDivElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfToastAdapterJsx extends LfComponentAdapterJsx {
  toast: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfToastAdapterHandlers extends LfComponentAdapterHandlers {
  closeButton: (e: PointerEvent) => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfToastAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfToastInterface,
    typeof LF_TOAST_BLOCKS,
    typeof LF_TOAST_IDS,
    typeof LF_TOAST_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfToastAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the toast has a close icon */
  hasCloseIcon: () => boolean;
  /** Whether the toast has an icon */
  hasIcon: () => boolean;
  /** Whether the toast has a timer */
  hasTimer: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfToastAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Close the toast */
  close: (e?: PointerEvent) => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfToastAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfToastEventPayload>;
export type LfToastAdapterDispatcherDetailOverrides = {
  [E in LfToastEvent]: E extends "close"
    ? LfToastAdapterDispatchDetailBase & { originalEvent: PointerEvent }
    : E extends "ready" | "unmount"
      ? Omit<LfToastAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfToastAdapterDispatchDetailBase;
};
export type LfToastAdapterDispatcher = LfComponentAdapterDispatcher<
  LfToastEventPayload,
  LfToastAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-toast`.
 */
export type LfToastEvent = (typeof LF_TOAST_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-toast` events.
 */
export interface LfToastEventPayload
  extends LfEventPayload<"LfToast", LfToastEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-toast` component.
 */
export interface LfToastPropsInterface {
  lfCloseCallback?: LfToastCloseCallback;
  lfCloseIcon?: string | LfThemeIcon;
  lfIcon?: string | LfThemeIcon;
  lfMessage?: string;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfTimer?: number;
}
/**
 * Utility type used by the `lf-toast` component.
 */
export type LfToastCloseCallback = (
  toast: LfToastInterface,
  e: PointerEvent,
  ...args: any[]
) => any;

/**
 * Props interface for the `LfToastFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfToastFCProps {
  /** Assigned class for custom styling */
  className?: string;
  /** Callback invoked when the toast is closed */
  closeCallback?: () => void;
  /** Icon shown in the close button */
  closeIcon?: string;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Leading icon displayed in the toast */
  icon?: string;
  /** Unique identifier for the component */
  id?: string;
  /** Message content displayed in the toast */
  message?: string;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /** Timer duration in milliseconds for auto-close (shows progress bar) */
  timer?: number;
  /**
   * UI size multiplier for the component.
   * Controls font-size scaling. Required for composed usage where
   * CSS inheritance from :host doesn't work (e.g., portaled content).
   * @default "medium"
   */
  uiSize?: LfThemeUISize;
  /**
   * UI state for theming (primary, success, warning, danger, etc.).
   * Controls color scheme. Required for composed usage where
   * CSS cascade doesn't work (e.g., portaled content).
   * @default "primary"
   */
  uiState?: LfThemeUIState;
}
//#endregion

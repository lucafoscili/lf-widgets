import { LfIconType } from "../foundations";
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
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_SNACKBAR_BLOCKS,
  LF_SNACKBAR_EVENTS,
  LF_SNACKBAR_IDS,
  LF_SNACKBAR_PARTS,
  LF_SNACKBAR_POSITIONS,
} from "./snackbar.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-snackbar` component.
 */
export interface LfSnackbarInterface
  extends LfComponent<"LfSnackbar">,
    LfSnackbarPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfSnackbarEventPayload) => void;
  };
}

/**
 * DOM element type for the custom element registered as `lf-snackbar`.
 */
export interface LfSnackbarElement
  extends HTMLStencilElement,
    Omit<LfSnackbarInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-snackbar` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (hasAction, hasCloseIcon, hasIcon)
 * - controller.actions: Complex operations (close)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfSnackbarAdapter
  extends LfComponentAdapter<
    LfSnackbarInterface,
    LfSnackbarEventPayload,
    LfSnackbarAdapterHandlers,
    LfSnackbarAdapterJsx,
    LfSnackbarAdapterRefs,
    LfSnackbarAdapterControllerGetters,
    never,
    LfSnackbarAdapterControllerComputed,
    LfSnackbarAdapterControllerActions
  > {
  controller: {
    get: LfSnackbarAdapterControllerGetters;
    computed: LfSnackbarAdapterControllerComputed;
    actions: LfSnackbarAdapterControllerActions;
  };
  elements: {
    jsx: LfSnackbarAdapterJsx;
    refs: LfSnackbarAdapterRefs;
  };
  handlers: LfSnackbarAdapterHandlers;
  dispatcher: LfSnackbarAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_SNACKBAR_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfSnackbarAdapterRefs extends LfComponentAdapterRefs {
  actionButton: HTMLButtonElement | null;
  closeButton: HTMLElement | null;
  content: HTMLElement | null;
  icon: HTMLElement | null;
  message: HTMLElement | null;
  snackbar: HTMLElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfSnackbarAdapterJsx extends LfComponentAdapterJsx {
  snackbar: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfSnackbarAdapterHandlers extends LfComponentAdapterHandlers {
  action: (e: PointerEvent) => void;
  close: (e: PointerEvent) => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfSnackbarAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfSnackbarInterface,
    typeof LF_SNACKBAR_BLOCKS,
    typeof LF_SNACKBAR_IDS,
    typeof LF_SNACKBAR_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSnackbarAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the snackbar has an action button */
  hasAction: () => boolean;
  /** Whether the snackbar has a close icon */
  hasCloseIcon: () => boolean;
  /** Whether the snackbar has an icon */
  hasIcon: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSnackbarAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Close/unmount the snackbar */
  close: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfSnackbarAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfSnackbarEventPayload>;
export type LfSnackbarAdapterDispatcherDetailOverrides = {
  [E in LfSnackbarEvent]: E extends "action" | "close"
    ? LfSnackbarAdapterDispatchDetailBase & { originalEvent: PointerEvent }
    : E extends "ready" | "unmount"
      ? Omit<LfSnackbarAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfSnackbarAdapterDispatchDetailBase;
};
export type LfSnackbarAdapterDispatcher = LfComponentAdapterDispatcher<
  LfSnackbarEventPayload,
  LfSnackbarAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-snackbar`.
 */
export type LfSnackbarEvent = (typeof LF_SNACKBAR_EVENTS)[number];

/**
 * Detail payload structure dispatched with `lf-snackbar` events.
 */
export interface LfSnackbarEventPayload
  extends LfEventPayload<"LfSnackbar", LfSnackbarEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-snackbar` component.
 */
export interface LfSnackbarPropsInterface {
  lfAction?: string;
  lfActionCallback?: LfSnackbarActionCallback;
  lfCloseIcon?: LfIconType | null;
  lfDuration?: number;
  lfIcon?: LfIconType | null;
  lfMessage?: string;
  lfPosition?: LfSnackbarPositions;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
/**
 * Callback invoked when the snackbar action button is clicked.
 */
export type LfSnackbarActionCallback = (
  snackbar: LfSnackbarInterface,
  e: PointerEvent,
  ...args: unknown[]
) => unknown;
/**
 * Positioning options for the snackbar.
 */
export type LfSnackbarPositions = (typeof LF_SNACKBAR_POSITIONS)[number];
//#endregion

//#region Functional Component Props
/**
 * Props interface for the `LfSnackbarFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfSnackbarFCProps {
  /** Text label for action button. If omitted, no action button appears */
  action?: string;
  /** Assigned class for custom styling */
  className?: string;
  /** Icon shown in the close button */
  closeIcon?: LfIconType | null;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Whether the snackbar has an action button */
  hasAction?: boolean;
  /** Whether the snackbar has a close icon */
  hasCloseIcon?: boolean;
  /** Whether the snackbar has an icon */
  hasIcon?: boolean;
  /** Optional icon shown at the start of the snackbar */
  icon?: LfIconType | null;
  /** Unique identifier for the component */
  id?: string;
  /** Message text displayed in the snackbar */
  message?: string;
  /** Callback fired when action button is clicked */
  onAction?: (e: PointerEvent) => void;
  /** Callback fired when close button is clicked */
  onClose?: (e: PointerEvent) => void;
  /** Positioning of the snackbar (for inline styling) */
  position?: LfSnackbarPositions;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
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

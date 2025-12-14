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
  LfThemeIcon,
  LfThemeUISize,
  LfThemeUIState,
} from "../framework/theme.declarations";
import {
  LF_SPINNER_BLOCKS,
  LF_SPINNER_EVENTS,
  LF_SPINNER_IDS,
  LF_SPINNER_PARTS,
  LfSpinnerLayout,
} from "./spinner.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-spinner` component. It merges the shared component contract with the component-specific props.
 */
export interface LfSpinnerInterface
  extends LfComponent<"LfSpinner">,
    LfSpinnerPropsInterface {
  /**
   * Internal runtime state for fader visibility.
   */
  bigWait: boolean;
  getProgress(): Promise<number>;
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfSpinnerEventPayload) => void;
  };
  /**
   * Internal runtime state for progress percentage.
   */
  progress: number;
}
/**
 * DOM element type for the custom element registered as `lf-spinner`.
 */
export interface LfSpinnerElement
  extends HTMLStencilElement,
    Omit<LfSpinnerInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-spinner` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isBarVariant, showFader)
 * - controller.actions: Complex operations (startProgressBar, scheduleFader)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfSpinnerAdapter
  extends LfComponentAdapter<
    LfSpinnerInterface,
    LfSpinnerEventPayload,
    LfSpinnerAdapterHandlers,
    LfSpinnerAdapterJsx,
    LfSpinnerAdapterRefs,
    LfSpinnerAdapterControllerGetters,
    never,
    LfSpinnerAdapterControllerComputed,
    LfSpinnerAdapterControllerActions
  > {
  controller: {
    get: LfSpinnerAdapterControllerGetters;
    computed: LfSpinnerAdapterControllerComputed;
    actions: LfSpinnerAdapterControllerActions;
  };
  elements: {
    jsx: LfSpinnerAdapterJsx;
    refs: LfSpinnerAdapterRefs;
  };
  handlers: LfSpinnerAdapterHandlers;
  dispatcher: LfSpinnerAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_SPINNER_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfSpinnerAdapterRefs extends LfComponentAdapterRefs {
  spinner: HTMLDivElement | null;
  content: HTMLDivElement | null;
  fader: HTMLDivElement | null;
  bar: HTMLDivElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfSpinnerAdapterJsx extends LfComponentAdapterJsx {
  spinner: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfSpinnerAdapterHandlers extends LfComponentAdapterHandlers {}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfSpinnerAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfSpinnerInterface,
    typeof LF_SPINNER_BLOCKS,
    typeof LF_SPINNER_IDS,
    typeof LF_SPINNER_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSpinnerAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the spinner is displaying the bar variant */
  isBarVariant: () => boolean;
  /** Whether the fader overlay should be displayed */
  showFader: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSpinnerAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Start the progress bar animation */
  startProgressBar: () => void;
  /** Cancel the progress bar animation */
  cancelProgressBar: () => void;
  /** Schedule the fader timeout */
  scheduleFader: () => void;
  /** Clear the fader timeout */
  clearFaderTimer: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfSpinnerAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfSpinnerEventPayload>;
export type LfSpinnerAdapterDispatcherDetailOverrides = {
  [E in LfSpinnerEvent]: E extends "ready" | "unmount"
    ? Omit<LfSpinnerAdapterDispatchDetailBase, "originalEvent"> & {
        originalEvent?: never;
      }
    : LfSpinnerAdapterDispatchDetailBase;
};
export type LfSpinnerAdapterDispatcher = LfComponentAdapterDispatcher<
  LfSpinnerEventPayload,
  LfSpinnerAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-spinner`.
 */
export type LfSpinnerEvent = (typeof LF_SPINNER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-spinner` events.
 */
export interface LfSpinnerEventPayload
  extends LfEventPayload<"LfSpinner", LfSpinnerEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-spinner` component.
 */
export interface LfSpinnerPropsInterface {
  lfActive?: boolean;
  lfBarVariant?: boolean;
  lfFader?: boolean;
  lfFaderTimeout?: number;
  lfFullScreen?: boolean;
  lfIcon?: LfThemeIcon;
  lfLayout?: LfSpinnerLayout;
  lfStyle?: string;
  lfTimeout?: number;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
//#endregion

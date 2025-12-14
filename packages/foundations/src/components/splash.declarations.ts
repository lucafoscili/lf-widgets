import {
  LfComponentAdapter,
  LfComponentAdapterBaseGetters,
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
  LF_SPLASH_BLOCKS,
  LF_SPLASH_EVENTS,
  LF_SPLASH_IDS,
  LF_SPLASH_PARTS,
  LF_SPLASH_STATES,
} from "./splash.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-splash` component. It merges the shared component contract with the component-specific props.
 */
export interface LfSplashInterface
  extends LfComponent<"LfSplash">,
    LfSplashPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfSplashEventPayload) => void;
  };
  /**
   * Internal runtime state mirrored by the component implementation.
   */
  state: LfSplashStates;
}
/**
 * DOM element type for the custom element registered as `lf-splash`.
 */
export interface LfSplashElement
  extends HTMLStencilElement,
    Omit<LfSplashInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-splash` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (isUnmounting)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks (minimal for this simple component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfSplashAdapter
  extends LfComponentAdapter<
    LfSplashInterface,
    LfSplashEventPayload,
    LfSplashAdapterHandlers,
    LfSplashAdapterJsx,
    LfSplashAdapterRefs,
    LfSplashAdapterControllerGetters
  > {
  controller: {
    get: LfSplashAdapterControllerGetters;
    computed: LfSplashAdapterControllerComputed;
    actions: LfSplashAdapterControllerActions;
  };
  elements: {
    jsx: LfSplashAdapterJsx;
    refs: LfSplashAdapterRefs;
  };
  handlers: LfSplashAdapterHandlers;
  dispatcher: LfSplashAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_SPLASH_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfSplashAdapterRefs extends LfComponentAdapterRefs {
  splash: HTMLDivElement | null;
  content: HTMLDivElement | null;
  label: HTMLDivElement | null;
  widget: HTMLDivElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfSplashAdapterJsx extends LfComponentAdapterJsx {
  splash: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfSplashAdapterHandlers extends LfComponentAdapterHandlers {}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfSplashAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfSplashInterface,
    typeof LF_SPLASH_BLOCKS,
    typeof LF_SPLASH_IDS,
    typeof LF_SPLASH_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSplashAdapterControllerComputed {
  [key: string]: ((...args: unknown[]) => unknown) | undefined;
  /** Whether the splash is in unmounting state */
  isUnmounting: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSplashAdapterControllerActions {
  [key: string]:
    | ((...args: unknown[]) => void | Promise<void>)
    | LfSplashAdapterControllerActions
    | undefined;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfSplashAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfSplashEventPayload>;
export type LfSplashAdapterDispatcherDetailOverrides = {
  [E in LfSplashEvent]: E extends "ready" | "unmount"
    ? Omit<LfSplashAdapterDispatchDetailBase, "originalEvent"> & {
        originalEvent?: never;
      }
    : LfSplashAdapterDispatchDetailBase;
};
export type LfSplashAdapterDispatcher = LfComponentAdapterDispatcher<
  LfSplashEventPayload,
  LfSplashAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-splash`.
 */
export type LfSplashEvent = (typeof LF_SPLASH_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-splash` events.
 */
export interface LfSplashEventPayload
  extends LfEventPayload<"LfSplash", LfSplashEvent> {}
//#endregion

//#region States
/**
 * Union of state identifiers exported in `LF_SPLASH_STATES`.
 */
export type LfSplashStates = (typeof LF_SPLASH_STATES)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-splash` component.
 */
export interface LfSplashPropsInterface {
  lfLabel?: string;
  lfStyle?: string;
}
//#endregion

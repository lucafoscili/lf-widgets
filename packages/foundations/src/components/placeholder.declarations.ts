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
  LfComponentName,
  LfComponentProps,
  LfComponentRootElement,
  VNode,
} from "../foundations/components.declarations";
import { LfEvent, LfEventPayload } from "../foundations/events.declarations";
import { LfThemeIcon } from "../framework/theme.declarations";
import {
  LF_PLACEHOLDER_BLOCKS,
  LF_PLACEHOLDER_EVENTS,
  LF_PLACEHOLDER_IDS,
  LF_PLACEHOLDER_PARTS,
  LF_PLACEHOLDER_TRIGGERS,
} from "./placeholder.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-placeholder` component. It merges the shared component contract with the component-specific props.
 */
export interface LfPlaceholderInterface
  extends LfComponent<"LfPlaceholder">,
    LfPlaceholderPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfPlaceholderEventPayload) => void;
  };
  /**
   * Internal runtime state mirrored by the component implementation.
   */
  isInViewport: boolean;
}
/**
 * DOM element type for the custom element registered as `lf-placeholder`.
 */
export interface LfPlaceholderElement
  extends HTMLStencilElement,
    Omit<LfPlaceholderInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-placeholder` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.computed: Derived predicates (shouldRender)
 * - controller.actions: Complex operations (triggerLoad)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfPlaceholderAdapter
  extends LfComponentAdapter<
    LfPlaceholderInterface,
    LfPlaceholderEventPayload,
    LfPlaceholderAdapterHandlers,
    LfPlaceholderAdapterJsx,
    LfPlaceholderAdapterRefs,
    LfPlaceholderAdapterControllerGetters,
    never,
    LfPlaceholderAdapterControllerComputed,
    LfPlaceholderAdapterControllerActions
  > {
  controller: {
    get: LfPlaceholderAdapterControllerGetters;
    computed: LfPlaceholderAdapterControllerComputed;
    actions: LfPlaceholderAdapterControllerActions;
  };
  elements: {
    jsx: LfPlaceholderAdapterJsx;
    refs: LfPlaceholderAdapterRefs;
  };
  handlers: LfPlaceholderAdapterHandlers;
  dispatcher: LfPlaceholderAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_PLACEHOLDER_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfPlaceholderAdapterRefs extends LfComponentAdapterRefs {
  placeholder: HTMLDivElement | null;
  wrapper: HTMLDivElement | null;
  component: LfComponentRootElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfPlaceholderAdapterJsx extends LfComponentAdapterJsx {
  placeholder: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfPlaceholderAdapterHandlers
  extends LfComponentAdapterHandlers {
  component: (e: LfEvent) => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfPlaceholderAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfPlaceholderInterface,
    typeof LF_PLACEHOLDER_BLOCKS,
    typeof LF_PLACEHOLDER_IDS,
    typeof LF_PLACEHOLDER_PARTS
  > {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfPlaceholderAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the component should render based on trigger conditions */
  shouldRender: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfPlaceholderAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Manually triggers the placeholder to load the component */
  triggerLoad: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfPlaceholderAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfPlaceholderEventPayload>;
export type LfPlaceholderAdapterDispatcherDetailOverrides = {
  [E in LfPlaceholderEvent]: E extends "lf-event"
    ? LfPlaceholderAdapterDispatchDetailBase & {
        originalEvent: LfEvent;
      }
    : E extends "ready" | "load" | "unmount"
      ? Omit<LfPlaceholderAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfPlaceholderAdapterDispatchDetailBase;
};
export type LfPlaceholderAdapterDispatcher = LfComponentAdapterDispatcher<
  LfPlaceholderEventPayload,
  LfPlaceholderAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-placeholder`.
 */
export type LfPlaceholderEvent = (typeof LF_PLACEHOLDER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-placeholder` events.
 */
export interface LfPlaceholderEventPayload
  extends LfEventPayload<"LfPlaceholder", LfPlaceholderEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-placeholder` component.
 */
export interface LfPlaceholderPropsInterface {
  lfIcon?: LfThemeIcon;
  lfProps?: LfComponentProps;
  lfStyle?: string;
  lfThreshold?: number;
  lfTrigger?: LfPlaceholderTrigger;
  lfValue?: LfComponentName;
}
/**
 * Utility type used by the `lf-placeholder` component.
 */
export type LfPlaceholderTrigger = (typeof LF_PLACEHOLDER_TRIGGERS)[number];
//#endregion

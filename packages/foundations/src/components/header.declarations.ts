import {
  LfComponentAdapter,
  LfComponentAdapterActions,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterComputed,
  LfComponentAdapterDispatcher,
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
  LF_HEADER_BLOCKS,
  LF_HEADER_EVENTS,
  LF_HEADER_IDS,
  LF_HEADER_PARTS,
} from "./header.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-header` component. It merges the shared component contract with the component-specific props.
 */
export interface LfHeaderInterface
  extends LfComponent<"LfHeader">,
    LfHeaderPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfHeaderEventPayload) => void;
  };
}
/**
 * DOM element type for the custom element registered as `lf-header`.
 */
export interface LfHeaderElement
  extends HTMLStencilElement,
    Omit<LfHeaderInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-header` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Empty for display-only component
 * - controller.computed: Empty for display-only component
 * - controller.actions: Empty for display-only component
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfHeaderAdapter
  extends LfComponentAdapter<
    LfHeaderInterface,
    LfHeaderEventPayload,
    LfHeaderAdapterHandlers,
    LfHeaderAdapterJsx,
    LfHeaderAdapterRefs,
    LfHeaderAdapterControllerGetters,
    LfHeaderAdapterControllerSetters,
    LfHeaderAdapterControllerComputed,
    LfHeaderAdapterControllerActions
  > {
  controller: {
    get: LfHeaderAdapterControllerGetters;
    set: LfHeaderAdapterControllerSetters;
    computed: LfHeaderAdapterControllerComputed;
    actions: LfHeaderAdapterControllerActions;
  };
  elements: {
    jsx: LfHeaderAdapterJsx;
    refs: LfHeaderAdapterRefs;
  };
  handlers: LfHeaderAdapterHandlers;
  dispatcher: LfHeaderAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_HEADER_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfHeaderAdapterRefs extends LfComponentAdapterRefs {
  header: HTMLElement | null;
  section: HTMLElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfHeaderAdapterJsx extends LfComponentAdapterJsx {
  header: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 * Empty for display-only component.
 */
export interface LfHeaderAdapterHandlers {}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfHeaderAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfHeaderInterface,
    typeof LF_HEADER_BLOCKS,
    typeof LF_HEADER_IDS,
    typeof LF_HEADER_PARTS
  > {}
/**
 * Simple single-value setters.
 * Empty for display-only component.
 */
export interface LfHeaderAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Computed values - derived predicates and builders.
 * Empty for display-only component.
 */
export interface LfHeaderAdapterControllerComputed
  extends LfComponentAdapterComputed {}
/**
 * Complex multi-step actions.
 * Empty for display-only component.
 */
export interface LfHeaderAdapterControllerActions
  extends LfComponentAdapterActions {}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfHeaderAdapterDispatcher =
  LfComponentAdapterDispatcher<LfHeaderEventPayload>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-header`.
 */
export type LfHeaderEvent = (typeof LF_HEADER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-header` events.
 */
export interface LfHeaderEventPayload
  extends LfEventPayload<"LfHeader", LfHeaderEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-header` component.
 */
export interface LfHeaderPropsInterface {
  lfStyle?: string;
}
//#endregion

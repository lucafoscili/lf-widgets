import {
  LfComponentAdapter,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterActions,
  LfComponentAdapterComputed,
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
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_PROGRESSBAR_BLOCKS,
  LF_PROGRESSBAR_EVENTS,
  LF_PROGRESSBAR_IDS,
  LF_PROGRESSBAR_PARTS,
} from "./progressbar.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-progressbar` component. It merges the shared component contract with the component-specific props.
 */
export interface LfProgressbarInterface
  extends LfComponent<"LfProgressbar">,
    LfProgressbarPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfProgressbarEventPayload) => void;
  };
}
/**
 * DOM element type for the custom element registered as `lf-progressbar`.
 */
export interface LfProgressbarElement
  extends HTMLStencilElement,
    Omit<LfProgressbarInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-progressbar` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple assignments (empty for display component)
 * - controller.computed: Derived predicates (empty for display component)
 * - controller.actions: Complex operations (empty for display component)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks (empty for display component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfProgressbarAdapter
  extends LfComponentAdapter<
    LfProgressbarInterface,
    LfProgressbarEventPayload,
    LfProgressbarAdapterHandlers,
    LfProgressbarAdapterJsx,
    LfProgressbarAdapterRefs,
    LfProgressbarAdapterControllerGetters,
    LfProgressbarAdapterControllerSetters,
    LfProgressbarAdapterControllerComputed,
    LfProgressbarAdapterControllerActions
  > {
  controller: {
    get: LfProgressbarAdapterControllerGetters;
    set: LfProgressbarAdapterControllerSetters;
    computed: LfProgressbarAdapterControllerComputed;
    actions: LfProgressbarAdapterControllerActions;
  };
  elements: {
    jsx: LfProgressbarAdapterJsx;
    refs: LfProgressbarAdapterRefs;
  };
  handlers: LfProgressbarAdapterHandlers;
  dispatcher: LfProgressbarAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_PROGRESSBAR_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfProgressbarAdapterRefs extends LfComponentAdapterRefs {
  progressbar: HTMLDivElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfProgressbarAdapterJsx extends LfComponentAdapterJsx {
  progressbar: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 * Empty for simple display component.
 */
export interface LfProgressbarAdapterHandlers
  extends LfComponentAdapterHandlers {}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfProgressbarAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfProgressbarInterface,
    typeof LF_PROGRESSBAR_BLOCKS,
    typeof LF_PROGRESSBAR_IDS,
    typeof LF_PROGRESSBAR_PARTS
  > {}
/**
 * Simple single-value setters.
 * Empty for simple display component.
 */
export interface LfProgressbarAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Computed values - derived predicates and builders.
 * Empty for simple display component.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfProgressbarAdapterControllerComputed
  extends LfComponentAdapterComputed {}
/**
 * Complex multi-step actions.
 * Empty for simple display component.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfProgressbarAdapterControllerActions
  extends LfComponentAdapterActions {}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfProgressbarAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfProgressbarEventPayload>;
export type LfProgressbarAdapterDispatcherDetailOverrides = {
  [E in LfProgressbarEvent]: E extends "ready" | "unmount"
    ? Omit<LfProgressbarAdapterDispatchDetailBase, "originalEvent"> & {
        originalEvent?: never;
      }
    : LfProgressbarAdapterDispatchDetailBase;
};
export type LfProgressbarAdapterDispatcher = LfComponentAdapterDispatcher<
  LfProgressbarEventPayload,
  LfProgressbarAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-progressbar`.
 */
export type LfProgressbarEvent = (typeof LF_PROGRESSBAR_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-progressbar` events.
 */
export interface LfProgressbarEventPayload
  extends LfEventPayload<"LfProgressbar", LfProgressbarEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-progressbar` component.
 */
export interface LfProgressbarPropsInterface {
  lfAnimated?: boolean;
  lfCenteredLabel?: boolean;
  lfIcon?: string;
  lfIsRadial?: boolean;
  lfLabel?: string;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number;
}
//#endregion

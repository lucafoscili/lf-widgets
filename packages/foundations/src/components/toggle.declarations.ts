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
  LF_TOGGLE_BLOCKS,
  LF_TOGGLE_EVENTS,
  LF_TOGGLE_IDS,
  LF_TOGGLE_PARTS,
  LF_TOGGLE_STATES,
} from "./toggle.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-toggle` component. It merges the shared component contract with the component-specific props.
 */
export interface LfToggleInterface
  extends LfComponent<"LfToggle">,
    LfTogglePropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfToggleEventPayload) => void;
  };
  /**
   * Internal runtime state mirrored by the component implementation.
   */
  value: LfToggleState;
  setValue: (value: LfToggleState | boolean) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-toggle`.
 */
export interface LfToggleElement
  extends HTMLStencilElement,
    Omit<LfToggleInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-toggle` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple assignments
 * - controller.computed: Derived predicates (isDisabled, isOn)
 * - controller.actions: Complex operations (toggle)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfToggleAdapter
  extends LfComponentAdapter<
    LfToggleInterface,
    LfToggleEventPayload,
    LfToggleAdapterHandlers,
    LfToggleAdapterJsx,
    LfToggleAdapterRefs,
    LfToggleAdapterControllerGetters,
    LfToggleAdapterControllerSetters,
    LfToggleAdapterControllerComputed,
    LfToggleAdapterControllerActions
  > {
  controller: {
    get: LfToggleAdapterControllerGetters;
    set: LfToggleAdapterControllerSetters;
    computed: LfToggleAdapterControllerComputed;
    actions: LfToggleAdapterControllerActions;
  };
  elements: {
    jsx: LfToggleAdapterJsx;
    refs: LfToggleAdapterRefs;
  };
  handlers: LfToggleAdapterHandlers;
  dispatcher: LfToggleAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_TOGGLE_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfToggleAdapterRefs extends LfComponentAdapterRefs {
  input: HTMLInputElement | null;
  label: HTMLLabelElement | null;
  thumb: HTMLDivElement | null;
  track: HTMLDivElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfToggleAdapterJsx extends LfComponentAdapterJsx {
  toggle: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfToggleAdapterHandlers extends LfComponentAdapterHandlers {
  toggle: {
    onBlur: (e: FocusEvent) => void;
    onChange: (e: Event) => void;
    onFocus: (e: FocusEvent) => void;
    onPointerDown: (e: PointerEvent) => void;
  };
  label: {
    onClick: (e: MouseEvent) => void;
  };
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfToggleAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfToggleInterface,
    typeof LF_TOGGLE_BLOCKS,
    typeof LF_TOGGLE_IDS,
    typeof LF_TOGGLE_PARTS
  > {}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfToggleAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfToggleAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the toggle is disabled based on lfUiState */
  isDisabled: () => boolean;
  /** Whether the toggle is in "on" state */
  isOn: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfToggleAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Toggle state (on/off) */
  toggle: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfToggleAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfToggleEventPayload>;
export type LfToggleAdapterDispatcherDetailOverrides = {
  [E in LfToggleEvent]: E extends "blur" | "focus"
    ? LfToggleAdapterDispatchDetailBase & { originalEvent: FocusEvent }
    : E extends "pointerdown"
      ? LfToggleAdapterDispatchDetailBase & { originalEvent: PointerEvent }
      : E extends "change"
        ? LfToggleAdapterDispatchDetailBase & { originalEvent: Event }
        : LfToggleAdapterDispatchDetailBase;
};
export type LfToggleAdapterDispatcher = LfComponentAdapterDispatcher<
  LfToggleEventPayload,
  LfToggleAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-toggle`.
 */
export type LfToggleEvent = (typeof LF_TOGGLE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-toggle` events.
 */
export interface LfToggleEventPayload
  extends LfEventPayload<"LfToggle", LfToggleEvent> {
  value: string;
  valueAsBoolean: boolean;
}
//#endregion

//#region States
/**
 * Union of runtime states declared in `LF_TOGGLE_STATES`.
 */
export type LfToggleState = (typeof LF_TOGGLE_STATES)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-toggle` component.
 */
export interface LfTogglePropsInterface {
  lfAriaLabel?: string;
  lfLabel?: string;
  lfLeadingLabel?: boolean;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: boolean;
}
//#endregion

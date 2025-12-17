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
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_CHECKBOX_BLOCKS,
  LF_CHECKBOX_EVENTS,
  LF_CHECKBOX_IDS,
  LF_CHECKBOX_PARTS,
  LF_CHECKBOX_STATES,
} from "./checkbox.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-checkbox` component. It merges the shared component contract with the component-specific props.
 *
 * In "Adapter as Core" pattern:
 * - WC implements this interface but delegates state to adapter
 * - `value` and `setValue` are bridge methods to adapter's internal state
 */
export interface LfCheckboxInterface
  extends LfComponent<"LfCheckbox">,
    LfCheckboxPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfCheckboxEventPayload) => void;
  };
  /**
   * Internal runtime state mirrored by the component implementation.
   * @deprecated In "Adapter as Core" pattern, use adapter.controller.get.value() instead
   */
  value: LfCheckboxState;
  getValue: () => Promise<LfCheckboxState>;
  setValue: (value: LfCheckboxState | boolean) => Promise<void>;
}

/**
 * DOM element type for the custom element registered as `lf-checkbox`.
 */
export interface LfCheckboxElement
  extends HTMLStencilElement,
    Omit<LfCheckboxInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-checkbox` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple assignments (none for checkbox)
 * - controller.computed: Derived predicates (isChecked, isDisabled, isIndeterminate)
 * - controller.actions: Complex operations (toggle)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfCheckboxAdapter
  extends LfComponentAdapter<
    LfCheckboxInterface,
    LfCheckboxEventPayload,
    LfCheckboxAdapterHandlers,
    LfCheckboxAdapterJsx,
    LfCheckboxAdapterRefs,
    LfCheckboxAdapterControllerGetters,
    LfCheckboxAdapterControllerSetters,
    LfCheckboxAdapterControllerComputed,
    LfCheckboxAdapterControllerActions
  > {
  controller: {
    get: LfCheckboxAdapterControllerGetters;
    set: LfCheckboxAdapterControllerSetters;
    computed: LfCheckboxAdapterControllerComputed;
    actions: LfCheckboxAdapterControllerActions;
  };
  elements: {
    jsx: LfCheckboxAdapterJsx;
    refs: LfCheckboxAdapterRefs;
  };
  handlers: LfCheckboxAdapterHandlers;
  dispatcher: LfCheckboxAdapterDispatcher;
}

/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_CHECKBOX_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfCheckboxAdapterRefs extends LfComponentAdapterRefs {
  input: HTMLInputElement | null;
  label: HTMLLabelElement | null;
  surface: HTMLDivElement | null;
}

/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfCheckboxAdapterJsx extends LfComponentAdapterJsx {
  background: () => VNode;
  input: () => VNode;
  label: () => VNode;
}

/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfCheckboxAdapterHandlers extends LfComponentAdapterHandlers {
  checkbox: {
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
 * "Adapter as Core" Pattern:
 * - `value` is read from adapter's closure (not WC state)
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfCheckboxAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfCheckboxInterface,
    typeof LF_CHECKBOX_BLOCKS,
    typeof LF_CHECKBOX_IDS,
    typeof LF_CHECKBOX_PARTS
  > {
  /** Current checkbox state (from adapter's closure) */
  value: () => LfCheckboxState;
}

/**
 * Simple single-value setters.
 *
 * "Adapter as Core" Pattern:
 * - `value` setter writes to closure and calls `onStateChange()`
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCheckboxAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set checkbox state (writes to closure, triggers re-render) */
  value: (state: LfCheckboxState) => void;
}

/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCheckboxAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the checkbox is checked */
  isChecked: () => boolean;
  /** Whether the checkbox is disabled based on lfUiState */
  isDisabled: () => boolean;
  /** Whether the checkbox is in indeterminate state */
  isIndeterminate: () => boolean;
}

/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCheckboxAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Toggle checkbox state (cycles through off/on, handles indeterminate) */
  toggle: () => void;
}

/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfCheckboxAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfCheckboxEventPayload>;

export type LfCheckboxAdapterDispatcherDetailOverrides = {
  [E in LfCheckboxEvent]: E extends "blur" | "focus"
    ? LfCheckboxAdapterDispatchDetailBase & { originalEvent: FocusEvent }
    : E extends "change"
      ? LfCheckboxAdapterDispatchDetailBase & { originalEvent: Event }
      : E extends "pointerdown"
        ? LfCheckboxAdapterDispatchDetailBase & { originalEvent: PointerEvent }
        : E extends "ready" | "unmount"
          ? Omit<LfCheckboxAdapterDispatchDetailBase, "originalEvent"> & {
              originalEvent?: never;
            }
          : LfCheckboxAdapterDispatchDetailBase;
};

export type LfCheckboxAdapterDispatcher = LfComponentAdapterDispatcher<
  LfCheckboxEventPayload,
  LfCheckboxAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-checkbox`.
 */
export type LfCheckboxEvent = (typeof LF_CHECKBOX_EVENTS)[number];

/**
 * Detail payload structure dispatched with `lf-checkbox` events.
 */
export interface LfCheckboxEventPayload
  extends LfEventPayload<"LfCheckbox", LfCheckboxEvent> {
  value: string;
  valueAsBoolean: boolean;
  isIndeterminate: boolean;
}
//#endregion

//#region States
/**
 * Union of runtime states declared in `LF_CHECKBOX_STATES`.
 */
export type LfCheckboxState = (typeof LF_CHECKBOX_STATES)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-checkbox` component.
 */
export interface LfCheckboxPropsInterface {
  lfAriaLabel?: string;
  lfLabel?: string;
  lfLeadingLabel?: boolean;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: boolean | null;
}
//#endregion

//#region FC Props
/**
 * Props interface for the `LfCheckboxFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfCheckboxFCProps {
  /** Accessible label for the checkbox control */
  ariaLabel?: string;
  /** Whether the checkbox is checked (true = on, false = off) */
  checked?: boolean;
  /** Assigned class for custom styling */
  className?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Whether the checkbox is in indeterminate state */
  indeterminate?: boolean;
  /** Reference callback for the input element */
  inputRef?: (el: HTMLInputElement | null) => void;
  /** Text label displayed alongside the checkbox */
  label?: string;
  /** Reference callback for the label element */
  labelRef?: (el: HTMLLabelElement | null) => void;
  /** When true, displays the label before the checkbox */
  leadingLabel?: boolean;
  /** Callback fired on blur event */
  onBlur?: (e: FocusEvent) => void;
  /** Callback fired on change event (value toggled) */
  onChange?: (checked: boolean, indeterminate: boolean, e: Event) => void;
  /** Callback fired on focus event */
  onFocus?: (e: FocusEvent) => void;
  /** Callback fired on label click */
  onLabelClick?: (e: MouseEvent) => void;
  /** Callback fired on pointer down (for ripple effects) */
  onPointerDown?: (e: PointerEvent) => void;
  /** CSS part attribute for external styling */
  part?: string;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /** Reference callback for the surface element (ripple container) */
  surfaceRef?: (el: HTMLDivElement | null) => void;
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

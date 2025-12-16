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
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEvent, LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_BUTTON_BLOCKS,
  LF_BUTTON_EVENTS,
  LF_BUTTON_IDS,
  LF_BUTTON_PARTS,
  LF_BUTTON_STATE,
  LF_BUTTON_STYLINGS,
  LF_BUTTON_TYPES,
} from "./button.constants";
import { LfListElement, LfListEventPayload } from "./list.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-button` component. It merges the shared component contract with the component-specific props.
 */
export interface LfButtonInterface
  extends LfComponent<"LfButton">,
    LfButtonPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfButtonEventPayload) => void;
  };
  /**
   * Internal runtime state mirrored by the component implementation.
   */
  value: LfButtonState;
  setMessage: (
    label?: string,
    icon?: LfIconType,
    timeout?: number,
  ) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-button`.
 */
export interface LfButtonElement
  extends HTMLStencilElement,
    Omit<LfButtonInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-button` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (list state)
 * - controller.computed: Derived predicates (isDisabled, isDropdown, isOn)
 * - controller.actions: Complex operations (toggle)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfButtonAdapter
  extends LfComponentAdapter<
    LfButtonInterface,
    LfButtonEventPayload,
    LfButtonAdapterHandlers,
    LfButtonAdapterJsx,
    LfButtonAdapterRefs,
    LfButtonAdapterControllerGetters,
    LfButtonAdapterControllerSetters,
    LfButtonAdapterControllerComputed,
    LfButtonAdapterControllerActions
  > {
  controller: {
    get: LfButtonAdapterControllerGetters;
    set: LfButtonAdapterControllerSetters;
    computed: LfButtonAdapterControllerComputed;
    actions: LfButtonAdapterControllerActions;
  };
  elements: {
    jsx: LfButtonAdapterJsx;
    refs: LfButtonAdapterRefs;
  };
  handlers: LfButtonAdapterHandlers;
  dispatcher: LfButtonAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_BUTTON_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfButtonAdapterRefs extends LfComponentAdapterRefs {
  button: HTMLButtonElement | null;
  dropdown: HTMLButtonElement | null;
  icon: HTMLElement | null;
  label: HTMLSpanElement | null;
  list: LfListElement | null;
  spinner: HTMLElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfButtonAdapterJsx extends LfComponentAdapterJsx {
  button: () => VNode;
  dropdown: () => VNode;
  icon: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfButtonAdapterHandlers extends LfComponentAdapterHandlers {
  list: (e: LfEvent<LfListEventPayload>) => void;
}
/**
 * Base getters extended with component-specific state reads.
 * Getters read from adapter's internal state variables.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfButtonAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfButtonInterface,
    typeof LF_BUTTON_BLOCKS,
    typeof LF_BUTTON_IDS,
    typeof LF_BUTTON_PARTS
  > {
  /** Current button styling (normalized to lowercase) */
  styling: () => LfButtonStyling;
  /** Read the current button state from adapter's internal state */
  value: () => LfButtonState;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change and triggers onStateChange.
 *
 * In "Adapter as Core" pattern, setters mutate adapter's internal state
 * and call the onStateChange callback to signal the WC to re-render.
 */
export interface LfButtonAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set the button state and trigger re-render */
  value: (state: LfButtonState) => void;
}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfButtonAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the button is disabled based on lfUiState */
  isDisabled: () => boolean;
  /** Whether the button has dropdown children */
  isDropdown: () => boolean;
  /** Whether the button is in "on" state (for toggable buttons) */
  isOn: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfButtonAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Control dropdown list visibility - multi-step portal operation */
  list: (state?: "close" | "open" | "toggle") => void;
  /** Toggle button state (on/off) for toggable buttons */
  toggle: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfButtonAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfButtonEventPayload>;
export type LfButtonAdapterDispatcherDetailOverrides = {
  [E in LfButtonEvent]: E extends "blur" | "focus"
    ? LfButtonAdapterDispatchDetailBase & { originalEvent: FocusEvent }
    : E extends "click"
      ? LfButtonAdapterDispatchDetailBase & { originalEvent: MouseEvent }
      : E extends "pointerdown"
        ? LfButtonAdapterDispatchDetailBase & { originalEvent: PointerEvent }
        : E extends "lf-event"
          ? LfButtonAdapterDispatchDetailBase & {
              originalEvent: LfEvent<LfListEventPayload>;
            }
          : E extends "ready" | "unmount"
            ? Omit<LfButtonAdapterDispatchDetailBase, "originalEvent"> & {
                originalEvent?: never;
              }
            : LfButtonAdapterDispatchDetailBase;
};
export type LfButtonAdapterDispatcher = LfComponentAdapterDispatcher<
  LfButtonEventPayload,
  LfButtonAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-button`.
 */
export type LfButtonEvent = (typeof LF_BUTTON_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-button` events.
 */
export interface LfButtonEventPayload
  extends LfEventPayload<"LfButton", LfButtonEvent> {
  value: string;
  valueAsBoolean: boolean;
}
//#endregion

//#region States
/**
 * Union of runtime states declared in `LF_BUTTON_STATE`.
 */
export type LfButtonState = (typeof LF_BUTTON_STATE)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-button` component.
 */
export interface LfButtonPropsInterface {
  lfAriaLabel?: string;
  lfDataset?: LfDataDataset;
  lfIcon?: LfIconType | null;
  lfIconOff?: LfIconType | null;
  lfLabel?: string;
  lfRipple?: boolean;
  lfShowSpinner?: boolean;
  lfStretchX?: boolean;
  lfStretchY?: boolean;
  lfStyle?: string;
  lfStyling?: LfButtonStyling;
  lfToggable?: boolean;
  lfTrailingIcon?: boolean;
  lfType?: LfButtonType;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: boolean;
}
/**
 * Union of styling tokens listed in `LF_BUTTON_STYLINGS`.
 */
export type LfButtonStyling = (typeof LF_BUTTON_STYLINGS)[number];
/**
 * Union of type identifiers defined in `LF_BUTTON_TYPES`.
 */
export type LfButtonType = (typeof LF_BUTTON_TYPES)[number];
//#endregion

//#region Functional Component
/**
 * Props interface for the `LfButtonFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfButtonFCProps {
  /** Assigned class for custom styling */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Icon to display */
  icon?: string;
  /** Unique identifier for the button */
  id?: string;
  /** Button label text */
  label?: string;
  /** Callback fired on blur event */
  onBlur?: (e: FocusEvent) => void;
  /** Callback fired on click event */
  onClick?: (e: MouseEvent) => void;
  /** Callback fired on focus event */
  onFocus?: (e: FocusEvent) => void;
  /** Callback fired on pointer down (for ripple effects) */
  onPointerDown?: (e: PointerEvent) => void;
  /** Reference callback for the button element */
  buttonRef?: (el: HTMLButtonElement | null) => void;
  /** Reference callback for the ripple element */
  rippleRef?: (el: HTMLElement | null) => void;
  /** Whether to show ripple effect */
  showRipple?: boolean;
  /** Whether to show spinner (loading state) */
  showSpinner?: boolean;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /** Styling mode: flat, floating, icon, outlined, raised */
  styling?: LfButtonStyling;
  /** Tooltip text */
  tooltip?: string;
  /** Whether to display the icon after the label */
  trailingIcon?: boolean;
  /** Button type attribute (button, submit, reset) */
  type?: LfButtonType;
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

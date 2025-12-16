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
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_THEME_ICONS } from "../framework";
import {
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
} from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_TEXTFIELD_BLOCKS,
  LF_TEXTFIELD_EVENTS,
  LF_TEXTFIELD_IDS,
  LF_TEXTFIELD_MODIFIERS,
  LF_TEXTFIELD_PARTS,
  LF_TEXTFIELD_STYLINGS,
} from "./textfield.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-textfield` component. It merges the shared component contract with the component-specific props.
 */
export interface LfTextfieldInterface
  extends LfComponent<"LfTextfield">,
    LfTextfieldPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfTextfieldEventPayload) => void;
  };
  /**
   * Internal runtime state - the current status modifiers set.
   */
  status: Set<LfTextfieldModifiers>;
  /**
   * Internal runtime state - the current input value.
   */
  value: string;
  formatJSON: () => Promise<void>;
  getElement: () => Promise<HTMLTextAreaElement | HTMLInputElement>;
  getValue: () => Promise<string>;
  setBlur: () => Promise<void>;
  setFocus: () => Promise<void>;
  setValue: (value: string) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-textfield`.
 */
export interface LfTextfieldElement
  extends HTMLStencilElement,
    Omit<LfTextfieldInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-textfield`.
 */
export type LfTextfieldEvent = (typeof LF_TEXTFIELD_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-textfield` events.
 */
export interface LfTextfieldEventPayload
  extends LfEventPayload<"LfTextfield", LfTextfieldEvent> {
  iconType?: "regular" | "action";
  inputValue?: string;
  target: HTMLInputElement | HTMLDivElement | HTMLTextAreaElement;
  value?: string;
}
//#endregion

//#region States
/**
 * Utility type used by the `lf-textfield` component.
 */
export type LfTextfieldModifiers = (typeof LF_TEXTFIELD_MODIFIERS)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-textfield` component.
 */
export interface LfTextfieldPropsInterface {
  lfCaptureShortcuts?: boolean;
  lfFormatJSON?: LfTextfieldFormatJSON | null;
  lfHelper?: LfTextfieldHelper;
  lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
  lfIcon?: LfIconType | null;
  lfLabel?: string;
  lfStretchY?: boolean;
  lfStyle?: string;
  lfStyling?: LfTextfieldStyling;
  lfTrailingIcon?: boolean;
  lfTrailingIconAction?: LfTextfieldTrailingIconAction;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
/**
 * Configuration interface for JSON formatting in the `lf-textfield` component.
 * Only applicable to textfields with `lfStyling="textarea"`.
 */
export interface LfTextfieldFormatJSON {
  displayBorderOnError?: boolean;
  displayErrorAsTitle?: boolean;
  indentSpaces?: number;
  onBlur?: boolean;
  onInput?: number;
}
export type LfTextfieldTrailingIconAction =
  | (typeof LF_THEME_ICONS)[keyof typeof LF_THEME_ICONS]
  | null;
/**
 * Utility interface used by the `lf-textfield` component.
 */
export interface LfTextfieldHelper {
  showWhenFocused?: boolean;
  value: string;
}
/**
 * Union of styling tokens listed in `LF_TEXTFIELD_STYLINGS`.
 */
export type LfTextfieldStyling = (typeof LF_TEXTFIELD_STYLINGS)[number];
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-textfield` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (value)
 * - controller.computed: Derived predicates (isDisabled, isOutlined, isTextarea)
 * - controller.actions: Complex operations (focus, blur, updateState, formatJSON)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfTextfieldAdapter
  extends LfComponentAdapter<
    LfTextfieldInterface,
    LfTextfieldEventPayload,
    LfTextfieldAdapterHandlers,
    LfTextfieldAdapterJsx,
    LfTextfieldAdapterRefs,
    LfTextfieldAdapterControllerGetters,
    LfTextfieldAdapterControllerSetters,
    LfTextfieldAdapterControllerComputed,
    LfTextfieldAdapterControllerActions
  > {
  controller: {
    get: LfTextfieldAdapterControllerGetters;
    set: LfTextfieldAdapterControllerSetters;
    computed: LfTextfieldAdapterControllerComputed;
    actions: LfTextfieldAdapterControllerActions;
  };
  elements: {
    jsx: LfTextfieldAdapterJsx;
    refs: LfTextfieldAdapterRefs;
  };
  handlers: LfTextfieldAdapterHandlers;
  dispatcher: LfTextfieldAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_TEXTFIELD_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfTextfieldAdapterRefs extends LfComponentAdapterRefs {
  icon: HTMLDivElement | null;
  iconAction: HTMLDivElement | null;
  input: HTMLInputElement | HTMLTextAreaElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfTextfieldAdapterJsx extends LfComponentAdapterJsx {
  counter: () => VNode;
  helper: () => VNode;
  icon: () => VNode;
  iconAction: () => VNode;
  input: () => VNode;
  label: () => VNode;
  textarea: () => VNode;
  textfield: () => VNode;
  underline: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfTextfieldAdapterHandlers extends LfComponentAdapterHandlers {
  input: {
    onBlur: (e: FocusEvent) => void;
    onChange: (e: Event) => void;
    onClick: (e: MouseEvent) => void;
    onFocus: (e: FocusEvent) => void;
    onInput: (e: Event) => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  icon: {
    onClick: (e: MouseEvent, iconType: "regular" | "action") => void;
  };
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * "Adapter as Core" Architecture:
 * - `value` and `status` are read from adapter's closure state
 * - These getters are the ONLY way to read runtime state
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfTextfieldAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfTextfieldInterface,
    typeof LF_TEXTFIELD_BLOCKS,
    typeof LF_TEXTFIELD_IDS,
    typeof LF_TEXTFIELD_PARTS
  > {
  /** Current textfield value (from adapter closure) */
  value: () => string;
  /** Current status set (from adapter closure) */
  status: () => Set<LfTextfieldModifiers>;
  /** Current textfield styling (normalized to lowercase) */
  styling: () => LfTextfieldStyling;
  /** Maximum length from HTML attributes */
  maxLength: () => number | undefined;
  /** Current formatting error message */
  formattingError: () => string;
  /** Whether field has outline styling */
  hasOutline: () => boolean;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfTextfieldAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set the field value */
  value: (val: string) => void;
  /** Set the formatting error */
  formattingError: (error: string) => void;
  /** Update the status set */
  status: (modifier: LfTextfieldModifiers, add: boolean) => void;
}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfTextfieldAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the textfield is disabled based on lfUiState */
  isDisabled: () => boolean;
  /** Whether the textfield uses outlined styling */
  isOutlined: () => boolean;
  /** Whether the textfield is a textarea */
  isTextarea: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfTextfieldAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Focus the input element */
  focus: () => void;
  /** Blur the input element */
  blur: () => void;
  /** Update the field value with event emission */
  updateState: (value: string, e?: Event | CustomEvent) => void;
  /** Format JSON content */
  formatJSON: () => Promise<void>;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfTextfieldAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfTextfieldEventPayload>;
export type LfTextfieldAdapterDispatcherDetailOverrides = {
  [E in LfTextfieldEvent]: E extends "blur" | "focus"
    ? LfTextfieldAdapterDispatchDetailBase & { originalEvent: FocusEvent }
    : E extends "click"
      ? LfTextfieldAdapterDispatchDetailBase & { originalEvent: MouseEvent }
      : E extends "keydown"
        ? LfTextfieldAdapterDispatchDetailBase & {
            originalEvent: KeyboardEvent;
          }
        : E extends "input" | "change"
          ? LfTextfieldAdapterDispatchDetailBase & { originalEvent: Event }
          : E extends "ready" | "unmount"
            ? Omit<LfTextfieldAdapterDispatchDetailBase, "originalEvent"> & {
                originalEvent?: never;
              }
            : LfTextfieldAdapterDispatchDetailBase;
};
export type LfTextfieldAdapterDispatcher = LfComponentAdapterDispatcher<
  LfTextfieldEventPayload,
  LfTextfieldAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Functional Component
/**
 * Props interface for the `LfTextfieldFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfTextfieldFCProps {
  /** Assigned class for custom styling */
  className?: string;
  /** Whether the textfield is disabled */
  disabled?: boolean;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Helper text displayed below the input */
  helper?: LfTextfieldHelper;
  /** Icon to display in the textfield */
  icon?: LfIconType | null;
  /** Unique identifier for the component */
  id?: string;
  /** Reference callback for the input element */
  inputRef?: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
  /** Text label displayed alongside/above the input */
  label?: string;
  /** Maximum character length for input */
  maxLength?: number;
  /** Callback fired on blur event */
  onBlur?: (e: FocusEvent) => void;
  /** Callback fired on change event (value committed) */
  onChange?: (value: string, e: Event) => void;
  /** Callback fired on input click */
  onClick?: (e: MouseEvent) => void;
  /** Callback fired on focus event */
  onFocus?: (e: FocusEvent) => void;
  /** Callback fired on icon click */
  onIconClick?: (e: MouseEvent, iconType: "regular" | "action") => void;
  /** Callback fired on input event (value changing) */
  onInput?: (value: string, e: Event) => void;
  /** Callback fired on keydown event */
  onKeyDown?: (e: KeyboardEvent) => void;
  /** Placeholder text for outlined styling */
  placeholder?: string;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /** Current styling variant */
  styling?: LfTextfieldStyling;
  /** Action icon to display (e.g., clear, visibility toggle) */
  trailingIconAction?: LfTextfieldTrailingIconAction;
  /** Whether to position the regular icon at the trailing edge */
  trailingIcon?: boolean;
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
  /** The current textfield value */
  value: string;
  /** Current status modifiers */
  status?: Set<LfTextfieldModifiers>;
  /** Formatting error message (for textarea JSON formatting) */
  formattingError?: string;
  /** JSON formatting configuration */
  formatJSON?: LfTextfieldFormatJSON | null;
  /** HTML attributes to spread on the input */
  htmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
}
//#endregion

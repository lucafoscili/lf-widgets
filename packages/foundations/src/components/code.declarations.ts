import {
  LfComponentAdapter,
  LfComponentAdapterActions,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterComputed,
  LfComponentAdapterDispatchDetail,
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
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_CODE_BLOCKS,
  LF_CODE_EVENTS,
  LF_CODE_IDS,
  LF_CODE_PARTS,
} from "./code.constants";
import { LfButtonElement } from "./button.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-code` component. It merges the shared component contract with the component-specific props.
 */
export interface LfCodeInterface
  extends LfComponent<"LfCode">,
    LfCodePropsInterface {
  /**
   * Internal runtime state: the formatted code value.
   */
  value: string;
}
/**
 * DOM element type for the custom element registered as `lf-code`.
 */
export interface LfCodeElement
  extends HTMLStencilElement,
    Omit<LfCodeInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-code` into host integrations.
 *
 * v4.0.0 "Adapter as Core" Architecture:
 * - controller.get: Base getters + state reads (value)
 * - controller.set: State writes (value) → triggers onStateChange
 * - controller.computed: Derived values (formattedCode, shouldPreserveSpace)
 * - controller.actions: Complex operations (highlight, copyToClipboard, loadLanguage)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 *
 * State lives in adapter closure, not WC @State.
 * WC has single @State _renderTick, incremented by onStateChange.
 *
 * @see Section 5 & 5.9 of 4_0_0_REFACTORING.md
 */
export interface LfCodeAdapter
  extends LfComponentAdapter<
    LfCodeInterface,
    LfCodeEventPayload,
    never,
    LfCodeAdapterJsx,
    LfCodeAdapterRefs,
    LfCodeAdapterControllerGetters,
    LfCodeAdapterControllerSetters,
    LfCodeAdapterControllerComputed,
    LfCodeAdapterControllerActions
  > {
  controller: {
    get: LfCodeAdapterControllerGetters;
    set: LfCodeAdapterControllerSetters;
    computed: LfCodeAdapterControllerComputed;
    actions: LfCodeAdapterControllerActions;
  };
  elements: {
    jsx: LfCodeAdapterJsx;
    refs: LfCodeAdapterRefs;
  };
  dispatcher: LfCodeAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_CODE_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfCodeAdapterRefs extends LfComponentAdapterRefs {
  copyButton: LfButtonElement | null;
  pre: HTMLPreElement | HTMLDivElement | null;
  wrapper: HTMLDivElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfCodeAdapterJsx extends LfComponentAdapterJsx {
  code: () => VNode;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * In "Adapter as Core" pattern, state lives in the adapter, not the WC.
 * Getters read from adapter's internal state variables.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfCodeAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfCodeInterface,
    typeof LF_CODE_BLOCKS,
    typeof LF_CODE_IDS,
    typeof LF_CODE_PARTS
  > {
  /** Read the current formatted value from adapter's internal state */
  value: () => string;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change and triggers onStateChange.
 *
 * In "Adapter as Core" pattern, setters mutate adapter's internal state
 * and call the onStateChange callback to signal the WC to re-render.
 */
export interface LfCodeAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set the formatted value and trigger re-render */
  value: (v: string) => void;
}
/**
 * Computed values - derived values and predicates.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCodeAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Returns the formatted code value */
  formattedCode: () => string;
  /** Whether the code should preserve spaces (use <pre> tag) */
  shouldPreserveSpace: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfCodeAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Highlights the code element using syntax highlighting service */
  highlight: () => void;
  /** Copies the current code value to clipboard */
  copyToClipboard: () => Promise<void>;
  /** Loads the language grammar for syntax highlighting */
  loadLanguage: () => Promise<void>;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfCodeAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfCodeEventPayload>;
export type LfCodeAdapterDispatcherDetailOverrides = {
  [E in LfCodeEvent]: E extends "ready" | "unmount"
    ? Omit<LfCodeAdapterDispatchDetailBase, "originalEvent"> & {
        originalEvent?: never;
      }
    : LfCodeAdapterDispatchDetailBase;
};
export type LfCodeAdapterDispatcher = LfComponentAdapterDispatcher<
  LfCodeEventPayload,
  LfCodeAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-code`.
 */
export type LfCodeEvent = (typeof LF_CODE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-code` events.
 */
export interface LfCodeEventPayload
  extends LfEventPayload<"LfCode", LfCodeEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-code` component.
 */
export interface LfCodePropsInterface {
  lfFadeIn?: boolean;
  lfFormat?: boolean;
  lfLanguage?: string;
  lfPreserveSpaces?: boolean;
  lfShowCopy?: boolean;
  lfShowHeader?: boolean;
  lfStickyHeader?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
//#endregion

//#region FC Props
/**
 * Props interface for the `LfCodeFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfCodeFCProps {
  /** Assigned class for custom styling */
  className?: string;
  /** Reference callback for the code container element */
  codeRef?: (el: HTMLDivElement | null) => void;
  /** Whether to fade in the component on mount */
  fadeIn?: boolean;
  /** Formatted code content to display */
  formattedCode: string;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** Language of the code snippet */
  language?: string;
  /** Callback fired on copy button click */
  onCopy?: (e: CustomEvent) => void;
  /** Reference callback for the pre/body element */
  preRef?: (el: HTMLPreElement | HTMLDivElement | null) => void;
  /** Whether to preserve spaces (use pre tag) */
  preserveSpace?: boolean;
  /** Whether to show the copy button */
  showCopy?: boolean;
  /** Whether to show the header */
  showHeader?: boolean;
  /** Whether the header should be sticky */
  stickyHeader?: boolean;
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
  /** Current code value (for clipboard copy) */
  value?: string;
}
//#endregion

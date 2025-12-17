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
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_AUTOCOMPLETE_BLOCKS,
  LF_AUTOCOMPLETE_EVENTS,
  LF_AUTOCOMPLETE_IDS,
  LF_AUTOCOMPLETE_PARTS,
} from "./autocomplete.constants";
import {
  LfListElement,
  LfListEventPayload,
  LfListInterface,
} from "./list.declarations";
import { LfSpinnerElement, LfSpinnerInterface } from "./spinner.declarations";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
  LfTextfieldInterface,
} from "./textfield.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-autocomplete` component.
 * It merges the shared component contract with the component-specific props.
 */
export interface LfAutocompleteInterface
  extends LfComponent<"LfAutocomplete">,
    LfAutocompletePropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfAutocompleteEventPayload) => void;
  };
  /**
   * Internal runtime state: highlighted index for keyboard navigation.
   */
  highlightedIndex: number;
  /**
   * Internal runtime state: current input value.
   */
  inputValue: string;
  /**
   * Internal runtime state: whether the component is loading.
   */
  loading: boolean;
  /**
   * Internal runtime state: the last query that triggered a request.
   */
  lastRequestedQuery: string;
  clearCache: () => Promise<void>;
  clearInput: () => Promise<void>;
  getValue: () => Promise<string>;
  setValue: (value: string) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-autocomplete`.
 */
export interface LfAutocompleteElement
  extends HTMLStencilElement,
    Omit<LfAutocompleteInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-autocomplete` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (list state, highlight, blur timeout)
 * - controller.computed: Derived predicates (isDisabled, isLoading, hasCache, etc.)
 * - controller.actions: Complex operations (updateInput, selectNode, highlight, etc.)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfAutocompleteAdapter
  extends LfComponentAdapter<
    LfAutocompleteInterface,
    LfAutocompleteEventPayload,
    LfAutocompleteAdapterHandlers,
    LfAutocompleteAdapterJsx,
    LfAutocompleteAdapterRefs,
    LfAutocompleteAdapterControllerGetters,
    LfAutocompleteAdapterControllerSetters,
    LfAutocompleteAdapterControllerComputed,
    LfAutocompleteAdapterControllerActions
  > {
  controller: {
    get: LfAutocompleteAdapterControllerGetters;
    set: LfAutocompleteAdapterControllerSetters;
    computed: LfAutocompleteAdapterControllerComputed;
    actions: LfAutocompleteAdapterControllerActions;
  };
  elements: {
    jsx: LfAutocompleteAdapterJsx;
    refs: LfAutocompleteAdapterRefs;
  };
  handlers: LfAutocompleteAdapterHandlers;
  dispatcher: LfAutocompleteAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_AUTOCOMPLETE_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfAutocompleteAdapterRefs extends LfComponentAdapterRefs {
  autocomplete: HTMLDivElement | null;
  dropdown: HTMLElement | null;
  list: LfListElement | null;
  spinner: LfSpinnerElement | null;
  textfield: LfTextfieldElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfAutocompleteAdapterJsx extends LfComponentAdapterJsx {
  dropdown: () => VNode;
  textfield: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfAutocompleteAdapterHandlers
  extends LfComponentAdapterHandlers {
  list: (event: LfEvent<LfListEventPayload>) => Promise<void>;
  textfield: (event: LfEvent<LfTextfieldEventPayload>) => Promise<void>;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfAutocompleteAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfAutocompleteInterface,
    typeof LF_AUTOCOMPLETE_BLOCKS,
    typeof LF_AUTOCOMPLETE_IDS,
    typeof LF_AUTOCOMPLETE_PARTS
  > {
  /** Cache map for autocomplete results */
  cache: () => LfAutocompleteCache;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfAutocompleteAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Control blur timeout */
  blurTimeout: {
    clear: () => void;
    new: (callback: () => void, delay?: number) => void;
  };
  /** Update dataset and handle caching */
  dataset: (dataset: LfDataDataset | null) => void;
  /** Set highlighted index */
  highlight: (index: number) => void;
}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfAutocompleteAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the autocomplete is disabled based on lfUiState */
  isDisabled: () => boolean;
  /** Whether the autocomplete is currently loading results */
  isLoading: () => boolean;
  /** Whether the autocomplete has cache enabled and populated */
  hasCache: () => boolean;
  /** Whether free input (non-dataset values) is allowed */
  allowsFreeInput: () => boolean;
  /** Gets the currently highlighted index */
  highlightedIndex: () => number;
  /** Gets the current input value */
  inputValue: () => string;
  /** Gets the currently selected node (if any) */
  selectedNode: () => LfDataNode | null;
  /** Gets the index of a node by its ID */
  indexById: (id: string) => number;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfAutocompleteAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Control dropdown list visibility - multi-step portal operation */
  list: (state?: "close" | "open" | "toggle") => void;
  /** Updates the input value and triggers debounced request if needed */
  updateInput: (value: string) => Promise<void>;
  /** Selects a node from the dropdown list */
  selectNode: (node: LfDataNode) => Promise<void>;
  /** Highlights a specific index in the dropdown list */
  highlight: (index: number) => void;
  /** Clears the autocomplete cache */
  clearCache: () => void;
  /** Clears the input field */
  clearInput: () => Promise<void>;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfAutocompleteAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfAutocompleteEventPayload>;
export type LfAutocompleteAdapterDispatcherDetailOverrides = {
  [E in LfAutocompleteEvent]: E extends "input" | "request"
    ? LfAutocompleteAdapterDispatchDetailBase & { query?: string }
    : E extends "change"
      ? LfAutocompleteAdapterDispatchDetailBase & { node?: LfDataNode }
      : E extends "lf-event"
        ? LfAutocompleteAdapterDispatchDetailBase & {
            originalEvent?: LfEvent<
              LfListEventPayload | LfTextfieldEventPayload
            >;
            node?: LfDataNode;
          }
        : E extends "ready" | "unmount"
          ? Omit<LfAutocompleteAdapterDispatchDetailBase, "originalEvent"> & {
              originalEvent?: never;
            }
          : LfAutocompleteAdapterDispatchDetailBase;
};
export type LfAutocompleteAdapterDispatcher = LfComponentAdapterDispatcher<
  LfAutocompleteEventPayload,
  LfAutocompleteAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-autocomplete`.
 */
export type LfAutocompleteEvent = (typeof LF_AUTOCOMPLETE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-autocomplete` events.
 */
export interface LfAutocompleteEventPayload
  extends LfEventPayload<"LfAutocomplete", LfAutocompleteEvent> {
  node?: LfDataNode;
  query?: string;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-autocomplete` component.
 */
export interface LfAutocompletePropsInterface {
  lfAllowFreeInput?: boolean;
  lfCache?: boolean;
  lfCacheTTL?: number;
  lfDataset?: LfDataDataset;
  lfDebounceMs?: number;
  lfListProps?: Partial<LfListInterface>;
  lfMaxCacheSize?: number;
  lfMinChars?: number;
  lfNavigation?: boolean;
  lfSpinnerProps?: Partial<LfSpinnerInterface>;
  lfStyle?: string;
  lfTextfieldProps?: Partial<LfTextfieldInterface>;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
/**
 * Cache map type for storing autocomplete results.
 */
export type LfAutocompleteCache = Map<string, LfAutocompleteCacheEntry>;
/**
 * Cache entry structure with dataset and timestamp.
 */
export type LfAutocompleteCacheEntry = {
  dataset: LfDataDataset;
  timestamp: number;
};
//#endregion

//#region Functional Component
/**
 * Props interface for the LfAutocompleteFC functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfAutocompleteFCProps {
  /** Reference callback for the autocomplete container element */
  autocompleteRef?: (el: HTMLDivElement | null) => void;
  /** Assigned class for custom styling */
  className?: string;
  /** Dataset containing autocomplete suggestions */
  dataset?: LfDataDataset | null;
  /** ID for the dropdown element (for ARIA) */
  dropdownId?: string;
  /** Reference callback for the dropdown element */
  dropdownRef?: (el: HTMLElement | null) => void;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Whether the autocomplete has cache enabled and populated */
  hasCache?: boolean;
  /** Currently highlighted index for keyboard navigation */
  highlightedIndex?: number;
  /** Unique identifier for the component */
  id?: string;
  /** Whether the dropdown is currently expanded */
  isExpanded?: boolean;
  /** Whether the autocomplete is currently loading results */
  isLoading?: boolean;
  /** Props for the internal list component */
  listProps?: Partial<LfListInterface>;
  /** Reference callback for the list element */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listRef?: (el: any) => void;
  /** Minimum characters required before triggering a request */
  minChars?: number;
  /** Callback fired when list event occurs */
  onListEvent?: (event: LfEvent<LfListEventPayload>) => void;
  /** Callback fired when textfield event occurs */
  onTextfieldEvent?: (event: LfEvent<LfTextfieldEventPayload>) => void;
  /** Whether to show the empty state message */
  showEmpty?: boolean;
  /** Whether to show the list */
  showList?: boolean;
  /** Props for the internal spinner component */
  spinnerProps?: Partial<LfSpinnerInterface>;
  /** Reference callback for the spinner element */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spinnerRef?: (el: any) => void;
  /** Custom CSS styles to apply (object format for Stencil JSX) */
  style?: { [key: string]: string };
  /** Props for the internal textfield component */
  textfieldProps?: Partial<LfTextfieldInterface>;
  /** Reference callback for the textfield element */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textfieldRef?: (el: any) => void;
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
  /** Current value of the input field */
  value?: string;
}
//#endregion

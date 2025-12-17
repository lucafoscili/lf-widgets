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
  LfListElement,
  LfListEventPayload,
  LfListInterface,
} from "./list.declarations";
import {
  LF_SELECT_BLOCKS,
  LF_SELECT_EVENTS,
  LF_SELECT_PARTS,
} from "./select.constants";
import {
  LfTextfieldEventPayload,
  LfTextfieldInterface,
} from "./textfield.declarations";

//#region Interface
export interface LfSelectInterface
  extends LfComponent<"LfSelect">,
    LfSelectPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfSelectEventPayload) => void;
  };
  /**
   * Internal runtime state mirrored by the component implementation.
   */
  value: string | null;
  getSelectedIndex: () => Promise<number>;
  getValue: () => Promise<LfDataNode>;
  setValue: (id: string) => Promise<void>;
}
export interface LfSelectElement
  extends HTMLStencilElement,
    Omit<LfSelectInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-select` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (list state)
 * - controller.computed: Derived predicates (isDisabled)
 * - controller.actions: Complex operations (setValue, navigate)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfSelectAdapter
  extends LfComponentAdapter<
    LfSelectInterface,
    LfSelectEventPayload,
    LfSelectAdapterHandlers,
    LfSelectAdapterJsx,
    LfSelectAdapterRefs,
    LfSelectAdapterControllerGetters,
    LfSelectAdapterControllerSetters,
    LfSelectAdapterControllerComputed,
    LfSelectAdapterControllerActions
  > {
  controller: {
    get: LfSelectAdapterControllerGetters;
    set: LfSelectAdapterControllerSetters;
    computed: LfSelectAdapterControllerComputed;
    actions: LfSelectAdapterControllerActions;
  };
  elements: {
    jsx: LfSelectAdapterJsx;
    refs: LfSelectAdapterRefs;
  };
  handlers: LfSelectAdapterHandlers;
  dispatcher: LfSelectAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_SELECT_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfSelectAdapterRefs extends LfComponentAdapterRefs {
  list: LfListElement | null;
  select: HTMLDivElement | null;
  /** Native input element from LfTextfieldFC */
  textfield: HTMLInputElement | HTMLTextAreaElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfSelectAdapterJsx extends LfComponentAdapterJsx {
  list: () => VNode | null;
  select: () => VNode;
  textfield: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfSelectAdapterHandlers extends LfComponentAdapterHandlers {
  list: (event: LfEvent<LfListEventPayload>) => Promise<void>;
  /** @deprecated Use textfieldClick, textfieldKeydown for FC usage */
  textfield: (event: LfEvent<LfTextfieldEventPayload>) => Promise<void>;
  /** FC-compatible click handler for textfield */
  textfieldClick: (event: MouseEvent) => void;
  /** FC-compatible keydown handler for textfield */
  textfieldKeydown: (event: KeyboardEvent) => Promise<void>;
  /** FC-compatible icon click handler for textfield */
  textfieldIconClick: (event: MouseEvent) => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfSelectAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfSelectInterface,
    typeof LF_SELECT_BLOCKS,
    Record<string, never>,
    typeof LF_SELECT_PARTS
  > {
  /** Get node index by id */
  indexById: (id: string) => number;
  /** Get lfDataset from component */
  lfDataset: () => LfDataDataset;
  /** Get currently selected node */
  selectedNode: () => LfDataNode | null;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfSelectAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSelectAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the select is disabled based on lfUiState */
  isDisabled: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfSelectAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Control dropdown list visibility - multi-step portal operation */
  list: (state?: "close" | "open" | "toggle") => void;
  /** Navigate to next or previous option */
  navigate: (direction: "next" | "prev") => Promise<void>;
  /** Set selected value by id */
  setValue: (id: string) => Promise<void>;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfSelectAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfSelectEventPayload>;
export type LfSelectAdapterDispatcherDetailOverrides = {
  [E in LfSelectEvent]: E extends "lf-event"
    ? LfSelectAdapterDispatchDetailBase & {
        originalEvent?: LfEvent<LfListEventPayload | LfTextfieldEventPayload>;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfSelectAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfSelectAdapterDispatchDetailBase;
};
export type LfSelectAdapterDispatcher = LfComponentAdapterDispatcher<
  LfSelectEventPayload,
  LfSelectAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
export type LfSelectEvent = (typeof LF_SELECT_EVENTS)[number];
export interface LfSelectEventPayload
  extends LfEventPayload<"LfSelect", LfSelectEvent> {
  node?: LfDataNode;
  value?: string | number;
}
//#endregion

//#region Props
export interface LfSelectPropsInterface {
  lfDataset?: LfDataDataset;
  lfListProps?: Partial<LfListInterface>;
  lfNavigation?: boolean;
  lfStyle?: string;
  lfTextfieldProps?: Partial<LfTextfieldInterface>;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string | number;
}
//#endregion

//#region Functional Component
/**
 * Props interface for the `LfSelectFC` functional component.
 *
 * This interface removes the `lf*` prefix convention used by Web Components
 * and uses direct prop names instead. All state is owned by the parent;
 * the FC is purely presentational.
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export interface LfSelectFCProps {
  /** Assigned class for custom styling */
  className?: string;
  /** Cypress test attribute */
  cyAttribute?: string;
  /** Dataset containing the selectable options */
  dataset?: LfDataDataset;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Framework instance for theming utilities (required) */
  framework: LfFrameworkInterface;
  /** Unique identifier for the component */
  id?: string;
  /** LF attribute for state theming */
  lfAttribute?: string;
  /** Props to pass to the internal lf-list component */
  listProps?: Partial<LfListInterface>;
  /** Reference callback for the list element */
  listRef?: (el: LfListElement | null) => void;
  /** Callback fired on list item click */
  onListEvent?: (event: CustomEvent) => void;
  /** Callback fired on textfield click */
  onTextfieldClick?: (event: MouseEvent) => void;
  /** Callback fired on textfield keydown */
  onTextfieldKeydown?: (event: KeyboardEvent) => void;
  /** Callback fired on textfield icon click */
  onTextfieldIconClick?: (event: MouseEvent) => void;
  /** Part attribute for external styling */
  part?: string;
  /** Currently selected index */
  selectedIndex?: number;
  /** Currently selected node */
  selectedNode?: LfDataNode | null;
  /** Reference callback for the select container */
  selectRef?: (el: HTMLDivElement | null) => void;
  /** Custom CSS styles to apply */
  style?: { [key: string]: string };
  /** Props to pass to the internal lf-textfield component */
  textfieldProps?: Partial<LfTextfieldInterface>;
  /** Reference callback for the textfield input element */
  textfieldRef?: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
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

import { VNode } from "../foundations";
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
} from "../foundations/components.declarations";
import { LfEvent, LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_LIST_BLOCKS,
  LF_LIST_EVENTS,
  LF_LIST_IDS,
  LF_LIST_PARTS,
} from "./list.constants";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
} from "./textfield.declarations";

//#region Class
export interface LfListInterface
  extends LfComponent<"LfList">,
    LfListPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfListEventPayload) => void;
  };
  applyFilter: (value: string) => Promise<void>;
  focusNext: () => Promise<void>;
  focusPrevious: () => Promise<void>;
  getSelected: () => Promise<LfDataNode>;
  selectNode: (idx: number) => Promise<void>;
  selectNodeById: (id: string) => Promise<void>;
  setFilter: (value: string) => Promise<void>;
}
export interface LfListElement
  extends HTMLStencilElement,
    Omit<LfListInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfListEvent = (typeof LF_LIST_EVENTS)[number];
export interface LfListEventPayload
  extends LfEventPayload<"LfList", LfListEvent> {
  node: LfDataNode;
}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-list` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (filter, selected, focused)
 * - controller.computed: Derived predicates (isDisabled, isEmpty, isFilteredEmpty)
 * - controller.actions: Complex operations (applyFilter, deleteNode, focusElement, selectNode)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfListAdapter
  extends LfComponentAdapter<
    LfListInterface,
    LfListEventPayload,
    LfListAdapterHandlers,
    LfListAdapterJsx,
    LfListAdapterRefs,
    LfListAdapterControllerGetters,
    LfListAdapterControllerSetters,
    LfListAdapterControllerComputed,
    LfListAdapterControllerActions
  > {
  controller: {
    get: LfListAdapterControllerGetters;
    set: LfListAdapterControllerSetters;
    computed: LfListAdapterControllerComputed;
    actions: LfListAdapterControllerActions;
  };
  elements: {
    jsx: LfListAdapterJsx;
    refs: LfListAdapterRefs;
  };
  handlers: LfListAdapterHandlers;
  dispatcher: LfListAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_LIST_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfListAdapterRefs extends LfComponentAdapterRefs {
  deleteIcon: HTMLElement | null;
  filter: LfTextfieldElement | null;
  icon: HTMLElement | null;
  node: HTMLElement | null;
  subtitle: HTMLElement | null;
  title: HTMLElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfListAdapterJsx extends LfComponentAdapterJsx {
  deleteIcon: (node: LfDataNode) => VNode | null;
  filter: () => VNode | null;
  icon: (node: LfDataNode) => VNode;
  /**
   * FC-first list rendering factory.
   * Renders the complete list using LfListFC functional component.
   * @param items - Array of visible nodes to render
   * @param onItemRef - Optional callback to capture list item refs
   */
  list: (
    items: LfDataNode[],
    onItemRef?: (el: HTMLLIElement | null, index: number) => void,
  ) => VNode;
  node: (node: LfDataNode, index: number, isSelected: boolean) => VNode;
  subtitle: (node: LfDataNode) => VNode;
  title: (node: LfDataNode) => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfListAdapterHandlers extends LfComponentAdapterHandlers {
  deleteIcon: (event: MouseEvent, node: LfDataNode) => Promise<void>;
  filter: (event: CustomEvent<LfTextfieldEventPayload>) => Promise<void>;
  node: {
    blur: (event: FocusEvent, node: LfDataNode, index: number) => Promise<void>;
    click: (
      event: MouseEvent,
      node: LfDataNode,
      index: number,
    ) => Promise<void>;
    focus: (
      event: FocusEvent,
      node: LfDataNode,
      index: number,
    ) => Promise<void>;
    pointerdown: (
      event: PointerEvent,
      node: LfDataNode,
      index: number,
    ) => Promise<void>;
  };
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfListAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfListInterface,
    typeof LF_LIST_BLOCKS,
    typeof LF_LIST_IDS,
    typeof LF_LIST_PARTS
  > {
  /** Current filter value */
  filterValue: () => string;
  /** Currently focused item index */
  focused: () => number;
  /** Set of hidden nodes (filtered out) */
  hiddenNodes: () => Set<LfDataNode>;
  /** Get index of a node by its ID */
  indexById: (id: string) => number;
  /** Get node by its ID */
  nodeById: (id: string) => LfDataNode | undefined;
  /** Currently selected item index */
  selected: () => number;
}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfListAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /** Set filter value and apply filtering */
  filter: {
    debounce: (value: string) => void;
    setValue: (value: string) => void;
  };
  /** Set focused item index */
  focused: (index: number) => void;
  /** Set selected item index */
  selected: (index: number) => void;
}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfListAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the list is disabled based on lfUiState */
  isDisabled: () => boolean;
  /** Whether the list is empty (no nodes in dataset) */
  isEmpty: () => boolean;
  /** Whether the filtered list is empty (nodes exist but all hidden) */
  isFilteredEmpty: () => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfListAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Apply filter value and update hidden nodes */
  applyFilter: (value: string) => void;
  /** Delete a node at the specified index */
  deleteNode: (index: number) => void;
  /** Focus element at the specified index */
  focusElement: (index: number) => void;
  /** Handle node selection */
  selectNode: (index: number) => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfListAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfListEventPayload>;
export type LfListAdapterDispatcherDetailOverrides = {
  [E in LfListEvent]: E extends "blur" | "focus"
    ? LfListAdapterDispatchDetailBase & { originalEvent: FocusEvent }
    : E extends "click"
      ? LfListAdapterDispatchDetailBase & { originalEvent: MouseEvent }
      : E extends "pointerdown"
        ? LfListAdapterDispatchDetailBase & { originalEvent: PointerEvent }
        : E extends "delete"
          ? LfListAdapterDispatchDetailBase & { originalEvent: MouseEvent }
          : E extends "lf-event"
            ? LfListAdapterDispatchDetailBase & {
                originalEvent: LfEvent<LfTextfieldEventPayload>;
              }
            : E extends "ready" | "unmount"
              ? Omit<LfListAdapterDispatchDetailBase, "originalEvent"> & {
                  originalEvent?: never;
                }
              : LfListAdapterDispatchDetailBase;
};
export type LfListAdapterDispatcher = LfComponentAdapterDispatcher<
  LfListEventPayload,
  LfListAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Props
export interface LfListPropsInterface {
  lfDataset?: LfDataDataset;
  lfEmpty?: string;
  lfEnableDeletions?: boolean;
  lfFilter?: boolean;
  lfNavigation?: boolean;
  lfRipple?: boolean;
  lfSelectable?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number;
}
//#endregion

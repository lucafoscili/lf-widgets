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
  LfTextfieldElement,
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
  textfield: LfTextfieldElement | null;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfSelectAdapterJsx extends LfComponentAdapterJsx {
  list: () => VNode | null;
  textfield: () => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfSelectAdapterHandlers extends LfComponentAdapterHandlers {
  list: (event: LfEvent<LfListEventPayload>) => Promise<void>;
  textfield: (event: LfEvent<LfTextfieldEventPayload>) => Promise<void>;
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

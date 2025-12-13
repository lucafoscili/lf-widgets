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
  LF_ACCORDION_BLOCKS,
  LF_ACCORDION_EVENTS,
  LF_ACCORDION_IDS,
  LF_ACCORDION_PARTS,
} from "./accordion.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-accordion` component. It merges the shared component contract with the component-specific props.
 */
export interface LfAccordionInterface
  extends LfComponent<"LfAccordion">,
    LfAccordionPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfAccordionEventPayload) => void;
  };
  /**
   * Internal runtime state: IDs of expanded nodes.
   */
  expandedNodeIds: Set<string>;
  /**
   * Internal runtime state: IDs of selected nodes.
   */
  selectedNodeIds: Set<string>;
  getExpandedNodes: () => Promise<Set<string>>;
  getSelectedNodes: () => Promise<Set<string>>;
  toggleNode: (id: string, e?: Event) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-accordion`.
 */
export interface LfAccordionElement
  extends HTMLStencilElement,
    Omit<LfAccordionInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-accordion` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: N/A for accordion
 * - controller.computed: Derived predicates (isExpanded, isExpandible, isSelected)
 * - controller.actions: Complex operations (toggle)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: N/A for accordion
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfAccordionAdapter
  extends LfComponentAdapter<
    LfAccordionInterface,
    LfAccordionEventPayload,
    LfAccordionAdapterHandlers,
    LfAccordionAdapterJsx,
    LfAccordionAdapterRefs,
    LfAccordionAdapterControllerGetters,
    LfAccordionAdapterControllerSetters,
    LfAccordionAdapterControllerComputed,
    LfAccordionAdapterControllerActions
  > {
  controller: {
    get: LfAccordionAdapterControllerGetters;
    set?: LfAccordionAdapterControllerSetters;
    computed: LfAccordionAdapterControllerComputed;
    actions: LfAccordionAdapterControllerActions;
  };
  elements: {
    jsx: LfAccordionAdapterJsx;
    refs: LfAccordionAdapterRefs;
  };
  handlers?: LfAccordionAdapterHandlers;
  dispatcher: LfAccordionAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * Structure mirrors LF_ACCORDION_BLOCKS for DOM-driven alignment.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfAccordionAdapterRefs extends LfComponentAdapterRefs {
  accordion: HTMLDivElement | null;
  headers: Map<string, HTMLDivElement>;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfAccordionAdapterJsx extends LfComponentAdapterJsx {
  accordion: () => VNode[];
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfAccordionAdapterHandlers
  extends LfComponentAdapterHandlers {}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfAccordionAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfAccordionInterface,
    typeof LF_ACCORDION_BLOCKS,
    typeof LF_ACCORDION_IDS,
    typeof LF_ACCORDION_PARTS
  > {}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfAccordionAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfAccordionAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the node is expanded */
  isExpanded: (node: LfDataNode) => boolean;
  /** Whether the node has expandable content (cells) */
  isExpandible: (node: LfDataNode) => boolean;
  /** Whether the node is selected */
  isSelected: (node: LfDataNode) => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfAccordionAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Toggle node expansion/selection */
  toggle: (node: LfDataNode, e?: Event) => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfAccordionAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfAccordionEventPayload>;
export type LfAccordionAdapterDispatcherDetailOverrides = {
  [E in LfAccordionEvent]: E extends "click" | "expand"
    ? LfAccordionAdapterDispatchDetailBase & { originalEvent?: Event }
    : E extends "pointerdown"
      ? LfAccordionAdapterDispatchDetailBase & { originalEvent: PointerEvent }
      : E extends "lf-event"
        ? LfAccordionAdapterDispatchDetailBase & {
            originalEvent: LfEvent;
          }
        : E extends "ready" | "unmount"
          ? Omit<LfAccordionAdapterDispatchDetailBase, "originalEvent"> & {
              originalEvent?: never;
            }
          : LfAccordionAdapterDispatchDetailBase;
};
export type LfAccordionAdapterDispatcher = LfComponentAdapterDispatcher<
  LfAccordionEventPayload,
  LfAccordionAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-accordion`.
 */
export type LfAccordionEvent = (typeof LF_ACCORDION_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-accordion` events.
 */
export interface LfAccordionEventPayload
  extends LfEventPayload<"LfAccordion", LfAccordionEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-accordion` component.
 */
export interface LfAccordionPropsInterface {
  lfDataset?: LfDataDataset;
  lfExpanded?: string[];
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
//#endregion

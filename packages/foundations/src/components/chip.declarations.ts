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
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_CHIP_BLOCKS,
  LF_CHIP_EVENTS,
  LF_CHIP_IDS,
  LF_CHIP_PARTS,
  LF_CHIP_STYLING,
} from "./chip.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-chip` component. It merges the shared component contract with the component-specific props.
 */
export interface LfChipInterface
  extends LfComponent<"LfChip">,
    LfChipPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfChipEventPayload) => void;
  };
  /**
   * Internal runtime state - set of expanded nodes.
   */
  expandedNodes: Set<LfDataNode>;
  /**
   * Internal runtime state - set of selected nodes.
   */
  selectedNodes: Set<LfDataNode>;
  getSelectedNodes: () => Promise<Set<LfDataNode>>;
  setSelectedNodes: (
    nodes: (LfDataNode[] | string[]) & Array<any>,
  ) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-chip`.
 */
export interface LfChipElement
  extends HTMLStencilElement,
    Omit<LfChipInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-chip`.
 */
export type LfChipEvent = (typeof LF_CHIP_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-chip` events.
 */
export interface LfChipEventPayload
  extends LfEventPayload<"LfChip", LfChipEvent> {
  node: LfDataNode;
  selectedNodes: Set<LfDataNode>;
}
//#endregion

//#region Internal usage
/**
 * Utility interface used by the `lf-chip` component.
 */
export interface LfChipEventArguments {
  expansion?: boolean;
  node?: LfDataNode;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-chip` component.
 */
export interface LfChipPropsInterface {
  lfAriaLabel?: string;
  lfDataset?: LfDataDataset;
  lfFlat?: boolean;
  lfRipple?: boolean;
  lfShowSpinner?: boolean;
  lfStyle?: string;
  lfStyling?: LfChipStyling;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string[];
}
/**
 * Union of styling tokens listed in `LF_CHIP_STYLING`.
 */
export type LfChipStyling = (typeof LF_CHIP_STYLING)[number];
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-chip` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple assignments (empty for chip)
 * - controller.computed: Derived predicates (isChoice, isFilter, isInput, isSelected, etc.)
 * - controller.actions: Complex operations (toggleExpansion, toggleSelection, deleteNode)
 * - elements: Refs registry
 * - dispatcher: REQUIRED centralized event emission
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfChipAdapter
  extends LfComponentAdapter<
    LfChipInterface,
    LfChipEventPayload,
    LfChipAdapterHandlers,
    LfChipAdapterJsx,
    LfChipAdapterRefs,
    LfChipAdapterControllerGetters,
    LfChipAdapterControllerSetters,
    LfChipAdapterControllerComputed,
    LfChipAdapterControllerActions
  > {
  controller: {
    get: LfChipAdapterControllerGetters;
    set: LfChipAdapterControllerSetters;
    computed: LfChipAdapterControllerComputed;
    actions: LfChipAdapterControllerActions;
  };
  elements: {
    jsx: LfChipAdapterJsx;
    refs: LfChipAdapterRefs;
  };
  dispatcher: LfChipAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfChipAdapterRefs extends LfComponentAdapterRefs {
  items: Map<string, HTMLElement>;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfChipAdapterJsx extends LfComponentAdapterJsx {
  chip: () => VNode[];
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfChipAdapterHandlers extends LfComponentAdapterHandlers {}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfChipAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfChipInterface,
    typeof LF_CHIP_BLOCKS,
    typeof LF_CHIP_IDS,
    typeof LF_CHIP_PARTS
  > {
  /** Current chip styling (normalized to lowercase) */
  styling: () => LfChipStyling;
}
/**
 * Simple single-value setters.
 * Chip doesn't require setters, but interface is provided for consistency.
 */
export interface LfChipAdapterControllerSetters
  extends LfComponentAdapterSetters {}
/**
 * Computed values - derived predicates.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfChipAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the node has children */
  hasChildren: (node: LfDataNode) => boolean;
  /** Whether the node has only an icon (no text value) */
  hasIconOnly: (node: LfDataNode) => boolean;
  /** Whether the chip styling is "choice" */
  isChoice: () => boolean;
  /** Whether the chip is clickable (choice or filter styling) */
  isClickable: () => boolean;
  /** Whether the given node is expanded */
  isExpanded: (node: LfDataNode) => boolean;
  /** Whether the chip styling is "filter" */
  isFilter: () => boolean;
  /** Whether the chip styling is "input" */
  isInput: () => boolean;
  /** Whether the given node is selected */
  isSelected: (node: LfDataNode) => boolean;
  /** Whether children of the node should be shown */
  showChildren: (node: LfDataNode) => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfChipAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Toggle expansion state for a node */
  toggleExpansion: (node: LfDataNode) => void;
  /** Toggle selection state for a node */
  toggleSelection: (node: LfDataNode) => void;
  /** Delete a node from the dataset */
  deleteNode: (node: LfDataNode) => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfChipAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfChipEventPayload>;
export type LfChipAdapterDispatcherDetailOverrides = {
  [E in LfChipEvent]: E extends "blur" | "focus"
    ? LfChipAdapterDispatchDetailBase & { originalEvent: FocusEvent }
    : E extends "click" | "delete"
      ? LfChipAdapterDispatchDetailBase & { originalEvent: MouseEvent }
      : E extends "pointerdown"
        ? LfChipAdapterDispatchDetailBase & { originalEvent: PointerEvent }
        : E extends "ready" | "unmount"
          ? Omit<LfChipAdapterDispatchDetailBase, "originalEvent"> & {
              originalEvent?: never;
            }
          : LfChipAdapterDispatchDetailBase;
};
export type LfChipAdapterDispatcher = LfComponentAdapterDispatcher<
  LfChipEventPayload,
  LfChipAdapterDispatcherDetailOverrides
>;
//#endregion

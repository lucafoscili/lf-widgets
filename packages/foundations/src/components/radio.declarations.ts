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
import {
  LfDataDataset,
  LfDataNode,
  LfThemeUISize,
  LfThemeUIState,
} from "../framework/index";
import {
  LF_RADIO_BLOCKS,
  LF_RADIO_EVENTS,
  LF_RADIO_IDS,
  LF_RADIO_ORIENTATIONS,
  LF_RADIO_PARTS,
} from "./radio.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-radio` component. It merges the shared component contract with the component-specific props.
 */
export interface LfRadioInterface
  extends LfComponent<"LfRadio">,
    LfRadioPropsInterface {
  /**
   * Canonical event emitter exposed by the Stencil component instance.
   * Used by adapter dispatchers to centralise event emission.
   */
  lfEvent: {
    emit: (payload: LfRadioEventPayload) => void;
  };
  /**
   * Internal runtime state - the currently selected node ID.
   */
  value: string | undefined;
  /**
   * Clears the current selection.
   */
  clearSelection: () => Promise<void>;
  /**
   * Gets the current adapter instance.
   */
  getAdapter: () => Promise<LfRadioAdapter>;
  /**
   * Gets the currently selected node.
   */
  getSelectedNode: () => Promise<LfDataNode | undefined>;
  /**
   * Programmatically selects a radio item by ID.
   */
  selectItem: (nodeId: string) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-radio`.
 */
export interface LfRadioElement
  extends HTMLStencilElement,
    Omit<LfRadioInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-radio`.
 */
export type LfRadioEvent = (typeof LF_RADIO_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-radio` events.
 */
export interface LfRadioEventPayload
  extends LfEventPayload<"LfRadio", LfRadioEvent> {
  node: LfDataNode;
  previousValue: string | null;
  value: string | null;
}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-radio` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
 * - controller.set: Simple assignments (selection)
 * - controller.computed: Derived predicates (isDisabled, hasNodes, isHorizontal, etc.)
 * - controller.actions: Complex operations (select, clear, focusNext, focusPrevious)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfRadioAdapter
  extends LfComponentAdapter<
    LfRadioInterface,
    LfRadioEventPayload,
    LfRadioAdapterHandlers,
    LfRadioAdapterJsx,
    LfRadioAdapterRefs,
    LfRadioAdapterControllerGetters,
    LfRadioAdapterControllerSetters,
    LfRadioAdapterControllerComputed,
    LfRadioAdapterControllerActions
  > {
  controller: {
    get: LfRadioAdapterControllerGetters;
    set: LfRadioAdapterControllerSetters;
    computed: LfRadioAdapterControllerComputed;
    actions: LfRadioAdapterControllerActions;
  };
  elements: {
    jsx: LfRadioAdapterJsx;
    refs: LfRadioAdapterRefs;
  };
  handlers: LfRadioAdapterHandlers;
  dispatcher: LfRadioAdapterDispatcher;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 * All values are explicitly nullable per v4.0.0 Section 5.7.
 */
export interface LfRadioAdapterRefs extends LfComponentAdapterRefs {
  /**
   * Map of node ID to input element.
   */
  inputs: Map<string, HTMLInputElement | null>;
  /**
   * Map of node ID to radio item element.
   */
  items: Map<string, HTMLElement | null>;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfRadioAdapterJsx extends LfComponentAdapterJsx {
  /**
   * Renders the radio control element.
   */
  control: (node: LfDataNode) => VNode;
  /**
   * Renders a single radio item.
   */
  item: (node: LfDataNode, index: number) => VNode;
  /**
   * Renders the label element for a radio item.
   */
  label: (node: LfDataNode) => VNode;
  /**
   * Renders the radio wrapper.
   */
  radio: (nodes: LfDataNode[]) => VNode;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfRadioAdapterHandlers extends LfComponentAdapterHandlers {
  /**
   * Handles blur on a radio item.
   */
  blur: (event: FocusEvent, node: LfDataNode) => void;
  /**
   * Handles change on a radio input.
   */
  change: (event: Event, node: LfDataNode) => void;
  /**
   * Handles click on a radio item.
   */
  click: (event: MouseEvent, node: LfDataNode) => void;
  /**
   * Handles focus on a radio item.
   */
  focus: (event: FocusEvent, node: LfDataNode) => void;
  /**
   * Handles keyboard navigation (arrow keys).
   */
  keyDown: (event: KeyboardEvent) => void;
  /**
   * Handles pointer down on a radio item for ripple effect.
   */
  pointerDown: (event: PointerEvent, node: LfDataNode) => void;
}
/**
 * Base getters extended with component-specific state reads.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfRadioAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfRadioInterface,
    typeof LF_RADIO_BLOCKS,
    typeof LF_RADIO_IDS,
    typeof LF_RADIO_PARTS
  > {}
/**
 * Simple single-value setters.
 * Each setter performs exactly ONE state change.
 */
export interface LfRadioAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /**
   * Updates the dataset.
   * Resets selection if current selection is not in new dataset.
   */
  updateDataset: (dataset: LfDataDataset) => void;
}
/**
 * Computed values - derived predicates and builders.
 * Pure functions that compute from current state without side effects.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfRadioAdapterControllerComputed
  extends LfComponentAdapterComputed {
  /** Whether the radio group is disabled based on lfUiState */
  isDisabled: () => boolean;
  /** Whether the radio group has nodes to display */
  hasNodes: () => boolean;
  /** Whether the radio group is in horizontal orientation */
  isHorizontal: () => boolean;
  /** Whether labels should be leading (before the radio control) */
  isLeadingLabel: () => boolean;
  /** Whether ripple effect is enabled */
  hasRipple: () => boolean;
  /** Gets the currently selected node ID */
  selectedId: () => string | undefined;
  /** Checks if a specific node is selected */
  isSelected: (nodeId: string) => boolean;
}
/**
 * Complex multi-step actions.
 * May have side effects, trigger re-renders, or batch state changes.
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export interface LfRadioAdapterControllerActions
  extends LfComponentAdapterActions {
  /** Select a radio item by node ID */
  select: (nodeId: string | undefined) => void;
  /** Clear the current selection */
  clear: () => void;
  /** Focus the next radio item in the list */
  focusNext: () => void;
  /** Focus the previous radio item in the list */
  focusPrevious: () => void;
}
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfRadioAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfRadioEventPayload>;
export type LfRadioAdapterDispatcherDetailOverrides = {
  [E in LfRadioEvent]: E extends "blur" | "focus"
    ? LfRadioAdapterDispatchDetailBase & { originalEvent: FocusEvent }
    : E extends "click"
      ? LfRadioAdapterDispatchDetailBase & { originalEvent: MouseEvent }
      : E extends "pointerdown"
        ? LfRadioAdapterDispatchDetailBase & { originalEvent: PointerEvent }
        : E extends "change"
          ? LfRadioAdapterDispatchDetailBase & { originalEvent: Event }
          : E extends "ready" | "unmount"
            ? Omit<LfRadioAdapterDispatchDetailBase, "originalEvent"> & {
                originalEvent?: never;
              }
            : LfRadioAdapterDispatchDetailBase;
};
export type LfRadioAdapterDispatcher = LfComponentAdapterDispatcher<
  LfRadioEventPayload,
  LfRadioAdapterDispatcherDetailOverrides
>;
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-radio` component.
 */
export interface LfRadioPropsInterface {
  /**
   * Explicit accessible label for the radio group.
   * Applied to the fieldset element.
   */
  lfAriaLabel?: string;
  /**
   * Dataset containing the radio options.
   * Each node represents a radio button.
   */
  lfDataset?: LfDataDataset;
  /**
   * When true, labels appear before the radio controls.
   */
  lfLeadingLabel?: boolean;
  /**
   * Layout orientation for the radio group.
   */
  lfOrientation?: LfRadioOrientation;
  /**
   * When true, clicking triggers a ripple effect.
   */
  lfRipple?: boolean;
  /**
   * Custom styling for the component.
   */
  lfStyle?: string;
  /**
   * UI size variant.
   */
  lfUiSize?: LfThemeUISize;
  /**
   * UI state.
   */
  lfUiState?: LfThemeUIState;
  /**
   * ID of the currently selected node.
   * When undefined, no item is selected.
   */
  lfValue?: string;
}
/**
 * Union of orientation tokens listed in `LF_RADIO_ORIENTATIONS`.
 */
export type LfRadioOrientation = (typeof LF_RADIO_ORIENTATIONS)[number];
//#endregion

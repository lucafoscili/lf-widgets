import {
  LfComponentAdapterGetters as LfAdapterGetters,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
} from "../foundations/components.constants";
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
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "../framework/index";
import {
  LF_RADIO_BLOCKS,
  LF_RADIO_EVENTS,
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
 * Complete adapter structure for lf-radio.
 */
export interface LfRadioAdapter {
  controller: {
    get: LfRadioAdapterControllerGetters;
    set: LfRadioAdapterControllerSetters;
  };
  elements: {
    jsx: LfRadioAdapterJsx;
    refs: LfRadioAdapterRefs;
  };
  handlers: LfRadioAdapterHandlers;
}
/**
 * Getters namespace for the radio adapter controller.
 * All getters return functions (pure, no invocation).
 */
export interface LfRadioAdapterControllerGetters
  extends LfAdapterGetters<LfRadioInterface> {
  /**
   * BEM block classes for styling.
   */
  blocks: typeof LF_RADIO_BLOCKS;
  /**
   * Cypress test attributes.
   */
  cyAttributes: typeof CY_ATTRIBUTES;
  /**
   * Data-related getters.
   */
  data: {
    /**
     * Returns a function that gets the current dataset.
     */
    dataset: () => LfDataDataset | undefined;
    /**
     * Returns a function that gets all nodes as a flat array.
     */
    nodes: () => LfDataNode[];
    /**
     * Returns the node matching the given ID.
     */
    nodeById: (id: string) => LfDataNode | undefined;
    /**
     * Returns a function that gets the currently selected node.
     */
    selectedNode: () => LfDataNode | undefined;
  };
  /**
   * LF-specific attributes.
   */
  lfAttributes: typeof LF_ATTRIBUTES;
  /**
   * Framework manager instance.
   */
  manager: LfFrameworkInterface;
  /**
   * CSS part names for styling.
   */
  parts: typeof LF_RADIO_PARTS;
  /**
   * State-related getters.
   */
  state: {
    /**
     * Returns a function that gets the selected ID.
     */
    selectedId: () => string | undefined;
    /**
     * Returns a function that checks if a node is selected.
     */
    isSelected: (nodeId: string) => boolean;
  };
  /**
   * UI-related getters.
   */
  ui: {
    /**
     * Returns a function that gets the orientation.
     */
    orientation: () => LfRadioOrientation;
    /**
     * Returns a function that checks if labels are leading.
     */
    isLeadingLabel: () => boolean;
    /**
     * Returns a function that checks if ripple is enabled.
     */
    hasRipple: () => boolean;
  };
}
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfRadioAdapterInitializerGetters = Pick<
  LfRadioAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "data"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "state"
  | "ui"
>;
/**
 * Setters namespace for the radio adapter controller.
 * All setters are async and return void promises.
 */
export interface LfRadioAdapterControllerSetters
  extends LfComponentAdapterSetters {
  /**
   * Dataset-related setters.
   */
  data: {
    /**
     * Updates the dataset.
     * Resets selection if current selection is not in new dataset.
     */
    updateDataset: (dataset: LfDataDataset) => Promise<void>;
  };
  /**
   * Selection-related setters.
   */
  selection: {
    /**
     * Clears the current selection.
     */
    clear: () => Promise<void>;
    /**
     * Sets the selected node ID.
     * Triggers animation and event emission.
     */
    select: (nodeId: string | undefined) => Promise<void>;
  };
}
/**
 * Subset of adapter setters required during initialisation.
 */
export type LfRadioAdapterInitializerSetters = Pick<
  LfRadioAdapterControllerSetters,
  "data" | "selection"
>;
/**
 * Element references for the radio adapter.
 * Store only element handles, no logic.
 */
export interface LfRadioAdapterRefs {
  /**
   * Map of node ID to input element.
   */
  inputs: Map<string, HTMLInputElement>;
  /**
   * Map of node ID to radio item element.
   */
  items: Map<string, HTMLElement>;
  /**
   * Map of node ID to ripple container element.
   */
  ripples: Map<string, HTMLElement>;
}
/**
 * JSX factory functions for the radio adapter.
 * All functions are pure and return VNodes.
 */
export interface LfRadioAdapterJsx {
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
 * Event handlers for the radio adapter.
 * All handlers are async-capable.
 */
export interface LfRadioAdapterHandlers {
  /**
   * Handles blur on a radio item.
   */
  blur: (nodeId: string, event: FocusEvent) => Promise<void>;
  /**
   * Handles change on a radio input.
   */
  change: (nodeId: string, event: Event) => Promise<void>;
  /**
   * Handles click on a radio item.
   */
  click: (nodeId: string, event: MouseEvent) => Promise<void>;
  /**
   * Handles focus on a radio item.
   */
  focus: (nodeId: string, event: FocusEvent) => Promise<void>;
  /**
   * Handles keyboard navigation (arrow keys).
   */
  keyDown: (event: KeyboardEvent) => Promise<void>;
  /**
   * Handles pointer down on a radio item for ripple effect.
   */
  pointerDown: (node: LfDataNode, event: Event) => Promise<void>;
}
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

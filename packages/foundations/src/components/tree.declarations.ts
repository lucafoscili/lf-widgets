import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
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
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import { LfTextfieldEventPayload } from "./textfield.declarations";
import {
  LF_TREE_BLOCKS,
  LF_TREE_EVENTS,
  LF_TREE_PARTS,
} from "./tree.constants";

//#region Class
/**
 * Public interface for the LfTree component.
 *
 * Represents the API surface of a tree widget that manages hierarchical data,
 * selection and expansion state, and emits component-specific events.
 *
 * This interface extends the generic component contract (LfComponent<"LfTree">)
 * and the tree-specific properties (LfTreePropsInterface).
 *
 * Members
 * - onLfEvent: Callback used by the component to dispatch or handle internal
 *   events. It receives a native Event or CustomEvent, a typed LfTreeEvent
 *   identifier, and optional event-specific arguments (LfTreeEventArguments).
 *   Consumers can implement this to centralize event handling and to react to
 *   user interactions or programmatic changes.
 *
 * - _filterTimeout: Optional internal timer handle used to debounce or delay
 *   filtering operations. The value is intentionally untyped (any) to allow
 *   different timer implementations across environments (number, NodeJS.Timeout, etc.).
 *
 * - setExpandedNodes(nodes): Asynchronously sets which nodes are expanded.
 *   The `nodes` argument accepts:
 *     - a single node ID (string),
 *     - a single LfDataNode object,
 *     - an array of node IDs,
 *     - an array of LfDataNode objects,
 *     - or `null` to collapse every node.
 *   The method normalizes inputs, updates internal expansion state, and resolves
 *   when the operation (including any resulting UI updates) is complete.
 *
 * - setSelectedNodes(nodes): Asynchronously sets the current selection.
 *   The `nodes` argument accepts the same shapes as setExpandedNodes:
 *     - string | LfDataNode | Array<string | LfDataNode> | null
 *   Passing `null` clears the selection. The method updates internal selection
 *   state, triggers any selection-related side effects, and returns a Promise
 *   that resolves once the action has been applied.
 *
 * Notes
 * - Both setExpandedNodes and setSelectedNodes are asynchronous (Promise<void>).
 *   Callers should await their completion when subsequent logic depends on the
 *   updated tree state.
 *
 * @public
 */
export interface LfTreeInterface
  extends LfComponent<"LfTree">,
    LfTreePropsInterface {
  onLfEvent: (
    e: Event | CustomEvent,
    eventType: LfTreeEvent,
    args?: LfTreeEventArguments,
  ) => void;
  _filterTimeout?: any;
  /**
   * Sets the expanded nodes in the tree.
   * @param nodes - The nodes to expand, which can be a single node ID, a single LfDataNode object, an array of node IDs, an array of LfDataNode objects, or null to collapse all nodes.
   */
  setExpandedNodes: (
    nodes: string | LfDataNode | Array<string | LfDataNode> | null,
  ) => Promise<void>;
  /**
   * Sets the selected nodes in the tree.
   * @param nodes - The nodes to select, which can be a single node ID, a single LfDataNode object, an array of node IDs, an array of LfDataNode objects, or null to clear the selection.
   */
  setSelectedNodes: (
    nodes: string | LfDataNode | Array<string | LfDataNode> | null,
  ) => Promise<void>;
  /**
   * Retrieves the identifiers for nodes currently expanded within the tree.
   */
  getExpandedNodeIds: () => Promise<string[]>;
  /**
   * Retrieves the identifiers for nodes currently selected within the tree.
   */
  getSelectedNodeIds: () => Promise<string[]>;
}
/**
 * DOM element type for the custom element registered as `lf-tree`.
 */
export interface LfTreeElement
  extends HTMLStencilElement,
    Omit<LfTreeInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-tree` into host integrations.
 */
export interface LfTreeAdapter extends LfComponentAdapter<LfTreeInterface> {
  controller: {
    get: LfTreeAdapterControllerGetters;
    set: LfTreeAdapterControllerSetters;
  };
  elements: { jsx: LfTreeAdapterJsx; refs: LfTreeAdapterRefs };
  handlers: LfTreeAdapterHandlers;
}
/**
 * Subset of adapter getters required during initialisation.
 */
export interface LfTreeAdapterControllerGetters
  extends LfComponentAdapterGetters<LfTreeInterface> {
  allowsMultiSelect: () => boolean;
  blocks: typeof LF_TREE_BLOCKS;
  canSelectNode: (node: LfDataNode | null | undefined) => boolean;
  columns: () => NonNullable<LfDataDataset["columns"]>;
  compInstance: LfTreeInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  dataset: () => LfDataDataset;
  expandedProp: () => string[] | undefined;
  filterValue: () => string;
  initialExpansionDepth: () => number | undefined;
  isExpanded: (node: LfDataNode) => boolean;
  isGrid: () => boolean;
  isHidden: (node: LfDataNode) => boolean;
  isSelected: (node: LfDataNode) => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  parts: typeof LF_TREE_PARTS;
  selectable: () => boolean;
  selectedProp: () => string[] | undefined;
  state: {
    expansion: { ids: () => string[]; nodes: () => Set<string> };
    selection: { ids: () => string[]; node: () => LfDataNode };
  };
}
/**
 * Subset of adapter setters required during initialisation.
 */
export interface LfTreeAdapterControllerSetters
  extends LfComponentAdapterSetters {
  filter: { setValue: (value: string) => void; apply: (value: string) => void };
  state: {
    expansion: {
      apply: () => void;
      toggle: (node: LfDataNode) => void;
      setNodes: (nodes: Iterable<string>) => void;
      setProp: (ids: string[]) => void;
      emitChange: (
        event: Event | CustomEvent | null,
        node: LfDataNode | null,
        ids: string[],
      ) => void;
    };
    selection: {
      apply: () => void;
      set: (node: LfDataNode) => void;
      clear: () => void;
      setNode: (node: LfDataNode | null) => void;
      setProp: (ids: string[]) => void;
      emitChange: (
        event: Event | CustomEvent | null,
        node: LfDataNode | null,
        ids: string[],
      ) => void;
    };
  };
}

/**
 * Subset of adapter getters required during initialisation.
 */
export type LfTreeAdapterInitializerGetters = Pick<
  LfTreeAdapterControllerGetters,
  | "allowsMultiSelect"
  | "blocks"
  | "canSelectNode"
  | "columns"
  | "compInstance"
  | "cyAttributes"
  | "dataset"
  | "expandedProp"
  | "filterValue"
  | "initialExpansionDepth"
  | "isExpanded"
  | "isGrid"
  | "isHidden"
  | "isSelected"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "selectedProp"
  | "selectable"
  | "state"
>;
/**
 * Subset of adapter setters required during initialisation.
 */
export type LfTreeAdapterInitializerSetters = Pick<
  LfTreeAdapterControllerSetters,
  "filter" | "state"
>;
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfTreeAdapterJsx extends LfComponentAdapterJsx {
  filter: () => VNode;
  header: () => VNode;
  nodes: () => VNode;
  empty: () => VNode;
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfTreeAdapterRefs extends LfComponentAdapterRefs {
  rippleSurfaces: Record<string, HTMLElement>;
  filterField: HTMLElement | null;
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfTreeAdapterHandlers extends LfComponentAdapterHandlers {
  node: {
    click: (e: Event, node: LfDataNode) => void;
    expand: (e: Event, node: LfDataNode) => void;
    pointerDown: (e: Event, node: LfDataNode) => void;
  };
  filter: {
    input: (e: CustomEvent<LfTextfieldEventPayload>) => void;
  };
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-tree`.
 */
export type LfTreeEvent = (typeof LF_TREE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-tree` events.
 */
export interface LfTreeEventPayload
  extends LfEventPayload<"LfTree", LfTreeEvent> {
  expandedNodeIds?: string[];
  node?: LfDataNode;
  selectedNodeIds?: string[];
}
/**
 * Utility interface used by the `lf-tree` component.
 */
export interface LfTreeEventArguments {
  expandedNodeIds?: string[];
  expansion?: boolean;
  node?: LfDataNode;
  selected?: boolean;
  selectedNodeIds?: string[];
}
//#endregion

//#region Internal usage
/**
 * Props helper describing the node for `lf-tree`.
 */
export interface LfTreeNodeProps {
  accordionLayout: boolean;
  depth: number;
  elements: { ripple: VNode; value: VNode };
  events: {
    onClick: (event: MouseEvent) => void;
    onClickExpand: (event: MouseEvent) => void;
    onPointerDown: (event: MouseEvent) => void;
  };
  expanded: boolean;
  manager: LfFrameworkInterface;
  node: LfDataNode;
  selected: boolean;
}
/**
 * Tree node description used by the traversed in `lf-tree`.
 */
export interface LfTreeTraversedNode {
  node: LfDataNode;
  depth: number;
  expanded?: boolean;
  hidden?: boolean;
  selected?: boolean;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-tree` component.
 */
export interface LfTreePropsInterface {
  lfAccordionLayout?: boolean;
  lfDataset?: LfDataDataset;
  lfExpandedNodeIds?: string[];
  lfEmpty?: string;
  lfFilter?: boolean;
  lfInitialExpansionDepth?: number;
  lfGrid?: boolean;
  lfSelectedNodeIds?: string[];
  lfRipple?: boolean;
  lfSelectable?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
}
//#endregion

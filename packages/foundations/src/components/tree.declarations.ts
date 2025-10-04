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
import { LF_TREE_EVENTS } from "./tree.constants";

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
export interface LfTreeAdapterInitializerGetters {
  blocks: typeof import("./tree.constants").LF_TREE_BLOCKS;
  compInstance: LfTreeInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  dataset: () => LfDataDataset;
  columns: () => NonNullable<LfDataDataset["columns"]>;
  isGrid: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: import("../framework/framework.declarations").LfFrameworkInterface;
  parts: typeof import("./tree.constants").LF_TREE_PARTS;
  isExpanded: (node: LfDataNode) => boolean;
  isHidden: (node: LfDataNode) => boolean;
  isSelected: (node: LfDataNode) => boolean;
  filterValue: () => string; // kept as function to always reflect latest value
}
/**
 * Subset of adapter setters required during initialisation.
 */
export interface LfTreeAdapterInitializerSetters {
  expansion: { toggle: (node: LfDataNode) => void };
  selection: { set: (node: LfDataNode) => void };
  filter: { setValue: (value: string) => void; apply: (value: string) => void };
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfTreeAdapterControllerGetters
  extends LfComponentAdapterGetters<LfTreeInterface> {
  blocks: typeof import("./tree.constants").LF_TREE_BLOCKS;
  compInstance: LfTreeInterface;
  manager: import("../framework/framework.declarations").LfFrameworkInterface;
  cyAttributes: typeof CY_ATTRIBUTES;
  dataset: () => LfDataDataset;
  columns: () => NonNullable<LfDataDataset["columns"]>;
  isGrid: () => boolean;
  lfAttributes: typeof LF_ATTRIBUTES;
  parts: typeof import("./tree.constants").LF_TREE_PARTS;
  isExpanded: (node: LfDataNode) => boolean;
  isHidden: (node: LfDataNode) => boolean;
  isSelected: (node: LfDataNode) => boolean;
  filterValue: () => string;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfTreeAdapterControllerSetters
  extends LfComponentAdapterSetters {
  expansion: { toggle: (node: LfDataNode) => void };
  selection: { set: (node: LfDataNode) => void };
  filter: { setValue: (value: string) => void; apply: (value: string) => void };
}
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
  node?: LfDataNode;
}
/**
 * Utility interface used by the `lf-tree` component.
 */
export interface LfTreeEventArguments {
  expansion?: boolean;
  node?: LfDataNode;
  selected?: boolean;
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
  lfEmpty?: string;
  lfFilter?: boolean;
  lfInitialExpansionDepth?: number;
  lfGrid?: boolean;
  lfRipple?: boolean;
  lfSelectable?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
}
//#endregion

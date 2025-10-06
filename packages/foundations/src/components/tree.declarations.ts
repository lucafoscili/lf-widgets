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
  _filterTimeout?: any;
  /**
   * Retrieves the identifiers for nodes currently expanded within the tree.
   */
  getExpandedNodeIds: () => Promise<string[]>;
  /**
   * Retrieves the identifiers for nodes currently selected within the tree.
   */
  getSelectedNodeIds: () => Promise<string[]>;
  onLfEvent: (
    e: Event | CustomEvent,
    eventType: LfTreeEvent,
    args?: LfTreeEventArguments,
  ) => void;
  /**
   * Selects the first node matching the provided predicate. If no match is found, selection is cleared.
   * This method combines node.find with setSelectedNodes for common selection-by-criteria workflows.
   * @param predicate - Function that returns true for the node to select
   * @returns Promise resolving to the selected node, or undefined if no match was found
   */
  selectByPredicate: (
    predicate: (node: LfDataNode) => boolean,
  ) => Promise<LfDataNode | undefined>;
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
  extends LfEventPayload<"LfTree", LfTreeEvent>,
    LfTreeEventArguments {}
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
 * Options used when committing changes to the tree state.
 *
 * Provides flags and contextual information to control how a state commit is applied
 * and how it should notify interested parties.
 *
 * @property emit - Whether the commit should emit a change event to notify listeners.
 * @property updateProp - Whether the commit should update the component's public/internal properties to reflect the new state.
 * @property node - The data node associated with this commit, or null when the change is not node-specific.
 * @property event - The originating Event or CustomEvent that triggered the commit, if any.
 */
export type LfTreeStateCommitOptions = {
  emit?: boolean;
  updateProp?: boolean;
  node?: LfDataNode | null;
  event?: Event | CustomEvent | null;
};

/**
 * Manages the expansion state for a tree component.
 *
 * This interface encapsulates operations for reading, updating and reconciling
 * which nodes of a tree are expanded. Implementations are expected to track
 * an internal list/set of expanded node IDs, apply changes originating from
 * props or user interaction, and handle dataset changes and persistence
 * integration.
 *
 * @remarks
 * - Methods that accept previouslyExpanded sets are intended to help preserve
 *   expansion state across data/structure changes.
 * - Methods that accept prop values should support string, string[] and nullish
 *   inputs to allow flexible controlled/uncontrolled usage.
 *
 * @category Tree
 *
 * @example
 * // Typical usage:
 * // const ids = state.applyIds(['a','b'], { persist: true });
 * // state.toggle(node);
 *
 * applyIds(ids: string[], options?: LfTreeStateCommitOptions): string[];
 * @param ids - The list of node IDs to apply as the current expansion state.
 * @param options - Optional commit options that control how the state change
 *                  is applied or persisted.
 * @returns The resulting list of expanded node IDs after the commit.
 *
 * handlePropChange(value: string[] | string | null | undefined): void;
 * @param value - A new expansion value provided via props. May be a single ID,
 *                an array of IDs, or a null/undefined to indicate no expansion.
 *                Implementations should reconcile this input with internal state.
 *
 * applyInitialExpansion(previouslyExpanded?: Set<string>): void;
 * @param previouslyExpanded - Optional set of IDs that were expanded previously
 *                              (e.g. from a prior dataset or session) to be
 *                              considered when applying the initial expansion.
 *
 * reconcileAfterDatasetChange(previouslyExpanded?: Set<string>): void;
 * @param previouslyExpanded - Optional set of IDs that should be used to
 *                              reconcile expansion after the tree's dataset
 *                              or structure has changed. Implementations should
 *                              attempt to preserve logical expansion as much as possible.
 *
 * handleInitialDepthChange(previouslyExpanded: Set<string>): void;
 * @param previouslyExpanded - A set of IDs or marker representing previously
 *                              expanded nodes; used specifically when the
 *                              initial expansion depth configuration changes.
 *                              Implementations should update expansion to reflect the new depth.
 *
 * toggle(node: LfDataNode): void;
 * @param node - The tree node to toggle. This should expand a collapsed node
 *               or collapse an expanded node and update any internal/persistent state.
 *
 * getIds(): string[];
 * @returns The current list (or snapshot) of expanded node IDs.
 *
 * initialisePersistentState(value: string[] | string | null | undefined): void;
 * @param value - An initial persistent value (from e.g. local storage, props,
 *                or a persisted session) that should be used to seed the
 *                expansion state. Implementations should validate and normalize
 *                this input into the internal representation.
 */
export interface LfTreeExpansionState {
  applyIds: (ids: string[], options?: LfTreeStateCommitOptions) => string[];
  applyInitialExpansion: (previouslyExpanded?: Set<string>) => void;
  getIds: () => string[];
  initialisePersistentState: (
    value: string[] | string | null | undefined,
  ) => void;
  handleInitialDepthChange(previouslyExpanded: Set<string>): void;
  handlePropChange: (value: string[] | string | null | undefined) => void;
  reconcileAfterDatasetChange: (previouslyExpanded?: Set<string>) => void;
  toggle: (node: LfDataNode) => void;
}
/**
 * Manages and exposes operations for the selection state of a tree component.
 *
 * This interface defines a small command surface for applying, querying and
 * synchronizing selection information with external inputs (props, persisted
 * values, or changes to the underlying dataset).
 *
 * Methods are responsible for updating the in-memory selection, optionally
 * committing those changes according to provided commit options, and ensuring
 * selection consistency when the dataset or selectable state changes.
 *
 * applyIds(ids, options?)
 * - Apply an explicit set of node IDs as the current selection.
 *
 * @param ids - An array of node IDs to apply as the selection.
 * @param options - Optional commit options that control how the change is persisted/emitted.
 * @returns The resulting array of selected IDs after applying the provided IDs.
 *
 * applyTargets(target, options?)
 * - Apply one or more selection targets. Targets may be an ID string, a data node,
 *   an array of either, or null to clear selection. Implementations should resolve
 *   nodes to their IDs and update selection accordingly.
 *
 * @param target - A single target (ID or node), an array of targets, or null.
 * @param options - Optional commit options that control how the change is persisted/emitted.
 * @returns The resulting array of selected IDs after resolving and applying the targets.
 *
 * handlePropChange(value)
 * - Synchronize internal selection state with an externally provided prop value.
 *   Typically called when the controlled value prop changes.
 *
 * @param value - The new value from props (could be an array of IDs, single ID, null, or undefined).
 * @returns void
 *
 * reconcileAfterDatasetChange(previousSelectedId?)
 * - Reconcile the current selection after the tree dataset changes (nodes added/removed/reordered).
 *   Optionally accepts the previously selected ID to aid in restoring focus/selection semantics.
 *
 * @param previousSelectedId - Optional previously selected ID to consider when reconciling.
 * @returns void
 *
 * initialisePersistentState(value)
 * - Initialize selection state from a persisted or initial value (for example, restoring
 *   selection on mount from local storage or serialized state).
 *
 * @param value - Persisted selection value (array of IDs, single ID, null, or undefined).
 * @returns void
 *
 * handleSelectableChange(selectable)
 * - Respond to changes in the tree's selectable configuration. If selection is disabled,
 *   implementations should clear or adapt the current selection as appropriate.
 *
 * @param selectable - Whether selection is currently allowed.
 * @returns void
 *
 * getIds()
 * - Retrieve the currently selected node IDs from internal state.
 *
 * @returns The array of currently selected node IDs.
 *
 * clearSelection(options?)
 * - Clear the current selection. May accept commit options to control persistence/emission.
 *
 * @param options - Optional commit options that control how the clear operation is persisted/emitted.
 * @returns The resulting (empty) array of selected IDs after clearing selection.
 */
export interface LfTreeSelectionState {
  applyIds: (ids: string[], options?: LfTreeStateCommitOptions) => string[];
  applyTargets: (
    target: string | LfDataNode | Array<string | LfDataNode> | null,
    options?: LfTreeStateCommitOptions,
  ) => string[];
  clearSelection: (options?: LfTreeStateCommitOptions) => string[];
  getIds: () => string[];
  handlePropChange: (value: string[] | string | null | undefined) => void;
  handleSelectableChange: (selectable: boolean) => void;
  initialisePersistentState: (
    value: string[] | string | null | undefined,
  ) => void;
  reconcileAfterDatasetChange: (previousSelectedId?: string | null) => void;
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

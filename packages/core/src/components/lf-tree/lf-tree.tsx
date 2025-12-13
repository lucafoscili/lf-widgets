import type {
  LfTreeAdapter,
  LfTreeExpansionState,
  LfTreeSelectionState,
} from "@lf-widgets/foundations";
import {
  LF_STYLE_ID,
  LF_TREE_BLOCKS,
  LF_TREE_IDS,
  LF_TREE_PARTS,
  LF_TREE_PROPS,
  LF_WRAPPER_ID,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeUISize,
  LfTreeElement,
  LfTreeEvent,
  LfTreeEventPayload,
  LfTreeInterface,
  LfTreePropsInterface,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepTreeActions } from "./actions.tree";
import { prepTreeComputed } from "./computed.tree";
import { createAdapter } from "./lf-tree-adapter";
import { createExpansionState } from "./state.expansion";
import { createSelectionState } from "./state.selection";
import {
  extractIdCandidates,
  getNodeId,
  normalizeTargetInput,
} from "./state.utils";

/**
 * The tree component displays a hierarchical dataset in a tree structure.
 * The tree may include nodes that can be expanded or collapsed.
 *
 * @component
 * @tag lf-tree
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying hierarchical data in a tree structure.
 *
 * @example
 * <lf-tree lfDataset={treeData}></lf-tree>
 *
 * @fires {CustomEvent} lf-tree-event - Emitted for various component events
 */
@Component({
  tag: "lf-tree",
  styleUrl: "lf-tree.scss",
  shadow: true,
})
export class LfTree implements LfTreeInterface {
  /**
   * References the root HTML element of the component (<lf-tree>).
   */
  @Element() rootElement: LfTreeElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() expandedNodes: Set<string> = new Set();
  @State() hiddenNodes: Set<LfDataNode> = new Set();
  @State() selectedNode: LfDataNode = null;
  //#endregion

  //#region Props
  /**
   * When enabled, the first level of depth will create an accordion-style appearance for nodes.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfAccordionLayout={true}></lf-tree>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfAccordionLayout: boolean = true;
  /**
   * The data set for the LF Tree component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfDataset={treeData}></lf-tree>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * Empty text displayed when there is no data.
   *
   * @type {string}
   * @default "Empty data."
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfEmpty="No data found."></lf-tree>
   * ```
   */
  @Prop({ mutable: true }) lfEmpty: string = "Empty data.";
  /**
   * Identifiers of the nodes that are expanded.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {string[]}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfExpandedNodeIds={['node1', 'node2']}></lf-tree>
   * ```
   */
  @Prop({ mutable: true }) lfExpandedNodeIds?: string[];
  /**
   * When true, displays a text field which enables filtering the dataset of the tree.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfFilter={true}></lf-tree>
   * ```
   */
  @Prop({ mutable: true }) lfFilter: boolean = true;
  /**
   * When true, the tree behaves like a grid, displaying each node's cells across the configured dataset columns.
   * The dataset should provide a `columns` array. Each column id will be looked up inside the node `cells` container; if a matching cell is found its shape/component will be rendered, otherwise a textual fallback (node value / empty) is shown. The first column will still contain the hierarchical expansion affordance and node icon.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfGrid={true} lfDataset={datasetWithColumns}></lf-tree>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfGrid: boolean = false;
  /**
   * The initial depth to which the tree should be expanded upon first render.
   * A value of 0 means all nodes are collapsed, 1 means only the root nodes are expanded, and so on.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {number | undefined}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfInitialExpansionDepth={2}></lf-tree>
   * ```
   */
  @Prop({ mutable: true }) lfInitialExpansionDepth: number;
  /**
   * Identifiers of the nodes that are selected.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {string[]}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfSelectedNodeIds={['node1', 'node2']}></lf-tree>
   * ```
   */
  @Prop({ mutable: true }) lfSelectedNodeIds?: string[];
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfRipple={true}></lf-tree>
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * When true, nodes can be selected.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfSelectable={true}></lf-tree>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfSelectable: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfStyle="#lf-component { background-color: red; }"></lf-tree>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tree lfUiSize="small"></lf-tree>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  //#endregion

  //#region Internal variables
  #adapter: LfTreeAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_TREE_BLOCKS;
  #ids = LF_TREE_IDS;
  #p = LF_TREE_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  _filterValue = "";
  _filterTimeout: ReturnType<typeof setTimeout> | null;
  #expansionState: LfTreeExpansionState;
  #selectionState: LfTreeSelectionState;
  //#endregion

  //#region Watchers
  @Watch("lfDataset")
  protected handleDatasetChange(): void {
    if (!this.#framework || !this.#expansionState || !this.#selectionState) {
      return;
    }

    const previousExpanded = new Set(this.expandedNodes);
    const previousSelectedId = getNodeId(this.selectedNode);

    this.#expansionState.reconcileAfterDatasetChange(previousExpanded);
    this.#selectionState.reconcileAfterDatasetChange(previousSelectedId);

    this.hiddenNodes = new Set<LfDataNode>();
  }

  @Watch("lfExpandedNodeIds")
  protected handleExpandedPropChange(value: string[] | undefined): void {
    if (!this.#expansionState) {
      return;
    }
    this.#expansionState.handlePropChange(value);
  }

  @Watch("lfSelectedNodeIds")
  protected handleSelectedPropChange(value: string[] | undefined): void {
    if (!this.#selectionState) {
      return;
    }
    this.#selectionState.handlePropChange(value);
  }

  @Watch("lfInitialExpansionDepth")
  protected handleInitialDepthChange(): void {
    if (!this.#expansionState) {
      return;
    }
    this.#expansionState.handleInitialDepthChange(new Set(this.expandedNodes));
  }

  @Watch("lfSelectable")
  protected handleSelectableChange(selectable: boolean): void {
    if (!this.#selectionState) {
      return;
    }
    this.#selectionState.handleSelectableChange(!!selectable);
  }

  @Watch("lfFilter")
  protected handleFilterToggle(enabled: boolean): void {
    if (!enabled) {
      this._filterValue = "";
      this.hiddenNodes = new Set<LfDataNode>();
    }
  }
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-tree-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfTreeEventPayload>;
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfTreeEvent,
    args: {
      node?: LfDataNode;
      expandedNodeIds?: string[];
      selectedNodeIds?: string[];
    } = {},
  ): void {
    this.#adapter.dispatcher.emit(eventType, {
      originalEvent: e,
      node: args.node,
      expandedNodeIds:
        args.expandedNodeIds ??
        (this.#expansionState ? this.#expansionState.getIds() : []),
      selectedNodeIds:
        args.selectedNodeIds ??
        (this.#selectionState ? this.#selectionState.getIds() : []),
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Retrieves the debug information reflecting the current state of the component.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves to a LfDebugLifecycleInfo object containing debug information.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfTreePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfTreePropsInterface> {
    const entries = LF_TREE_PROPS.map(
      (
        prop,
      ): [keyof LfTreePropsInterface, LfTreePropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Triggers a re-render of the component to reflect any state changes.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }

  @Method()
  async getExpandedNodeIds(): Promise<string[]> {
    return this.#expansionState ? this.#expansionState.getIds() : [];
  }

  @Method()
  async getSelectedNodeIds(): Promise<string[]> {
    return this.#selectionState ? this.#selectionState.getIds() : [];
  }

  @Method()
  async setExpandedNodes(
    nodes: string | LfDataNode | Array<string | LfDataNode> | null,
  ): Promise<void> {
    if (!this.#expansionState) {
      return;
    }
    if (nodes == null) {
      this.#expansionState.applyIds([], { emit: true, updateProp: true });
      return;
    }
    const targets = normalizeTargetInput(nodes);
    const candidateIds = extractIdCandidates(targets);
    this.#expansionState.applyIds(candidateIds, {
      emit: true,
      updateProp: true,
    });
  }

  @Method()
  async setSelectedNodes(
    nodes: string | LfDataNode | Array<string | LfDataNode> | null,
  ): Promise<void> {
    if (!this.#selectionState) {
      return;
    }
    if (nodes == null) {
      this.#selectionState.applyIds([], { emit: true, updateProp: true });
      return;
    }
    this.#selectionState.applyTargets(nodes, {
      emit: true,
      updateProp: true,
    });
  }

  @Method()
  async selectByPredicate(
    predicate: (node: LfDataNode) => boolean,
  ): Promise<LfDataNode | undefined> {
    if (!this.#framework || !this.lfDataset) {
      return undefined;
    }

    const matchingNode = this.#framework.data.node.find(
      this.lfDataset,
      predicate,
    );

    if (matchingNode) {
      await this.setSelectedNodes(matchingNode);
      return matchingNode;
    }

    // Clear selection if no match found
    await this.setSelectedNodes(null);
    return undefined;
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.#adapter.dispatcher.emit("unmount", {
        expandedNodeIds: this.#expansionState?.getIds() ?? [],
        selectedNodeIds: this.#selectionState?.getIds() ?? [],
      });
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  /**
   * Creates the dispatcher for centralized event emission.
   * All component events route through this dispatcher.
   * @see Section 5.5 of 4_0_0_REFACTORING.md
   */
  #createDispatcher = () => ({
    emit: (eventType: LfTreeEvent, detail?: Partial<LfTreeEventPayload>) => {
      this.#framework.debug?.logs.new(
        this,
        `Event: ${eventType}`,
        "informational",
      );

      this.lfEvent.emit({
        comp: this,
        eventType,
        id: this.rootElement.id,
        originalEvent: detail?.originalEvent,
        node: detail?.node,
        expandedNodeIds:
          detail?.expandedNodeIds ??
          (this.#expansionState ? this.#expansionState.getIds() : []),
        selectedNodeIds:
          detail?.selectedNodeIds ??
          (this.#selectionState ? this.#selectionState.getIds() : []),
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + tree state
   * - controller.set: Simple setters (filter, expansion, selection)
   * - controller.computed: Derived predicates (isExpanded, isSelected, isHidden, isGrid, etc.)
   * - controller.actions: Complex operations (toggleExpansion, setSelection, clearSelection)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    const adapterWithoutDispatcher = createAdapter(
      // Getters - base getters (via utility) + component-specific state reads
      {
        ...createBaseGetters({
          blocks: () => this.#b,
          compInstance: () => this,
          framework: () => this.#framework,
          ids: () => this.#ids,
          parts: () => this.#p,
        }),
        columns: () => this.lfDataset?.columns || [],
        dataset: () => this.lfDataset,
        expandedProp: () => this.lfExpandedNodeIds,
        filterValue: () => this._filterValue,
        initialExpansionDepth: () => this.lfInitialExpansionDepth,
        selectedProp: () => this.lfSelectedNodeIds,
        state: {
          expansion: {
            ids: () =>
              this.#expansionState?.getIds() ?? Array.from(this.expandedNodes),
            nodes: () => this.expandedNodes,
          },
          selection: {
            ids: () => {
              if (this.#selectionState) {
                return this.#selectionState.getIds();
              }
              const nodeId = getNodeId(this.selectedNode);
              return nodeId ? [nodeId] : [];
            },
            node: () => this.selectedNode,
          },
        },
      },
      // Setters - simple single-value assignments
      {
        filter: {
          apply: (value: string) => {
            if (!this.#framework || !this.lfDataset) {
              this.hiddenNodes = new Set<LfDataNode>();
              return;
            }
            if (!value) {
              this.hiddenNodes = new Set<LfDataNode>();
              return;
            }
            const { filter } = this.#framework.data.node;
            const { ancestorNodes, remainingNodes } = filter(
              this.lfDataset,
              { value },
              true,
            );
            const hidden = new Set(remainingNodes);
            if (ancestorNodes) {
              ancestorNodes.forEach((ancestor) => hidden.delete(ancestor));
            }
            this.hiddenNodes = hidden;
          },
          setValue: (value: string) => {
            this._filterValue = value;
          },
        },
        state: {
          expansion: {
            apply: () => {
              const ids = this.#expansionState?.getIds();
              if (ids !== undefined) {
                this.#expansionState?.applyIds(ids, {
                  emit: false,
                  updateProp: true,
                });
              }
            },
            toggle: (node) => this.#expansionState?.toggle(node),
            setNodes: (nodes: Iterable<string>) => {
              this.expandedNodes = new Set(nodes);
            },
            setProp: (ids: string[]) => {
              this.lfExpandedNodeIds = ids;
            },
          },
          selection: {
            apply: () => {
              const ids = this.#selectionState?.getIds();
              if (ids !== undefined) {
                this.#selectionState?.applyIds(ids, {
                  emit: false,
                  updateProp: true,
                });
              }
            },
            set: (node) =>
              this.#selectionState?.applyTargets(node, {
                emit: true,
                updateProp: true,
                node,
              }),
            clear: () => {
              this.#selectionState?.clearSelection({
                emit: true,
                updateProp: true,
              });
            },
            setNode: (node: LfDataNode | null) => {
              this.selectedNode = node ?? null;
            },
            setProp: (ids: string[]) => {
              this.lfSelectedNodeIds = ids;
            },
          },
        },
      },
      // Computed - derived predicates (from dedicated file)
      prepTreeComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepTreeActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  //#endregion

  //#region Lifecycle
  connectedCallback(): void {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }

  async componentWillLoad(): Promise<void> {
    this.#framework = await awaitFramework(this);
    this.#initAdapter();

    this.#expansionState = createExpansionState(() => this.#adapter);
    this.#selectionState = createSelectionState(() => this.#adapter);

    this.#expansionState.initialisePersistentState(this.lfExpandedNodeIds);
    this.#selectionState.initialisePersistentState(this.lfSelectedNodeIds);

    this.#selectionState.handleSelectableChange(this.lfSelectable);
    this.handleDatasetChange();
  }
  componentDidLoad() {
    const { debug } = this.#framework;

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", {
      expandedNodeIds: this.#expansionState?.getIds() ?? [],
      selectedNodeIds: this.#selectionState?.getIds() ?? [],
    });
    debug.info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { debug, effects, theme } = this.#framework;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple) {
      const nodeElements = this.#adapter?.elements.refs.nodeElements;
      if (nodeElements) {
        Object.values(nodeElements).forEach((el) => {
          effects.register.ripple(el);
        });
      }
    }

    debug.info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;
    const { tree } = this.#b;
    const { lfDataset, lfStyle, lfGrid } = this;
    const adapterJsx = this.#adapter?.elements.jsx;

    const isEmpty = !!!lfDataset?.nodes?.length;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(tree._) + (lfGrid ? " tree--grid" : "")}
            part={this.#p.tree}
          >
            {adapterJsx?.filter()}
            {adapterJsx?.header()}
            {isEmpty ? adapterJsx?.empty() : adapterJsx?.nodes()}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    const hasThemeRipple = theme?.get.current().hasEffect("ripple");
    if (effects && hasThemeRipple) {
      const nodeElements = this.#adapter?.elements.refs.nodeElements;
      if (nodeElements) {
        Object.values(nodeElements).forEach((el) => {
          effects.unregister.ripple(el);
        });
      }
    }

    theme?.unregister(this);
  }
  //#endregion
}

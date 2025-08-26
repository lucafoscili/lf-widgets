import {
  LF_STYLE_ID,
  LF_TREE_BLOCKS,
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
  LfTreeEventArguments,
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
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
// Shape & node rendering moved to adapter recursion (Phase 2)
import { createAdapter } from "./lf-tree-adapter";
import type { LfTreeAdapter } from "./lf-tree-adapter";

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
  @State() expandedNodes: Set<LfDataNode> = new Set();
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
   * Sets the initial expanded nodes based on the specified depth.
   * If the property is not provided, all nodes in the tree will be expanded.
   *
   * @type {number}
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
  #framework: LfFrameworkInterface;
  #b = LF_TREE_BLOCKS;
  #p = LF_TREE_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  _filterTimeout: ReturnType<typeof setTimeout>;
  _filterValue = ""; // moved from private to public-ish for adapter access
  #adapter: LfTreeAdapter; // Phase 1 adapter scaffold
  // Adapter bridges (temporary) - to be removed in later phases when logic moves fully out
  _treeBlocks = () => this.#b; // still used by adapter until promotion
  _treeParts = () => this.#p;
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
    args?: LfTreeEventArguments,
  ) {
    const { effects } = this.#framework;
    const { node } = args || {};
    if (eventType === "pointerdown" && node && this.lfRipple) {
      const rippleEl = this.#adapter?.elements.refs.rippleSurfaces[node.id];
      if (rippleEl) {
        effects.ripple(e as PointerEvent, rippleEl);
      }
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      node,
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
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  // Tree traversal & filtering logic moved to adapter (Phase 2)
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);
    // Initialize adapter (Phase 1)
    this.#adapter = createAdapter(
      {
        compInstance: this,
        manager: this.#framework,
        blocks: this.#b,
        parts: this.#p,
      },
      () => this.#adapter,
    );
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { debug } = this.#framework;

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
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

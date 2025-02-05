import { getLfCore } from "../../index";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_STYLE_ID,
  LF_TREE_BLOCKS,
  LF_TREE_PARTS,
  LF_TREE_PROPS,
  LF_WRAPPER_ID,
  LfCoreInterface,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfTextfieldEventPayload,
  LfThemeUISize,
  LfTreeElement,
  LfTreeEvent,
  LfTreeEventArguments,
  LfTreeEventPayload,
  LfTreeInterface,
  LfTreeNodeProps,
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
  VNode,
} from "@stencil/core";
import { TreeNode } from "./components.node";

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
  #core: LfCoreInterface;
  #b = LF_TREE_BLOCKS;
  #p = LF_TREE_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #r: { [id: string]: HTMLElement } = {};
  #filterTimeout: ReturnType<typeof setTimeout>;
  #filterValue = "";
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
    const { effects } = this.#core;

    const { expansion, node } = args || {};

    switch (eventType) {
      case "click":
        if (expansion && node.children?.length) {
          if (this.expandedNodes.has(node)) {
            this.expandedNodes.delete(node);
          } else {
            this.expandedNodes.add(node);
          }
          this.expandedNodes = new Set(this.expandedNodes);
        } else if (node) {
          this.selectedNode = node;
        }
        break;
      case "pointerdown":
        if (this.lfRipple) {
          effects.ripple(e as PointerEvent, this.#r[node.id]);
        }
        break;
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
  #filter(e: CustomEvent<LfTextfieldEventPayload>) {
    const { filter } = this.#core.data.node;

    clearTimeout(this.#filterTimeout);
    this.#filterTimeout = setTimeout(() => {
      this.#filterValue = e.detail.inputValue?.toLowerCase();

      if (!this.#filterValue) {
        this.hiddenNodes = new Set();
      } else {
        const { ancestorNodes, remainingNodes } = filter(
          this.lfDataset,
          { value: this.#filterValue },
          true,
        );

        this.hiddenNodes = new Set(remainingNodes);

        if (ancestorNodes) {
          ancestorNodes.forEach((ancestor) => {
            this.hiddenNodes.delete(ancestor);
          });
        }
      }
    }, 300);
  }
  #prepTree(): VNode[] {
    const { bemClass } = this.#core.theme;

    const { noMatches } = this.#b;
    const elements: VNode[] = [];

    const nodes = this.lfDataset.nodes;
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      this.#recursive(elements, node, 0);
    }

    return elements.length
      ? elements
      : this.#filterValue && (
          <div class={bemClass(noMatches._)}>
            <div class={bemClass(noMatches._, noMatches.icon)}></div>
            <div class={bemClass(noMatches._, noMatches.text)}>
              No matches found for "
              <strong class={bemClass(noMatches._, noMatches.filter)}>
                {this.#filterValue}
              </strong>
              ".
            </div>
          </div>
        );
  }
  #recursive(elements: VNode[], node: LfDataNode, depth: number) {
    const { stringify } = this.#core.data.cell;

    if (!this.debugInfo.endTime) {
      if (
        this.lfInitialExpansionDepth === null ||
        this.lfInitialExpansionDepth === undefined ||
        this.lfInitialExpansionDepth > depth
      ) {
        this.expandedNodes.add(node);
      }
    }
    const isExpanded = this.#filterValue ? true : this.expandedNodes.has(node);
    const isHidden = this.hiddenNodes.has(node);
    const isSelected = this.selectedNode === node;
    const nodeProps: LfTreeNodeProps = {
      accordionLayout: this.lfAccordionLayout && depth === 0,
      depth,
      elements: {
        ripple: (
          <div
            data-cy={CY_ATTRIBUTES.rippleSurface}
            data-lf={LF_ATTRIBUTES.rippleSurface}
            ref={(el) => {
              if (el && this.lfRipple) {
                this.#r[node.id] = el;
              }
            }}
          ></div>
        ),
        value: <div class="node__value">{stringify(node.value)}</div>,
      },
      events: {
        onClick: (e) => {
          this.onLfEvent(e, "click", { node });
        },
        onClickExpand: (e) => {
          this.onLfEvent(e, "click", { expansion: true, node });
        },
        onPointerDown: (e) => {
          this.onLfEvent(e, "pointerdown", { node });
        },
      },
      expanded: isExpanded,
      manager: this.#core,
      node,
      selected: isSelected,
    };

    if (!isHidden) {
      elements.push(<TreeNode {...nodeProps}></TreeNode>);
      if (isExpanded) {
        node.children?.map((child) =>
          this.#recursive(elements, child, depth + 1),
        );
      }
    }
  }
  #setExpansion(node: LfDataNode) {
    if (this.expandedNodes.has(node)) {
      this.expandedNodes.delete(node);
    } else {
      this.expandedNodes.add(node);
    }

    if (node.children?.length) {
      node.children.forEach((child) => {
        this.#setExpansion(child);
      });
    }
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#core) {
      this.#core = getLfCore();
      this.debugInfo = this.#core.debug.info.create();
    }
    this.#core.theme.register(this);
  }
  componentDidLoad() {
    const { info } = this.#core.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#core.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { debug } = this.#core;

    debug.info.update(this, "did-render");
  }
  render() {
    const { bemClass, get, setLfStyle } = this.#core.theme;

    const { emptyData, tree } = this.#b;
    const { lfDataset, lfEmpty, lfFilter, lfStyle } = this;

    const isEmpty = !!!lfDataset?.nodes?.length;
    this.#r = {};

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div class={bemClass(tree._)} part={this.#p.tree}>
            {lfFilter && (
              <lf-textfield
                class={bemClass(tree._, tree.filter)}
                lfStretchX={true}
                lfIcon={get.current().variables["--lf-icon-search"]}
                lfLabel={"Search..."}
                lfStyling="flat"
                onLf-textfield-event={(e) => {
                  this.onLfEvent(e, "lf-event");
                  if (e.detail.eventType === "input") {
                    this.#filter(e);
                  }
                }}
              ></lf-textfield>
            )}
            {isEmpty ? (
              <div class={bemClass(emptyData._)} part={this.#p.emptyData}>
                <div class={bemClass(emptyData._, emptyData.text)}>
                  {lfEmpty}
                </div>
              </div>
            ) : (
              this.#prepTree()
            )}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#core;

    theme.unregister(this);
  }
  //#endregion
}

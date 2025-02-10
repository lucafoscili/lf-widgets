import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CHIP_BLOCKS,
  LF_CHIP_CSS_VARS,
  LF_CHIP_PARTS,
  LF_CHIP_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChipElement,
  LfChipEvent,
  LfChipEventArguments,
  LfChipEventPayload,
  LfChipInterface,
  LfChipPropsInterface,
  LfChipStyling,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
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
import { awaitFramework } from "../../utils/setup";

/**
 * The chip component is a stylized UI element that displays a list of data items.
 * Users can select or deselect items, and expand or collapse content sections.
 * The component supports various styling options, including choice, input, filter,
 * and standard. Ripple effects can be enabled or disabled via a property.
 *
 * @component
 * @tag lf-chip
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable, reusable
 * UI element with expandable/collapsible sections. The chip component is designed
 * to display a list of data items, allowing users to select or deselect items, and
 * expand or collapse content sections.
 *
 * @example
 * <lf-chip
 *  lfDataset={{
 *   nodes: [
 *   { id: "1", value: "Item 1", description: "Description 1" },
 *   { id: "2", value: "Item 2", description: "Description 2" }
 *  ]
 * }}
 * lfRipple={true}
 * ></lf-chip>
 *
 * @fires {CustomEvent} lf-chip-event - Emitted for various component events
 */
@Component({
  tag: "lf-chip",
  styleUrl: "lf-chip.scss",
  shadow: true,
})
export class LfChip implements LfChipInterface {
  /**
   * References the root HTML element of the component (<lf-chip>).
   */
  @Element() rootElement: LfChipElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() expandedNodes: Set<LfDataNode> = new Set();
  @State() hiddenNodes: Set<LfDataNode> = new Set();
  @State() selectedNodes: Set<LfDataNode> = new Set();
  //#endregion

  //#region Props
  /**
   * The data set for the LF Chip component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chip lfDataset={dataset}></lf-chip>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chip lfRipple={true}></lf-chip>
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chip lfStyle="#lf-component { color: red; }"></lf-chip>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Styling of the chip component, includes: "choice", "input", "filter" and "standard".
   *
   * @type {LfChipStyling}
   * @default "standard"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chip lfStyling="choice"></lf-chip>
   * ```
   */
  @Prop({ mutable: true }) lfStyling: LfChipStyling = "standard";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chip lfUiSize="small"></lf-chip>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Reflects the specified state color defined by the theme.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chip lfUiState="success"></lf-chip>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial state of the chip.
   * Relevant only when the chip can be selected.
   *
   * @type {string[]}
   * @default null
   *
   * @example
   * ```tsx
   * <lf-chip lfValue={["node1", "node2"]}></lf-chip>
   * ```
   */
  @Prop({ mutable: false }) lfValue: string[] = null;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_CHIP_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_CHIP_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #r: { [id: string]: HTMLElement } = {};
  #nodeItems: VNode[] = [];
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-chip-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfChipEventPayload>;
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfChipEvent,
    args?: LfChipEventArguments,
  ) {
    const { effects } = this.#framework;

    const { expandedNodes, lfDataset, lfRipple, selectedNodes } = this;

    const { expansion, node } = args || {};

    switch (eventType) {
      case "click":
        if (expansion && this.#hasChildren(node)) {
          if (expandedNodes.has(node)) {
            expandedNodes.delete(node);
          } else {
            expandedNodes.add(node);
          }
          this.expandedNodes = new Set(expandedNodes);
        } else if (node) {
          if (selectedNodes.has(node)) {
            selectedNodes.delete(node);
          } else {
            selectedNodes.add(node);
          }
          this.selectedNodes = new Set(selectedNodes);
        }
        break;
      case "delete":
        const nodeIndex = lfDataset?.nodes?.indexOf(node);
        if (nodeIndex > -1) {
          lfDataset.nodes.splice(nodeIndex, 1);
        }
        break;
      case "pointerdown":
        if (lfRipple && this.#isClickable()) {
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
      selectedNodes: this.selectedNodes,
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Fetches debug information of the component's current state.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves with the debug information object.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfChipPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfChipPropsInterface> {
    const entries = LF_CHIP_PROPS.map(
      (
        prop,
      ): [keyof LfChipPropsInterface, LfChipPropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the selected nodes.
   * @returns {Promise<LfDataNode[]>} Selected nodes.
   */
  @Method()
  async getSelectedNodes(): Promise<Set<LfDataNode>> {
    return this.selectedNodes;
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Selects one or more nodes in the chip component.
   * @param {LfDataNode[] | string[]} nodes - An array of LfDataNode objects or node IDs to be selected.
   * @returns {Promise<void>}
   */
  @Method()
  async setSelectedNodes(
    nodes: (LfDataNode[] | string[]) & Array<any>,
  ): Promise<void> {
    const nodesToAdd: Set<LfDataNode> = new Set();

    const isStringArray =
      Array.isArray(nodes) && nodes.every((item) => typeof item === "string");

    this.lfDataset?.nodes?.forEach((n: LfDataNode) => {
      if (isStringArray) {
        if (typeof n.id === "string" && nodes.includes(n.id)) {
          nodesToAdd.add(n);
        }
      } else {
        if (nodes.includes(n)) {
          nodesToAdd.add(n);
        }
      }
    });
    this.selectedNodes = nodesToAdd;
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
  #hasChildren(node: LfDataNode) {
    return !!(node.children && node.children.length);
  }
  #hasIconOnly(node: LfDataNode) {
    return !!(node.icon && !node.value);
  }
  #isChoice() {
    return this.lfStyling === "choice";
  }
  #isClickable() {
    return this.lfStyling === "choice" || this.lfStyling === "filter";
  }
  #isExpanded(node: LfDataNode) {
    return this.expandedNodes.has(node);
  }
  #isFilter() {
    return this.lfStyling === "filter";
  }
  #isInput() {
    return this.lfStyling === "input";
  }
  #isSelected(node: LfDataNode) {
    return this.selectedNodes.has(node);
  }
  #prepDeleteIcon(node: LfDataNode) {
    const { bemClass } = this.#framework.theme;

    const { item } = this.#b;

    return (
      <div
        class={bemClass(item._, item.icon, {
          "has-actions": true,
          trailing: true,
        })}
        data-cy={this.#cy.button}
        data-lf={this.#lf.icon}
        key={node.id + "_delete"}
        onClick={(e) => {
          this.onLfEvent(e, "delete", { node });
        }}
      ></div>
    );
  }
  #prepIcons(node: LfDataNode) {
    const { get } = this.#framework.assets;
    const { bemClass } = this.#framework.theme;

    const { item } = this.#b;
    const icons: VNode[] = [];

    if (node.icon) {
      const { style } = get(`./assets/svg/${node.icon}.svg`);
      icons.push(
        <div
          class={bemClass(item._, item.icon, {
            leading: true,
            hidden: this.lfStyling === "filter" && this.#isSelected(node),
          })}
          data-cy={this.#cy.maskedSvg}
          style={style}
        ></div>,
      );
    }

    if (this.#isFilter()) {
      icons.push(
        <span class={bemClass(item._, item.checkmark)}>
          <svg
            class={bemClass(item._, item.checkmarkSvg)}
            viewBox="-2 -3 30 30"
          >
            <path
              class={bemClass(item._, item.checkmarkPath)}
              d="M1.73,12.91 8.1,19.28 22.79,4.59"
              fill="none"
              stroke="currentColor"
            />
          </svg>
        </span>,
      );
    }

    return icons;
  }
  #prepItem(node: LfDataNode, i: number) {
    const { bemClass } = this.#framework.theme;

    const { item } = this.#b;

    return (
      <div
        class={bemClass(item._, null, {
          "no-label": this.#hasIconOnly(node),
          selected: this.#isSelected(node),
        })}
        data-cy={this.#cy.node}
        data-lf={this.#lf[this.lfUiState]}
        data-value={node.id}
        onClick={(e) => {
          this.onLfEvent(e, "click", { node });
        }}
        part={this.#p.item}
        role="row"
        title={node.description ?? ""}
      >
        {this.#prepRipple(node)}
        <span class={bemClass(item._, item.indent)}></span>
        {this.#prepIcons(node)}
        <span
          class={bemClass(item._, item.primaryAction)}
          data-cy={this.#cy.input}
          onBlur={(e) => {
            this.onLfEvent(e, "blur", { node });
          }}
          onFocus={(e) => {
            this.onLfEvent(e, "focus", { node });
          }}
          role="button"
          tabindex={i}
        >
          <span class={bemClass(item._, item.text)}>{node.value}</span>
        </span>
        {this.#isInput() && this.#prepDeleteIcon(node)}
      </div>
    );
  }
  #prepItemSet() {
    const { bemClass } = this.#framework.theme;

    const { chip } = this.#b;
    const elements: VNode[] = [];

    const nodeCount = this.lfDataset?.nodes?.length;
    for (let i = 0; nodeCount && i < nodeCount; i++) {
      this.#nodeItems = [];
      const node = this.lfDataset.nodes[i];
      this.#prepNode(node, 0);
      elements.push(
        <div class={bemClass(chip._, chip.node)}>{this.#nodeItems}</div>,
      );
    }

    return elements;
  }
  #prepNode(node: LfDataNode, indent: number) {
    const { bemClass } = this.#framework.theme;

    const { wrapper } = this.#b;
    const hasChildren = this.#hasChildren(node);
    const isExpanded = this.#isExpanded(node);
    const indentStyle = {
      [LF_CHIP_CSS_VARS.indentOffset]: indent.toString(),
    };
    const className = bemClass(wrapper._, wrapper.node, {
      expanded: isExpanded,
      hidden: Boolean(!hasChildren && indent),
    });

    this.#nodeItems.push(
      <div
        class={bemClass(wrapper._, null, {
          hidden: this.#hasChildren(node) && !this.#showChildren(node),
        })}
      >
        <div
          class={bemClass(wrapper._, wrapper.indent)}
          part={this.#p.indent}
          style={indentStyle}
        ></div>
        {hasChildren ? (
          <div
            class={className}
            onClick={(e) => {
              this.onLfEvent(e, "click", {
                expansion: true,
                node,
              });
            }}
          ></div>
        ) : indent ? (
          <div class={className}></div>
        ) : null}
        {this.#prepItem(node, indent)}
      </div>,
    );

    if (this.#showChildren(node)) {
      for (let index = 0; index < node.children.length; index++) {
        if (node.children[index]) {
          this.#prepNode(node.children[index], indent + 1);
        }
      }
    }
  }
  #prepRipple(node: LfDataNode) {
    if (this.lfRipple && this.#isClickable()) {
      return (
        <div
          data-cy={this.#cy.rippleSurface}
          data-lf={this.#lf.rippleSurface}
          onPointerDown={(e) => this.onLfEvent(e, "pointerdown", { node })}
          ref={(el) => {
            if (el && this.lfRipple) {
              this.#r[node.id] = el;
            }
          }}
        ></div>
      );
    }
  }
  #showChildren(node: LfDataNode) {
    return this.expandedNodes.has(node);
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);

    if (this.lfValue?.length) {
      this.setSelectedNodes(this.lfValue);
    }
  }
  componentDidLoad() {
    const { debug } = this.#framework;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    debug.info.update(this, "did-load");
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

    const { lfStyle } = this;

    this.#nodeItems = [];

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(this.#b.chip._, null, {
              choice: this.#isChoice(),
              filter: this.#isFilter(),
              input: this.#isInput(),
            })}
            part={this.#p.chip}
            role="grid"
          >
            {this.#prepItemSet()}
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

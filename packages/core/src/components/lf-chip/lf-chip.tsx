import {
  LF_CHIP_BLOCKS,
  LF_CHIP_CSS_VARS,
  LF_CHIP_IDS,
  LF_CHIP_PARTS,
  LF_CHIP_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChipAdapter,
  LfChipElement,
  LfChipEvent,
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
import { createBaseGetters } from "../../utils/adapter";
import { FIcon } from "../../utils/icon";
import { awaitFramework } from "../../utils/setup";
import { prepChipActions } from "./actions.chip";
import { prepChipComputed } from "./computed.chip";
import { ChipFC } from "./fc";
import { createAdapter } from "./lf-chip-adapter";

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
   * Explicit accessible label applied to each chip item when it would otherwise lack a text label.
   * Fallback chain per item: node.value -> lfAriaLabel -> node.icon -> component id -> 'chip item'.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * <lf-chip lfAriaLabel="Enable feature"></lf-chip>
   */
  @Prop({ mutable: true }) lfAriaLabel: string = "";
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
   * When set to true, renders the chip without distinctive badge styling for use in dense contexts like toolbars.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chip lfFlat={true}></lf-chip>
   * ```
   */
  @Prop({ mutable: true }) lfFlat: boolean = false;
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
   * When set to true, displays a spinner animation in place of the icon/image for loading states.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chip lfShowSpinner={true}></lf-chip>
   * ```
   */
  @Prop({ mutable: true }) lfShowSpinner: boolean = false;
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
  #adapter: LfChipAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_CHIP_BLOCKS;
  #ids = LF_CHIP_IDS;
  #p = LF_CHIP_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
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
      this.#adapter.dispatcher.emit("unmount", {
        node: null,
        selectedNodes: this.selectedNodes,
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
    emit: (eventType: LfChipEvent, detail?: Partial<LfChipEventPayload>) => {
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
        node: detail?.node ?? null,
        selectedNodes: this.selectedNodes,
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + styling
   * - controller.set: Simple setters (empty for chip)
   * - controller.computed: Derived predicates (isChoice, isFilter, isInput, isSelected, etc.)
   * - controller.actions: Complex operations (toggleExpansion, toggleSelection, deleteNode)
   * - elements: Refs registry
   * - dispatcher: Centralized event emission
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
        styling: () => this.#normalizedStyling(),
      },
      // Setters - simple single-value assignments (none for chip)
      {},
      // Computed - derived predicates (from dedicated file)
      prepChipComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepChipActions(getAdapter),
      // JSX - rendering done inline in component, but type requires jsx property
      { chip: () => this.#prepItemSet() },
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #normalizedStyling(): LfChipStyling {
    return this.lfStyling
      ? (this.lfStyling.toLowerCase() as LfChipStyling)
      : "standard";
  }
  #prepDeleteIcon(node: LfDataNode) {
    const { bemClass, get } = this.#framework.theme;
    const { controller, dispatcher } = this.#adapter;
    const { actions } = controller;

    const { item } = this.#b;
    const icon = get.icon("squareX");

    return (
      <FIcon
        framework={this.#framework}
        icon={icon}
        wrapperClass={bemClass(item._, item.icon, {
          "has-actions": true,
          trailing: true,
        })}
        onClick={(e) => {
          e.stopPropagation();
          actions.deleteNode(node);
          dispatcher.emit("delete", { originalEvent: e, node });
        }}
      />
    );
  }
  #prepIcons(node: LfDataNode) {
    const { bemClass } = this.#framework.theme;
    const { computed } = this.#adapter.controller;
    const { isFilter, isSelected } = computed;

    const { item } = this.#b;
    const icons: VNode[] = [];

    const hasIcon = Boolean(node.icon);

    if (this.lfShowSpinner && !hasIcon) {
      icons.push(
        <div class={bemClass(item._, item.spinnerContainer)}>
          <div class={bemClass(item._, item.spinner)}></div>
        </div>,
      );
    }

    if (hasIcon) {
      icons.push(
        <FIcon
          framework={this.#framework}
          icon={node.icon}
          wrapperClass={bemClass(item._, item.icon, {
            leading: true,
            hidden: isFilter() && isSelected(node),
          })}
        />,
      );
    }

    if (isFilter()) {
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
    const { theme } = this.#framework;
    const { bemClass } = theme;
    const { controller, dispatcher, elements } = this.#adapter;
    const { cyAttributes, lfAttributes } = controller.get;
    const { hasIconOnly, isInput, isSelected } = controller.computed;
    const { toggleSelection } = controller.actions;

    const cy = cyAttributes();
    const lf = lfAttributes();
    const { item } = this.#b;
    const { refs } = elements;

    return (
      <div
        class={bemClass(item._, null, {
          "no-label": hasIconOnly(node),
          selected: isSelected(node),
        })}
        data-cy={cy.node}
        data-lf={lf[this.lfUiState]}
        data-value={node.id}
        onClick={(e) => {
          if (e.button !== 0) {
            return;
          }
          toggleSelection(node);
          dispatcher.emit("click", { originalEvent: e, node });
        }}
        part={this.#p.item}
        role="row"
        title={node.description ?? ""}
        ref={(el) => {
          if (el) {
            refs.items.set(String(node.id), el);
          }
        }}
      >
        <span class={bemClass(item._, item.indent)}></span>
        {this.#prepIcons(node)}
        <span
          class={bemClass(item._, item.primaryAction)}
          data-cy={cy.input}
          onBlur={(e) => {
            dispatcher.emit("blur", { originalEvent: e, node });
          }}
          onFocus={(e) => {
            dispatcher.emit("focus", { originalEvent: e, node });
          }}
          role="button"
          tabindex={i}
          aria-label={(
            (hasIconOnly(node) ? this.lfAriaLabel : "") ||
            (typeof node.value === "string" ? node.value : "") ||
            node.icon ||
            this.rootElement.id ||
            "chip item"
          )
            .toString()
            .trim()}
        >
          <span class={bemClass(item._, item.text)}>{node.value}</span>
        </span>
        {isInput() && this.#prepDeleteIcon(node)}
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
    const { controller, dispatcher } = this.#adapter;
    const { hasChildren, isExpanded, showChildren } = controller.computed;
    const { toggleExpansion } = controller.actions;

    const { wrapper } = this.#b;
    const nodeHasChildren = hasChildren(node);
    const nodeIsExpanded = isExpanded(node);
    const indentStyle = {
      [LF_CHIP_CSS_VARS.indentOffset]: indent.toString(),
    };
    const className = bemClass(wrapper._, wrapper.node, {
      expanded: nodeIsExpanded,
      hidden: Boolean(!nodeHasChildren && indent),
    });

    this.#nodeItems.push(
      <div
        class={bemClass(wrapper._, null, {
          hidden: hasChildren(node) && !showChildren(node),
        })}
      >
        <div
          class={bemClass(wrapper._, wrapper.indent)}
          part={this.#p.indent}
          style={indentStyle}
        ></div>
        {nodeHasChildren ? (
          <FIcon
            framework={this.#framework}
            icon={this.#framework.theme.get.icon(
              nodeIsExpanded ? "chevronDown" : "chevronRight",
            )}
            wrapperClass={className}
            onClick={(e) => {
              toggleExpansion(node);
              dispatcher.emit("click", { originalEvent: e, node });
            }}
          />
        ) : indent ? (
          <div class={className}></div>
        ) : null}
        {this.#prepItem(node, indent)}
      </div>,
    );

    if (showChildren(node)) {
      for (let index = 0; index < node.children.length; index++) {
        if (node.children[index]) {
          this.#prepNode(node.children[index], indent + 1);
        }
      }
    }
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
    this.#initAdapter();

    if (this.lfValue?.length) {
      this.setSelectedNodes(this.lfValue);
    }
  }
  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;
    const { computed, refs } = this.#adapter.controller.computed
      ? {
          computed: this.#adapter.controller.computed,
          refs: this.#adapter.elements.refs,
        }
      : { computed: null, refs: null };

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple && computed?.isClickable()) {
      refs?.items.forEach((el) => {
        if (el) {
          effects.register.ripple(el);
        }
      });
    }

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", {
      node: null,
      selectedNodes: this.selectedNodes,
    });
    debug.info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");

    const root = this.lfDataset?.nodes?.[0];
    if (
      root &&
      root.id === "tool-exec-root" &&
      Array.isArray(root.children) &&
      root.children.length > 0 &&
      this.expandedNodes.size === 0
    ) {
      const expanded = new Set(this.expandedNodes);
      expanded.add(root);
      this.expandedNodes = expanded;
    }
  }
  componentDidRender() {
    const { debug } = this.#framework;

    debug.info.update(this, "did-render");
  }
  render() {
    const { setLfStyle } = this.#framework.theme;

    const { lfStyle } = this;

    this.#nodeItems = [];

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <ChipFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    const hasThemeRipple = theme?.get.current().hasEffect("ripple");
    if (this.#adapter && effects && this.lfRipple && hasThemeRipple) {
      const { computed, refs } = {
        computed: this.#adapter.controller.computed,
        refs: this.#adapter.elements.refs,
      };
      if (computed?.isClickable()) {
        refs?.items.forEach((el) => {
          if (el) {
            effects.unregister.ripple(el);
          }
        });
      }
    }

    theme?.unregister(this);
  }
  //#endregion
}

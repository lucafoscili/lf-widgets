import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_LIST_BLOCKS,
  LF_LIST_PARTS,
  LF_LIST_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfListAdapter,
  LfListElement,
  LfListEvent,
  LfListEventPayload,
  LfListInterface,
  LfListPropsInterface,
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
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import { createAdapter } from "./lf-list-adapter";

/**
 * The list component displays a collection of items in a vertical list layout.
 * The list supports various customization options, including item selection, deletion, and navigation.
 *
 * @component
 * @tag lf-list
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying items in a vertical list layout.
 *
 * @example
 * <lf-list
 * lfDataset={dataset}
 * lfEmpty="No data found."
 * lfEnableDeletions={true}
 * ></lf-list>
 *
 * @fires {CustomEvent} lf-list-event - Emitted for various component events
 */
@Component({
  tag: "lf-list",
  styleUrl: "lf-list.scss",
  shadow: true,
})
export class LfList implements LfListInterface {
  /**
   * References the root HTML element of the component (<lf-list>).
   */
  @Element() rootElement: LfListElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() filter: string;
  @State() focused: number;
  @State() selected: number;
  //#endregion

  //#region Props
  /**
   * The data set for the LF List component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-list lfDataset={dataset}></lf-list>
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
   * <lf-list lfEmpty="No data found."></lf-list>
   * ```
   */
  @Prop({ mutable: true }) lfEmpty: string = "Empty data.";
  /**
   * Defines whether items can be removed from the list or not.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-list lfEnableDeletions={true}></lf-list>
   * ```
   */
  @Prop({ mutable: true }) lfEnableDeletions: boolean = false;
  /**
   * When true, displays a filter text field above the list items for searching.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-list lfFilter={true}></lf-list>
   * ```
   */
  @Prop({ mutable: true }) lfFilter: boolean = false;
  /**
   * When true, enables items' navigation through arrow keys.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-list lfNavigation={true}></lf-list>
   * ```
   */
  @Prop({ mutable: true }) lfNavigation: boolean = true;
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-list lfRipple={true}></lf-list>
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * Defines whether items are selectable or not.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-list lfSelectable={true}></lf-list>
   * ```
   */
  @Prop({ mutable: true }) lfSelectable: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-list lfStyle="background: blue;"></lf-list>
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
   * <lf-list lfUiSize="small"></lf-list>
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
   * <lf-list lfUiState="success"></lf-list>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial state of the list.
   * Relevant only when the list can be selected.
   *
   * @type {number}
   * @default null
   *
   * @example
   * ```tsx
   * <lf-list lfValue={0}></lf-list>
   * ```
   */
  @Prop({ mutable: false }) lfValue: number = null;
  //#endregion

  //#region Internal variables
  #adapter: LfListAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_LIST_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_LIST_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #filterTimeout: ReturnType<typeof setTimeout> | null = null;
  #hiddenNodes: Set<LfDataNode> = new Set();
  #listItems: HTMLLIElement[] = [];
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-list-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfListEventPayload>;
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfListEvent,
    node?: LfDataNode,
    index = 0,
  ) {
    const { effects } = this.#framework;
    const { ripples } = this.#adapter.elements.refs;

    switch (eventType) {
      case "blur":
        this.focused = null;
        break;
      case "click":
        this.focused = index;
        const originalIndex = this.#getOriginalIndexFromVisibleIndex(index);
        this.#handleSelection(originalIndex);
        break;
      case "delete":
        if (index > -1) {
          this.lfDataset.nodes.splice(index, 1);
          this.refresh();
        }
        break;
      case "focus":
        this.focused = index;
        break;
      case "pointerdown":
        if (node?.id && this.lfRipple) {
          effects.ripple(e as PointerEvent, ripples.get(node.id));
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

  //#region Watchers
  @Watch("lfFilter")
  protected handleFilterToggle(enabled: boolean): void {
    if (!enabled) {
      if (this.#filterTimeout) {
        clearTimeout(this.#filterTimeout);
        this.#filterTimeout = null;
      }
      this.filter = "";
      this.#hiddenNodes = new Set();
    }
  }
  //#endregion

  //#region Listeners
  @Listen("keydown")
  listenKeydown(e: KeyboardEvent) {
    const { focused, lfNavigation } = this;

    if (lfNavigation) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          this.focusNext();
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          this.focusPrevious();
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          this.#handleSelection(focused);
          break;
      }
    }
  }
  //#endregion

  //#region Public methods
  /**
   * Applies a filter value immediately (for testing compatibility).
   * @param value - The filter string value
   */
  @Method()
  async applyFilter(value: string): Promise<void> {
    this.#applyFilter(value);
  }
  /**
   * Moves focus to the next item in the list.
   * If no item is currently focused, focuses the selected item.
   * If the last item is focused, wraps around to the first item.
   * @returns A promise that resolves when the focus operation is complete
   */
  @Method()
  async focusNext(): Promise<void> {
    const visibleNodes = this.#getVisibleNodes();

    if (this.#isFocusedUninitialized()) {
      this.focused = this.#getInitialFocusedIndex(visibleNodes);
    } else {
      this.focused++;
    }

    if (this.focused > visibleNodes.length - 1) {
      this.focused = 0;
    }

    this.#focusElementByIndex(this.focused);
  }
  /**
   * Focuses the previous item in the list.
   * If no item is currently focused, it focuses the selected item.
   * If focused item is the first one, it wraps around to the last item.
   * @returns Promise that resolves when the focus operation is complete
   */
  @Method()
  async focusPrevious(): Promise<void> {
    const visibleNodes = this.#getVisibleNodes();

    if (this.#isFocusedUninitialized()) {
      this.focused = this.#getInitialFocusedIndex(
        visibleNodes,
        visibleNodes.length - 1,
      );
    } else {
      this.focused--;
    }

    if (this.focused < 0) {
      this.focused = visibleNodes.length - 1;
    }

    this.#focusElementByIndex(this.focused);
  }
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
   * @returns {Promise<LfListPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfListPropsInterface> {
    const entries = LF_LIST_PROPS.map(
      (
        prop,
      ): [keyof LfListPropsInterface, LfListPropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Retrieves the currently selected node from the list.
   * @returns A Promise that resolves to the selected LfDataNode object.
   */
  @Method()
  async getSelected(): Promise<LfDataNode> {
    return this.lfDataset.nodes[this.selected];
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Selects a node in the list at the specified index.
   * If no index is provided, selects the currently focused node.
   *
   * @param {number} [index] - The index of the node to select. If omitted, uses the focused index.
   * @returns {Promise<void>} A promise that resolves when the selection is complete.
   */
  @Method()
  async selectNode(index?: number): Promise<void> {
    if (index === undefined) {
      index = this.focused;
    }
    this.#handleSelection(index);
  }
  /**
   * Selects a node in the list by its ID.
   * @param id - The ID of the node to select
   */
  @Method()
  async selectNodeById(id: string): Promise<void> {
    if (!this.lfDataset?.nodes) {
      return;
    }
    const index = this.lfDataset.nodes.findIndex((node) => node.id === id);
    this.#handleSelection(index);
  }
  /**
   * Sets the filter value and updates the filter input field.
   * @param value - The filter string value
   */
  @Method()
  async setFilter(value: string): Promise<void> {
    const { refs } = this.#adapter.elements;

    this.#applyFilter(value);
    await refs.filter.setValue(value);
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
  #applyFilter(value: string) {
    this.filter = value;
    this.#hiddenNodes = new Set();

    const nodes = this.lfDataset?.nodes || [];

    if (value.trim() && nodes) {
      for (const node of nodes) {
        const nodeText = this.#getNodeText(node);
        if (!nodeText.toLowerCase().includes(value.toLowerCase())) {
          this.#hiddenNodes.add(node);
        }
      }
    }
  }
  #debounceFilter(value: string): void {
    if (this.#filterTimeout) {
      clearTimeout(this.#filterTimeout);
    }

    this.#filterTimeout = setTimeout(() => this.#applyFilter(value), 300);
  }
  #getNodeText(node: LfDataNode): string {
    const { stringify } = this.#framework.data.cell;
    return `${stringify(node.value)} ${stringify(node.description)}`.trim();
  }
  #getOriginalIndexFromVisibleIndex(visibleIndex: number): number {
    const visibleNodes = this.#getVisibleNodes();
    const node = visibleNodes[visibleIndex];
    return node
      ? (this.lfDataset?.nodes?.findIndex((n) => n.id === node.id) ?? -1)
      : -1;
  }
  #handleSelection(index: number): void {
    if (
      this.lfSelectable &&
      index !== null &&
      index !== undefined &&
      !isNaN(index)
    ) {
      this.selected = index;
    }
  }
  #focusElementByIndex(index: number): void {
    const nodeElement = this.rootElement.shadowRoot?.querySelector(
      `[data-index="${index}"]`,
    ) as HTMLElement;
    if (nodeElement) {
      nodeElement.focus();
    }
  }
  #getInitialFocusedIndex(
    visibleNodes: LfDataNode[],
    defaultIndex: number = 0,
  ): number {
    if (this.selected !== null && this.selected !== undefined) {
      const selectedNode = this.lfDataset?.nodes?.[this.selected];
      if (selectedNode && !this.#hiddenNodes.has(selectedNode)) {
        return visibleNodes.findIndex((node) => node.id === selectedNode.id);
      }
    }
    return defaultIndex;
  }
  #getVisibleNodes(): LfDataNode[] {
    return (
      this.lfDataset?.nodes?.filter((node) => !this.#hiddenNodes.has(node)) ||
      []
    );
  }
  #isFocusedUninitialized(): boolean {
    return (
      isNaN(this.focused) || this.focused === null || this.focused === undefined
    );
  }
  #initAdapter = () => {
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
        cyAttributes: this.#cy,
        filterValue: () => this.filter,
        focused: () => this.focused,
        hiddenNodes: () => this.#hiddenNodes,
        indexById: (id: string) =>
          this.lfDataset?.nodes?.findIndex((n) => n.id === id),
        isDisabled: () => this.lfUiState === "disabled",
        lfAttributes: this.#lf,
        manager: this.#framework,
        nodeById: (id: string) =>
          this.lfDataset?.nodes?.find((n) => n.id === id),
        parts: this.#p,
        selected: () => this.selected,
      },
      {
        filter: {
          debounce: (value) => this.#debounceFilter(value),
          setValue: (value) => this.#applyFilter(value),
        },
      },
      () => this.#adapter,
    );
  };
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

    if (this.lfValue && typeof this.lfValue === "number") {
      this.selected = this.lfValue;
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
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#framework.theme;

    const { controller, elements } = this.#adapter;
    const { get } = controller;
    const { jsx } = elements;
    const { emptyData, list } = this.#b;
    const { lfDataset, lfEmpty, lfFilter, lfSelectable, lfStyle } = this;

    this.#listItems = [];

    const visibleNodes =
      lfDataset?.nodes?.filter((node) => !this.#hiddenNodes.has(node)) || [];

    const getIndex = (id: string) => get.indexById(id);
    const isEmpty = !!!lfDataset?.nodes?.length;
    const isFilteredEmpty = !isEmpty && visibleNodes.length === 0;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          {lfFilter && jsx.filter()}
          {isEmpty || isFilteredEmpty ? (
            <div class={bemClass(emptyData._)} part={this.#p.emptyData}>
              <div class={bemClass(emptyData._, emptyData.text)}>
                {isFilteredEmpty ? "No items match your filter." : lfEmpty}
              </div>
            </div>
          ) : (
            <ul
              aria-multiselectable={"false"}
              class={bemClass(list._, null, {
                empty: isEmpty,
                selectable: lfSelectable,
              })}
              part={this.#p.list}
              role={"listbox"}
            >
              {visibleNodes.map((node, index) => {
                const isSelected = getIndex(node.id) === this.selected;

                return (
                  <li
                    class={bemClass(list._, list.item, {
                      focused: index === this.focused,
                      "has-description": !!node.description,
                      selected: isSelected,
                    })}
                    data-lf={this.#lf[this.lfUiState]}
                    key={node.id}
                    ref={(el) => {
                      if (el && !this.#listItems.includes(el)) {
                        this.#listItems.push(el);
                      }
                    }}
                  >
                    {this.lfEnableDeletions && jsx.deleteIcon(node)}
                    {jsx.node(node, index, isSelected)}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    if (this.#filterTimeout) {
      clearTimeout(this.#filterTimeout);
      this.#filterTimeout = null;
    }
    this.#framework.theme.unregister(this);
  }
  //#endregion
}

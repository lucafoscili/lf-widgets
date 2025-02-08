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
  LfListElement,
  LfListEvent,
  LfListEventPayload,
  LfListInterface,
  LfListPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
  onFrameworkReady,
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
} from "@stencil/core";

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
  #framework: LfFrameworkInterface;
  #b = LF_LIST_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_LIST_PARTS;
  #r: HTMLElement[] = [];
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #listItems: HTMLDivElement[] = [];
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

    switch (eventType) {
      case "blur":
        this.focused = null;
        break;
      case "click":
        this.focused = index;
        this.#handleSelection(index);
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
        if (this.lfRipple) {
          effects.ripple(e as PointerEvent, this.#r[index]);
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
   * Moves focus to the next item in the list.
   * If no item is currently focused, focuses the selected item.
   * If the last item is focused, wraps around to the first item.
   * @returns A promise that resolves when the focus operation is complete
   */
  @Method()
  async focusNext(): Promise<void> {
    const { focused, selected } = this;

    if (isNaN(focused) || focused === null || focused === undefined) {
      this.focused = selected;
    } else {
      this.focused++;
    }
    if (this.focused > this.#listItems.length - 1) {
      this.focused = 0;
    }
    this.#listItems[this.focused].focus();
  }
  /**
   * Focuses the previous item in the list.
   * If no item is currently focused, it focuses the selected item.
   * If focused item is the first one, it wraps around to the last item.
   * @returns Promise that resolves when the focus operation is complete
   */
  @Method()
  async focusPrevious(): Promise<void> {
    const { focused, selected } = this;

    if (isNaN(focused) || focused === null || focused === undefined) {
      this.focused = selected;
    } else {
      this.focused--;
    }
    if (this.focused < 0) {
      this.focused = this.#listItems.length - 1;
    }
    this.#listItems[this.focused].focus();
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
  #onFrameworkReady = async () => {
    this.#framework = await onFrameworkReady;
    this.debugInfo = this.#framework.debug.info.create();
    this.#framework.theme.register(this);
  };
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
  #prepDeleteIcon(node: LfDataNode) {
    const { bemClass } = this.#framework.theme;

    return (
      <div
        class={bemClass(this.#b.delete._)}
        data-cy={this.#cy.button}
        data-lf={this.#lf.icon}
        onClick={(e) => {
          const index = this.lfDataset?.nodes?.indexOf(node);
          this.onLfEvent(e, "delete", node, index);
        }}
        part={this.#p.delete}
      >
        <div
          class={bemClass(this.#b.delete._, this.#b.delete.icon)}
          key={node.id + "_delete"}
        ></div>
      </div>
    );
  }
  #prepIcon(node: LfDataNode) {
    const { get } = this.#framework.assets;
    const { bemClass } = this.#framework.theme;

    const { style } = get(`./assets/svg/${node.icon}.svg`);
    return (
      <div
        class={bemClass(this.#b.node._, this.#b.node.icon)}
        data-cy={this.#cy.maskedSvg}
        style={style}
      ></div>
    );
  }
  #prepNode(node: LfDataNode, index: number) {
    const { stringify } = this.#framework.data.cell;
    const { bemClass } = this.#framework.theme;

    const { list } = this.#b;
    const { focused, lfDataset, lfRipple, selected } = this;

    const isFocused =
      focused === lfDataset.nodes.findIndex((n) => n.id === node.id);
    const isSelected =
      selected === lfDataset.nodes.findIndex((n) => n.id === node.id);

    return (
      <li
        class={bemClass(list._, list.item, {
          focused: isFocused,
          "has-description": !!node.description,
          selected: isSelected,
        })}
        data-lf={this.#lf[this.lfUiState]}
        key={node.id}
      >
        {this.lfEnableDeletions ? this.#prepDeleteIcon(node) : null}
        <div
          aria-checked={isSelected}
          aria-selected={isSelected}
          class={bemClass(this.#b.node._)}
          data-cy={this.#cy.node}
          data-index={index.toString()}
          onBlur={(e) => this.onLfEvent(e, "blur", node, index)}
          onClick={(e) => this.onLfEvent(e, "click", node, index)}
          onFocus={(e) => this.onLfEvent(e, "focus", node, index)}
          onPointerDown={(e) => this.onLfEvent(e, "pointerdown", node, index)}
          part={this.#p.node}
          ref={(el) => {
            if (el) {
              this.#listItems.push(el);
            }
          }}
          role={"option"}
          tabindex={isSelected ? "0" : "-1"}
          title={stringify(node.value) || stringify(node.description)}
        >
          <div
            data-cy={this.#cy.rippleSurface}
            data-lf={this.#lf.rippleSurface}
            ref={(el) => {
              if (lfRipple && el) {
                this.#r.push(el);
              }
            }}
          ></div>
          {node.icon && this.#prepIcon(node)}
          <span class={bemClass(this.#b.node._, this.#b.node.text)}>
            {this.#prepTitle(node)}
            {this.#prepSubtitle(node)}
          </span>
        </div>
      </li>
    );
  }
  #prepSubtitle(node: LfDataNode) {
    const { bemClass } = this.#framework.theme;

    return (
      node.description && (
        <div class={bemClass(this.#b.node._, this.#b.node.subtitle)}>
          {node.description}
        </div>
      )
    );
  }
  #prepTitle(node: LfDataNode) {
    const { bemClass } = this.#framework.theme;

    return (
      String(node.value).valueOf() && (
        <div class={bemClass(this.#b.node._, this.#b.node.title)}>
          {String(node.value).valueOf()}
        </div>
      )
    );
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    await this.#onFrameworkReady();

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

    const { emptyData, list } = this.#b;
    const { lfDataset, lfEmpty, lfSelectable, lfStyle } = this;

    const isEmpty = !!!lfDataset?.nodes?.length;
    this.#listItems = [];

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          {isEmpty ? (
            <div class={bemClass(emptyData._)} part={this.#p.emptyData}>
              <div class={bemClass(emptyData._, emptyData.text)}>{lfEmpty}</div>
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
              {lfDataset.nodes.map((item, index) =>
                this.#prepNode(item, index),
              )}
            </ul>
          )}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

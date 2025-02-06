import { getLfCore } from "@lf-widgets/core";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_STYLE_ID,
  LF_TABBAR_BLOCKS,
  LF_TABBAR_PARTS,
  LF_TABBAR_PROPS,
  LF_WRAPPER_ID,
  LfCoreInterface,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfTabbarElement,
  LfTabbarEvent,
  LfTabbarEventPayload,
  LfTabbarInterface,
  LfTabbarPropsInterface,
  LfTabbarState,
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
} from "@stencil/core";
import { triggerScroll } from "./helpers.utils";

/**
 * Represents the tab bar component, which displays a set of tabs for navigation.
 * The tab bar may include navigation arrows for overflow tabs and a ripple effect on user interaction.
 *
 * @component
 * @tag lf-tabbar
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying a tab bar with navigation arrows and a ripple effect.
 *
 * @example
 * <lf-tabbar lfDataset={tabData} />
 *
 * @fires {CustomEvent} lf-tabbar-event - Emitted for various component events
 */
@Component({
  tag: "lf-tabbar",
  styleUrl: "lf-tabbar.scss",
  shadow: true,
})
export class LfTabbar implements LfTabbarInterface {
  /**
   * References the root HTML element of the component (<lf-tabbar>).
   */
  @Element() rootElement: LfTabbarElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value: LfTabbarState = null;
  //#endregion

  //#region Props
  /**
   * The data set for the LF Tabbar component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * const tabData = {
   *  nodes: [
   *   { id: "tab1", value: "Tab 1", icon: "icon1" },
   *   { id: "tab2", value: "Tab 2", icon: "icon2" },
   *   { id: "tab3", value: "Tab 3", icon: "icon3" },
   * ],
   * };
   * <lf-tabbar lfDataset={tabData} />
   * ```
   */
  @Prop() lfDataset: LfDataDataset = null;
  /**
   * When set to true, the tabbar will display navigation arrows for overflow tabs.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tabbar lfNavigation={true} />
   * ```
   */
  @Prop() lfNavigation: boolean = false;
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tabbar lfRipple={true} />
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
   * <lf-tabbar lfStyle="#lf-component { background-color: red; }" />
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
   * <lf-tabbar lfUiSize="small" />
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
   * <lf-tabbar lfUiState="secondary" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial selected node's index.
   *
   * @type {number | string}
   * @default 0
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-tabbar lfValue={1} />
   * ```
   */
  @Prop({ mutable: false }) lfValue: number | string = null;
  //#endregion

  //#region Internal variables
  #core: LfCoreInterface;
  #b = LF_TABBAR_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_TABBAR_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #r: HTMLElement[];
  #scrollContainer: HTMLDivElement;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-tabbar-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfTabbarEventPayload>;
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfTabbarEvent,
    index = 0,
    node?: LfDataNode,
  ) {
    const { effects } = this.#core;

    switch (eventType) {
      case "click":
        this.value = {
          index,
          node,
        };
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
   * @returns {Promise<LfTabbarPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfTabbarPropsInterface> {
    const entries = LF_TABBAR_PROPS.map(
      (
        prop,
      ): [
        keyof LfTabbarPropsInterface,
        LfTabbarPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Returns the selected node and its index.
   * @returns {Promise<LfTabbarState>} Selected node and its index.
   */
  @Method()
  async getValue(): Promise<LfTabbarState> {
    return this.value;
  }
  /**
   * Triggers a re-render of the component to reflect any state changes.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Sets the value of the component based on the provided argument.
   * @param {number | string} value - The index of the node or the id of the node.
   * @returns {Promise<LfTabbarState>} The newly set value.
   */
  @Method()
  async setValue(value: number | string): Promise<LfTabbarState> {
    let index: number;
    let node: LfDataNode;

    if (typeof value === "number") {
      index = value;
      node = this.lfDataset.nodes[index];
    } else if (typeof value === "string") {
      index = this.lfDataset.nodes.findIndex((node) => node.id === value);
      node = this.lfDataset.nodes[index];
    }

    this.value = {
      index,
      node,
    };

    return this.value;
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
  #prepIcon = (node: LfDataNode) => {
    const { get } = this.#core.assets;
    const { bemClass } = this.#core.theme;

    const { tab } = this.#b;

    const { style } = get(`./assets/svg/${node.icon}.svg`);
    return (
      <div
        class={bemClass(tab._, tab.icon)}
        data-cy={this.#cy.maskedSvg}
        style={style}
      ></div>
    );
  };
  #prepNode = (node: LfDataNode, index: number) => {
    const { theme } = this.#core;
    const { bemClass } = theme;

    const { tab } = this.#b;
    const { lfRipple, value } = this;
    const isSelected = node === value?.node;

    return (
      <button
        aria-selected={isSelected}
        class={bemClass(tab._, null, {
          active: isSelected,
        })}
        data-cy={this.#cy.button}
        data-lf={this.#lf[this.lfUiState]}
        onClick={(e) => {
          this.onLfEvent(e, "click", index, node);
        }}
        onPointerDown={(e) => {
          this.onLfEvent(e, "pointerdown", index, node);
        }}
        part={this.#p.tab}
        role="tab"
        tabIndex={index}
        title={node?.description || ""}
      >
        <div
          data-cy={this.#cy.rippleSurface}
          data-lf={this.#lf.rippleSurface}
          ref={(el) => {
            if (el && lfRipple) {
              this.#r.push(el);
            }
          }}
        ></div>
        <span class={bemClass(tab._, tab.content)} data-cy={this.#cy.node}>
          {node.icon && this.#prepIcon(node)}
          {node.value && (
            <span class={bemClass(tab._, tab.label)}>{node.value}</span>
          )}
        </span>
        <span
          class={bemClass(tab._, tab.indicator, {
            active: isSelected,
          })}
        >
          <span
            class={bemClass(tab._, tab.indicatorContent, {
              active: true,
            })}
          ></span>
        </span>
      </button>
    );
  };
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#core) {
      this.#core = getLfCore();
      this.debugInfo = this.#core.debug.info.create();
    }
    this.#core.theme.register(this);
  }
  componentWillLoad() {
    const { debug } = this.#core;

    const { lfDataset, lfValue } = this;

    try {
      if (lfValue !== null) {
        if (typeof lfValue === "number") {
          this.value = {
            index: lfValue,
            node: lfDataset.nodes[lfValue],
          };
        }
        if (typeof lfValue === "string") {
          const node = lfDataset.nodes.find((node) => node.id === lfValue);
          this.value = {
            index: lfDataset.nodes.indexOf(node),
            node,
          };
        }
      }
    } catch (error) {
      debug.logs.new(
        this,
        "Something went wrong while setting the initial selected value.",
        "warning",
      );
    }
  }
  componentDidLoad() {
    const { debug, drag } = this.#core;

    drag.register.dragToScroll(this.#scrollContainer);

    this.onLfEvent(new CustomEvent("ready"), "ready");
    debug.info.update(this, "did-load");
  }
  componentWillRender() {
    const { debug } = this.#core;

    debug.info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#core.debug;

    info.update(this, "did-render");
  }
  render() {
    const { data, theme } = this.#core;
    const { bemClass, get, setLfStyle } = theme;
    const { "--lf-icon-next": next, "--lf-icon-previous": prev } =
      get.current().variables;

    const { tabbar } = this.#b;
    const { lfDataset, lfStyle } = this;

    if (!data.node.exists(lfDataset)) {
      return;
    }

    this.#r = [];
    const nodes = lfDataset.nodes;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div class={bemClass(tabbar._)} part={this.#p.tabbbar} role="tablist">
            {this.lfNavigation && (
              <lf-button
                lfIcon={prev}
                lfStretchY={true}
                lfStyling="flat"
                lfUiSize={this.lfUiSize}
                onLf-button-event={() =>
                  triggerScroll(this.#scrollContainer, "left")
                }
              ></lf-button>
            )}
            <div
              class={bemClass(tabbar._, tabbar.scroll)}
              ref={(el) => {
                if (el) {
                  this.#scrollContainer = el;
                }
              }}
            >
              {nodes.map((node, index) => {
                return this.#prepNode(node, index);
              })}
            </div>
            {this.lfNavigation && (
              <lf-button
                lfIcon={next}
                lfStretchY={true}
                lfStyling="flat"
                lfUiSize={this.lfUiSize}
                onLf-button-event={() =>
                  triggerScroll(this.#scrollContainer, "right")
                }
              ></lf-button>
            )}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { drag, theme } = this.#core;

    if (drag.getActiveSession(this.#scrollContainer)) {
      drag.unregister.dragToScroll(this.#scrollContainer);
    }

    theme.unregister(this);
  }
  //#endregion
}

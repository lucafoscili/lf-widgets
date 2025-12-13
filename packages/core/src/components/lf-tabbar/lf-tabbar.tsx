import {
  LF_STYLE_ID,
  LF_TABBAR_BLOCKS,
  LF_TABBAR_PARTS,
  LF_TABBAR_PROPS,
  LF_WRAPPER_ID,
  LfDataDataset,
  LfDataNode,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfTabbarAdapter,
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
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepTabbarActions } from "./actions.tabbar";
import { prepTabbarComputed } from "./computed.tabbar";
import { createAdapter } from "./lf-tabbar-adapter";

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
   * Explicit accessible label prefix for tabs. Final per-tab aria-label resolves as:
   * lfAriaLabel + ' ' + node.value (if both present) else node.value -> lfAriaLabel -> node.icon -> component id -> 'tab'.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * <lf-tabbar lfAriaLabel="Enable feature"></lf-tabbar>
   */
  @Prop({ mutable: true }) lfAriaLabel: string = "";
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
  #adapter: LfTabbarAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_TABBAR_BLOCKS;
  #p = LF_TABBAR_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
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
      this.#adapter.dispatcher.emit("unmount");
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
    emit: (
      eventType: LfTabbarEvent,
      detail?: Partial<LfTabbarEventPayload>,
    ) => {
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
        index: detail?.index,
        node: detail?.node,
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.computed: Derived predicates (isSelected, hasNodes)
   * - controller.actions: Complex operations (select, scroll)
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
      // Getters - base getters (via utility)
      createBaseGetters({
        blocks: () => this.#b,
        compInstance: () => this,
        framework: () => this.#framework,
        ids: () => ({}) as never,
        parts: () => this.#p,
      }),
      // Computed - derived predicates (from dedicated file)
      prepTabbarComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepTabbarActions(getAdapter),
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

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);
    this.#initAdapter();

    const { debug } = this.#framework;
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
    const { debug, drag, effects, theme } = this.#framework;
    const { scrollContainer, tabs } = this.#adapter.elements.refs;

    if (scrollContainer) {
      drag.register.dragToScroll(scrollContainer);
    }

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple) {
      tabs.forEach((el) => {
        if (el) {
          effects.register.ripple(el);
        }
      });
    }

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready");
    debug.info.update(this, "did-load");
  }
  componentWillRender() {
    const { debug } = this.#framework;

    debug.info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    info.update(this, "did-render");
  }
  render() {
    const { theme } = this.#framework;
    const { setLfStyle } = theme;

    const { lfStyle } = this;
    const { tabbar } = this.#adapter.elements.jsx;
    const { hasNodes } = this.#adapter.controller.computed;

    if (!hasNodes()) {
      return;
    }

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>{tabbar()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { drag, effects, theme } = this.#framework ?? {};

    if (this.#adapter) {
      const { scrollContainer, tabs } = this.#adapter.elements.refs;

      if (drag?.getActiveSession(scrollContainer)) {
        drag.unregister.dragToScroll(scrollContainer);
      }

      const hasThemeRipple = theme?.get.current().hasEffect("ripple");
      if (effects && this.lfRipple && hasThemeRipple) {
        tabs?.forEach((el) => {
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

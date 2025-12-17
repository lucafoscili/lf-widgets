import {
  LF_CARD_BLOCKS,
  LF_CARD_CSS_VARS,
  LF_CARD_IDS,
  LF_CARD_PARTS,
  LF_CARD_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCardAdapter,
  LfCardAdapterDefaults,
  LfCardElement,
  LfCardEvent,
  LfCardEventPayload,
  LfCardInterface,
  LfCardLayout,
  LfCardPropsInterface,
  LfDataDataset,
  LfDataShapesMap,
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
  Watch,
} from "@stencil/core";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepCardActions } from "./actions.card";
import { prepCardComputed } from "./computed.card";
import { CardFC } from "./fc";
import { createAdapter } from "./lf-card-adapter";

/**
 * The card component displays a card with a header, body, and footer section.
 * The component provides various properties for customizing the card layout, size, style, and theme.
 * The card component can be used to display content, images, or other UI elements in a structured format.
 * The component supports different layout styles, such as material design, and can be customized using CSS.
 *
 * @component
 * @tag lf-card
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable, reusable UI element for displaying content in a card format.
 * The component supports different layout styles, sizes, and themes, and can be customized using CSS.
 *
 * @example
 * <lf-card
 * lfLayout="material"
 * lfSizeX="300px"
 * lfSizeY="200px"
 * lfStyle="#lf-component { color: red; }"
 * lfUiSize="small"
 * ></lf-card>
 *
 * @fires {CustomEvent} lf-card-event - Emitted for various component events
 */
@Component({
  tag: "lf-card",
  styleUrl: "lf-card.scss",
  shadow: true,
})
export class LfCard implements LfCardInterface {
  /**
   * References the root HTML element of the component (<lf-card>).
   */
  @Element()
  rootElement: LfCardElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() shapes: LfDataShapesMap;
  //#endregion

  //#region Props
  /**
   * The data set for the LF Card component.
   * This property is mutable, meaning it can be changed after the component is initialized.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-card lfDataset={dataset}></lf-card>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * The layout style for the card component.
   * Can be set to different predefined styles like "material" design.
   *
   * @type {LfCardLayout}
   * @default "material"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-card lfLayout="material"></lf-card>
   * ```
   */
  @Prop({ mutable: true }) lfLayout: LfCardLayout = "material";
  /**
   * The width of the card, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).
   *
   * @type {string}
   * @default "100%"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-card lfSizeX="300px"></lf-card>
   * ```
   */
  @Prop({ mutable: true }) lfSizeX: string = "100%";
  /**
   * The height of the card, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).
   *
   * @type {string}
   * @default "100%"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-card lfSizeY="200px"></lf-card>
   * ```
   */
  @Prop({ mutable: true }) lfSizeY: string = "100%";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-card lfStyle="#lf-component { color: red; }"></lf-card>
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
   * <lf-card lfUiSize="small"></lf-card>
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
   * <lf-card lfUiState="success"></lf-card>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #adapter: LfCardAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_CARD_BLOCKS;
  #ids = LF_CARD_IDS;
  #p = LF_CARD_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_CARD_CSS_VARS;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-card-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfCardEventPayload>;
  //#endregion

  //#region Watchers
  @Watch("lfDataset")
  async onDatasetChanged() {
    if (!this.#framework) {
      return;
    }

    this.#adapter.controller.actions.updateShapes();
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
   * @returns {Promise<LfCardPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfCardPropsInterface> {
    const entries = LF_CARD_PROPS.map(
      (
        prop,
      ): [keyof LfCardPropsInterface, LfCardPropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Used to retrieve component's shapes.
   * @returns {Promise<LfDataShapesMap>} Map of shapes.
   */
  @Method()
  async getShapes(): Promise<LfDataShapesMap> {
    return this.shapes;
  }
  /**
   * This method is used to trigger a new render of the component.
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
    emit: (eventType: LfCardEvent, detail?: Partial<LfCardEventPayload>) => {
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
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + defaults, shapes
   * - controller.set: Simple setters (currently none)
   * - controller.computed: Derived predicates (hasDataset, hasSlotChildren, shouldRender)
   * - controller.actions: Complex operations (updateShapes, registerRipple, unregisterRipple)
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
        defaults: () => ({}) as LfCardAdapterDefaults, // Enhanced in adapter factory
        shapes: () => this.shapes,
      },
      // Setters - simple single-value assignments (currently none)
      {},
      // Computed - derived predicates (from dedicated file)
      prepCardComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepCardActions(getAdapter),
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
    this.#adapter.controller.actions.updateShapes();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    // Register ripple on material layout
    this.#adapter.controller.actions.registerRipple();

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready");
    info.update(this, "did-load");
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
    const { theme } = this.#framework;
    const { setLfStyle } = theme;
    const { shouldRender } = this.#adapter.controller.computed;

    const { lfSizeX, lfSizeY, lfStyle } = this;

    if (!shouldRender()) {
      return;
    }

    return (
      <Host>
        <style id={this.#s}>
          {`
        :host {
         ${this.#v.height}: ${lfSizeY || "100%"};
         ${this.#v.width}: ${lfSizeX || "100%"};
        }
        ${(lfStyle && setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w} part={this.#p.card}>
          <CardFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    // Unregister ripple from material layout
    this.#adapter?.controller.actions.unregisterRipple();

    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

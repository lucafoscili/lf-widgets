import {
  LF_IMAGE_BLOCKS,
  LF_IMAGE_CSS_VARS,
  LF_IMAGE_IDS,
  LF_IMAGE_PARTS,
  LF_IMAGE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
  LfImageAdapter,
  LfImageElement,
  LfImageEvent,
  LfImageEventPayload,
  LfImageInterface,
  LfImagePropsInterface,
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
import { ImageFC } from "./fc";
import { createAdapter } from "./lf-image-adapter";

/**
 * Represents an image component that displays an image or icon.
 * The image may be loaded from a URL or a local asset.
 * The component supports various customization options, including size, styling, and state color.
 *
 * @component
 * @tag lf-image
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying images or icons.
 *
 * @example
 * <lf-image
 *  lfValue="https://example.com/image.jpg"
 * lfSizeX="100px"
 * lfSizeY="100px"
 * ></lf-image>
 *
 * @fires {CustomEvent} lf-image-event - Emitted for various component events
 */
@Component({
  tag: "lf-image",
  styleUrl: "lf-image.scss",
  shadow: true,
})
export class LfImage implements LfImageInterface {
  /**
   * References the root HTML element of the component (<lf-image>).
   */
  @Element() rootElement: LfImageElement;

  //#region States
  /**
   * "Adapter as Core" Pattern:
   * This is the ONLY @State in the component (besides debugInfo). It's a simple counter that gets
   * incremented by the adapter's onStateChange callback to trigger re-renders.
   *
   * All actual component state lives in the adapter's closure variables.
   * This approach gives us:
   * - Predictable renders (only when adapter explicitly requests)
   * - Batch-friendly updates (adapter can make multiple changes before triggering render)
   * - Testable state logic (adapter can be tested without DOM)
   */
  @State() private _renderTick = 0;
  /**
   * Debug information state property created through LfFramework debug utility.
   * Used to store and manage debug-related information for the image component.
   * @remarks This state property is initialized using the debug.info.create() method from the framework instance.
   */
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * Allows customization of the image element.
   * This can include attributes like 'alt', 'aria-', etc., to further customize the behavior or appearance of the input.
   * @type {LfFrameworkAllowedKeysMap}
   * @default undefined
   * @mutable
   */
  @Prop({ mutable: true })
  lfHtmlAttributes: Partial<LfFrameworkAllowedKeysMap> = {};
  /**
   * Controls the display of a loading indicator.
   * When enabled, a spinner is shown until the image finishes loading.
   * This property is not compatible with SVG images.
   *
   * @type {boolean}
   * @default false
   * @mutable
   */
  @Prop({ mutable: true }) lfShowSpinner: boolean = false;
  /**
   * Sets the width of the icon.
   * This property accepts any valid CSS measurement value (e.g., px, %, vh, etc.) and defaults to 100%.
   *
   * @type {string}
   * @default "100%"
   * @mutable
   */
  @Prop({ mutable: true }) lfSizeX: string = "100%";
  /**
   * Sets the height of the icon.
   * This property accepts any valid CSS measurement value (e.g., px, %, vh, etc.) and defaults to 100%.
   *
   * @type {string}
   * @default "100%"
   * @mutable
   */
  @Prop({ mutable: true }) lfSizeY: string = "100%";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Reflects the specified state color defined by the theme.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Defines the source URL of the image.
   * This property is used to set the image resource that the component should display.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfValue: string = "";
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-image-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfImageEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfImageEvent) {
    this.lfEvent.emit({
      comp: this,
      id: this.rootElement.id,
      originalEvent: e,
      eventType,
    });
  }
  //#endregion

  //#region Internal variables
  #adapter: LfImageAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_IMAGE_BLOCKS;
  #ids = LF_IMAGE_IDS;
  #p = LF_IMAGE_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_IMAGE_CSS_VARS;
  #w = LF_WRAPPER_ID;

  /**
   * Bridge getter to satisfy LfImageInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.error() internally
   */
  get error(): boolean {
    return this.#adapter?.controller.get.error() ?? false;
  }
  /**
   * Bridge getter to satisfy LfImageInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.isLoaded() internally
   */
  get isLoaded(): boolean {
    return this.#adapter?.controller.get.isLoaded() ?? false;
  }
  /**
   * Bridge getter to satisfy LfImageInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.resolvedSpriteName() internally
   */
  get resolvedSpriteName(): string | undefined {
    return this.#adapter?.controller.get.resolvedSpriteName();
  }
  //#endregion

  //#region Watchers
  @Watch("lfValue")
  async resetState(newVal?: string, _oldVal?: string) {
    if (!this.#framework || !this.#adapter) {
      return;
    }

    await this.#adapter.controller.actions.resetState(newVal);
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
   * Retrieves the underlying HTMLImageElement used to display the image.
   * @returns {Promise<HTMLImageElement | SVGElement | null>} A promise that resolves with the image element, or null if not available.
   */
  @Method()
  async getImage(): Promise<HTMLImageElement | SVGElement | null> {
    return this.#adapter.controller.get.imageRef();
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfImagePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfImagePropsInterface> {
    const entries = LF_IMAGE_PROPS.map(
      (
        prop,
      ): [keyof LfImagePropsInterface, LfImagePropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
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
    emit: (eventType: LfImageEvent, detail?: Partial<LfImageEventPayload>) => {
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
   * Initializes the adapter with "Adapter as Core" architecture.
   *
   * "Adapter as Core" Pattern:
   * - Adapter OWNS the runtime state (via closure variables)
   * - onStateChange callback increments _renderTick to trigger re-render
   * - WC is a thin shell: lifecycle + HTML interface + single render trigger
   *
   * Structure:
   * - controller.get: State reads (error, isLoaded, resolvedSpriteName, etc.) + base getters
   * - controller.set: State writes → triggers onStateChange
   * - controller.computed: Derived predicates (isResourceUrl, resolvedSource)
   * - controller.actions: Complex operations (resolveSprite, resetState)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    // onStateChange callback - increments _renderTick to trigger Stencil re-render
    const onStateChange = () => {
      this._renderTick++;
    };

    const adapterWithoutDispatcher = createAdapter(
      // Base getters (via utility) - does NOT include state getters
      createBaseGetters({
        blocks: () => this.#b,
        compInstance: () => this,
        framework: () => this.#framework,
        ids: () => this.#ids,
        parts: () => this.#p,
      }),
      // Initial state values
      {
        error: false,
        imageRef: null,
        isLoaded: false,
        resolvedFor: undefined,
        resolvedSpriteName: undefined,
      },
      // onStateChange callback
      onStateChange,
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

    const { isResourceUrl } = this.#adapter.controller.computed;

    if (!isResourceUrl() && this.lfValue) {
      const { theme } = this.#framework;
      this.#adapter.controller.set.isLoaded(true);
      theme.get.sprite.ids();
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

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
    const { debug, theme } = this.#framework;

    const { lfSizeX, lfSizeY, lfStyle, lfValue } = this;

    if (!lfValue) {
      debug.logs.new(this, "Empty image.");
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
          ${(lfStyle && theme.setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w}>
          <ImageFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

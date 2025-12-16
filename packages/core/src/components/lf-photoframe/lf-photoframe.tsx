import {
  LF_PHOTOFRAME_BLOCKS,
  LF_PHOTOFRAME_IDS,
  LF_PHOTOFRAME_PARTS,
  LF_PHOTOFRAME_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
  LfPhotoframeAdapter,
  LfPhotoframeElement,
  LfPhotoframeEvent,
  LfPhotoframeEventPayload,
  LfPhotoframeInterface,
  LfPhotoframeOrientation,
  LfPhotoframeOverlay,
  LfPhotoframePropsInterface,
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
import { prepPhotoframeActions } from "./actions.photoframe";
import { prepPhotoframeComputed } from "./computed.photoframe";
import { PhotoframeFC } from "./fc";
import { createAdapter } from "./lf-photoframe-adapter";

/**
 * Represents an image component that displays a photo or graphic.
 * The image may be overlaid with text or other elements.
 *
 * @component
 * @tag lf-photoframe
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying images with optional overlays.
 *
 * @example
 * <lf-photoframe
 * lfOverlay={{ title: "Hello", description: "World" }}
 * lfPlaceholder={{ src: "path/to/placeholder.jpg" }}
 * ></lf-photoframe>
 *
 * @fires {CustomEvent} lf-photoframe-event - Emitted for various component events
 */
@Component({
  tag: "lf-photoframe",
  styleUrl: "lf-photoframe.scss",
  shadow: true,
})
export class LfPhotoframe implements LfPhotoframeInterface {
  /**
   * References the root HTML element of the component (<lf-photoframe>).
   */
  @Element() rootElement: LfPhotoframeElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() imageOrientation: LfPhotoframeOrientation = "";
  @State() isInViewport = false;
  @State() isReady = false;
  //#endregion

  //#region Props
  /**
   * When not empty, this text will be overlayed on the photo - blocking the view.
   *
   * @type {LfPhotoframeOverlay}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-photoframe lfOverlay={{ title: "Hello", description: "World" }} />
   * ```
   */
  @Prop({ mutable: true }) lfOverlay: LfPhotoframeOverlay = null;
  /**
   * Html attributes of the picture before the component enters the viewport.
   *
   * @type {LfFrameworkAllowedKeysMap}
   * @default null
   *
   * @example
   * ```tsx
   * <lf-photoframe lfPlaceholder={{ src: "path/to/placeholder.jpg" }} />
   * ```
   */
  @Prop({ mutable: false }) lfPlaceholder: Partial<LfFrameworkAllowedKeysMap> =
    null;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-photoframe lfStyle="#lf-component { color: red; }" />
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Percentage of the component dimensions entering the viewport (0.1 => 1).
   *
   * @type {number}
   * @default 0.25
   *
   * @example
   * ```tsx
   * <lf-photoframe lfThreshold={0.25} />
   * ```
   */
  @Prop({ mutable: false }) lfThreshold: number = 0.25;
  /**
   * Html attributes of the picture after the component enters the viewport.
   *
   * @type {LfFrameworkAllowedKeysMap}
   * @default null
   *
   * @example
   * ```tsx
   * <lf-photoframe lfValue={{ src: "path/to/image.jpg", alt: "My Image" }} />
   * ```
   */
  @Prop({ mutable: false }) lfValue: Partial<LfFrameworkAllowedKeysMap> = null;
  //#endregion

  //#region Internal variables
  #adapter: LfPhotoframeAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_PHOTOFRAME_BLOCKS;
  #ids = LF_PHOTOFRAME_IDS;
  #p = LF_PHOTOFRAME_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #intObserver: IntersectionObserver;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-photoframe-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfPhotoframeEventPayload>;
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
   * @returns {Promise<LfPhotoframePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfPhotoframePropsInterface> {
    const entries = LF_PHOTOFRAME_PROPS.map(
      (
        prop,
      ): [
        keyof LfPhotoframePropsInterface,
        LfPhotoframePropsInterface[typeof prop],
      ] => [prop, this[prop]],
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
      this.#adapter.dispatcher.emit("unmount", {});
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
      eventType: LfPhotoframeEvent,
      detail?: Partial<LfPhotoframeEventPayload>,
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
        isPlaceholder: detail?.isPlaceholder,
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.computed: Derived predicates (isInViewport, showPlaceholder, isReady, shouldReplace)
   * - controller.actions: Complex operations (triggerLoad)
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
        ids: () => this.#ids,
        parts: () => this.#p,
      }),
      // Computed - derived predicates (from dedicated file)
      prepPhotoframeComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepPhotoframeActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #setObserver() {
    this.#intObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isHydrated = this.rootElement.hasAttribute("lf-hydrated");
          const isConnected = this.rootElement.isConnected;
          if (entry.isIntersecting && isHydrated && isConnected) {
            requestAnimationFrame(() => {
              this.isInViewport = true;
              this.#intObserver.unobserve(this.rootElement);
            });
          }
        });
      },
      {
        threshold: this.lfThreshold,
      },
    );
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
      this.#setObserver();
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);
    this.#initAdapter();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.#setObserver();
    this.#intObserver?.observe(this.rootElement);

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", {});
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
    const { bemClass, setLfStyle } = theme;

    const { imageOrientation, lfStyle } = this;
    const { photoframe } = this.#b;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div
          class={bemClass(photoframe._, null, {
            [imageOrientation]: Boolean(imageOrientation),
          })}
          id={this.#w}
        >
          <PhotoframeFC adapter={this.#adapter} />
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
    this.#intObserver?.unobserve(this.rootElement);
  }
  //#endregion
}

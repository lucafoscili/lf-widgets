import {
  CY_ATTRIBUTES,
  LF_PHOTOFRAME_BLOCKS,
  LF_PHOTOFRAME_PARTS,
  LF_PHOTOFRAME_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
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
  VNode,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";

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
  #framework: LfFrameworkInterface;
  #b = LF_PHOTOFRAME_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #p = LF_PHOTOFRAME_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #intObserver: IntersectionObserver;
  #mutObserver: MutationObserver;
  #placeholder: HTMLImageElement;
  #readyPromise: Promise<void>;
  #resolveReady!: () => void;
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
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfPhotoframeEvent,
    isPlaceholder = false,
  ) {
    switch (eventType) {
      case "load":
        if (isPlaceholder) {
          if (this.#isLandscape(this.#placeholder)) {
            this.imageOrientation = "horizontal";
          } else {
            this.imageOrientation = "vertical";
          }
        } else {
          this.waitUntilReady().then(() => (this.isReady = true));
        }
    }

    this.lfEvent.emit({
      comp: this,
      id: this.rootElement.id,
      originalEvent: e,
      eventType,
      isPlaceholder,
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
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  /**
   * Waits until the component is ready.
   *
   * This method returns a Promise that resolves once the internal state has been initialized,
   * indicating that the component is fully set up and ready for interactions.
   *
   * @returns A Promise that resolves to void when the component is ready.
   */
  @Method()
  async waitUntilReady(): Promise<void> {
    return this.#readyPromise;
  }
  //#endregion

  //#region Private methods
  #isLandscape(image: HTMLImageElement) {
    return Boolean(image.naturalWidth > image.naturalHeight);
  }
  #prepOverlay = (): VNode => {
    const { lfOverlay } = this;

    if (!lfOverlay || typeof lfOverlay !== "object") {
      return null;
    }

    const { bemClass } = this.#framework.theme;

    const { overlay } = this.#b;
    const { description, hideOnClick, icon, title } = lfOverlay;

    return (
      <div
        class={bemClass(overlay._, null, {
          "has-actions": hideOnClick,
        })}
        onClick={
          hideOnClick
            ? (e) => {
                this.onLfEvent(e, "overlay");
                this.lfOverlay = null;
              }
            : undefined
        }
        part={this.#p.overlay}
      >
        <div class={bemClass(overlay._, overlay.content)}>
          {icon && (
            <lf-image
              class={bemClass(overlay._, overlay.icon)}
              lfSizeX="3em"
              lfSizeY="3em"
              lfValue={icon}
              part={this.#p.icon}
            ></lf-image>
          )}
          {title && (
            <div
              class={bemClass(overlay._, overlay.title)}
              part={this.#p.title}
            >
              {title}
            </div>
          )}
          {description && (
            <div
              class={bemClass(overlay._, overlay.description)}
              part={this.#p.description}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    );
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
    this.#mutObserver = new MutationObserver(() => {
      if (
        this.rootElement.isConnected &&
        this.rootElement.hasAttribute("lf-hydrated")
      ) {
        this.isReady = true;
        this.#resolveReady();
        this.#mutObserver.disconnect();
      }
    });
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
    this.#readyPromise = new Promise<void>((resolve) => {
      this.#resolveReady = resolve;
    });
    this.#framework = await awaitFramework(this);
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.#setObserver();
    this.#intObserver?.observe(this.rootElement);
    this.#mutObserver?.observe(this.rootElement, { attributes: true });

    this.onLfEvent(new CustomEvent("ready"), "ready");
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
    const { sanitizeProps, theme } = this.#framework;
    const { bemClass, setLfStyle } = theme;

    const { photoframe } = this.#b;
    const { isInViewport, isReady, lfPlaceholder, lfStyle, lfValue } = this;

    const replace = Boolean(isInViewport && isReady);

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div
          class={bemClass(photoframe._, null, {
            [this.imageOrientation]: this.imageOrientation && true,
          })}
          id={this.#w}
        >
          {this.#prepOverlay()}
          <img
            class={bemClass(photoframe._, photoframe.placeholder, {
              loaded: Boolean(this.imageOrientation),
              hidden: replace,
            })}
            data-cy={this.#cy.image}
            onLoad={(e) => {
              this.onLfEvent(e, "load", true);
            }}
            part={this.#p.placeholder}
            ref={(el) => {
              if (el) this.#placeholder = el;
            }}
            {...sanitizeProps(lfPlaceholder)}
          ></img>
          {isInViewport && (
            <img
              class={bemClass(photoframe._, photoframe.image, {
                active: replace,
              })}
              data-cy={this.#cy.image}
              onLoad={(e) => {
                this.onLfEvent(e, "load");
              }}
              part={this.#p.image}
              {...sanitizeProps(lfValue)}
            ></img>
          )}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
    this.#intObserver?.unobserve(this.rootElement);
    this.#mutObserver?.disconnect();
  }
  //#endregion
}

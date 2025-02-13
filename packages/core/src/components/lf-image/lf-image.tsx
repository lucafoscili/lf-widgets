import {
  CSS_VAR_PREFIX,
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_IMAGE_BLOCKS,
  LF_IMAGE_CSS_VARS,
  LF_IMAGE_PARTS,
  LF_IMAGE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkAllowedKeysMap,
  LfFrameworkInterface,
  LfImageElement,
  LfImageEvent,
  LfImageEventPayload,
  LfImageInterface,
  LfImagePropsInterface,
  LfThemeIcon,
  LfThemeIconVariable,
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
  Watch,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";

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
   * Debug information state property created through LFManager debug utility.
   * Used to store and manage debug-related information for the accordion component.
   * @remarks This state property is initialized using the debug.info.create() method from the lfFramework instance.
   */
  @State() debugInfo: LfDebugLifecycleInfo;
  /**
   * State variable that tracks if an error occurred during image loading.
   * When true, indicates the image failed to load properly.
   */
  @State() error = false;
  /**
   * Indicates whether the image has been successfully loaded.
   * This property is set to true once the image load event completes.
   */
  @State() isLoaded: boolean = false;
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
  #framework: LfFrameworkInterface;
  #b = LF_IMAGE_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_IMAGE_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_IMAGE_CSS_VARS;
  #w = LF_WRAPPER_ID;
  #mask: string;
  //#endregion

  //#region Watchers
  @Watch("lfValue")
  async resetState() {
    if (!this.#framework) {
      return;
    }

    this.error = false;
    this.isLoaded = false;
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
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  #createIcon(): VNode {
    const { sanitizeProps, theme } = this.#framework;
    const { bemClass } = theme;

    const { image } = this.#b;

    return (
      <div
        {...sanitizeProps(this.lfHtmlAttributes)}
        class={bemClass(image._, image.icon)}
        data-cy={this.#cy.maskedSvg}
        data-lf={this.lfUiState}
        part={this.#p.icon}
      ></div>
    );
  }
  #createImage(): VNode {
    const { sanitizeProps, theme } = this.#framework;
    const { bemClass } = theme;

    const { image } = this.#b;

    return (
      <img
        {...sanitizeProps(this.lfHtmlAttributes)}
        class={bemClass(image._, image.img)}
        data-cy={this.#cy.image}
        onError={(e) => {
          this.error = true;
          this.isLoaded = false;
          this.onLfEvent(e, "error");
        }}
        onLoad={(e) => {
          this.error = false;
          this.isLoaded = true;
          this.onLfEvent(e, "load");
        }}
        part={this.#p.img}
        src={this.lfValue}
      ></img>
    );
  }
  #isResourceUrl() {
    const { lfValue } = this;

    if (!lfValue || typeof lfValue !== "string") return false;

    const resourceUrlPattern = /^(https?:\/\/|\/|\.{1,2}\/|[a-zA-Z]:\\|\\\\).+/;

    return resourceUrlPattern.test(lfValue);
  }
  async #preloadIcon(iconName: string): Promise<void> {
    const { assets, theme } = this.#framework;
    const { variables } = theme.get.current();
    const { "--lf-icon-broken-image": broken } = variables;

    const isThemeIcon = iconName.indexOf(CSS_VAR_PREFIX) > -1;
    const realIconName = this.error
      ? broken
      : isThemeIcon
        ? (variables[iconName as LfThemeIconVariable] as string)
        : iconName;

    const svgAsset = assets.get(`./assets/svg/${realIconName}.svg`);

    const img = new Image();
    const svgUrl = new URL(svgAsset.path, window.location.origin).href;

    const promise = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => reject(e);
    });
    img.src = svgUrl;

    await promise;
  }
  #setMask = (icon: LfThemeIcon | string) => {
    const { assets } = this.#framework;

    const { mask } = assets.get(`./assets/svg/${icon}.svg`).style;
    this.#mask = mask;
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

    const { logs } = this.#framework.debug;

    if (!this.#isResourceUrl() && this.lfValue) {
      try {
        await this.#preloadIcon(this.lfValue);
        this.isLoaded = true;
      } catch (err) {
        logs.new(this, "Failed to preload icon", "warning");
        this.error = true;
      }
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

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
    const { debug, theme } = this.#framework;
    const { bemClass, get } = theme;
    const { variables } = get.current();

    const { image } = this.#b;
    const { error, isLoaded, lfSizeX, lfSizeY, lfStyle, lfValue } = this;

    if (!lfValue) {
      debug.logs.new(this, "Empty image.");
      return;
    }

    this.#mask = "";
    const isUrl = this.#isResourceUrl();

    if (error) {
      const { "--lf-icon-broken-image": broken } = variables;
      this.#setMask(broken);
    } else if (!isUrl) {
      const isThemeIcon = lfValue.indexOf(CSS_VAR_PREFIX) > -1;
      const icon = isThemeIcon
        ? variables[lfValue as LfThemeIconVariable]
        : lfValue;
      this.#setMask(icon);
    }

    return (
      <Host>
        <style id={this.#s}>
          {`
          :host {
            ${this.#v.mask}: ${this.#mask ? this.#mask : "none"};
            ${this.#v.height}: ${lfSizeY || "100%"};
            ${this.#v.width}:  ${lfSizeX || "100%"};
          }
          ${(lfStyle && theme.setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w}>
          <div
            class={bemClass(image._, null)}
            data-lf={this.#lf.fadeIn}
            onClick={(e) => {
              this.onLfEvent(e, "click");
            }}
            part={this.#p.image}
          >
            {error
              ? this.#createIcon()
              : isUrl
                ? this.#createImage()
                : isLoaded
                  ? this.#createIcon()
                  : null}
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

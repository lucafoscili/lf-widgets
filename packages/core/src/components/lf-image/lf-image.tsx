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
  LfIconType,
  LfImageElement,
  LfImageEvent,
  LfImageEventPayload,
  LfImageInterface,
  LfImagePropsInterface,
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
import { FIcon } from "../../utils/icon";

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
  /**
   * The resolved sprite name to be used for the image.
   * This state property is set when the component successfully resolves the sprite name.
   */
  @State() resolvedSpriteName?: string;
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
  #img: HTMLImageElement | SVGElement = null;
  #resolvedFor?: string;

  //#region Watchers
  @Watch("lfValue")
  async resetState(newVal?: string, _oldVal?: string) {
    if (!this.#framework) {
      return;
    }

    this.error = false;
    this.isLoaded = false;
    this.resolvedSpriteName = undefined;
    this.#resolvedFor = undefined;

    if (!newVal) {
      return;
    }

    const isUrl = this.#isResourceUrl();
    if (isUrl) {
      return;
    }

    // For sprite icons, mark as loaded immediately
    this.isLoaded = true;
    try {
      const { theme } = this.#framework;
      theme.get.sprite.ids();
    } catch (err) {
      // Sprite not available, will show broken image
    }
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
    return this.#img;
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
        ref={(el) => {
          if (el) {
            this.#img = el;
          }
        }}
        src={this.lfValue}
      ></img>
    );
  }
  #isResourceUrl() {
    const { lfValue } = this;

    if (!lfValue || typeof lfValue !== "string") {
      return false;
    }

    const resourceUrlPattern =
      /^(?:(?:https?:\/\/|\/|\.{1,2}\/|[a-zA-Z]:\\|\\\\|blob:).+|data:image\/[a-zA-Z0-9+.-]+(?:;charset=[^;,]+)?(?:;base64)?,.*)$/;

    return resourceUrlPattern.test(lfValue);
  }
  #prepSpriteIcon(value?: LfThemeIconVariable): VNode {
    const { theme } = this.#framework;
    const { bemClass } = theme;
    const { image } = this.#b;
    const { variables } = theme.get.current();

    const resolved = !value
      ? variables["--lf-icon-broken-image"]
      : value.indexOf(CSS_VAR_PREFIX) > -1
        ? variables[value]
        : value;

    if (this.#resolvedFor !== resolved) {
      this.resolvedSpriteName = undefined;
      this.#resolvedFor = resolved;
      theme.get.sprite.hasIcon(resolved).then((exists) => {
        if (this.#resolvedFor === resolved) {
          this.resolvedSpriteName = exists
            ? resolved
            : variables["--lf-icon-broken-image"];
        }
      });
    }

    const effectiveName = this.resolvedSpriteName ?? resolved;

    return (
      <FIcon
        framework={this.#framework}
        icon={effectiveName as LfIconType}
        wrapperClass={bemClass(image._, image.icon)}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
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
    this.#framework = await awaitFramework(this);

    if (!this.#isResourceUrl() && this.lfValue) {
      const { theme } = this.#framework;
      this.isLoaded = true;
      theme.get.sprite.ids();
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
    const { bemClass } = theme;

    const { image } = this.#b;
    const { error, isLoaded, lfSizeX, lfSizeY, lfStyle, lfValue } = this;

    if (!lfValue) {
      debug.logs.new(this, "Empty image.");
      return;
    }

    const isUrl = this.#isResourceUrl();

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
          <div
            class={bemClass(image._, null)}
            data-lf={this.#lf.fadeIn}
            onClick={(e) => {
              this.onLfEvent(e, "click");
            }}
            part={this.#p.image}
          >
            {(() => {
              // Error state - show broken image icon
              if (error) {
                return this.#prepSpriteIcon();
              }
              // URL-based image
              if (isUrl) {
                return this.#createImage();
              }
              // Sprite icon (non-URL value)
              if (isLoaded) {
                return this.#prepSpriteIcon(lfValue as LfThemeIconVariable);
              }

              return null;
            })()}
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

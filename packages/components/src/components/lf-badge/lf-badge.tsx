import { getLfCore } from "../../index";
import {
  LF_ATTRIBUTES,
  LF_BADGE_BLOCKS,
  LF_BADGE_PARTS,
  LF_BADGE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfBadgeElement,
  LfBadgeEvent,
  LfBadgeEventPayload,
  LfBadgeInterface,
  LfBadgePositions,
  LfBadgePropsInterface,
  LfCoreInterface,
  LfDebugLifecycleInfo,
  LfImagePropsInterface,
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

/**
 * Simple component that displays a badge with an optional image and label.
 * The badge can be positioned in one of the four corners of its container.
 * Custom styling can be applied to the badge and its components.
 * The badge can be styled with a theme color and size.
 *
 * @component
 * @tag lf-badge
 * @shadow true
 *
 * @example
 * <lf-badge
 * lfImageProps={{ lfValue: "path/to/image.png" }}
 * lfLabel="New"
 * lfPosition="bottom-right"
 * lfStyle="#lf-component { background-color: red; }"
 * lfUiSize="small"
 * lfUiState="success"
 * ></lf-badge>
 *
 * @fires {CustomEvent} lf-badge-event - Emitted for various component events
 */
@Component({
  tag: "lf-badge",
  styleUrl: "lf-badge.scss",
  shadow: true,
})
export class LfBadge implements LfBadgeInterface {
  /**
   * References the root HTML element of the component (<lf-badge>).
   */
  @Element() rootElement: LfBadgeElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * The props of the image displayed inside the badge.
   *
   * @type {LfImagePropsInterface}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfImageProps={{ lfValue: "path/to/image.png" }}></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfImageProps: LfImagePropsInterface = null;
  /**
   * The label displayed inside the badge.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfLabel="New"></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * The position of the badge in relation of its container.
   *
   * @type {LfBadgePositions}
   * @default "top-left"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfPosition="bottom-right"></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfPosition: LfBadgePositions = "top-left";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfStyle="color: red;"></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-badge lfUiSize="small"></lf-badge>
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
   * <lf-badge lfUiState="success"></lf-badge>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #core: LfCoreInterface;
  #b = LF_BADGE_BLOCKS;
  #lf = LF_ATTRIBUTES;
  #p = LF_BADGE_PARTS;
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
    eventName: "lf-badge-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfBadgeEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfBadgeEvent) {
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
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
   * @returns {Promise<LfBadgePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfBadgePropsInterface> {
    const entries = LF_BADGE_PROPS.map(
      (
        prop,
      ): [keyof LfBadgePropsInterface, LfBadgePropsInterface[typeof prop]] => [
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

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#core) {
      this.#core = getLfCore();
      this.debugInfo = this.#core.debug.info.create();
    }
    this.#core.theme.register(this);
  }
  componentDidLoad() {
    const { info } = this.#core.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#core.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#core.debug;

    info.update(this, "did-render");
  }
  render() {
    const { sanitizeProps, theme } = this.#core;
    const { bemClass, setLfStyle } = theme;
    const { lfImageProps, lfLabel, lfStyle } = this;

    const [ver, hor] = this.lfPosition.split("-");

    const { badge } = this.#b;

    return (
      <Host>
        <style id={this.#s}>
          {`
          :host {
          ${ver || "top"}: 0;
          ${hor || "left"}: 0;
          transform: translate(
          ${hor === "right" ? "50%" : "-50%"},
          ${ver === "bottom" ? "50%" : "-50%"}
          );
          }
          ${(lfStyle && setLfStyle(this)) || ""}`}
        </style>

        <div id={this.#w}>
          <div
            class={bemClass(badge._)}
            data-lf={this.#lf[this.lfUiState]}
            onClick={(e) => this.onLfEvent(e, "click")}
            part={this.#p.badge}
          >
            {lfLabel ||
              (lfImageProps && (
                <lf-image
                  class={bemClass(badge._, badge.image)}
                  part={this.#p.image}
                  {...sanitizeProps(lfImageProps, "LfImage")}
                ></lf-image>
              )) ||
              null}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#core;

    theme.unregister(this);
  }
  //#endregion
}

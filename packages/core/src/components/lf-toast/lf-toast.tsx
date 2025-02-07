import { getLfFramework } from "@lf-widgets/framework";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_STYLE_ID,
  LF_TOAST_BLOCKS,
  LF_TOAST_CSS_VARIABLES,
  LF_TOAST_PARTS,
  LF_TOAST_PROPS,
  LF_WRAPPER_ID,
  LfFrameworkInterface,
  LfDebugLifecycleInfo,
  LfThemeIcon,
  LfThemeUISize,
  LfThemeUIState,
  LfToastCloseCallback,
  LfToastElement,
  LfToastEvent,
  LfToastEventPayload,
  LfToastInterface,
  LfToastPropsInterface,
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

/**
 * The toast component displays a temporary message to the user.
 * The toast may include an icon, message, and close button.
 * The toast may also close automatically after a specified amount of time.
 *
 * @component
 * @tag lf-toast
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying temporary messages to the user.
 *
 * @example
 * <lf-toast lfMessage="Operation successful!" />
 *
 * @fires {CustomEvent} lf-toast-event - Emitted for various component events
 */
@Component({
  tag: "lf-toast",
  styleUrl: "lf-toast.scss",
  shadow: true,
})
export class LfToast implements LfToastInterface {
  /**
   * References the root HTML element of the component (<lf-toast>).
   */
  @Element() rootElement: LfToastElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * Sets the close icon of the toast.
   *
   * @type {string | LfThemeIcon}
   * @default ''
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfCloseIcon="delete" />
   * ```
   */
  @Prop({ mutable: true }) lfCloseIcon: string | LfThemeIcon = "";
  /**
   * Callback invoked when the toast is closed.
   *
   * @type {LfToastCloseCallback}
   * @default () => this.rootElement.remove()
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfCloseCallback={(toast, e) => console.log(toast, e)} />
   * ```
   */
  @Prop() lfCloseCallback: LfToastCloseCallback = (
    _toast: LfToast,
    _e: PointerEvent,
  ) => {
    this.unmount();
  };
  /**
   * Sets the icon of the toast.
   *
   * @type {string | LfThemeIcon}
   * @default ''
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfIcon="check" />
   * ```
   */
  @Prop({ mutable: true }) lfIcon: string | LfThemeIcon;
  /**
   * When lfTimer is set with a number, the toast will close itself after the specified amount of time (in ms).
   *
   * @type {number}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfTimer={3000} />
   * ```
   */
  @Prop() lfTimer: number = null;
  /**
   * Sets the message of the toast.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfMessage="Operation successful!" />
   * ```
   */
  @Prop({ mutable: true }) lfMessage: string = "";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfStyle="#lf-component { background-color: red; }" />
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
   * <lf-toast lfUiSize="small" />
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
   * <lf-toast lfUiState="success" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_TOAST_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_TOAST_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_TOAST_CSS_VARIABLES;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-toast-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfToastEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfToastEvent) {
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
   * Retrieves the debug information reflecting the current state of the component.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves to a LfDebugLifecycleInfo object containing debug information.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfToastPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfToastPropsInterface> {
    const entries = LF_TOAST_PROPS.map(
      (
        prop,
      ): [keyof LfToastPropsInterface, LfToastPropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Triggers a re-render of the component to reflect any state changes.
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
  #prepIcon = (isClose = false): VNode => {
    const { assets, theme } = this.#framework;
    const { get } = assets;
    const { bemClass } = theme;

    const { toast } = this.#b;
    const { style } = get(
      `./assets/svg/${isClose ? this.lfCloseIcon : this.lfIcon}.svg`,
    );

    return (
      <div
        class={bemClass(toast._, toast.icon, {
          "has-actions": isClose,
        })}
        data-cy={this.#cy.maskedSvg}
        onPointerDown={isClose ? (e) => this.lfCloseCallback(this, e) : null}
        part={this.#p.icon}
        style={style}
        tabIndex={isClose && 0}
      ></div>
    );
  };
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#framework) {
      this.#framework = getLfFramework();
      this.debugInfo = this.#framework.debug.info.create();
    }
    this.#framework.theme.register(this);
    if (this.lfCloseIcon === "") {
      const { "--lf-icon-delete": close } =
        this.#framework.theme.get.current().variables;
      this.lfCloseIcon = close;
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

    const { lfTimer } = this;

    if (lfTimer) {
      setTimeout(() => {
        if (this.lfCloseCallback) {
          this.lfCloseCallback(this, null);
        } else {
          this.unmount();
        }
      }, lfTimer);
    }

    info.update(this, "did-render");
  }
  render() {
    const { theme } = this.#framework;
    const { bemClass, setLfStyle } = theme;

    const { toast } = this.#b;
    const { lfCloseIcon, lfIcon, lfMessage, lfStyle, lfTimer } = this;

    return (
      <Host>
        <style id={this.#s}>
          {`
          :host {
            ${lfTimer ? `--${this.#v.timer}: ${lfTimer}ms;` : ""}
          }
        ${(lfStyle && setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w} data-lf={this.#lf.fadeIn}>
          <div class={bemClass(toast._)} data-lf={this.#lf[this.lfUiState]}>
            <div
              class={bemClass(toast._, toast.accent, { temporary: !!lfTimer })}
            ></div>
            <div
              class={bemClass(toast._, toast.messageWrapper, {
                full: Boolean(lfIcon) && Boolean(lfCloseIcon),
                "has-actions": Boolean(lfCloseIcon),
                "has-icon": Boolean(lfIcon),
              })}
            >
              {lfIcon && this.#prepIcon()}
              {lfMessage && (
                <div class={bemClass(toast._, toast.message)}>{lfMessage}</div>
              )}
              {lfCloseIcon && this.#prepIcon(true)}
            </div>
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#framework;

    theme.unregister(this);
  }
  //#endregion
}

import {
  LF_ATTRIBUTES,
  LF_SNACKBAR_BLOCKS,
  LF_SNACKBAR_CSS_VARIABLES,
  LF_SNACKBAR_PARTS,
  LF_SNACKBAR_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfIconType,
  LfSnackbarActionCallback,
  LfSnackbarElement,
  LfSnackbarEvent,
  LfSnackbarEventPayload,
  LfSnackbarInterface,
  LfSnackbarPositions,
  LfSnackbarPropsInterface,
  LfThemeIcon,
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
  VNode,
} from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { awaitFramework } from "../../utils/setup";

/**
 * The snackbar component displays a brief notification message at screen edges.
 * The snackbar may include an icon, message, optional action button, and close button.
 * The snackbar may close automatically after a specified amount of time or persist until user action.
 *
 * @component
 * @tag lf-snackbar
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying brief actionable notifications to the user.
 *
 * @example
 * <lf-snackbar lfMessage="File saved successfully" lfAction="Undo" />
 *
 * @fires {CustomEvent} lf-snackbar-event - Emitted for various component events
 */
@Component({
  tag: "lf-snackbar",
  styleUrl: "lf-snackbar.scss",
  shadow: true,
})
export class LfSnackbar implements LfSnackbarInterface {
  /**
   * References the root HTML element of the component (<lf-snackbar>).
   */
  @Element() rootElement: LfSnackbarElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * Text label for action button. If omitted, no action button appears.
   *
   * @type {string}
   * @default undefined
   *
   * @example
   * ```tsx
   * <lf-snackbar lfAction="Undo" />
   * ```
   */
  @Prop() lfAction?: string;
  /**
   * Callback invoked when the action button is clicked.
   * Receives snackbar instance and pointer event.
   *
   * @type {LfSnackbarActionCallback}
   * @default () => this.unmount()
   *
   * @example
   * ```tsx
   * <lf-snackbar lfActionCallback={(snackbar, e) => console.log(snackbar, e)} />
   * ```
   */
  @Prop() lfActionCallback: LfSnackbarActionCallback = (
    _snackbar: LfSnackbar,
    _e: PointerEvent,
  ) => {
    this.unmount();
  };
  /**
   * Icon shown in the close button.
   *
   * @type {string | LfThemeIcon}
   * @default ''
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfCloseIcon="close" />
   * ```
   */
  @Prop({ mutable: true }) lfCloseIcon: string | LfThemeIcon = "";
  /**
   * Auto-dismiss duration in milliseconds. Set to 0 to disable auto-dismiss.
   *
   * @type {number}
   * @default 4000
   *
   * @example
   * ```tsx
   * <lf-snackbar lfDuration={5000} />
   * ```
   */
  @Prop() lfDuration: number = 4000;
  /**
   * Optional icon shown at the start of the snackbar.
   *
   * @type {string | LfThemeIcon}
   * @default undefined
   *
   * @example
   * ```tsx
   * <lf-snackbar lfIcon="check" />
   * ```
   */
  @Prop({ mutable: true }) lfIcon?: string | LfThemeIcon;
  /**
   * Message text displayed in the snackbar.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfMessage="Operation successful!" />
   * ```
   */
  @Prop({ mutable: true }) lfMessage: string = "";
  /**
   * Positioning of the snackbar on screen.
   *
   * @type {LfSnackbarPositions}
   * @default "bottom-center"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfPosition="bottom-left" />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfPosition: LfSnackbarPositions =
    "bottom-center";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfStyle="#lf-component { background-color: red; }" />
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
   * <lf-snackbar lfUiSize="small" />
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
   * <lf-snackbar lfUiState="success" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_SNACKBAR_BLOCKS;
  #lf = LF_ATTRIBUTES;
  #p = LF_SNACKBAR_PARTS;
  #s = LF_STYLE_ID;
  #timerRef: ReturnType<typeof setTimeout> | null = null;
  #v = LF_SNACKBAR_CSS_VARIABLES;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-snackbar-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfSnackbarEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfSnackbarEvent) {
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
   * @returns {Promise<LfSnackbarPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfSnackbarPropsInterface> {
    const entries = LF_SNACKBAR_PROPS.map(
      (
        prop,
      ): [
        keyof LfSnackbarPropsInterface,
        LfSnackbarPropsInterface[typeof prop],
      ] => [prop, this[prop]],
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
    if (this.#timerRef !== null) {
      clearTimeout(this.#timerRef);
      this.#timerRef = null;
    }

    setTimeout(() => {
      this.onLfEvent(new CustomEvent("unmount"), "unmount");
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  #handleActionClick = (e: PointerEvent) => {
    e.stopPropagation();
    this.onLfEvent(e, "action");
    this.lfActionCallback(this, e);
  };
  #handleCloseClick = (e: PointerEvent) => {
    e.stopPropagation();
    this.onLfEvent(e, "close");
    this.unmount();
  };
  #prepIcon = (isClose = false): VNode => {
    const { theme } = this.#framework;
    const { bemClass } = theme;

    const { snackbar } = this.#b;
    const icon = isClose ? this.lfCloseIcon : this.lfIcon;

    return (
      <div
        class={bemClass(
          snackbar._,
          isClose ? snackbar.closeButton : snackbar.icon,
        )}
        onPointerDown={isClose ? this.#handleCloseClick : null}
        part={isClose ? this.#p.closeButton : this.#p.icon}
        tabIndex={isClose ? 0 : undefined}
      >
        <FIcon framework={this.#framework} icon={icon as LfIconType} />
      </div>
    );
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

    if (this.lfCloseIcon === "") {
      const { "--lf-icon-delete": close } =
        this.#framework.theme.get.current().variables;
      this.lfCloseIcon = close;
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    if (this.lfDuration > 0) {
      this.#timerRef = setTimeout(() => {
        this.unmount();
      }, this.lfDuration);
    }

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
    const { theme } = this.#framework;
    const { bemClass, setLfStyle } = theme;

    const { snackbar } = this.#b;
    const { lfAction, lfCloseIcon, lfDuration, lfIcon, lfMessage, lfStyle } =
      this;

    return (
      <Host>
        <style id={this.#s}>
          {`
          :host {
            ${lfDuration > 0 ? `${this.#v.duration}: ${lfDuration}ms;` : ""}
          }
        ${(lfStyle && setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w} data-lf={this.#lf.fadeIn}>
          <div class={bemClass(snackbar._)} data-lf={this.#lf[this.lfUiState]}>
            <div
              class={bemClass(snackbar._, snackbar.content, {
                "has-icon": Boolean(lfIcon),
              })}
            >
              {lfIcon && this.#prepIcon()}
              {lfMessage && (
                <div
                  class={bemClass(snackbar._, snackbar.message)}
                  part={this.#p.message}
                >
                  {lfMessage}
                </div>
              )}
            </div>
            {(lfAction || lfCloseIcon) && (
              <div class={bemClass(snackbar._, snackbar.actions)}>
                {lfAction && (
                  <button
                    class={bemClass(snackbar._, snackbar.actionButton)}
                    onPointerDown={this.#handleActionClick}
                    part={this.#p.actionButton}
                    type="button"
                  >
                    {lfAction}
                  </button>
                )}
                {lfCloseIcon && this.#prepIcon(true)}
              </div>
            )}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    if (this.#timerRef !== null) {
      clearTimeout(this.#timerRef);
      this.#timerRef = null;
    }

    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

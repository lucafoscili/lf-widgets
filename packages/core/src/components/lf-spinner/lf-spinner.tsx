import {
  LF_SPINNER_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfSpinnerElement,
  LfSpinnerEvent,
  LfSpinnerEventPayload,
  LfSpinnerInterface,
  LfSpinnerPropsInterface,
  onFrameworkReady,
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
import { LF_SPINNER_BARS } from "./helpers.bar";
import { LF_SPINNER_WIDGETS } from "./helpers.widget";

/**
 * The spinner component displays a loading animation to indicate that a process is underway.
 * The spinner may be displayed as a bar or a spinner, and may include a progress bar.
 *
 * @component
 * @tag lf-spinner
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying a loading animation.
 *
 * @example
 * <lf-spinner lfActive={true}></lf-spinner>
 *
 * @fires {CustomEvent} lf-spinner-event - Emitted for various component events
 */
@Component({
  tag: "lf-spinner",
  styleUrl: "lf-spinner.scss",
  shadow: true,
})
export class LfSpinner implements LfSpinnerInterface {
  /**
   * References the root HTML element of the component (<lf-spinner>).
   */
  @Element() rootElement: LfSpinnerElement;

  //#region States
  @State() bigWait = false;
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() progress = 0;
  //#endregion

  //#region Props
  /**
   * Specifies if the spinner is animating.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfActive={true}></lf-spinner>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfActive: boolean = false;
  /**
   * Controls if the component displays as a bar or a spinner.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfBarVariant={true}></lf-spinner>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfBarVariant: boolean = false;
  /**
   * Defines the width and height of the spinner.
   * In the bar variant, it specifies only the height.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfDimensions="2em"></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfDimensions: string = "";
  /**
   * Applies a blending modal over the component to darken or lighten the view, based on the theme.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfFader={true}></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfFader: boolean = false;
  /**
   * Duration needed for the fader to become active.
   *
   * @type {number}
   * @default 3500
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfFaderTimeout={5000}></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfFaderTimeout: number = 3500;
  /**
   * Fills the entire viewport when enabled.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfFullScreen={true}></lf-spinner>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfFullScreen: boolean = false;
  /**
   * Selects the spinner layout.
   *
   * @type {number}
   * @default 1
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfLayout={2}></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfLayout: number = 1;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfStyle="#loading-wrapper-master { background-color: #f00; }"></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Duration for the progress bar to fill up (in milliseconds).
   *
   * @type {number}
   * @default 0
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfTimeout={5000}></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfTimeout: number = 0;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #progressAnimationFrame: number;
  //#endregion

  //#region Watchers
  @Watch("lfBarVariant")
  lfBarVariantChanged(newValue: boolean) {
    if (newValue && this.lfTimeout) {
      this.#startProgressBar();
    } else {
      this.progress = 0;
      cancelAnimationFrame(this.#progressAnimationFrame);
    }
  }
  @Watch("lfTimeout")
  lfTimeoutChanged(newValue: number, oldValue: number) {
    if (newValue !== oldValue && this.lfBarVariant) {
      this.#startProgressBar();
    }
  }
  //#endregion

  //#region Event
  @Event({
    eventName: "lf-spinner-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfSpinnerEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfSpinnerEvent) {
    this.lfEvent.emit({
      comp: this,
      id: this.rootElement.id,
      originalEvent: e,
      eventType,
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
   * @returns {Promise<LfSpinnerPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfSpinnerPropsInterface> {
    const entries = LF_SPINNER_PROPS.map(
      (
        prop,
      ): [
        keyof LfSpinnerPropsInterface,
        LfSpinnerPropsInterface[typeof prop],
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
  //#endregion

  //#region Private methods
  #onFrameworkReady = async () => {
    this.#framework = await onFrameworkReady;
    this.debugInfo = this.#framework.debug.info.create();
    this.#framework.theme.register(this);
  };
  #startProgressBar() {
    this.progress = 0;
    const startTime = Date.now();
    const duration = this.lfTimeout;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      this.progress = Math.min((elapsed / duration) * 100, 100);

      if (this.progress < 100) {
        this.#progressAnimationFrame = requestAnimationFrame(updateProgress);
      } else {
        cancelAnimationFrame(this.#progressAnimationFrame);
      }
    };

    this.#progressAnimationFrame = requestAnimationFrame(updateProgress);
  }
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    await this.#onFrameworkReady();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    const { lfBarVariant, lfTimeout } = this;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");

    if (lfBarVariant && lfTimeout) {
      this.#startProgressBar();
    }
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentWillUpdate() {
    if (this.lfFader) {
      this.bigWait = false;
    }
  }
  componentDidRender() {
    const { info } = this.#framework.debug;

    const root = this.rootElement.shadowRoot;

    if (root) {
      if (this.lfFader && this.lfActive) {
        setTimeout(() => {
          this.bigWait = true;
        }, this.lfFaderTimeout);
      }
    }

    info.update(this, "did-render");
  }
  render() {
    const { setLfStyle } = this.#framework.theme;

    const {
      bigWait,
      lfBarVariant,
      lfDimensions,
      lfFullScreen,
      lfLayout,
      lfStyle,
      progress,
    } = this;

    const elStyle: Record<string, string | undefined> = {
      height: lfFullScreen ? undefined : "100%",
      width: lfFullScreen ? undefined : "100%",
      fontSize: lfDimensions || (lfBarVariant ? "0.25em" : ".875em"),
    };

    const config = lfBarVariant
      ? LF_SPINNER_BARS[lfLayout]
      : LF_SPINNER_WIDGETS[lfLayout];

    const wrapperClass = lfBarVariant
      ? "loading-wrapper-master-bar"
      : "loading-wrapper-master-spinner";

    const masterClass = {
      "spinner-version": !lfBarVariant,
      "big-wait": bigWait,
    };

    const spinnerClass =
      config?.className || `spinner-${lfBarVariant ? "bar-v" : "v"}${lfLayout}`;
    const spinnerEl = config?.elements(progress) || [];

    return (
      <Host style={elStyle}>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w} style={elStyle}>
          <div
            id="loading-wrapper-master"
            class={{
              ...masterClass,
            }}
            style={elStyle}
          >
            <div id={wrapperClass} style={elStyle}>
              <div class={spinnerClass}>{spinnerEl}</div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#framework;

    theme.unregister(this);
    cancelAnimationFrame(this.#progressAnimationFrame);
  }
}

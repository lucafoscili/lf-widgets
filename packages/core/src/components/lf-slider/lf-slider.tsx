import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_SLIDER_BLOCKS,
  LF_SLIDER_CSS_VARIABLES,
  LF_SLIDER_PARTS,
  LF_SLIDER_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfSliderElement,
  LfSliderEvent,
  LfSliderEventPayload,
  LfSliderInterface,
  LfSliderPropsInterface,
  LfSliderValue,
  LfThemeUISize,
  LfThemeUIState,
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
} from "@stencil/core";

/**
 * The slider component allows users to select a value within a defined range.
 * The slider may be horizontal or vertical, and may include a label or icon.
 *
 * @component
 * @tag lf-slider
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for selecting values within a range.
 *
 * @example
 * <lf-slider lfValue={50}></lf-slider>
 *
 * @fires {CustomEvent} lf-slider-event - Emitted for various component events
 */
@Component({
  tag: "lf-slider",
  styleUrl: "lf-slider.scss",
  shadow: true,
})
export class LfSlider implements LfSliderInterface {
  @Element() rootElement: LfSliderElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value: LfSliderValue = { display: 0, real: 0 };
  //#endregion

  //#region Props
  /**
   * Defines text to display as a label for the slider.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-slider lfLabel="Volume" />
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * When true, displays the label before the slider component.
   * Defaults to `false`.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-slider lfLeadingLabel={true} />
   * ```
   */
  @Prop({ mutable: true }) lfLeadingLabel: boolean = false;
  /**
   * The maximum value allowed by the slider.
   *
   * @type {number}
   * @default 100
   *
   * @example
   * ```tsx
   * <lf-slider lfMax={100} />
   * ```
   */
  @Prop({ mutable: false }) lfMax: number = 100;
  /**
   * The minimum value allowed by the slider.
   *
   * @type {number}
   * @default 0
   *
   * @example
   * ```tsx
   * <lf-slider lfMin={0} />
   * ```
   */
  @Prop({ mutable: false }) lfMin: number = 0;
  /**
   * Sets the increment or decrement steps when moving the slider.
   *
   * @type {number}
   * @default 1
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-slider lfStep={1} />
   * ```
   */
  @Prop({ mutable: false }) lfStep: number = 1;
  /**
   * Adds a ripple effect when interacting with the slider.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-slider lfRipple={true} />
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-slider lfStyle="#lf-component { color: red; }" />
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
   * <lf-slider lfUiSize="small" />
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
   * <lf-slider lfUiState="secondary" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * The initial numeric value for the slider within the defined range.
   *
   * @type {number}
   * @default 50
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-slider lfValue={50} />
   * ```
   */
  @Prop({ mutable: true }) lfValue: number = 50;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_SLIDER_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_SLIDER_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_SLIDER_CSS_VARIABLES;
  #w = LF_WRAPPER_ID;
  #input: HTMLInputElement;
  #r: HTMLElement;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-slider-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfSliderEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfSliderEvent) {
    const { effects } = this.#framework;

    switch (eventType) {
      case "change":
        this.setValue(+this.#input.value);
        this.refresh();
        break;
      case "input":
        this.value.display = +this.#input.value;
        this.refresh();
        break;
      case "pointerdown":
        if (this.lfRipple) {
          effects.ripple(e as PointerEvent, this.#r);
        }
    }
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      value: this.value,
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
   * @returns {Promise<LfSliderPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfSliderPropsInterface> {
    const entries = LF_SLIDER_PROPS.map(
      (
        prop,
      ): [
        keyof LfSliderPropsInterface,
        LfSliderPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Used to retrieve the component's current state.
   * @returns {Promise<LfSliderState>} Promise resolved with the current state of the component.
   */
  @Method()
  async getValue(): Promise<LfSliderValue> {
    return this.value;
  }
  /**
   * This method is used to trigger a new render of the component.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Sets the component's state.
   * @param {LfSliderState} value - The new state to be set on the component.
   * @returns {Promise<void>}
   */
  @Method()
  async setValue(value: number): Promise<void> {
    this.value = { display: value, real: value };
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
  #isDisabled = (): boolean => {
    return this.lfUiState === "disabled";
  };
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    await this.#onFrameworkReady();
    const { lfValue } = this;

    if (lfValue) {
      this.setValue(lfValue);
    }
  }
  componentDidLoad() {
    const { debug } = this.#framework;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    debug.info.update(this, "did-load");
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
    const { bemClass, setLfStyle } = this.#framework.theme;

    const { formField, slider } = this.#b;
    const {
      lfLabel,
      lfLeadingLabel,
      lfMax,
      lfMin,
      lfRipple,
      lfStep,
      lfStyle,
      value,
    } = this;

    return (
      <Host>
        <style id={this.#s}>
          {`
            :host {
              ${this.#v.value}: ${((value.display - lfMin) / (lfMax - lfMin)) * 100}%;
            }
          ${(lfStyle && setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w}>
          <div
            class={bemClass(formField._, null, {
              leading: lfLeadingLabel,
            })}
            part={this.#p.formField}
          >
            <div
              class={bemClass(slider._, null, {
                "has-value": value.display > lfMin,
                disabled: this.#isDisabled(),
              })}
              data-lf={this.#lf[this.lfUiState]}
              part={this.#p.slider}
            >
              <input
                type="range"
                class={bemClass(slider._, slider.nativeControl)}
                data-cy={this.#cy.input}
                disabled={this.#isDisabled()}
                max={lfMax}
                min={lfMin}
                onBlur={(e) => {
                  this.onLfEvent(e, "blur");
                }}
                onChange={(e) => {
                  this.onLfEvent(e, "change");
                }}
                onFocus={(e) => {
                  this.onLfEvent(e, "focus");
                }}
                onInput={(e) => {
                  this.onLfEvent(e, "input");
                }}
                onPointerDown={(e) => {
                  this.onLfEvent(e, "pointerdown");
                }}
                part={this.#p.nativeControl}
                ref={(el) => {
                  if (el) {
                    this.#input = el;
                  }
                }}
                step={lfStep}
                value={value.real}
              />
              <div class={bemClass(slider._, slider.track)}>
                <div class={bemClass(slider._, slider.thumbUnderlay)}>
                  <div
                    class={bemClass(slider._, slider.thumb)}
                    data-cy={this.#cy.rippleSurface}
                    data-lf={this.#lf.rippleSurface}
                    part={this.#p.thumb}
                    ref={(el) => {
                      if (lfRipple) {
                        this.#r = el;
                      }
                    }}
                  ></div>
                </div>
              </div>
              <span
                class={bemClass(slider._, slider.value)}
                part={this.#p.value}
              >
                {value.display}
              </span>
            </div>
            <label
              class={bemClass(formField._, formField.label)}
              part={this.#p.label}
            >
              {lfLabel}
            </label>
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { theme } = this.#framework;

    theme.unregister(this);
  }
}
//#endregion

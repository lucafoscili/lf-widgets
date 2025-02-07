import { getLfFramework } from "@lf-widgets/framework";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_STYLE_ID,
  LF_TOGGLE_BLOCKS,
  LF_TOGGLE_PARTS,
  LF_TOGGLE_PROPS,
  LF_WRAPPER_ID,
  LfFrameworkInterface,
  LfDebugLifecycleInfo,
  LfThemeUISize,
  LfThemeUIState,
  LfToggleElement,
  LfToggleEvent,
  LfToggleEventPayload,
  LfToggleInterface,
  LfTogglePropsInterface,
  LfToggleState,
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
 * The toggle component is a switch that can be toggled on or off.
 * The toggle may include a label to provide context for the user.
 * The toggle may also include a ripple effect when clicked.
 *
 * @component
 * @tag lf-toggle
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for toggling a boolean state.
 *
 * @example
 * <lf-toggle lfLabel="Enable feature"></lf-toggle>
 *
 * @fires {CustomEvent} lf-toggle-event - Emitted for various component events
 */
@Component({
  tag: "lf-toggle",
  styleUrl: "lf-toggle.scss",
  shadow: true,
})
export class LfToggle implements LfToggleInterface {
  /**
   * References the root HTML element of the component (<lf-toggle>).
   */
  @Element() rootElement: LfToggleElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value: LfToggleState = "off";
  //#endregion

  //#region Props
  /**
   * Defines text to display along with the toggle.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toggle lfLabel="Enable feature"></lf-toggle>
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * Defaults at false. When set to true, the label will be displayed before the component.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toggle lfLeadingLabel={true} lfLabel="Enable feature"></lf-toggle>
   * ```
   */
  @Prop({ mutable: true }) lfLeadingLabel: boolean = false;
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toggle lfRipple={false}></lf-toggle>
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
   * <lf-toggle lfStyle="#lf-component { color: red; }"></lf-toggle>
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
   * <lf-toggle lfUiSize="small"></lf-toggle>
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
   * <lf-toggle lfUiState="secondary"></lf-toggle>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial boolean state of the toggle.
   *
   * @type {boolean}
   * @default false
   *
   * @example
   * ```tsx
   * <lf-toggle lfValue={true}></lf-toggle>
   * ```
   */
  @Prop({ mutable: false }) lfValue: boolean = false;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_TOGGLE_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_TOGGLE_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #r: HTMLDivElement;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-toggle-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfToggleEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfToggleEvent) {
    const { effects } = this.#framework;

    const { lfRipple, value } = this;

    switch (eventType) {
      case "pointerdown":
        if (lfRipple) {
          effects.ripple(e as PointerEvent, this.#r);
        }
        break;
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      value: value,
      valueAsBoolean: value === "on" ? true : false,
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
   * @returns {Promise<LfTogglePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfTogglePropsInterface> {
    const entries = LF_TOGGLE_PROPS.map(
      (
        prop,
      ): [
        keyof LfTogglePropsInterface,
        LfTogglePropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Used to retrieve the component's current state.
   * @returns {Promise<LfToggleState>} Promise resolved with the current state of the component.
   */
  @Method()
  async getValue(): Promise<LfToggleState> {
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
   * @param {LfToggleState} value - The new state to be set on the component.
   * @returns {Promise<void>}
   */
  @Method()
  async setValue(value: LfToggleState | boolean): Promise<void> {
    this.#updateState(value);
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
  #isDisabled = () => {
    return this.lfUiState === "disabled";
  };
  #isOn = () => {
    return this.value === "on" ? true : false;
  };
  #isValidValue = (value: LfToggleState) => {
    return value === "off" || value === "on";
  };
  #updateState = (
    value: LfToggleState | boolean,
    e: CustomEvent<unknown> | Event = new CustomEvent("change"),
  ) => {
    if (typeof value === "boolean") {
      value = value ? "on" : "off";
    }

    const shouldUpdate = !this.#isDisabled() && this.#isValidValue(value);
    if (shouldUpdate) {
      this.value = value;
      this.onLfEvent(e, "change");
    }
  };
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#framework) {
      this.#framework = getLfFramework();
      this.debugInfo = this.#framework.debug.info.create();
    }
    this.#framework.theme.register(this);
  }
  componentWillLoad() {
    if (this.lfValue) {
      this.value = "on";
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

    const { formField, toggle } = this.#b;
    const { lfLabel, lfLeadingLabel, lfRipple, lfStyle, value } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(formField._, null, {
              leading: lfLeadingLabel,
            })}
          >
            <div
              class={bemClass(toggle._, null, {
                active: this.#isOn(),
              })}
              data-lf={this.#lf[this.lfUiState]}
              part={this.#p.toggle}
            >
              <div
                class={bemClass(toggle._, toggle.track)}
                part={this.#p.track}
              ></div>
              <div class={bemClass(toggle._, toggle.thumbUnderlay)}>
                <div class={bemClass(toggle._, toggle.thumb)}>
                  <div
                    data-cy={this.#cy.rippleSurface}
                    data-lf={this.#lf.rippleSurface}
                    ref={(el) => {
                      if (el && lfRipple) {
                        this.#r = el;
                      }
                    }}
                  ></div>
                </div>
                <input
                  class={bemClass(toggle._, toggle.nativeControl)}
                  checked={this.#isOn()}
                  data-cy={this.#cy.input}
                  disabled={this.#isDisabled()}
                  onBlur={(e) => {
                    this.onLfEvent(e, "blur");
                  }}
                  onChange={(e) => {
                    this.#updateState(this.#isOn() ? "off" : "on", e);
                  }}
                  onFocus={(e) => {
                    this.onLfEvent(e, "focus");
                  }}
                  onPointerDown={(e) => {
                    this.onLfEvent(e, "pointerdown");
                  }}
                  part={this.#p.nativeControl}
                  role="toggle"
                  type="checkbox"
                  value={value ? "on" : "off"}
                ></input>
              </div>
            </div>
            <label
              class={bemClass(formField._, formField.label)}
              onClick={(e) => {
                this.onLfEvent(e, "change");
              }}
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
  //#endregion
}

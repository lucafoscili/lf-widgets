import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CHECKBOX_BLOCKS,
  LF_CHECKBOX_PARTS,
  LF_CHECKBOX_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCheckboxElement,
  LfCheckboxEvent,
  LfCheckboxEventPayload,
  LfCheckboxInterface,
  LfCheckboxPropsInterface,
  LfCheckboxState,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
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
import { awaitFramework } from "../../utils/setup";

/**
 * The checkbox component is a three-state selection control.
 * It supports unchecked, checked, and indeterminate states.
 * The checkbox features Material Design-inspired animations and styling.
 *
 * @component
 * @tag lf-checkbox
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for three-state selection.
 *
 * @example
 * <lf-checkbox lfLabel="Accept terms and conditions"></lf-checkbox>
 *
 * @fires {CustomEvent} lf-checkbox-event - Emitted for various component events
 */
@Component({
  tag: "lf-checkbox",
  styleUrl: "lf-checkbox.scss",
  shadow: true,
})
export class LfCheckbox implements LfCheckboxInterface {
  /**
   * References the root HTML element of the component (<lf-checkbox>).
   */
  @Element() rootElement: LfCheckboxElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value: LfCheckboxState = "off";
  //#endregion

  //#region Props
  /**
   * Explicit accessible label for the checkbox control. Fallback chain when empty:
   * lfLabel -> root element id -> 'checkbox'. Applied to the native input element.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfAriaLabel: string = "";
  /**
   * Defines text to display along with the checkbox.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * When set to true, the label will be displayed before the checkbox.
   *
   * @type {boolean}
   * @default false
   * @mutable
   */
  @Prop({ mutable: true }) lfLeadingLabel: boolean = false;
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Reflects the specified state color defined by the theme.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";

  /**
   * Sets the initial boolean state of the checkbox.
   * Set to null for indeterminate state.
   *
   * @type {boolean}
   * @default false
   */
  @Prop({ mutable: false }) lfValue: boolean | null = false;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_CHECKBOX_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_CHECKBOX_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #r: HTMLDivElement;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string and state information.
   */
  @Event({
    eventName: "lf-checkbox-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfCheckboxEventPayload>;

  onLfEvent(e: Event | CustomEvent, eventType: LfCheckboxEvent) {
    const { effects } = this.#framework;
    const { lfRipple, value } = this;

    switch (eventType) {
      case "change": {
        if (!this.#isDisabled()) {
          if (this.value === "indeterminate" || this.value === "off") {
            this.value = "on";
          } else {
            this.value = "off";
          }
        }
        break;
      }
      case "pointerdown": {
        if (lfRipple) {
          effects.ripple(e as PointerEvent, this.#r);
        }
        break;
      }
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      value: value,
      valueAsBoolean: value === "on",
      isIndeterminate: value === "indeterminate",
    });
  }
  //#endregion

  //#region Public methods
  /**
   * Fetches debug information of the component's current state.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }

  /**
   * Used to retrieve component's properties and descriptions.
   */
  @Method()
  async getProps(): Promise<LfCheckboxPropsInterface> {
    const entries = LF_CHECKBOX_PROPS.map(
      (
        prop,
      ): [
        keyof LfCheckboxPropsInterface,
        LfCheckboxPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }

  /**
   * Retrieves the current value of the checkbox.
   */
  @Method()
  async getValue(): Promise<LfCheckboxState> {
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
   * Sets the value of the checkbox.
   * @param {LfCheckboxState | boolean} value - The value to set (true, false, or null for indeterminate)
   */
  @Method()
  async setValue(value: LfCheckboxState | boolean): Promise<void> {
    if (value === true || value === "on") {
      this.value = "on";
    } else if (value === false || value === "off") {
      this.value = "off";
    } else {
      this.value = "indeterminate";
    }
  }

  /**
   * Initiates the unmount sequence, removing the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds to wait before unmounting
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.onLfEvent(new CustomEvent("unmount"), "unmount");
        this.rootElement.remove();
        resolve();
      }, ms);
    });
  }

  //#region Private methods
  #isChecked = () => {
    return this.value === "on";
  };

  #isDisabled = () => {
    return this.lfUiState === "disabled";
  };

  #isIndeterminate = () => {
    return this.value === "indeterminate";
  };

  #prepBackground = (): VNode => {
    const { bemClass } = this.#framework.theme;
    const { checkbox } = this.#b;
    const { background, checkmark, mixedmark } = this.#p;

    return (
      <div class={bemClass(checkbox._, checkbox.background)} part={background}>
        <svg
          class={bemClass(checkbox._, checkbox.checkmark)}
          viewBox="0 0 24 24"
          part={checkmark}
        >
          <path
            class={bemClass(checkbox._, "checkmark-path")}
            fill="none"
            d="M4.1,12.7 9,17.6 20.3,6.3"
            stroke="currentColor"
          />
        </svg>
        <div
          class={bemClass(checkbox._, checkbox.mixedmark)}
          part={mixedmark}
        />
      </div>
    );
  };

  #prepInput = (): VNode => {
    const { bemClass } = this.#framework.theme;
    const { checkbox } = this.#b;
    const { nativeControl } = this.#p;

    const isChecked = this.#isChecked();
    const isIndeterminate = this.#isIndeterminate();
    const isDisabled = this.#isDisabled();
    const ariaLabel =
      this.lfAriaLabel || this.lfLabel || this.rootElement.id || "checkbox";

    return (
      <input
        aria-label={ariaLabel}
        aria-checked={isIndeterminate ? "mixed" : isChecked}
        class={bemClass(checkbox._, checkbox.nativeControl)}
        checked={isChecked}
        data-cy={this.#cy.input}
        disabled={isDisabled}
        indeterminate={isIndeterminate}
        onFocus={(e) => this.onLfEvent(e, "focus")}
        onBlur={(e) => this.onLfEvent(e, "blur")}
        part={nativeControl}
        type="checkbox"
        value={isIndeterminate ? "indeterminate" : isChecked ? "on" : "off"}
      />
    );
  };

  #prepLabel = (): VNode => {
    const { bemClass } = this.#framework.theme;

    return (
      <label
        class={bemClass(this.#b.formField._, this.#b.formField.label)}
        onClick={(e) => this.onLfEvent(e, "change")}
        part={this.#p.label}
      >
        {this.lfLabel}
      </label>
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

    if (this.lfValue) {
      this.value = "on";
    } else if (this.lfValue === null) {
      this.value = "indeterminate";
    } else {
      this.value = "off";
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
    const { bemClass } = this.#framework.theme;
    const { lfLabel, lfLeadingLabel, lfStyle } = this;
    const { formField, checkbox } = this.#b;

    return (
      <Host id={this.#w}>
        {lfStyle && <style id={this.#s}>{lfStyle}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(formField._, null, {
              leading: lfLeadingLabel,
            })}
            data-lf={this.#lf[this.lfUiState]}
          >
            <div
              class={bemClass(checkbox._, null, {
                checked: this.#isChecked(),
                indeterminate: this.#isIndeterminate(),
                disabled: this.#isDisabled(),
              })}
              ref={(el) => (this.#r = el)}
              onClick={(e) => this.onLfEvent(e, "change")}
              onPointerDown={(e) => this.onLfEvent(e, "pointerdown")}
              part={this.#p.checkbox}
              data-cy={this.#cy.input}
            >
              {this.#prepInput()}
              {this.#prepBackground()}
            </div>

            {lfLabel && this.#prepLabel()}
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

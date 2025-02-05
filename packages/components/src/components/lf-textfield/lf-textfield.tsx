import { getLfCore } from "../../index";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_STYLE_ID,
  LF_TEXTFIELD_BLOCKS,
  LF_TEXTFIELD_PARTS,
  LF_TEXTFIELD_PROPS,
  LF_WRAPPER_ID,
  LfCoreAllowedKeysMap,
  LfCoreInterface,
  LfDebugLifecycleInfo,
  LfTextfieldElement,
  LfTextfieldEvent,
  LfTextfieldEventPayload,
  LfTextfieldHelper,
  LfTextfieldInterface,
  LfTextfieldModifiers,
  LfTextfieldPropsInterface,
  LfTextfieldStyling,
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

/**
 * Represents the text field component, which allows users to input text or data.
 * The text field may include an icon, label, helper text, and a character counter.
 *
 * @component
 * @tag lf-textfield
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying a text field with an icon, label, and helper text.
 *
 * @example
 * <lf-textfield lfLabel="Username" />
 *
 * @fires {CustomEvent} lf-textfield-event - Emitted for various component events
 */
@Component({
  tag: "lf-textfield",
  styleUrl: "lf-textfield.scss",
  shadow: true,
})
export class LfTextfield implements LfTextfieldInterface {
  /**
   * References the root HTML element of the component (<lf-textfield>).
   */
  @Element() rootElement: LfTextfieldElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() status: Set<LfTextfieldModifiers> = new Set();
  @State() value = "";
  //#endregion

  //#region Props
  /**
   * Sets the helper text for the text field.
   * The helper text can provide additional information or instructions to the user.
   *
   * @type {LfTextfieldHelper}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfHelper={{ value: "Please enter your message", showWhenFocused: true }} />
   * ```
   */
  @Prop({ mutable: true }) lfHelper: LfTextfieldHelper = null;
  /**
   * Allows customization of the input or textarea element through additional HTML attributes.
   * This can include attributes like 'readonly', 'placeholder', etc., to further customize the behavior or appearance of the input.
   *
   * @type {Partial<LfCoreAllowedKeysMap>}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfHtmlAttributes={{ maxLength: 100 }} />
   * ```
   */
  @Prop({ mutable: true }) lfHtmlAttributes: Partial<LfCoreAllowedKeysMap>;
  /**
   * Sets the icon to be displayed within the text field.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfIcon="search" />
   * ```
   */
  @Prop({ mutable: true }) lfIcon: string = "";
  /**
   * Sets the label for the text field.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfLabel="Username" />
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * Sets the text field to fill the available width of its container.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfStretchX={true} />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfStretchX: boolean = false;
  /**
   * Sets the text field to fill the available height of its container.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfStretchY={true} />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfStretchY: boolean = false;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfStyle="#lf-component { color: red; }" />
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Sets the styling variant for the text field.
   *
   * @type {LfTextfieldStyling}
   * @default "raised"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfStyling="outlined" />
   * ```
   */
  @Prop({ mutable: true }) lfStyling: LfTextfieldStyling = "raised";
  /**
   * When enabled, the text field's icon will be displayed on the trailing side.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfIcon="search" lfTrailingIcon={true} />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfTrailingIcon: boolean = false;
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfUiSize="small" />
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
   * <lf-textfield lfUiState="error" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial value of the text field.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-textfield lfValue="initial value" />
   * ```
   */
  @Prop({ mutable: false }) lfValue: string = "";
  //#endregion

  //#region Internal variables
  #core: LfCoreInterface;
  #b = LF_TEXTFIELD_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_TEXTFIELD_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #hasOutline: boolean;
  #icon: HTMLDivElement;
  #input: HTMLInputElement | HTMLTextAreaElement;
  #maxLength: number;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-textfield-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfTextfieldEventPayload>;
  onLfEvent(
    e: Event | CustomEvent,
    eventType: LfTextfieldEvent,
    isIcon = false,
  ) {
    const target = e.target as HTMLInputElement;
    const inputValue = target?.value;

    switch (eventType) {
      case "blur":
        this.status.delete("focused");
        this.status = new Set(this.status);
        break;
      case "focus":
        this.status.add("focused");
        this.status = new Set(this.status);
        break;
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      inputValue,
      target: isIcon ? this.#icon : this.#input,
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
   * @returns {Promise<LfTextfieldPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfTextfieldPropsInterface> {
    const entries = LF_TEXTFIELD_PROPS.map(
      (
        prop,
      ): [
        keyof LfTextfieldPropsInterface,
        LfTextfieldPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Used to retrieve the component's current state.
   * @returns {Promise<string>} Promise resolved with the current state of the component.
   */
  @Method()
  async getValue(): Promise<string> {
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
   * Blurs the input element.
   */
  @Method()
  async setBlur(): Promise<void> {
    this.#input.blur();
  }
  /**
   * Focuses the input element.
   */
  @Method()
  async setFocus(): Promise<void> {
    this.#input.focus();
  }
  /**
   * Sets the component's state.
   * @param {string} value - The new state to be set on the component.
   * @returns {Promise<void>}
   */
  @Method()
  async setValue(value: string): Promise<void> {
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
  #isDisabled = () => this.lfUiState === "disabled";
  #isOutlined = () => {
    return this.lfStyling === "outlined" || this.lfStyling === "textarea";
  };
  #isTextarea = () => this.lfStyling === "textarea";
  #updateState = (
    value: string,
    e: CustomEvent<unknown> | Event = new CustomEvent("change"),
  ) => {
    if (!this.#isDisabled()) {
      this.value = value;
      this.onLfEvent(e, "change");
    }
  };
  #prepCounter = (): VNode => {
    if (!this.#maxLength) {
      return null;
    }

    const { bemClass } = this.#core.theme;

    const { textfield } = this.#b;

    return (
      <div
        class={bemClass(textfield._, textfield.counter)}
        part={this.#p.counter}
      >
        '0 / ' + {this.#maxLength.toString()}
      </div>
    );
  };
  #prepHelper = (): VNode => {
    if (!this.lfHelper?.value) {
      return null;
    }

    const { bemClass } = this.#core.theme;

    const { textfield } = this.#b;
    const shouldShow =
      (this.lfHelper.showWhenFocused && this.status.has("focused")) ||
      !this.lfHelper.showWhenFocused;

    return (
      <div class={bemClass(textfield._, textfield.helperLine)}>
        <div
          class={bemClass(textfield._, textfield.helperText, {
            active: shouldShow,
          })}
        >
          {this.lfHelper.value}
        </div>
        {!this.#isTextarea() && this.#prepCounter()}
      </div>
    );
  };
  #prepIcon = (): VNode => {
    if (!this.lfIcon) {
      return null;
    }

    const { get } = this.#core.assets;
    const { bemClass } = this.#core.theme;

    const { textfield } = this.#b;

    const { style } = get(`./assets/svg/${this.lfIcon}.svg`);
    return (
      <div
        class={bemClass(textfield._, textfield.icon, {
          trailing: this.lfTrailingIcon,
        })}
        data-cy={this.#cy.maskedSvg}
        onClick={(e) => {
          this.onLfEvent(e, "click", true);
        }}
        part={this.#p.icon}
        ref={(el) => {
          if (el) {
            this.#icon = el;
          }
        }}
        style={style}
        tabIndex={0}
      ></div>
    );
  };
  #prepInput = (): VNode => {
    const { sanitizeProps, theme } = this.#core;
    const { bemClass } = theme;

    const { textfield } = this.#b;

    return (
      <input
        {...sanitizeProps(this.lfHtmlAttributes)}
        class={bemClass(textfield._, textfield.input)}
        data-cy={this.#cy.input}
        disabled={this.#isDisabled()}
        onBlur={(e) => {
          this.onLfEvent(e, "blur");
        }}
        onChange={(e) => {
          this.#updateState((e.currentTarget as HTMLInputElement).value);
        }}
        onClick={(e) => {
          this.onLfEvent(e, "click");
        }}
        onFocus={(e) => {
          this.onLfEvent(e, "focus");
        }}
        onInput={(e) => {
          this.onLfEvent(e, "input");
        }}
        part={this.#p.input}
        placeholder={(this.#isOutlined() && this.lfLabel) || ""}
        ref={(el) => {
          if (el) {
            this.#input = el;
          }
        }}
        value={this.value}
      ></input>
    );
  };
  #prepLabel = (): VNode => {
    if (this.#isOutlined() || !this.lfLabel) {
      return null;
    }

    const { bemClass } = this.#core.theme;

    const { textfield } = this.#b;

    return (
      <label
        class={bemClass(textfield._, textfield.label)}
        htmlFor="input"
        part={this.#p.label}
      >
        {this.lfLabel}
      </label>
    );
  };
  #prepRipple = (): VNode => {
    const { bemClass } = this.#core.theme;

    const { textfield } = this.#b;

    return (
      !this.#hasOutline && (
        <span
          class={bemClass(textfield._, textfield.rippleSurface)}
          data-cy={this.#cy.rippleSurface}
          data-lf={this.#lf.rippleSurface}
        ></span>
      )
    );
  };
  #prepTextArea = (): VNode => {
    const { sanitizeProps, theme } = this.#core;
    const { bemClass } = theme;

    const { textfield } = this.#b;

    return (
      <span class={bemClass(textfield._, textfield.resizer)}>
        <textarea
          {...sanitizeProps(this.lfHtmlAttributes)}
          class={bemClass(textfield._, textfield.input)}
          data-cy={this.#cy.input}
          id="input"
          onBlur={(e) => {
            this.onLfEvent(e, "blur");
          }}
          onChange={(e) => {
            this.#updateState((e.currentTarget as HTMLInputElement).value);
          }}
          onClick={(e) => {
            this.onLfEvent(e, "click");
          }}
          onFocus={(e) => {
            this.onLfEvent(e, "focus");
          }}
          onInput={(e) => {
            this.onLfEvent(e, "input");
          }}
          part={this.#p.input}
          placeholder={(this.#isOutlined() && this.lfLabel) || ""}
          ref={(el) => {
            if (el) {
              this.#input = el;
            }
          }}
          value={this.value}
        ></textarea>
      </span>
    );
  };
  #updateStatus = () => {
    const propertiesToUpdateStatus: {
      condition: () => boolean;
      status: LfTextfieldModifiers;
    }[] = [
      { condition: () => Boolean(this.value), status: "filled" },
      { condition: () => this.#isDisabled(), status: "disabled" },
      { condition: () => Boolean(this.lfStretchX), status: "full-width" },
      { condition: () => Boolean(this.lfIcon), status: "has-icon" },
      { condition: () => Boolean(this.lfLabel), status: "has-label" },
    ];

    propertiesToUpdateStatus.forEach(({ condition, status }) => {
      if (condition()) {
        this.status.add(status);
      } else {
        this.status.delete(status);
      }
    });
  };
  //#endregion

  //#region Lifecycle hooks
  connectedCallback() {
    if (!this.#core) {
      this.#core = getLfCore();
      this.debugInfo = this.#core.debug.info.create();
    }
    this.#core.theme.register(this);
  }
  componentWillLoad() {
    if (this.lfValue) {
      this.status.add("filled");
      this.value = this.lfValue;
    }
  }
  componentDidLoad() {
    const { info } = this.#core.debug;

    this.onLfEvent(new CustomEvent("ready"), "ready");
    info.update(this, "did-load");
  }
  componentWillRender() {
    const { info } = this.#core.debug;

    info.update(this, "will-render");
    this.#hasOutline = this.#isOutlined();
    this.#maxLength = this.lfHtmlAttributes?.maxLength;
    this.#updateStatus();
  }
  componentDidRender() {
    const { info } = this.#core.debug;

    info.update(this, "did-render");
  }
  render() {
    const { bemClass, setLfStyle } = this.#core.theme;

    const { lfStyle, lfStyling, status } = this;

    const isTextarea = lfStyling === "textarea";
    const modifiers = { [lfStyling]: true };
    status.forEach((status) => {
      modifiers[status] = true;
    });

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(this.#b.textfield._, null, modifiers)}
            data-lf={this.#lf[this.lfUiState]}
            part={this.#p.textfield}
          >
            {isTextarea
              ? [this.#prepCounter(), this.#prepIcon(), this.#prepTextArea()]
              : [
                  this.#prepIcon(),
                  this.#prepInput(),
                  this.#prepLabel(),
                  this.#prepRipple(),
                ]}
          </div>
          {this.#prepHelper()}
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

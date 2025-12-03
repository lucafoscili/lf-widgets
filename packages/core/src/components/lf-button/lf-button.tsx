import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_BUTTON_BLOCKS,
  LF_BUTTON_PARTS,
  LF_BUTTON_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfButtonAdapter,
  LfButtonElement,
  LfButtonEvent,
  LfButtonEventPayload,
  LfButtonInterface,
  LfButtonPropsInterface,
  LfButtonState,
  LfButtonStyling,
  LfButtonType,
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfIconType,
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
  Watch,
} from "@stencil/core";
import { awaitFramework } from "../../utils/setup";
import { createAdapter } from "./lf-button-adapter";

/**
 * The button component is used to trigger actions or events.
 * It can display text, icons, or both, and can be styled in various ways.
 * The button can be disabled, toggable, or display a spinner.
 * It can also stretch to fill the available horizontal or vertical space.
 * The button can be styled with a theme color and size.
 *
 * @component
 * @tag lf-button
 * @shadow true
 *
 * @example
 * <lf-button
 * lfIcon="save"
 * lfLabel="Click me"
 * lfRipple={false}>
 * </lf-button>
 *
 * @fires {CustomEvent} lf-button-event - Emitted for various component events
 */
@Component({
  tag: "lf-button",
  styleUrl: "lf-button.scss",
  shadow: true,
})
export class LfButton implements LfButtonInterface {
  /**
   * References the root HTML element of the component (<lf-button>).
   */
  @Element() rootElement: LfButtonElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value: LfButtonState = "off";
  //#endregion

  //#region Props
  /**
   * Explicit accessible label for the button. When provided it takes precedence over
   * any derived label (lfLabel / lfIcon / id fallback) and is applied to the internal button element(s).
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfIcon="save" lfAriaLabel="Save document"></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfAriaLabel: string = "";
  /**
   * The dataset for the button, containing the nodes to be displayed.
   * The first node will be used to set the icon and label if not provided.
   *
   * @type {LfDataDataset}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfDataset={{ nodes: [{ icon: "save", value: "Save" }] }}></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfDataset: LfDataDataset = null;
  /**
   * When set, the button will show this icon.
   *
   * @type {LfIconType | null}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfIcon="save"></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfIcon: LfIconType | null = null;
  /**
   * When set, the icon button off state will show this icon.
   *
   * @type {LfIconType | null}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfIcon="palette" lfIconOff="off-palette" lfToggable={true}></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfIconOff: LfIconType | null = null;
  /**
   * When set, the button will show this text.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfLabel="Click me"></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfLabel: string = "";
  /**
   * When set to true, the pointerdown event will trigger a ripple effect.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfRipple={false}></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfRipple: boolean = true;
  /**
   * When set to true, the button will display a spinner and won't be clickable.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfShowSpinner={true}></lf-button>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfShowSpinner: boolean = false;
  /**
   * When set to true, the button will stretch to fill the available horizontal space.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfStretchX={true}></lf-button>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfStretchX: boolean = false;
  /**
   * When set to true, the button will stretch to fill the available vertical space.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfStretchY={true}></lf-button>
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
   * <lf-button lfStyle="color: red;"></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Defines the style of the button. This property controls the visual appearance of the button.
   *
   * @type {LfButtonStyling}
   * @default "raised"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfStyling="flat"></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfStyling: LfButtonStyling = "raised";
  /**
   * When set to true, the icon button will be toggable on/off.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfIcon="palette" lfIconOff="off-palette" lfToggable={true}></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfToggable: boolean = false;
  /**
   * When set, the icon will be shown after the text.
   *
   * @type {boolean}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfTrailingIcon={true}></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfTrailingIcon: boolean = false;
  /**
   * Sets the type of the button.
   *
   * @type {LfButtonType}
   * @default "button"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfType="submit"></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfType: LfButtonType = "button";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-button lfUiSize="small"></lf-button>
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
   * <lf-button lfUiState="success"></lf-button>
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * Sets the initial state of the button.
   * Relevant only when lfToggable is set to true.
   *
   * @type {boolean}
   * @default false
   *
   * @example
   * ```tsx
   * <lf-button lfValue={true}></lf-button>
   * ```
   */
  @Prop({ mutable: false }) lfValue: boolean = false;
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_BUTTON_BLOCKS;
  #p = LF_BUTTON_PARTS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #timeout: NodeJS.Timeout;
  #adapter: LfButtonAdapter;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-button-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfButtonEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfButtonEvent) {
    switch (eventType) {
      case "click":
        this.#updateState(this.#isOn() ? "off" : "on");
        break;
    }

    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      value: this.value,
      valueAsBoolean: this.value === "on" ? true : false,
    });
  }
  //#endregion

  //#region Watchers
  @Watch("lfDataset")
  onDatasetChanged(newValue: LfDataDataset) {
    // Derive icon/label only when absent and framework ready
    if (!this.#framework || !newValue?.nodes?.[0]) {
      return;
    }

    const firstNode = newValue.nodes[0];
    if (!this.lfIcon) {
      this.lfIcon = firstNode.icon;
    }
    if (!this.lfLabel) {
      this.lfLabel = this.#framework.data.cell.stringify(firstNode.value);
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
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfButtonPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfButtonPropsInterface> {
    const entries = LF_BUTTON_PROPS.map(
      (
        prop,
      ): [
        keyof LfButtonPropsInterface,
        LfButtonPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Used to retrieve the component's current state.
   * @returns {Promise<LfButtonState>} Promise resolved with the current state of the component.
   */
  @Method()
  async getValue(): Promise<LfButtonState> {
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
   * Temporarily sets a different label/icon combination, falling back to their previous value after a timeout.
   * @param {string} label - Temporary label to display.
   * @param {LfIconType | null} icon - Temporary icon to display.
   * @param {number} timeout - Time in ms to wait before restoring previous values.
   * @returns {Promise<void>}
   */
  @Method()
  async setMessage(
    label: string = "Copied!",
    icon: LfIconType | null = this.#framework.theme.get.icon("check"),
    timeout: number = 1000,
  ): Promise<void> {
    if (this.#timeout) {
      return;
    }

    const oldIcon = this.lfIcon;
    const oldLabel = this.lfLabel;

    requestAnimationFrame(() => {
      this.lfLabel = label;
      this.lfIcon = icon;
    });

    this.#timeout = setTimeout(() => {
      this.lfLabel = oldLabel;
      this.lfIcon = oldIcon;
      this.#timeout = null;
    }, timeout);
  }
  /**
   * Sets the component's state.
   * @param {LfButtonState} value - The new state to be set on the component.
   * @returns {Promise<void>}
   */
  @Method()
  async setValue(value: LfButtonState | boolean): Promise<void> {
    if (typeof value === "boolean") {
      value = value ? "on" : "off";
    }
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
  #initAdapter = () => {
    this.#adapter = createAdapter(
      {
        blocks: this.#b,
        compInstance: this,
        cyAttributes: this.#cy,
        isDisabled: () => this.#isDisabled(),
        isDropdown: () => this.#isDropdown(),
        isOn: () => this.#isOn(),
        lfAttributes: this.#lf,
        manager: this.#framework,
        parts: this.#p,
        styling: () => this.#normalizedStyling(),
      },
      () => this.#adapter,
    );
  };
  #isDisabled = () => this.lfUiState === "disabled";
  #isDropdown = () => {
    return Boolean(this.lfDataset?.nodes?.[0]?.children?.length);
  };
  #isOn() {
    return this.value === "on" ? true : false;
  }
  #normalizedStyling() {
    return this.lfStyling
      ? (this.lfStyling.toLowerCase() as LfButtonStyling)
      : "raised";
  }
  #updateState(value: LfButtonState) {
    const { lfToggable } = this;

    const isOff = value === "off";
    const isOn = value === "on";

    if (lfToggable && !this.#isDisabled() && (isOff || isOn)) {
      this.value = value;
    }
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
    this.#initAdapter();

    const { data } = this.#framework;

    if (this.lfValue) {
      this.value = "on";
    }
    const firstNode = this.lfDataset?.nodes?.[0];
    if (firstNode) {
      if (!this.lfIcon) {
        this.lfIcon = firstNode.icon;
      }
      if (!this.lfLabel) {
        this.lfLabel = data.cell.stringify(firstNode.value);
      }
    }
  }
  componentDidLoad() {
    const { debug, effects } = this.#framework;
    const { button, dropdown } = this.#adapter.elements.refs;

    if (this.lfRipple) {
      if (button) {
        effects.register.ripple(button);
      }
      if (dropdown) {
        effects.register.ripple(dropdown);
      }
    }

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
    const { debug, theme } = this.#framework;

    const { lfDataset, lfIcon, lfLabel, lfStyle } = this;
    const { button, dropdown, icon } = this.#adapter.elements.jsx;

    const styling = this.#normalizedStyling();

    const isIconButton = !!(
      styling === "icon" ||
      (styling === "raised" &&
        lfIcon &&
        (lfLabel === null || lfLabel === undefined))
    );

    if (!lfLabel && !lfIcon && !lfDataset) {
      debug.logs.new(this, "Empty button.", "informational");
      return;
    }

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{theme.setLfStyle(this)}</style>}
        <div id={this.#w}>
          {isIconButton ? icon() : button()}
          {this.#isDropdown() && dropdown()}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, portal, theme } = this.#framework ?? {};

    if (this.#adapter) {
      const { button, dropdown, list } = this.#adapter.elements.refs;

      if (list && portal?.isInPortal(list)) {
        portal.close(list);
      }

      if (effects && this.lfRipple) {
        if (button) {
          effects.unregister.ripple(button);
        }
        if (dropdown) {
          effects.unregister.ripple(dropdown);
        }
      }
    }

    theme?.unregister(this);
  }
  //#endregion
}

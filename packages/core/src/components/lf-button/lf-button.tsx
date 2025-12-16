import {
  LF_BUTTON_BLOCKS,
  LF_BUTTON_IDS,
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
import { createBaseGetters } from "../../utils/adapter";
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
  /**
   * "Adapter as Core" Pattern:
   * This is the ONLY @State in the component (besides debugInfo). It's a simple counter that gets
   * incremented by the adapter's onStateChange callback to trigger re-renders.
   *
   * All actual component state lives in the adapter's closure variables.
   * This approach gives us:
   * - Predictable renders (only when adapter explicitly requests)
   * - Batch-friendly updates (adapter can make multiple changes before triggering render)
   * - Testable state logic (adapter can be tested without DOM)
   */
  @State() private _renderTick = 0;
  @State() debugInfo: LfDebugLifecycleInfo;

  /**
   * Bridge getter to satisfy LfButtonInterface.
   * Actual state lives in adapter - this just exposes it.
   * @deprecated Use adapter.controller.get.value() internally
   */
  get value(): LfButtonState {
    return this.#adapter?.controller.get.value() ?? "off";
  }
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
  #adapter: LfButtonAdapter;
  #framework: LfFrameworkInterface;
  #timeout: NodeJS.Timeout;
  #b = LF_BUTTON_BLOCKS;
  #ids = LF_BUTTON_IDS;
  #p = LF_BUTTON_PARTS;
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
    eventName: "lf-button-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfButtonEventPayload>;
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
    return this.#adapter.controller.get.value();
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
    this.#adapter.controller.set.value(value);
  }
  /**
   * Initiates the unmount sequence, which removes the component from the DOM after a delay.
   * @param {number} ms - Number of milliseconds
   */
  @Method()
  async unmount(ms: number = 0): Promise<void> {
    setTimeout(() => {
      const value = this.#adapter.controller.get.value();
      this.#adapter.dispatcher.emit("unmount", {
        value,
        valueAsBoolean: value === "on",
      });
      this.rootElement.remove();
    }, ms);
  }
  //#endregion

  //#region Private methods
  /**
   * Creates the dispatcher for centralized event emission.
   * All component events route through this dispatcher.
   * @see Section 5.5 of 4_0_0_REFACTORING.md
   */
  /**
   * Creates the dispatcher for centralized event emission.
   * All component events route through this dispatcher.
   *
   * Note: Reads value from adapter state, not WC state.
   *
   * @see Section 5.5 of 4_0_0_REFACTORING.md
   */
  #createDispatcher = () => ({
    emit: (
      eventType: LfButtonEvent,
      detail?: Partial<LfButtonEventPayload>,
    ) => {
      this.#framework.debug?.logs.new(
        this,
        `Event: ${eventType}`,
        "informational",
      );

      const value = this.#adapter.controller.get.value();
      this.lfEvent.emit({
        comp: this,
        eventType,
        id: this.rootElement.id,
        originalEvent: detail?.originalEvent,
        value,
        valueAsBoolean: value === "on",
      });
    },
  });
  /**
   * Initializes the adapter with "Adapter as Core" architecture.
   *
   * "Adapter as Core" Pattern:
   * - Adapter OWNS the runtime state (via closure variables)
   * - onStateChange callback increments _renderTick to trigger re-render
   * - WC is a thin shell: lifecycle + HTML interface + single render trigger
   *
   * Structure:
   * - controller.get: State reads (value) + base getters (blocks, compInstance, etc.) + styling
   * - controller.set: State writes (value) → triggers onStateChange
   * - controller.computed: Derived predicates (isDisabled, isDropdown, isOn)
   * - controller.actions: Complex operations (toggle, list)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    // onStateChange callback - increments _renderTick to trigger Stencil re-render
    const onStateChange = () => {
      this._renderTick++;
    };

    // Initial value from prop
    const initialValue: LfButtonState = this.lfValue ? "on" : "off";

    const adapterWithoutDispatcher = createAdapter(
      // Base getters (via utility) - does NOT include value getter
      {
        ...createBaseGetters({
          blocks: () => this.#b,
          compInstance: () => this,
          framework: () => this.#framework,
          ids: () => this.#ids,
          parts: () => this.#p,
        }),
        styling: () => this.#normalizedStyling(),
      },
      // Initial state value
      initialValue,
      // onStateChange callback
      onStateChange,
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #normalizedStyling() {
    return this.lfStyling
      ? (this.lfStyling.toLowerCase() as LfButtonStyling)
      : "raised";
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
    // Note: Initial value is now set in createAdapter via initialValue parameter

    const { data } = this.#framework;

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
    const { debug, effects, theme } = this.#framework;
    const { button, dropdown } = this.#adapter.elements.refs;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple) {
      if (button) {
        effects.register.ripple(button);
      }
      if (dropdown) {
        effects.register.ripple(dropdown);
      }
    }

    // Emit ready event via dispatcher
    const value = this.#adapter.controller.get.value();
    this.#adapter.dispatcher.emit("ready", {
      value,
      valueAsBoolean: value === "on",
    });
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
    const { isDropdown } = this.#adapter.controller.computed;

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
          {isDropdown() && dropdown()}
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

      const hasThemeRipple = theme?.get.current().hasEffect("ripple");
      if (effects && this.lfRipple && hasThemeRipple) {
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

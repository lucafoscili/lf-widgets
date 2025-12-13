import {
  LF_STYLE_ID,
  LF_TOGGLE_BLOCKS,
  LF_TOGGLE_IDS,
  LF_TOGGLE_PARTS,
  LF_TOGGLE_PROPS,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
  LfToggleAdapter,
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
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepToggleActions } from "./actions.toggle";
import { prepToggleComputed } from "./computed.toggle";
import { createAdapter } from "./lf-toggle-adapter";

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
   * Explicit accessible label for the toggle control. Fallback chain when empty:
   * lfLabel -> root element id -> 'toggle'. Applied to the native input element.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * <lf-toggle lfAriaLabel="Enable feature"></lf-toggle>
   */
  @Prop({ mutable: true }) lfAriaLabel: string = "";
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
  #adapter: LfToggleAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_TOGGLE_BLOCKS;
  #ids = LF_TOGGLE_IDS;
  #p = LF_TOGGLE_PARTS;
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
    eventName: "lf-toggle-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfToggleEventPayload>;
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
      this.#adapter.dispatcher.emit("unmount", {
        value: this.value,
        valueAsBoolean: this.value === "on",
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
  #createDispatcher = () => ({
    emit: (
      eventType: LfToggleEvent,
      detail?: Partial<LfToggleEventPayload>,
    ) => {
      this.#framework.debug?.logs.new(
        this,
        `Event: ${eventType}`,
        "informational",
      );

      this.lfEvent.emit({
        comp: this,
        eventType,
        id: this.rootElement.id,
        originalEvent: detail?.originalEvent,
        value: this.value,
        valueAsBoolean: this.value === "on",
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.set: Simple setters
   * - controller.computed: Derived predicates (isDisabled, isOn)
   * - controller.actions: Complex operations (toggle)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    const adapterWithoutDispatcher = createAdapter(
      // Getters - base getters (via utility)
      createBaseGetters({
        blocks: () => this.#b,
        compInstance: () => this,
        framework: () => this.#framework,
        ids: () => this.#ids,
        parts: () => this.#p,
      }),
      // Setters - none for toggle component
      {},
      // Computed - derived predicates (from dedicated file)
      prepToggleComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepToggleActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #isValidValue = (value: LfToggleState) => {
    return value === "off" || value === "on";
  };
  #updateState = (value: LfToggleState) => {
    const isDisabled = this.lfUiState === "disabled";
    const shouldUpdate = !isDisabled && this.#isValidValue(value);
    if (shouldUpdate) {
      this.value = value;
    }
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
    this.#initAdapter();

    if (this.lfValue) {
      this.value = "on";
    }
  }
  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;
    const { thumb } = this.#adapter.elements.refs;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple && thumb) {
      effects.register.ripple(thumb);
    }

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", {
      value: this.value,
      valueAsBoolean: this.value === "on",
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
    const { theme } = this.#framework;

    const { lfStyle } = this;
    const { toggle } = this.#adapter.elements.jsx;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{theme.setLfStyle(this)}</style>}
        <div id={this.#w}>{toggle()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};
    const { thumb } = this.#adapter?.elements.refs ?? {};

    const hasThemeRipple = theme?.get.current().hasEffect("ripple");
    if (effects && this.lfRipple && hasThemeRipple && thumb) {
      effects.unregister.ripple(thumb);
    }

    theme?.unregister(this);
  }
  //#endregion
}

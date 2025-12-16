import {
  LF_SLIDER_BLOCKS,
  LF_SLIDER_IDS,
  LF_SLIDER_PARTS,
  LF_SLIDER_PROPS,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfSliderAdapter,
  LfSliderElement,
  LfSliderEvent,
  LfSliderEventPayload,
  LfSliderInterface,
  LfSliderPropsInterface,
  LfSliderValue,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  Method,
  Prop,
  State,
} from "@stencil/core";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepSliderActions } from "./actions.slider";
import { prepSliderComputed } from "./computed.slider";
import { createAdapter } from "./lf-slider-adapter";

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
  #adapter: LfSliderAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_SLIDER_BLOCKS;
  #ids = LF_SLIDER_IDS;
  #p = LF_SLIDER_PARTS;
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
      this.#adapter.dispatcher.emit("unmount", { value: this.value });
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
      eventType: LfSliderEvent,
      detail?: Partial<LfSliderEventPayload>,
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
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.computed: Derived predicates (isDisabled, valuePercentage, normalizeValue)
   * - controller.actions: Complex operations (setValue, setDisplayValue)
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
      // Computed - derived predicates (from dedicated file)
      prepSliderComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepSliderActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
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

    const { lfValue } = this;

    if (lfValue) {
      this.setValue(lfValue);
    }
  }
  componentDidLoad() {
    const { debug, effects, theme } = this.#framework;
    const { thumbUnderlay } = this.#adapter.elements.refs;

    const hasThemeRipple = theme.get.current().hasEffect("ripple");
    if (this.lfRipple && hasThemeRipple && thumbUnderlay) {
      effects.register.ripple(thumbUnderlay);
    }

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready", { value: this.value });
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
    const { slider } = this.#adapter.elements.jsx;

    return slider();
  }
  disconnectedCallback() {
    const { effects, theme } = this.#framework ?? {};

    if (this.#adapter) {
      const { thumbUnderlay } = this.#adapter.elements.refs;

      const hasThemeRipple = theme?.get.current().hasEffect("ripple");
      if (effects && this.lfRipple && hasThemeRipple && thumbUnderlay) {
        effects.unregister.ripple(thumbUnderlay);
      }
    }

    theme?.unregister(this);
  }
}
//#endregion

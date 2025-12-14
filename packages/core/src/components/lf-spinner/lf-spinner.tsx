import {
  LF_SPINNER_BLOCKS,
  LF_SPINNER_IDS,
  LF_SPINNER_PARTS,
  LF_SPINNER_PROPS,
  LF_STYLE_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfSpinnerAdapter,
  LfSpinnerElement,
  LfSpinnerEvent,
  LfSpinnerEventPayload,
  LfSpinnerInterface,
  LfSpinnerPropsInterface,
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
import { prepSpinnerActions } from "./actions.spinner";
import { prepSpinnerComputed } from "./computed.spinner";
import { createAdapter } from "./lf-spinner-adapter";

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
  @Prop({ mutable: true, reflect: true }) lfFader: boolean = false;
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
  #adapter: LfSpinnerAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_SPINNER_BLOCKS;
  #ids = LF_SPINNER_IDS;
  #p = LF_SPINNER_PARTS;
  #s = LF_STYLE_ID;
  #animationState = {
    progressAnimationFrame: null as number | null,
    faderTimer: null as number | null,
  };
  //#endregion

  //#region Watchers
  @Watch("lfActive")
  @Watch("lfFader")
  @Watch("lfFaderTimeout")
  onFaderChange() {
    if (this.#adapter) {
      this.#adapter.controller.actions.scheduleFader();
    }
  }
  @Watch("lfBarVariant")
  lfBarVariantChanged(newValue: boolean) {
    if (!this.#framework || !this.#adapter) {
      return;
    }

    const { actions } = this.#adapter.controller;

    if (newValue && this.lfTimeout) {
      actions.startProgressBar();
    } else {
      actions.cancelProgressBar();
    }
  }
  @Watch("lfTimeout")
  lfTimeoutChanged(newValue: number, oldValue: number) {
    if (!this.#framework || !this.#adapter) {
      return;
    }

    if (newValue !== oldValue && this.lfBarVariant) {
      this.#adapter.controller.actions.startProgressBar();
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
   * Gets the current progress value.
   */
  @Method()
  async getProgress(): Promise<number> {
    return this.progress;
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
      this.#adapter.dispatcher.emit("unmount");
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
      eventType: LfSpinnerEvent,
      detail?: Partial<LfSpinnerEventPayload>,
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
      });
    },
  });
  /**
   * Initializes the adapter with v4.0.0 architecture.
   *
   * Structure:
   * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
   * - controller.computed: Derived predicates (isBarVariant, showFader, getConfig, etc.)
   * - controller.actions: Complex operations (startProgressBar, scheduleFader, etc.)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
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
      prepSpinnerComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepSpinnerActions(getAdapter, this.#animationState),
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
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    const { lfBarVariant, lfTimeout } = this;

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready");
    info.update(this, "did-load");

    if (lfBarVariant && lfTimeout) {
      this.#adapter.controller.actions.startProgressBar();
    }
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
    const { setLfStyle } = this.#framework.theme;

    const { lfBarVariant, lfDimensions, lfFullScreen, lfStyle } = this;
    const { spinner } = this.#adapter.elements.jsx;

    // Host styles - applied directly to the custom element
    const hostStyle: Record<string, string | undefined> = {
      fontSize: lfDimensions || (lfBarVariant ? "0.25em" : ".875em"),
      height: lfFullScreen ? undefined : "100%",
      width: lfFullScreen ? undefined : "100%",
    };

    return (
      <Host style={hostStyle}>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        {spinner()}
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);

    if (this.#adapter) {
      const { actions } = this.#adapter.controller;
      actions.cancelProgressBar();
      actions.clearFaderTimer();
    }
  }
}

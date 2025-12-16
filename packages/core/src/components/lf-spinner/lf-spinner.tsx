import {
  LF_SPINNER_BLOCKS,
  LF_SPINNER_IDS,
  LF_SPINNER_PARTS,
  LF_SPINNER_PROPS,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfSpinnerAdapter,
  LfSpinnerElement,
  LfSpinnerEvent,
  LfSpinnerEventPayload,
  LfSpinnerInterface,
  LfSpinnerLayout,
  LfSpinnerPropsInterface,
  LfThemeIcon,
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
import { SpinnerFC } from "./fc";
import { createAdapter } from "./lf-spinner-adapter";

/**
 * The spinner component displays a loading animation to indicate that a process is underway.
 * Multiple layout options are available including ring, dots, bars (equalizer), spinner,
 * grid, icon (custom), pulse, and wave. A progress bar variant is also supported.
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
   * Icon to display when using the "icon" layout.
   * The icon will rotate with the spinner animation.
   *
   * @type {string | LfThemeIcon}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfLayout="icon" lfIcon="camera"></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfIcon: LfThemeIcon;
  /**
   * Selects the spinner layout style.
   * Available: "ring", "dots", "bars", "spinner", "grid", "icon", "pulse", "wave"
   *
   * @type {LfSpinnerLayout}
   * @default "ring"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfLayout="dots"></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfLayout: LfSpinnerLayout = "ring";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfStyle=".spinner { --lf-spinner-color: red; }"></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Duration for the progress bar to fill up (in milliseconds).
   * Only applies when lfBarVariant is true.
   *
   * @type {number}
   * @default 0
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfBarVariant={true} lfTimeout={5000}></lf-spinner>
   * ```
   */
  @Prop({ mutable: true }) lfTimeout: number = 0;
  /**
   * The size of the component.
   * Controls the spinner dimensions using predefined sizes.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfUiSize="large"></lf-spinner>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Reflects the specified state color defined by the theme.
   * Controls the spinner color using theme state colors.
   *
   * @type {LfThemeUIState}
   * @default "primary"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-spinner lfUiState="secondary"></lf-spinner>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #adapter: LfSpinnerAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_SPINNER_BLOCKS;
  #ids = LF_SPINNER_IDS;
  #p = LF_SPINNER_PARTS;
  #animationState = {
    progressAnimationFrame: null as number | null,
    faderTimer: null as ReturnType<typeof setTimeout> | null,
  };
  //#endregion

  //#region Watchers
  @Watch("lfActive")
  @Watch("lfFader")
  @Watch("lfFaderTimeout")
  onFaderChange() {
    this.#adapter?.controller.actions.scheduleFader();
  }
  @Watch("lfBarVariant")
  @Watch("lfTimeout")
  onBarChange() {
    if (this.lfBarVariant && this.lfTimeout) {
      this.#adapter?.controller.actions.startProgressBar();
    } else {
      this.#adapter?.controller.actions.cancelProgressBar();
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
   * - controller.computed: Derived predicates (isBarVariant, showFader)
   * - controller.actions: Complex operations (startProgressBar, cancelProgressBar, scheduleFader, clearFaderTimer)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   * - handlers: Event callbacks (empty for spinner)
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;

    const adapterWithoutDispatcher = createAdapter(
      // Getters - base getters (via utility)
      {
        ...createBaseGetters({
          blocks: () => this.#b,
          compInstance: () => this,
          framework: () => this.#framework,
          ids: () => this.#ids,
          parts: () => this.#p,
        }),
      },
      // Computed - derived predicates
      {
        isBarVariant: () => this.lfBarVariant,
        showFader: () => this.bigWait,
      },
      // Actions - complex multi-step operations
      {
        startProgressBar: () => this.#startProgressBar(),
        cancelProgressBar: () => this.#cancelProgressBar(),
        scheduleFader: () => this.#scheduleFader(),
        clearFaderTimer: () => this.#clearFaderTimer(),
      },
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };

  /**
   * Starts the progress bar animation.
   */
  #startProgressBar = () => {
    this.progress = 0;
    const startTime = Date.now();
    const duration = this.lfTimeout;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      this.progress = Math.min((elapsed / duration) * 100, 100);

      if (this.progress < 100) {
        this.#animationState.progressAnimationFrame =
          requestAnimationFrame(updateProgress);
      } else {
        this.#cancelProgressBar();
      }
    };

    this.#animationState.progressAnimationFrame =
      requestAnimationFrame(updateProgress);
  };

  /**
   * Cancels the progress bar animation.
   */
  #cancelProgressBar = () => {
    this.progress = 0;
    if (this.#animationState.progressAnimationFrame !== null) {
      cancelAnimationFrame(this.#animationState.progressAnimationFrame);
      this.#animationState.progressAnimationFrame = null;
    }
  };

  /**
   * Schedules the fader timeout.
   */
  #scheduleFader = () => {
    this.#clearFaderTimer();
    this.bigWait = false;

    if (this.lfFader && this.lfActive) {
      this.#animationState.faderTimer = setTimeout(() => {
        this.bigWait = true;
      }, this.lfFaderTimeout);
    }
  };

  /**
   * Clears the fader timeout.
   */
  #clearFaderTimer = () => {
    if (this.#animationState.faderTimer !== null) {
      clearTimeout(this.#animationState.faderTimer);
      this.#animationState.faderTimer = null;
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
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready");
    info.update(this, "did-load");

    // Start progress bar if applicable
    if (this.lfBarVariant && this.lfTimeout) {
      this.#adapter.controller.actions.startProgressBar();
    }

    // Schedule fader if applicable
    if (this.lfFader && this.lfActive) {
      this.#adapter.controller.actions.scheduleFader();
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
    return (
      <Host>
        <SpinnerFC adapter={this.#adapter} />
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
    this.#adapter?.controller.actions.cancelProgressBar();
    this.#adapter?.controller.actions.clearFaderTimer();
  }
  //#endregion
}

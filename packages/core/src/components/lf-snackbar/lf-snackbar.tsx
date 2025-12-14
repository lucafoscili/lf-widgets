import {
  LF_ATTRIBUTES,
  LF_SNACKBAR_BLOCKS,
  LF_SNACKBAR_CSS_VARIABLES,
  LF_SNACKBAR_IDS,
  LF_SNACKBAR_PARTS,
  LF_SNACKBAR_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfIconType,
  LfSnackbarActionCallback,
  LfSnackbarAdapter,
  LfSnackbarElement,
  LfSnackbarEvent,
  LfSnackbarEventPayload,
  LfSnackbarInterface,
  LfSnackbarPositions,
  LfSnackbarPropsInterface,
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
} from "@stencil/core";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepSnackbarActions } from "./actions.snackbar";
import { prepSnackbarComputed } from "./computed.snackbar";
import { createAdapter } from "./lf-snackbar-adapter";

/**
 * The snackbar component displays a brief notification message at screen edges.
 * The snackbar may include an icon, message, optional action button, and close button.
 * The snackbar may close automatically after a specified amount of time or persist until user action.
 *
 * @component
 * @tag lf-snackbar
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying brief actionable notifications to the user.
 *
 * @example
 * <lf-snackbar lfMessage="File saved successfully" lfAction="Undo" />
 *
 * @fires {CustomEvent} lf-snackbar-event - Emitted for various component events
 */
@Component({
  tag: "lf-snackbar",
  styleUrl: "lf-snackbar.scss",
  shadow: true,
})
export class LfSnackbar implements LfSnackbarInterface {
  /**
   * References the root HTML element of the component (<lf-snackbar>).
   */
  @Element() rootElement: LfSnackbarElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * Text label for action button. If omitted, no action button appears.
   *
   * @type {string}
   * @default undefined
   *
   * @example
   * ```tsx
   * <lf-snackbar lfAction="Undo" />
   * ```
   */
  @Prop() lfAction?: string;
  /**
   * Callback invoked when the action button is clicked.
   * Receives snackbar instance and pointer event.
   *
   * @type {LfSnackbarActionCallback}
   * @default () => this.unmount()
   *
   * @example
   * ```tsx
   * <lf-snackbar lfActionCallback={(snackbar, e) => console.log(snackbar, e)} />
   * ```
   */
  @Prop() lfActionCallback: LfSnackbarActionCallback = (
    _snackbar: LfSnackbar,
    _e: PointerEvent,
  ) => {
    this.unmount();
  };
  /**
   * Icon shown in the close button.
   *
   * @type {string | LfThemeIcon}
   * @default ''
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfCloseIcon="close" />
   * ```
   */
  @Prop({ mutable: true }) lfCloseIcon: LfIconType = null;
  /**
   * Auto-dismiss duration in milliseconds. Set to 0 to disable auto-dismiss.
   *
   * @type {number}
   * @default 4000
   *
   * @example
   * ```tsx
   * <lf-snackbar lfDuration={5000} />
   * ```
   */
  @Prop() lfDuration: number = 4000;
  /**
   * Optional icon shown at the start of the snackbar.
   *
   * @type {string | LfThemeIcon}
   * @default undefined
   *
   * @example
   * ```tsx
   * <lf-snackbar lfIcon="check" />
   * ```
   */
  @Prop({ mutable: true }) lfIcon: LfIconType = null;
  /**
   * Message text displayed in the snackbar.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfMessage="Operation successful!" />
   * ```
   */
  @Prop({ mutable: true }) lfMessage: string = "";
  /**
   * Positioning of the snackbar on screen.
   *
   * @type {LfSnackbarPositions}
   * @default "bottom-center"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfPosition="bottom-left" />
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfPosition: LfSnackbarPositions =
    "bottom-center";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfStyle="#lf-component { background-color: red; }" />
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-snackbar lfUiSize="small" />
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
   * <lf-snackbar lfUiState="success" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #adapter: LfSnackbarAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_SNACKBAR_BLOCKS;
  #ids = LF_SNACKBAR_IDS;
  #lf = LF_ATTRIBUTES;
  #p = LF_SNACKBAR_PARTS;
  #s = LF_STYLE_ID;
  #timerRef: ReturnType<typeof setTimeout> | null = null;
  #v = LF_SNACKBAR_CSS_VARIABLES;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-snackbar-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfSnackbarEventPayload>;
  //#endregion

  //#region Public methods
  /**
   * Retrieves the debug information reflecting the current state of the component.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves to a LfDebugLifecycleInfo object containing debug information.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfSnackbarPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfSnackbarPropsInterface> {
    const entries = LF_SNACKBAR_PROPS.map(
      (
        prop,
      ): [
        keyof LfSnackbarPropsInterface,
        LfSnackbarPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Triggers a re-render of the component to reflect any state changes.
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
    if (this.#timerRef !== null) {
      clearTimeout(this.#timerRef);
      this.#timerRef = null;
    }

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
      eventType: LfSnackbarEvent,
      detail?: Partial<LfSnackbarEventPayload>,
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
   * - controller.computed: Derived predicates (hasAction, hasCloseIcon, hasIcon)
   * - controller.actions: Complex operations (close)
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
      {
        ...createBaseGetters({
          blocks: () => this.#b,
          compInstance: () => this,
          framework: () => this.#framework,
          ids: () => this.#ids,
          parts: () => this.#p,
        }),
      },
      // Computed - derived predicates (from dedicated file)
      prepSnackbarComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepSnackbarActions(getAdapter),
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

    if (!this.lfCloseIcon) {
      const { "--lf-icon-delete": close } =
        this.#framework.theme.get.current().variables;
      this.lfCloseIcon = close;
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    if (this.lfDuration > 0 && this.lfPosition !== "inline") {
      this.#timerRef = setTimeout(() => {
        this.unmount();
      }, this.lfDuration);
    }

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready");
    info.update(this, "did-load");
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
    const { setLfStyle } = theme;

    const { lfDuration, lfStyle } = this;
    const { snackbar } = this.#adapter.elements.jsx;

    return (
      <Host>
        <style id={this.#s}>
          {`
          :host {
            ${lfDuration > 0 ? `${this.#v.duration}: ${lfDuration}ms;` : ""}
          }
        ${(lfStyle && setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w} data-lf={this.#lf.fadeIn}>
          {snackbar()}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    if (this.#timerRef !== null) {
      clearTimeout(this.#timerRef);
      this.#timerRef = null;
    }

    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

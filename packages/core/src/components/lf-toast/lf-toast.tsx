import {
  LF_ATTRIBUTES,
  LF_STYLE_ID,
  LF_TOAST_BLOCKS,
  LF_TOAST_CSS_VARIABLES,
  LF_TOAST_IDS,
  LF_TOAST_PARTS,
  LF_TOAST_PROPS,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeIcon,
  LfThemeUISize,
  LfThemeUIState,
  LfToastAdapter,
  LfToastCloseCallback,
  LfToastElement,
  LfToastEvent,
  LfToastEventPayload,
  LfToastInterface,
  LfToastPropsInterface,
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
import { prepToastActions } from "./actions.toast";
import { prepToastComputed } from "./computed.toast";
import { createAdapter } from "./lf-toast-adapter";

/**
 * The toast component displays a temporary message to the user.
 * The toast may include an icon, message, and close button.
 * The toast may also close automatically after a specified amount of time.
 *
 * @component
 * @tag lf-toast
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying temporary messages to the user.
 *
 * @example
 * <lf-toast lfMessage="Operation successful!" />
 *
 * @fires {CustomEvent} lf-toast-event - Emitted for various component events
 */
@Component({
  tag: "lf-toast",
  styleUrl: "lf-toast.scss",
  shadow: true,
})
export class LfToast implements LfToastInterface {
  /**
   * References the root HTML element of the component (<lf-toast>).
   */
  @Element() rootElement: LfToastElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region Props
  /**
   * Sets the close icon of the toast.
   *
   * @type {string | LfThemeIcon}
   * @default ''
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfCloseIcon="delete" />
   * ```
   */
  @Prop({ mutable: true }) lfCloseIcon: string | LfThemeIcon = "";
  /**
   * Callback invoked when the toast is closed.
   *
   * @type {LfToastCloseCallback}
   * @default () => this.rootElement.remove()
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfCloseCallback={(toast, e) => console.log(toast, e)} />
   * ```
   */
  @Prop() lfCloseCallback: LfToastCloseCallback = (
    _toast: LfToast,
    _e: PointerEvent,
  ) => {
    this.unmount();
  };
  /**
   * Sets the icon of the toast.
   *
   * @type {string | LfThemeIcon}
   * @default ''
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfIcon="check" />
   * ```
   */
  @Prop({ mutable: true }) lfIcon: string | LfThemeIcon;
  /**
   * When lfTimer is set with a number, the toast will close itself after the specified amount of time (in ms).
   *
   * @type {number}
   * @default null
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfTimer={3000} />
   * ```
   */
  @Prop() lfTimer: number = null;
  /**
   * Sets the message of the toast.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfMessage="Operation successful!" />
   * ```
   */
  @Prop({ mutable: true }) lfMessage: string = "";
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-toast lfStyle="#lf-component { background-color: red; }" />
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
   * <lf-toast lfUiSize="small" />
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
   * <lf-toast lfUiState="success" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  //#endregion

  //#region Internal variables
  #adapter: LfToastAdapter;
  #framework: LfFrameworkInterface;
  #dismissTimer: ReturnType<typeof setTimeout> = null;
  #b = LF_TOAST_BLOCKS;
  #ids = LF_TOAST_IDS;
  #lf = LF_ATTRIBUTES;
  #p = LF_TOAST_PARTS;
  #s = LF_STYLE_ID;
  #v = LF_TOAST_CSS_VARIABLES;
  #w = LF_WRAPPER_ID;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-toast-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfToastEventPayload>;
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
   * @returns {Promise<LfToastPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfToastPropsInterface> {
    const entries = LF_TOAST_PROPS.map(
      (
        prop,
      ): [keyof LfToastPropsInterface, LfToastPropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
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
    emit: (eventType: LfToastEvent, detail?: Partial<LfToastEventPayload>) => {
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
   * - controller.computed: Derived predicates (hasCloseIcon, hasIcon, hasTimer)
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
      createBaseGetters({
        blocks: () => this.#b,
        compInstance: () => this,
        framework: () => this.#framework,
        ids: () => this.#ids,
        parts: () => this.#p,
      }),
      // Computed - derived predicates (from dedicated file)
      prepToastComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepToastActions(getAdapter),
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

    if (this.lfCloseIcon === "") {
      const { "--lf-icon-delete": close } =
        this.#framework.theme.get.current().variables;
      this.lfCloseIcon = close;
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

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

    const { lfTimer } = this;

    // Store timer ID for cleanup and only create if not already running
    if (lfTimer && !this.#dismissTimer) {
      this.#dismissTimer = setTimeout(() => {
        this.#adapter.controller.actions.close(null);
      }, lfTimer);
    }

    info.update(this, "did-render");
  }
  render() {
    const { theme } = this.#framework;
    const { setLfStyle } = theme;

    const { lfStyle, lfTimer } = this;
    const { toast } = this.#adapter.elements.jsx;

    return (
      <Host>
        <style id={this.#s}>
          {`
          :host {
            ${lfTimer ? `${this.#v.timer}: ${lfTimer}ms;` : ""}
          }
        ${(lfStyle && setLfStyle(this)) || ""}`}
        </style>
        <div id={this.#w} data-lf={this.#lf.fadeIn}>
          {toast()}
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    // Clean up dismiss timer to prevent memory leaks
    if (this.#dismissTimer) {
      clearTimeout(this.#dismissTimer);
      this.#dismissTimer = null;
    }
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

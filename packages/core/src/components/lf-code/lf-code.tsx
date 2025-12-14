import {
  LF_CODE_BLOCKS,
  LF_CODE_IDS,
  LF_CODE_PARTS,
  LF_CODE_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfCodeAdapter,
  LfCodeElement,
  LfCodeEvent,
  LfCodeEventPayload,
  LfCodeInterface,
  LfCodePropsInterface,
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
  Watch,
} from "@stencil/core";
import { createBaseGetters } from "../../utils/adapter";
import { awaitFramework } from "../../utils/setup";
import { prepCodeActions } from "./actions.code";
import { prepCodeComputed } from "./computed.code";
import { createAdapter } from "./lf-code-adapter";

/**
 * The code component displays a snippet of code in a styled container with
 * syntax highlighting. The component supports various languages and provides
 * options for formatting, preserving spaces, and showing a copy button.
 *
 * @component
 * @tag lf-code
 * @shadow true
 *
 * @remarks
 * This component uses the Prism.js library to provide syntax highlighting for
 * code snippets. The component supports various languages and provides options
 * for formatting, preserving spaces, and showing a copy button.
 *
 * @example
 * <lf-code
 * lfFormat={true}
 * lfLanguage="javascript"
 * lfPreserveSpaces={true}
 * ></lf-code>
 *
 * @fires {CustomEvent} lf-code-event - Emitted for various component events
 */
@Component({
  tag: "lf-code",
  styleUrl: "lf-code.scss",
  shadow: true,
})
export class LfCode implements LfCodeInterface {
  /**
   * References the root HTML element of the component (<lf-code>).
   */
  @Element() rootElement: LfCodeElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() value = "";
  //#endregion

  //#region Props

  /**
   * Whether to fade in the component on mount.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfFadeIn={true} />
   * ```
   */
  @Prop({ mutable: true }) lfFadeIn: boolean = true;
  /**
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfFormat={true} />
   * ```
   */
  @Prop({ mutable: true }) lfFormat: boolean = true;
  /**
   * Sets the language of the snippet.
   *
   * @type {string}
   * @default "javascript"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfLanguage="javascript" />
   * ```
   */
  @Prop({ mutable: true }) lfLanguage: string = "javascript";
  /**
   * Whether to preserve spaces or not. When missing it is set automatically.
   *
   * @type {boolean}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfPreserveSpaces={true} />
   * ```
   */
  @Prop({ mutable: true }) lfPreserveSpaces: boolean;
  /**
   * Whether to show the copy button or not.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfShowCopy={true} />
   * ```
   */
  @Prop({ mutable: true }) lfShowCopy: boolean = true;
  /**
   * Whether to show the header or not.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfShowHeader={true} />
   * ```
   */
  @Prop({ mutable: true }) lfShowHeader: boolean = true;
  /**
   * Determines whether the header is sticky or not.
   *
   * @type {boolean}
   * @default true
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfStickyHeader={true} />
   * ```
   */
  @Prop({ mutable: true }) lfStickyHeader: boolean = true;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfStyle="#lf-component { color: red; }" />
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
   * <lf-code lfUiSize="small" />
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
   * <lf-code lfUiState="success" />
   * ```
   */
  @Prop({ mutable: true }) lfUiState: LfThemeUIState = "primary";
  /**
   * String containing the snippet of code to display.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-code lfValue="const hello = 'world';" />
   * ```
   */
  @Prop({ mutable: true }) lfValue: string = "";
  //#endregion

  //#region Internal variables
  #adapter: LfCodeAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_CODE_BLOCKS;
  #ids = LF_CODE_IDS;
  #p = LF_CODE_PARTS;
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
    eventName: "lf-code-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfCodeEventPayload>;
  //#endregion

  //#region Watchers
  @Watch("lfLanguage")
  async loadLanguage() {
    if (!this.#framework) {
      return;
    }

    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const { syntax } = this.#framework;
    const lang = this.lfLanguage.toLowerCase();

    // Check if language is already loaded
    if (syntax.isLanguageLoaded(lang)) {
      return;
    }

    await syntax.loadLanguage(lang);
  }
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
   * @returns {Promise<LfCodePropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfCodePropsInterface> {
    const entries = LF_CODE_PROPS.map(
      (
        prop,
      ): [keyof LfCodePropsInterface, LfCodePropsInterface[typeof prop]] => [
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
      this.#adapter.dispatcher.emit("unmount", {});
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
    emit: (eventType: LfCodeEvent, detail?: Partial<LfCodeEventPayload>) => {
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
   * - controller.computed: Derived values (formattedCode, shouldPreserveSpace)
   * - controller.actions: Complex operations (highlight, copyToClipboard, loadLanguage)
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
      // Computed - derived values (from dedicated file)
      prepCodeComputed(getAdapter),
      // Actions - complex multi-step operations (from dedicated file)
      prepCodeActions(getAdapter),
      // Adapter accessor
      getAdapter,
    );

    // Combine adapter parts with dispatcher
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher: this.#createDispatcher(),
    };
  };
  #updateValue() {
    const { formattedCode } = this.#adapter.controller.computed;
    this.value = formattedCode();
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
    await this.loadLanguage();
    this.#updateValue();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    this.#adapter.dispatcher.emit("ready", {});
    info.update(this, "did-load");
  }
  componentWillUpdate() {
    this.#updateValue();
  }
  componentWillRender() {
    const { info } = this.#framework.debug;

    info.update(this, "will-render");
  }
  componentDidRender() {
    const { info } = this.#framework.debug;
    const { highlight } = this.#adapter.controller.actions;

    highlight();

    info.update(this, "did-render");
  }
  render() {
    const { setLfStyle } = this.#framework.theme;
    const { code } = this.#adapter.elements.jsx;
    const { lfStyle } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>{code()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

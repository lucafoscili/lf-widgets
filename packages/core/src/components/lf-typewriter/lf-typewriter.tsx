import {
  LF_STYLE_ID,
  LF_TYPEWRITER_BLOCKS,
  LF_TYPEWRITER_IDS,
  LF_TYPEWRITER_PARTS,
  LF_TYPEWRITER_PROPS,
  LF_WRAPPER_ID,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfThemeUISize,
  LfTypewriterAdapter,
  LfTypewriterCursor,
  LfTypewriterElement,
  LfTypewriterEvent,
  LfTypewriterEventPayload,
  LfTypewriterInterface,
  LfTypewriterPropsInterface,
  LfTypewriterTag,
  LfTypewriterValue,
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
import { prepTypewriterActions } from "./actions.typewriter";
import { prepTypewriterComputed } from "./computed.typewriter";
import { createAdapter } from "./lf-typewriter-adapter";

/**
 * The typewriter component displays text with a typewriter effect.
 * The typewriter may display a single text or loop through an array of texts.
 *
 * @component
 * @tag lf-typewriter
 * @shadow true
 *
 * @remarks
 * This component uses the Stencil.js framework to provide a customizable,
 * reusable UI element for displaying text with a typewriter effect.
 *
 * @example
 * <lf-typewriter lfValue="Hello, World!"></lf-typewriter>
 *
 * @fires {CustomEvent} lf-typewriter-event - Emitted for various component events
 */
@Component({
  tag: "lf-typewriter",
  styleUrl: "lf-typewriter.scss",
  shadow: true,
})
export class LfTypewriter implements LfTypewriterInterface {
  /**
   * References the root HTML element of the component (<lf-typewriter>).
   */
  @Element() rootElement: LfTypewriterElement;

  //#region States
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() displayedText = "";
  @State() isDeleting = false;
  @State() currentTextIndex = 0;
  //#endregion

  //#region Props
  /**
   * Sets the behavior of the blinking cursor.
   *
   * @type {LfTypewriterCursor}
   * @default "auto"
   * @mutable
   */
  @Prop({ mutable: true }) lfCursor: LfTypewriterCursor = "auto";
  /**
   * Sets the deleting speed in milliseconds.
   *
   * @type {number}
   * @default 50
   * @mutable
   */
  @Prop({ mutable: true }) lfDeleteSpeed: number = 50;
  /**
   * Enables or disables looping of the text.
   *
   * @type {boolean}
   * @default false
   * @mutable
   */
  @Prop({ mutable: true }) lfLoop: boolean = false;
  /**
   * Sets the duration of the pause after typing a complete text.
   *
   * @type {number}
   * @default 500
   * @mutable
   */
  @Prop({ mutable: true }) lfPause: number = 500;
  /**
   * Sets the typing speed in milliseconds.
   * @default 100
   */
  @Prop({ mutable: true }) lfSpeed = 50;
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * The name of the HTML tag that will wrap the text.
   *
   * @type {LfTypewriterTag}
   * @default "p"
   * @mutable
   */
  @Prop({ mutable: true }) lfTag: LfTypewriterTag = "p";
  /**
   * The size of the component.
   *
   * @type {LfThemeUISizeKey}
   * @default "medium"
   * @mutable
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Controls whether the component should update its text content.
   *
   * @type {boolean}
   * @default true
   * @mutable
   */
  @Prop({ mutable: true }) lfUpdatable: boolean = true;
  /**
   * Sets the text or array of texts to display with the typewriter effect.
   *
   * @type {LfTypewriterValue}
   * @default """
   * @mutable
   */
  @Prop({ mutable: true }) lfValue: LfTypewriterValue = "";
  //#endregion

  //#region Internal variables
  #adapter: LfTypewriterAdapter;
  #framework: LfFrameworkInterface;
  #b = LF_TYPEWRITER_BLOCKS;
  #ids = LF_TYPEWRITER_IDS;
  #p = LF_TYPEWRITER_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #timeout: NodeJS.Timeout;
  #texts: string[] = [];
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-typewriter-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfTypewriterEventPayload>;
  //#endregion

  //#region Watchers
  @Watch("lfValue")
  handleLfValueChange() {
    if (!this.#framework || !this.#adapter) {
      return;
    }

    if (this.lfUpdatable) {
      this.#initializeTexts();
      this.#adapter.controller.actions.reset();
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
   * @returns {Promise<LfTypewriterPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfTypewriterPropsInterface> {
    const entries = LF_TYPEWRITER_PROPS.map(
      (
        prop,
      ): [
        keyof LfTypewriterPropsInterface,
        LfTypewriterPropsInterface[typeof prop],
      ] => [prop, this[prop]],
    );
    return Object.fromEntries(entries);
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
  #initializeTexts() {
    const { lfValue } = this;

    this.#texts = Array.isArray(lfValue) ? lfValue : [lfValue];
  }
  /**
   * Creates the dispatcher for centralized event emission.
   * All component events route through this dispatcher.
   * @see Section 5.5 of 4_0_0_REFACTORING.md
   */
  #createDispatcher = () => ({
    emit: (
      eventType: LfTypewriterEvent,
      detail?: Partial<LfTypewriterEventPayload>,
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
   * - controller.computed: Derived predicates (shouldShowCursor, currentText, texts)
   * - controller.actions: Animation control operations (start, reset, deleteText, completeReset)
   * - elements: JSX factories + refs
   * - dispatcher: Centralized event emission
   *
   * @see Section 5 of 4_0_0_REFACTORING.md
   */
  #initAdapter = () => {
    // Adapter accessor - shared by all factories
    const getAdapter = () => this.#adapter;
    // Texts accessor - needed for computed/actions
    const getTexts = () => this.#texts;
    // Timeout accessors
    const setTimeout_ = (timeout: NodeJS.Timeout | undefined) => {
      this.#timeout = timeout;
    };
    const clearTimeout_ = () => {
      clearTimeout(this.#timeout);
    };

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
      prepTypewriterComputed(getAdapter, getTexts),
      // Actions - animation control operations (from dedicated file)
      prepTypewriterActions(getAdapter, setTimeout_, clearTimeout_),
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
    this.#initializeTexts();
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;

    // Emit ready event via dispatcher
    this.#adapter.dispatcher.emit("ready");
    requestAnimationFrame(async () => this.#adapter.controller.actions.start());
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

    const { lfStyle } = this;
    const { typewriter } = this.#adapter.elements.jsx;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{theme.setLfStyle(this)}</style>}
        <div id={this.#w}>{typewriter()}</div>
      </Host>
    );
  }
  disconnectedCallback() {
    this.#framework?.theme.unregister(this);
    clearTimeout(this.#timeout);
  }
  //#endregion
}

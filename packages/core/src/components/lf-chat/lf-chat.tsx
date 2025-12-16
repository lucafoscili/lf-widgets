import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CHAT_BLOCKS,
  LF_CHAT_IDS,
  LF_CHAT_PARTS,
  LF_CHAT_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChatAdapter,
  LfChatAdapterDispatcher,
  LfChatConfig,
  LfChatElement,
  LfChatEvent,
  LfChatEventPayload,
  LfChatHistory,
  LfChatInterface,
  LfChatPropsInterface,
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfLLMAttachment,
  LfLLMToolHandlers,
  LfThemeUISize,
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
import {
  ChatConnectingFC,
  ChatMessagesFC,
  ChatOfflineFC,
  ChatRequestFC,
  ChatSettingsFC,
} from "./fc";
import { handleFile, handleImage, handleRemove } from "./helpers.attachments";
import { getEffectiveConfig } from "./helpers.config";
import { exportH, setH } from "./helpers.history";
import { createAdapter, LfChatInitialState } from "./lf-chat-adapter";

/**
 * Represents the properties of the `lf-chat` component. The properties include
 * settings for the chat layout, endpoint URL, system message, and more. The
 * properties can be set to customize the chat component's appearance and behavior.
 *
 * @component
 * @tag lf-chat
 * @shadow true
 *
 * @remarks
 * The `lf-chat` component is a chat interface that connects to a language model
 * endpoint to provide conversational responses. The component supports various
 * settings through the lfConfig prop.
 *
 * @example
 * <lf-chat
 *   lfConfig={{
 *     llm: {
 *       endpointUrl: "http://localhost:5001",
 *       contextWindow: 8192,
 *       temperature: 0.7
 *     },
 *     ui: {
 *       layout: "top",
 *       emptyMessage: "Your chat history is empty!"
 *     }
 *   }}
 * ></lf-chat>
 *
 * @fires {CustomEvent} lf-chat-event - Emitted for various component events
 */
@Component({
  tag: "lf-chat",
  styleUrl: "lf-chat.scss",
  shadow: true,
})
export class LfChat implements LfChatInterface {
  /**
   * References the root HTML element of the component (<lf-chat>).
   */
  @Element() rootElement: LfChatElement;

  //#region States
  /**
   * Single render-tick state per "Adapter as Core" pattern (v4.0.0 Section 5.9).
   * All component state lives in adapter closure; this just triggers re-renders.
   */
  @State() _renderTick = 0;
  @State() debugInfo: LfDebugLifecycleInfo;
  //#endregion

  //#region State Accessors (delegate to adapter closure)
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get agentState() {
    return this.#adapter?.controller.get.agentState();
  }
  set agentState(value) {
    this.#adapter?.controller.set.agentState(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get currentAbortStreaming() {
    return this.#adapter?.controller.get.currentAbortStreaming();
  }
  set currentAbortStreaming(value) {
    this.#adapter?.controller.set.currentAbortStreaming(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get currentAttachments() {
    return this.#adapter?.controller.get.currentAttachments();
  }
  set currentAttachments(value) {
    this.#adapter?.controller.set.currentAttachments(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get currentEditingId() {
    return this.#adapter?.controller.get.currentEditingId();
  }
  set currentEditingId(value) {
    this.#adapter?.controller.set.currentEditingId(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get currentPrompt() {
    return this.#adapter?.controller.get.currentPrompt();
  }
  set currentPrompt(value) {
    this.#adapter?.controller.set.currentPrompt(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get currentTokens() {
    return this.#adapter?.controller.get.currentTokens();
  }
  set currentTokens(value) {
    this.#adapter?.controller.set.currentTokens(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get currentToolExecution() {
    return this.#adapter?.controller.get.currentToolExecution();
  }
  set currentToolExecution(value) {
    this.#adapter?.controller.set.currentToolExecution(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get fullScreen() {
    return this.#adapter?.controller.get.fullScreen() ?? false;
  }
  set fullScreen(value) {
    this.#adapter?.controller.set.fullScreen(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get history() {
    return this.#adapter?.controller.get.history() ?? [];
  }
  set history(value) {
    // Use history setter with callback pattern for proper token calculation
    this.#adapter?.controller.set.history(() => {
      const h = this.#adapter.controller.get.history();
      h.length = 0;
      h.push(...value);
    });
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get status() {
    return this.#adapter?.controller.get.status() ?? "connecting";
  }
  set status(value) {
    this.#adapter?.controller.set.status(value);
  }
  /** @internal - State is owned by adapter, exposed for testing/debugging */
  get view() {
    return this.#adapter?.controller.get.view() ?? "main";
  }
  set view(value) {
    this.#adapter?.controller.set.view(value);
  }
  //#endregion

  //#region Props
  /**
   * Configuration object for LLM, tools, UI, and attachments.
   * All chat settings are configured through this single prop.
   *
   * @type {LfChatConfig}
   * @default {}
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfConfig={{
   *   llm: { endpointUrl: "http://localhost:5001", temperature: 0.7 },
   *   tools: { definitions: [...] },
   *   ui: { layout: "top", emptyMessage: "Start chatting!" },
   *   attachments: { maxSize: 10485760, allowedTypes: ["image/*"] }
   * }}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfConfig: LfChatConfig = {};
  /**
   * Custom styling for the component.
   *
   * @type {string}
   * @default ""
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfStyle="#lf-component { color: red; }"></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfStyle: string = "";
  /**
   * Map of tool names to their execution handler functions.
   * Each handler receives the parsed arguments and returns a result.
   * This is kept as a separate prop (not in lfConfig) because functions are not serializable.
   *
   * @type {LfLLMToolHandlers}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat
   *   lfToolHandlers={{
   *     get_weather: async (args) => `Weather in ${args.city}: Sunny`,
   *     search_docs: async (args) => ({ type: "article", dataset: myDataset })
   *   }}
   * />
   * ```
   */
  @Prop({ mutable: true }) lfToolHandlers?: LfLLMToolHandlers;
  /**
   * The size of the component.
   *
   * @type {LfThemeUISize}
   * @default "medium"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfUiSize="small"></lf-chat>
   * ```
   */
  @Prop({ mutable: true, reflect: true }) lfUiSize: LfThemeUISize = "medium";
  /**
   * Callback for uploading files to external storage.
   * Returns attachment metadata after upload completes.
   * This is kept as a separate prop (not in lfConfig) because functions are not serializable.
   *
   * @type {(files: File[]) => Promise<LfLLMAttachment[]>}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfUploadCallback={async (files) => {
   *   // Upload files and return attachment metadata
   *   return files.map(f => ({ id: crypto.randomUUID(), name: f.name, url: '...' }));
   * }}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfUploadCallback?: (
    files: File[],
  ) => Promise<LfLLMAttachment[]>;
  /**
   * Sets the initial history of the chat.
   *
   * @type {LfChatHistory}
   * @default []
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfValue={[]}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfValue: LfChatHistory = [];
  //#endregion

  //#region Internal variables
  #framework: LfFrameworkInterface;
  #b = LF_CHAT_BLOCKS;
  #cy = CY_ATTRIBUTES;
  #lf = LF_ATTRIBUTES;
  #p = LF_CHAT_PARTS;
  #s = LF_STYLE_ID;
  #w = LF_WRAPPER_ID;
  #interval: NodeJS.Timeout;
  #lastMessage: HTMLDivElement | null = null;
  #messagesContainer: HTMLDivElement | null = null;
  #pollVersion = 0;
  #adapter: LfChatAdapter;
  #settingsAccordionDataset: LfDataDataset | null = null;
  //#endregion

  //#region Events
  /**
   * Fires when the component triggers an internal action or user interaction.
   * The event contains an `eventType` string, which identifies the action,
   * and optionally `data` for additional details.
   */
  @Event({
    eventName: "lf-chat-event",
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  lfEvent: EventEmitter<LfChatEventPayload>;
  onLfEvent(e: Event | CustomEvent, eventType: LfChatEvent) {
    const { get } = this.#adapter.controller;
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      history: JSON.stringify(get.history()) || "",
      status: get.status(),
    });
  }
  //#endregion

  //#region Watchers
  @Watch("lfConfig")
  async updateTokensCount() {
    if (!this.#framework || !this.#adapter) {
      return;
    }
    // Recalculate tokens through adapter action
    const { recalculateTokens } = this.#adapter.controller.actions;
    await recalculateTokens();
  }
  //#endregion

  //#region Public methods
  /**
   * Aborts the current streaming response from the LLM.
   */
  @Method()
  async abortStreaming(): Promise<void> {
    const abortController =
      this.#adapter.controller.get.currentAbortStreaming();
    if (abortController) {
      abortController.abort();
    }
  }
  /**
   * Exports current history as JSON file
   */
  @Method()
  async exportHistory(): Promise<void> {
    await exportH(this);
  }
  /**
   * Retrieves the debug information reflecting the current state of the component.
   * @returns {Promise<LfDebugLifecycleInfo>} A promise that resolves to a LfDebugLifecycleInfo object containing debug information.
   */
  @Method()
  async getDebugInfo(): Promise<LfDebugLifecycleInfo> {
    return this.debugInfo;
  }
  /**
   * Returns the full history as a string.
   * @returns {Promise<string>} Full history of the chat.
   */
  @Method()
  async getHistory(): Promise<string> {
    try {
      return JSON.stringify(this.#adapter.controller.get.history());
    } catch {
      return "";
    }
  }
  /**
   * Returns the last message as a string.
   * @returns {Promise<string>} The last message of the history.
   */
  @Method()
  async getLastMessage(): Promise<string> {
    const history = this.#adapter.controller.get.history();
    return history?.slice(-1)?.[0]?.content ?? "";
  }
  /**
   * Used to retrieve component's properties and descriptions.
   * @returns {Promise<LfChatPropsInterface>} Promise resolved with an object containing the component's properties.
   */
  @Method()
  async getProps(): Promise<LfChatPropsInterface> {
    const entries = LF_CHAT_PROPS.map(
      (
        prop,
      ): [keyof LfChatPropsInterface, LfChatPropsInterface[typeof prop]] => [
        prop,
        this[prop],
      ],
    );
    return Object.fromEntries(entries);
  }
  /**
   * Opens file picker for image attachment
   */
  @Method()
  async handleImageAttachment(): Promise<void> {
    await handleImage(this);
  }
  /**
   * Opens file picker for file attachment
   */
  @Method()
  async handleFileAttachment(): Promise<void> {
    await handleFile(this);
  }
  /**
   * Removes an attachment from the current message
   */
  @Method()
  async removeAttachment(id: string): Promise<void> {
    await handleRemove(this, id);
  }
  /**
   * Triggers a re-render of the component to reflect any state changes.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  @Method()
  /**
   * Retries the connection by checking the LLM status.
   * This method attempts to re-establish the connection asynchronously.
   */
  async retryConnection(): Promise<void> {
    await this.#checkLLMStatus();
  }
  /**
   * Scrolls the chat message list to the bottom.
   *
   * The method first checks the component controller status via this.#adapter.controller.get;
   * if the controller is not in the "ready" state the method returns early without performing any scrolling.
   *
   * Behavior:
   * - If blockOrScroll === true, performs a passive scroll of the messages container by calling
   *   this.#messagesContainer.scrollTo({ top: this.#messagesContainer.scrollHeight, behavior: "smooth" }).
   *   This path is intended for initial loads where a container-level scroll is sufficient.
   * - Otherwise, uses this.#lastMessage?.scrollIntoView({ behavior: "smooth", block: blockOrScroll })
   *   to bring the last message element into view for active user interactions. The block argument is
   *   treated as a ScrollLogicalPosition (for example "start" | "center" | "end" | "nearest").
   *
   * Notes:
   * - The method is async and returns a Promise<void>, but it does not wait for the visual scrolling
   *   animation to complete; the promise resolves after issuing the scroll command.
   * - If the messages container or last message element is not present, the corresponding scroll call
   *   is a no-op.
   * - The signature accepts a boolean union for convenience (true = container scroll). Callers who intend
   *   to use scrollIntoView should pass a valid ScrollLogicalPosition value.
   *
   * @param blockOrScroll - If true, scroll the container to the bottom. Otherwise, a ScrollLogicalPosition
   *                        used as the `block` option for scrollIntoView. Defaults to "nearest".
   * @returns Promise<void> that resolves after issuing the scroll command.
   */
  @Method()
  async scrollToBottom(
    blockOrScroll: ScrollLogicalPosition | boolean = "nearest",
  ): Promise<void> {
    const { status } = this.#adapter.controller.get;

    if (status() !== "ready") {
      return;
    }

    // If true, just scroll the container to the bottom (passive scroll for initial loads)
    if (blockOrScroll === true) {
      if (this.#messagesContainer) {
        this.#messagesContainer.scrollTo({
          top: this.#messagesContainer.scrollHeight,
          behavior: "smooth",
        });
      }
      return;
    }

    // Otherwise, use scrollIntoView for active user interactions
    this.#lastMessage?.scrollIntoView({
      behavior: "smooth",
      block: blockOrScroll as ScrollLogicalPosition,
    });
  }
  /**
   * Sets the history of the component through a string.
   */
  @Method()
  async setHistory(history: string, fromFile: boolean = false): Promise<void> {
    await setH(this.#adapter, this, history, fromFile);
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
  /**
   * Initialize adapter using "Adapter as Core" pattern (v4.0.0 Section 5.9).
   * State lives in adapter closure; WC is a thin shell with single `_renderTick`.
   */
  #initAdapter = () => {
    // Base getters - read from WC instance (non-state values)
    const baseGetters = {
      blocks: () => this.#b,
      compInstance: () => this,
      cyAttributes: () => this.#cy,
      framework: () => this.#framework,
      ids: () => LF_CHAT_IDS,
      lfAttributes: () => this.#lf,
      parts: () => this.#p,
    };

    // Initial state for closure variables
    const initialState: LfChatInitialState = {
      agentState: null,
      currentAbortStreaming: null,
      currentAttachments: [],
      currentEditingId: null,
      currentPrompt: null,
      currentTokens: { current: 0, percentage: 0 },
      currentToolExecution: null,
      fullScreen: false,
      history: [],
      status: "connecting",
      view: "main",
    };

    // State change callback - increments _renderTick to trigger re-render
    const onStateChange = () => {
      this._renderTick++;
    };

    // Create adapter without dispatcher first (circular reference)
    const adapterWithoutDispatcher = createAdapter(
      baseGetters,
      initialState,
      onStateChange,
      () => this.#adapter,
    );

    // Create inline dispatcher per v4.0.0 Section 5.5
    const dispatcher: LfChatAdapterDispatcher = {
      emit: (eventType, detail) => {
        const { get } = this.#adapter.controller;
        const payload: LfChatEventPayload = {
          comp: this,
          eventType,
          id: this.rootElement.id,
          history: JSON.stringify(get.history()) || "",
          status: get.status(),
          originalEvent: (detail as LfChatEventPayload)?.originalEvent,
        };
        this.lfEvent.emit(payload);
      },
    };

    // Combine into final adapter
    this.#adapter = {
      ...adapterWithoutDispatcher,
      dispatcher,
    } as LfChatAdapter;
  };
  async #checkLLMStatus() {
    const { get, set } = this.#adapter.controller;

    if (get.view() === "settings") {
      return;
    }

    const currentVersion = this.#pollVersion;

    const { llm } = this.#framework;
    const effectiveConfig = getEffectiveConfig(this.#adapter);
    const endpointUrl = effectiveConfig.llm.endpointUrl;

    if (get.status() === "offline") {
      set.status("connecting");
    }
    try {
      const response = await llm.poll(endpointUrl);

      if (currentVersion !== this.#pollVersion) {
        return;
      }

      if (!response.ok) {
        set.status("offline");
      } else {
        if (get.status() !== "ready") {
          requestAnimationFrame(() => {
            this.scrollToBottom(true);
          });
        }
        set.status("ready");
      }
    } catch (error) {
      if (currentVersion !== this.#pollVersion) {
        return;
      }
      set.status("offline");
    }
    this.onLfEvent(new CustomEvent("polling"), "polling");
  }
  /**
   * Ensures the settings accordion dataset is created (stable reference to prevent collapse).
   */
  #ensureSettingsAccordionDataset = () => {
    if (!this.#settingsAccordionDataset) {
      const { get } = this.#framework.theme;
      this.#settingsAccordionDataset = {
        nodes: [
          {
            cells: { slot: { shape: "slot", value: "llm" } },
            icon: get.icon("ai"),
            id: "llm",
            value: "LLM Configuration",
          },
          {
            cells: { slot: { shape: "slot", value: "advanced" } },
            icon: get.icon("settings"),
            id: "advanced",
            value: "Advanced Settings",
          },
          {
            cells: { slot: { shape: "slot", value: "agent" } },
            icon: get.icon("robot"),
            id: "agent",
            value: "Agent Mode",
          },
          {
            cells: { slot: { shape: "slot", value: "tools" } },
            icon: get.icon("adjustmentsHorizontal"),
            id: "tools",
            value: "Tools",
          },
        ],
      };
    }
  };

  //#region Lifecycle hooks
  connectedCallback() {
    if (this.#framework) {
      this.#framework.theme.register(this);
    }
  }
  async componentWillLoad() {
    this.#framework = await awaitFramework(this);
    this.#initAdapter();

    const { debug } = this.#framework;
    const { get, set } = this.#adapter.controller;

    if (this.lfValue) {
      try {
        const parsedValue =
          typeof this.lfValue === "string"
            ? JSON.parse(this.lfValue)
            : this.lfValue;
        // Set history in closure (uses callback pattern for token calculation)
        const history = get.history();
        set.history(() => {
          history.length = 0;
          history.push(...parsedValue);
        });
      } catch (error) {
        debug.logs.new(this, "Couldn't set value for chat history", "warning");
      }
    }
  }
  componentDidLoad() {
    const { info } = this.#framework.debug;
    const effectiveConfig = getEffectiveConfig(this.#adapter);

    this.#interval = setInterval(
      async () => this.#checkLLMStatus(),
      effectiveConfig.llm.pollingInterval,
    );
    this.onLfEvent(new CustomEvent("ready"), "ready");
    this.#checkLLMStatus();
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
    const { bemClass, setLfStyle } = this.#framework.theme;
    const { get } = this.#adapter.controller;
    const effectiveConfig = getEffectiveConfig(this.#adapter);
    const layout = effectiveConfig.ui.layout;

    const { chat } = this.#b;
    const { lfStyle } = this;
    const status = get.status();
    const view = get.view();
    const fullScreen = get.fullScreen();

    // Ensure settings accordion dataset is created once
    this.#ensureSettingsAccordionDataset();

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(chat._, null, {
              [view]: true,
              [layout]: true,
              [status]: true,
              full: fullScreen,
            })}
            part={this.#p.chat}
          >
            {view === "settings" ? (
              <ChatSettingsFC
                adapter={this.#adapter}
                accordionDataset={this.#settingsAccordionDataset}
              />
            ) : status === "ready" ? (
              [
                <ChatRequestFC adapter={this.#adapter} />,
                <ChatMessagesFC
                  adapter={this.#adapter}
                  messagesContainerRef={(el) => (this.#messagesContainer = el)}
                  lastMessageRef={(el, index) => {
                    const history = get.history();
                    if (el && index === history.length - 1) {
                      this.#lastMessage = el;
                    }
                  }}
                />,
              ]
            ) : status === "connecting" ? (
              <ChatConnectingFC adapter={this.#adapter} />
            ) : (
              <ChatOfflineFC adapter={this.#adapter} />
            )}
          </div>
        </div>
      </Host>
    );
  }
  disconnectedCallback() {
    clearInterval(this.#interval);
    this.#framework?.theme.unregister(this);
  }
  //#endregion
}

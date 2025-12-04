import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CHAT_BLOCKS,
  LF_CHAT_PARTS,
  LF_CHAT_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChatAdapter,
  LfChatAgentState,
  LfChatConfig,
  LfChatCurrentTokens,
  LfChatElement,
  LfChatEvent,
  LfChatEventPayload,
  LfChatHistory,
  LfChatInterface,
  LfChatPropsInterface,
  LfChatStatus,
  LfChatView,
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfIconType,
  LfLLMAttachment,
  LfLLMChoiceMessage,
  LfLLMToolHandlers,
  LfThemeUISize,
} from "@lf-widgets/foundations";
import {
  Component,
  Element,
  Event,
  EventEmitter,
  forceUpdate,
  Fragment,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  VNode,
  Watch,
} from "@stencil/core";
import { FIcon } from "../../utils/icon";
import { awaitFramework } from "../../utils/setup";
import { handleFile, handleImage, handleRemove } from "./helpers.attachments";
import { getEffectiveConfig } from "./helpers.config";
import { exportH, setH } from "./helpers.history";
import { calcTokens, submitPrompt } from "./helpers.messages";
import { parseMessageContent } from "./helpers.parsing";
import { createAdapter } from "./lf-chat-adapter";

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
  @State() agentState: LfChatAgentState | null = null;
  @State() currentAbortStreaming: AbortController | null = null;
  @State() currentAttachments: LfLLMAttachment[] = [];
  @State() currentEditingIndex: number | null = null;
  @State() currentPrompt: LfLLMChoiceMessage;
  @State() currentTokens: LfChatCurrentTokens = { current: 0, percentage: 0 };
  @State() currentToolExecution: LfDataDataset | null = null; // LfDataDataset for tool execution chip
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() history: LfChatHistory = [];
  @State() status: LfChatStatus = "connecting";
  @State() view: LfChatView = "main";
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
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      originalEvent: e,
      history: JSON.stringify(this.history) || "",
      status: this.status,
    });
  }
  //#endregion

  //#region Listeners
  @Listen("keydown")
  listenKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "Enter":
        if (e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          submitPrompt(this.#adapter);
        }
        break;
      default:
        e.stopPropagation();
    }
  }
  //#endregion

  //#region Watchers
  @Watch("lfConfig")
  updateConfig() {
    if (!this.#framework) {
      return;
    }

    this.#pollVersion++;

    const effectiveConfig = getEffectiveConfig(this.#adapter);
    clearInterval(this.#interval);
    this.#interval = setInterval(
      () => this.#checkLLMStatus(),
      effectiveConfig.llm.pollingInterval,
    );

    this.#checkLLMStatus();

    this.updateTokensCount();
  }
  async updateTokensCount() {
    if (!this.#framework || !this.#adapter) {
      return;
    }

    this.currentTokens = await calcTokens(this.#adapter);
  }
  //#endregion

  //#region Public methods
  /**
   * Aborts the current streaming response from the LLM.
   */
  @Method()
  async abortStreaming(): Promise<void> {
    if (this.currentAbortStreaming) {
      this.currentAbortStreaming.abort();
    }
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
      return JSON.stringify(this.history);
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
    return this.history?.slice(-1)?.[0]?.content ?? "";
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
   * Exports current history as JSON file
   */
  @Method()
  async exportHistory(): Promise<void> {
    await exportH(this);
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
  #initAdapter = () => {
    this.#adapter = createAdapter(
      {
        agentState: () => this.agentState,
        blocks: this.#b,
        compInstance: this,
        currentAbortStreaming: () => this.currentAbortStreaming,
        currentAttachments: () => this.currentAttachments,
        currentEditingIndex: () => this.currentEditingIndex,
        currentPrompt: () => this.currentPrompt,
        currentTokens: () => this.currentTokens,
        currentToolExecution: () => this.currentToolExecution,
        cyAttributes: this.#cy,
        history: () => this.history,
        lastMessage: (role = "user") => {
          return this.history
            .slice()
            .reverse()
            .find((m) => m.role === role);
        },
        lfAttributes: this.#lf,
        manager: this.#framework,
        parts: this.#p,
        status: () => this.status,
        view: () => this.view,
      },
      {
        agentState: (value) => (this.agentState = value),
        currentAbortStreaming: (value) => (this.currentAbortStreaming = value),
        currentAttachments: (value) => (this.currentAttachments = value),
        currentEditingIndex: (value) => (this.currentEditingIndex = value),
        currentPrompt: (value) => (this.currentPrompt = value),
        currentTokens: (value) => (this.currentTokens = value),
        currentToolExecution: (value) => (this.currentToolExecution = value),
        history: async (cb) => {
          cb();
          this.currentTokens = await calcTokens(this.#adapter);
          this.onLfEvent(new CustomEvent("update"), "update");
        },
        status: (status) => (this.status = status),
        view: (view) => (this.view = view),
      },
      () => this.#adapter,
    );
  };
  async #checkLLMStatus() {
    const currentVersion = this.#pollVersion;

    const { llm } = this.#framework;
    const effectiveConfig = getEffectiveConfig(this.#adapter);
    const endpointUrl = effectiveConfig.llm.endpointUrl;

    if (this.status === "offline") {
      this.status = "connecting";
    }
    try {
      const response = await llm.poll(endpointUrl);

      if (currentVersion !== this.#pollVersion) {
        return;
      }

      if (!response.ok) {
        this.status = "offline";
      } else {
        if (this.status !== "ready") {
          requestAnimationFrame(() => {
            this.scrollToBottom(true);
          });
        }
        this.status = "ready";
      }
    } catch (error) {
      if (currentVersion !== this.#pollVersion) {
        return;
      }
      this.status = "offline";
    }
    this.onLfEvent(new CustomEvent("polling"), "polling");
  }
  #prepChat = (): VNode => {
    const { bemClass } = this.#framework.theme;
    const effectiveConfig = getEffectiveConfig(this.#adapter);
    const emptyMessage = effectiveConfig.ui.emptyMessage;

    const { chat, commands, input, messages, request } = this.#b;
    const {
      attachFile,
      attachImage,
      attachments,
      clear,
      editableMessage,
      progressbar,
      send,
      settings,
      spinner,
      stt,
      textarea,
    } = this.#adapter.elements.jsx.chat;
    const { history } = this;

    return (
      <Fragment>
        <div class={bemClass(request._)}>
          {attachments()}
          <div class={bemClass(input._)}>
            {attachImage()}
            {attachFile()}
            {settings()}
            {textarea()}
            {progressbar()}
          </div>
          <div class={bemClass(commands._)}>
            {clear()}
            {stt()}
            {send()}
          </div>
        </div>
        <div
          class={bemClass(messages._)}
          ref={(el) => (this.#messagesContainer = el)}
        >
          {history?.length ? (
            history
              .filter((m) => {
                if (m.role === "tool") {
                  return false;
                }
                return true;
              })
              .map((m, index) => {
                const isEditing = this.currentEditingIndex === index;
                return (
                  <div
                    class={bemClass(messages._, messages.container, {
                      [m.role]: true,
                      textarea: isEditing,
                    })}
                    key={index}
                    ref={(el) => {
                      if (el && index === history.length - 1) {
                        this.#lastMessage = el;
                      }
                    }}
                  >
                    <div
                      class={bemClass(messages._, messages.content, {
                        [m.role]: true,
                      })}
                    >
                      {isEditing ? editableMessage(m) : this.#prepContent(m)}
                    </div>
                    {this.#prepToolbar(m, isEditing)}
                  </div>
                );
              })
          ) : (
            <div class={bemClass(messages._, messages.empty)}>
              {emptyMessage}
            </div>
          )}
        </div>
        <div class={bemClass(chat._, chat.spinnerBar)}>{spinner()}</div>
      </Fragment>
    );
  };
  #prepConnecting: () => VNode[] = () => {
    const { bemClass } = this.#framework.theme;

    const { chat } = this.#b;

    return (
      <Fragment>
        <div class={bemClass(chat._, chat.spinner)}>
          <lf-spinner lfActive={true} lfDimensions="7px" lfLayout={6} />
        </div>
        <div class={bemClass(chat._, chat.title)}>Just a moment.</div>
        <div class={bemClass(chat._, chat.text)}>
          Contacting the LLM endpoint...
        </div>
      </Fragment>
    );
  };
  #prepContent = (message: LfLLMChoiceMessage): VNode[] => {
    const nodes: VNode[] = [];

    if (message.articleContent) {
      nodes.push(<lf-article lfDataset={message.articleContent}></lf-article>);
    }

    const hasText = Boolean(message.content && message.content.trim().length);
    const shouldRenderText = message.role !== "tool" || !message.articleContent;

    if (hasText && shouldRenderText) {
      nodes.push(
        ...parseMessageContent(this.#adapter, message.content, message.role),
      );
    }

    return nodes;
  };
  #prepOffline: () => VNode[] = () => {
    const { bemClass, get } = this.#framework.theme;

    const { chat } = this.#b;
    const { configuration } = this.#adapter.elements.jsx.chat;
    const icon = get.icon("door");

    return (
      <Fragment>
        <div class={bemClass(chat._, chat.error)}>
          <FIcon
            framework={this.#framework}
            icon={icon as LfIconType}
            wrapperClass={bemClass(chat._, chat.icon)}
          />
          <div class={bemClass(chat._, chat.title)}>Zzz...</div>
          <div class={bemClass(chat._, chat.text)}>
            The LLM endpoint is currently offline.
          </div>
        </div>
        {configuration()}
      </Fragment>
    );
  };
  #prepSettings = () => {
    const { bemClass, get } = this.#framework.theme;

    const { settings } = this.#b;
    const {
      agentSettings,
      back,
      contextWindow,
      endpoint,
      exportHistory,
      frequencyPenalty,
      importHistory,
      maxTokens,
      polling,
      presencePenalty,
      system,
      seed,
      temperature,
      tools,
      topP,
    } = this.#adapter.elements.jsx.settings;

    // Create stable dataset reference to prevent accordion collapse on re-render
    if (!this.#settingsAccordionDataset) {
      this.#settingsAccordionDataset = {
        nodes: [
          {
            cells: {
              slot: { shape: "slot", value: "llm" },
            },
            icon: get.icon("ai"),
            id: "llm",
            value: "LLM Configuration",
          },
          {
            cells: {
              slot: { shape: "slot", value: "advanced" },
            },
            icon: get.icon("settings"),
            id: "advanced",
            value: "Advanced Settings",
          },
          {
            cells: {
              slot: { shape: "slot", value: "agent" },
            },
            icon: get.icon("robot"),
            id: "agent",
            value: "Agent Mode",
          },
          {
            cells: {
              slot: { shape: "slot", value: "tools" },
            },
            icon: get.icon("adjustmentsHorizontal"),
            id: "tools",
            value: "Tools",
          },
        ],
      };
    }

    return (
      <Fragment>
        <div class={bemClass(settings._, settings.header)}>
          {back()}
          {importHistory()}
          {exportHistory()}
        </div>
        <div
          class={bemClass(settings._, settings.configuration)}
          part={this.#p.settings}
        >
          <lf-accordion
            class={bemClass(settings._, settings.accordion)}
            lfDataset={this.#settingsAccordionDataset}
            lfRipple={true}
          >
            <div slot="llm" class={bemClass(settings._, settings.slotContent)}>
              {system()}
              {endpoint()}
              {temperature()}
              {maxTokens()}
              {topP()}
              {frequencyPenalty()}
              {presencePenalty()}
            </div>
            <div
              slot="advanced"
              class={bemClass(settings._, settings.slotContent)}
            >
              {contextWindow()}
              {seed()}
              {polling()}
            </div>
            <div
              slot="agent"
              class={bemClass(settings._, settings.slotContent)}
            >
              {agentSettings()}
            </div>
            <div
              slot="tools"
              class={bemClass(settings._, settings.slotContent)}
            >
              {tools()}
            </div>
          </lf-accordion>
        </div>
      </Fragment>
    );
  };
  #prepToolbar = (m: LfLLMChoiceMessage, isEditing = false): VNode => {
    const { bemClass } = this.#framework.theme;

    const { toolbar } = this.#b;
    const {
      copyContent,
      deleteMessage,
      messageAttachments,
      regenerate,
      editMessage,
      toolExecution,
    } = this.#adapter.elements.jsx.toolbar;

    return (
      <div class={bemClass(toolbar._)} part={this.#p.toolbar}>
        {messageAttachments(m, isEditing)}
        <div class={bemClass(toolbar._, toolbar.buttons)}>
          {deleteMessage(m)}
          {copyContent(m)}
          {editMessage(m)}
          {m.role === "user" && regenerate(m)}
        </div>
        {toolExecution(m)}
      </div>
    );
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
    const { set } = this.#adapter.controller;

    if (this.lfValue) {
      try {
        const parsedValue =
          typeof this.lfValue === "string"
            ? JSON.parse(this.lfValue)
            : this.lfValue;
        set.history(() => (this.history = parsedValue));
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
    const effectiveConfig = getEffectiveConfig(this.#adapter);
    const layout = effectiveConfig.ui.layout;

    const { chat } = this.#b;
    const { lfStyle, status, view } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(chat._, null, {
              [view]: true,
              [layout]: true,
              [status]: true,
            })}
            part={this.#p.chat}
          >
            {this.view === "settings"
              ? this.#prepSettings()
              : this.status === "ready"
                ? this.#prepChat()
                : this.status === "connecting"
                  ? this.#prepConnecting()
                  : this.#prepOffline()}
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

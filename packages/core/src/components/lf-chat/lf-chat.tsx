import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CHAT_BLOCKS,
  LF_CHAT_PARTS,
  LF_CHAT_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChatAdapter,
  LfChatCurrentTokens,
  LfChatElement,
  LfChatEvent,
  LfChatEventPayload,
  LfChatHistory,
  LfChatInterface,
  LfChatLayout,
  LfChatPropsInterface,
  LfChatStatus,
  LfChatView,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfLLMChoiceMessage,
  LfThemeUISize,
  LfTypewriterPropsInterface,
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
import { awaitFramework } from "../../utils/setup";
import { calcTokens, submitPrompt } from "./helpers.utils";
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
 * settings, such as the context window size, empty message text, and endpoint URL.
 *
 * @example
 * <lf-chat
 * lfContextWindow={8192}
 * lfEmpty="Your chat history is empty!"
 * lfEndpointUrl="http://localhost:5001"
 * lfLayout="top"
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
  @State() debugInfo: LfDebugLifecycleInfo;
  @State() history: LfChatHistory = [];
  @State() currentAbortStreaming: AbortController | null = null;
  @State() currentPrompt: LfLLMChoiceMessage;
  @State() currentTokens: LfChatCurrentTokens = { current: 0, percentage: 0 };
  @State() status: LfChatStatus = "connecting";
  @State() view: LfChatView = "main";
  //#endregion

  //#region Props
  /**
   * How many tokens the context window can handle, used to calculate the occupied space.
   *
   * @type {number}
   * @default 8192
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfContextWindow={8192}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfContextWindow: number = 8192;
  /**
   * Empty text displayed when there is no data.
   *
   * @type {string}
   * @default "Your chat history is empty!"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfEmpty="No messages yet"></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfEmpty: string = "Your chat history is empty!";
  /**
   * The URL endpoint for the chat service.
   *
   * @type {string}
   * @default "http://localhost:5001"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfEndpointUrl="http://localhost:5001"></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfEndpointUrl: string = "http://localhost:5001";
  /**
   * Sets the layout of the chat.
   *
   * @type {LfChatLayout}
   * @default "top"
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfLayout="bottom"></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfLayout: LfChatLayout = "top";
  /**
   * The maximum amount of tokens allowed in the LLM's answer.
   *
   * @type {number}
   * @default 2048
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfMaxTokens={2048}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfMaxTokens: number = 2048;
  /**
   * How often the component checks whether the LLM endpoint is online or not.
   *
   * @type {number}
   * @default 10000
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfPollingInterval={10000}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfPollingInterval: number = 10000;
  /**
   * The seed of the LLM's answer.
   *
   * @type {number}
   * @default -1
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfSeed={-1}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfSeed: number = -1;
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
   * System message for the LLM.
   *
   * @type {string}
   * @default "You are a helpful and cheerful assistant eager to help the user out with his tasks."
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfSystem="You are a helpful assistant"></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfSystem: string =
    "You are a helpful and cheerful assistant eager to help the user out with his tasks.";
  /**
   * Sets the creative boundaries of the LLM.
   *
   * @type {number}
   * @default 0.7
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfTemperature={0.7}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfTemperature: number = 0.7;
  /**
   * Sets the props of the assistant typewriter component. Set this prop to false to replace the typewriter with a simple text element.
   *
   * @type {LfTypewriterPropsInterface | false}
   * @default false
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfTypewriterProps={{ lfDeleteSpeed: 10, lfTag: "p", lfSpeed: 20 }}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfTypewriterProps:
    | LfTypewriterPropsInterface
    | false = false;
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
  #adapter: LfChatAdapter;
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
  @Watch("lfPollingInterval")
  updatePollingInterval() {
    if (!this.#framework) {
      return;
    }

    clearInterval(this.#interval);
    this.#interval = setInterval(this.#checkLLMStatus, this.lfPollingInterval);
  }
  @Watch("lfSystem")
  async updateTokensCount() {
    if (!this.#framework) {
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
   * Triggers a re-render of the component to reflect any state changes.
   */
  @Method()
  async refresh(): Promise<void> {
    forceUpdate(this);
  }
  /**
   * Scrolls the chat area to the bottom.
   *
   * @param {ScrollLogicalPosition} block - Defines vertical alignment. Options: "start", "center", "end", "nearest". Default is "nearest".
   */
  @Method()
  async scrollToBottom(
    block: ScrollLogicalPosition = "nearest",
  ): Promise<void> {
    const { status } = this.#adapter.controller.get;

    if (status() !== "ready") {
      return;
    }

    this.#lastMessage?.scrollIntoView({
      behavior: "smooth",
      block,
    });
  }
  /**
   * Sets the history of the component through a string.
   */
  @Method()
  async setHistory(history: string): Promise<void> {
    const { set } = this.#adapter.controller;

    try {
      set.history(() => (this.history = JSON.parse(history)));
    } catch {}
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
        blocks: this.#b,
        compInstance: this,
        currentAbortStreaming: () => this.currentAbortStreaming,
        currentPrompt: () => this.currentPrompt,
        currentTokens: () => this.currentTokens,
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
        currentAbortStreaming: (value) => (this.currentAbortStreaming = value),
        currentPrompt: (value) => (this.currentPrompt = value),
        currentTokens: (value) => (this.currentTokens = value),
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
    const { llm } = this.#framework;

    if (this.status === "offline") {
      this.status = "connecting";
    }
    try {
      const response = await llm.poll(this.lfEndpointUrl);

      if (!response.ok) {
        this.status = "offline";
      } else {
        this.status = "ready";
        requestAnimationFrame(() => {
          this.scrollToBottom("end");
        });
      }
    } catch (error) {
      this.status = "offline";
    }
    this.onLfEvent(new CustomEvent("polling"), "polling");
  }
  #prepChat = (): VNode => {
    const { bemClass } = this.#framework.theme;

    const { chat, commands, input, messages, request } = this.#b;
    const { clear, progressbar, send, settings, spinner, stt, textarea } =
      this.#adapter.elements.jsx.chat;
    const { history, lfEmpty } = this;

    return (
      <Fragment>
        <div class={bemClass(request._)}>
          <div class={bemClass(input._)}>
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
        <div class={bemClass(messages._)}>
          {history?.length ? (
            history.map((m, index) => (
              <div
                class={bemClass(messages._, messages.container, {
                  [m.role]: true,
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
                  {this.#prepContent(m)}
                </div>
                {this.#prepToolbar(m)}
              </div>
            ))
          ) : (
            <div class={bemClass(messages._, messages.empty)}>{lfEmpty}</div>
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
    const { theme } = this.#framework;
    const { bemClass } = theme;

    const { messages } = this.#b;
    const { messageBlock } = this.#adapter.elements.jsx.chat;
    const { role } = message;

    const elements: VNode[] = [];
    const messageContent = message.content;

    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = codeBlockRegex.exec(messageContent)) !== null) {
      if (match.index > lastIndex) {
        const text = messageContent.slice(lastIndex, match.index);
        elements.push(messageBlock(text, role));
      }

      const language = match[1] ? match[1].trim() : "text";
      const codePart = match[2].trim();

      elements.push(
        <lf-code
          class={bemClass(messages._, messages.code)}
          lfLanguage={language}
          lfValue={codePart}
        ></lf-code>,
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < messageContent.length) {
      const remainingText = messageContent.slice(lastIndex);
      elements.push(messageBlock(remainingText, role));
    }

    return elements;
  };
  #prepOffline: () => VNode[] = () => {
    const { bemClass, get } = this.#framework.theme;

    const { chat } = this.#b;
    const { configuration } = this.#adapter.elements.jsx.chat;
    const icon = get.icon("door");
    const { style } = this.#framework.assets.get(`./assets/svg/${icon}.svg`);

    return (
      <Fragment>
        <div class={bemClass(chat._, chat.error)}>
          <div class={bemClass(chat._, chat.icon)} style={style}></div>
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
    const { bemClass } = this.#framework.theme;

    const { settings } = this.#b;
    const { back, endpoint, maxTokens, polling, system, temperature } =
      this.#adapter.elements.jsx.settings;

    return (
      <Fragment>
        {back()}
        <div
          class={bemClass(settings._, settings.configuration)}
          part={this.#p.settings}
        >
          {system()}
          {endpoint()}
          {temperature()}
          {maxTokens()}
          {polling()}
        </div>
      </Fragment>
    );
  };
  #prepToolbar = (m: LfLLMChoiceMessage): VNode => {
    const { bemClass } = this.#framework.theme;

    const { toolbar } = this.#b;
    const { copyContent, deleteMessage, regenerate } =
      this.#adapter.elements.jsx.toolbar;

    return (
      <div class={bemClass(toolbar._)} part={this.#p.toolbar}>
        {deleteMessage(m)}
        {copyContent(m)}
        {m.role === "user" && regenerate(m)}
      </div>
    );
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

    this.#interval = setInterval(
      async () => this.#checkLLMStatus(),
      this.lfPollingInterval,
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

    const { chat } = this.#b;
    const { lfLayout, lfStyle, status, view } = this;

    return (
      <Host>
        {lfStyle && <style id={this.#s}>{setLfStyle(this)}</style>}
        <div id={this.#w}>
          <div
            class={bemClass(chat._, null, {
              [view]: true,
              [lfLayout]: true,
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

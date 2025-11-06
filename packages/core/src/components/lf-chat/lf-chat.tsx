import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CHAT_BLOCKS,
  LF_CHAT_PARTS,
  LF_CHAT_PROPS,
  LF_STYLE_ID,
  LF_WRAPPER_ID,
  LfChatAdapter,
  LfChatConfig,
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
  LfDataDataset,
  LfDebugLifecycleInfo,
  LfFrameworkInterface,
  LfLLMAttachment,
  LfLLMChoiceMessage,
  LfLLMTool,
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
import { awaitFramework } from "../../utils/setup";
import { calcTokens, parseMessageContent, submitPrompt } from "./helpers.utils";
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
   * @deprecated Use lfConfig.attachments.uploadTimeout instead.
   * Timeout (ms) to apply to the upload callback. Default 60000ms.
   *
   * @type {number}
   * @default 60000
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfAttachmentUploadTimeout={60000}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfAttachmentUploadTimeout?: number = 60000;
  /**
   * Configuration object for LLM, tools, UI, and attachments.
   * Recommended for new implementations; legacy individual props remain supported.
   *
   * @type {LfChatConfig}
   * @default undefined
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
  @Prop({ mutable: true }) lfConfig?: LfChatConfig;
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
   * The tools available for the LLM to use during the conversation.
   * These enable the model to perform actions like web searches or data fetching.
   *
   * @type {LfLLMTool[]}
   * @default []
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfTools='[{"type": "function", "function": {"name": "web_search", "description": "Search the web", "parameters": {"type": "object", "properties": {"query": {"type": "string"}}}}}]'></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfTools: LfLLMTool[] = [];
  /**
   * The frequency penalty for the LLM's answer.
   * This parameter is used to reduce the likelihood of the model repeating the same tokens.
   *
   * @type {number}
   * @default 0
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfFrequencyPenalty={0.5}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfFrequencyPenalty: number = 0;
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
   * This parameter is used to control the length of the generated output.
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
   * The presence penalty for the LLM's answer.
   * This parameter is used to reduce the likelihood of the model repeating the same information.
   *
   * @type {number}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfPresencePenalty={0.5}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfPresencePenalty: number = 0;
  /**
   * The seed of the LLM's answer.
   * This parameter is used to control the randomness of the output.
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
   * The top-p sampling value for the LLM's answer.
   * This parameter controls the diversity of the generated output by limiting the
   * model's consideration to the top-p most probable tokens.
   *
   * @type {number}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfTopP={0.9}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfTopP: number = 0.9;
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
  /**
   * If set, the component will call this
   * function with the selected File[] and await the returned attachments. If not
   * provided the component falls back to embedding base64 data in the `data` field.
   *
   * @type {(files: File[]) => Promise<LfLLMAttachment[]>}
   * @default undefined
   * @mutable
   *
   * @example
   * ```tsx
   * <lf-chat lfUploadCallback={myUploadFunction}></lf-chat>
   * ```
   */
  @Prop({ mutable: true }) lfUploadCallback?: (
    files: File[],
  ) => Promise<LfLLMAttachment[]>;
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
   * Opens file picker for image attachment
   */
  @Method()
  async handleImageAttachment(): Promise<void> {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    const fileToDataUrl = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

    input.onchange = async (e) => {
      const filesList = Array.from((e.target as HTMLInputElement).files || []);
      if (filesList.length === 0) return;

      const uploader = this.lfUploadCallback;

      if (uploader) {
        try {
          const attachments = await uploader(filesList);
          this.currentAttachments = [
            ...this.currentAttachments,
            ...attachments,
          ];
        } catch (err) {
          console.error("Attachment upload failed", err);
        }
      } else {
        for (const file of filesList) {
          try {
            const data = await fileToDataUrl(file);
            const id =
              typeof crypto !== "undefined" &&
              (crypto as Crypto & { randomUUID?: () => string }).randomUUID
                ? (
                    crypto as Crypto & { randomUUID?: () => string }
                  ).randomUUID()
                : String(Date.now()) + String(Math.random()).slice(2, 8);
            const name = file.name;
            const type = "image_url";

            let content: string | undefined;
            if (file.size <= 1024 * 1024) {
              try {
                content = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onerror = () => reject(reader.error);
                  reader.onload = () => resolve(reader.result as string);
                  reader.readAsText(file);
                });
              } catch {}
            }

            const attachment: LfLLMAttachment = {
              id,
              type,
              name,
              url: URL.createObjectURL(file),
              data,
              content,
            };
            this.currentAttachments = [...this.currentAttachments, attachment];
          } catch (err) {
            console.error("Failed to process file", file.name, err);
          }
        }
      }
    };

    input.click();
  }
  /**
   * Opens file picker for file attachment
   */
  @Method()
  async handleFileAttachment(): Promise<void> {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    const fileToDataUrl = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

    const fileToText = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(reader.result as string);
        reader.readAsText(file);
      });

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        for (const file of Array.from(files)) {
          const id =
            typeof crypto !== "undefined" &&
            (crypto as Crypto & { randomUUID?: () => string }).randomUUID
              ? (crypto as Crypto & { randomUUID?: () => string }).randomUUID()
              : String(Date.now());

          let dataUrl: string | undefined;
          let content: string | undefined;

          try {
            dataUrl = await fileToDataUrl(file);
          } catch {
            dataUrl = undefined;
          }

          // Try to read as text for small text files
          if (file.size <= 1024 * 1024) {
            // 1MB limit
            try {
              content = await fileToText(file);
            } catch {
              // Not readable as text, keep undefined
            }
          }

          const attachment: LfLLMAttachment = {
            id,
            type: "file" as const,
            name: file.name,
            url: URL.createObjectURL(file),
            data: dataUrl,
            content,
          };
          this.currentAttachments = [...this.currentAttachments, attachment];
        }
      }
    };

    input.click();
  }

  /**
   * Removes an attachment from the current message
   */
  @Method()
  async removeAttachment(id: string): Promise<void> {
    const toRemove = this.currentAttachments.find((a) => a.id === id);
    if (
      toRemove &&
      typeof toRemove.url === "string" &&
      toRemove.url.startsWith("blob:")
    ) {
      try {
        URL.revokeObjectURL(toRemove.url);
      } catch {}
    }
    this.currentAttachments = this.currentAttachments.filter(
      (a) => a.id !== id,
    );
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
    const { controller } = this.#adapter;
    const { get, set } = controller;
    const { debug } = get.manager;

    if (!fromFile) {
      try {
        set.history(() => (this.history = JSON.parse(history)));
      } catch {}
    } else {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,application/json";

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const text = await file.text();
            const importedHistory: LfLLMChoiceMessage[] = JSON.parse(text);

            if (!Array.isArray(importedHistory)) {
              throw new Error("Invalid history format: expected array");
            }

            for (const msg of importedHistory) {
              if (!msg.role || !msg.content) {
                throw new Error(
                  "Invalid message format: missing role or content",
                );
              }
            }

            set.history(() => {
              this.history = importedHistory;
            });

            debug.logs.new(
              this,
              `Successfully imported ${importedHistory.length} messages`,
              "informational",
            );
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            debug.logs.new(
              this,
              `Failed to import history: ${errorMessage}`,
              "error",
            );
          }
        }
      };

      input.click();
    }
  }

  /**
   * Exports current history as JSON file
   */
  @Method()
  async exportHistory(): Promise<void> {
    const historyJson = JSON.stringify(this.history, null, 2);
    const blob = new Blob([historyJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-history-${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url);
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
    const { llm } = this.#framework;

    if (this.status === "offline") {
      this.status = "connecting";
    }
    try {
      const response = await llm.poll(this.lfEndpointUrl);

      if (!response.ok) {
        this.status = "offline";
      } else {
        if (this.status !== "ready") {
          requestAnimationFrame(() => {
            this.scrollToBottom(true); // Container-only scroll for initial load
          });
        }
        this.status = "ready";
      }
    } catch (error) {
      this.status = "offline";
    }
    this.onLfEvent(new CustomEvent("polling"), "polling");
  }
  #prepChat = (): VNode => {
    const { bemClass } = this.#framework.theme;

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
    const { history, lfEmpty } = this;

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
                // Hide tool messages (internal only)
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
                    {this.#prepToolbar(m)}
                  </div>
                );
              })
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
    return parseMessageContent(this.#adapter, message.content, message.role);
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
    const {
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
      topP,
    } = this.#adapter.elements.jsx.settings;

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
          {system()}
          {endpoint()}
          {temperature()}
          {maxTokens()}
          {topP()}
          {frequencyPenalty()}
          {presencePenalty()}
          <div class={bemClass(settings._, "divider")} />
          {contextWindow()}
          {seed()}
          {polling()}
          <div class={bemClass(settings._, "divider")} />
        </div>
      </Fragment>
    );
  };
  #prepToolbar = (m: LfLLMChoiceMessage): VNode => {
    const { bemClass } = this.#framework.theme;

    const { toolbar } = this.#b;
    const {
      copyContent,
      deleteMessage,
      regenerate,
      editMessage,
      toolExecution,
    } = this.#adapter.elements.jsx.toolbar;

    return (
      <div class={bemClass(toolbar._)} part={this.#p.toolbar}>
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

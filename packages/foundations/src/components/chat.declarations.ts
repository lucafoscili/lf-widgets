import {
  LfComponentAdapter,
  LfComponentAdapterBaseGetters,
  LfComponentAdapterDispatchDetail,
  LfComponentAdapterDispatcher,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset } from "../framework/data.declarations";
import {
  LfLLMAttachment,
  LfLLMChoiceMessage,
  LfLLMRole,
  LfLLMToolDefinition,
  LfLLMToolHandlers,
} from "../framework/llm.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import {
  LF_CHAT_BLOCKS,
  LF_CHAT_EVENTS,
  LF_CHAT_IDS,
  LF_CHAT_LAYOUT,
  LF_CHAT_PARTS,
  LF_CHAT_STATUS,
  LF_CHAT_VIEW,
} from "./chat.constants";
import {
  LfCheckboxElement,
  LfCheckboxEventPayload,
} from "./checkbox.declarations";
import { LfChipElement, LfChipEventPayload } from "./chip.declarations";
import { LfProgressbarElement } from "./progressbar.declarations";
import { LfSpinnerElement } from "./spinner.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-chat` component. It merges the shared component contract with the component-specific props.
 */
export interface LfChatInterface
  extends LfComponent<"LfChat">,
    LfChatPropsInterface {
  abortStreaming: () => Promise<void>;
  exportHistory: () => Promise<void>;
  getHistory: () => Promise<string>;
  getLastMessage: () => Promise<string>;
  handleFileAttachment: () => Promise<void>;
  handleImageAttachment: () => Promise<void>;
  refresh: () => Promise<void>;
  removeAttachment: (id: string) => Promise<void>;
  retryConnection: () => Promise<void>;
  scrollToBottom: (block?: ScrollLogicalPosition | boolean) => Promise<void>;
  setHistory: (value: string, fromFile?: boolean) => Promise<void>;
  unmount: (ms?: number) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-chat`.
 */
export interface LfChatElement
  extends HTMLStencilElement,
    Omit<LfChatInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-chat` into host integrations.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (async ops, batch changes)
 * - elements: JSX factories + refs
 * - dispatcher: REQUIRED centralized event emission
 * - handlers: Event callbacks grouped by domain
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export interface LfChatAdapter
  extends LfComponentAdapter<
    LfChatInterface,
    LfChatEventPayload,
    LfChatAdapterHandlers,
    LfChatAdapterJsx,
    LfChatAdapterRefs,
    LfChatAdapterControllerGetters,
    LfChatAdapterControllerSetters,
    LfChatAdapterControllerComputed,
    LfChatAdapterControllerActions
  > {
  controller: {
    get: LfChatAdapterControllerGetters;
    set: LfChatAdapterControllerSetters;
    computed: LfChatAdapterControllerComputed;
    actions: LfChatAdapterControllerActions;
  };
  dispatcher: LfChatAdapterDispatcher;
  elements: {
    jsx: LfChatAdapterJsx;
    refs: LfChatAdapterRefs;
  };
  handlers: LfChatAdapterHandlers;
}
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfChatAdapterJsx extends LfComponentAdapterJsx {
  chat: {
    attachments: () => VNode;
    clear: () => VNode;
    configuration: () => VNode;
    editableMessage: (m: LfLLMChoiceMessage) => VNode;
    messageBlock: (text: string, role: LfLLMRole) => VNode;
    retry: () => VNode;
    send: () => VNode;
    spinner: () => VNode;
    stt: () => VNode;
  };
  content: {
    bold: (children: (VNode | string)[]) => VNode;
    blockquote: (children: (VNode | string)[]) => VNode;
    bulletList: (children: VNode[]) => VNode;
    codeFence: (language: string, code: string) => VNode;
    heading: (level: number, children: (VNode | string)[]) => VNode;
    horizontalRule: () => VNode;
    image: (url: string, alt?: string) => VNode;
    inlineCode: (content: string) => VNode;
    inlineContainer: (children: (VNode | string)[]) => VNode;
    italic: (children: (VNode | string)[]) => VNode;
    lineBreak: () => VNode;
    link: (href: string, children: (VNode | string)[]) => VNode;
    listItem: (children: (VNode | string)[]) => VNode;
    orderedList: (children: VNode[]) => VNode;
    paragraph: (children: (VNode | string)[]) => VNode;
  };
  input: {
    attachFile: () => VNode;
    attachImage: () => VNode;
    fullScreen: () => VNode;
    progressbar: () => VNode;
    configuration: () => VNode;
    textarea: () => VNode;
  };
  settings: {
    agentSettings: () => VNode;
    back: () => VNode;
    contextWindow: () => VNode;
    endpoint: () => VNode;
    exportHistory: () => VNode;
    frequencyPenalty: () => VNode;
    importHistory: () => VNode;
    maxTokens: () => VNode;
    polling: () => VNode;
    presencePenalty: () => VNode;
    system: () => VNode;
    temperature: () => VNode;
    seed: () => VNode;
    tools: () => VNode;
    topP: () => VNode;
  };
  toolbar: {
    copyContent: (m: LfLLMChoiceMessage) => VNode;
    deleteMessage: (m: LfLLMChoiceMessage) => VNode;
    editMessage: (m: LfLLMChoiceMessage) => VNode;
    messageAttachments: (
      m: LfLLMChoiceMessage,
      isEditing?: boolean,
    ) => VNode | null;
    regenerate: (m: LfLLMChoiceMessage) => VNode;
    toolExecution: (m: LfLLMChoiceMessage) => VNode | null;
  };
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfChatAdapterRefs extends LfComponentAdapterRefs {
  chat: {
    attachments: LfChipElement | null;
    /** FC usage: HTMLButtonElement */
    clear: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    configuration: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    editCancel: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    editConfirm: HTMLButtonElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    editTextarea: HTMLInputElement | HTMLTextAreaElement | null;
    fileInput: HTMLInputElement | null;
    imageInput: HTMLInputElement | null;
    /** FC usage: HTMLButtonElement */
    retry: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    send: HTMLButtonElement | null;
    spinner: LfSpinnerElement | null;
    /** FC usage: HTMLButtonElement */
    stt: HTMLButtonElement | null;
  };
  input: {
    /** FC usage: HTMLButtonElement */
    attachFile: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    attachImage: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    configuration: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    fullScreen: HTMLButtonElement | null;
    progressbar: LfProgressbarElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    textarea: HTMLInputElement | HTMLTextAreaElement | null;
  };
  settings: {
    agentEnabled: LfCheckboxElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    agentMaxIterations: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    agentSystemPromptSuffix: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLButtonElement */
    back: HTMLButtonElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    contextWindow: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    endpoint: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLButtonElement */
    exportHistory: HTMLButtonElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    frequencyPenalty: HTMLInputElement | HTMLTextAreaElement | null;
    historyInput: HTMLInputElement | null;
    /** FC usage: HTMLButtonElement */
    importHistory: HTMLButtonElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    maxTokens: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    polling: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    presencePenalty: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    system: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    seed: HTMLInputElement | HTMLTextAreaElement | null;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    temperature: HTMLInputElement | HTMLTextAreaElement | null;
    tools: Map<string, LfCheckboxElement>;
    /** FC usage: HTMLInputElement | HTMLTextAreaElement */
    topP: HTMLInputElement | HTMLTextAreaElement | null;
  };
  toolbar: {
    /** FC usage: HTMLButtonElement */
    copyContent: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    deleteMessage: HTMLButtonElement | null;
    /** FC usage: HTMLButtonElement */
    editMessage: HTMLButtonElement | null;
    messageAttachments: Map<string, LfChipElement>;
    /** FC usage: HTMLButtonElement */
    regenerate: HTMLButtonElement | null;
    toolExecution: LfChipElement | null;
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfChatAdapterHandlers extends LfComponentAdapterHandlers {
  chat: {
    /** FC: Direct callback receiving button id */
    button: (e: MouseEvent, id: string) => void;
    chip: (e: CustomEvent<LfChipEventPayload>) => void;
    /** FC: Direct callback receiving keydown event */
    textfield: (e: KeyboardEvent) => void;
  };
  settings: {
    /** FC: Direct callback receiving button id */
    button: (e: MouseEvent, id: string) => void;
    checkbox: (e: CustomEvent<LfCheckboxEventPayload>) => void;
    /** FC: Direct callback receiving textfield id and value */
    textfield: (e: Event, id: string, value: string) => void;
  };
  toolbar: {
    /** FC: Direct callback receiving button id and message */
    button: (e: MouseEvent, id: string, m: LfLLMChoiceMessage) => void;
    chip: (e: CustomEvent<LfChipEventPayload>, m: LfLLMChoiceMessage) => void;
  };
}
/**
 * Read-only controller surface exposed by the adapter for integration code.
 * ALL values MUST be functions `() => T` per v4.0.0 Section 5.2.
 * Contains ONLY pure state reads - predicates go in `computed`, async ops go in `actions`.
 *
 * @see Section 5.1 of 4_0_0_REFACTORING.md
 */
export interface LfChatAdapterControllerGetters
  extends LfComponentAdapterBaseGetters<
    LfChatInterface,
    typeof LF_CHAT_BLOCKS,
    typeof LF_CHAT_IDS,
    typeof LF_CHAT_PARTS
  > {
  /** Agent mode state (iteration progress, tool calls, etc.) */
  agentState: () => LfChatAgentState | null;
  /** Current streaming abort controller */
  currentAbortStreaming: () => AbortController | null;
  /** Current message attachments */
  currentAttachments: () => LfLLMAttachment[];
  /** ID of message currently being edited */
  currentEditingId: () => string | null;
  /** Current prompt being prepared */
  currentPrompt: () => LfLLMChoiceMessage | null;
  /** Current token usage stats */
  currentTokens: () => LfChatCurrentTokens;
  /** Current tool execution dataset for chip display */
  currentToolExecution: () => LfDataDataset | null;
  /** Whether chat is in fullscreen mode */
  fullScreen: () => boolean;
  /** Full chat history */
  history: () => LfChatHistory;
  /** Get last message by role */
  lastMessage: (role?: LfLLMRole) => LfLLMChoiceMessage;
  /** Connection/ready status */
  status: () => LfChatStatus;
  /** Current view (main/settings) */
  view: () => LfChatView;
}
/**
 * Simple single-value assignments exposed by the adapter.
 * Each setter performs exactly ONE state change.
 * Multi-step operations go in `actions`.
 */
export interface LfChatAdapterControllerSetters
  extends LfComponentAdapterSetters {
  agentState: (value: LfChatAgentState | null) => void;
  currentAbortStreaming: (value: AbortController | null) => void;
  currentAttachments: (value: LfLLMAttachment[]) => void;
  currentEditingId: (value: string | null) => void;
  currentPrompt: (value: LfLLMChoiceMessage | null) => void;
  currentTokens: (value: LfChatCurrentTokens) => void;
  currentToolExecution: (value: LfDataDataset | null) => void;
  fullScreen: (value: boolean) => void;
  history: (cb: () => unknown) => Promise<void>;
  status: (status: LfChatStatus) => void;
  view: (view: LfChatView) => void;
}
/**
 * Derived values and predicates computed from state.
 * Pure functions with no side effects.
 */
export interface LfChatAdapterControllerComputed {
  /** UI state predicates */
  hasMessages: () => boolean;
  canSend: () => boolean;
  canClear: () => boolean;
  isDisabled: () => boolean;
  /** Message helpers */
  messageCount: () => number;
}
/**
 * Multi-step operations that may have side effects.
 * Includes async operations and complex flows.
 */
export interface LfChatAdapterControllerActions {
  /** Toggle full screen mode */
  toggleFullScreen: () => void;
  /** Toggle settings view */
  toggleSettings: () => void;
  /**
   * Prepare a new prompt from textarea input.
   * This is an async operation that performs blur and getValue.
   * Moved from `controller.get.newPrompt` as it's not a pure state read.
   */
  preparePrompt: () => Promise<LfLLMChoiceMessage | null>;
  /**
   * Recalculate current token count based on history.
   * Used when lfConfig changes (e.g., context window size).
   */
  recalculateTokens: () => Promise<void>;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-chat`.
 */
export type LfChatEvent = (typeof LF_CHAT_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-chat` events.
 */
export interface LfChatEventPayload
  extends LfEventPayload<"LfChat", LfChatEvent> {
  history: string;
  status: LfChatStatus;
}
//#endregion

//#region Dispatcher
/**
 * Dispatcher for centralized event emission.
 * @see Section 5.5 of 4_0_0_REFACTORING.md
 */
export type LfChatAdapterDispatchDetailBase =
  LfComponentAdapterDispatchDetail<LfChatEventPayload>;
export type LfChatAdapterDispatcherDetailOverrides = {
  [E in LfChatEvent]: E extends "lf-event"
    ? LfChatAdapterDispatchDetailBase & {
        originalEvent: CustomEvent;
      }
    : E extends "ready" | "unmount"
      ? Omit<LfChatAdapterDispatchDetailBase, "originalEvent"> & {
          originalEvent?: never;
        }
      : LfChatAdapterDispatchDetailBase;
};
export type LfChatAdapterDispatcher = LfComponentAdapterDispatcher<
  LfChatEventPayload,
  LfChatAdapterDispatcherDetailOverrides
>;
//#endregion
//#endregion

//#region States
/**
 * State information passed to agent iteration callbacks.
 * Provides visibility into the agent's progress during multi-step execution.
 */
export interface LfChatAgentState {
  /**
   * Current iteration number (1-based).
   */
  iteration: number;
  /**
   * Maximum iterations configured.
   */
  maxIterations: number;
  /**
   * Names of tools called in the current iteration.
   */
  toolsCalled: string[];
  /**
   * Total number of tool calls made across all iterations.
   */
  totalToolCalls: number;
  /**
   * Estimated tokens used so far (if available).
   */
  tokensUsed?: number;
  /**
   * Whether the LLM indicated task completion (no more tool calls).
   */
  isComplete: boolean;
  /**
   * Last error encountered (if any).
   */
  lastError?: string;
}
/**
 * Utility interface used by the `lf-chat` component.
 */
export interface LfChatCurrentTokens {
  current: number;
  percentage: number;
}
/**
 * History snapshot maintained by the component to enable undo/redo flows.
 */
export type LfChatHistory = LfLLMChoiceMessage[];
/**
 * Utility type used by the `lf-chat` component.
 */
export type LfChatStatus = (typeof LF_CHAT_STATUS)[number];
/**
 * Utility type used by the `lf-chat` component.
 */
export type LfChatView = (typeof LF_CHAT_VIEW)[number];
//#endregion

//#region Props
/**
 * Configuration object for `lf-chat` component. Provides structured grouping
 * of related settings for LLM behavior, UI preferences, and feature toggles.
 */
export interface LfChatConfig {
  /**
   * Agent mode configuration for autonomous multi-step task execution.
   * When enabled, the LLM can chain multiple tool calls to complete complex tasks.
   */
  agent?: {
    /**
     * Enable agent mode for autonomous multi-step execution.
     * When true, the LLM will automatically continue after tool execution
     * until the task is complete or limits are reached.
     * @default false
     */
    enabled?: boolean;
    /**
     * Maximum number of consecutive tool-calling iterations allowed.
     * Prevents infinite loops and controls resource usage.
     * @default 10
     */
    maxIterations?: number;
    /**
     * Maximum total tokens (input + output) allowed per agent run.
     * Helps control costs for complex multi-step tasks.
     * @default undefined (no limit)
     */
    maxTotalTokens?: number;
    /**
     * Callback invoked after each iteration with current state.
     * Return `false` to stop the agent early (e.g., based on custom conditions).
     */
    onIteration?: (state: LfChatAgentState) => boolean | Promise<boolean>;
    /**
     * Additional system prompt instructions appended when agent mode is active.
     * Helps guide the LLM to properly handle tool results.
     * @default "After receiving tool results, respond to the user with the information. Never call the same tool twice with identical arguments."
     */
    systemPromptSuffix?: string;
  };
  /**
   * LLM provider and API configuration.
   */
  llm?: {
    /**
     * OpenAI-compatible API endpoint URL.
     */
    endpointUrl?: string;
    /**
     * Context window size (max tokens in history).
     */
    contextWindow?: number;
    /**
     * Maximum tokens to generate in response.
     */
    maxTokens?: number;
    /**
     * Polling interval for non-streaming requests (ms).
     */
    pollingInterval?: number;
    /**
     * System prompt defining assistant behavior.
     */
    systemPrompt?: string;
    /**
     * Sampling temperature (0.0-2.0). Lower is more deterministic.
     */
    temperature?: number;
    /**
     * Top-p nucleus sampling (0.0-1.0).
     */
    topP?: number;
    /**
     * Frequency penalty (-2.0 to 2.0). Reduces repetition.
     */
    frequencyPenalty?: number;
    /**
     * Presence penalty (-2.0 to 2.0). Encourages new topics.
     */
    presencePenalty?: number;
    /**
     * Random seed for deterministic sampling.
     */
    seed?: number;
  };
  /**
   * Tool calling configuration (serializable).
   */
  tools?: {
    /**
     * Array of available tool definitions with OpenAI function calling schema.
     * These are serializable - execution handlers are provided via lfToolHandlers prop.
     */
    definitions?: LfLLMToolDefinition[];
    /**
     * Tool names to enable for requests. If undefined, all definitions are enabled.
     * Use this to filter which tools are sent to the LLM.
     */
    enabled?: string[];
    /**
     * Group tools by category for UI organization.
     * Keys are category names, values are arrays of tool names.
     * @example { "Weather": ["get_weather", "get_forecast"], "Search": ["search_web"] }
     */
    categories?: Record<string, string[]>;
  };
  /**
   * User interface and display preferences.
   */
  ui?: {
    /**
     * Layout mode for the chat interface.
     */
    layout?: LfChatLayout;
    /**
     * Message to display when history is empty.
     */
    emptyMessage?: string;
    /**
     * Show visual indicator during tool execution. Default: true.
     */
    showToolExecutionIndicator?: boolean;
  };
  /**
   * Attachment handling configuration.
   */
  attachments?: {
    /**
     * Timeout for upload callback (ms). Default: 60000.
     */
    uploadTimeout?: number;
    /**
     * Maximum file size in bytes.
     */
    maxSize?: number;
    /**
     * Allowed MIME types (e.g., ["image/*", "application/pdf"]).
     */
    allowedTypes?: string[];
  };
}

/**
 * Public props accepted by the `lf-chat` component.
 */
export interface LfChatPropsInterface {
  /**
   * Configuration object for LLM, tools, UI, and attachments.
   * Contains only serializable settings for easy JSON storage/transfer.
   */
  lfConfig?: LfChatConfig;
  /**
   * Custom styling for the component.
   */
  lfStyle?: string;
  /**
   * Map of tool names to their execution handler functions.
   * Each handler receives the parsed arguments and returns a result.
   * This is kept as a separate prop (not in lfConfig) because functions are not serializable.
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
  lfToolHandlers?: LfLLMToolHandlers;
  /**
   * The size of the component.
   */
  lfUiSize?: LfThemeUISize;
  /**
   * Callback for uploading files to external storage.
   * Returns attachment metadata after upload completes.
   * This is kept as a separate prop (not in lfConfig) because functions are not serializable.
   */
  lfUploadCallback?: (files: File[]) => Promise<LfLLMAttachment[]>;
  /**
   * Sets the initial history of the chat.
   */
  lfValue?: LfChatHistory;
}
/**
 * Union of layouts listed in `LF_CHAT_LAYOUT`.
 */
export type LfChatLayout = (typeof LF_CHAT_LAYOUT)[number];
//#endregion

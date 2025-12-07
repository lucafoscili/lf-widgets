import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
} from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset } from "../framework/data.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import {
  LfLLMAttachment,
  LfLLMChoiceMessage,
  LfLLMRole,
  LfLLMToolDefinition,
  LfLLMToolHandlers,
} from "../framework/llm.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_CHAT_BLOCKS,
  LF_CHAT_EVENTS,
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
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
} from "./textfield.declarations";

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
 */
export interface LfChatAdapter extends LfComponentAdapter<LfChatInterface> {
  controller: {
    get: LfChatAdapterControllerGetters;
    set: LfChatAdapterControllerSetters;
  };
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
    attachFile: () => VNode;
    attachImage: () => VNode;
    attachments: () => VNode;
    clear: () => VNode;
    configuration: () => VNode;
    editableMessage: (m: LfLLMChoiceMessage) => VNode;
    messageBlock: (text: string, role: LfLLMRole) => VNode;
    progressbar: () => VNode;
    retry: () => VNode;
    send: () => VNode;
    settings: () => VNode;
    spinner: () => VNode;
    stt: () => VNode;
    textarea: () => VNode;
    toolExecutionChip: () => VNode | null;
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
    attachFile: LfButtonElement | null;
    attachImage: LfButtonElement | null;
    attachments: LfChipElement | null;
    clear: LfButtonElement | null;
    configuration: LfButtonElement | null;
    editCancel: LfButtonElement | null;
    editConfirm: LfButtonElement | null;
    editTextarea: LfTextfieldElement | null;
    fileInput: HTMLInputElement | null;
    imageInput: HTMLInputElement | null;
    progressbar: LfProgressbarElement | null;
    retry: LfButtonElement | null;
    send: LfButtonElement | null;
    settings: LfButtonElement | null;
    spinner: LfSpinnerElement | null;
    stt: LfButtonElement | null;
    textarea: LfTextfieldElement | null;
    toolExecutionChip: LfChipElement | null;
  };
  settings: {
    agentEnabled: LfCheckboxElement | null;
    agentMaxIterations: LfTextfieldElement | null;
    agentSystemPromptSuffix: LfTextfieldElement | null;
    back: LfButtonElement | null;
    contextWindow: LfTextfieldElement | null;
    endpoint: LfTextfieldElement | null;
    exportHistory: LfButtonElement | null;
    frequencyPenalty: LfTextfieldElement | null;
    historyInput: HTMLInputElement | null;
    importHistory: LfButtonElement | null;
    maxTokens: LfTextfieldElement | null;
    polling: LfTextfieldElement | null;
    presencePenalty: LfTextfieldElement | null;
    system: LfTextfieldElement | null;
    seed: LfTextfieldElement | null;
    temperature: LfTextfieldElement | null;
    tools: Map<string, LfCheckboxElement>;
    topP: LfTextfieldElement | null;
  };
  toolbar: {
    copyContent: LfButtonElement | null;
    deleteMessage: LfButtonElement | null;
    editMessage: LfButtonElement | null;
    messageAttachments: Map<string, LfChipElement>;
    regenerate: LfButtonElement | null;
    toolExecution: LfChipElement | null;
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfChatAdapterHandlers extends LfComponentAdapterHandlers {
  chat: {
    button: (e: CustomEvent<LfButtonEventPayload>) => void;
    chip: (e: CustomEvent<LfChipEventPayload>) => void;
    textfield: (e: CustomEvent<LfTextfieldEventPayload>) => void;
  };
  settings: {
    button: (e: CustomEvent<LfButtonEventPayload>) => void;
    checkbox: (e: CustomEvent<LfCheckboxEventPayload>) => void;
    textfield: (e: CustomEvent<LfTextfieldEventPayload>) => void;
  };
  toolbar: {
    button: (
      e: CustomEvent<LfButtonEventPayload>,
      m: LfLLMChoiceMessage,
    ) => void;
    chip: (e: CustomEvent<LfChipEventPayload>, m: LfLLMChoiceMessage) => void;
  };
}
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfChatAdapterInitializerGetters = Pick<
  LfChatAdapterControllerGetters,
  | "agentState"
  | "blocks"
  | "compInstance"
  | "currentAbortStreaming"
  | "currentAttachments"
  | "currentEditingIndex"
  | "currentPrompt"
  | "currentTokens"
  | "currentToolExecution"
  | "cyAttributes"
  | "history"
  | "lastMessage"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "status"
  | "view"
>;

/**
 * Subset of adapter setters required during initialisation.
 */
export type LfChatAdapterInitializerSetters = Pick<
  LfChatAdapterControllerSetters,
  | "agentState"
  | "currentAbortStreaming"
  | "currentAttachments"
  | "currentEditingIndex"
  | "currentPrompt"
  | "currentTokens"
  | "currentToolExecution"
  | "history"
  | "status"
  | "view"
>;
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfChatAdapterControllerGetters
  extends LfComponentAdapterGetters<LfChatInterface> {
  agentState: () => LfChatAgentState | null;
  blocks: typeof LF_CHAT_BLOCKS;
  compInstance: LfChatInterface;
  currentAbortStreaming: () => AbortController | null;
  currentAttachments: () => LfLLMAttachment[];
  currentEditingIndex: () => number;
  currentPrompt: () => LfLLMChoiceMessage | null;
  currentTokens: () => LfChatCurrentTokens;
  currentToolExecution: () => LfDataDataset | null;
  cyAttributes: typeof CY_ATTRIBUTES;
  history: () => LfChatHistory;
  lastMessage: (role?: LfLLMRole) => LfLLMChoiceMessage;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  newPrompt: () => Promise<LfLLMChoiceMessage>;
  parts: typeof LF_CHAT_PARTS;
  status: () => LfChatStatus;
  view: () => LfChatView;
}
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfChatAdapterControllerSetters
  extends LfComponentAdapterSetters {
  agentState: (value: LfChatAgentState | null) => void;
  currentAbortStreaming: (value: AbortController | null) => void;
  currentAttachments: (value: LfLLMAttachment[]) => void;
  currentEditingIndex: (value: number) => void;
  currentPrompt: (value: LfLLMChoiceMessage | null) => void;
  currentTokens: (value: LfChatCurrentTokens) => void;
  currentToolExecution: (value: LfDataDataset | null) => void;
  history: (cb: () => unknown) => Promise<void>;
  status: (status: LfChatStatus) => void;
  view: (view: LfChatView) => void;
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

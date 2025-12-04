import { LfDataDataset } from ".";
import { LfArticleDataset } from "../components/article.declarations";
import { LfButtonElement } from "../components/button.declarations";
import { LfTextfieldElement } from "../components/textfield.declarations";
import { LF_LLM_ROLES } from "./llm.constants";

//#region Class
/**
 * Interface describing a minimal adapter for interacting with a Large Language Model (LLM)
 * provider or service from the UI/framework layer.
 *
 * The implementation is responsible for performing requests, streaming partial responses,
 * handling retries and aborts, providing auxiliary utilities, and offering browser-specific
 * helpers such as speech-to-text integration.
 *
 * @remarks
 * Implementations should be side-effect free where possible and accept AbortSignals for
 * cancellable operations. Consumers can rely on the `stream` generator to progressively
 * consume model output and on `fetch` for a single-shot completion response.
 *
 * @property createAbort - Create and return a new AbortController instance for cancelling operations.
 * @property fetch - Execute a single request to the LLM and resolve with a full completion object.
 * @property poll - Perform a low-level polling HTTP request (useful for providers that provide a pollable URL).
 * @property speechToText - Integrate browser speech recognition into UI controls (e.g. textarea + button)
 *   and update the UI element with transcribed text. Should return once recording/transcription finishes.
 * @property stream - Perform a request that yields partial output chunks as they arrive. The generator
 *   should yield successive LfLLMStreamChunk entries and respect an optional AbortSignal.
 * @property utils - Miscellaneous provider-specific helpers (e.g. token counting, normalization, request builders).
 * @property withRetry - Execute an asynchronous function with retry semantics. Accepts an optional
 *   retry policy to control behavior such as max attempts, backoff strategy, and which errors are retriable.
 *
 * @example
 * // Typical usage patterns:
 * // - Use createAbort() to create a controller shared between UI and network calls.
 * // - Use stream(...) to show partial model output in real time.
 * // - Use withRetry(...) to wrap transient network operations.
 *
 * @template T - Generic return type for withRetry to allow retrying arbitrary async operations.
 */
export interface LfLLMInterface {
  createAbort: () => AbortController;
  fetch: (request: LfLLMRequest, url: string) => Promise<LfLLMCompletionObject>;
  poll: (url: string) => Promise<Response>;
  speechToText: (
    textarea: LfTextfieldElement,
    button: LfButtonElement,
  ) => Promise<void>;
  stream: (
    request: LfLLMRequest,
    url: string,
    opts?: { signal?: AbortSignal },
  ) => AsyncGenerator<LfLLMStreamChunk>;
  utils: LfLLMUtils;
  withRetry: <T>(
    fn: () => Promise<T>,
    policy?: Partial<LfLLMRetryPolicy>,
  ) => Promise<T>;
  /**
   * Returns the list of builtin tools available to consumers. These are
   * provided by the framework and can be merged with user-defined tools.
   */
  getBuiltinTools?: () => LfLLMTool[];
  /**
   * Returns builtin tools grouped by category (e.g. "general", "lfw").
   */
  getBuiltinToolsByCategory?: () => LfLLMBuiltinToolsRegistry;
}
//#endregion

//#region Utilities
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMChoice {
  index: number;
  message: LfLLMChoiceMessage;
  finish_reason: string;
}
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMChoiceMessage {
  attachments?: LfLLMAttachment[];
  role: LfLLMRole;
  content: string;
  tool_calls?: LfLLMToolCall[];
  tool_call_id?: string;
  /**
   * Optional dataset for tool execution chip tree visualization
   * When present, renders chip tree in message toolbar
   */
  toolExecution?: LfDataDataset;
  /**
   * Optional rich article dataset returned by tools.
   * When present, consumers may render `<lf-article>` beneath the message.
   */
  articleContent?: LfArticleDataset;
}
/**
 * Represents an attachment in a chat message
 */
export interface LfLLMAttachment {
  /**
   * Optional inline file data encoded as a data URL (e.g. "data:image/png;base64,...").
   * When present the LLM adapter may use this field to include binary content
   * in the outgoing payload so remote LLM servers can access the attachment.
   */
  data?: string;
  /**
   * For text-based files (e.g., markdown, code), the file content as a string.
   * This allows including file contents directly in messages for supported providers.
   */
  content?: string;
  id: string;
  image_url?: {
    url: string;
    detail?: "low" | "high" | "auto";
  };
  name: string;
  type: "image_url" | "file";
  url?: string;
}
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMCompletionObject {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: LfLLMChoice[];
}
/**
 * Content part for text in a message (OpenAI format).
 */
export interface LfLLMContentPartText {
  type: "text";
  text: string;
}
/**
 * Content part for images in a message (OpenAI format).
 */
export interface LfLLMContentPartImage {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "low" | "high" | "auto";
  };
}
/**
 * Union type for content parts in a message.
 */
export type LfLLMContentPart = LfLLMContentPartText | LfLLMContentPartImage;
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    };
    execute?: (
      args: Record<string, unknown>,
    ) => Promise<string | LfLLMToolResponse> | string | LfLLMToolResponse;
  };
}

/**
 * Serializable tool definition following OpenAI function calling schema.
 * Does NOT include the execute function - that's provided separately via LfLLMToolHandlers.
 * This type is JSON-serializable and can be stored, transferred, or cached.
 */
export interface LfLLMToolDefinition {
  type: "function";
  function: {
    /** Unique name for the tool (used to match with handlers) */
    name: string;
    /** Human-readable description shown to the LLM */
    description: string;
    /** JSON Schema for the tool's parameters */
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
  /** Optional metadata for UI display and organization */
  meta?: {
    /** Category for grouping tools in the UI */
    category?: string;
    /** Icon identifier for the tool */
    icon?: string;
    /** Display name (defaults to function.name) */
    displayName?: string;
  };
}

/**
 * Map of tool names to their execution handlers.
 * This is non-serializable and provided as a separate prop.
 */
export type LfLLMToolHandlers = Record<
  string,
  (
    args: Record<string, unknown>,
  ) => Promise<string | LfLLMToolResponse> | string | LfLLMToolResponse
>;

/**
 * Discriminated union describing the structured result that tools may return.
 * Tools can either emit plain text or a rich `lf-article` dataset (optionally
 * accompanied by a short textual summary for the LLM).
 */
export type LfLLMToolResponse =
  | { type: "text"; content: string }
  | { type: "article"; dataset: LfArticleDataset; content?: string };

/**
 * Registry structure used to organise builtin tools exposed by the framework.
 * Categories are intentionally loose so additional groups can be introduced
 * without breaking existing consumers.
 */
export interface LfLLMBuiltinToolsRegistry {
  general: Record<string, LfLLMTool>;
  lfw: Record<string, LfLLMTool>;
  [category: string]: Record<string, LfLLMTool>;
}
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMRequest {
  model?: string;
  prompt?: string;
  suffix?: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  logprobs?: number | number[];
  echo?: boolean;
  seed?: number;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  best_of?: number;
  logit_bias?: Record<string, number>;
  user?: string;
  system?: string;
  messages?: Array<{
    role: LfLLMRole;
    content: string | LfLLMContentPart[];
  }>;
  tools?: LfLLMToolDefinition[];
}
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMRetryPolicy {
  baseDelayMs: number;
  jitter?: boolean;
  maxAttempts: number;
  retriableErrorNames?: string[];
  retriableStatus?: number[];
}
/**
 * Utility type used by the LLM integration helpers.
 */
export type LfLLMRole = (typeof LF_LLM_ROLES)[number];
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMStreamChunk {
  contentDelta?: string;
  done?: boolean;
  raw?: unknown;
  toolCalls?: LfLLMToolCall[];
}
/**
 * Represents a tool call from the LLM
 */
export interface LfLLMToolCall {
  id: string;
  type?: "function";
  function: {
    name: string;
    arguments: string;
  };
}
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
/**
 * Utility interface used by the LLM integration helpers.
 */
export interface LfLLMUtils {
  hash: (request: LfLLMRequest) => string;
  estimateTokens: (messages: NonNullable<LfLLMRequest["messages"]>) => number;
}
//#endregion

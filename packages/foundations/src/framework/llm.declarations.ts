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
  role: LfLLMRole;
  content: string;
  tool_calls?: unknown[];
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
    content: string;
  }>;
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

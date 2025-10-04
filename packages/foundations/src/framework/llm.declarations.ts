import { LfButtonElement } from "../components/button.declarations";
import { LfTextfieldElement } from "../components/textfield.declarations";
import { LF_LLM_ROLES } from "./llm.constants";

//#region Class
/**
 * Primary interface exposing the LLM integration helpers.
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

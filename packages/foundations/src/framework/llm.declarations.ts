import { LfButtonElement } from "../components/button.declarations";
import { LfTextfieldElement } from "../components/textfield.declarations";
import { LF_LLM_ROLES } from "./llm.constants";

//#region Class
export interface LfLLMInterface {
  fetch: (request: LfLLMRequest, url: string) => Promise<any>;
  poll: (url: string) => Promise<Response>;
  speechToText: (
    textarea: LfTextfieldElement,
    button: LfButtonElement,
  ) => Promise<void>;
}
//#endregion

//#region Utilities
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
export interface LfLLMChoice {
  index: number;
  message: LfLLMChoiceMessage;
  finish_reason: string;
}
export interface LfLLMChoiceMessage {
  role: LfLLMRole;
  content: string;
  tool_calls?: unknown[];
}
export interface LfLLMCompletionObject {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: LfLLMChoice[];
}
export type LfLLMRole = (typeof LF_LLM_ROLES)[number];
export interface LfLLMUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
//#endregion

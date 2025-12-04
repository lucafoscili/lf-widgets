import {
  LfChatAdapter,
  LfLLMContentPart,
  LfLLMRequest,
} from "@lf-widgets/foundations";
import {
  getEffectiveConfig,
  getEnabledToolDefinitions,
} from "./helpers.config";

//#region newRequest
/**
 * Creates a new chat request configuration object based on the provided chat adapter.
 *
 * @param adapter - The chat adapter instance containing controller and component settings
 * @returns A request configuration object with temperature, max tokens, seed and message history
 *
 * @remarks
 * The function extracts settings from the component instance and builds a messages array
 * that includes the system message (if defined) and the conversation history.
 *
 * @example
 * ```typescript
 * const adapter = new LfChatAdapter();
 * const request = newRequest(adapter);
 * ```
 */
export const newRequest = (adapter: LfChatAdapter): LfLLMRequest => {
  const { history } = adapter.controller.get;
  const effectiveConfig = getEffectiveConfig(adapter);

  const messages: LfLLMRequest["messages"] = [];

  if (effectiveConfig.llm.systemPrompt) {
    messages.push({
      role: "system",
      content: effectiveConfig.llm.systemPrompt,
    });
  }

  for (const msg of history()) {
    const parts: LfLLMContentPart[] = [];

    if (msg.attachments && Array.isArray(msg.attachments)) {
      for (const a of msg.attachments) {
        if (!a) {
          continue;
        }

        switch (a.type) {
          case "image_url":
            parts.push({
              type: "image_url",
              image_url: {
                url: a.image_url?.url || a.data || a.url || "",
              },
            });
            break;
          case "file":
          default:
            const text = a.content ?? `[Attachment: ${a.name}]`;
            parts.push({ type: "text", text });
            break;
        }
      }
    }

    if (msg.content) {
      if (parts.length > 0) {
        parts.push({ type: "text", text: msg.content });
        messages.push({ role: msg.role, content: parts });
      } else {
        messages.push({ role: msg.role, content: msg.content });
      }
    } else if (parts.length > 0) {
      messages.push({ role: msg.role, content: parts });
    } else {
      messages.push({ role: msg.role, content: "" });
    }
  }

  // Get enabled tools for sending to the LLM
  const enabledTools = getEnabledToolDefinitions(adapter);

  return {
    frequency_penalty: effectiveConfig.llm.frequencyPenalty,
    max_tokens: effectiveConfig.llm.maxTokens,
    messages,
    presence_penalty: effectiveConfig.llm.presencePenalty,
    seed: effectiveConfig.llm.seed,
    temperature: effectiveConfig.llm.temperature,
    tools: enabledTools,
    top_p: effectiveConfig.llm.topP,
  };
};
//#endregion

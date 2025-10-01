//#region Api call

import {
  LfChatAdapter,
  LfChatCurrentTokens,
  LfLLMChoiceMessage,
  LfLLMRequest,
} from "@lf-widgets/foundations";
import { LfChat } from "./lf-chat";

/**
 * Perform an API call to the configured LLM using the provided chat adapter and
 * update the adapter's history/state with the assistant's response.
 *
 * This function:
 * - Builds a request using `newRequest(adapter)`.
 * - Selects streaming or non-streaming call depending on `manager.llm.stream`.
 * - For streaming mode:
 *   - Optionally creates an AbortController via `manager.llm.createAbort`.
 *   - Sets `controller.set.currentAbortStreaming` to a function that aborts the stream.
 *   - Inserts a placeholder assistant message with empty content into history.
 *   - Iterates over the async stream returned by `manager.llm.stream(request, lfEndpointUrl, { signal })`
 *     and appends `chunk.contentDelta` to the placeholder assistant message as chunks arrive.
 *   - Ensures `controller.set.currentAbortStreaming` is cleared after streaming completes or errors.
 * - For non-streaming mode:
 *   - Awaits `manager.llm.fetch(request, lfEndpointUrl)`.
 *   - Extracts the assistant content from `response.choices?.[0]?.message?.content` and pushes
 *     an assistant message into history.
 * - Catches any error thrown during request/streaming and logs it via `manager.debug.logs.new`.
 *
 * Important implementation/side-effect notes:
 * - Mutates adapter controller state through `get`/`set` (e.g. history and currentAbortStreaming).
 * - Assumes `lfEndpointUrl` is provided on the component instance (`compInstance`).
 * - Assumes `manager.llm` exposes `stream` or `fetch` and (optionally) `createAbort`.
 * - Errors are logged and not re-thrown by this function.
 *
 * @param adapter - The LfChatAdapter which exposes `controller` (get/set), component instance,
 *                  history accessor, and the manager with `llm` and `debug`.
 * @returns A promise that resolves when the API call and history updates have completed.
 */
export const apiCall = async (adapter: LfChatAdapter) => {
  const { get, set } = adapter.controller;
  const { compInstance, history, manager } = get;
  const { lfEndpointUrl } = compInstance;
  const { debug, llm } = manager;
  const comp = compInstance as LfChat;

  try {
    const request = newRequest(adapter);

    if (llm.stream) {
      const abortController = llm.createAbort?.();

      set.currentAbortStreaming(abortController);
      set.history(() => history().push({ role: "assistant", content: "" }));

      try {
        let lastIndex = history().length - 1;
        for await (const chunk of llm.stream(request, lfEndpointUrl, {
          signal: abortController?.signal,
        })) {
          if (chunk?.contentDelta) {
            set.history(() => {
              const h = history();
              if (h[lastIndex]) {
                h[lastIndex].content += chunk.contentDelta;
                comp.scrollToBottom("end");
              }
            });
          }
        }
      } finally {
        set.currentAbortStreaming(null);
      }
    } else {
      const response = await llm.fetch(request, lfEndpointUrl);

      const message = response.choices?.[0]?.message?.content;
      const llmMessage: LfLLMChoiceMessage = {
        role: "assistant",
        content: message,
      };
      set.history(() => history().push(llmMessage));
    }
  } catch (error) {
    debug.logs.new(compInstance, `Error calling LLM: ${error}`, "error");
  }
};

//#region calcTokens
/**
 * Calculates the current number of tokens in the chat history and the percentage of the context window.
 *
 * @param adapter - The chat adapter instance containing controller and component settings
 * @returns A Promise that resolves with the current token count and percentage
 *
 * @example
 * ```typescript
 * const adapter = new LfChatAdapter();
 * const tokens = await calcTokens(adapter);
 * ```
 */
export const calcTokens = async (
  adapter: LfChatAdapter,
): Promise<LfChatCurrentTokens> => {
  const { compInstance, history } = adapter.controller.get;
  const { lfContextWindow, lfSystem } = compInstance;

  if (!lfContextWindow) {
    return {
      current: 0,
      percentage: 0,
    };
  }

  let count = lfSystem ? lfSystem.length : 0;
  history().forEach((m) => (count += m.content.length));
  const estimated = count / 4;

  return {
    current: estimated,
    percentage: (estimated / lfContextWindow) * 100,
  };
};
//#endregion

//#region Clear textarea
/**
 * Clears the chat textarea and sets focus on it.
 * This operation is performed asynchronously using requestAnimationFrame for optimal performance.
 *
 * @param adapter - The chat adapter instance containing references to DOM elements
 * @returns A Promise that resolves when the textarea is cleared and focused
 */
export const clearTextarea = async (adapter: LfChatAdapter) => {
  const { textarea } = adapter.elements.refs.chat;

  requestAnimationFrame(async () => {
    await textarea.setValue("");
    await textarea.setFocus();
  });
};
//#endregion

//#region Delete message
/**
 * Deletes a specific message from the chat history using the provided adapter.
 * @param adapter - The chat adapter instance containing controller methods for managing chat state
 * @param m - The message to be deleted from the chat history
 * @returns void
 */
export const deleteMessage = (
  adapter: LfChatAdapter,
  m: LfLLMChoiceMessage,
) => {
  const { get, set } = adapter.controller;

  const h = get.history();
  const index = h.indexOf(m);
  if (index !== -1) {
    set.history(() => h.splice(index, 1));
  }
};
//#endregion

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
export const newRequest = (adapter: LfChatAdapter) => {
  const { compInstance, history } = adapter.controller.get;
  const { lfMaxTokens, lfSeed, lfSystem, lfTemperature } = compInstance;

  const messages: LfLLMRequest["messages"] = [];

  if (lfSystem) {
    messages.push({
      role: "system",
      content: lfSystem,
    });
  }

  for (const msg of history()) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  return {
    temperature: lfTemperature,
    max_tokens: lfMaxTokens,
    seed: lfSeed,
    messages,
  };
};
//#endregion

//#region Regenerate
/**
 * Regenerates a message in the chat history by making a new API call.
 * This function truncates the history up to the specified message and triggers a new API request.
 *
 * @param adapter - The chat adapter instance that handles communication and state management
 * @param m - The message from which to regenerate the conversation
 * @returns A Promise that resolves when the regeneration is complete
 *
 * @example
 * ```typescript
 * await regenerateMessage(chatAdapter, selectedMessage);
 * ```
 */
export const regenerateMessage = async (
  adapter: LfChatAdapter,
  m: LfLLMChoiceMessage,
) => {
  const { get, set } = adapter.controller;

  const h = get.history();
  const compInstance = get.compInstance as LfChat;

  requestAnimationFrame(async () => {
    set.currentPrompt(m);
  });

  const index = h.indexOf(m);
  if (index !== -1) {
    await set.history(() => {
      compInstance.history = h.slice(0, index + 1);
    });
  }
  await apiCall(adapter);
  resetPrompt(adapter);
};
//#endregion

//#region Reset prompt
/**
 * Resets the current prompt and clears the textarea in the chat interface.
 * @param adapter - The chat adapter instance containing controller and view components
 * @returns A Promise that resolves when the prompt has been reset
 */
export const resetPrompt = async (adapter: LfChatAdapter) => {
  const { get, set } = adapter.controller;
  const comp = get.compInstance as LfChat;

  requestAnimationFrame(async () => {
    set.currentPrompt(null);
    clearTextarea(adapter);
    comp.scrollToBottom();
  });
};
//#endregion

//#region Submit
/**
 * Submits a user prompt to the chat adapter and processes the response.
 *
 * This function performs the following operations:
 * 1. Retrieves the current prompt from the adapter
 * 2. Updates the current prompt state
 * 3. Adds the prompt to chat history if valid
 * 4. Makes an API call with the adapter
 * 5. Resets the prompt afterward
 *
 * @param adapter - The chat adapter instance implementing LfChatAdapter interface
 * @returns A Promise that resolves when the prompt has been processed
 *
 * @throws Will throw an error if the API call fails
 */
export const submitPrompt = async (adapter: LfChatAdapter) => {
  const { get, set } = adapter.controller;
  const { history } = get;

  const userMessage = await get.newPrompt();

  requestAnimationFrame(() => {
    set.currentPrompt(userMessage);
  });

  if (userMessage) {
    const h = history();
    set.history(() => h.push(userMessage));
    await apiCall(adapter);
  }

  resetPrompt(adapter);
};
//#endregion

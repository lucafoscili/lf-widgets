//#region Api call

import {
  LfChatAdapter,
  LfLLMChoiceMessage,
  LfLLMRequest,
} from "@lf-widgets/foundations";
import { LfChat } from "./lf-chat";

/**
 * Makes an API call to a Language Learning Model (LLM) endpoint using the provided chat adapter.
 *
 * This function performs the following operations:
 * 1. Creates a new request using the adapter
 * 2. Sends the request to the LLM endpoint
 * 3. Processes the response and updates the chat history
 *
 * @param adapter - The chat adapter instance containing controller and configuration
 * @throws Will log an error message if the API call fails
 *
 * @example
 * ```typescript
 * const adapter = new LfChatAdapter();
 * await apiCall(adapter);
 * ```
 */
export const apiCall = async (adapter: LfChatAdapter) => {
  const { get, set } = adapter.controller;
  const { compInstance, history, manager } = get;
  const { lfEndpointUrl } = compInstance;
  const { debug, llm } = manager;

  try {
    const request = newRequest(adapter);
    const response = await llm.fetch(request, lfEndpointUrl);

    const message = response.choices?.[0]?.message?.content;
    const llmMessage: LfLLMChoiceMessage = {
      role: "assistant",
      content: message,
    };
    set.history(() => history().push(llmMessage));
  } catch (error) {
    debug.logs.new(compInstance, `Error calling LLM: ${error}`, "error");
  }
};

//#region calcTokens
/**
 * Calculates the token usage percentage based on the chat history and system context.
 * The calculation is an estimation based on character length divided by 4.
 * The result is normalized as a percentage of the context window size.
 *
 * @param adapter - The chat adapter instance containing controller and component data
 * @returns Promise<number> - The estimated token usage as a percentage (0-100) of the context window
 *
 * @example
 * const tokenPercentage = await calcTokens(chatAdapter);
 * console.log(`Current token usage: ${tokenPercentage}%`);
 */
export const calcTokens = async (adapter: LfChatAdapter) => {
  const { compInstance, history } = adapter.controller.get;
  const { lfContextWindow, lfSystem } = compInstance;

  if (!lfContextWindow) {
    return 0;
  }

  let count = lfSystem ? lfSystem.length / 4 : 0;
  history().forEach((m) => (count += m.content.length));
  const estimated = count ? count / 4 : 0;
  return (estimated / lfContextWindow) * 100;
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
  const { set } = adapter.controller;

  requestAnimationFrame(async () => {
    set.currentPrompt(null);
    clearTextarea(adapter);
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

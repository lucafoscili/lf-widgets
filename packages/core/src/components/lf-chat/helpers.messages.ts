import {
  LfChatAdapter,
  LfChatCurrentTokens,
  LfLLMChoiceMessage,
} from "@lf-widgets/foundations";
import { apiCall } from "./helpers.api";
import { getEffectiveConfig } from "./helpers.config";
import { ensureMessageId } from "./helpers.message-id";
import { resetAgentState } from "./helpers.tools";
import { LfChat } from "./lf-chat";

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
  const { history } = adapter.controller.get;
  const effectiveConfig = getEffectiveConfig(adapter);
  const { contextWindow, systemPrompt } = effectiveConfig.llm;

  if (!contextWindow) {
    return {
      current: 0,
      percentage: 0,
    };
  }

  let count = systemPrompt ? systemPrompt.length : 0;
  history().forEach((m) => (count += m.content.length));
  const estimated = count / 4;

  return {
    current: estimated,
    percentage: (estimated / contextWindow) * 100,
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

//#region Edit message
/**
 * Enables editing of a specific message in the chat history by setting the editing index and content.
 *
 * @param adapter - The chat adapter that provides access to the controller for managing chat state.
 * @param m - The message object to be edited, which must be present in the history.
 */
export const editMessage = (adapter: LfChatAdapter, m: LfLLMChoiceMessage) => {
  const { get, set } = adapter.controller;

  const h = get.history();
  if (!h.includes(m)) {
    return;
  }

  const messageWithId = ensureMessageId(m);
  if (messageWithId.id) {
    set.currentEditingId(messageWithId.id);
  }
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
  const { history, compInstance } = get;
  const comp = compInstance as LfChat;

  resetAgentState(adapter);

  const userMessage = await get.newPrompt();
  if (userMessage) {
    ensureMessageId(userMessage);
  }
  const hasAttachments =
    comp?.currentAttachments && comp.currentAttachments.length > 0;

  requestAnimationFrame(() => {
    set.currentPrompt(userMessage);
  });

  if (userMessage || hasAttachments) {
    let messageToSend = userMessage;

    if (!userMessage && hasAttachments) {
      messageToSend = ensureMessageId({
        role: "user" as const,
        content: "",
        attachments: comp.currentAttachments,
      } as LfLLMChoiceMessage);
    } else if (userMessage && hasAttachments) {
      const userWithAttachments = userMessage;
      userWithAttachments.attachments = comp.currentAttachments;
    }

    if (hasAttachments) {
      comp.currentAttachments = [];
    }

    if (messageToSend) {
      set.history(() => history().push(messageToSend));
      // Scroll to bottom after user message is added
      requestAnimationFrame(() => comp.scrollToBottom(true));
      await apiCall(adapter);
    }
  }

  resetPrompt(adapter);
};
//#endregion

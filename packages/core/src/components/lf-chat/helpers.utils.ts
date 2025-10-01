import {
  LfChatAdapter,
  LfChatCurrentTokens,
  LfLLMChoiceMessage,
  LfLLMRequest,
  LfLLMRole,
} from "@lf-widgets/foundations";
import { VNode } from "@stencil/core";
import { LfChat } from "./lf-chat";

//#region Api call
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
        let chunkCount = 0;
        for await (const chunk of llm.stream(request, lfEndpointUrl, {
          signal: abortController?.signal,
        })) {
          if (chunk?.contentDelta) {
            set.history(() => {
              const h = history();
              if (h[lastIndex]) {
                h[lastIndex].content += chunk.contentDelta;
                if (chunkCount % 5 === 0) {
                  requestAnimationFrame(() => comp.scrollToBottom(true));
                }
                chunkCount++;
              }
            });
          }
        }
        requestAnimationFrame(() => comp.scrollToBottom("end"));
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

//#region Parse message content
/**
 * Parses markdown content from a chat message and converts it to VNode elements.
 *
 * Supports the following markdown features:
 * - **Bold** and __bold__ text
 * - *Italic* and _italic_ text
 * - `Inline code`
 * - Fenced code blocks (```lang ... ```)
 * - Headings (# through ######)
 * - Blockquotes (>)
 * - Unordered lists (-, *, +)
 * - Ordered lists (1., 2., 3.)
 * - Links ([text](url))
 * - Horizontal rules (---, ___, ***)
 * - Line breaks
 *
 * @param adapter - The chat adapter instance containing formatting elements
 * @param content - The markdown content string to parse
 * @param role - The role of the message sender (affects text rendering via messageBlock)
 * @returns An array of VNodes representing the parsed content
 *
 * @example
 * ```typescript
 * const vnodes = parseMessageContent(adapter, "**Hello** world!", "user");
 * ```
 */
export const parseMessageContent = (
  adapter: LfChatAdapter,
  content: string,
  role: LfLLMRole,
): VNode[] => {
  const { elements, controller } = adapter;
  const { manager } = controller.get;
  const { syntax } = manager;
  const { messageBlock } = elements.jsx.chat;
  const contentElements = elements.jsx.content;

  const tokens = syntax.parseMarkdown(content || "");

  const vnodes: VNode[] = [];

  const renderInlineTokens = (
    inlineTokens: ReturnType<typeof syntax.parseMarkdown>,
  ): (VNode | string)[] => {
    const out: (VNode | string)[] = [];

    for (let i = 0; i < inlineTokens.length; i++) {
      const t = inlineTokens[i];

      if (t.type === "text") {
        out.push(t.content);
        continue;
      }

      if (t.type === "code_inline") {
        out.push(contentElements.inlineCode(t.content));
        continue;
      }

      if (t.type === "strong_open") {
        const inner: typeof inlineTokens = [];
        i++;
        while (
          i < inlineTokens.length &&
          inlineTokens[i].type !== "strong_close"
        ) {
          inner.push(inlineTokens[i]);
          i++;
        }
        out.push(contentElements.bold(renderInlineTokens(inner)));
        continue;
      }

      if (t.type === "em_open") {
        const inner: typeof inlineTokens = [];
        i++;
        while (i < inlineTokens.length && inlineTokens[i].type !== "em_close") {
          inner.push(inlineTokens[i]);
          i++;
        }
        out.push(contentElements.italic(renderInlineTokens(inner)));
        continue;
      }

      if (t.type === "link_open") {
        const href = t.attrGet("href") || "#";
        const inner: typeof inlineTokens = [];
        i++;
        while (
          i < inlineTokens.length &&
          inlineTokens[i].type !== "link_close"
        ) {
          inner.push(inlineTokens[i]);
          i++;
        }
        out.push(contentElements.link(href, renderInlineTokens(inner)));
        continue;
      }

      if (t.type === "softbreak" || t.type === "hardbreak") {
        out.push(contentElements.lineBreak());
        continue;
      }

      if (t.content) {
        out.push(messageBlock(t.content, role));
      }
    }

    return out.flat();
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "fence") {
      const language = (token.info || "").trim() || "text";
      const codePart = token.content.trim();
      vnodes.push(contentElements.codeFence(language, codePart));
      continue;
    }

    if (token.type === "heading_open") {
      const level = parseInt(token.tag?.replace("h", "") || "1", 10);
      i++;
      if (i < tokens.length && tokens[i].type === "inline") {
        const headingContent = renderInlineTokens(tokens[i].children || []);
        vnodes.push(contentElements.heading(level, headingContent));
      }
      i++;
      continue;
    }

    if (token.type === "blockquote_open") {
      const blockContent: (VNode | string)[] = [];
      i++;
      while (i < tokens.length && tokens[i].type !== "blockquote_close") {
        if (tokens[i].type === "inline") {
          blockContent.push(...renderInlineTokens(tokens[i].children || []));
        }
        i++;
      }
      vnodes.push(contentElements.blockquote(blockContent));
      continue;
    }

    if (token.type === "bullet_list_open") {
      const listItems: VNode[] = [];
      i++;
      while (i < tokens.length && tokens[i].type !== "bullet_list_close") {
        if (tokens[i].type === "list_item_open") {
          const itemContent: (VNode | string)[] = [];
          i++;
          while (i < tokens.length && tokens[i].type !== "list_item_close") {
            if (tokens[i].type === "inline") {
              itemContent.push(...renderInlineTokens(tokens[i].children || []));
            }
            i++;
          }
          listItems.push(contentElements.listItem(itemContent));
        }
        i++;
      }
      vnodes.push(contentElements.bulletList(listItems));
      continue;
    }

    if (token.type === "ordered_list_open") {
      const listItems: VNode[] = [];
      i++;
      while (i < tokens.length && tokens[i].type !== "ordered_list_close") {
        if (tokens[i].type === "list_item_open") {
          const itemContent: (VNode | string)[] = [];
          i++;
          while (i < tokens.length && tokens[i].type !== "list_item_close") {
            if (tokens[i].type === "inline") {
              itemContent.push(...renderInlineTokens(tokens[i].children || []));
            }
            i++;
          }
          listItems.push(contentElements.listItem(itemContent));
        }
        i++;
      }
      vnodes.push(contentElements.orderedList(listItems));
      continue;
    }

    if (token.type === "hr") {
      vnodes.push(contentElements.horizontalRule());
      continue;
    }

    if (token.type === "paragraph_open") {
      continue;
    }

    if (token.type === "inline") {
      vnodes.push(...(renderInlineTokens(token.children || []) as VNode[]));
      continue;
    }

    if (token.children) {
      vnodes.push(...(renderInlineTokens(token.children) as VNode[]));
    } else if (token.content) {
      vnodes.push(messageBlock(token.content, role));
    }
  }

  return vnodes;
};
//#endregion

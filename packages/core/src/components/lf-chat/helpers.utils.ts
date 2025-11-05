import {
  LfChatAdapter,
  LfChatConfig,
  LfChatCurrentTokens,
  LfLLMChoiceMessage,
  LfLLMContentPart,
  LfLLMRequest,
  LfLLMRole,
  LfLLMTool,
} from "@lf-widgets/foundations";
import { VNode } from "@stencil/core";
import { LfChat } from "./lf-chat";

//#region Config merge utility
/**
 * Merges the new lfConfig prop with legacy individual props.
 * Legacy props take precedence if set (for backward compatibility).
 * Logs warnings for deprecated props via LfDebug.
 *
 * @param adapter - The chat adapter instance
 * @returns Effective config object with all settings resolved
 */
export const getEffectiveConfig = (
  adapter: LfChatAdapter,
): Required<LfChatConfig> => {
  const { get } = adapter.controller;
  const { compInstance, manager } = get;
  const { debug } = manager;
  const component = compInstance as LfChat;
  const config = component.lfConfig || {};
  const hasConfig = !!component.lfConfig;

  // Helper to log deprecation warnings
  const warnDeprecated = (oldProp: string, newPath: string) => {
    if (!hasConfig) return; // Only warn if using both config and legacy props
    debug.logs.new(
      component,
      `Prop "${oldProp}" is deprecated. Use "lfConfig.${newPath}" instead. Legacy prop takes precedence.`,
      "warning",
    );
  };

  // LLM config with legacy prop overrides
  const endpointUrl =
    component.lfEndpointUrl !== "http://localhost:5001"
      ? (warnDeprecated("lfEndpointUrl", "llm.endpointUrl"),
        component.lfEndpointUrl)
      : (config.llm?.endpointUrl ?? "http://localhost:5001");

  const contextWindow =
    component.lfContextWindow !== 8192
      ? (warnDeprecated("lfContextWindow", "llm.contextWindow"),
        component.lfContextWindow)
      : (config.llm?.contextWindow ?? 8192);

  const maxTokens =
    component.lfMaxTokens !== 2048
      ? (warnDeprecated("lfMaxTokens", "llm.maxTokens"), component.lfMaxTokens)
      : (config.llm?.maxTokens ?? 2048);

  const pollingInterval =
    component.lfPollingInterval !== 10000
      ? (warnDeprecated("lfPollingInterval", "llm.pollingInterval"),
        component.lfPollingInterval)
      : (config.llm?.pollingInterval ?? 10000);

  const systemPrompt =
    component.lfSystem !==
    "You are a helpful and cheerful assistant eager to help the user out with his tasks."
      ? (warnDeprecated("lfSystem", "llm.systemPrompt"), component.lfSystem)
      : (config.llm?.systemPrompt ??
        "You are a helpful and cheerful assistant eager to help the user out with his tasks.");

  const temperature =
    component.lfTemperature !== 0.7
      ? (warnDeprecated("lfTemperature", "llm.temperature"),
        component.lfTemperature)
      : (config.llm?.temperature ?? 0.7);

  const topP =
    component.lfTopP !== 0.9
      ? (warnDeprecated("lfTopP", "llm.topP"), component.lfTopP)
      : (config.llm?.topP ?? 0.9);

  const frequencyPenalty =
    component.lfFrequencyPenalty !== 0
      ? (warnDeprecated("lfFrequencyPenalty", "llm.frequencyPenalty"),
        component.lfFrequencyPenalty)
      : (config.llm?.frequencyPenalty ?? 0);

  const presencePenalty =
    component.lfPresencePenalty !== 0
      ? (warnDeprecated("lfPresencePenalty", "llm.presencePenalty"),
        component.lfPresencePenalty)
      : (config.llm?.presencePenalty ?? 0);

  const seed =
    component.lfSeed !== -1
      ? (warnDeprecated("lfSeed", "llm.seed"), component.lfSeed)
      : (config.llm?.seed ?? -1);

  // Tools config
  const tools =
    component.lfTools?.length > 0
      ? (warnDeprecated("lfTools", "tools.definitions"), component.lfTools)
      : (config.tools?.definitions ?? []);

  // UI config
  const layout =
    component.lfLayout !== "top"
      ? (warnDeprecated("lfLayout", "ui.layout"), component.lfLayout)
      : (config.ui?.layout ?? "top");

  const emptyMessage =
    component.lfEmpty !== "Your chat history is empty!"
      ? (warnDeprecated("lfEmpty", "ui.emptyMessage"), component.lfEmpty)
      : (config.ui?.emptyMessage ?? "Your chat history is empty!");

  // Attachments config
  const uploadTimeout =
    component.lfAttachmentUploadTimeout !== 60000
      ? (warnDeprecated(
          "lfAttachmentUploadTimeout",
          "attachments.uploadTimeout",
        ),
        component.lfAttachmentUploadTimeout!)
      : (config.attachments?.uploadTimeout ?? 60000);

  const uploadCallback = component.lfUploadCallback
    ? (warnDeprecated("lfUploadCallback", "attachments.uploadCallback"),
      component.lfUploadCallback)
    : config.attachments?.uploadCallback;

  const maxSize = config.attachments?.maxSize;
  const allowedTypes = config.attachments?.allowedTypes;

  return {
    llm: {
      endpointUrl,
      contextWindow,
      maxTokens,
      pollingInterval,
      systemPrompt,
      temperature,
      topP,
      frequencyPenalty,
      presencePenalty,
      seed,
    },
    tools: {
      definitions: tools,
    },
    ui: {
      layout,
      emptyMessage,
    },
    attachments: {
      uploadTimeout,
      maxSize,
      allowedTypes,
      uploadCallback,
    },
  };
};
//#endregion

//#region Api call
export const apiCall = async (adapter: LfChatAdapter) => {
  const { get } = adapter.controller;
  const { compInstance, manager } = get;
  const { debug, llm } = manager;

  try {
    const request = newRequest(adapter);

    if (llm.stream) {
      await handleStreamingResponse(adapter, request);
    } else {
      await handleFetchResponse(adapter, request);
    }
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    debug.logs.new(compInstance, `Error calling LLM: ${errMessage}`, "error");
  }
};
//#endregion

//#region Execute tools
export const executeTools = async (
  toolCalls: unknown[],
  availableTools: LfLLMTool[] = [],
): Promise<LfLLMChoiceMessage[]> => {
  const results: LfLLMChoiceMessage[] = [];

  if (!Array.isArray(toolCalls)) {
    return results;
  }

  for (const call of toolCalls) {
    if (!call || typeof call !== "object") {
      continue;
    }

    const callObj = call as any;
    const func = callObj.function;
    if (!func || !func.name) {
      continue;
    }

    let result = "";

    const matchingTool = availableTools.find(
      (tool) => tool.function?.name === func.name,
    );

    if (matchingTool) {
      // Valid tool found - try to execute
      try {
        const args = JSON.parse(func.arguments || "{}");

        if (matchingTool.function.execute) {
          result = await matchingTool.function.execute(args);
        } else {
          result = `Error: Tool "${func.name}" has no execute function defined. This is a configuration error.`;
        }
      } catch (parseError) {
        result = `Error: Failed to parse arguments for tool "${func.name}". ${parseError instanceof Error ? parseError.message : String(parseError)}. Please check the argument format and try again.`;
      }
    } else {
      // Tool not found - provide helpful error message
      const availableToolNames = availableTools
        .map((t) => `"${t.function?.name}"`)
        .join(", ");

      result = `Error: Tool "${func.name}" is not available. Available tools are: ${availableToolNames}. Please use one of these tool names exactly as shown.`;
    }

    results.push({
      role: "tool",
      content: result,
      tool_call_id: callObj.id,
    });
  }

  return results;
};
//#endregion

//#region Handle tool calls
/**
 * Handles tool calls received from the LLM, executes valid tools, and continues the conversation.
 *
 * @param adapter - The chat adapter instance
 * @param toolCalls - Array of tool calls from the LLM
 * @returns Promise that resolves when tool handling is complete
 */
const handleToolCalls = async (
  adapter: LfChatAdapter,
  toolCalls: unknown[],
): Promise<void> => {
  const { get, set } = adapter.controller;
  const { compInstance, history } = get;
  const { debug } = get.manager;
  const effectiveConfig = getEffectiveConfig(adapter);

  if (!toolCalls || toolCalls.length === 0) {
    return;
  }

  debug.logs.new(
    compInstance,
    `Tool calls received: ${JSON.stringify(toolCalls, null, 2)}`,
    "informational",
  );

  // Execute tools
  const toolResults = await executeTools(
    toolCalls,
    effectiveConfig.tools.definitions,
  );

  debug.logs.new(
    compInstance,
    `Tool execution completed. Results: ${JSON.stringify(toolResults, null, 2)}`,
    "informational",
  );

  // Check if any tools were successfully executed
  const hasValidToolResults = toolResults.some(
    (result) =>
      result.content &&
      !result.content.startsWith('Tool "') &&
      !result.content.includes("is not available"),
  );

  const hasErrors = toolResults.some(
    (result) =>
      result.content &&
      (result.content.startsWith('Tool "') ||
        result.content.includes("is not available")),
  );

  if (hasValidToolResults) {
    // At least one tool executed successfully
    debug.logs.new(
      compInstance,
      `${toolResults.length} tool result(s) added to history`,
      "informational",
    );

    for (const result of toolResults) {
      set.history(() => history().push(result));
    }

    debug.logs.new(
      compInstance,
      "Making follow-up request after successful tool execution",
      "informational",
    );
    await apiCall(adapter);
  } else if (hasErrors) {
    // All tools failed - still add error messages to history so LLM can see them
    debug.logs.new(
      compInstance,
      "All tool calls failed. Adding error messages to history for LLM recovery.",
      "warning",
    );

    for (const result of toolResults) {
      set.history(() => history().push(result));
    }

    // Make follow-up request so LLM can see the errors and respond
    debug.logs.new(
      compInstance,
      "Making follow-up request after tool errors (LLM will see error messages)",
      "informational",
    );
    await apiCall(adapter);
  } else {
    // No tool results at all (shouldn't happen, but handle it)
    debug.logs.new(
      compInstance,
      "No tool results generated (unexpected)",
      "error",
    );
  }
};
//#endregion

//#region Handle streaming response
/**
 * Handles streaming response from the LLM, including content deltas and tool calls.
 *
 * @param adapter - The chat adapter instance
 * @param request - The LLM request configuration
 * @returns Promise that resolves when streaming is complete
 */
const handleStreamingResponse = async (
  adapter: LfChatAdapter,
  request: LfLLMRequest,
): Promise<void> => {
  const { get, set } = adapter.controller;
  const { compInstance, history, manager } = get;
  const { lfEndpointUrl } = compInstance;
  const { llm } = manager;
  const comp = compInstance as LfChat;

  const abortController = llm.createAbort?.();
  set.currentAbortStreaming(abortController);
  set.history(() => history().push({ role: "assistant", content: "" }));

  try {
    let lastIndex = history().length - 1;
    let chunkCount = 0;
    let accumulatedToolCalls: unknown[] = [];

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

      if (chunk?.toolCalls && Array.isArray(chunk.toolCalls)) {
        accumulatedToolCalls.push(...chunk.toolCalls);
        manager.debug.logs.new(
          compInstance,
          `Tool call chunk received: ${JSON.stringify(chunk.toolCalls)}`,
          "informational",
        );
      }
    }

    if (accumulatedToolCalls.length > 0) {
      manager.debug.logs.new(
        compInstance,
        `Streaming complete. Total tool calls accumulated: ${accumulatedToolCalls.length}`,
        "informational",
      );
      set.history(() => {
        const h = history();
        if (h[lastIndex]) {
          h[lastIndex].tool_calls = accumulatedToolCalls;
        }
      });

      await handleToolCalls(adapter, accumulatedToolCalls);
    }

    requestAnimationFrame(() => comp.scrollToBottom("end"));
  } finally {
    set.currentAbortStreaming(null);
  }
};
//#endregion

//#region Handle non-streaming response
/**
 * Handles non-streaming (fetch) response from the LLM, including tool calls.
 *
 * @param adapter - The chat adapter instance
 * @param request - The LLM request configuration
 * @returns Promise that resolves when the response is processed
 */
const handleFetchResponse = async (
  adapter: LfChatAdapter,
  request: LfLLMRequest,
): Promise<void> => {
  const { get, set } = adapter.controller;
  const { compInstance, history, manager } = get;
  const { lfEndpointUrl } = compInstance;
  const { llm } = manager;

  const response = await llm.fetch(request, lfEndpointUrl);

  const message = response.choices?.[0]?.message?.content;
  const toolCalls = response.choices?.[0]?.message?.tool_calls;
  const llmMessage: LfLLMChoiceMessage = {
    role: "assistant",
    content: message,
    tool_calls: toolCalls,
  };
  set.history(() => history().push(llmMessage));

  // Handle tool calls if any
  if (toolCalls && toolCalls.length > 0) {
    await handleToolCalls(adapter, toolCalls);
  }
};
//#endregion

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
  const index = h.indexOf(m);
  if (index !== -1) {
    set.currentEditingIndex(index);
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

        const url = a.data ?? a.url;
        switch (a.type) {
          case "image_url":
            parts.push({
              type: "image_url",
              image_url: {
                url,
                detail: a.image_url?.detail ?? "auto",
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

  return {
    frequency_penalty: effectiveConfig.llm.frequencyPenalty,
    max_tokens: effectiveConfig.llm.maxTokens,
    messages,
    presence_penalty: effectiveConfig.llm.presencePenalty,
    seed: effectiveConfig.llm.seed,
    temperature: effectiveConfig.llm.temperature,
    tools: effectiveConfig.tools.definitions,
    top_p: effectiveConfig.llm.topP,
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
  const { history, compInstance } = get;
  const comp = compInstance as LfChat;

  const userMessage = await get.newPrompt();

  requestAnimationFrame(() => {
    set.currentPrompt(userMessage);
  });

  if (userMessage) {
    const h = history();

    if (comp?.currentAttachments && comp.currentAttachments.length > 0) {
      const userWithAttachments = userMessage;
      userWithAttachments.attachments = comp.currentAttachments;
      comp.currentAttachments = [];
    }

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
  content: any,
  role: LfLLMRole,
): VNode[] => {
  const { elements, controller } = adapter;
  const { manager } = controller.get;
  const { syntax } = manager;
  const { messageBlock } = elements.jsx.chat;
  const contentElements = elements.jsx.content;

  if (Array.isArray(content)) {
    const nodes: VNode[] = [];
    for (const part of content) {
      if (part?.type === "text") {
        nodes.push(...parseMessageContent(adapter, part.text, role));
      } else if (part?.type === "image_url") {
        if (contentElements.image) {
          nodes.push(
            contentElements.image(part.image_url.url, part.image_url.detail),
          );
        }
      }
    }
    return nodes;
  }

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
      i++;
      if (i < tokens.length && tokens[i].type === "inline") {
        const paragraphContent = renderInlineTokens(tokens[i].children || []);
        vnodes.push(contentElements.paragraph(paragraphContent));
      }
      i++;
      continue;
    }

    if (token.type === "inline") {
      const inlineContent = renderInlineTokens(token.children || []);
      vnodes.push(contentElements.inlineContainer(inlineContent));
      continue;
    }

    if (token.children) {
      vnodes.push(
        contentElements.inlineContainer(renderInlineTokens(token.children)),
      );
    } else if (token.content) {
      vnodes.push(messageBlock(token.content, role));
    }
  }

  return vnodes;
};
//#endregion

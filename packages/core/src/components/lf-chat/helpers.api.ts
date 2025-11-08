import {
  LfChatAdapter,
  LfLLMChoiceMessage,
  LfLLMRequest,
  LfLLMToolCall,
} from "@lf-widgets/foundations";
import { newRequest } from "./helpers.request";
import { createInitialToolDataset, handleToolCalls } from "./helpers.tools";
import { LfChat } from "./lf-chat";

//#region Api call
export const apiCall = async (
  adapter: LfChatAdapter,
  updateLastAssistant: boolean = false,
) => {
  const { get } = adapter.controller;
  const { compInstance, manager } = get;
  const { debug, llm } = manager;

  try {
    const request = newRequest(adapter);

    if (llm.stream) {
      await handleStreamingResponse(adapter, request, updateLastAssistant);
    } else {
      await handleFetchResponse(adapter, request, updateLastAssistant);
    }
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    debug.logs.new(compInstance, `Error calling LLM: ${errMessage}`, "error");
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
  updateLastAssistant: boolean = false,
): Promise<void> => {
  const { get, set } = adapter.controller;
  const { compInstance, history, manager } = get;
  const { lfEndpointUrl } = compInstance;
  const { llm } = manager;
  const comp = compInstance as LfChat;

  const abortController = llm.createAbort?.();
  set.currentAbortStreaming(abortController);

  try {
    let lastIndex = -1; // Will be set when we create the message
    let chunkCount = 0;
    let accumulatedContent = "";
    let accumulatedToolCalls: LfLLMToolCall[] = [];
    let toolExecutionShown = false;
    let messageCreated = false;

    for await (const chunk of llm.stream(request, lfEndpointUrl, {
      signal: abortController?.signal,
    })) {
      if (chunk?.contentDelta) {
        accumulatedContent += chunk.contentDelta;

        // Create or update message on first content chunk
        if (!messageCreated) {
          messageCreated = true;
          if (updateLastAssistant) {
            // Find the last assistant message and update it
            const h = history();
            lastIndex = h.length - 1;
            while (lastIndex >= 0 && h[lastIndex].role !== "assistant") {
              lastIndex--;
            }
            if (lastIndex >= 0) {
              set.history(() => {
                const h = history();
                h[lastIndex].content = accumulatedContent;
              });
            } else {
              // Fallback: push new message if no assistant found
              set.history(() =>
                history().push({
                  role: "assistant",
                  content: accumulatedContent,
                }),
              );
              lastIndex = history().length - 1;
            }
          } else {
            set.history(() =>
              history().push({
                role: "assistant",
                content: accumulatedContent,
              }),
            );
            lastIndex = history().length - 1;
          }
        } else {
          // Update existing message
          set.history(() => {
            const h = history();
            if (h[lastIndex]) {
              h[lastIndex].content = accumulatedContent;
            }
          });
        }

        if (chunkCount % 5 === 0) {
          requestAnimationFrame(() => comp.scrollToBottom(true));
        }
        chunkCount++;
      }

      if (chunk?.toolCalls && Array.isArray(chunk.toolCalls)) {
        accumulatedToolCalls.push(...chunk.toolCalls);
        manager.debug.logs.new(
          compInstance,
          `Tool call chunk received: ${JSON.stringify(chunk.toolCalls)}`,
          "informational",
        );

        // Show tool execution chip immediately when first tool call is detected
        if (accumulatedToolCalls.length > 0 && !toolExecutionShown) {
          toolExecutionShown = true;

          // If we haven't created a message yet, create one for tool execution
          if (!messageCreated) {
            messageCreated = true;
            set.history(() =>
              history().push({ role: "assistant", content: "" }),
            );
            lastIndex = history().length - 1;
          }

          // Create and attach tool execution dataset immediately
          const initialDataset = createInitialToolDataset(
            adapter,
            accumulatedToolCalls,
          );
          set.history(() => {
            const h = history();
            if (h[lastIndex]) {
              h[lastIndex].toolExecution = initialDataset;
            }
          });
        }
      }
    }

    // After streaming completes, ensure we have a message if there were tool calls but no content
    if (!messageCreated && accumulatedToolCalls.length > 0) {
      messageCreated = true;
      set.history(() =>
        history().push({ role: "assistant", content: accumulatedContent }),
      );
      lastIndex = history().length - 1;
    }

    if (accumulatedToolCalls.length > 0) {
      manager.debug.logs.new(
        compInstance,
        `Streaming complete. Total tool calls accumulated: ${accumulatedToolCalls.length}`,
        "informational",
      );

      // Execute tools and update the existing toolExecution dataset
      const finalDataset = await handleToolCalls(adapter, accumulatedToolCalls);
      if (finalDataset && lastIndex >= 0) {
        // Update the existing toolExecution dataset and ensure tool_calls are attached
        set.history(() => {
          const h = history();
          if (h[lastIndex]) {
            h[lastIndex].tool_calls = accumulatedToolCalls;
            h[lastIndex].toolExecution = finalDataset;
          }
        });
      }
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
  updateLastAssistant: boolean = false,
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

  // Handle tool calls if any (attaches toolExecution to message)
  if (toolCalls && toolCalls.length > 0) {
    const toolDataset = await handleToolCalls(adapter, toolCalls);
    if (toolDataset) {
      llmMessage.toolExecution = toolDataset;
    }
  }

  if (updateLastAssistant) {
    // Find the last assistant message and update it
    const h = history();
    let lastIndex = h.length - 1;
    while (lastIndex >= 0 && h[lastIndex].role !== "assistant") {
      lastIndex--;
    }
    if (lastIndex >= 0) {
      set.history(() => {
        const h = history();
        h[lastIndex] = { ...h[lastIndex], ...llmMessage };
      });
    } else {
      // Fallback: push new message
      set.history(() => history().push(llmMessage));
    }
  } else {
    set.history(() => history().push(llmMessage));
  }
};
//#endregion

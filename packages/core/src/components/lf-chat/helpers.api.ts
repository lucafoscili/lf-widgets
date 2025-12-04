import {
  LfChatAdapter,
  LfLLMChoiceMessage,
  LfLLMRequest,
  LfLLMToolCall,
} from "@lf-widgets/foundations";
import { getEffectiveConfig } from "./helpers.config";
import { newRequest } from "./helpers.request";
import {
  createInitialToolDataset,
  handleToolCalls,
  mergeToolCalls,
  mergeToolExecutionDatasets,
  normalizeToolCallsForStreaming,
} from "./helpers.tools";
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
  const { llm } = manager;
  const comp = compInstance as LfChat;
  const effectiveConfig = getEffectiveConfig(adapter);
  const endpointUrl = effectiveConfig.llm.endpointUrl;

  const abortController = llm.createAbort?.();
  set.currentAbortStreaming(abortController);

  try {
    let lastIndex = -1; // Will be set when we create the message
    let chunkCount = 0;
    let accumulatedContent = "";
    let accumulatedToolCalls: LfLLMToolCall[] = [];
    let toolExecutionShown = false;
    let messageCreated = false;

    const findLastAssistantIndex = () => {
      const h = history();
      let index = h.length - 1;
      while (index >= 0 && h[index].role !== "assistant") {
        index--;
      }
      return index;
    };

    for await (const chunk of llm.stream(request, endpointUrl, {
      signal: abortController?.signal,
    })) {
      if (chunk?.contentDelta) {
        accumulatedContent += chunk.contentDelta;

        if (!messageCreated) {
          messageCreated = true;
          if (updateLastAssistant) {
            lastIndex = findLastAssistantIndex();
            if (lastIndex >= 0) {
              set.history(() => {
                const h = history();
                h[lastIndex].content = accumulatedContent;
              });
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
            set.history(() =>
              history().push({
                role: "assistant",
                content: accumulatedContent,
              }),
            );
            lastIndex = history().length - 1;
          }
        } else {
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

        if (accumulatedToolCalls.length > 0 && !toolExecutionShown) {
          toolExecutionShown = true;

          if (!messageCreated) {
            if (updateLastAssistant) {
              const existingIndex = findLastAssistantIndex();
              if (existingIndex >= 0) {
                lastIndex = existingIndex;
                messageCreated = true;
              } else {
                messageCreated = true;
                set.history(() =>
                  history().push({ role: "assistant", content: "" }),
                );
                lastIndex = history().length - 1;
              }
            } else {
              messageCreated = true;
              set.history(() =>
                history().push({ role: "assistant", content: "" }),
              );
              lastIndex = history().length - 1;
            }
          }

          // Create and attach tool execution dataset immediately
          const normalizedForIndicator =
            normalizeToolCallsForStreaming(accumulatedToolCalls);

          const initialDataset = createInitialToolDataset(
            adapter,
            normalizedForIndicator,
          );
          set.history(() => {
            const h = history();
            const msg = h[lastIndex];
            if (msg) {
              msg.toolExecution = msg.toolExecution
                ? mergeToolExecutionDatasets(msg.toolExecution, initialDataset)
                : initialDataset;
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

      const normalizedToolCalls =
        normalizeToolCallsForStreaming(accumulatedToolCalls);

      // Execute tools and update the existing toolExecution dataset
      const finalDataset = await handleToolCalls(adapter, normalizedToolCalls);
      if (finalDataset && lastIndex >= 0) {
        // Update the existing toolExecution dataset and ensure tool_calls are attached
        set.history(() => {
          const h = history();
          const msg = h[lastIndex];
          if (msg) {
            const mergedCalls = mergeToolCalls(
              msg.tool_calls as LfLLMToolCall[] | undefined,
              normalizedToolCalls,
            );
            const mergedDataset = msg.toolExecution
              ? mergeToolExecutionDatasets(msg.toolExecution, finalDataset)
              : finalDataset;

            msg.tool_calls = mergedCalls;
            msg.toolExecution = mergedDataset;
          }
        });
      }
    }

    requestAnimationFrame(() => comp.scrollToBottom(true));
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
  const { history, manager } = get;
  const { llm } = manager;
  const effectiveConfig = getEffectiveConfig(adapter);
  const endpointUrl = effectiveConfig.llm.endpointUrl;

  const response = await llm.fetch(request, endpointUrl);

  const message = response.choices?.[0]?.message?.content;
  const rawToolCalls = response.choices?.[0]?.message?.tool_calls;

  const toolCalls =
    rawToolCalls && rawToolCalls.length > 0
      ? normalizeToolCallsForStreaming(rawToolCalls)
      : undefined;
  const llmMessage: LfLLMChoiceMessage = {
    role: "assistant",
    content: message,
    tool_calls: toolCalls,
  };

  if (toolCalls && toolCalls.length > 0) {
    const toolDataset = await handleToolCalls(adapter, toolCalls);
    if (toolDataset) {
      llmMessage.toolExecution = toolDataset;
    }
  }

  if (updateLastAssistant) {
    const h = history();
    let lastIndex = h.length - 1;
    while (lastIndex >= 0 && h[lastIndex].role !== "assistant") {
      lastIndex--;
    }
    if (lastIndex >= 0) {
      set.history(() => {
        const h = history();
        const existing = h[lastIndex] as LfLLMChoiceMessage;
        const mergedCalls = toolCalls
          ? mergeToolCalls(existing.tool_calls, toolCalls)
          : existing.tool_calls;

        const mergedExecution =
          existing.toolExecution && llmMessage.toolExecution
            ? mergeToolExecutionDatasets(
                existing.toolExecution,
                llmMessage.toolExecution,
              )
            : existing.toolExecution || llmMessage.toolExecution;

        h[lastIndex] = {
          ...existing,
          ...llmMessage,
          tool_calls: mergedCalls,
          toolExecution: mergedExecution,
        };
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

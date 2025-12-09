import {
  LfChatAdapter,
  LfLLMRequest,
  LfLLMToolCall,
} from "@lf-widgets/foundations";
import { getEffectiveConfig } from "./helpers.config";
import { ensureMessageId } from "./helpers.message-id";
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

    // Circuit breaker: track unique tool call IDs to detect runaway LLM
    const seenToolCallIds = new Set<string>();
    const MAX_UNIQUE_TOOL_CALLS = 5; // Hard limit on tool calls per response

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
      // Circuit breaker: abort if too many unique tool calls detected
      if (seenToolCallIds.size >= MAX_UNIQUE_TOOL_CALLS) {
        manager.debug.logs.new(
          compInstance,
          `Circuit breaker: ${seenToolCallIds.size} unique tool calls detected (max ${MAX_UNIQUE_TOOL_CALLS}). Aborting stream.`,
          "warning",
        );
        abortController?.abort();
        break;
      }
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
                history().push(
                  ensureMessageId({
                    role: "assistant",
                    content: accumulatedContent,
                  }),
                ),
              );
              lastIndex = history().length - 1;
            }
          } else {
            set.history(() =>
              history().push(
                ensureMessageId({
                  role: "assistant",
                  content: accumulatedContent,
                }),
              ),
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
        // Track unique tool call IDs for circuit breaker
        for (const tc of chunk.toolCalls) {
          if (tc.id) {
            seenToolCallIds.add(tc.id);
          }
          accumulatedToolCalls.push(tc);
        }

        manager.debug.logs.new(
          compInstance,
          `Tool calls accumulated: ${accumulatedToolCalls.length}`,
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
                  history().push(
                    ensureMessageId({
                      role: "assistant",
                      content: "",
                    }),
                  ),
                );
                lastIndex = history().length - 1;
              }
            } else {
              messageCreated = true;
              set.history(() =>
                history().push(
                  ensureMessageId({
                    role: "assistant",
                    content: "",
                  }),
                ),
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
        history().push(
          ensureMessageId({
            role: "assistant",
            content: accumulatedContent,
          }),
        ),
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

      manager.debug.logs.new(
        compInstance,
        `After normalization: ${normalizedToolCalls.length} tool calls`,
        "informational",
      );

      // Final safety dedupe: collapse identical function+args regardless of ID
      const finalDeduped: LfLLMToolCall[] = [];
      const seenSignatures = new Set<string>();

      for (const call of normalizedToolCalls) {
        const name = call.function?.name;
        const args = call.function?.arguments || "{}";

        if (!name) {
          finalDeduped.push(call);
          continue;
        }

        let canonicalArgs = args;
        try {
          const parsed = JSON.parse(args);
          canonicalArgs = JSON.stringify(parsed, Object.keys(parsed).sort());
        } catch {
          // Keep original
        }

        const signature = `${name}::${canonicalArgs}`;

        if (seenSignatures.has(signature)) {
          manager.debug.logs.new(
            compInstance,
            `Final dedupe: removing duplicate ${name}(${args})`,
            "warning",
          );
          continue;
        }

        seenSignatures.add(signature);
        finalDeduped.push(call);
      }

      if (finalDeduped.length < normalizedToolCalls.length) {
        manager.debug.logs.new(
          compInstance,
          `Final dedupe removed ${normalizedToolCalls.length - finalDeduped.length} duplicates, executing ${finalDeduped.length}`,
          "warning",
        );
      }

      // Execute tools - tool_calls are saved to history INSIDE handleToolCalls
      // before the recursive apiCall, enabling history-based deduplication
      const finalDataset = await handleToolCalls(adapter, finalDeduped);

      if (finalDataset && lastIndex >= 0) {
        // Update the toolExecution dataset after tool execution completes
        set.history(() => {
          const h = history();
          const msg = h[lastIndex];
          if (msg) {
            const mergedDataset = msg.toolExecution
              ? mergeToolExecutionDatasets(msg.toolExecution, finalDataset)
              : finalDataset;

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

  let toolCalls =
    rawToolCalls && rawToolCalls.length > 0
      ? normalizeToolCallsForStreaming(rawToolCalls)
      : undefined;

  // Final safety dedupe for fetch path
  if (toolCalls && toolCalls.length > 1) {
    const finalDeduped: LfLLMToolCall[] = [];
    const seenSignatures = new Set<string>();

    for (const call of toolCalls) {
      const name = call.function?.name;
      const args = call.function?.arguments || "{}";

      if (!name) {
        finalDeduped.push(call);
        continue;
      }

      let canonicalArgs = args;
      try {
        const parsed = JSON.parse(args);
        canonicalArgs = JSON.stringify(parsed, Object.keys(parsed).sort());
      } catch {
        // Keep original
      }

      const signature = `${name}::${canonicalArgs}`;

      if (!seenSignatures.has(signature)) {
        seenSignatures.add(signature);
        finalDeduped.push(call);
      }
    }

    toolCalls = finalDeduped;
  }

  const llmMessage = ensureMessageId({
    role: "assistant",
    content: message,
    tool_calls: toolCalls,
  });

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
        const existing = h[lastIndex];
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

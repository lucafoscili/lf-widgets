import {
  LfArticleDataset,
  LfChatAdapter,
  LfChatAgentState,
  LfDataDataset,
  LfDataNode,
  LfIconType,
  LfLLMChoiceMessage,
  LfLLMToolCall,
  LfLLMToolDefinition,
  LfLLMToolHandlers,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";
import {
  getAllToolHandlers,
  getEffectiveConfig,
  getEnabledToolDefinitions,
} from "./helpers.config";
import { LfChat } from "./lf-chat";

//#region Tool dataset
/**
 * Updates a tool node with its execution result.
 *
 * @param dataset - The current tool execution dataset
 * @param toolId - ID of the tool to update
 * @param result - Result text or error message
 * @param success - Whether the tool executed successfully
 * @param successIcon - Optional icon identifier for successful execution
 * @param errorIcon - Optional icon identifier for failed execution
 * @returns Updated dataset with tool result
 */
export const updateToolResult = (
  dataset: LfDataDataset,
  toolId: string,
  result: string,
  success: boolean,
  successIcon?: LfIconType,
  errorIcon?: LfIconType,
): LfDataDataset => {
  const root = dataset.nodes?.[0];
  if (!root || !root.children) {
    return dataset;
  }

  const toolNode = root.children.find((node) => node.id === toolId);
  if (toolNode) {
    const preview =
      result.length > 50 ? `${result.substring(0, 47)}...` : result;
    const name = String(toolNode.value ?? toolId);

    toolNode.value = name;
    toolNode.description =
      result ||
      (success
        ? `Tool "${name}" completed successfully.`
        : `Tool "${name}" failed.`);

    if (successIcon || errorIcon) {
      toolNode.icon = success ? successIcon : errorIcon;
    }

    // Attach a child node with a short preview of the result
    if (result && result.trim()) {
      toolNode.children = [
        {
          id: `${toolId}-result`,
          value: preview,
        },
      ];
    }
  }

  return {
    nodes: [
      {
        ...root,
      },
    ],
  };
};
//#endregion

//#region Streaming helpers
/**
 * Normalizes streaming tool call chunks into complete tool call objects.
 *
 * OpenAI-style streaming sends partial `tool_calls` entries where the same
 * tool call can be spread across multiple deltas (identified by `index`/`id`).
 * This helper merges those chunks so downstream execution sees a single
 * `LfLLMToolCall` per logical tool invocation with fully assembled arguments.
 */
export const normalizeToolCallsForStreaming = (
  calls: LfLLMToolCall[],
): LfLLMToolCall[] => {
  if (!Array.isArray(calls) || calls.length === 0) {
    return [];
  }

  // Helper to create a canonical key from function arguments
  const canonicalizeArgs = (args: string | undefined): string => {
    if (!args) return "{}";
    try {
      const parsed = JSON.parse(args);
      return JSON.stringify(parsed, Object.keys(parsed).sort());
    } catch {
      return args;
    }
  };

  type PartialCall = LfLLMToolCall & {
    index?: number;
    function?: {
      name?: string;
      arguments?: string;
    };
  };

  const byKey = new Map<
    string,
    {
      id?: string;
      type?: "function";
      name?: string;
      argsParts: string[];
    }
  >();

  (calls as PartialCall[]).forEach((raw, rawIndex) => {
    if (!raw) return;

    let key: string;

    if (typeof raw.index === "number") {
      // Streaming deltas: group by stable index so partial chunks merge.
      key = `idx_${raw.index}`;
    } else if (
      raw.function?.name &&
      typeof raw.function.arguments === "string"
    ) {
      // Non-streaming or already-assembled calls: group identical function
      // invocations (same name + arguments) to avoid executing the same tool
      // multiple times in a single assistant turn.
      // Use canonical JSON to handle whitespace differences.
      const canonicalArgs = canonicalizeArgs(raw.function.arguments);
      key = `fn_${raw.function.name}::${canonicalArgs}`;
    } else {
      key = raw.id || `anon_${rawIndex}`;
    }

    const existing = byKey.get(key) || {
      id: raw.id,
      type: raw.type,
      name: raw.function?.name,
      argsParts: [] as string[],
    };

    if (raw.id) {
      existing.id = raw.id;
    }

    if (raw.type) {
      existing.type = raw.type;
    }

    if (raw.function?.name) {
      existing.name = raw.function.name;
    }

    if (
      typeof raw.function?.arguments === "string" &&
      raw.function.arguments.length > 0
    ) {
      existing.argsParts.push(raw.function.arguments);
    }

    byKey.set(key, existing);
  });

  const aggregated: LfLLMToolCall[] = [];

  for (const agg of byKey.values()) {
    const name = agg.name ?? "unknown_tool";
    const args = agg.argsParts.length > 0 ? agg.argsParts.join("") : "{}";

    aggregated.push({
      id: agg.id ?? `tool_call_${aggregated.length}`,
      type: agg.type ?? "function",
      function: {
        name,
        arguments: args,
      },
    });
  }

  // Second-stage dedupe: collapse identical logical calls (same name + args)
  // that may have been emitted multiple times in a single assistant turn.
  // We compare parsed JSON to handle formatting differences (e.g., whitespace).
  const deduped: LfLLMToolCall[] = [];
  const seen = new Map<string, string>(); // name -> canonical args JSON

  aggregated.forEach((call, index) => {
    const fn = call.function;
    if (!fn?.name) {
      // Keep calls without a function name (edge case)
      deduped.push(call);
      return;
    }

    // Normalize arguments by parsing and re-stringifying
    let canonicalArgs = "{}";
    try {
      const parsed = JSON.parse(fn.arguments || "{}");
      canonicalArgs = JSON.stringify(parsed, Object.keys(parsed).sort());
    } catch {
      canonicalArgs = fn.arguments || "{}";
    }

    const key = `${fn.name}::${canonicalArgs}`;

    if (!seen.has(key)) {
      seen.set(key, call.id ?? `idx_${index}`);
      deduped.push(call);
    }
  });

  return deduped;
};
//#endregion

//#region Tool execution merging helpers
/**
 * Merges two tool execution datasets, preserving existing nodes and updating or
 * appending children from the incoming dataset. The root node is taken from the
 * existing dataset when available, but its `icon`, `value`, and `description`
 * are updated from the incoming dataset to reflect the latest aggregate status.
 */
export const mergeToolExecutionDatasets = (
  existing: LfDataDataset,
  incoming: LfDataDataset,
): LfDataDataset => {
  const existingRoot = existing?.nodes?.[0];
  const incomingRoot = incoming?.nodes?.[0];

  if (!existingRoot && !incomingRoot) {
    return {};
  }

  if (!existingRoot) {
    return incoming;
  }

  if (!incomingRoot) {
    return existing;
  }

  const existingChildren = Array.isArray(existingRoot.children)
    ? existingRoot.children
    : [];
  const incomingChildren = Array.isArray(incomingRoot.children)
    ? incomingRoot.children
    : [];

  const byId = new Map<string, LfDataNode>();

  existingChildren.forEach((child) => {
    if (child?.id) {
      byId.set(child.id, child);
    }
  });

  incomingChildren.forEach((child) => {
    if (child?.id) {
      byId.set(child.id, child);
    }
  });

  // Mutate existing root in-place to preserve node identity (keeps expansion state)
  existingRoot.icon = incomingRoot.icon ?? existingRoot.icon;
  existingRoot.value = incomingRoot.value ?? existingRoot.value;
  existingRoot.description =
    incomingRoot.description ?? existingRoot.description;
  existingRoot.children = Array.from(byId.values());

  return existing;
};

/**
 * Merges existing and incoming tool_calls arrays, keeping insertion order and
 * de-duplicating by tool call id.
 */
export const mergeToolCalls = (
  existing: LfLLMToolCall[] | undefined,
  incoming: LfLLMToolCall[],
): LfLLMToolCall[] => {
  const result: LfLLMToolCall[] = [];
  const seen = new Set<string>();

  const add = (arr?: LfLLMToolCall[]) => {
    if (!Array.isArray(arr)) return;
    for (const call of arr) {
      if (!call) continue;
      const id = call.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        result.push(call);
      }
    }
  };

  add(existing);
  add(incoming);

  return result;
};
//#endregion

//#region Execute tools
/**
 * Executes tool calls by looking up handlers from the provided handlers map.
 * Tool definitions (schemas) are used only to validate that a tool exists.
 * The actual execution function comes from the handlers map.
 *
 * @param toolCalls - Array of tool calls from the LLM
 * @param availableDefinitions - Array of tool definitions (schemas only)
 * @param handlers - Map of tool names to their execution functions
 * @returns Array of tool result messages to add to conversation history
 */
export const executeTools = async (
  toolCalls: LfLLMToolCall[],
  availableDefinitions: LfLLMToolDefinition[] = [],
  handlers: LfLLMToolHandlers = {},
): Promise<LfLLMChoiceMessage[]> => {
  // Execute all tools in parallel for better performance
  const executionPromises = toolCalls.map(async (call) => {
    if (!call || !call.function?.name) {
      return null;
    }

    const func = call.function;
    let result: string | LfLLMToolResponse = "";

    // Check if tool is defined in available definitions
    const matchingDefinition = availableDefinitions.find(
      (def) => def.function?.name === func.name,
    );

    // Look up the handler function
    const handler = handlers[func.name];

    if (matchingDefinition) {
      // Valid tool found - try to execute
      try {
        const args = JSON.parse(func.arguments || "{}");

        if (handler) {
          result = await handler(args);
        } else {
          result = `Error: Tool "${func.name}" has no handler defined. This is a configuration error - please provide a handler in lfToolHandlers.`;
        }
      } catch (parseError) {
        result = `Error: Failed to parse arguments for tool "${func.name}". ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }. Please check the argument format and try again.`;
      }
    } else {
      // Tool not found - provide helpful error message
      const availableToolNames = availableDefinitions
        .map((t) => `"${t.function?.name}"`)
        .join(", ");

      result = `Error: Tool "${func.name}" is not available. Available tools are: ${availableToolNames}. Please use one of these tool names exactly as shown.`;
    }

    const normalized: LfLLMToolResponse =
      typeof result === "string" ? { type: "text", content: result } : result;

    return {
      role: "tool" as const,
      content:
        normalized.type === "text"
          ? normalized.content
          : (normalized.content ?? ""),
      articleContent:
        normalized.type === "article" ? normalized.dataset : undefined,
      tool_call_id: call.id,
    };
  });

  // Wait for all tools to complete and filter out nulls
  const results = (await Promise.all(executionPromises)).filter(
    (r) => r !== null,
  ) as LfLLMChoiceMessage[];

  return results;
};
//#endregion

//#region Create initial tool dataset
/**
 * Creates an initial tool execution dataset to show execution status immediately
 * when tool calls are detected during streaming.
 *
 * @param adapter - The chat adapter instance
 * @param toolCalls - Array of tool calls detected so far
 * @returns Initial dataset showing tools in executing state
 */
export const createInitialToolDataset = (
  _adapter: LfChatAdapter,
  toolCalls: LfLLMToolCall[],
): LfDataDataset => {
  const children: LfDataNode[] = [];

  for (const call of toolCalls) {
    if (call && call.function?.name && call.id) {
      children.push({
        description: `Tool "${call.function.name}" is being executed...`,
        id: call.id,
        value: call.function.name,
        children: [],
      });
    }
  }

  const dataset: LfDataDataset = {
    nodes: [
      {
        description: "Executing tool...",
        id: "tool-exec-root",
        value: "Working...",
        children,
      },
    ],
  };

  return dataset;
};
//#endregion

//#region Agent state helpers
/**
 * Gets the current agent state or initializes a new one if agent mode is enabled.
 *
 * @param adapter - The chat adapter instance
 * @param toolCalls - Current tool calls to track
 * @returns Updated agent state or null if agent mode is disabled
 */
const getOrInitAgentState = (
  adapter: LfChatAdapter,
  toolCalls: LfLLMToolCall[],
): LfChatAgentState | null => {
  const { get, set } = adapter.controller;
  const effectiveConfig = getEffectiveConfig(adapter);
  const agentConfig = effectiveConfig.agent;

  if (!agentConfig?.enabled) {
    return null;
  }

  const currentState = get.agentState();
  const maxIterations = agentConfig.maxIterations ?? 10;
  const toolNames = toolCalls
    .map((tc) => tc.function?.name)
    .filter(Boolean) as string[];

  if (currentState) {
    const newState: LfChatAgentState = {
      ...currentState,
      iteration: currentState.iteration + 1,
      toolsCalled: toolNames,
      totalToolCalls: currentState.totalToolCalls + toolCalls.length,
      isComplete: false,
    };
    set.agentState(newState);
    return newState;
  } else {
    const newState: LfChatAgentState = {
      iteration: 1,
      maxIterations,
      toolsCalled: toolNames,
      totalToolCalls: toolCalls.length,
      isComplete: false,
    };
    set.agentState(newState);
    return newState;
  }
};

/**
 * Checks if the agent should continue based on iteration limits and callbacks.
 *
 * @param adapter - The chat adapter instance
 * @param state - Current agent state
 * @returns Whether the agent should continue
 */
const shouldAgentContinue = async (
  adapter: LfChatAdapter,
  state: LfChatAgentState,
): Promise<boolean> => {
  const { get, set } = adapter.controller;
  const { debug } = get.manager;
  const { compInstance } = get;
  const effectiveConfig = getEffectiveConfig(adapter);
  const agentConfig = effectiveConfig.agent;

  if (state.iteration >= state.maxIterations) {
    debug.logs.new(
      compInstance,
      `Agent reached max iterations (${state.maxIterations}). Stopping.`,
      "warning",
    );
    set.agentState({ ...state, isComplete: true });
    return false;
  }

  // Check user callback
  if (agentConfig?.onIteration) {
    try {
      const shouldContinue = await agentConfig.onIteration(state);
      if (!shouldContinue) {
        debug.logs.new(
          compInstance,
          "Agent stopped by onIteration callback.",
          "informational",
        );
        set.agentState({ ...state, isComplete: true });
        return false;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      debug.logs.new(
        compInstance,
        `Agent onIteration callback error: ${errorMsg}`,
        "error",
      );
      set.agentState({ ...state, isComplete: true, lastError: errorMsg });
      return false;
    }
  }

  return true;
};

/**
 * Marks the agent run as complete (no more tool calls).
 *
 * @param adapter - The chat adapter instance
 */
export const markAgentComplete = (adapter: LfChatAdapter): void => {
  const { get, set } = adapter.controller;
  const currentState = get.agentState();

  if (currentState) {
    set.agentState({ ...currentState, isComplete: true });
  }
};

/**
 * Resets the agent state for a new conversation turn.
 *
 * @param adapter - The chat adapter instance
 */
export const resetAgentState = (adapter: LfChatAdapter): void => {
  adapter.controller.set.agentState(null);
};
//#endregion

//#region Handle tool calls
/**
 * Handles tool calls received from the LLM, executes valid tools, and continues the conversation.
 * In agent mode, tracks iterations and respects configured limits.
 *
 * @param adapter - The chat adapter instance
 * @param toolCalls - Array of tool calls from the LLM
 * @returns Promise that resolves with the final tool execution dataset (or null if disabled)
 */
export const handleToolCalls = async (
  adapter: LfChatAdapter,
  toolCalls: LfLLMToolCall[],
): Promise<LfDataDataset | null> => {
  const { get, set } = adapter.controller;
  const { toolExecution } = adapter.elements.refs.toolbar;
  const { compInstance, history } = get;
  const { debug, theme } = get.manager;
  const effectiveConfig = getEffectiveConfig(adapter);

  const hasToolCalls = Array.isArray(toolCalls) && toolCalls.length > 0;
  if (!hasToolCalls) {
    markAgentComplete(adapter);
    return null;
  }

  // Deduplicate tool calls against previously executed tools in the CURRENT turn
  // Only check tool_calls from assistant messages AFTER the last user message
  // This prevents infinite loops while still allowing the same tool in different conversations
  const executedToolSignatures = new Set<string>();
  const h = history();

  // Find the index of the last user message
  let lastUserMessageIndex = -1;
  for (let i = h.length - 1; i >= 0; i--) {
    if (h[i].role === "user") {
      lastUserMessageIndex = i;
      break;
    }
  }

  // Scan history for tool_calls only AFTER the last user message
  for (let i = lastUserMessageIndex + 1; i < h.length; i++) {
    const msg = h[i];
    // Look for assistant messages with tool_calls
    if (msg.role === "assistant" && Array.isArray(msg.tool_calls)) {
      for (const tc of msg.tool_calls as LfLLMToolCall[]) {
        if (tc.function?.name && tc.function?.arguments) {
          try {
            const parsed = JSON.parse(tc.function.arguments);
            const canonical = JSON.stringify(
              parsed,
              Object.keys(parsed).sort(),
            );
            executedToolSignatures.add(`${tc.function.name}::${canonical}`);
          } catch {
            executedToolSignatures.add(
              `${tc.function.name}::${tc.function.arguments}`,
            );
          }
        }
      }
    }
  }

  // Filter out already-executed tool calls and track blocked ones
  const blockedToolCalls: LfLLMToolCall[] = [];
  const newToolCalls = toolCalls.filter((call) => {
    if (!call.function?.name || !call.function?.arguments) {
      return true; // Keep calls without proper structure
    }
    try {
      const parsed = JSON.parse(call.function.arguments);
      const canonical = JSON.stringify(parsed, Object.keys(parsed).sort());
      const signature = `${call.function.name}::${canonical}`;
      if (executedToolSignatures.has(signature)) {
        debug.logs.new(
          compInstance,
          `Skipping duplicate tool call: ${call.function.name}(${call.function.arguments}) - already executed`,
          "informational",
        );
        blockedToolCalls.push(call);
        return false;
      }
      return true;
    } catch {
      return true;
    }
  });

  if (newToolCalls.length === 0) {
    debug.logs.new(
      compInstance,
      "All tool calls were duplicates - skipping execution",
      "informational",
    );

    // Create a dataset showing blocked tools as failed
    const blockedIcon = theme.get.current().variables["--lf-icon-warning"];
    const blockedChildren: LfDataNode[] = blockedToolCalls.map((call) => ({
      description: `Tool "${call.function?.name}" was blocked - duplicate call detected`,
      icon: blockedIcon,
      id: call.id || `blocked-${Date.now()}`,
      value: call.function?.name || "Unknown tool",
      children: [] as LfDataNode[],
    }));

    const blockedDataset: LfDataDataset = {
      nodes: [
        {
          description: "Duplicate tool calls blocked to prevent infinite loop",
          icon: blockedIcon,
          id: "tool-exec-root",
          value: "Blocked (duplicates)",
          children: blockedChildren,
        },
      ],
    };

    // Update the UI if showing indicator
    const showIndicator =
      effectiveConfig.ui.showToolExecutionIndicator !== false;
    if (showIndicator && toolExecution) {
      toolExecution.lfDataset = blockedDataset;
    }

    markAgentComplete(adapter);
    return blockedDataset;
  }

  if (newToolCalls.length < toolCalls.length) {
    debug.logs.new(
      compInstance,
      `Filtered ${toolCalls.length - newToolCalls.length} duplicate tool call(s), executing ${newToolCalls.length}`,
      "informational",
    );
  }

  const agentState = getOrInitAgentState(adapter, newToolCalls);

  if (agentState) {
    const shouldContinue = await shouldAgentContinue(adapter, agentState);
    if (!shouldContinue) {
      debug.logs.new(
        compInstance,
        `Agent iteration ${agentState.iteration}/${agentState.maxIterations} - stopping`,
        "informational",
      );
      return null;
    }
    debug.logs.new(
      compInstance,
      `Agent iteration ${agentState.iteration}/${agentState.maxIterations} - executing ${newToolCalls.length} tool(s)`,
      "informational",
    );
  }

  const showIndicator = effectiveConfig.ui.showToolExecutionIndicator !== false;
  const children: LfDataNode[] = [];
  const dataset: LfDataDataset = {
    nodes: [
      {
        description: "Executing tool...",
        icon: theme.get.current().variables["--lf-icon-loading"],
        id: "tool-exec-root",
        value: "Working...",
        children,
      },
    ],
  };

  for (const call of newToolCalls) {
    if (call && call.function?.name && call.id) {
      children.push({
        description: `Tool "${call.function.name}" is being executed...`,
        icon: theme.get.current().variables["--lf-icon-loading"],
        id: call.id,
        value: call.function.name,
        children: [],
      });
    }
  }

  const enabledDefinitions = getEnabledToolDefinitions(adapter);
  const handlers = getAllToolHandlers(adapter);

  const toolResults = await executeTools(
    newToolCalls,
    enabledDefinitions,
    handlers,
  );

  const successIcon = theme.get.current().variables["--lf-icon-success"];
  const warningIcon = theme.get.current().variables["--lf-icon-warning"];

  const successFlags: boolean[] = [];

  for (const result of toolResults) {
    const content = result.content || "";
    const normalized = content.trim().toLowerCase();

    const isErrorContent =
      !content ||
      normalized.startsWith("error") ||
      normalized.startsWith('tool "') ||
      normalized.includes("is not available");

    const isSuccess = Boolean(content) && !isErrorContent;
    successFlags.push(isSuccess);

    updateToolResult(
      dataset,
      result.tool_call_id || "",
      content,
      isSuccess,
      successIcon,
      warningIcon,
    );
    toolExecution?.refresh();

    // Scroll to bottom when tool execution updates
    const comp = compInstance as LfChat;
    requestAnimationFrame(() => comp.scrollToBottom(true));
  }

  const hasValidToolResults = successFlags.some((flag) => flag);
  const hasErrors = successFlags.some((flag, index) => {
    const content = toolResults[index]?.content;
    return !flag && Boolean(content);
  });

  if (!hasValidToolResults && !hasErrors) {
    debug.logs.new(
      compInstance,
      "No tool results generated (unexpected)",
      "error",
    );
    return null;
  }

  const articles = toolResults.filter((r) => Boolean(r.articleContent));

  if (articles.length > 0) {
    set.history(() => {
      const h = history();
      let lastAssistantIndex = h.length - 1;
      while (
        lastAssistantIndex >= 0 &&
        h[lastAssistantIndex].role !== "assistant"
      ) {
        lastAssistantIndex--;
      }
      if (lastAssistantIndex >= 0) {
        const msg = h[lastAssistantIndex];

        const existing = msg.articleContent;
        const incomingDatasets = articles
          .map((r) => r.articleContent)
          .filter(Boolean);

        if (incomingDatasets.length === 0) {
          return;
        }

        let merged: LfArticleDataset;

        if (!existing) {
          if (incomingDatasets.length === 1) {
            merged = incomingDatasets[0];
          } else {
            const [first, ...rest] = incomingDatasets;
            merged = {
              ...first,
              nodes: [
                ...(first.nodes ?? []),
                ...rest.flatMap((ds) => ds.nodes ?? []),
              ],
            };
          }
        } else {
          merged = {
            ...existing,
            nodes: [
              ...(existing.nodes ?? []),
              ...incomingDatasets.flatMap((ds) => ds.nodes ?? []),
            ],
          };
        }

        msg.articleContent = merged;
      }
    });

    // Scroll to bottom when article content is rendered
    const comp = compInstance as LfChat;
    requestAnimationFrame(() => comp.scrollToBottom(true));
  }

  for (const result of toolResults) {
    set.history(() => history().push(result));
  }

  // Save tool_calls to history BEFORE the recursive apiCall
  // This enables history-based deduplication in the NEXT iteration to detect
  // these tool calls as already-executed
  set.history(() => {
    const h = history();
    // Find the assistant message that these tool calls belong to
    // It should be the message right before the tool results we just pushed
    for (let i = h.length - toolResults.length - 1; i >= 0; i--) {
      if (h[i].role === "assistant") {
        const msg = h[i] as LfLLMChoiceMessage;
        const existingCalls = (msg.tool_calls as LfLLMToolCall[]) || [];
        // Merge new tool calls with existing ones
        const existingIds = new Set(existingCalls.map((c) => c.id));
        const newCalls = newToolCalls.filter((c) => !existingIds.has(c.id));
        msg.tool_calls = [...existingCalls, ...newCalls];
        break;
      }
    }
  });

  const { apiCall } = await import("./helpers.api");

  if (hasValidToolResults) {
    debug.logs.new(
      compInstance,
      `${toolResults.length} tool result(s) added to history`,
      "informational",
    );

    debug.logs.new(
      compInstance,
      "Making follow-up request after successful tool execution",
      hasErrors ? "warning" : "informational",
    );
    await apiCall(adapter, true);
  } else if (hasErrors) {
    debug.logs.new(
      compInstance,
      "All tool calls failed. Adding error messages to history for LLM recovery.",
      "warning",
    );

    debug.logs.new(
      compInstance,
      "Making follow-up request after tool errors (LLM will see error messages)",
      "informational",
    );
    await apiCall(adapter, true);
  }

  if (showIndicator && dataset.nodes && dataset.nodes[0]) {
    const root = dataset.nodes[0];

    if (hasValidToolResults && !hasErrors) {
      root.icon = successIcon;
      root.value = "Completed";
    } else if (hasValidToolResults && hasErrors) {
      root.icon = successIcon;
      root.value = "Completed (with issues)";
    } else if (!hasValidToolResults && hasErrors) {
      root.icon = warningIcon;
      root.value = "Failed";
    }
  }

  return dataset;
};
//#endregion

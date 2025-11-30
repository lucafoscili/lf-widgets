import {
  LfChatAdapter,
  LfDataDataset,
  LfDataNode,
  LfIconType,
  LfLLMChoiceMessage,
  LfLLMTool,
  LfLLMToolCall,
  LfLLMToolResponse,
} from "@lf-widgets/foundations";
import { getEffectiveConfig } from "./helpers.config";

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
      key = `fn_${raw.function.name}::${raw.function.arguments}`;
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
  const deduped: LfLLMToolCall[] = [];
  const seen = new Set<string>();

  aggregated.forEach((call, index) => {
    const fn = call.function;
    const key =
      fn?.name && typeof fn.arguments === "string"
        ? `${fn.name}::${fn.arguments}`
        : (call.id ?? `idx_${index}`);

    if (!seen.has(key)) {
      seen.add(key);
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
export const executeTools = async (
  toolCalls: LfLLMToolCall[],
  availableTools: LfLLMTool[] = [],
): Promise<LfLLMChoiceMessage[]> => {
  // Execute all tools in parallel for better performance
  const executionPromises = toolCalls.map(async (call) => {
    if (!call || !call.function?.name) {
      return null;
    }

    const func = call.function;
    let result: string | LfLLMToolResponse = "";

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
        result = `Error: Failed to parse arguments for tool "${func.name}". ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }. Please check the argument format and try again.`;
      }
    } else {
      // Tool not found - provide helpful error message
      const availableToolNames = availableTools
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

//#region Handle tool calls
/**
 * Handles tool calls received from the LLM, executes valid tools, and continues the conversation.
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
    return null;
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

  for (const call of toolCalls) {
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

  const toolResults = await executeTools(
    toolCalls,
    effectiveConfig.tools.definitions,
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

  // Attach rich article content (when available) to the last assistant
  // message so the article becomes part of the main chat bubble rather
  // than a separate internal tool entry.
  const firstArticleResult = toolResults.find((r) => r.articleContent) as
    | LfLLMChoiceMessage
    | undefined;
  if (firstArticleResult?.articleContent) {
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
        const msg = h[lastAssistantIndex] as LfLLMChoiceMessage;
        msg.articleContent =
          msg.articleContent ?? firstArticleResult.articleContent;
      }
    });
  }

  for (const result of toolResults) {
    set.history(() => history().push(result));
  }

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

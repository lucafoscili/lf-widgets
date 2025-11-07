import {
  LfChatAdapter,
  LfDataDataset,
  LfDataNode,
  LfLLMChoiceMessage,
  LfLLMTool,
  LfLLMToolCall,
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
 * @returns Updated dataset with tool result
 */
export const updateToolResult = (
  dataset: LfDataDataset,
  toolId: string,
  result: string,
  success: boolean,
): LfDataDataset => {
  const root = dataset.nodes[0];
  if (!root.children) return dataset;

  const toolNode = root.children.find((n) => n.id === toolId);
  if (toolNode) {
    const icon = success ? "✓" : "✗";
    const preview =
      result.length > 50 ? result.substring(0, 47) + "..." : result;
    const currentValue = String(toolNode.value || "");
    toolNode.value = `${icon} ${currentValue.replace("🔧 ", "")}`;

    // Add result as child if there's meaningful content
    if (result && result.trim()) {
      toolNode.children = [
        {
          id: `${toolId}-result`,
          value: preview,
        },
      ];
    }
  }

  return { nodes: [{ ...root }] };
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

    return {
      role: "tool" as const,
      content: result,
      tool_call_id: call.id,
    };
  });

  // Wait for all tools to complete and filter out nulls
  const results = (await Promise.all(executionPromises)).filter(
    (result) => result !== null,
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
  adapter: LfChatAdapter,
  toolCalls: LfLLMToolCall[],
): LfDataDataset => {
  const { get } = adapter.controller;
  const { manager } = get;
  const { theme } = manager;

  const children: LfDataNode[] = [];

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
  const { compInstance, history } = get;
  const { debug, theme } = get.manager;
  const effectiveConfig = getEffectiveConfig(adapter);

  const hasToolCalls = Array.isArray(toolCalls) && toolCalls.length > 0;
  if (!hasToolCalls) {
    return null;
  }

  const showIndicator = effectiveConfig.ui.showToolExecutionIndicator !== false;
  const children: LfDataNode[] = [];
  let dataset: LfDataDataset = { nodes: [] };

  dataset.nodes.push({
    description: "Executing tool...",
    icon: theme.get.current().variables["--lf-icon-loading"],
    id: "tool-exec-root",
    value: "Working...",
    children,
  });

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

  for (const result of toolResults) {
    const isSuccess =
      result.content &&
      !result.content.startsWith('Tool "') &&
      !result.content.startsWith("Error:");

    dataset = updateToolResult(
      dataset,
      result.tool_call_id || "",
      result.content || "",
      isSuccess,
    );
  }

  const hasValidToolResults = toolResults.some(
    (result: LfLLMChoiceMessage) =>
      result.content &&
      !result.content.startsWith('Tool "') &&
      !result.content.includes("is not available"),
  );

  const hasErrors = toolResults.some(
    (result: LfLLMChoiceMessage) =>
      result.content &&
      (result.content.startsWith('Tool "') ||
        result.content.includes("is not available")),
  );

  if (hasValidToolResults) {
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
    // Import apiCall to avoid circular dependency
    const { apiCall } = await import("./helpers.api");
    await apiCall(adapter, true);

    if (showIndicator && dataset) {
      const root = dataset.nodes[0];
      root.icon = theme.get.current().variables["--lf-icon-success"];
      root.value = "Completed";
    }

    return dataset;
  } else if (hasErrors) {
    debug.logs.new(
      compInstance,
      "All tool calls failed. Adding error messages to history for LLM recovery.",
      "warning",
    );

    if (showIndicator && dataset) {
      const root = dataset.nodes[0];
      root.icon = theme.get.current().variables["--lf-icon-warning"];
      root.value = "Failed";
    }

    for (const result of toolResults) {
      set.history(() => history().push(result));
    }

    debug.logs.new(
      compInstance,
      "Making follow-up request after tool errors (LLM will see error messages)",
      "informational",
    );
    // Import apiCall to avoid circular dependency
    const { apiCall } = await import("./helpers.api");
    await apiCall(adapter, true);

    return dataset;
  } else {
    debug.logs.new(
      compInstance,
      "No tool results generated (unexpected)",
      "error",
    );

    return null;
  }
};
//#endregion

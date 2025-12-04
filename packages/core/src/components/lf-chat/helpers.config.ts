import {
  LfChatAdapter,
  LfChatConfig,
  LfLLMToolDefinition,
  LfLLMToolHandlers,
} from "@lf-widgets/foundations";
import { LfChat } from "./lf-chat";

//#region Default values
const DEFAULT_CONFIG = {
  llm: {
    endpointUrl: "http://localhost:5001",
    contextWindow: 8192,
    maxTokens: 2048,
    pollingInterval: 10000,
    systemPrompt:
      "You are a helpful and cheerful assistant eager to help the user out with his tasks.",
    temperature: 0.7,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    seed: -1,
  },
  tools: {
    definitions: [] as LfLLMToolDefinition[],
    enabled: undefined as string[] | undefined,
    categories: undefined as Record<string, string[]> | undefined,
  },
  ui: {
    layout: "bottom" as const,
    emptyMessage: "Your chat history is empty!",
    showToolExecutionIndicator: true,
  },
  attachments: {
    uploadTimeout: 60000,
    maxSize: undefined as number | undefined,
    allowedTypes: undefined as string[] | undefined,
  },
};
//#endregion

//#region Config utility
/**
 * Gets the effective configuration by merging user-provided lfConfig with defaults.
 * Also merges builtin tool definitions from the LLM service.
 *
 * @param adapter - The chat adapter instance
 * @returns Effective config object with all settings resolved
 */
export const getEffectiveConfig = (
  adapter: LfChatAdapter,
): Required<LfChatConfig> => {
  const { get } = adapter.controller;
  const { compInstance, manager } = get;
  const { llm } = manager;
  const component = compInstance as LfChat;
  const config = component.lfConfig || {};

  // LLM config
  const endpointUrl = config.llm?.endpointUrl ?? DEFAULT_CONFIG.llm.endpointUrl;
  const contextWindow =
    config.llm?.contextWindow ?? DEFAULT_CONFIG.llm.contextWindow;
  const maxTokens = config.llm?.maxTokens ?? DEFAULT_CONFIG.llm.maxTokens;
  const pollingInterval =
    config.llm?.pollingInterval ?? DEFAULT_CONFIG.llm.pollingInterval;
  const systemPrompt =
    config.llm?.systemPrompt ?? DEFAULT_CONFIG.llm.systemPrompt;
  const temperature = config.llm?.temperature ?? DEFAULT_CONFIG.llm.temperature;
  const topP = config.llm?.topP ?? DEFAULT_CONFIG.llm.topP;
  const frequencyPenalty =
    config.llm?.frequencyPenalty ?? DEFAULT_CONFIG.llm.frequencyPenalty;
  const presencePenalty =
    config.llm?.presencePenalty ?? DEFAULT_CONFIG.llm.presencePenalty;
  const seed = config.llm?.seed ?? DEFAULT_CONFIG.llm.seed;

  const userDefinitions: LfLLMToolDefinition[] =
    config.tools?.definitions ?? [];

  const builtinRegistry = llm.getBuiltinToolDefinitions();
  const builtinDefinitions: LfLLMToolDefinition[] = Object.values(
    builtinRegistry,
  ).flatMap((categoryTools) => Object.values(categoryTools));

  const allDefinitions: LfLLMToolDefinition[] = [...userDefinitions];
  for (const builtin of builtinDefinitions) {
    const name = builtin.function?.name;
    if (!name) continue;
    const exists = allDefinitions.some((d) => d.function?.name === name);
    if (!exists) {
      allDefinitions.push(builtin);
    }
  }

  const enabled = config.tools?.enabled;
  const categories = config.tools?.categories;

  const layout = config.ui?.layout ?? DEFAULT_CONFIG.ui.layout;
  const emptyMessage =
    config.ui?.emptyMessage ?? DEFAULT_CONFIG.ui.emptyMessage;
  const showToolExecutionIndicator =
    config.ui?.showToolExecutionIndicator ??
    DEFAULT_CONFIG.ui.showToolExecutionIndicator;

  const uploadTimeout =
    config.attachments?.uploadTimeout ??
    DEFAULT_CONFIG.attachments.uploadTimeout;
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
      definitions: allDefinitions,
      enabled,
      categories,
    },
    ui: {
      layout,
      emptyMessage,
      showToolExecutionIndicator,
    },
    attachments: {
      uploadTimeout,
      maxSize,
      allowedTypes,
    },
  };
};
//#endregion

//#region Tool utilities
/**
 * Gets the list of enabled tool definitions for sending to the LLM.
 * Filters based on the `enabled` array if provided.
 *
 * @param adapter - The chat adapter instance
 * @returns Array of enabled tool definitions
 */
export const getEnabledToolDefinitions = (
  adapter: LfChatAdapter,
): LfLLMToolDefinition[] => {
  const config = getEffectiveConfig(adapter);
  const { definitions, enabled } = config.tools;

  if (!enabled || enabled.length === 0) {
    return definitions;
  }

  return definitions.filter((def) =>
    enabled.includes(def.function?.name ?? ""),
  );
};

/**
 * Gets all tool handlers by merging builtin tool handlers with user-provided handlers.
 * User-provided handlers take precedence over builtin handlers.
 *
 * @param adapter - The chat adapter instance
 * @returns Combined tool handlers map
 */
export const getAllToolHandlers = (
  adapter: LfChatAdapter,
): LfLLMToolHandlers => {
  const { get } = adapter.controller;
  const { compInstance, manager } = get;
  const { llm } = manager;
  const component = compInstance as LfChat;

  // Get builtin handlers directly from the new API (already properly typed)
  const builtinHandlers = llm.getBuiltinToolHandlers();

  // Merge with user-provided handlers (user handlers take precedence)
  const userHandlers = component.lfToolHandlers || {};

  return {
    ...builtinHandlers,
    ...userHandlers,
  };
};
//#endregion

import { LfChatAdapter, LfChatConfig } from "@lf-widgets/foundations";
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

  const showToolExecutionIndicator =
    config.ui?.showToolExecutionIndicator ?? true;

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
      showToolExecutionIndicator,
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

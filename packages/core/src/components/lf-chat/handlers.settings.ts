import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterHandlers,
  LfChatConfig,
} from "@lf-widgets/foundations";
import { getEffectiveConfig } from "./helpers.config";
import { LfChat } from "./lf-chat";

/**
 * Helper to update a nested property in lfConfig immutably.
 * Creates a new config object with the updated value.
 */
const updateConfig = (
  comp: LfChat,
  section: keyof LfChatConfig,
  key: string,
  value: unknown,
) => {
  const currentConfig = comp.lfConfig || {};
  const currentSection = currentConfig[section] || {};

  comp.lfConfig = {
    ...currentConfig,
    [section]: {
      ...currentSection,
      [key]: value,
    },
  };
};

export const prepSettingsHandlers = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterHandlers["settings"] => {
  return {
    //#region Button
    button: async (e) => {
      const { eventType, id } = e.detail;

      const { get, set } = getAdapter().controller;
      const { compInstance } = get;
      const comp = compInstance as LfChat;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_CHAT_IDS.options.back:
              comp.onLfEvent(e, "config");
              set.view("main");
              break;
            case LF_CHAT_IDS.options.exportHistory:
              await comp.exportHistory();
              break;
            case LF_CHAT_IDS.options.importHistory:
              await comp.setHistory("", true);
              break;
          }
      }
    },
    //#endregion

    //#region Checkbox
    checkbox: (e) => {
      const { eventType, id, value } = e.detail;

      const adapter = getAdapter();
      const { get } = adapter.controller;
      const { compInstance } = get;
      const comp = compInstance as LfChat;
      const effectiveConfig = getEffectiveConfig(adapter);

      switch (eventType) {
        case "change": {
          // Handle agent enabled checkbox
          if (id === LF_CHAT_IDS.options.agentEnabled) {
            const isEnabled = value === "on";
            updateConfig(comp, "agent", "enabled", isEnabled);
            break;
          }

          // Extract tool name from the element's data attribute
          const checkboxEl = e.target as HTMLElement;
          const toolName = checkboxEl.getAttribute("data-tool-name");

          if (!toolName) {
            break;
          }

          // Get current enabled tools or create from all definitions
          const currentEnabled = effectiveConfig.tools.enabled
            ? [...effectiveConfig.tools.enabled]
            : effectiveConfig.tools.definitions.map(
                (d) => d.function?.name ?? "",
              );

          // Toggle the tool in the enabled array
          // value comes as "on"/"off" string from checkbox
          const isNowEnabled = value === "on";
          const toolIndex = currentEnabled.indexOf(toolName);

          if (isNowEnabled && toolIndex === -1) {
            currentEnabled.push(toolName);
          } else if (!isNowEnabled && toolIndex !== -1) {
            currentEnabled.splice(toolIndex, 1);
          }

          // Update config
          updateConfig(comp, "tools", "enabled", currentEnabled);
          break;
        }
      }
    },
    //#endregion

    //#region Textfield
    textfield: (e) => {
      const { eventType, id, value } = e.detail;

      const { get } = getAdapter().controller;
      const { compInstance } = get;
      const comp = compInstance as LfChat;

      switch (eventType) {
        case "change":
          switch (id) {
            // Agent settings
            case LF_CHAT_IDS.options.agentMaxIterations:
              updateConfig(comp, "agent", "maxIterations", parseInt(value));
              break;
            case LF_CHAT_IDS.options.agentSystemPromptSuffix:
              updateConfig(comp, "agent", "systemPromptSuffix", value);
              break;
            // LLM settings
            case LF_CHAT_IDS.options.contextWindow:
              updateConfig(comp, "llm", "contextWindow", parseInt(value));
              break;
            case LF_CHAT_IDS.options.seed:
              updateConfig(comp, "llm", "seed", parseInt(value));
              break;
            case LF_CHAT_IDS.options.topP:
              updateConfig(comp, "llm", "topP", parseFloat(value));
              break;
            case LF_CHAT_IDS.options.frequencyPenalty:
              updateConfig(comp, "llm", "frequencyPenalty", parseFloat(value));
              break;
            case LF_CHAT_IDS.options.presencePenalty:
              updateConfig(comp, "llm", "presencePenalty", parseFloat(value));
              break;
            case LF_CHAT_IDS.options.endpointUrl:
              updateConfig(comp, "llm", "endpointUrl", value);
              break;
            case LF_CHAT_IDS.options.maxTokens:
              updateConfig(comp, "llm", "maxTokens", parseInt(value));
              break;
            case LF_CHAT_IDS.options.polling:
              updateConfig(comp, "llm", "pollingInterval", parseInt(value));
              break;
            case LF_CHAT_IDS.options.system:
              updateConfig(comp, "llm", "systemPrompt", value);
              break;
            case LF_CHAT_IDS.options.temperature:
              updateConfig(comp, "llm", "temperature", parseFloat(value));
              break;
          }
          break;
      }
    },
    //#endregion
  };
};

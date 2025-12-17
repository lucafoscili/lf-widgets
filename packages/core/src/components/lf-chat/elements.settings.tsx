import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
  LfCheckboxElement,
  LfLLMToolDefinition,
} from "@lf-widgets/foundations";
import { Fragment, h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";
import { getEffectiveConfig } from "./helpers.config";

export const prepSettings = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["settings"] => {
  return {
    //#region Back
    back: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      const icon = themeGet.current().variables["--lf-icon-previous"];

      return (
        <ButtonFC
          className={bemClass(blocks.settings._, blocks.settings.back)}
          framework={get.framework()}
          icon={icon}
          id={LF_CHAT_IDS.options.back}
          label="Back"
          onClick={(e) => button(e, LF_CHAT_IDS.options.back)}
          buttonRef={assignRef(settings, "back")}
          style={{ width: "100%" }}
        />
      );
    },
    //#endregion

    //#region Agent Settings
    agentSettings: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { checkbox, textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      const agentEnabled = effectiveConfig.agent.enabled;
      const maxIterations = effectiveConfig.agent.maxIterations;
      const systemPromptSuffix = effectiveConfig.agent.systemPromptSuffix || "";

      return (
        <Fragment>
          <lf-checkbox
            data-cy={cyAttributes.input}
            id={LF_CHAT_IDS.options.agentEnabled}
            lfLabel="Enable Agent Mode"
            lfValue={agentEnabled}
            onLf-checkbox-event={checkbox}
            part={parts.agentEnabled}
            ref={assignRef(settings, "agentEnabled")}
            title="When enabled, the assistant can autonomously execute multiple tool calls to complete a task."
          ></lf-checkbox>
          <LfTextfieldFC
            className={bemClass(blocks.settings._, blocks.settings.textfield)}
            framework={get.framework()}
            htmlAttributes={{
              min: 1,
              max: 50,
              type: "number",
            }}
            icon={themeGet.icon("refresh")}
            id={LF_CHAT_IDS.options.agentMaxIterations}
            label="Max Iterations"
            value={stringify(maxIterations)}
            onChange={(e, value) =>
              textfield(e, LF_CHAT_IDS.options.agentMaxIterations, value)
            }
            inputRef={assignRef(settings, "agentMaxIterations")}
          />
          <LfTextfieldFC
            className={bemClass(blocks.settings._, blocks.settings.textarea)}
            framework={get.framework()}
            id={LF_CHAT_IDS.options.agentSystemPromptSuffix}
            label="Agent System Prompt Suffix"
            styling="textarea"
            value={systemPromptSuffix}
            onChange={(e, value) =>
              textfield(e, LF_CHAT_IDS.options.agentSystemPromptSuffix, value)
            }
            inputRef={assignRef(settings, "agentSystemPromptSuffix")}
          />
        </Fragment>
      );
    },
    //#endregion

    //#region Context Window
    contextWindow: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          htmlAttributes={{
            min: 1024,
            type: "number",
          }}
          icon={themeGet.icon("arrowAutofitContent")}
          id={LF_CHAT_IDS.options.contextWindow}
          label="Context Window Size"
          value={stringify(effectiveConfig.llm.contextWindow)}
          onChange={(e, value) =>
            textfield(e, LF_CHAT_IDS.options.contextWindow, value)
          }
          inputRef={assignRef(settings, "contextWindow")}
        />
      );
    },
    //#endregion

    //#region Endpoint
    endpoint: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          icon={themeGet.icon("network")}
          id={LF_CHAT_IDS.options.endpointUrl}
          label="Endpoint URL"
          value={effectiveConfig.llm.endpointUrl}
          onChange={(e, value) =>
            textfield(e, LF_CHAT_IDS.options.endpointUrl, value)
          }
          inputRef={assignRef(settings, "endpoint")}
        />
      );
    },
    //#endregion

    //#region Export History
    exportHistory: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      return (
        <ButtonFC
          className={bemClass(blocks.settings._, blocks.settings.exportHistory)}
          framework={get.framework()}
          icon={themeGet.icon("download")}
          id={LF_CHAT_IDS.options.exportHistory}
          label="Export history"
          onClick={(e) => button(e, LF_CHAT_IDS.options.exportHistory)}
          buttonRef={assignRef(settings, "exportHistory")}
          style={{ width: "100%" }}
        />
      );
    },
    //#endregion

    //#region Frequency penalty
    frequencyPenalty: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          htmlAttributes={{
            min: 0,
            type: "number",
          }}
          icon={themeGet.icon("codeCircle2")}
          id={LF_CHAT_IDS.options.frequencyPenalty}
          label="Frequency Penalty"
          value={stringify(effectiveConfig.llm.frequencyPenalty)}
          onChange={(e, value) =>
            textfield(e, LF_CHAT_IDS.options.frequencyPenalty, value)
          }
          inputRef={assignRef(settings, "frequencyPenalty")}
        />
      );
    },
    //#endregion

    //#region Import History
    importHistory: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      return (
        <ButtonFC
          className={bemClass(blocks.settings._, blocks.settings.importHistory)}
          framework={get.framework()}
          icon={themeGet.icon("upload")}
          id={LF_CHAT_IDS.options.importHistory}
          label="Import history"
          onClick={(e) => button(e, LF_CHAT_IDS.options.importHistory)}
          buttonRef={assignRef(settings, "importHistory")}
          style={{ width: "100%" }}
        />
      );
    },
    //#endregion

    //#region Max tokens
    maxTokens: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          htmlAttributes={{
            min: 10,
            type: "number",
          }}
          icon={themeGet.icon("numbers")}
          id={LF_CHAT_IDS.options.maxTokens}
          label="Max tokens count"
          value={stringify(effectiveConfig.llm.maxTokens)}
          onChange={(e, value) =>
            textfield(e, LF_CHAT_IDS.options.maxTokens, value)
          }
          inputRef={assignRef(settings, "maxTokens")}
        />
      );
    },
    //#endregion

    //#region Polling
    polling: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          htmlAttributes={{
            min: 10,
            type: "number",
          }}
          icon={themeGet.icon("hourglassLow")}
          id={LF_CHAT_IDS.options.polling}
          label="Polling interval"
          value={stringify(effectiveConfig.llm.pollingInterval)}
          onChange={(e, value) =>
            textfield(e, LF_CHAT_IDS.options.polling, value)
          }
          inputRef={assignRef(settings, "polling")}
        />
      );
    },
    //#endregion

    //#region Presence penalty
    presencePenalty: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          htmlAttributes={{
            min: -2,
            type: "number",
          }}
          icon={themeGet.icon("schema")}
          id={LF_CHAT_IDS.options.presencePenalty}
          label="Presence penalty"
          value={stringify(effectiveConfig.llm.presencePenalty)}
          onChange={(e, value) =>
            textfield(e, LF_CHAT_IDS.options.presencePenalty, value)
          }
          inputRef={assignRef(settings, "presencePenalty")}
        />
      );
    },
    //#endregion

    //#region Seed
    seed: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          htmlAttributes={{
            type: "number",
          }}
          icon={themeGet.icon("ikosaedr")}
          id={LF_CHAT_IDS.options.seed}
          label="Random Seed (-1 for random)"
          value={stringify(effectiveConfig.llm.seed)}
          onChange={(e, value) => textfield(e, LF_CHAT_IDS.options.seed, value)}
          inputRef={assignRef(settings, "seed")}
        />
      );
    },
    //#endregion

    //#region System
    system: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textarea)}
          framework={get.framework()}
          id={LF_CHAT_IDS.options.system}
          label="System prompt"
          styling="textarea"
          value={effectiveConfig.llm.systemPrompt}
          onChange={(e, value) =>
            textfield(e, LF_CHAT_IDS.options.system, value)
          }
          inputRef={assignRef(settings, "system")}
        />
      );
    },
    //#endregion

    //#region Temperature
    temperature: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          htmlAttributes={{
            max: 1,
            min: 0.1,
            type: "number",
          }}
          icon={themeGet.icon("temperature")}
          id={LF_CHAT_IDS.options.temperature}
          label="Temperature"
          value={stringify(effectiveConfig.llm.temperature)}
          onChange={(e, value) =>
            textfield(e, LF_CHAT_IDS.options.temperature, value)
          }
          inputRef={assignRef(settings, "temperature")}
        />
      );
    },
    //#endregion

    //#region Tools
    tools: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const { settings } = elements.refs;
      const { checkbox } = handlers.settings;
      const { theme } = get.framework();
      const { bemClass } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      const { definitions, enabled, categories } = effectiveConfig.tools;

      if (!definitions || definitions.length === 0) {
        return (
          <span class={bemClass(blocks.settings._, blocks.settings.tools)}>
            No tools available
          </span>
        );
      }

      // Group tools by category
      const groupedTools = groupToolsByCategory(definitions, categories);
      const categoryNames = Object.keys(groupedTools).sort();

      // Determine which tools are enabled
      const isToolEnabled = (toolName: string): boolean => {
        if (!enabled || enabled.length === 0) {
          return true; // All enabled by default
        }
        return enabled.includes(toolName);
      };

      return (
        <Fragment>
          {categoryNames.map((category) => (
            <div
              class={bemClass(blocks.settings._, blocks.settings.toolsCategory)}
              key={category}
            >
              <span class={bemClass(blocks.settings._, blocks.settings.tools)}>
                {category}
              </span>
              {groupedTools[category].map((tool) => {
                const toolName = tool.function?.name || "";
                const toolDescription = tool.function?.description || "";
                const isEnabled = isToolEnabled(toolName);

                return (
                  <div
                    class={bemClass(
                      blocks.settings._,
                      blocks.settings.toolsItem,
                    )}
                    key={toolName}
                    title={toolDescription}
                  >
                    <lf-checkbox
                      class={bemClass(
                        blocks.settings._,
                        blocks.settings.toolsCheckbox,
                      )}
                      data-cy={cyAttributes.input}
                      data-tool-name={toolName}
                      id={`${LF_CHAT_IDS.options.tools}-${toolName}`}
                      lfLabel={toolName}
                      lfValue={isEnabled}
                      onLf-checkbox-event={checkbox}
                      ref={(el) => {
                        if (el) {
                          settings.tools.set(toolName, el as LfCheckboxElement);
                        }
                      }}
                    ></lf-checkbox>
                  </div>
                );
              })}
            </div>
          ))}
        </Fragment>
      );
    },
    //#endregion

    //#region Top P
    topP: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { get } = controller;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = get.framework();
      const { stringify } = data.cell;
      const { bemClass, get: themeGet } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <LfTextfieldFC
          className={bemClass(blocks.settings._, blocks.settings.textfield)}
          framework={get.framework()}
          htmlAttributes={{
            max: 1,
            min: 0,
            step: 0.1,
            type: "number",
          }}
          icon={themeGet.icon("template")}
          id={LF_CHAT_IDS.options.topP}
          label="Top P"
          value={stringify(effectiveConfig.llm.topP)}
          onChange={(e, value) => textfield(e, LF_CHAT_IDS.options.topP, value)}
          inputRef={assignRef(settings, "topP")}
        />
      );
    },
    //#endregion
  };
};

//#region Helper functions
/**
 * Groups tool definitions by their category.
 * Uses the categories config if provided, otherwise falls back to tool.meta.category.
 *
 * @param definitions - Array of tool definitions
 * @param categories - Optional category groupings from config
 * @returns Record mapping category names to arrays of tool definitions
 */
const groupToolsByCategory = (
  definitions: LfLLMToolDefinition[],
  categories?: Record<string, string[]>,
): Record<string, LfLLMToolDefinition[]> => {
  const grouped: Record<string, LfLLMToolDefinition[]> = {};

  if (categories) {
    // Use provided category mappings
    for (const [category, toolNames] of Object.entries(categories)) {
      grouped[category] = definitions.filter((def) =>
        toolNames.includes(def.function?.name ?? ""),
      );
    }

    // Add uncategorized tools
    const categorizedTools = new Set(Object.values(categories).flat());
    const uncategorized = definitions.filter(
      (def) => !categorizedTools.has(def.function?.name ?? ""),
    );
    if (uncategorized.length > 0) {
      grouped["Other"] = uncategorized;
    }
  } else {
    // Fall back to meta.category
    for (const def of definitions) {
      const category = def.meta?.category || "General";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(def);
    }
  }

  return grouped;
};
//#endregion

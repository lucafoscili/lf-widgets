import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
  LfLLMToolDefinition,
} from "@lf-widgets/foundations";
import { Fragment, h } from "@stencil/core";
import { getEffectiveConfig } from "./helpers.config";

export const prepSettings = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["settings"] => {
  return {
    //#region Back
    back: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const icon = get.current().variables["--lf-icon-previous"];

      return (
        <lf-button
          class={bemClass(blocks.settings._, blocks.settings.back)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.options.back}
          lfIcon={icon}
          lfLabel="Back"
          lfStretchX={true}
          onLf-button-event={button}
          part={parts.back}
          ref={assignRef(settings, "back")}
        ></lf-button>
      );
    },
    //#endregion

    //#region Context Window
    contextWindow: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.contextWindow}
          lfHtmlAttributes={{
            min: 1024,
            type: "number",
          }}
          lfIcon={get.icon("arrowAutofitContent")}
          lfLabel="Context Window Size"
          lfValue={stringify(effectiveConfig.llm.contextWindow)}
          onLf-textfield-event={textfield}
          part={parts.contextWindow}
          ref={assignRef(settings, "contextWindow")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Endpoint
    endpoint: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.endpointUrl}
          lfIcon={get.icon("network")}
          lfLabel="Endpoint URL"
          lfValue={effectiveConfig.llm.endpointUrl}
          onLf-textfield-event={textfield}
          part={parts.endpointUrl}
          ref={assignRef(settings, "endpoint")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Export History
    exportHistory: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      return (
        <lf-button
          class={bemClass(blocks.settings._, blocks.settings.exportHistory)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.options.exportHistory}
          lfIcon={get.icon("download")}
          lfLabel="Export history"
          lfStretchX={true}
          onLf-button-event={button}
          part={parts.exportHistory}
          ref={assignRef(settings, "exportHistory")}
        ></lf-button>
      );
    },
    //#endregion

    //#region Frequency penalty
    frequencyPenalty: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.frequencyPenalty}
          lfHtmlAttributes={{
            min: 0,
            type: "number",
          }}
          lfIcon={get.icon("codeCircle2")}
          lfLabel="Frequency Penalty"
          lfValue={stringify(effectiveConfig.llm.frequencyPenalty)}
          onLf-textfield-event={textfield}
          part={parts.frequencyPenalty}
          ref={assignRef(settings, "frequencyPenalty")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Import History
    importHistory: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { button } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      return (
        <lf-button
          class={bemClass(blocks.settings._, blocks.settings.importHistory)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.options.importHistory}
          lfIcon={get.icon("upload")}
          lfLabel="Import history"
          lfStretchX={true}
          onLf-button-event={button}
          part={parts.importHistory}
          ref={assignRef(settings, "importHistory")}
        ></lf-button>
      );
    },
    //#endregion

    //#region Max tokens
    maxTokens: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.maxTokens}
          lfHtmlAttributes={{
            min: 10,
            type: "number",
          }}
          lfIcon={get.icon("numbers")}
          lfLabel="Max tokens count"
          lfValue={stringify(effectiveConfig.llm.maxTokens)}
          onLf-textfield-event={textfield}
          part={parts.maxTokens}
          ref={assignRef(settings, "maxTokens")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Polling
    polling: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.polling}
          lfHtmlAttributes={{
            min: 10,
            type: "number",
          }}
          lfIcon={get.icon("hourglassLow")}
          lfLabel="Polling interval"
          lfValue={stringify(effectiveConfig.llm.pollingInterval)}
          onLf-textfield-event={textfield}
          part={parts.polling}
          ref={assignRef(settings, "polling")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Presence penalty
    presencePenalty: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.presencePenalty}
          lfHtmlAttributes={{
            min: -2,
            type: "number",
          }}
          lfIcon={get.icon("schema")}
          lfLabel="Presence penalty"
          lfValue={stringify(effectiveConfig.llm.presencePenalty)}
          onLf-textfield-event={textfield}
          part={parts.presencePenalty}
          ref={assignRef(settings, "presencePenalty")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Seed
    seed: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.seed}
          lfHtmlAttributes={{
            type: "number",
          }}
          lfIcon={get.icon("ikosaedr")}
          lfLabel="Random Seed (-1 for random)"
          lfValue={stringify(effectiveConfig.llm.seed)}
          onLf-textfield-event={textfield}
          part={parts.seed}
          ref={assignRef(settings, "seed")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region System
    system: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textarea)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.system}
          lfLabel="System prompt"
          lfStyling="textarea"
          lfValue={effectiveConfig.llm.systemPrompt}
          onLf-textfield-event={textfield}
          part={parts.system}
          ref={assignRef(settings, "system")}
          title="The system prompt is used to generate the first response in the conversation."
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Temperature
    temperature: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.temperature}
          lfHtmlAttributes={{
            max: 1,
            min: 0.1,
            type: "number",
          }}
          lfIcon={get.icon("temperature")}
          lfLabel="Temperature"
          lfValue={stringify(effectiveConfig.llm.temperature)}
          onLf-textfield-event={textfield}
          part={parts.temperature}
          ref={assignRef(settings, "temperature")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Tools
    tools: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { checkbox } = handlers.settings;
      const { theme } = manager;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      const { definitions, enabled, categories } = effectiveConfig.tools;

      // If no tools, don't render the section
      if (!definitions || definitions.length === 0) {
        return <Fragment></Fragment>;
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
        <div
          class={bemClass(blocks.settings._, blocks.settings.toolsContainer)}
          part={parts.tools}
        >
          <div class={bemClass(blocks.settings._, blocks.settings.toolsHeader)}>
            <lf-icon
              lfIcon={get.icon("adjustmentsHorizontal")}
              lfSize="1.25em"
            ></lf-icon>
            <span>Available Tools</span>
          </div>
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
                          settings.tools.set(toolName, el);
                        }
                      }}
                    ></lf-checkbox>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    },
    //#endregion

    //#region Top P
    topP: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { settings } = elements.refs;
      const { textfield } = handlers.settings;
      const { assignRef, data, theme } = manager;
      const { stringify } = data.cell;
      const { bemClass, get } = theme;
      const effectiveConfig = getEffectiveConfig(adapter);

      return (
        <lf-textfield
          class={bemClass(blocks.settings._, blocks.settings.textfield)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.options.topP}
          lfHtmlAttributes={{
            max: 1,
            min: 0,
            step: 0.1,
            type: "number",
          }}
          lfIcon={get.icon("template")}
          lfLabel="Top P"
          lfValue={stringify(effectiveConfig.llm.topP)}
          onLf-textfield-event={textfield}
          part={parts.topP}
          ref={assignRef(settings, "topP")}
        ></lf-textfield>
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

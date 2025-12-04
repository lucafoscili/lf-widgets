import { LfLLMToolDefinition } from "./llm.declarations";

//#region Roles
export const LF_LLM_ROLES = ["system", "user", "assistant", "tool"] as const;
//#endregion

//#region Builtin Tool Names
export const LF_LLM_TOOL_NAMES = {
  GET_WEATHER: "get_weather",
  GET_COMPONENT_DOCS: "get_component_docs",
  SET_THEME: "set_theme",
  TOGGLE_DEBUG: "toggle_debug",
} as const;
//#endregion

//#region Builtin Tool Definitions
/**
 * Serializable definition for the weather tool.
 * Fetches real-time weather from wttr.in and returns a rich article.
 */
export const LF_LLM_WEATHER_TOOL_DEFINITION: LfLLMToolDefinition = {
  type: "function",
  function: {
    name: LF_LLM_TOOL_NAMES.GET_WEATHER,
    description:
      "Get real-time weather information for a city or location. Returns temperature, conditions, humidity, and wind speed.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description:
            "City name or generic location (e.g. 'London', 'New York', 'Tokyo').",
        },
      },
      required: ["location"],
    },
  },
  meta: {
    category: "general",
    icon: "cloud",
    displayName: "Weather",
  },
};

/**
 * Serializable definition for the component docs tool.
 * Fetches README.md from GitHub for lf-widgets components.
 */
export const LF_LLM_DOCS_TOOL_DEFINITION: LfLLMToolDefinition = {
  type: "function",
  function: {
    name: LF_LLM_TOOL_NAMES.GET_COMPONENT_DOCS,
    description: [
      "Retrieve authoritative documentation for an lf-widgets web component.",
      "Always use this tool whenever the user asks about lf-widgets components.",
      "If documentation cannot be fetched, clearly say that docs are unavailable instead of fabricating details.",
    ].join(" "),
    parameters: {
      type: "object",
      properties: {
        component: {
          type: "string",
          description:
            "Component tag to query (e.g. 'lf-button', 'lf-chat'). Leave empty for a high-level framework overview.",
        },
      },
    },
  },
  meta: {
    category: "lfw",
    icon: "document",
    displayName: "Component Docs",
  },
};

/**
 * Serializable definition for the theme tool.
 * Changes the active theme of the lf-widgets framework.
 */
export const LF_LLM_THEME_TOOL_DEFINITION: LfLLMToolDefinition = {
  type: "function",
  function: {
    name: LF_LLM_TOOL_NAMES.SET_THEME,
    description: [
      "Change the visual theme of the lf-widgets library.",
      "Available themes include: abyss, blade, breath, cyborg, eclipse, emerald, ethereal, goldfish, graphite, grass, nightfall, nord, obsidian, pastel, sakura, sepulchre, steampunk, urban, voidforge, wizardry.",
      "Use 'random' to pick a random theme, or 'list' to see all available themes.",
    ].join(" "),
    parameters: {
      type: "object",
      properties: {
        theme: {
          type: "string",
          description:
            "Theme name to apply (e.g. 'sakura', 'emerald', 'nightfall'). Use 'random' for a random theme or 'list' to show available themes.",
        },
      },
      required: ["theme"],
    },
  },
  meta: {
    category: "lfw",
    icon: "palette",
    displayName: "Set Theme",
  },
};

/**
 * Serializable definition for the debug tool.
 * Toggles debug mode and prints debug logs.
 */
export const LF_LLM_DEBUG_TOOL_DEFINITION: LfLLMToolDefinition = {
  type: "function",
  function: {
    name: LF_LLM_TOOL_NAMES.TOGGLE_DEBUG,
    description: [
      "Control the debug mode of lf-widgets.",
      "Can enable/disable debug logging and print current debug logs to the browser console.",
      "Use action 'on' to enable, 'off' to disable, 'print' to output logs to console, or 'status' to check current state.",
    ].join(" "),
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["on", "off", "print", "status"],
          description:
            "Action to perform: 'on' enables debug, 'off' disables it, 'print' outputs logs to console, 'status' shows current debug state.",
        },
      },
      required: ["action"],
    },
  },
  meta: {
    category: "lfw",
    icon: "bug",
    displayName: "Debug Mode",
  },
};
//#endregion

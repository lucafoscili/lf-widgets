import { LfLLMToolDefinition } from "./llm.declarations";

//#region Roles
export const LF_LLM_ROLES = ["system", "user", "assistant", "tool"] as const;
//#endregion

//#region Builtin Tool Names
export const LF_LLM_TOOL_NAMES = {
  GET_WEATHER: "get_weather",
  GET_COMPONENT_DOCS: "get_component_docs",
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
//#endregion

import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfChat";
const EVENT_NAME: LfEventName<"LfChat"> = "lf-chat-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfChat"> = "LfChatEventPayload";
const TAG_NAME: LfComponentTag<"LfChat"> = "lf-chat";

export const getChatFixtures = (
  _framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-chat"> => {
  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "lets you chat with an LLM running locally. It is designed to work along with Koboldcpp",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "config",
                description: "emitted when the config of the component changes",
              },
              {
                type: "polling",
                description:
                  "emitted when the component checks whether the LLM endpoint is online or not",
              },
              {
                type: "ready",
                description:
                  "emitted when the component completes its first complete lifecycle",
              },
              {
                type: "unmount",
                description:
                  "emitted when the component is disconnected from the DOM",
              },
              {
                type: "update",
                description: "emitted when a new message is received",
              },
            ],
            EVENT_NAME,
          ),
          SECTION_FACTORY.methods(TAG_NAME),
          SECTION_FACTORY.styling(TAG_NAME),
        ],
      },
    ],
  };
  //#endregion

  return {
    //#region configuration
    configuration: {
      columns: {
        uncategorized: 2,
      },
    },
    //#endregion
    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        bottomLayout: {
          description: "Chat with textarea below",
          props: {
            lfLayout: "bottom",
          },
        },
        simple: {
          description: "Chat with textarea above",
          props: {
            lfLayout: "top",
          },
        },
        initialValue: {
          description: "Chat with initial value",
          props: {
            lfValue: [
              { role: "user", content: "Hello!" },
              { role: "assistant", content: "Hi!" },
              { role: "user", content: "How are you?" },
              { role: "assistant", content: "I'm good, thank you!" },
              {
                role: "user",
                content:
                  "Can you send me a generic JavaScript code snippet along with a generic Python code snippet?",
              },
            ],
          },
        },
        attachmentsEditing: {
          description:
            "Demo: attachments (image/file), preview and message editing",
          props: {
            lfValue: [
              { role: "user", content: "Here is an image for context:" },
              {
                role: "assistant",
                content: "I received the image. See preview below.",
                attachments: [
                  {
                    id: "sample-img-1",
                    type: "image_url",
                    image_url: {
                      url: "https://picsum.photos/seed/picsum/320/180",
                    },
                    name: "sample.jpg",
                  },
                ],
              },
              {
                role: "user",
                content: "Try editing this message to change its wording.",
              },
            ],
          },
        },
        style: {
          description: "Chat with custom style",
          props: {
            lfStyle: ":host { filter: monochrome(0.5) contrast(1.5); }",
          },
        },
        tools: {
          description: "Chat with tools for external actions (real APIs)",
          props: {
            lfTools: [
              {
                type: "function",
                function: {
                  name: "get_showcase_docs",
                  description:
                    "Retrieves documentation about lf-widgets components and framework. Use this to answer questions about components, their props, events, methods, or usage examples.",
                  parameters: {
                    type: "object",
                    properties: {
                      component: {
                        type: "string",
                        description:
                          "The component name to query (e.g., 'lf-button', 'lf-chat', 'lf-tree'). Leave empty for general framework docs.",
                      },
                    },
                  },
                  execute: async (args: Record<string, unknown>) => {
                    const component = (args.component as string) || "";

                    try {
                      // Fetch the actual doc.json file from the core package
                      const fetchResponse = await fetch("/build/doc.json");
                      if (!fetchResponse.ok) {
                        return `Documentation fetch failed. The doc.json file might not be available. Status: ${fetchResponse.status}`;
                      }

                      const docData = await fetchResponse.json();

                      if (!component) {
                        // Return general framework overview
                        const componentCount = docData.components?.length || 0;
                        const componentList =
                          docData.components
                            ?.map((c: any) => c.tag)
                            .join(", ") || "none";
                        return `lf-widgets Framework Overview:\n- Total Components: ${componentCount}\n- Available Components: ${componentList}\n- Documentation includes props, events, methods, and styling for each component.\n\nAsk about a specific component for detailed information.`;
                      }

                      // Find specific component documentation
                      const comp = docData.components?.find(
                        (c: any) =>
                          c.tag === component ||
                          c.tag === `lf-${component.replace("lf-", "")}`,
                      );

                      if (!comp) {
                        return `Component "${component}" not found. Available components: ${docData.components?.map((c: any) => c.tag).join(", ")}`;
                      }

                      // Build comprehensive response
                      let result = `${comp.tag} Documentation:\n\n`;
                      result += `Description: ${comp.overview || "No description available"}\n\n`;

                      if (comp.props?.length) {
                        result += `Props (${comp.props.length}):\n`;
                        comp.props.slice(0, 5).forEach((prop: any) => {
                          result += `- ${prop.name}: ${prop.type} ${prop.required ? "(required)" : ""}\n  ${prop.docs || ""}\n`;
                        });
                        if (comp.props.length > 5) {
                          result += `... and ${comp.props.length - 5} more props\n`;
                        }
                      }

                      if (comp.events?.length) {
                        result += `\nEvents: ${comp.events.map((e: any) => e.event).join(", ")}\n`;
                      }

                      if (comp.methods?.length) {
                        result += `\nMethods: ${comp.methods.map((m: any) => m.name).join(", ")}\n`;
                      }

                      return result;
                    } catch (error) {
                      return `Error fetching documentation: ${error instanceof Error ? error.message : String(error)}`;
                    }
                  },
                },
              },
              {
                type: "function",
                function: {
                  name: "get_weather",
                  description:
                    "Get real-time weather information for any city or location worldwide. Returns temperature, conditions, humidity, and wind speed.",
                  parameters: {
                    type: "object",
                    properties: {
                      location: {
                        type: "string",
                        description:
                          "The city name or location (e.g., 'London', 'New York', 'Tokyo')",
                      },
                    },
                    required: ["location"],
                  },
                  execute: async (args: Record<string, unknown>) => {
                    const location = (args.location as string) || "London";

                    try {
                      // Using wttr.in - a free weather API that doesn't require API key
                      // Format: simple text output, easy to parse
                      const response = await fetch(
                        `https://wttr.in/${encodeURIComponent(location)}?format=j1`,
                      );

                      if (!response.ok) {
                        return `Unable to fetch weather for "${location}". Please check the location name and try again.`;
                      }

                      const data = await response.json();
                      const current = data.current_condition?.[0];
                      const area = data.nearest_area?.[0];

                      if (!current) {
                        return `Weather data unavailable for "${location}".`;
                      }

                      const locationName =
                        area?.areaName?.[0]?.value || location;
                      const country = area?.country?.[0]?.value || "";
                      const temp_c = current.temp_C;
                      const temp_f = current.temp_F;
                      const condition =
                        current.weatherDesc?.[0]?.value || "Unknown";
                      const humidity = current.humidity;
                      const windSpeed = current.windspeedKmph;
                      const windDir = current.winddir16Point;
                      const feelsLike_c = current.FeelsLikeC;
                      const feelsLike_f = current.FeelsLikeF;

                      return `Weather for ${locationName}${country ? ", " + country : ""}:
🌡️ Temperature: ${temp_c}°C (${temp_f}°F)
🌤️ Conditions: ${condition}
🤔 Feels like: ${feelsLike_c}°C (${feelsLike_f}°F)
💧 Humidity: ${humidity}%
🌬️ Wind: ${windSpeed} km/h ${windDir}`;
                    } catch (error) {
                      return `Error fetching weather data: ${error instanceof Error ? error.message : String(error)}. Please try again.`;
                    }
                  },
                },
              },
            ],
          },
        },
        configCreative: {
          description: "Config preset: Creative (high temperature, diverse)",
          props: {
            lfConfig: {
              llm: {
                temperature: 1.2,
                topP: 0.95,
                frequencyPenalty: 0.5,
                presencePenalty: 0.5,
                systemPrompt:
                  "You are a creative and imaginative assistant. Feel free to think outside the box!",
              },
              ui: {
                layout: "top",
                emptyMessage: "Start a creative conversation...",
              },
            },
          },
        },
        configPrecise: {
          description: "Config preset: Precise (low temperature, focused)",
          props: {
            lfConfig: {
              llm: {
                temperature: 0.2,
                topP: 0.8,
                frequencyPenalty: 0,
                presencePenalty: 0,
                systemPrompt:
                  "You are a precise and factual assistant. Provide accurate, concise answers.",
              },
              ui: {
                layout: "top",
                emptyMessage: "Ask a question...",
              },
            },
          },
        },
        configWithTools: {
          description: "Config preset: Tools enabled with attachments config",
          props: {
            lfConfig: {
              llm: {
                temperature: 0.7,
                systemPrompt:
                  "You are a helpful assistant with access to tools. Use them when needed!",
              },
              tools: {
                definitions: [
                  {
                    type: "function",
                    function: {
                      name: "calculate",
                      description: "Perform a mathematical calculation",
                      parameters: {
                        type: "object",
                        properties: {
                          expression: {
                            type: "string",
                            description: "The math expression to evaluate",
                          },
                        },
                        required: ["expression"],
                      },
                      execute: async (args: Record<string, unknown>) => {
                        const expr = (args.expression as string) || "0";
                        // Mock calculator - in production, use a safe math parser library
                        return `Calculated "${expr}": This is a mock result. Use a safe math parser like math.js in production.`;
                      },
                    },
                  },
                ],
              },
              attachments: {
                uploadTimeout: 30000,
                maxSize: 5242880, // 5MB
                allowedTypes: ["image/*", "application/pdf"],
              },
              ui: {
                emptyMessage: "Chat with tool-enabled assistant...",
              },
            },
          },
        },
      },
      //#endregion
    },
  };
};

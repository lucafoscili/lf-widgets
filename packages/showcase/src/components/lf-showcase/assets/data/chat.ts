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
          description: "Chat with tools for external actions (PoC)",
          props: {
            lfTools: [
              {
                type: "function",
                function: {
                  name: "get_showcase_docs",
                  description:
                    "Get information about the lf-widgets showcase documentation",
                  parameters: {
                    type: "object",
                    properties: {
                      topic: {
                        type: "string",
                        description:
                          "The topic to query (e.g., 'components', 'framework')",
                      },
                    },
                    required: ["topic"],
                  },
                  execute: async (args: Record<string, unknown>) => {
                    const topic = (args.topic as string) || "general";
                    return `Showcase documentation for topic "${topic}": This is a PoC response. The lf-widgets showcase includes various components like buttons, chats, and more. For full docs, visit the repository.`;
                  },
                },
              },
              {
                type: "function",
                function: {
                  name: "get_weather",
                  description: "Get current weather information for a location",
                  parameters: {
                    type: "object",
                    properties: {
                      location: {
                        type: "string",
                        description: "The city or location to get weather for",
                      },
                    },
                    required: ["location"],
                  },
                  execute: async (args: Record<string, unknown>) => {
                    const location = (args.location as string) || "unknown";
                    // In a real implementation, this would call a weather API
                    return `Weather for ${location}: Sunny, 72°F (22°C). This is a mock response - integrate with a real weather API for actual data.`;
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

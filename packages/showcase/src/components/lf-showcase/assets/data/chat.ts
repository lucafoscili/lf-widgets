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
      },
      //#endregion
    },
  };
};

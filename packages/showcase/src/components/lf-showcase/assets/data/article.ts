import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfArticlePropsInterface,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfEventName,
  LfEventPayloadName,
  LfThemeUISize,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfArticle";
const EVENT_NAME: LfEventName<"LfArticle"> = "lf-article-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfArticle"> = "LfArticleEventPayload";
const TAG_NAME: LfComponentTag<"LfArticle"> = "lf-article";

export const getArticleFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-article"> => {
  const { get } = framework.assets;

  //#region mock data
  const lfDataset: LfArticleDataset = {
    nodes: [
      {
        id: "0",
        value: "Artificial Intelligence: A Comprehensive Guide",
        children: [
          {
            id: "1.1",
            value: "Introduction",
            children: [
              {
                children: [
                  {
                    cells: {
                      lfImage: {
                        shape: "image",
                        value: get(`./assets/showcase/light.webp`).path,
                      },
                    },
                    id: "1.1.1.1",
                    value: "",
                  },
                ],
                id: "1.1.1",
                value: "",
              },
              {
                children: [
                  {
                    id: "1.1.2.1",
                    value:
                      "Artificial Intelligence (AI) is a rapidly evolving field that has the potential to revolutionize various aspects of our lives. This article aims to provide a comprehensive overview of AI, its applications, and the challenges it faces.",
                  },
                ],
                id: "1.1.2",
                value: "",
              },
            ],
          },
          {
            id: "1.2",
            value: "What is Artificial Intelligence?",
            children: [
              {
                children: [
                  {
                    id: "1.2.1.1",
                    value:
                      "Artificial Intelligence is a branch of computer science that focuses on creating systems capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.",
                  },
                ],
                id: "1.2.1",
                value: "",
              },
              {
                children: [
                  {
                    cells: {
                      lfCode: {
                        shape: "code",
                        lfLanguage: "python",
                        value: `def hello_world():\nprint("Hello, world!")`,
                      },
                    },
                    id: "1.2.2.1",
                    value:
                      "Artificial Intelligence is a branch of computer science that focuses on creating systems capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.",
                  },
                ],
                id: "1.2.2",
                value: ``,
              },
            ],
          },
          {
            id: "1.3",
            value: "Applications of Artificial Intelligence",
            children: [
              {
                children: [
                  {
                    id: "1.3.1.1",
                    value:
                      "AI has a wide range of applications across various industries, including healthcare, finance, education, and transportation. For example, AI can help diagnose diseases, predict stock market trends, and personalize learning experiences.",
                  },
                ],
                id: "1.3.1",
                value: "",
              },
              {
                children: [
                  {
                    cells: {
                      lfImage: {
                        shape: "image",
                        value: get(`./assets/showcase/dark.webp`).path,
                      },
                    },
                    id: "1.3.2.1",
                    value:
                      "AI has a wide range of applications across various industries, including healthcare, finance, education, and transportation. For example, AI can help diagnose diseases, predict stock market trends, and personalize learning experiences.",
                  },
                ],
                id: "1.3.2",
                value: "",
              },
            ],
          },
          {
            id: "1.4",
            value: "Challenges and Ethical Considerations",
            children: [
              {
                children: [
                  {
                    id: "1.4.1.1",
                    value:
                      "While AI offers numerous benefits, it also presents several challenges, including privacy concerns, job displacement, and the risk of bias in AI systems. Ethical considerations are crucial in the development and deployment of AI technologies.",
                  },
                ],
                id: "1.4.1",
                value: "",
              },
              {
                id: "1.4.2",
                value: "",
              },
            ],
          },
          {
            id: "1.5",
            value: "Conclusion",
            children: [
              {
                children: [
                  {
                    value:
                      "Artificial Intelligence is poised to play a pivotal role in shaping the future of technology and society. As we continue to explore its potential, it is essential to address its challenges and ethical implications to ensure its responsible development and deployment.",
                    id: "1.5.2.1",
                  },
                ],
                id: "1.5.1",
                value: "",
              },
            ],
          },
        ],
      },
    ],
  };
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is designed to render semantic HTML based on a JSON structure",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              nodes: [
                {
                  value: "Article Title",
                  id: DOC_IDS.root,
                  children: [
                    {
                      value: "Section Title",
                      id: DOC_IDS.section,
                      children: [
                        {
                          value: "Paragraph title",
                          id: DOC_IDS.paragraph,
                          children: [
                            {
                              value: "Text",
                              id: DOC_IDS.content,
                            },
                            {
                              value: "Strong text",
                              id: DOC_IDS.content,
                              tagName: "strong",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            }),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "lf-event",
                description: "wraps a subcomponent event",
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
            ],
            EVENT_NAME,
          ),
          SECTION_FACTORY.methods(TAG_NAME),
          SECTION_FACTORY.styling(TAG_NAME),
        ],
      },
    ],
  };

  return {
    //#region configuration
    configuration: {
      columns: {
        uncategorized: 2,
        sizes: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Simple article",
          props: {
            lfDataset,
          },
        },
        style: {
          description: "Article with custom style",
          props: {
            lfDataset,
            lfStyle: randomStyle(),
          },
        },
      },
      //#endregion

      //#region Sizes
      sizes: LF_THEME_UI_SIZES.reduce(
        (acc, key) => {
          const size = key as LfThemeUISize;

          return {
            ...acc,
            [size]: {
              description: `Article with size ${size}`,
              props: {
                lfDataset,
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfArticlePropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

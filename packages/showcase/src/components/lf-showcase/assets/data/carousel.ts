import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomNumber, randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfCarousel";
const EVENT_NAME: LfEventName<"LfCarousel"> = "lf-carousel-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfCarousel"> = "LfCarouselEventPayload";
const TAG_NAME: LfComponentTag<"LfCarousel"> = "lf-carousel";

export const getCarouselFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-carousel"> => {
  const { get } = core.assets;

  //#region mock data
  const data: Partial<{
    [K in LfComponentName]: LfDataDataset;
  }> = {
    LfButton: {
      nodes: Array.from({ length: randomNumber(3, 7) }).map((_, index) => ({
        cells: {
          lfButton: {
            lfLabel: "This slide is a button (" + index + ")",
            lfStretchX: true,
            lfStretchY: true,
            shape: "button",
            value: "",
          },
        },
        id: `button_${index}`,
      })),
    },
    LfCard: {
      nodes: Array.from({ length: randomNumber(3, 7) }).map(
        (_value, index) => ({
          cells: {
            lfCard: {
              shape: "card",
              value: "This slide is a card (" + index + ")",
              lfDataset: {
                nodes: [
                  {
                    id: "",
                    cells: {
                      1: { value: "Slide " + index },
                      2: { value: "" },
                      3: { value: "This is the slide number " + index },
                      lfImage: {
                        shape: "image",
                        value: "lf-website",
                      },
                    },
                  },
                ],
              },
            },
          },
          id: `card_${index}`,
        }),
      ),
    },
    LfCode: {
      nodes: [
        {
          cells: {
            lfCode: {
              lfLanguage: "javascript",
              shape: "code",
              value: "console.log('Hello, World!')",
            },
          },
          id: "code_0",
          value: "Node 0",
        },
        {
          cells: {
            lfCode: {
              lfLanguage: "python",
              shape: "code",
              value: "print('Hello, World!')",
            },
          },
          id: "code_1",
          value: "Node 1",
        },
        {
          cells: {
            lfCode: {
              lfLanguage: "typescript",
              shape: "code",
              value: "console.log('Hello, World!')",
            },
          },
          id: "code_2",
          value: "Node 2",
        },
      ],
    },
    LfImage: {
      nodes: [
        {
          cells: {
            lfImage: {
              shape: "image",
              value: get(`./assets/media/light.webp`).path,
            },
          },
          id: "image_0",
          value: "Node 0",
        },
        {
          cells: {
            lfImage: {
              shape: "image",
              value: get(`./assets/media/dark.webp`).path,
            },
          },
          id: "image_0",
          value: "Node 0",
        },
      ],
    },
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
            "provides a navigable slideshow of images or content cards",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              nodes: [
                {
                  value: "Node 1",
                  id: "0",
                  cells: {
                    lfImage: { lfValue: "url_of_image1" },
                  },
                },
                {
                  value: "Node 2",
                  id: "1",
                  cells: {
                    lfImage: { lfValue: "url_of_image2" },
                  },
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
                description: "emitted by shapes",
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
  //#endregion

  return {
    //#region configuration
    configuration: {
      columns: {
        uncategorized: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        lightbox: {
          description: "Carousel with lightbox",
          props: {
            lfDataset: data.LfImage,
            lfLightbox: true,
          },
        },
        code: {
          description: "Carousel with code shape",
          props: {
            lfDataset: data.LfCode,
            lfShape: "code",
          },
        },
        style: {
          description: "Carousel with custom style",
          props: {
            lfDataset: data.LfImage,
            lfStyle: randomStyle(),
          },
        },
        button: {
          description: "Carousel with button shape",
          props: {
            lfDataset: data.LfButton,
            lfShape: "button",
          },
        },
        autoplay: {
          description: "Carousel with autoplay",
          props: {
            lfAutoPlay: true,
            lfDataset: data.LfImage,
          },
        },
        card: {
          description: "Carousel with card shape",
          props: {
            lfDataset: data.LfCard,
            lfShape: "card",
          },
        },
      },
      //#endregion
    },
  };
};

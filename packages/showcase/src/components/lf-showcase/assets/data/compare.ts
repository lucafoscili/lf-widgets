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
import { randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfCompare";
const EVENT_NAME: LfEventName<"LfCompare"> = "lf-compare-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfCompare"> = "LfCompareEventPayload";
const TAG_NAME: LfComponentTag<"LfCompare"> = "lf-compare";

export const getCompareFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-compare"> => {
  const { get } = core.assets;

  //#region mock data
  const images = [
    get(`./assets/media/dark.webp`).path,
    get(`./assets/media/light.webp`).path,
    get(`./assets/media/avatar_thor_2.png`).path,
    get(`./assets/media/avatar_freya_2.png`).path,
  ];
  const lfDataset: Partial<{
    [K in LfComponentName]: LfDataDataset;
  }> = {
    LfCard: {
      nodes: images.map((value, index) => ({
        cells: {
          lfCard: {
            shape: "card",
            value,
            lfDataset: {
              nodes: [
                {
                  id: "",
                  cells: {
                    1: { value: "Card " + index },
                    2: { value },
                    3: { value: "This is the Card number " + index },
                    lfImage: {
                      shape: "image",
                      value,
                    },
                  },
                },
              ],
            },
          },
        },
        id: `card_${index}`,
      })),
    },
    LfCode: {
      nodes: [
        {
          id: "1",
          value: "Node 1",
          cells: {
            lfCode: {
              lfLanguage: "python",
              lfStickyHeader: false,
              shape: "code",
              value: "print('Hello, world!') # Python",
            },
          },
        },
        {
          id: "2",
          value: "Node 2",
          cells: {
            lfCode: {
              lfLanguage: "javascript",
              lfStickyHeader: false,
              shape: "code",
              value: "console.log('Hello, world!'); // JavaScript",
            },
          },
        },
      ],
    },
    LfImage: {
      nodes: images.map((image, index) => ({
        id: `image_${index + 1}`,
        value: `Image ${index + 1}`,
        cells: {
          lfImage: {
            shape: "image",
            value: image,
          },
        },
      })),
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
            "is handy when two components must be compared in order to spot differences",
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
    //#region Configuration
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
        style: {
          description: "Compare with custom style",
          props: {
            lfDataset: lfDataset.LfImage,
            lfStyle: randomStyle(),
          },
        },
        view: {
          description: "Compare with split view",
          props: {
            lfDataset: lfDataset.LfImage,
            lfView: "split",
          },
        },
        card: {
          description: "Compare two cards",
          props: {
            lfDataset: lfDataset.LfCard,
            lfShape: "card",
          },
        },
        code: {
          description: "Compare two snippets of code",
          props: {
            lfDataset: lfDataset.LfCode,
            lfShape: "code",
          },
        },
        image: {
          description: "Compare two images",
          props: {
            lfDataset: lfDataset.LfImage,
          },
        },
      },
      //#endregion
    },
  };
};

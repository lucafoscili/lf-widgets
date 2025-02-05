import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfCardLayout,
  LfCardPropsInterface,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfCard";
const EVENT_NAME: LfEventName<"LfCard"> = "lf-card-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfCard"> = "LfCardEventPayload";
const TAG_NAME: LfComponentTag<"LfCard"> = "lf-card";

export const getCardFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-card"> => {
  const { assets, theme } = core;
  const { get } = assets;

  //#region mock data
  const lfDatasets: {
    [K in LfCardLayout]: LfDataDataset[];
  } = {
    debug: [
      {
        nodes: [
          {
            cells: {
              lfCode: { shape: "code", value: "" },
              lfButton: {
                shape: "button",
                value: "",
              },
              lfButton_2: {
                shape: "button",
                value: "",
              },
              lfToggle: {
                shape: "toggle",
                value: false,
              },
            },
            description: "Debug card with code, buttons and toggle",
            id: "debug",
          },
        ],
      },
    ],
    keywords: [
      {
        nodes: [
          {
            cells: {
              lfChart: {
                lfAxis: "Axis_0",
                lfDataset: {
                  columns: [
                    {
                      id: "Axis_0",
                      title: "Keyword",
                    },
                    {
                      id: "Series_0",
                      title: "Count",
                    },
                  ],
                  nodes: [
                    {
                      cells: {
                        Axis_0: {
                          value: "key_1",
                        },
                        Series_0: {
                          shape: "number",
                          value: 1,
                        },
                      },
                      id: "0",
                    },
                    {
                      cells: {
                        Axis_0: {
                          value: "key_2",
                        },
                        Series_0: {
                          shape: "number",
                          value: 2,
                        },
                      },
                      id: "1",
                    },
                    {
                      cells: {
                        Axis_0: {
                          value: "key_3",
                        },
                        Series_0: {
                          shape: "number",
                          value: 6,
                        },
                      },
                      id: "2",
                    },
                    {
                      cells: {
                        Axis_0: {
                          value: "key_4",
                        },
                        Series_0: {
                          shape: "number",
                          value: 0,
                        },
                      },
                      id: "3",
                    },
                    {
                      cells: {
                        Axis_0: {
                          value: "key_5",
                        },
                        Series_0: {
                          shape: "number",
                          value: 12,
                        },
                      },
                      id: "4",
                    },
                  ],
                },
                lfSeries: ["Series_0"],
                shape: "chart",
                value: "",
              },
              lfChip: {
                lfDataset: {
                  nodes: [
                    {
                      id: "key_1",
                      value: "key_1",
                    },
                    {
                      id: "key_2",
                      value: "key_2",
                    },
                    {
                      id: "key_3",
                      value: "key_3",
                    },
                    {
                      id: "key_4",
                      value: "key_4",
                    },
                    {
                      id: "key_5",
                      value: "key_5",
                    },
                  ],
                },
                lfStyle: "#lf-component .chip-set { height: auto; }",
                lfStyling: "filter",
                shape: "chip",
                value: "",
              },
              lfButton: {
                lfLabel: "Copy selected",
                lfStyling: "flat",
                shape: "button",
                value: "",
              },
            },
            description: "Keyword card with chart, chip and button",
            id: "keywords",
          },
        ],
      },
    ],
    material: [
      {
        nodes: [
          {
            cells: {
              1: { value: "Title" },
              2: { value: "Subtitle" },
              3: { value: "Description." },
              lfButton: {
                shape: "button",
                value: "Button",
                lfLabel: "Button",
                lfStyling: "flat",
              },
              lfImage: {
                shape: "image",
                value: get(`./assets/media/outfit_dress.png`).path,
              },
            },
            description:
              "Material card with title, subtitle, description, actions and a broken image",
            id: "material",
          },
        ],
      },
      {
        nodes: [
          {
            cells: {
              1: { value: "Light theme " },
              lfImage: {
                shape: "image",
                value: get(`./assets/media/light.webp`).path,
              },
            },
            description: "Material card with title and image",
            id: "material",
          },
        ],
      },
      {
        nodes: [
          {
            cells: {
              1: { value: "Dark theme " },
              2: { value: "Default" },
              lfImage: {
                shape: "image",
                value: get(`./assets/media/dark.webp`).path,
              },
            },
            description: "Material card with title, subtitle and image",
            id: "material",
          },
        ],
      },
      {
        nodes: [
          {
            cells: {
              1: { value: "Freya" },
              2: { value: "Goddess of love" },
              3: {
                value:
                  "Freya is a goddess associated with love, beauty, fertility, gold, seiðr, war, and death.",
              },
              lfImage: {
                shape: "image",
                value: get(`./assets/media/avatar_freya.png`).path,
              },
            },
            description:
              "Material card with title, subtitle, description and image",
            id: "material",
          },
        ],
      },
      {
        nodes: [
          {
            cells: {
              1: { value: "" },
              2: { value: "" },
              3: {
                value:
                  "Thor is a hammer-wielding god associated with thunder, lightning, storms, oak trees, strength, the protection of mankind and also hallowing and fertility.",
              },
              lfImage: {
                shape: "image",
                value: get(`./assets/media/avatar_thor.png`).path,
              },
            },
            description: "Material card with description and image",
            id: "material",
          },
        ],
      },
      {
        nodes: [
          {
            cells: {
              1: { value: "Odin" },
              2: { value: "The Allfather" },
              3: {
                value: "Odin is a widely revered god in Germanic mythology.",
              },
            },
            description: "Material card with title, subtitle and description",
            id: "material",
          },
        ],
      },
    ],
    upload: [
      {
        nodes: [
          {
            cells: {
              lfButton: { shape: "button", value: "" },
              lfUpload: {
                shape: "upload",
                value: "",
              },
            },
            description: "Upload card with button and upload",
            id: "upload",
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
            "component is designed to render cards based on a JSON structure",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              nodes: [
                {
                  cells: {
                    icon: { shape: "image", value: "widgets" },
                    text1: { value: "Title" },
                    text2: { value: "Subtitle" },
                    text3: { value: "Description." },
                  },
                  id: "card",
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
                type: "click",
                description: "emitted when the component is clicked",
              },
              {
                type: "contextmenu",
                description: "emitted when the component is right-clicked",
              },
              {
                type: "lf-event",
                description: "wraps a subcomponent event",
              },
              {
                type: "pointerdown",
                description:
                  "emitted when as soon as the component is touched/clicked (before the click event)",
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
        debug: 2,
        keywords: 2,
        material: 3,
        upload: 2,
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Layouts
      ...Object.keys(lfDatasets).reduce(
        (acc, layout) => {
          const l = layout as LfCardLayout;
          acc[l] = {
            ...lfDatasets[l].reduce(
              (acc, data, index) => {
                const description = data.nodes[0].description;
                acc[`${layout}-${index}`] = {
                  description,
                  props: {
                    lfDataset: data,
                    lfLayout: l,
                    lfSizeX: "320px",
                    lfSizeY: "320px",
                  },
                };
                acc[`${layout}-${index}-style`] = {
                  description: `${description} (custom style)`,
                  props: {
                    lfDataset: data,
                    lfLayout: l,
                    lfSizeX: "320px",
                    lfSizeY: "320px",
                    lfStyle: randomStyle(),
                  },
                };
                return acc;
              },
              {} as {
                [example: string]: LfShowcaseExample<LfCardPropsInterface>;
              },
            ),
          };
          return acc;
        },
        {} as {
          [layout in LfCardLayout]: {
            [example: string]: LfShowcaseExample<LfCardPropsInterface>;
          };
        },
      ),
      //#endregion

      //#region Sizes
      sizes: LF_THEME_UI_SIZES.reduce(
        (acc, key) => {
          const size = key as LfThemeUISize;

          return {
            ...acc,
            [size]: {
              description: `Card with size ${size}`,
              props: {
                lfDataset: lfDatasets.material[0],
                lfLayout: "material",
                lfSizeX: "256px",
                lfSizeY: "256px",
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfCardPropsInterface>;
        },
      ),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key]) => {
          const state = key as LfThemeUIState;
          return {
            ...acc,
            [state]: {
              description: `Card in ${state} state`,
              props: {
                lfDataset: lfDatasets.material[0],
                lfLayout: "material",
                lfSizeX: "256px",
                lfSizeY: "256px",
                lfUiState: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfCardPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

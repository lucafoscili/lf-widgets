import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfMultiInputPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomPhrase, randomStyle } from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfMultiInput";
const EVENT_NAME: LfEventName<"LfMultiInput"> = "lf-multiinput-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfMultiInput"> =
  "LfMultiInputEventPayload";
const TAG_NAME: LfComponentTag<"LfMultiInput"> = "lf-multiinput";

export const getMultiInputFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-multiinput"> => {
  const { theme } = framework;

  //#region mock data
  const historyDataset: LfDataDataset = {
    nodes: [
      {
        id: "h-1",
        value: "A cozy living room, soft lighting",
      },
      {
        id: "h-2",
        value: "Cinematic portrait, shallow depth of field",
      },
      {
        id: "h-3",
        value: "Studio lighting, high contrast, dramatic",
      },
    ],
  };

  const tagsDataset: LfDataDataset = {
    nodes: [
      { id: "t-1", value: "cozy" },
      { id: "t-2", value: "cinematic" },
      { id: "t-3", value: "portrait" },
      { id: "t-4", value: "soft lighting" },
      { id: "t-5", value: "dramatic" },
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
            "combines a textfield with a chip row to represent either recent values (history mode) or a set of selectable tags (tags mode)",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            tag: TAG_NAME,
            data: JSON.stringify({
              lfDataset: historyDataset,
              lfMaxHistory: 10,
              lfTextfieldProps: { lfLabel: "Prompt" },
            }),
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "input",
                description: "emitted while the user is typing",
              },
              {
                type: "change",
                description:
                  "emitted when the value is committed (enter/blur) and history/tags are updated",
              },
              {
                type: "select-history",
                description:
                  "emitted when the user selects a value from the chip row",
              },
              {
                type: "clear-history",
                description: "emitted when the clear action is triggered",
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
        input: 3,
        tags: 3,
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized (history mode)
      uncategorized: {
        basicHistory: {
          description: "History mode with free input",
          props: {
            lfAllowFreeInput: true,
            lfMaxHistory: 5,
            lfTextfieldProps: {
              lfLabel: "Prompt",
              lfHelper: {
                value: randomPhrase(3, 6),
              },
            },
          },
        },
        presetHistory: {
          description: "History mode with preset dataset",
          props: {
            lfDataset: historyDataset,
            lfTextfieldProps: {
              lfLabel: "Prompt history",
            },
          },
        },
        strictHistory: {
          description: "History mode without free input",
          props: {
            lfAllowFreeInput: false,
            lfDataset: historyDataset,
            lfTextfieldProps: {
              lfLabel: "Select existing prompt",
              lfHelper: {
                value: "Only prompts from history are accepted",
              },
            },
          },
        },
        styled: {
          description: "History mode with custom style",
          props: {
            lfDataset: historyDataset,
            lfStyle: randomStyle(),
            lfTextfieldProps: {
              lfLabel: "Styled multiinput",
            },
          },
        },
      },
      //#endregion

      //#region Input (history & value-focused examples)
      input: {
        withInitialValue: {
          description: "History mode with initial value",
          props: {
            lfDataset: historyDataset,
            lfMaxHistory: 10,
            lfTextfieldProps: {
              lfLabel: "Last prompt",
            },
            lfValue: historyDataset.nodes[0]?.value as string,
          },
        },
        shortHistory: {
          description: "History mode with limited history length",
          props: {
            lfDataset: historyDataset,
            lfMaxHistory: 2,
            lfTextfieldProps: {
              lfLabel: "Short history (2 entries)",
            },
          },
        },
      },
      //#endregion

      //#region Tags
      tags: {
        freeTags: {
          description: "Tags mode with free input allowed",
          props: {
            lfAllowFreeInput: true,
            lfDataset: tagsDataset,
            lfMode: "tags",
            lfTextfieldProps: {
              lfLabel: "Tags (comma separated)",
              lfHelper: {
                value: "Click chips or type tags separated by commas",
              },
            },
          },
        },
        strictTags: {
          description: "Tags mode restricted to predefined tags",
          props: {
            lfAllowFreeInput: false,
            lfDataset: tagsDataset,
            lfMode: "tags",
            lfTextfieldProps: {
              lfLabel: "Preset tags only",
              lfHelper: {
                value: "Only tags from the chip row are accepted",
              },
            },
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
              description: `Multiinput in ${size} size`,
              props: {
                lfDataset: tagsDataset,
                lfMode: "tags",
                lfTextfieldProps: {
                  lfLabel: `Size ${size}`,
                },
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfMultiInputPropsInterface>;
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
              description: `Multiinput in ${state} state`,
              props: {
                lfDataset: tagsDataset,
                lfMode: "tags",
                lfTextfieldProps: {
                  lfLabel: `${state} multiinput`,
                },
                lfUiState: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfMultiInputPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};


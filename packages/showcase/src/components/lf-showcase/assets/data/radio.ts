import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfRadioPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomBoolean, randomStyle } from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfRadio";
const EVENT_NAME: LfEventName<"LfRadio"> = "lf-radio-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfRadio"> = "LfRadioEventPayload";
const TAG_NAME: LfComponentTag<"LfRadio"> = "lf-radio";

// Sample datasets for radio examples
const createBasicDataset = (): LfDataDataset => ({
  nodes: [
    { id: "option1", value: "Option 1" },
    { id: "option2", value: "Option 2" },
    { id: "option3", value: "Option 3" },
  ],
});

const createLongDataset = (): LfDataDataset => ({
  nodes: [
    { id: "red", value: "Red" },
    { id: "green", value: "Green" },
    { id: "blue", value: "Blue" },
    { id: "yellow", value: "Yellow" },
    { id: "purple", value: "Purple" },
  ],
});

export const getRadioFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-radio"> => {
  const { theme } = framework;

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "allows users to select a single option from a set of mutually exclusive choices.",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify(createBasicDataset()),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "blur",
                description: "emitted when a radio item loses focus",
              },
              {
                type: "change",
                description: "emitted when the selected option changes",
              },
              {
                type: "click",
                description: "emitted when a radio item is clicked",
              },
              {
                type: "focus",
                description: "emitted when a radio item receives focus",
              },
              {
                type: "pointerdown",
                description:
                  "emitted when a pointer down event occurs on a radio item",
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
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        basic: {
          description: "Basic radio group",
          props: {
            lfDataset: createBasicDataset(),
          },
        },
        preselected: {
          description: "Radio group with pre-selected option",
          props: {
            lfDataset: createBasicDataset(),
            lfValue: "option2",
          },
        },
        withLeadingLabels: {
          description: "Radio group with leading labels",
          props: {
            lfDataset: createBasicDataset(),
            lfLeadingLabel: true,
          },
        },
        withAriaLabel: {
          description: "Radio group with ARIA label",
          props: {
            lfDataset: createBasicDataset(),
            lfAriaLabel: "Choose your favorite color",
          },
        },
        withRipple: {
          description: "Radio group with ripple effect",
          props: {
            lfDataset: createBasicDataset(),
            lfRipple: true,
          },
        },
        noRipple: {
          description: "Radio group without ripple effect",
          props: {
            lfDataset: createBasicDataset(),
            lfRipple: false,
          },
        },
        customStyle: {
          description: "Radio group with custom style",
          props: {
            lfDataset: createBasicDataset(),
            lfStyle: randomStyle(),
          },
        },
        verticalOrientation: {
          description: "Radio group with vertical orientation",
          props: {
            lfDataset: createLongDataset(),
            lfOrientation: "vertical",
          },
        },
        horizontalOrientation: {
          description: "Radio group with horizontal orientation",
          props: {
            lfDataset: createLongDataset(),
            lfOrientation: "horizontal",
          },
        },
      },
      //#endregion

      //#region Sizes
      sizes: LF_THEME_UI_SIZES.reduce((acc, key) => {
        const size = key as LfThemeUISize;

        return {
          ...acc,
          [size]: {
            description: `Radio group with size: ${size}`,
            props: {
              lfDataset: createBasicDataset(),
              lfUiSize: size,
              lfValue: randomBoolean() ? "option1" : "option2",
            },
          },
        };
      }, {}),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key, _values]) => {
          const state = key as LfThemeUIState;

          return {
            ...acc,
            [state]: {
              description: `Radio group in ${state} state`,
              props: {
                lfDataset: createBasicDataset(),
                lfUiState: state,
                lfValue: "option1",
              } as LfRadioPropsInterface,
            },
          };
        },
        {},
      ),
      //#endregion
    },
  };
};

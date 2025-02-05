import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfEventName,
  LfEventPayloadName,
  LfSliderPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomNumber, randomStyle } from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfSlider";
const EVENT_NAME: LfEventName<"LfSlider"> = "lf-slider-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfSlider"> = "LfSliderEventPayload";
const TAG_NAME: LfComponentTag<"LfSlider"> = "lf-slider";

export const getSliderFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-slider"> => {
  const { theme } = core;

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "provides the ability to adjust the widget's value by moving a slider thumb along a track",
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
                type: "blur",
                description: "emitted when the component loses focus",
              },
              {
                type: "focus",
                description: "emitted when the component is focused",
              },
              {
                type: "input",
                description: "emitted when the component is being changed",
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
        uncategorized: 4,
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Slider with leading label",
          props: {
            lfLabel: "Leading label",
            lfLeadingLabel: true,
            lfValue: randomNumber(0, 100),
          },
        },
        style: {
          description: "Slider with custom style",
          props: {
            lfLabel: "Custom style",
            lfStyle: randomStyle(),
            lfValue: randomNumber(0, 100),
          },
        },
        negative: {
          description: "Slider with negative value",
          props: {
            lfLabel: "Negative value",
            lfValue: randomNumber(0, 100),
          },
        },
        step: {
          description: "Slider with custom step, min and max values",
          props: {
            lfLabel: "Step",
            lfMax: 1000,
            lfMin: -1000,
            lfStep: randomNumber(1, 100),
            lfValue: randomNumber(-1000, 1000),
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
              description: `Slider with size ${size}`,
              props: {
                lfLabel: size,
                lfUiSize: size,
                lfValue: randomNumber(0, 100),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfSliderPropsInterface>;
        },
      ),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key, values]) => {
          const state = key as LfThemeUIState;
          const { icon } = values;

          return {
            ...acc,
            [state]: {
              description: `Slider in ${state} state`,
              props: {
                lfIcon: icon,
                lfLabel: state,
                lfUiState: state,
                lfValue: randomNumber(40, 100),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfSliderPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

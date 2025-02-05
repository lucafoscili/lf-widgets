import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfEventName,
  LfEventPayloadName,
  LfProgressbarPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomIcon,
  randomNumber,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfProgressbar";
const EVENT_NAME: LfEventName<"LfProgressbar"> = "lf-progressbar-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfProgressbar"> =
  "LfProgressbarEventPayload";
const TAG_NAME: LfComponentTag<"LfProgressbar"> = "lf-progressbar";

export const getProgressbarFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-progressbar"> => {
  const { theme } = core;
  const icons = Object.values(theme.get.icons());

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is designed to display a state of advancement. It can be displayed as a horizontal bar or as a radial widget",
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
        states: 4,
        sizes: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        animated: {
          description: "Animated progress bar",
          props: {
            lfAnimated: true,
            lfValue: randomNumber(30, 100),
          },
        },
        centeredLabel: {
          description: "Progress bar with centered label",
          props: {
            lfCenteredLabel: true,
            lfValue: randomNumber(60, 100),
          },
        },
        icon: {
          description: "Progress bar with icon",
          props: {
            lfIcon: randomIcon(icons),
            lfValue: randomNumber(10, 100),
          },
        },
        isRadial: {
          description: "Radial progress bar",
          props: {
            lfIsRadial: true,
            lfValue: randomNumber(0, 100),
          },
        },
        isRadialIcon: {
          description: "Radial progress bar with icon",
          props: {
            lfIsRadial: true,
            lfIcon: randomIcon(icons),
            lfValue: randomNumber(0, 100),
          },
        },
        label: {
          description: "Progress bar with label",
          props: {
            lfLabel: "I'm a label",
            lfValue: randomNumber(0, 100),
          },
        },
        padded: {
          description: "Progress bar with padding",
          props: {
            lfValue: randomNumber(0, 100),
          },
        },
        style: {
          description: "Progress bar with custom style",
          props: {
            lfStyle: randomStyle(),
            lfValue: randomNumber(0, 100),
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
              description: `Progress bar with size ${size}`,
              props: {
                lfLabel: size,
                lfUiSize: size,
                lfValue: randomNumber(0, 100),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfProgressbarPropsInterface>;
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
              description: `Progress bar in ${state} state`,
              props: {
                lfIcon: icon,
                lfLabel: state,
                lfUiState: state,
                lfValue: randomNumber(50, 100),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfProgressbarPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

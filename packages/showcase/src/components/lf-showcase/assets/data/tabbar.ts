import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfTabbarPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomBoolean,
  randomIcon,
  randomNumber,
  randomString,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfTabbar";
const EVENT_NAME: LfEventName<"LfTabbar"> = "lf-tabbar-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfTabbar"> = "LfTabbarEventPayload";
const TAG_NAME: LfComponentTag<"LfTabbar"> = "lf-tabbar";

export const getTabbarFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-tabbar"> => {
  const { theme } = core;
  const icons = Object.values(theme.get.icons());

  //#region mock data
  const lfDataset: LfDataDataset = {
    nodes: Array.from({ length: randomNumber(3, 15) }).map((_, index) => ({
      description: `Tab ${index + 1}`,
      icon: randomBoolean() ? randomIcon(icons) : undefined,
      id: index.toString(),
      value: randomString(),
    })),
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
            "is designed to render tab bars based on a JSON structure",
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
                type: "click",
                description: "emitted when the component is clicked",
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
        uncategorized: 3,
        sizes: 3,
        states: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Tab bar with navigation arrows",
          props: {
            lfDataset: {
              nodes: Array.from({ length: 15 }).map((_, index) => ({
                description: `Tab ${index + 1}`,
                id: index.toString(),
                value: `Tab ${index + 1}`,
              })),
            },
            lfNavigation: true,
          },
        },
        initialized: {
          description: "Tab bar with initial value",
          props: {
            lfDataset,
            lfStyle: randomStyle(),
            lfValue: randomNumber(0, 2),
          },
        },
        style: {
          description: "Tab bar with custom style",
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
              description: `Tab bar with size ${size}`,
              props: {
                lfDataset: {
                  nodes: Array.from({ length: randomNumber(3, 7) }).map(
                    (_, index) => ({
                      description: `Tab ${index + 1}`,
                      id: index.toString(),
                      value: `${size} ${index + 1}`,
                    }),
                  ),
                },
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfTabbarPropsInterface>;
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
              description: `Tab bar in ${state} state`,
              props: {
                lfDataset: {
                  nodes: Array.from({ length: randomNumber(3, 7) }).map(
                    (_, index) => ({
                      description: `Tab ${index + 1}`,
                      icon: icon,
                      id: index.toString(),
                      value: `${state} ${index + 1}`,
                    }),
                  ),
                },
                lfUiState: state,
                lfValue: randomNumber(0, 5),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfTabbarPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

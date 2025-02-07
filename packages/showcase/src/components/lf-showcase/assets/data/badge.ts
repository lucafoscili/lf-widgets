import {
  LF_BADGE_POSITIONS,
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfBadgePropsInterface,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
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

const COMPONENT_NAME: LfComponentName = "LfBadge";
const EVENT_NAME: LfEventName<"LfBadge"> = "lf-badge-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfBadge"> = "LfBadgeEventPayload";
const TAG_NAME: LfComponentTag<"LfBadge"> = "lf-badge";

export const getBadgeFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-badge"> => {
  const { theme } = framework;
  const { bellRinging } = theme.get.icons();

  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is designed to be attached to another element and display additional informations about it",
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
                description: "emitted when a subcomponent is clicked",
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
        uncategorized: 5,
        positions: 4,
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        empty: {
          description: "Empty badge",
          hasParent: true,
          props: {},
        },
        icon: {
          description: "Badge with icon",
          hasParent: true,
          props: {
            lfImageProps: {
              lfValue: bellRinging,
            },
          },
        },
        image: {
          description: "Badge with image",
          hasParent: true,
          props: {
            lfImageProps: {
              lfValue: "https://avatars.githubusercontent.com/u/45429703?v=4",
            },
          },
        },
        label: {
          description: "Badge with text",
          hasParent: true,
          props: {
            lfLabel: Math.floor(Math.random() * 100).toString(),
          },
        },
        style: {
          description: "Badge with custom style",
          hasParent: true,
          props: {
            lfStyle: randomStyle(),
          },
        },
      },
      //#endregion

      //#region Positions
      positions: {
        ...LF_BADGE_POSITIONS.reduce(
          (acc, position) => {
            return {
              ...acc,
              [position]: {
                description: `Badge in ${position} position`,
                hasParent: true,
                props: {
                  lfPosition: position,
                },
              },
            };
          },
          {} as {
            [example: string]: LfShowcaseExample<LfBadgePropsInterface>;
          },
        ),
      },
      //#endregion

      //#region Sizes
      sizes: LF_THEME_UI_SIZES.reduce(
        (acc, key) => {
          const size = key as LfThemeUISize;

          return {
            ...acc,
            [size]: {
              description: `Badge with size ${size}`,
              hasParent: true,
              props: {
                lfLabel: size.substring(0, 3).toUpperCase(),
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfBadgePropsInterface>;
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
              description: `Badge in ${state} state`,
              hasParent: true,
              props: {
                lfImageProps: {
                  lfValue: icon,
                },
                lfUiState: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfBadgePropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

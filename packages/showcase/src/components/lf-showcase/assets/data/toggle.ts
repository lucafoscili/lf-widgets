import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfEventName,
  LfEventPayloadName,
  LfThemeUISize,
  LfThemeUIState,
  LfTogglePropsInterface,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomBoolean,
  randomPhrase,
  randomString,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfToggle";
const EVENT_NAME: LfEventName<"LfToggle"> = "lf-toggle-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfToggle"> = "LfToggleEventPayload";
const TAG_NAME: LfComponentTag<"LfToggle"> = "lf-toggle";

export const getToggleFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-toggle"> => {
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
            "can be used as a simpler toggler",
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
                type: "change",
                description: "emitted when the component's value changes",
              },
              {
                type: "focus",
                description: "emitted when the component is focused",
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
        toggle: {
          description: "Simple toggle",
          props: {},
        },
        initValue: {
          description: "Toggle with initial value",
          props: {
            lfValue: true,
          },
        },
        label: {
          description: "Toggle with label",
          props: {
            lfLabel: randomString(),
          },
        },
        leadingLabel: {
          description: "Toggle with leading label",
          props: {
            lfLabel: randomPhrase(1, 3),
            lfLeadingLabel: true,
          },
        },
        style: {
          description: "Toggle with custom style",
          props: {
            lfLabel: randomString(),
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
              description: `Toggle with size: ${size}`,
              props: {
                lfLabel: size,
                lfUiSize: size,
                lfValue: randomBoolean(),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfTogglePropsInterface>;
        },
      ),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key, _values]) => {
          const state = key as LfThemeUIState;

          return {
            ...acc,
            [state]: {
              description: `Toggle in ${state} state`,
              props: {
                lfLabel: state,
                lfUiState: state,
                lfValue: true,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfTogglePropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

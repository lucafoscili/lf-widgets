import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfSelectPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomBoolean,
  randomIcon,
  randomNumber,
  randomPhrase,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfSelect";
const EVENT_NAME: LfEventName<"LfSelect"> = "lf-select-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfSelect"> = "LfSelectEventPayload";
const TAG_NAME: LfComponentTag<"LfSelect"> = "lf-select";

export const getSelectFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-select"> => {
  const { theme } = framework;
  const icons = Object.values(theme.get.icons());

  //#region mock data
  const lfDataset: LfDataDataset = {
    nodes: Array.from({ length: randomNumber(3, 6) }).map((_, i) => ({
      description: randomBoolean() ? randomPhrase() : undefined,
      icon: randomBoolean() ? randomIcon(icons) : undefined,
      id: `${i}`,
      value: `Option ${i + 1}`,
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
            "provides a dropdown selection interface that combines textfield styling with list functionality",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              lfDataset,
              lfLabel: "Select an option",
            }),
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
                description: "emitted when the selected value changes",
              },
              {
                type: "click",
                description: "emitted when the component is clicked",
              },
              {
                type: "focus",
                description: "emitted when the component gains focus",
              },
              {
                type: "input",
                description: "emitted when the input value changes",
              },
              {
                type: "ready",
                description:
                  "emitted when the component completes its first complete lifecycle",
              },
              {
                type: "select",
                description:
                  "emitted when an option is selected from the dropdown",
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
      columns: { uncategorized: 3, sizes: 4, states: 4 },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Basic select with dataset",
          props: {
            lfDataset,
            lfLabel: "Choose an option",
          },
        },
        withValue: {
          description: "Select with pre-selected value",
          props: {
            lfDataset,
            lfLabel: "Select option",
            lfValue: "Option 2",
          },
        },
        empty: {
          description: "Select with empty dataset",
          props: {
            lfDataset: { nodes: [] },
            lfEmpty: "No options available",
            lfLabel: "Select option",
          },
        },
        style: {
          description: "Select with custom style",
          props: {
            lfDataset,
            lfLabel: "Styled select",
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
              description: `Select with size ${size}`,
              props: {
                lfDataset,
                lfLabel: `Size ${size}`,
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfSelectPropsInterface>;
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
              description: `Select in ${state} state`,
              props: {
                lfDataset,
                lfLabel: `${state} select`,
                lfUiState: state,
                lfValue: "Option 1",
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfSelectPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

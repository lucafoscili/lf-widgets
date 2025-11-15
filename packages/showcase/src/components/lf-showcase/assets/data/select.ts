import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
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

  const largeDataset: LfDataDataset = {
    nodes: [
      { id: "apple", value: "Apple" },
      { id: "banana", value: "Banana" },
      { id: "cherry", value: "Cherry" },
      { id: "date", value: "Date" },
      { id: "elderberry", value: "Elderberry" },
      { id: "fig", value: "Fig" },
      { id: "grape", value: "Grape" },
      { id: "honeydew", value: "Honeydew" },
      { id: "kiwi", value: "Kiwi" },
      { id: "lemon", value: "Lemon" },
      { id: "mango", value: "Mango" },
      { id: "nectarine", value: "Nectarine" },
      { id: "orange", value: "Orange" },
      { id: "peach", value: "Peach" },
      { id: "pear", value: "Pear" },
      { id: "quince", value: "Quince" },
      { id: "raspberry", value: "Raspberry" },
      { id: "strawberry", value: "Strawberry" },
      { id: "tangerine", value: "Tangerine" },
      { id: "watermelon", value: "Watermelon" },
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
            "provides a dropdown selection interface that combines textfield styling with list functionality",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              lfDataset,
              lfTextfieldProps: { lfLabel: "Select an option" },
            }),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "change",
                description: "emitted when the selected value changes",
              },
              {
                type: "lf-event",
                description: "emitted by the component on user interactions",
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
            lfTextfieldProps: { lfLabel: "Choose an option" },
          },
        },
        withValue: {
          description: "Select with pre-selected value",
          props: {
            lfDataset,
            lfTextfieldProps: { lfLabel: "Select option" },
            lfValue: "1",
          },
        },
        empty: {
          description: "Select with empty dataset",
          props: {
            lfDataset: { nodes: [] },
            lfTextfieldProps: {
              lfLabel: "Select option",
              lfHelper: { value: "No options available" },
            },
          },
        },
        style: {
          description: "Select with custom style",
          props: {
            lfDataset,
            lfTextfieldProps: { lfLabel: "Styled select" },
            lfStyle: randomStyle(),
          },
        },
        filtering: {
          description: "Select with filtering enabled",
          props: {
            lfDataset: largeDataset,
            lfListProps: { lfFilter: true },
            lfTextfieldProps: { lfLabel: "Filter fruits" },
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
                lfTextfieldProps: { lfLabel: `Size ${size}` },
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
                lfTextfieldProps: { lfLabel: `${state} select` },
                lfUiState: state,
                lfValue: "0",
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

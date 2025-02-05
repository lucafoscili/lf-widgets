import {
  LF_TEXTFIELD_STYLINGS,
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfEventName,
  LfEventPayloadName,
  LfTextfieldPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomIcon,
  randomPhrase,
  randomString,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseCategories,
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfTextfield";
const EVENT_NAME: LfEventName<"LfTextfield"> = "lf-textfield-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfSpinner"> = "LfSpinnerEventPayload";
const TAG_NAME: LfComponentTag<"LfTextfield"> = "lf-textfield";

export const getTextfieldFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-textfield"> => {
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
            "is a customizable web component with multiple styling options used to input text",
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
                type: "click",
                description: "emitted when the component is clicked",
              },
              {
                type: "focus",
                description: "emitted when the component is focused",
              },
              {
                type: "input",
                description: "emitted when a new input signal is received",
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
        flat: 4,
        outlined: 4,
        raised: 4,
        textarea: 4,
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      ...LF_TEXTFIELD_STYLINGS.reduce(
        (acc, styling) => {
          const capitalized =
            styling.charAt(0).toUpperCase() + styling.slice(1);
          return {
            ...acc,
            [styling]: {
              label: {
                description: `${capitalized} with label`,
                props: {
                  lfLabel: randomString(),
                  lfStyling: styling,
                },
              },
              initialValue: {
                description: `${capitalized} with initial value`,
                props: {
                  lfLabel: "Initial value",
                  lfStyling: styling,
                  lfValue: randomString(),
                },
              },
              icon: {
                description: `${capitalized} with icon`,
                props: {
                  lfIcon: randomIcon(icons),
                  lfLabel: "Icon",
                  lfStyling: styling,
                },
              },
              iconTrailing: {
                description: `${capitalized} with trailing icon`,
                props: {
                  lfIcon: randomIcon(icons),
                  lfLabel: "Trailing icon",
                  lfStyling: styling,
                  lfTrailingIcon: true,
                },
              },
              helper: {
                description: `${capitalized} with helper text`,
                props: {
                  lfHelper: {
                    showWhenFocused: false,
                    value: randomPhrase(2, 5),
                  },
                  lfLabel: "Helper text",
                  lfStyling: styling,
                },
              },
              helperFocus: {
                description: `${capitalized} with helper text (on focus)`,
                props: {
                  lfHelper: {
                    showWhenFocused: true,
                    value: randomPhrase(2, 5),
                  },
                  lfLabel: "Helper text",
                  lfStyling: styling,
                },
              },
              fullHeight: {
                description: `${capitalized} with full height`,
                hasMinHeight: true,
                props: {
                  lfLabel: "Full height",
                  lfStyling: styling,
                  lfStretchY: true,
                },
              },
              style: {
                description: `${capitalized} with custom style`,
                props: {
                  lfLabel: "Style",
                  lfStyling: styling,
                  lfStyle: randomStyle(),
                },
              },
            },
          };
        },
        {} as {
          [K in LfShowcaseCategories]: {
            [index: string]: LfShowcaseExample<LfTextfieldPropsInterface>;
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
              description: `Textfield with size ${size}`,
              props: {
                lfLabel: "Size",
                lfUiSize: size,
                lfValue: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfTextfieldPropsInterface>;
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
              description: `Textfield in ${state} state`,
              props: {
                lfIcon: icon,
                lfLabel: "State",
                lfUiState: state,
                lfValue: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfTextfieldPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

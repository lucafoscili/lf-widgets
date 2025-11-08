import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfCheckboxPropsInterface,
  LfComponentName,
  LfComponentTag,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomBoolean, randomStyle } from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfCheckbox";
const EVENT_NAME: LfEventName<"LfCheckbox"> = "lf-checkbox-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfCheckbox"> = "LfCheckboxEventPayload";
const TAG_NAME: LfComponentTag<"LfCheckbox"> = "lf-checkbox";

export const getCheckboxFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-checkbox"> => {
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
            "can be used as a simple toggler with three states: on, off, indeterminate.",
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
        checkbox: {
          description: "Simple checkbox",
          props: {},
        },
        withLabel: {
          description: "Checkbox with label",
          props: {
            lfLabel: "Accept terms and conditions",
          },
        },
        leadingLabel: {
          description: "Checkbox with leading label",
          props: {
            lfLabel: "I agree to the terms",
            lfLeadingLabel: true,
          },
        },
        ariaLabel: {
          description: "Checkbox with ARIA label (no visible label)",
          props: {
            lfAriaLabel: "Accept newsletter subscription",
          },
        },
        unchecked: {
          description: "Unchecked checkbox",
          props: {
            lfLabel: "Unchecked",
            lfValue: false,
          },
        },
        checked: {
          description: "Checked checkbox",
          props: {
            lfLabel: "Checked",
            lfValue: true,
          },
        },
        indeterminate: {
          description: "Indeterminate checkbox",
          props: {
            lfLabel: "Indeterminate",
            lfValue: null,
          },
        },
        withRipple: {
          description: "Checkbox with ripple effect",
          props: {
            lfLabel: "With ripple",
            lfRipple: true,
          },
        },
        noRipple: {
          description: "Checkbox without ripple effect",
          props: {
            lfLabel: "No ripple",
            lfRipple: false,
          },
        },
        customStyle: {
          description: "Checkbox with custom style",
          props: {
            lfLabel: "Custom styled",
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
              description: `Checkbox with size: ${size}`,
              props: {
                lfLabel: size,
                lfUiSize: size,
                lfValue: randomBoolean(),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfCheckboxPropsInterface>;
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
              description: `Checkbox in ${state} state`,
              props: {
                lfLabel: state,
                lfUiState: state,
                lfValue: true,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfCheckboxPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

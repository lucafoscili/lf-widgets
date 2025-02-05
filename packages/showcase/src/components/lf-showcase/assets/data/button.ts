import {
  LF_BUTTON_STYLINGS,
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfButtonPropsInterface,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfDataDataset,
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

const COMPONENT_NAME: LfComponentName = "LfButton";
const EVENT_NAME: LfEventName<"LfButton"> = "lf-button-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfButton"> = "LfButtonEventPayload";
const TAG_NAME: LfComponentTag<"LfButton"> = "lf-button";

export const getButtonFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-button"> => {
  const { theme } = core;
  const { brandGithub, brandNpm, palette } = theme.get.icons();

  //#region mock data
  const lfDataset: LfDataDataset = {
    nodes: [
      {
        children: [
          { id: "0.0", value: "Child 1" },
          { id: "0.1", value: "Child 2" },
        ],
        id: "0",
        value: "Node 0",
      },
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
            "can assume the shape of a button with multiple styling options to choose from",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              lfImageProps: { lfValue: "notifications" },
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
                type: "click",
                description: "emitted when the component is clicked",
              },
              {
                type: "focus",
                description: "emitted when the component is focused",
              },
              {
                type: "lf-event",
                description: "wraps a subcomponent event",
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
        flat: 5,
        floating: 5,
        icon: 5,
        outlined: 5,
        raised: 5,
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Styling
      ...LF_BUTTON_STYLINGS.reduce(
        (acc, styling) => {
          if (styling === "icon") {
            return acc;
          }
          return {
            ...acc,
            [styling]: {
              dropdown: {
                description: "Dropdown button",
                props: {
                  lfDataset,
                  lfLabel: "Dropdown",
                  lfStyling: styling,
                },
              },
              icon: {
                description: "Icon-only button",
                props: {
                  lfIcon: brandGithub,
                  lfStyling: styling,
                },
              },
              label: {
                description: "Button with label",
                props: {
                  lfLabel: "This is a label",
                  lfStyling: styling,
                },
              },
              labelIcon: {
                description: "With label and icon",
                props: {
                  lfIcon: brandNpm,
                  lfLabel: "A label with an icon",
                  lfStyling: styling,
                },
              },
              spinner: {
                description: "Button with spinner",
                props: {
                  lfLabel: "With spinner",
                  lfShowSpinner: true,
                  lfStyling: styling,
                },
              },
              stretched: {
                description: "Stretched button",
                props: {
                  lfLabel: "Stretched",
                  lfStretchX: true,
                  lfStretchY: true,
                  lfStyling: styling,
                },
              },
              style: {
                description: "Button with custom style",
                props: {
                  lfLabel: "With custom style",
                  lfStyle: randomStyle(),
                  lfStyling: styling,
                },
              },
              trailingIcon: {
                description: "With label and trailing icon",
                props: {
                  lfIcon: brandNpm,
                  lfLabel: "With label and trailing icon",
                  lfStyling: styling,
                  lfTrailingIcon: true,
                },
              },
            },
          };
        },
        {} as { [example: string]: LfShowcaseExample<LfButtonPropsInterface> },
      ),
      //#endregion

      //#region Icon
      icon: {
        dropdown: {
          description: "Dropdown button",
          props: {
            lfDataset,
            lfIcon: brandNpm,
            lfLabel: "Dropdown",
            lfStyling: "icon",
          },
        },
        icon: {
          description: "Icon button",
          props: {
            lfIcon: brandGithub,
            lfStyling: "icon",
          },
        },
        spinner: {
          description: "Icon button with spinner",
          props: {
            lfIcon: brandNpm,
            lfShowSpinner: true,
            lfStyling: "icon",
          },
        },
        stretched: {
          description: "Stretched icon button",
          props: {
            lfIcon: brandNpm,
            lfLabel: "Stretched",
            lfStretchX: true,
            lfStretchY: true,
            lfStyling: "icon",
          },
        },
        style: {
          description: "Button with custom style",
          props: {
            lfIcon: brandNpm,
            lfStyle: randomStyle(),
            lfStyling: "icon",
          },
        },
        toggable: {
          description: "Toggable button",
          props: {
            lfIcon: palette,
            lfStyling: "icon",
            lfToggable: true,
            lfValue: true,
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
              description: `Button with size ${size}`,
              props: {
                lfLabel: size,
                lfStyling: "raised",
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfButtonPropsInterface>;
        },
      ),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key, values]) => {
          const state = key as LfThemeUIState;
          const { icon, label } = values;

          return {
            ...acc,
            [state]: {
              description: `Button in ${state} state`,
              props: {
                lfIcon: icon,
                lfLabel: label.capitalized,
                lfUiState: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfButtonPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

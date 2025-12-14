import {
  LF_SPINNER_LAYOUTS,
  LF_THEME_UI_SIZES,
  LF_THEME_UI_STATES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfSpinnerLayout,
  LfSpinnerPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfSpinner";
const EVENT_NAME: LfEventName<"LfSpinner"> = "lf-spinner-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfSpinner"> = "LfSpinnerEventPayload";
const TAG_NAME: LfComponentTag<"LfSpinner"> = "lf-spinner";

export const getSpinnerFixtures = (
  _framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-spinner"> => {
  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is designed to render pure CSS spinners that can be used to give the user feedback that a process is currently running",
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
        bar: 1,
        sizes: 5,
        states: 5,
        widget: 4,
        icon: 2,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Bar variant
      bar: {
        bar: {
          description: "Bar variant (progress bar)",
          hasMinHeight: true,
          props: {
            lfActive: true,
            lfBarVariant: true,
            lfLayout: "ring",
            lfUiSize: "xsmall",
          },
        },
      },
      //#endregion

      //#region Sizes
      sizes: LF_THEME_UI_SIZES.reduce<{
        [example: string]: LfShowcaseExample<LfSpinnerPropsInterface>;
      }>((acc, size: LfThemeUISize) => {
        return {
          ...acc,
          [size]: {
            description: `Size: ${size}`,
            hasMinHeight: true,
            props: {
              lfActive: true,
              lfLayout: "ring",
              lfUiSize: size,
            },
          },
        };
      }, {}),
      //#endregion

      //#region States
      states: LF_THEME_UI_STATES.reduce<{
        [example: string]: LfShowcaseExample<LfSpinnerPropsInterface>;
      }>((acc, state: LfThemeUIState) => {
        return {
          ...acc,
          [state]: {
            description: `State: ${state}`,
            hasMinHeight: true,
            props: {
              lfActive: true,
              lfLayout: "ring",
              lfUiSize: "medium",
              lfUiState: state,
            },
          },
        };
      }, {}),
      //#endregion

      //#region Widget layouts
      widget: LF_SPINNER_LAYOUTS.reduce<{
        [example: string]: LfShowcaseExample<LfSpinnerPropsInterface>;
      }>((acc, layout: LfSpinnerLayout) => {
        return {
          ...acc,
          [layout]: {
            description: `Layout: ${layout}`,
            hasMinHeight: true,
            props: {
              lfActive: true,
              lfLayout: layout,
            },
          },
          [`${layout}Styled`]: {
            description: `Layout: ${layout} (styled)`,
            hasMinHeight: true,
            props: {
              lfActive: true,
              lfLayout: layout,
              lfStyle: randomStyle(),
            },
          },
        };
      }, {}),
      //#endregion

      //#region Icon layout examples
      icon: {
        camera: {
          description: "Icon: camera-shutter",
          hasMinHeight: true,
          props: {
            lfActive: true,
            lfIcon: "camera",
            lfLayout: "icon",
          },
        },
        refresh: {
          description: "Icon: refresh",
          hasMinHeight: true,
          props: {
            lfActive: true,
            lfIcon: "refresh",
            lfLayout: "icon",
          },
        },
        sync: {
          description: "Icon: sync",
          hasMinHeight: true,
          props: {
            lfActive: true,
            lfIcon: "refresh",
            lfLayout: "icon",
          },
        },
        loading: {
          description: "Icon: loading",
          hasMinHeight: true,
          props: {
            lfActive: true,
            lfIcon: "loader",
            lfLayout: "icon",
          },
        },
      },
      //#endregion
    },
  };
};

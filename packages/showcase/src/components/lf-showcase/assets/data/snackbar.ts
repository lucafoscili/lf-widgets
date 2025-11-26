import {
  LF_SNACKBAR_POSITIONS,
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfSnackbarPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomIcon,
  randomPhrase,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfSnackbar";
const EVENT_NAME: LfEventName<"LfSnackbar"> = "lf-snackbar-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfSnackbar"> = "LfSnackbarEventPayload";
const TAG_NAME: LfComponentTag<"LfSnackbar"> = "lf-snackbar";

export const getSnackbarFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-snackbar"> => {
  const { theme } = framework;
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
            "displays brief notification messages with optional action buttons at screen edges",
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
                type: "action",
                description: "emitted when action button is clicked",
              },
              {
                type: "close",
                description: "emitted when close button is clicked",
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
    //#region actions
    actions: {
      toggle: {
        command: async () => {
          const snackbar = document.createElement("lf-snackbar");
          snackbar.lfIcon = randomIcon(icons);
          snackbar.lfMessage = "This is a permanent snackbar notification.";
          snackbar.lfDuration = 0;
          snackbar.style.position = "fixed";
          document.body.appendChild(snackbar);
        },
        label: "Toggle snackbar",
      },
      toggleTemp: {
        command: async () => {
          const snackbar = document.createElement("lf-snackbar");
          snackbar.lfIcon = randomIcon(icons);
          snackbar.lfMessage = "This is a temporary snackbar (auto-dismiss).";
          snackbar.lfDuration = 5000;
          snackbar.style.position = "fixed";
          document.body.appendChild(snackbar);
        },
        label: "Toggle temporary snackbar",
      },
      toggleWithAction: {
        command: async () => {
          const snackbar = document.createElement("lf-snackbar");
          snackbar.lfMessage = "Item deleted";
          snackbar.lfAction = "Undo";
          snackbar.lfActionCallback = (sb) => {
            sb.lfMessage = "Undo action triggered!";
            sb.lfAction = undefined;
          };
          snackbar.style.position = "fixed";
          document.body.appendChild(snackbar);
        },
        label: "Toggle snackbar with action",
      },
    },
    //#endregion

    //#region configuration
    configuration: {
      columns: {
        uncategorized: 4,
        positions: 3,
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
          description: "Empty snackbar",
          props: {},
        },
        icon: {
          description: "Snackbar with icon",
          props: {
            lfIcon: randomIcon(icons),
          },
        },
        message: {
          description: "Snackbar with message",
          props: {
            lfMessage: randomPhrase(6, 15),
          },
        },
        iconMessage: {
          description: "Snackbar with icon and message",
          props: {
            lfIcon: randomIcon(icons),
            lfMessage: randomPhrase(6, 15),
          },
        },
        action: {
          description: "Snackbar with action button",
          props: {
            lfMessage: "Item removed",
            lfAction: "Undo",
            lfActionCallback: (snackbar) => {
              snackbar.lfMessage = `Undo action triggered! ${randomPhrase(3, 8)}`;
              snackbar.lfAction = undefined;
            },
          },
        },
        style: {
          description: "Snackbar with custom style",
          props: {
            lfMessage: randomPhrase(6, 15),
            lfStyle: randomStyle(),
          },
        },
        persistent: {
          description: "Persistent snackbar (no auto-dismiss)",
          props: {
            lfMessage: "Manual dismissal required",
            lfDuration: 0,
          },
        },
        closeCb: {
          description: "Snackbar with close callback",
          props: {
            lfMessage: "Try closing this snackbar",
            lfActionCallback: (snackbar) => {
              snackbar.lfMessage = `This snackbar should have been closed, here is a random message instead: 
                
                ${randomPhrase(6, 15)}`;
            },
          },
        },
      },
      //#endregion

      //#region Positions
      positions: LF_SNACKBAR_POSITIONS.reduce(
        (acc, position) => ({
          ...acc,
          [position]: {
            description: `Snackbar at ${position}`,
            props: {
              lfMessage: `Position: ${position}`,
              lfPosition: position,
            },
          },
        }),
        {} as {
          [example: string]: LfShowcaseExample<LfSnackbarPropsInterface>;
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
              description: `Snackbar with size: ${size}`,
              props: {
                lfMessage: size,
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfSnackbarPropsInterface>;
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
              description: `Snackbar in ${state} state`,
              props: {
                lfIcon: icon,
                lfMessage: state,
                lfUiState: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfSnackbarPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

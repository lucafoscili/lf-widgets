import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfEventName,
  LfEventPayloadName,
  LfThemeUISize,
  LfThemeUIState,
  LfToastPropsInterface,
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

const COMPONENT_NAME: LfComponentName = "LfToast";
const EVENT_NAME: LfEventName<"LfToast"> = "lf-toast-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfToast"> = "LfToastEventPayload";
const TAG_NAME: LfComponentTag<"LfToast"> = "lf-toast";

export const getToastFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-toast"> => {
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
            "is designed to display toast notifications",
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
    //#region actions
    actions: {
      toggle: {
        command: async () => {
          const toast = document.createElement("lf-toast");
          toast.lfIcon = randomIcon(icons);
          toast.lfMessage = "This is a permanent toast.";
          toast.style.height = "auto";
          toast.style.position = "fixed";
          toast.style.right = ".75em";
          toast.style.top = ".75em";
          toast.style.width = "auto";
          document.body.appendChild(toast);
        },
        label: "Toggle toast",
      },
      toggleTemp: {
        command: async () => {
          const toast = document.createElement("lf-toast");
          toast.lfIcon = randomIcon(icons);
          toast.lfMessage = "This is a temporary toast.";
          toast.lfTimer = 5000;
          toast.style.height = "auto";
          toast.style.position = "fixed";
          toast.style.right = ".75em";
          toast.style.top = ".75em";
          toast.style.width = "auto";
          document.body.appendChild(toast);
        },
        label: "Toggle temporary toast",
      },
    },
    //#endregion

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
        empty: {
          description: "Empty toast",
          props: {},
        },
        icon: {
          description: "Toast with icon",
          props: {
            lfIcon: randomIcon(icons),
          },
        },
        message: {
          description: "Toast with message",
          props: {
            lfMessage: randomPhrase(6, 15),
          },
        },
        iconMessage: {
          description: "Toast with icon and message",
          props: {
            lfIcon: randomIcon(icons),
            lfMessage: randomPhrase(6, 15),
          },
        },
        style: {
          description: "Toast with custom style",
          props: {
            lfMessage: randomPhrase(6, 15),
            lfStyle: randomStyle(),
          },
        },
        closeCb: {
          description: "Toast with close callback",
          props: {
            lfCloseCallback: (toast) => {
              toast.lfMessage = `This toast should have been closed, here is a random message instead: 
                
                ${randomPhrase(6, 15)}`;
            },
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
              description: `Toast with size: ${size}`,
              props: {
                lfMessage: size,
                lfUiSize: size,
                lfValue: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfToastPropsInterface>;
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
              description: `Toast in ${state} state`,
              props: {
                lfIcon: icon,
                lfMessage: state,
                lfUiState: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfToastPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

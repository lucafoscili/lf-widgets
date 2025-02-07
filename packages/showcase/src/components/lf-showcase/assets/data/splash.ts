import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfEventName,
  LfEventPayloadName,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfSplash";
const EVENT_NAME: LfEventName<"LfSplash"> = "lf-splash-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfSplash"> = "LfSplashEventPayload";
const TAG_NAME: LfComponentTag<"LfSplash"> = "lf-splash";

export const getSplashFixtures = (
  _framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-splash"> => {
  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is typically displayed as a splash screen when a user first arrives on a webpage to prevent the appearance of an incomplete page",
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
      customLabel: {
        command: async () => {
          const splash = document.createElement("lf-splash");
          splash.lfLabel = "This is a custom label!";
          splash.addEventListener("click", () => {
            splash.unmount();
          });

          document.body.appendChild(splash);
        },
        label: "With custom Label",
      },
      customStyle: {
        command: async () => {
          const splash = document.createElement("lf-splash");
          splash.lfStyle = ".splash { background: navy; color: white; }";
          splash.addEventListener("click", () => {
            splash.unmount();
          });

          document.body.appendChild(splash);
        },
        label: "With custom Style",
      },
      withSpinner: {
        command: async () => {
          const spinner = document.createElement("lf-spinner");
          spinner.lfActive = true;

          const splash = document.createElement("lf-splash");
          splash.appendChild(spinner);
          splash.addEventListener("click", () => {
            splash.unmount();
          });

          document.body.appendChild(splash);
        },
        label: "With spinner",
      },
    },
    //#endregion
    documentation,
    examples: {},
  };
};

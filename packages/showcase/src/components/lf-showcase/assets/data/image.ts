import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfEventName,
  LfEventPayloadName,
  LfImagePropsInterface,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomIcon, randomStyle } from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfImage";
const EVENT_NAME: LfEventName<"LfImage"> = "lf-image-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfImage"> = "LfImageEventPayload";
const TAG_NAME: LfComponentTag<"LfImage"> = "lf-image";

export const getImageFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-image"> => {
  const { assets, theme } = framework;
  const icons = Array.from(Object.values(theme.get.icons()));

  //#region mock data
  const image1 = assets.get(`./assets/showcase/dark.webp`).path;
  const image2 = assets.get(`./assets/showcase/light.webp`).path;
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
            "is designed to render images or icons based on a provided source or CSS variable",
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
                type: "click",
                description: "emitted when the component is clicked",
              },
              {
                type: "load",
                description: "emitted when the image is successfully loaded",
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
        icon: 3,
        image: 3,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Icon
      icon: {
        icon: {
          description: "Image component as icon",
          props: {
            lfSizeX: "128px",
            lfSizeY: "128px",
            lfValue: randomIcon(icons),
          },
        },
        style: {
          description: "Icon with custom style",
          props: {
            lfSizeX: "128px",
            lfSizeY: "128px",
            lfStyle: randomStyle(),
            lfValue: randomIcon(icons),
          },
        },
        error: {
          description: "Icon with unresolved source",
          props: {
            lfSizeX: "128px",
            lfSizeY: "128px",
            lfValue: "NOT_FOUND",
          },
        },
      },
      //#endregion

      //#region Image
      image: {
        cover: {
          description: "Image set as cover of a container (default behavior)",
          props: {
            lfSizeX: "256px",
            lfSizeY: "256px",
            lfValue: image1,
          },
        },
        fit: {
          description: "Image fitting a container",
          props: {
            lfSizeX: "256px",
            lfSizeY: "256px",
            lfStyle: ":host{ --lf-image-object-fit: contain; }",
            lfValue: image1,
          },
        },
        image: {
          description: "Image",
          props: {
            lfSizeY: "256px",
            lfValue: image2,
          },
        },
        style: {
          description: "Image with custom style",
          props: {
            lfStyle: randomStyle(),
            lfValue: image2,
          },
        },
        error: {
          description: "Image with unresolved source",
          props: {
            lfValue: "//:NOT_FOUND",
          },
        },
      },
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key, values]) => {
          const state = key as LfThemeUIState;
          const { icon, label } = values;

          return {
            ...acc,
            [state]: {
              description: `Icon in ${state} state`,
              props: {
                lfHtmlAttributes: {
                  title: `Icon in ${state} state`,
                },
                lfLabel: label.capitalized,
                lfSizeX: "128px",
                lfSizeY: "128px",
                lfUiState: state,
                lfValue: icon,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfImagePropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

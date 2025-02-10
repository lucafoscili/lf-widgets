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
import { randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfCanvas";
const EVENT_NAME: LfEventName<"LfCanvas"> = "lf-canvas-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfCanvas"> = "LfCanvasEventPayload";
const TAG_NAME: LfComponentTag<"LfCanvas"> = "lf-canvas";

export const getCanvasFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-canvas"> => {
  const { get } = framework.assets;

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "main purpose is to allow painting over an image. The actual canvasing must be done downstream, it just emits an event when a stroke is complete (from pointerdown to pointerup).",
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
                type: "stroke",
                description: "emitted after the pointer is released",
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
        uncategorized: 2,
        brush: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Canvas over image",
          props: {
            lfImageProps: {
              lfSizeX: "256px",
              lfSizeY: "256px",
              lfValue: get(`./assets/showcase/avatar_freya.png`).path,
            },
          },
        },
        style: {
          description: "Canvas over image with custom style",
          props: {
            lfImageProps: {
              lfSizeX: "256px",
              lfSizeY: "256px",
              lfStyle: randomStyle(),
              lfValue: get(`./assets/showcase/avatar_thor.png`).path,
            },
          },
        },
      },
      //#region

      //#region Brush
      brush: {
        square: {
          description: "Canvas with square brush",
          props: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/light.webp`).path,
            },
            lfBrush: "square",
          },
        },
        opacity: {
          description: "Canvas with brush opacity",
          props: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/dark.webp`).path,
            },
            lfOpacity: 0.5,
          },
        },
        size: {
          description: "Canvas with brush size",
          props: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/light.webp`).path,
            },
            lfSize: 128,
          },
        },
        stroke: {
          description: "Canvas stroke color",
          props: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/dark.webp`).path,
            },
            lfColor: "blue",
          },
        },
        defaultCursor: {
          description: "Canvas without preview cursor",
          props: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/light.webp`).path,
            },
            lfCursor: "default",
          },
        },
        noPreview: {
          description: "Canvas without preview stroke",
          props: {
            lfImageProps: {
              lfValue: get(`./assets/showcase/dark.webp`).path,
            },
            lfPreview: false,
          },
        },
      },
      //#endregion
    },
  };
};

import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfEventName,
  LfEventPayloadName,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomIcon, randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfPhotoframe";
const EVENT_NAME: LfEventName<"LfPhotoframe"> = "lf-photoframe-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfPhotoframe"> =
  "LfPhotoframeEventPayload";
const TAG_NAME: LfComponentTag<"LfPhotoframe"> = "lf-photoframe";

export const getPhotoframeFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-photoframe"> => {
  const { get } = core.assets;
  const icons = Object.values(core.theme.get.icons());

  //#region mock data
  const placeholder = get(`./assets/showcase/blur_color_splash.jpg`).path;
  const value = get(`./assets/showcase/color_splash.jpg`).path;
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
            "displays a photo only when it enters the viewport. Until then, a placeholder is displayed in its place",
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
        uncategorized: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Photoframe",
          props: {
            lfPlaceholder: {
              alt: null,
              src: placeholder,
            },
            lfValue: {
              alt: null,
              src: value,
            },
          },
        },
        overlay: {
          description: "Photoframe with overlay",
          props: {
            lfOverlay: {
              description: "Description",
              hideOnClick: true,
              icon: randomIcon(icons),
              title: "Title",
            },
            lfPlaceholder: {
              alt: null,
              src: placeholder,
            },
            lfValue: {
              alt: null,
              src: value,
            },
          },
        },
        style: {
          description: "Photoframe with custom style",
          props: {
            lfPlaceholder: {
              alt: null,
              src: placeholder,
            },
            lfStyle: randomStyle(),
            lfValue: {
              alt: null,
              src: value,
            },
          },
        },
      },
      //#endregion
    },
  };
};

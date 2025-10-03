import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfImageviewerLoadCallback,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfImageviewer";
const EVENT_NAME: LfEventName<"LfImageviewer"> = "lf-imageviewer-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfImageviewer"> =
  "LfImageviewerEventPayload";
const TAG_NAME: LfComponentTag<"LfImageviewer"> = "lf-imageviewer";

export const getImageviewerFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-imageviewer"> => {
  const { get } = framework.assets;

  //#region mock data
  const data: { [index: string]: LfDataDataset } = {
    lfDataset: {
      nodes: [
        {
          cells: {
            lfImage: {
              shape: "image",
              value: get(`./assets/showcase/avatar_thor_2.png`).path,
            },
          },
          id: "image_0",
          value: "Node 0",
        },
        {
          cells: {
            lfImage: {
              shape: "image",
              value: get(`./assets/showcase/location_forest.png`).path,
            },
          },
          id: "image_1",
          value: "Node 1",
        },
        {
          cells: {
            lfImage: {
              shape: "image",
              value: get(`./assets/showcase/avatar_freya.png`).path,
            },
          },
          id: "image_2",
          value: "Node 2",
        },
      ],
    },
    lfValue: {
      nodes: [
        {
          id: "basic_adjustments",
          value: "Basic Adjustments",
          icon: "settings",
          children: [
            {
              cells: {
                lfCode: {
                  shape: "code",
                  value:
                    '{"slider":[{"ariaLabel":"Clarity strength","defaultValue":"0.5","id":"clarity_strength","max":"5","min":"0","step":"0.1","title":"Controls the amount of contrast enhancement in midtones."},{"ariaLabel":"Sharpen amount","max":"5","min":"0","id":"sharpen_amount","defaultValue":"1.0","step":"0.1","title":"Controls how much sharpening is applied to the image."},{"ariaLabel":"Blur kernel size","max":"15","min":"1","id":"blur_kernel_size","defaultValue":"7","step":"2","title":"Controls the size of the Gaussian blur kernel. Higher values mean more smoothing."}]}',
                },
              },
              id: "clarity",
              value: "Clarity",
            },
          ],
        },
        {
          id: "creative_effects",
          value: "Creative Effects",
          icon: "palette",
          children: [
            {
              cells: {
                lfCode: {
                  shape: "code",
                  value: "{}",
                },
              },
              id: "vignette",
              value: "Vignette",
            },
          ],
        },
      ],
    },
  };

  const navigationTreeDataset: LfDataDataset = {
    nodes: [
      {
        id: "library",
        value: "Media Library",
        children: [
          {
            id: "library/portraits",
            value: "Portraits",
            children: [
              { id: "library/portraits/raw", value: "Raw Shots" },
              { id: "library/portraits/edited", value: "Edited" },
            ],
          },
          {
            id: "library/locations",
            value: "Locations",
            children: [
              { id: "library/locations/forest", value: "Forest" },
              { id: "library/locations/city", value: "City" },
            ],
          },
          {
            id: "library/concepts",
            value: "Concept Boards",
            children: [
              { id: "library/concepts/color", value: "Color Studies" },
              { id: "library/concepts/light", value: "Lighting" },
            ],
          },
        ],
      },
    ],
  };

  const navigationTreeGridDataset: LfDataDataset = {
    columns: [
      { id: "name", title: "Name" },
      { id: "items", title: "Items" },
      { id: "updated", title: "Updated" },
    ],
    nodes: [
      {
        id: "projects",
        value: "Projects",
        cells: {
          name: { shape: "text", value: "Projects" },
          items: { shape: "number", value: 12 },
          updated: { shape: "text", value: "2 days ago" },
        },
        children: [
          {
            id: "projects/alpha",
            value: "Project Alpha",
            cells: {
              name: { shape: "text", value: "Project Alpha" },
              items: { shape: "number", value: 5 },
              updated: { shape: "text", value: "Yesterday" },
            },
          },
          {
            id: "projects/beta",
            value: "Project Beta",
            cells: {
              name: { shape: "text", value: "Project Beta" },
              items: { shape: "number", value: 7 },
              updated: { shape: "text", value: "3 days ago" },
            },
          },
        ],
      },
      {
        id: "reviews",
        value: "Reviews",
        cells: {
          name: { shape: "text", value: "Reviews" },
          items: { shape: "number", value: 8 },
          updated: { shape: "text", value: "Today" },
        },
        children: [
          {
            id: "reviews/internal",
            value: "Internal",
            cells: {
              name: { shape: "text", value: "Internal" },
              items: { shape: "number", value: 3 },
              updated: { shape: "text", value: "4 hours ago" },
            },
          },
          {
            id: "reviews/client",
            value: "Client",
            cells: {
              name: { shape: "text", value: "Client" },
              items: { shape: "number", value: 5 },
              updated: { shape: "text", value: "Last week" },
            },
          },
        ],
      },
    ],
  };

  const loadImageDataset: LfImageviewerLoadCallback = async (
    imageviewer,
    _dir,
  ) => {
    imageviewer.lfDataset = data.lfDataset;
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
            "is handy when two components must be imageviewerd in order to spot differences",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              nodes: [
                {
                  value: "Node 1",
                  id: "0",
                  cells: {
                    lfImage: { lfValue: "url_of_image1" },
                  },
                },
                {
                  value: "Node 2",
                  id: "1",
                  cells: {
                    lfImage: { lfValue: "url_of_image2" },
                  },
                },
              ],
            }),
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
    documentation,

    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Simple imageviewer",
          props: {
            lfLoadCallback: loadImageDataset,
            lfValue: data.lfValue,
          },
        },
        style: {
          description: "Imageviewer with custom style",
          props: {
            lfLoadCallback: loadImageDataset,
            lfStyle: randomStyle(),
            lfValue: data.lfValue,
          },
        },
      },
      //#endregion

      //#region Positions
      positions: {
        start: {
          description: "Navigation tree docked to the start side",
          props: {
            lfLoadCallback: loadImageDataset,
            lfNavigationTree: true,
            lfTreeProps: {
              lfDataset: navigationTreeDataset,
            },
            lfValue: data.lfValue,
          },
        },
        endGrid: {
          description: "Navigation tree on the end side with grid layout",
          props: {
            lfLoadCallback: loadImageDataset,
            lfNavigationTree: {
              layout: {
                columns: 2,
                mode: "grid",
              },
              maxWidth: 420,
              minWidth: 260,
              position: "end",
              width: 340,
            },
            lfTreeProps: {
              lfDataset: navigationTreeGridDataset,
              lfFilter: true,
              lfGrid: true,
            },
            lfValue: data.lfValue,
          },
        },
      },
      //#endregion
    },
  };
};

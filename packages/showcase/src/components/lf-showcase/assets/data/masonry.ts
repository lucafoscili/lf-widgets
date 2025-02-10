import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomNumber, randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfMasonry";
const EVENT_NAME: LfEventName<"LfMasonry"> = "lf-masonry-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfMasonry"> = "LfMasonryEventPayload";
const TAG_NAME: LfComponentTag<"LfMasonry"> = "lf-masonry";

export const getMasonryFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-masonry"> => {
  const { get } = framework.assets;

  //#region mock data
  const data: Partial<{
    [K in LfComponentName]: () => LfDataDataset;
  }> = {
    LfCode: () => {
      return {
        nodes: [
          {
            cells: {
              lfCode: {
                lfLanguage: "jsx",
                shape: "code",
                value: `<div>
      <h1>Hello, JSX!</h1>
      <button onClick={() => alert('Clicked!')}>Click me</button>
    </div>`,
              },
            },
            id: "0",
          },
          {
            cells: {
              lfCode: {
                lfLanguage: "markdown",
                shape: "code",
                value: `# Markdown Example
    
    - **Bold** text
    - _Italic_ text
    - [Link to Google](https://google.com)`,
              },
            },
            id: "1",
          },
          {
            cells: {
              lfCode: {
                lfLanguage: "typescript",
                shape: "code",
                value: `type User = {
      id: number;
      name: string;
    };
    
    const getUser = (id: number): User => ({
      id,
      name: "John Doe",
    });`,
              },
            },
            id: "2",
          },
          {
            cells: {
              lfCode: {
                lfLanguage: "javascript",
                shape: "code",
                value: `function greet(name) {
      console.log(\`Hello, \${name}!\`);
    }
    
    greet("World");`,
              },
            },
            id: "3",
          },
          {
            cells: {
              lfCode: {
                lfLanguage: "python",
                shape: "code",
                value: `def greet(name):
        print(f"Hello, {name}!")
    
    greet("World")`,
              },
            },
            id: "4",
          },
        ],
      };
    },
    LfImage: () => {
      const imagesPaths = [
        get(`./assets/showcase/dark.webp`).path,
        get(`./assets/showcase/light.webp`).path,
        get(`./assets/showcase/avatar_thor.png`).path,
        get(`./assets/showcase/avatar_freya.png`).path,
        get(`./assets/showcase/avatar_freya_2.png`).path,
        get(`./assets/showcase/avatar_thor_2.png`).path,
        get(`./assets/showcase/outfit_armor_2.png`).path,
        get(`./assets/showcase/outfit_armor_3.png`).path,
        get(`./assets/showcase/location_forest.png`).path,
        get(`./assets/showcase/location_lake.png`).path,
        get(`./assets/showcase/blur_color_splash.jpg`).path,
        get(`./assets/showcase/color_splash.jpg`).path,
      ];
      return {
        nodes: imagesPaths.map((path, i) => ({
          cells: {
            lfImage: {
              shape: "image",
              value: path,
            },
          },
          id: `${i}`,
        })),
      };
    },
    LfPhotoframe: () => {
      const imagesPaths = [
        get(`./assets/showcase/blur_color_splash.jpg`).path,
        get(`./assets/showcase/color_splash.jpg`).path,
      ];
      return {
        nodes: Array.from({ length: randomNumber(5, 15) }).map((_, i) => ({
          cells: {
            lfPhotoframe: {
              lfPlaceholder: {
                src: imagesPaths[0],
              },
              lfValue: {
                src: imagesPaths[1],
              },
              shape: "photoframe",
              value: "",
            },
          },
          id: `${i}`,
          value: `${i}`,
        })),
      };
    },
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
            "is designed to arrange images in two different views: masonry and waterfall",
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
                type: "lf-event",
                description: "emitted by shapes",
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
      columns: { uncategorized: 3 },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Masonry with photoframes",
          props: {
            lfDataset: data.LfPhotoframe(),
            lfShape: "photoframe",
          },
        },
        selectable: {
          description: "Selectable masonry of images",
          props: {
            lfActions: true,
            lfDataset: data.LfImage(),
            lfSelectable: true,
          },
        },
        code: {
          description: "Vertical arrangement with code shapes",
          props: {
            lfView: "vertical",
            lfDataset: data.LfCode(),
            lfShape: "code",
          },
        },
        slot: {
          description: "Masonry composed of slots",
          props: {
            lfColumns: 2,
            lfDataset: {
              nodes: [
                {
                  cells: {
                    lfSlot: {
                      shape: "slot",
                      value: "slot-0",
                    },
                  },
                  id: "0",
                },
                {
                  cells: {
                    lfSlot: {
                      shape: "slot",
                      value: "slot-1",
                    },
                  },
                  id: "1",
                },
              ],
            },
            lfShape: "slot",
          },
          slots: ["slot-0", "slot-1"],
        },
        style: {
          description: "Masonry with custom style",
          props: {
            lfDataset: data.LfImage(),
            lfStyle: randomStyle(),
          },
        },
      },
      //#endregion
    },
  };
};

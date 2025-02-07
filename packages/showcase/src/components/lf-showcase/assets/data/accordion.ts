import {
  LF_THEME_UI_SIZES,
  LfAccordionPropsInterface,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfFrameworkInterface,
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

const COMPONENT_NAME: LfComponentName = "LfAccordion";
const EVENT_NAME: LfEventName<"LfAccordion"> = "lf-accordion-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfAccordion"> =
  "LfAccordionEventPayload";
const TAG_NAME: LfComponentTag<"LfAccordion"> = "lf-accordion";

export const getAccordionFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-accordion"> => {
  const { article, code, id, ikosaedr } = framework.theme.get.icons();

  //#region mock data
  const lfDataset: LfDataDataset = {
    nodes: [
      {
        cells: {
          lfCard: {
            lfDataset: {
              nodes: [
                {
                  cells: {
                    lfButton: { shape: "button", value: "" },
                    lfUpload: { shape: "upload", value: "" },
                  },
                  id: "0",
                  value: "Material card",
                },
              ],
            },
            lfLayout: "upload",
            shape: "card",
            value: "",
          },
        },
        description: "Click to show/hide the card",
        icon: id,
        id: "0",
        value: "Card",
      },
      {
        cells: {
          lfCode: {
            lfValue: "console.log('Hello, World!');",
            shape: "code",
            value: "",
          },
        },
        description: "Click to show/hide the code",
        icon: code,
        id: "1",
        value: "Code",
      },
      {
        cells: {
          lfSlot: {
            shape: "slot",
            value: "slot",
          },
        },
        description: "Click to show/hide the slot",
        icon: article,
        id: "2",
        value: "Slot",
      },
      {
        description: "Click to select this item",
        id: "3",
        value: "This item is empty but selectable",
        icon: ikosaedr,
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
            "allows users to toggle between hiding and showing large amounts of content",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              nodes: [
                { value: "Node 1", id: "0" },
                { value: "Node 2", id: "1" },
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
                type: "click",
                description: "emitted when a node is clicked",
              },
              {
                type: "lf-event",
                description: "emitted when a subcomponent is clicked",
              },
              {
                type: "pointerdown",
                description:
                  "emitted when as soon as a node is touched/clicked (before the click event)",
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
        uncategorized: 2,
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Simple accordion",
          props: { lfDataset },
          slots: ["slot"],
        },
        style: {
          description: "Accordion with custom style",
          props: { lfDataset, lfStyle: randomStyle() },
          slots: ["slot"],
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
              description: `Accordion with size ${size}`,
              props: {
                lfDataset: {
                  nodes: [
                    {
                      description: `Click to select this item, its size is set to '${size}'.`,
                      id: "0",
                      value: size,
                    },
                  ],
                },
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfAccordionPropsInterface>;
        },
      ),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(framework.theme)).reduce(
        (acc, [key, values]) => {
          const state = key as LfThemeUIState;
          const { icon } = values;

          return {
            ...acc,
            [state]: {
              description: `Accordion in ${state} state`,
              props: {
                lfDataset: {
                  nodes: [
                    {
                      icon,
                      description: `Click to select this item, its color is set to '${state}'.`,
                      id: "0",
                      value: `UI ${state} color`,
                    },
                  ],
                },
                lfUiState: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfAccordionPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

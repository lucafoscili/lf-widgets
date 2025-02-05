import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfThemeUISize,
  LfTreePropsInterface,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomBoolean,
  randomIcon,
  randomNumber,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfTree";
const EVENT_NAME: LfEventName<"LfTree"> = "lf-tree-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfTree"> = "LfTreeEventPayload";
const TAG_NAME: LfComponentTag<"LfTree"> = "lf-tree";

export const getTreeFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-tree"> => {
  const { theme } = core;
  const icons = Object.values(theme.get.icons());

  //#region mock data
  const lfDataset: LfDataDataset = {
    nodes: Array.from({ length: randomNumber(5, 15) }, (_, i) => ({
      icon: randomBoolean() ? randomIcon(icons) : undefined,
      id: i.toString(),
      value: `Node ${i}`,
      children: Array.from({ length: randomNumber(1, 5) }, (_, j) => ({
        icon: randomBoolean() ? randomIcon(icons) : undefined,
        id: `${i}.${j}`,
        value: `Node ${i}.${j}`,
        children: Array.from({ length: randomNumber(1, 5) }, (_, k) => ({
          icon: randomBoolean() ? randomIcon(icons) : undefined,
          id: `${i}.${j}.${k}`,
          value: `Node ${i}.${j}.${k}`,
          children: Array.from({ length: randomNumber(1, 5) }, (_, l) => ({
            icon: randomBoolean() ? randomIcon(icons) : undefined,
            id: `${i}.${j}.${k}.${l}`,
            value: `Node ${i}.${j}.${k}.${l}`,
          })),
        })),
      })),
    })),
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
            "is designed to render a tree based on a JSON structure",
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
                description: "emitted when the component is clicked",
              },
              {
                type: "lf-event",
                description: "wraps a subcomponent event",
              },
              {
                type: "pointerdown",
                description:
                  "emitted when as soon as the component is touched/clicked (before the click event)",
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
        sizes: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        empty: {
          description: "Empty tree",
          props: {},
        },
        collapsed: {
          description: "Tree collapsed when rendered",
          props: {
            lfAccordionLayout: false,
            lfDataset,
            lfInitialExpansionDepth: 0,
            lfSelectable: false,
          },
        },
        noFilter: {
          description: "Tree without filter",
          props: {
            lfAccordionLayout: false,
            lfDataset,
            lfFilter: false,
            lfSelectable: false,
          },
        },
        selectable: {
          description: "Selectable tree",
          props: {
            lfAccordionLayout: false,
            lfDataset,
            lfSelectable: true,
          },
        },
        accordion: {
          description: "Tree with accordion layout",
          props: {
            lfAccordionLayout: true,
            lfDataset,
            lfSelectable: false,
          },
        },
        style: {
          description: "Tree with custom styling",
          props: {
            lfAccordionLayout: false,
            lfDataset,
            lfSelectable: false,
            lfStyle: randomStyle(),
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
              description: `Tree with size: ${size}`,
              props: {
                lfAccordionLayout: false,
                lfDataset,
                lfUiSize: size,
                lfValue: randomBoolean(),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfTreePropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

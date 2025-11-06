import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfChipPropsInterface,
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
import {
  randomBoolean,
  randomIcon,
  randomNumber,
  randomString,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfChip";
const EVENT_NAME: LfEventName<"LfChip"> = "lf-chip-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfChip"> = "LfChipEventPayload";
const TAG_NAME: LfComponentTag<"LfChip"> = "lf-chip";

export const getChipFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-chip"> => {
  const { theme } = framework;
  const iconValues = Object.values(theme.get.icons());

  //#region mock data
  const lfDataset: LfDataDataset = {
    nodes: Array.from({ length: randomNumber(3, 7) }, (_, i) => ({
      id: `${i}`,
      value: randomString(),
      icon: randomBoolean() && randomIcon(iconValues),
    })),
  };

  const lfTreeData: LfDataDataset = {
    nodes: Array.from({ length: randomNumber(3, 7) }, (_, i) => ({
      id: `000${i}`,
      value: `Depth 0 (${i})`,
      icon: randomBoolean() && randomIcon(iconValues),
      children: Array.from({ length: randomNumber(1, 3) }, (_, j) => ({
        id: `000${i}${j}`,
        value: `Depth 1 (${j})`,
        icon: randomBoolean() && randomIcon(iconValues),
        children: Array.from({ length: randomNumber(1, 3) }, (_, k) => ({
          id: `000${i}${j}${k}`,
          value: `Depth 2 (${k})`,
          icon: randomBoolean() && randomIcon(iconValues),
          children: Array.from({ length: randomNumber(1, 3) }, (_, l) => ({
            id: `000${i}${j}${k}${l}`,
            value: `Depth 3 (${l})`,
            icon: randomBoolean() && randomIcon(iconValues),
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
            "features a tree-like data visualization with selectable or removable nodes. Supports spinner indicators for loading states and flat mode for seamless toolbar integration.",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify(lfDataset),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "blur",
                description: "emitted when the component loses focus",
              },
              {
                type: "click",
                description: "emitted when the component is clicked",
              },
              {
                type: "delete",
                description: "emitted when the a node is deleted",
              },
              {
                type: "focus",
                description: "emitted when the component is focused",
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
        choice: 3,
        sizes: 3,
        states: 3,
        filter: 3,
        input: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        children: {
          description: "Chip with children",
          props: {
            lfDataset: lfTreeData,
          },
        },
        standard: {
          description: "Standard chip",
          props: {
            lfDataset,
          },
        },
        style: {
          description: "Chip with custom style",
          props: {
            lfDataset,
            lfStyle: randomStyle(),
          },
        },
        spinner: {
          description: "Chip with spinner enabled",
          props: {
            lfDataset,
            lfShowSpinner: true,
          },
        },
        flat: {
          description: "Chip in flat mode (no background/border)",
          props: {
            lfDataset,
            lfFlat: true,
          },
        },
        flatWithSpinner: {
          description: "Flat chip with spinner",
          props: {
            lfDataset,
            lfFlat: true,
            lfShowSpinner: true,
          },
        },
      },
      //#endregion

      //#region Choice
      choice: {
        simple: {
          description: "Choice chip",
          props: {
            lfDataset,
            lfStyling: "choice",
          },
        },
        withValue: {
          description: "Choice chip with value",
          props: {
            lfDataset,
            lfStyling: "choice",
            lfValue: lfDataset.nodes.map((node) => node.id),
          },
        },
      },
      //#endregion

      //#region Filter
      filter: {
        simple: {
          description: "Filter chip",
          props: {
            lfDataset,
            lfStyling: "filter",
          },
        },
        withValue: {
          description: "Filter chip with value",
          props: {
            lfDataset,
            lfStyling: "filter",
            lfValue: lfDataset.nodes.map((node) => node.id),
          },
        },
      },
      //#endregion

      //#region Input
      input: {
        simple: {
          description: "Input chips",
          props: {
            lfDataset: JSON.parse(JSON.stringify(lfDataset)),
            lfStyling: "input",
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
              description: `Chip with size ${size}`,
              props: {
                lfDataset,
                lfStyling: "choice",
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfChipPropsInterface>;
        },
      ),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key]) => {
          const state = key as LfThemeUIState;
          return {
            ...acc,
            [state]: {
              description: `Chip in ${state} state`,
              props: {
                lfDataset,
                lfStyling: "choice",
                lfUiState: state,
                lfValue: lfDataset.nodes.map((node) => node.id),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfChipPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

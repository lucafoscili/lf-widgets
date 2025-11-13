import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfListPropsInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomBoolean,
  randomIcon,
  randomNumber,
  randomPhrase,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfList";
const EVENT_NAME: LfEventName<"LfList"> = "lf-list-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfList"> = "LfListEventPayload";
const TAG_NAME: LfComponentTag<"LfList"> = "lf-list";

export const getListFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-list"> => {
  const { theme } = framework;
  const icons = Object.values(theme.get.icons());

  //#region mock data
  const lfDataset: LfDataDataset = {
    nodes: Array.from({ length: randomNumber(2, 8) }).map((_, i) => ({
      description: randomBoolean() ? randomPhrase() : undefined,
      icon: randomBoolean() ? randomIcon(icons) : undefined,
      id: `${i}`,
      value: randomPhrase(),
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
            "is used to display a list of items vertically",
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
      columns: { uncategorized: 3, sizes: 4, states: 4 },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Empty list",
          props: { lfEmpty: "No items to display" },
        },
        enableDeletion: {
          description: "Selectable list with deletable items",
          props: {
            lfDataset,
            lfEnableDeletions: true,
            lfSelectable: true,
          },
        },
        navigation: {
          description: "List with keyboard navigation",
          props: {
            lfDataset,
            lfNavigation: true,
          },
        },
        unselectable: {
          description: "List with unselectable items",
          props: {
            lfDataset,
            lfSelectable: false,
          },
        },
        style: {
          description: "List with custom style",
          props: {
            lfDataset,
            lfStyle: randomStyle(),
          },
        },
        filterEnabled: {
          description: "List with filter functionality enabled",
          props: {
            lfDataset,
            lfFilter: true,
          },
        },
        filterAndSelectable: {
          description: "Filterable and selectable list",
          props: {
            lfDataset,
            lfFilter: true,
            lfSelectable: true,
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
              description: `List with size ${size}`,
              props: {
                lfDataset,
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfListPropsInterface>;
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
              description: `List in ${state} state`,
              props: {
                lfDataset,
                lfUiState: state,
                lfValue: randomNumber(0, lfDataset.nodes.length - 1),
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfListPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

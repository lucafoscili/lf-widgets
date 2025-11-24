import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfBreadcrumbsPropsInterface,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfThemeUISize,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfBreadcrumbs";
const EVENT_NAME: LfEventName<"LfBreadcrumbs"> = "lf-breadcrumbs-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfBreadcrumbs"> =
  "LfBreadcrumbsEventPayload";
const TAG_NAME: LfComponentTag<"LfBreadcrumbs"> = "lf-breadcrumbs";

const baseDataset: LfDataDataset = {
  nodes: [
    {
      id: "home",
      value: "Home",
      children: [
        {
          id: "products",
          value: "Products",
          children: [
            {
              id: "electronics",
              value: "Electronics",
              children: [
                { id: "phones", value: "Phones" },
                { id: "laptops", value: "Laptops" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const deepDataset: LfDataDataset = {
  nodes: [
    {
      id: "root",
      value: "Root",
      children: [
        {
          id: "level1",
          value: "Level 1",
          children: [
            {
              id: "level2",
              value: "Level 2",
              children: [
                {
                  id: "level3",
                  value: "Level 3",
                  children: [
                    {
                      id: "level4",
                      value: "Level 4",
                      children: [{ id: "level5", value: "Level 5" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const iconDataset: LfDataDataset = {
  nodes: [
    {
      id: "dashboard",
      value: "Dashboard",
      cells: { icon: { shape: "image", value: "home" } },
      children: [
        {
          id: "settings",
          value: "Settings",
          cells: { icon: { shape: "image", value: "settings" } },
          children: [
            {
              id: "profile",
              value: "Profile",
              cells: { icon: { shape: "image", value: "user" } },
            },
          ],
        },
      ],
    },
  ],
};

export const getBreadcrumbsFixtures = (
  _framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-breadcrumbs"> => {
  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "renders a navigation trail from a hierarchical dataset",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify(baseDataset),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "click",
                description: "emitted when a breadcrumb segment is activated",
              },
              {
                type: "lf-event",
                description: "forwarded shape events from icon cells",
              },
              {
                type: "ready",
                description: "emitted when the component is ready",
              },
              {
                type: "unmount",
                description:
                  "emitted when the component is about to be removed",
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
    configuration: {
      columns: {
        uncategorized: 3,
        sizes: 3,
      },
    },
    documentation,
    examples: {
      uncategorized: {
        basic: {
          description: "Default separator with full path",
          props: {
            lfDataset: baseDataset,
            lfCurrentNodeId: "phones",
          },
        },
        customSeparator: {
          description: "Uses a slash separator",
          props: {
            lfDataset: baseDataset,
            lfCurrentNodeId: "laptops",
            lfSeparator: "/",
          },
        },
        hideRoot: {
          description: "Hides the root node from the trail",
          props: {
            lfDataset: baseDataset,
            lfCurrentNodeId: "electronics",
            lfShowRoot: false,
          },
        },
        truncation: {
          description: "Truncates long paths with an ellipsis",
          props: {
            lfDataset: deepDataset,
            lfCurrentNodeId: "level5",
            lfMaxItems: 3,
          },
        },
        nonInteractive: {
          description: "Shows a static trail without clicks",
          props: {
            lfDataset: baseDataset,
            lfCurrentNodeId: "phones",
            lfInteractive: false,
          },
        },
        ripple: {
          description: "Enables ripple effect on click",
          props: {
            lfDataset: baseDataset,
            lfCurrentNodeId: "phones",
            lfRipple: true,
          },
        },
        icons: {
          description: "Displays icons via shape cells",
          props: {
            lfDataset: iconDataset,
            lfCurrentNodeId: "profile",
          },
        },
        styled: {
          description: "Custom style injected via lfStyle",
          props: {
            lfDataset: baseDataset,
            lfCurrentNodeId: "phones",
            lfStyle: randomStyle(),
          },
        },
      },
      sizes: LF_THEME_UI_SIZES.reduce(
        (acc, key) => {
          const size = key as LfThemeUISize;
          return {
            ...acc,
            [size]: {
              description: `Breadcrumbs with size ${size}`,
              props: {
                lfDataset: baseDataset,
                lfCurrentNodeId: "phones",
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfBreadcrumbsPropsInterface>;
        },
      ),
    },
  };
};

import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Portal";

export const getPortalFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "close",
      {
        code: "portal.close(elementToPortal);",
        description:
          "Closes the portal element by cleaning and resetting its style.",
      },
    ],
    [
      "getState",
      {
        code: "const state = portal.getState(elementToPortal);",
        description:
          "Retrieves the state associated with the given HTML element.",
      },
    ],
    [
      "isInPortal",
      {
        code: "const isInPortal = portal.isInPortal(elementToPortal);",
        description:
          "Checks if the given HTML element is registered within the portal manager.",
      },
    ],
    [
      "open",
      {
        code: "portal.open(elementToPortal, parentElement, anchorElement, 10, 'top');",
        description:
          "Opens a portal element and positions it according to the specified parameters.",
      },
    ],
  ]);
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: FRAMEWORK_NAME,
        children: [
          {
            id: DOC_IDS.section,
            value: "Overview",
            children: [
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "LfPortal",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "Manages portal elements in the DOM, handling their positioning and lifecycle.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "A portal is a container that can hold and position elements relative to specified anchor points.",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
            ],
          },
          {
            id: DOC_IDS.section,
            value: "API",
            children: Array.from(CODE.keys()).map((key) =>
              PARAGRAPH_FACTORY.api(
                key,
                CODE.get(key).description,
                CODE.get(key).code!,
              ),
            ),
          },
        ],
      },
    ],
  };
  //#endregion

  return {
    documentation,
  };
};

import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Effects";

export const getEffectsFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "backdrop.show",
      {
        code: "lfEffects.backdrop.show(() => { console.log('Backdrop shown!'); });",
        description: "Shows a backdrop element.",
      },
    ],
    [
      "backdrop.hide",
      {
        code: "lfEffects.backdrop.hide();",
        description: "Hides the backdrop element.",
      },
    ],
    [
      "backdrop.isVisible",
      {
        code: "const isVisible = lfEffects.backdrop.isVisible();",
        description:
          "Returns a boolean indicating whether the backdrop is visible.",
      },
    ],
    [
      "lightbox.show",
      {
        code: "lfEffects.lightbox.show(element);",
        description: "Shows a lightbox element.",
      },
    ],
    [
      "lightbox.hide",
      {
        code: "lfEffects.lightbox.hide();",
        description: "Hides the lightbox element.",
      },
    ],
    [
      "lightbox.isVisible",
      {
        code: "const isVisible = lfEffects.lightbox.isVisible();",
        description:
          "Returns a boolean indicating whether the lightbox is visible.",
      },
    ],
    [
      "ripple",
      {
        code: "lfEffects.ripple(event, element);",
        description: "Creates a ripple effect.",
      },
    ],
    [
      "register.tilt",
      {
        code: "lfEffects.register.tilt(element);",
        description: "Registers a tilt effect.",
      },
    ],
    [
      "unregister.tilt",
      {
        code: "lfEffects.unregister.tilt(element);",
        description: "Unregisters a tilt effect.",
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
                    value: "LfEffects",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " is a utility class for handling a variety of UI effects.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "It provides methods for creating and managing backdrop, lightbox, ripple, and tilt effects.",
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

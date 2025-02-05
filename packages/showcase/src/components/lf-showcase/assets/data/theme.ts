import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Theme";

export const getThemeFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "bemClass",
      {
        code: `const className = themeManager.bemClass(
  'button', 
  'icon', 
  { active: true }
); 
// Returns: 'button__icon button__icon--active'`,
        description:
          "Generates a BEM (Block Element Modifier) class name string.",
      },
    ],
    [
      "get",
      {
        code: `const theme = themeManager.get.current(); 
// Returns the current theme object`,
        description: "Returns the current theme object.",
      },
    ],
    [
      "icons",
      {
        code: `const icons = themeManager.get.icons(); 
// Returns the theme's icon registry`,
        description: "Returns the theme's icon registry.",
      },
    ],
    [
      "randomize",
      {
        code: `themeManager.randomize(); 
// Randomly sets a theme from the available themes list`,
        description: "Randomly sets a theme from the available themes list.",
      },
    ],
    [
      "refresh",
      {
        code: `themeManager.refresh(); 
// Refreshes the current theme by updating CSS custom properties and icons in the document`,
        description:
          "Refreshes the current theme by updating CSS custom properties and icons in the document.",
      },
    ],
    [
      "register",
      {
        code: `themeManager.register(component); 
// Registers a component to the theme registry`,
        description: "Registers a component to the theme registry.",
      },
    ],
    [
      "set",
      {
        code: `themeManager.set('dark'); 
// Sets theme parameters and applies them to the document`,
        description: "Sets theme parameters and applies them to the document.",
      },
    ],
    [
      "unregister",
      {
        code: `themeManager.unregister(component); 
// Unregisters a component from the theme manager`,
        description: "Unregisters a component from the theme manager.",
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
                    value: "LfTheme",
                  },
                  {
                    id: DOC_IDS.content,
                    value: " is a class responsible for managing themes.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "It provides utilities for setting, refreshing, and randomizing themes.",
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
                CODE.get(key)?.description ?? "",
                CODE.get(key)?.code ?? "",
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

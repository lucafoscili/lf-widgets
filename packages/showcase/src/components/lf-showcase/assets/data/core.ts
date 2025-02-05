import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Core";

export const getCoreFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "addClickCallback",
      {
        code: `manager.addClickCallback(() => console.log("Click!")); 
// Adds a click callback`,
        description:
          "The `addClickCallback` method registers a global click event listener, useful for handling actions like closing a modal.",
      },
    ],
    [
      "removeClickCallback",
      {
        code: `manager.removeClickCallback(() => console.log("Click!")); 
// Removes a click callback`,
        description:
          "The `removeClickCallback` method removes a previously registered click event listener.",
      },
    ],
    [
      "sanitizeProps",
      {
        code: `const props = { 
  style: "color: red", 
  onClick: () => console.log("Click!") 
};

const sanitizedProps = manager.sanitizeProps(props); 
// Removes 'onClick' attribute to prevent unwanted behaviors`,
        description:
          "The `sanitizeProps` method filters out potentially malicious or disallowed attributes from a props object to enhance security.",
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
                    value: "LfCore",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " is a core manager class for the LF Widgets library. It handles various aspects of the library, including assets, colors, data management, debugging, portal management, theming, and utility functions.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "The core module and its submodules provide a comprehensive set of tools for managing and manipulating data, assets, and UI elements in a component-agnostic manner.",
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

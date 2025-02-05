import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Debug";

export const getDebugFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "logs.new",
      {
        code: `debugManager.logs.new(
  comp, 
  \`Render #\${comp.debugInfo.renderCount} took \${comp.debugInfo.renderEnd - comp.debugInfo.renderStart} ms.\`
); // Creates a new debug log entry`,
        description:
          "The `logs.new` method creates and stores a new debug log entry.",
      },
    ],
    [
      "logs.print",
      {
        code: `debugManager.logs.print(); 
// Prints all stored logs grouped by type to the console`,
        description:
          "The `logs.print` method prints all stored logs grouped by type (`load`, `misc`, `render`, `resize`) to the console.",
      },
    ],
    [
      "register",
      {
        code: `debugManager.register(component); 
// Registers a component for debugging`,
        description:
          "The `register` method registers a component to be managed by the debug system.",
      },
    ],
    [
      "toggle",
      {
        code: `debugManager.toggle(true); 
// Toggles the debug mode on`,
        description: "The `toggle` method toggles the debug mode on/off.",
      },
    ],
    [
      "unregister",
      {
        code: `debugManager.unregister(component); 
// Unregisters a component from the debug manager`,
        description:
          "The `unregister` method unregisters a component from the debug manager.",
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
                    value: "LfDebug",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " is a class responsible for managing debugging functionality.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "It handles debug logs, component registration, and debug state management.",
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

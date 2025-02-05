import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Drag";

export const getDragFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "dragToDrop",
      {
        code: `lfDrag.register.dragToDrop(element, { 
  onStart: (e, session) => { console.log("Drag started!"); }, 
  onMove: (e, session) => { console.log("Dragging..."); }, 
  onEnd: (e, session) => { console.log("Drag ended!"); } 
});`,
        description: "Registers a skeleton for drag-to-drop.",
      },
    ],
    [
      "dragToResize",
      {
        code: `lfDrag.register.dragToResize(element, { 
  onStart: (e, session) => { console.log("Drag started!"); }, 
  onMove: (e, session) => { console.log("Dragging..."); }, 
  onEnd: (e, session) => { console.log("Drag ended!"); } 
});`,
        description: "Registers a skeleton for drag-to-resize.",
      },
    ],
    [
      "dragToScroll",
      {
        code: `lfDrag.register.dragToScroll(element, { 
  onStart: (e, session) => { console.log("Drag started!"); }, 
  onMove: (e, session) => { console.log("Dragging..."); }, 
  onEnd: (e, session) => { console.log("Drag ended!"); } 
}, "x");`,
        description: "Registers drag-to-scroll behavior for the element.",
      },
    ],
    [
      "customDrag",
      {
        code: `lfDrag.register.customDrag(element, 
  (e, session) => { console.log("Custom drag started!"); }, 
  { 
    onMove: (e, session) => { console.log("Custom dragging..."); }, 
    onEnd: (e, session) => { console.log("Custom drag ended!"); } 
  }
);`,
        description: "Registers a custom drag behavior.",
      },
    ],
    [
      "unregister",
      {
        code: `lfDrag.unregister.all(element); 
// Unregisters all drag behaviors from an element`,
        description: "Unregisters various drag behaviors from an element.",
      },
    ],
    [
      "getActiveSession",
      {
        code: `const session = lfDrag.getActiveSession(element); 
// Gets the active session for an element`,
        description:
          "Public API to get the active session for an element, if any.",
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
                    value: "LfDrag",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " is a class responsible for managing drag-and-drop functionality.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "It provides utilities for handling drag sessions, thresholds, and custom drag behaviors.",
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

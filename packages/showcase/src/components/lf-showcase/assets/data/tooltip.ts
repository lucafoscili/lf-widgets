import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Tooltip";

export const getTooltipFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "register",
      {
        code: `const element = document.getElementById('myElement');
const tooltipId = framework.tooltip.register(
  element, 
  'This is a helpful tooltip message',
  { placement: 'top', offset: 8 }
);
// Returns a unique tooltip ID for later unregistration`,
        description:
          "The `register` method attaches a tooltip to an HTML element with customizable positioning and content.",
      },
    ],
    [
      "unregister",
      {
        code: `framework.tooltip.unregister(element);
// Removes the tooltip from the specified element`,
        description:
          "The `unregister` method removes a tooltip from an element and cleans up event listeners.",
      },
    ],
    [
      "placement-options",
      {
        code: `// Available placement options
framework.tooltip.register(element, 'Tooltip text', { 
  placement: 'top'    // Positions above the element
});

framework.tooltip.register(element, 'Tooltip text', { 
  placement: 'right'  // Positions to the right
});

framework.tooltip.register(element, 'Tooltip text', { 
  placement: 'bottom' // Positions below the element
});

framework.tooltip.register(element, 'Tooltip text', { 
  placement: 'left'   // Positions to the left
});`,
        description:
          "Tooltips support four placement options with automatic viewport boundary detection and flipping.",
      },
    ],
    [
      "advanced-options",
      {
        code: `framework.tooltip.register(element, 'Tooltip content', {
  placement: 'top',
  offset: 12,        // Distance from element in pixels
  maxWidth: 200,     // Maximum tooltip width
  showDelay: 300,    // Delay before showing (ms)
  hideDelay: 100     // Delay before hiding (ms)
});`,
        description:
          "Advanced configuration options for fine-tuning tooltip behavior and appearance.",
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
                    value: "LfTooltip",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " provides a fire-and-forget tooltip system for displaying contextual help and information overlays.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "Tooltips automatically position themselves with smart viewport boundary detection, supporting four placement options (top, right, bottom, left) with automatic flipping when needed.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "The system uses a WeakMap for efficient element tracking and automatically handles mouse enter/leave events for show/hide behavior.",
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

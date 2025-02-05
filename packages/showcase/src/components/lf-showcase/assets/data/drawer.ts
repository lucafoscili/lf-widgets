import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfEventName,
  LfEventPayloadName,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { LfShowcase } from "../../lf-showcase";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfDrawer";
const EVENT_NAME: LfEventName<"LfDrawer"> = "lf-drawer-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfDrawer"> = "LfDrawerEventPayload";
const TAG_NAME: LfComponentTag<"LfDrawer"> = "lf-drawer";

export const getDrawerFixtures = (
  showcase: LfShowcase,
): LfShowcaseComponentFixture<"lf-drawer"> => {
  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is a simple element designed to be a side menu of an application, its content is set by a slot",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "close",
                description: "emitted when the drawer gets closed",
              },
              {
                type: "open",
                description: "emitted when the drawer gets opened",
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
    actions: {
      toggle: {
        command: async () => (showcase.lfDrawer = !showcase.lfDrawer),
        label: "Toggle!",
      },
    },
    documentation,
    examples: {},
  };
};

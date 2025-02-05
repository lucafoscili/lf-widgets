import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfEventName,
  LfEventPayloadName,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfPlaceholder";
const EVENT_NAME: LfEventName<"LfPlaceholder"> = "lf-placeholder-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfPlaceholder"> =
  "LfPlaceholderEventPayload";
const TAG_NAME: LfComponentTag<"LfPlaceholder"> = "lf-placeholder";

export const getPlaceholderFixtures = (
  core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-placeholder"> => {
  const { get } = core.assets;

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "main purpose is to prevent long page loading times, displaying a placeholder until it's relevant to switch to the actual component",
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
                type: "lf-event",
                description: "wraps a subcomponent event",
              },
              {
                type: "load",
                description:
                  "emitted when the subcomponent is successfully loaded",
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
    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        noProps: {
          description: "Placeholder component without props",
          props: {
            lfProps: null,
            lfStyle: ":host { --lf-placeholder-height: 128px; }",
            lfValue: "LfButton",
          },
        },
        threshold: {
          description: "Placeholder component with threshold of 0.75",
          props: {
            lfProps: { lfValue: get(`./assets/media/dark.webp`).path },
            lfThreshold: 0.75,
            lfValue: "LfImage",
          },
        },
        simple: {
          description: "Placeholder component rendering a button",
          props: {
            lfProps: { lfLabel: "Lazy-loaded button", lfStretchX: true },
            lfValue: "LfButton",
          },
        },
        style: {
          description:
            "Placeholder component with custom style rendering a button ",
          props: {
            lfProps: { lfLabel: "Lazy-loaded button", lfStretchX: true },
            lfStyle: randomStyle(),
            lfValue: "LfButton",
          },
        },
      },
      //#endregion
    },
  };
};

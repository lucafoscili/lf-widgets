import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfEventName,
  LfEventPayloadName,
  LfSpinnerPropsInterface,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfSpinner";
const EVENT_NAME: LfEventName<"LfSpinner"> = "lf-spinner-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfSpinner"> = "LfSpinnerEventPayload";
const TAG_NAME: LfComponentTag<"LfSpinner"> = "lf-spinner";

export const getSpinnerFixtures = (
  _core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-spinner"> => {
  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is designed to render pure CSS spinners that can be used to give the user feedback that a process is currently running",
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
    //#region configuration
    configuration: {
      columns: {
        bar: 3,
        widget: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Bar
      bar: Array.from({ length: 3 }).reduce<{
        [example: string]: LfShowcaseExample<LfSpinnerPropsInterface>;
      }>((acc, _, index) => {
        return {
          ...acc,
          [index + 1]: {
            description: `Layout ${index + 1}`,
            hasMinHeight: true,
            props: {
              lfActive: true,
              lfBarVariant: true,
              lfDimensions: "7px",
              lfLayout: index + 1,
            },
          },
        };
      }, {}),
      //#endregion

      //#region Widget
      widget: Array.from({ length: 13 }).reduce<{
        [example: string]: LfShowcaseExample<LfSpinnerPropsInterface>;
      }>((acc, _, index) => {
        return {
          ...acc,
          [index + 1]: {
            description: `Layout ${index + 1}`,
            hasMinHeight: true,
            props: {
              lfActive: true,
              lfDimensions: "7px",
              lfLayout: index + 1,
            },
          },
          ["style" + index]: {
            description: `Layout ${index + 1} (with custom style)`,
            hasMinHeight: true,
            props: {
              lfActive: true,
              lfDimensions: "7px",
              lfLayout: index + 1,
              lfStyle: randomStyle(),
            },
          },
        };
      }, {}),
      //#endregion
    },
  };
};

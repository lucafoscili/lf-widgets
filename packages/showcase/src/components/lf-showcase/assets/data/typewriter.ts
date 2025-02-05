import {
  LF_THEME_UI_SIZES,
  LF_TYPEWRITER_TAGS,
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfCoreInterface,
  LfEventName,
  LfEventPayloadName,
  LfThemeUISize,
  LfTypewriterPropsInterface,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import {
  randomNumber,
  randomPhrase,
  randomStyle,
} from "../../helpers/fixtures.helpers";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfTypewriter";
const EVENT_NAME: LfEventName<"LfTypewriter"> = "lf-typewriter-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfTypewriter"> =
  "LfTypewriterEventPayload";
const TAG_NAME: LfComponentTag<"LfTypewriter"> = "lf-typewriter";

export const getTypewriterFixtures = (
  _core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-typewriter"> => {
  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is designed to simulate the behavior of a typewriter, by writing text dynamically after a customizable amount of time has passed between each letter",
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
        uncategorized: 4,
        tags: 4,
        sizes: 4,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        empty: {
          description: "Emtpy typewriter",
          props: {},
        },
        single: {
          description: "Typewriter with a single phrase",
          props: {
            lfValue: randomPhrase(15, 30),
          },
        },
        multiple: {
          description: "Typewriter with multiple phrases",
          props: {
            lfValue: Array.from({ length: randomNumber(4, 10) }).map(() =>
              randomPhrase(15, 30),
            ),
          },
        },
        noCursor: {
          description: "Typewriter without cursor",
          props: {
            lfCursor: "disabled",
            lfValue: randomPhrase(15, 30),
          },
        },
        loop: {
          description: "Typewriter with loop",
          props: {
            lfLoop: true,
            lfValue: randomPhrase(15, 30),
          },
        },
        cursor: {
          description: "Typewriter with cursor always visible",
          props: {
            lfCursor: "enabled",
            lfValue: randomPhrase(15, 30),
          },
        },
        pause: {
          description: "Typewriter with pause",
          props: {
            lfPause: 2000,
            lfValue: Array.from({ length: randomNumber(4, 10) }).map(() =>
              randomPhrase(15, 30),
            ),
          },
        },
        style: {
          description: "Typewriter with custom styling",
          props: {
            lfStyle: randomStyle(),
            lfValue: randomPhrase(15, 30),
          },
        },
      },
      //#endregion

      //#region Tags
      tags: LF_TYPEWRITER_TAGS.reduce(
        (acc, tag) => ({
          ...acc,
          [tag]: {
            description: `Typewriter with tag: ${tag}`,
            props: {
              lfCursor: "enabled",
              lfTag: tag,
              lfValue: Array.from({ length: randomNumber(4, 10) }).map(() =>
                randomPhrase(15, 30),
              ),
            },
          },
        }),
        {} as {
          [example: string]: LfShowcaseExample<LfTypewriterPropsInterface>;
        },
      ),
      //#endregion

      //#region Sizes
      sizes: LF_THEME_UI_SIZES.reduce(
        (acc, key) => {
          const size = key as LfThemeUISize;

          return {
            ...acc,
            [size]: {
              description: `Typewriter with size: ${size}`,
              props: {
                lfCursor: "enabled",
                lfUiSize: size,
                lfValue: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfTypewriterPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

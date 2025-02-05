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

const COMPONENT_NAME: LfComponentName = "LfUpload";
const EVENT_NAME: LfEventName<"LfUpload"> = "lf-upload-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfUpload"> = "LfUploadEventPayload";
const TAG_NAME: LfComponentTag<"LfUpload"> = "lf-upload";

export const getUploadFixtures = (
  _core: LfCoreInterface,
): LfShowcaseComponentFixture<"lf-upload"> => {
  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is a widget that enables uploading files",
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
                type: "delete",
                description: "emitted when an uploaded file is removed",
              },
              {
                type: "pointerdown",
                description:
                  "emitted when as soon as the component is touched/clicked (before the click event)",
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
              {
                type: "upload",
                description: "emitted when a new file has been uploaded",
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
        uncategorized: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Empty upload component",
          props: {},
        },
        label: {
          description: " Upload component with label",
          props: {
            lfLabel: "Click to upload!",
          },
        },
        style: {
          description: "Upload component with custom style",
          props: {
            lfStyle: randomStyle(),
          },
        },
        withFiles: {
          description: "Upload component with files",
          props: {
            lfValue: [
              new File([], "file1"),
              new File([], "file2", { type: "image/png" }),
              new File([], "file3", { type: "media/mp4" }),
              new File([], "file4", { type: "media/mp3" }),
              new File([], "file4", { type: "application/pdf" }),
              new File([], "file5", { type: "application/zip" }),
              new File([], "file6", { type: "application/json" }),
            ],
          },
        },
      },
      //#endregion
    },
  };
};

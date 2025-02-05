import { LfArticleDataset } from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Llm";

export const getLlmFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "fetch",
      {
        code: `const response = await llm.fetch(
  request, 
  "https://api.llm-service.com"
); // Sends a chat completion request to the LLM service.`,
        description: "Sends a chat completion request to the LLM service.",
      },
    ],
    [
      "poll",
      {
        code: `const response = await llm.poll(
  "https://api.llm-service.com"
); // Performs a polling request to the specified URL.`,
        description: "Performs a polling request to the specified URL.",
      },
    ],
    [
      "speechToText",
      {
        code: `llm.speechToText(
  textarea, 
  button
); // Initiates speech-to-text functionality using the browser's Speech Recognition API.`,
        description:
          "Initiates speech-to-text functionality using the browser's Speech Recognition API.",
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
                    value: "LfLlm",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " is a class that handles Large Language Model (LLM) operations and speech-to-text functionality.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "This class provides methods for making chat completion requests to LLM services, polling LLM endpoints, and converting speech to text using the browser's Speech Recognition API.",
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

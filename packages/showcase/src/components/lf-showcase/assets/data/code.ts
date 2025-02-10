import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfCodePropsInterface,
  LfComponentName,
  LfComponentTag,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfCode";
const EVENT_NAME: LfEventName<"LfCode"> = "lf-code-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfCode"> = "LfCodeEventPayload";
const TAG_NAME: LfComponentTag<"LfCode"> = "lf-code";

export const getCodeFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-code"> => {
  const { theme } = framework;

  //#region mock data
  const snippets = {
    css: "body { background-color: black; color: white; }",
    html: "<div>Hello, world!</div>",
    js: "const hello = 'world';\nconsole.log(hello); // Hello, world!",
    json: '{\n  "hello": "world"\n}',
    jsx: "const Hello = () => <div>Hello, world!</div>;",
    markdown: "# Hello, world!\nThis is a markdown file.\n\n- Item 1\n- Item 2",
    python: "print('Hello, world!')",
    regex: "/^Hello, world!$/",
    scss: "$primary-color: blue;\nbody {\n  color: $primary-color;\n}",
    tsx: "const Hello = () => <div>Hello, world!</div>; console.log(Hello);",
    typescript:
      "const hello: string = 'world';\nconsole.log(hello); // Hello, world!",
  };
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is designed to display code snippets with syntax highlighting and a handy button to copy the text with one click",
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
        sizes: 4,
        states: 4,
        uncategorized: 3,
      },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        empty: {
          description: "Empty Code component",
          props: {},
        },
        noHeader: {
          description: "Code component without header",
          props: {
            lfShowHeader: false,
            lfValue: snippets.js,
          },
        },
        noCopy: {
          description: "Code component without copy button",
          props: {
            lfShowCopy: false,
            lfValue: snippets.js,
          },
        },
        format: {
          description: "Code component without formatting",
          props: {
            lfFormat: false,
            lfValue: snippets.json,
          },
        },
        preserveSpaces: {
          description: "Code component with preserved spaces",
          props: {
            lfPreserveSpaces: true,
            lfValue: snippets.markdown,
          },
        },
      },
      //#endregion

      //#region Languages
      languages: {
        css: {
          description: "Code component with CSS snippet",
          props: {
            lfLanguage: "css",
            lfValue: snippets.css,
          },
        },
        html: {
          description: "Code component with HTML snippet",
          props: {
            lfLanguage: "markup",
            lfValue: snippets.html,
          },
        },
        js: {
          description: "Code component with JavaScript snippet",
          props: {
            lfLanguage: "javascript",
            lfValue: snippets.js,
          },
        },
        json: {
          description: "Code component with JSON snippet",
          props: {
            lfLanguage: "json",
            lfValue: snippets.json,
          },
        },
        jsx: {
          description: "Code component with JSX snippet",
          props: {
            lfLanguage: "jsx",
            lfValue: snippets.jsx,
          },
        },
        markdown: {
          description: "Code component with Markdown snippet",
          props: {
            lfLanguage: "markdown",
            lfValue: snippets.markdown,
          },
        },
        python: {
          description: "Code component with Python snippet",
          props: {
            lfLanguage: "python",
            lfValue: snippets.python,
          },
        },
        regex: {
          description: "Code component with Regex snippet",
          props: {
            lfLanguage: "regex",
            lfValue: snippets.regex,
          },
        },
        scss: {
          description: "Code component with SCSS snippet",
          props: {
            lfLanguage: "scss",
            lfValue: snippets.scss,
          },
        },
        tsx: {
          description: "Code component with TSX snippet",
          props: {
            lfLanguage: "tsx",
            lfValue: snippets.tsx,
          },
        },
        typescript: {
          description: "Code component with TypeScript snippet",
          props: {
            lfLanguage: "typescript",
            lfValue: snippets.typescript,
          },
        },
        style: {
          description: "Code component with custom styling",
          props: {
            lfStyle: randomStyle(),
            lfValue: snippets.js,
          },
        },
      },
      //#endregion

      //#region Sizes
      sizes: LF_THEME_UI_SIZES.reduce(
        (acc, key) => {
          const size = key as LfThemeUISize;

          return {
            ...acc,
            [size]: {
              description: `Code with size ${size}`,
              props: {
                lfUiSize: size,
                lfValue: snippets.js,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfCodePropsInterface>;
        },
      ),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key]) => {
          const state = key as LfThemeUIState;

          return {
            ...acc,
            [state]: {
              description: `Code in ${state} state`,
              props: {
                lfUiState: state,
                lfValue: snippets.js,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfCodePropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

import {
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfAutocompleteEventPayload,
  LfAutocompletePropsInterface,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEvent,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfAutocomplete";
const EVENT_NAME: LfEventName<"LfAutocomplete"> = "lf-autocomplete-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfAutocomplete"> =
  "LfAutocompleteEventPayload";
const TAG_NAME: LfComponentTag<"LfAutocomplete"> = "lf-autocomplete";

export const getAutocompleteFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-autocomplete"> => {
  const { theme } = framework;

  //#region mock data
  const countriesDataset: LfDataDataset = {
    nodes: [
      { id: "us", value: "United States" },
      { id: "uk", value: "United Kingdom" },
      { id: "ca", value: "Canada" },
      { id: "au", value: "Australia" },
      { id: "de", value: "Germany" },
      { id: "fr", value: "France" },
      { id: "it", value: "Italy" },
      { id: "es", value: "Spain" },
      { id: "jp", value: "Japan" },
      { id: "cn", value: "China" },
      { id: "in", value: "India" },
      { id: "br", value: "Brazil" },
      { id: "mx", value: "Mexico" },
      { id: "ru", value: "Russia" },
      { id: "za", value: "South Africa" },
    ],
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
            "provides a dynamic input field that fetches suggestions from a server as the user types. Unlike static select components, autocomplete starts with no options and populates the dropdown list based on user input after a configurable debounce delay and minimum character threshold.",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              lfTextfieldProps: { lfLabel: "Search countries" },
              lfDebounceMs: 300,
              lfMinChars: 2,
            }),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "change",
                description:
                  "emitted when the user selects an option from the list, providing the selected node.",
              },
              {
                type: "input",
                description:
                  "emitted when the user types in the input field, providing the current query string.",
              },
              {
                type: "lf-event",
                description:
                  "emitted for user interactions (input, selection, requests). Check originalEvent and payload for details.",
              },
              {
                type: "ready",
                description:
                  "emitted when the component completes its first complete lifecycle",
              },
              {
                type: "request",
                description:
                  "emitted when the component needs new data based on user input",
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
      columns: { uncategorized: 3, sizes: 4, states: 4 },
    },
    //#endregion

    documentation,
    examples: {
      //#region Uncategorized
      uncategorized: {
        simple: {
          description: "Basic autocomplete - type to see suggestions",
          events: {
            "lf-autocomplete-event": (
              event: LfEvent<LfAutocompleteEventPayload>,
            ) => {
              const { comp, eventType, query } = event.detail;
              if (eventType === "request") {
                const filtered = countriesDataset.nodes.filter((node) =>
                  String(node.value)
                    .toLowerCase()
                    .includes(String(query).toLowerCase()),
                );
                comp.lfDataset = { nodes: filtered };
              }
            },
          },
          props: {
            lfTextfieldProps: { lfLabel: "Search countries" },
            lfMinChars: 1,
          },
        },
        withDebounce: {
          description: "Autocomplete with custom debounce delay",
          events: {
            "lf-autocomplete-event": (
              event: LfEvent<LfAutocompleteEventPayload>,
            ) => {
              const { comp, eventType, query } = event.detail;
              if (eventType === "request") {
                const filtered = countriesDataset.nodes.filter((node) =>
                  String(node.value)
                    .toLowerCase()
                    .includes(String(query).toLowerCase()),
                );
                comp.lfDataset = { nodes: filtered };
              }
            },
          },
          props: {
            lfTextfieldProps: { lfLabel: "Search with 500ms debounce" },
            lfDebounceMs: 500,
            lfMinChars: 1,
          },
        },
        withMinChars: {
          description: "Autocomplete requiring minimum characters",
          events: {
            "lf-autocomplete-event": (
              event: LfEvent<LfAutocompleteEventPayload>,
            ) => {
              const { comp, eventType, query } = event.detail;
              if (eventType === "request") {
                const filtered = countriesDataset.nodes.filter((node) =>
                  String(node.value)
                    .toLowerCase()
                    .includes(String(query).toLowerCase()),
                );
                comp.lfDataset = { nodes: filtered };
              }
            },
          },
          props: {
            lfTextfieldProps: { lfLabel: "Type at least 3 characters" },
            lfMinChars: 3,
          },
        },
        withDataset: {
          description:
            "Autocomplete with populated dataset (normally loaded dynamically) - type 'U' to see suggestions",
          events: {
            "lf-autocomplete-event": (
              event: LfEvent<LfAutocompleteEventPayload>,
            ) => {
              const { comp, eventType, query } = event.detail;
              if (eventType === "request") {
                const filtered = countriesDataset.nodes.filter((node) =>
                  String(node.value)
                    .toLowerCase()
                    .includes(String(query).toLowerCase()),
                );
                comp.lfDataset = { nodes: filtered };
              }
            },
          },
          props: {
            lfDataset: countriesDataset,
            lfTextfieldProps: { lfLabel: "Search countries" },
            lfMinChars: 1,
          },
        },
        slowBackend: {
          description: "Autocomplete simulating slow backend response",
          events: {
            "lf-autocomplete-event": (
              event: LfEvent<LfAutocompleteEventPayload>,
            ) => {
              const { comp, eventType, query } = event.detail;
              if (eventType === "request") {
                setTimeout(() => {
                  const filtered = countriesDataset.nodes.filter((node) =>
                    String(node.value)
                      .toLowerCase()
                      .includes(String(query).toLowerCase()),
                  );
                  comp.lfDataset = { nodes: filtered };
                }, 5000);
              }
            },
          },
          props: {
            lfTextfieldProps: { lfLabel: "Slow backend simulation" },
            lfMinChars: 1,
          },
        },
        withValue: {
          description: "Autocomplete with pre-filled value",
          events: {
            "lf-autocomplete-event": (
              event: LfEvent<LfAutocompleteEventPayload>,
            ) => {
              const { comp, eventType, query } = event.detail;
              if (eventType === "request") {
                const filtered = countriesDataset.nodes.filter((node) =>
                  String(node.value)
                    .toLowerCase()
                    .includes(String(query).toLowerCase()),
                );
                comp.lfDataset = { nodes: filtered };
              }
            },
          },
          props: {
            lfTextfieldProps: { lfLabel: "Pre-filled autocomplete" },
            lfValue: "United States",
            lfMinChars: 1,
          },
        },
        withCache: {
          description:
            "Autocomplete with caching enabled - click the search icon to see cached results",
          events: {
            "lf-autocomplete-event": (
              event: LfEvent<LfAutocompleteEventPayload>,
            ) => {
              const { comp, eventType, query } = event.detail;
              if (eventType === "request") {
                const filtered = countriesDataset.nodes.filter((node) =>
                  String(node.value)
                    .toLowerCase()
                    .includes(String(query).toLowerCase()),
                );
                comp.lfDataset = { nodes: filtered };
              }
            },
          },
          props: {
            lfTextfieldProps: { lfLabel: "Cached autocomplete" },
            lfCache: true,
            lfMinChars: 1,
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
              description: `Autocomplete with size ${size}`,
              props: {
                lfTextfieldProps: { lfLabel: `Size ${size}` },
                lfUiSize: size,
                lfMinChars: 1,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfAutocompletePropsInterface>;
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
              description: `Autocomplete in ${state} state`,
              props: {
                lfTextfieldProps: { lfLabel: `${state} autocomplete` },
                lfUiState: state,
                lfValue: "United States",
                lfMinChars: 1,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfAutocompletePropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

//#region Autocomplete datasets
export const AUTOCOMPLETE_DATASETS: Record<string, LfDataDataset> = {
  countries: {
    nodes: [
      { id: "us", value: "United States" },
      { id: "uk", value: "United Kingdom" },
      { id: "ca", value: "Canada" },
      { id: "au", value: "Australia" },
      { id: "de", value: "Germany" },
      { id: "fr", value: "France" },
      { id: "it", value: "Italy" },
      { id: "es", value: "Spain" },
      { id: "jp", value: "Japan" },
      { id: "cn", value: "China" },
      { id: "in", value: "India" },
      { id: "br", value: "Brazil" },
      { id: "mx", value: "Mexico" },
      { id: "ru", value: "Russia" },
      { id: "za", value: "South Africa" },
    ],
  },
  cities: {
    nodes: [
      { id: "nyc", value: "New York" },
      { id: "lon", value: "London" },
      { id: "par", value: "Paris" },
      { id: "tok", value: "Tokyo" },
      { id: "syd", value: "Sydney" },
      { id: "ber", value: "Berlin" },
      { id: "rom", value: "Rome" },
      { id: "mad", value: "Madrid" },
      { id: "bej", value: "Beijing" },
      { id: "mum", value: "Mumbai" },
    ],
  },
  programming: {
    nodes: [
      { id: "js", value: "JavaScript" },
      { id: "ts", value: "TypeScript" },
      { id: "py", value: "Python" },
      { id: "java", value: "Java" },
      { id: "cpp", value: "C++" },
      { id: "cs", value: "C#" },
      { id: "go", value: "Go" },
      { id: "rust", value: "Rust" },
      { id: "php", value: "PHP" },
      { id: "ruby", value: "Ruby" },
      { id: "swift", value: "Swift" },
      { id: "kotlin", value: "Kotlin" },
    ],
  },
};

/**
 * Simulates server-side filtering for autocomplete
 * @param query - The search query
 * @param datasetKey - Which dataset to filter
 * @returns Filtered dataset
 */
export const filterAutocompleteData = (
  query: string,
  datasetKey: keyof typeof AUTOCOMPLETE_DATASETS = "countries",
): LfDataDataset => {
  const dataset = AUTOCOMPLETE_DATASETS[datasetKey];
  if (!query || query.length === 0) {
    return dataset;
  }

  const lowerQuery = query.toLowerCase();
  const filteredNodes = dataset.nodes.filter((node) =>
    String(node.value).toLowerCase().includes(lowerQuery),
  );

  return {
    ...dataset,
    nodes: filteredNodes,
  };
};
//#endregion

import {
  LF_BUTTON_EVENTS,
  LF_BUTTON_STYLINGS,
  LF_THEME_UI_SIZES,
  LfArticleDataset,
  LfButtonPropsInterface,
  LfComponentName,
  LfComponentTag,
  LfDataCell,
  LfDataDataset,
  LfDataShapes,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfMasonryEventPayload,
  LfShapeeditorElement,
  LfShapeeditorEventPayload,
  LfThemeUISize,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import { stateFactory } from "../../helpers/fixtures.state";
import {
  createComponentPlayground,
  createPropMapping,
  getCellKeyFromComponent,
  syncControlsFromShape,
  updatePreviewFromSettings,
} from "../../helpers/playground.generator";
import { LF_DOC } from "../doc";
import {
  LfShowcaseComponentFixture,
  LfShowcaseExample,
} from "../../lf-showcase-declarations";

const COMPONENT_NAME: LfComponentName = "LfButton";
const EVENT_NAME: LfEventName<"LfButton"> = "lf-button-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfButton"> = "LfButtonEventPayload";
const TAG_NAME: LfComponentTag<"LfButton"> = "lf-button";

export const getButtonFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-button"> => {
  const { theme } = framework;
  const { brandGithub, brandNpm, palette } = theme.get.icons();

  //#region mock data
  const lfDataset: LfDataDataset = {
    nodes: [
      {
        children: [
          { id: "0.0", value: "Child 1" },
          { id: "0.1", value: "Child 2" },
        ],
        id: "0",
        value: "Node 0",
      },
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
            "can assume the shape of a button with multiple styling options to choose from",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              lfImageProps: { lfValue: "notifications" },
            }),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "blur",
                description: "emitted when the component loses focus",
              },
              {
                type: "click",
                description: "emitted when the component is clicked",
              },
              {
                type: "focus",
                description: "emitted when the component is focused",
              },
              {
                type: "lf-event",
                description: "wraps a subcomponent event",
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

  //#region Playground State & Utilities
  // Create prop mapping for bidirectional sync
  const docEntry = LF_DOC[TAG_NAME] as {
    methods: { name: string; docs: string }[];
    props: { name: string; type: string; docs: string }[];
    styles: { name: string; docs: string }[];
  };
  const propMapping = createPropMapping(docEntry.props);
  const cellKey = getCellKeyFromComponent(COMPONENT_NAME);

  // Track current selected shape index for sync operations
  let currentShapeIndex: number | undefined;
  //#endregion

  //#region Playground Event Handler
  /**
   * Handles shapeeditor events for the button playground.
   * Implements bidirectional sync between controls and preview shapes.
   *
   * Flow:
   * 1. User clicks shape in masonry → `syncControlsFromShape()` updates controls
   * 2. User changes control → `syncShapeFromControls()` updates shape in dataset
   */
  const playgroundEventHandler = async (
    e: CustomEvent<LfShapeeditorEventPayload>,
  ) => {
    const { comp, eventType, originalEvent } = e.detail;
    const shapeeditor = comp as unknown as LfShapeeditorElement;

    switch (eventType) {
      //#region change
      /**
       * CHANGE EVENT
       * Control value committed (e.g., slider released, toggle clicked).
       * Creates a new snapshot with the updated cell props (preview updates).
       * The dataset is only updated when "Save Snapshot" is clicked.
       */
      case "change": {
        if (currentShapeIndex === undefined) {
          console.log(
            "[Button Playground] No shape selected - ignoring change",
          );
          return;
        }

        const settings = await shapeeditor.getSettings();

        // Create a new snapshot with updated cell props
        await updatePreviewFromSettings(shapeeditor, settings, propMapping);

        console.log("[Button Playground] Snapshot updated:", {
          index: currentShapeIndex,
          settings,
        });
        break;
      }
      //#endregion

      //#region lf-event
      /**
       * LF-EVENT (bubbled child events)
       * Handles masonry click → sync controls from selected shape's cell.
       */
      case "lf-event": {
        const childEvent = originalEvent as CustomEvent<unknown>;
        const detail = childEvent?.detail as
          | Record<string, unknown>
          | undefined;

        // Check if this is a masonry click event
        if (detail?.selectedShape !== undefined) {
          const masonryDetail = detail as unknown as LfMasonryEventPayload;
          const { selectedShape, eventType: masonryEventType } = masonryDetail;

          // Only handle click events
          if (masonryEventType === "click" && selectedShape?.shape) {
            currentShapeIndex = selectedShape.index;

            // Sync controls from the selected shape's cell
            await syncControlsFromShape(
              shapeeditor,
              selectedShape.shape as LfDataCell<LfDataShapes>,
              propMapping,
            );

            console.log("[Button Playground] Shape selected:", {
              index: currentShapeIndex,
              cell: selectedShape.shape,
            });
          }
        }
        break;
      }
      //#endregion

      //#region ready
      case "ready":
        console.log("[Button Playground] Shapeeditor ready");
        // Auto-select first shape on ready
        const dataset = shapeeditor.lfDataset;
        if (dataset?.nodes?.[0]?.cells?.[cellKey]) {
          currentShapeIndex = 0;
          await syncControlsFromShape(
            shapeeditor,
            dataset.nodes[0].cells[cellKey] as LfDataCell<LfDataShapes>,
            propMapping,
          );
          console.log("[Button Playground] Auto-selected first shape");
        }
        break;
      //#endregion
    }
  };
  //#endregion

  //#region Playground Configuration
  const playground = createComponentPlayground({
    componentName: COMPONENT_NAME,
    tag: TAG_NAME,
    eventTypes: LF_BUTTON_EVENTS,
    variants: [
      {
        id: "raised",
        label: "Raised Button",
        props: { lfLabel: "Raised", lfStyling: "raised", lfRipple: true },
      },
      {
        id: "flat",
        label: "Flat Button",
        props: { lfLabel: "Flat", lfStyling: "flat", lfRipple: true },
      },
      {
        id: "outlined",
        label: "Outlined Button",
        props: { lfLabel: "Outlined", lfStyling: "outlined", lfRipple: true },
      },
      {
        id: "floating",
        label: "Floating Action",
        props: {
          lfLabel: "",
          lfIcon: "plus",
          lfStyling: "floating",
          lfRipple: true,
        },
      },
      {
        id: "icon",
        label: "Icon Button",
        props: {
          lfLabel: "",
          lfIcon: "settings",
          lfStyling: "icon",
          lfRipple: true,
        },
      },
    ],
    description:
      "Experiment with button props in real-time. " +
      "Click any button variant, then use the Props tree to modify it. " +
      "Each button can be edited independently - try changing styles, labels, and icons!",
  });
  if (playground) {
    playground.events = { "lf-shapeeditor-event": playgroundEventHandler };
  }
  //#endregion

  return {
    //#region configuration
    configuration: {
      columns: {
        flat: 5,
        floating: 5,
        icon: 5,
        outlined: 5,
        raised: 5,
        sizes: 4,
        states: 4,
      },
    },
    //#endregion

    documentation,
    ...(playground && { playground }),
    examples: {
      //#region Styling
      ...LF_BUTTON_STYLINGS.reduce(
        (acc, styling) => {
          if (styling === "icon") {
            return acc;
          }
          return {
            ...acc,
            [styling]: {
              dropdown: {
                description: "Dropdown button",
                props: {
                  lfDataset,
                  lfLabel: "Dropdown",
                  lfStyling: styling,
                },
              },
              icon: {
                description: "Icon-only button",
                props: {
                  lfIcon: brandGithub,
                  lfStyling: styling,
                },
              },
              label: {
                description: "Button with label",
                props: {
                  lfLabel: "This is a label",
                  lfStyling: styling,
                },
              },
              labelIcon: {
                description: "With label and icon",
                props: {
                  lfIcon: brandNpm,
                  lfLabel: "A label with an icon",
                  lfStyling: styling,
                },
              },
              spinner: {
                description: "Button with spinner",
                props: {
                  lfLabel: "With spinner",
                  lfShowSpinner: true,
                  lfStyling: styling,
                },
              },
              stretched: {
                description: "Stretched button",
                props: {
                  lfLabel: "Stretched",
                  lfStretchX: true,
                  lfStretchY: true,
                  lfStyling: styling,
                },
              },
              style: {
                description: "Button with custom style",
                props: {
                  lfLabel: "With custom style",
                  lfStyle: randomStyle(),
                  lfStyling: styling,
                },
              },
              trailingIcon: {
                description: "With label and trailing icon",
                props: {
                  lfIcon: brandNpm,
                  lfLabel: "With label and trailing icon",
                  lfStyling: styling,
                  lfTrailingIcon: true,
                },
              },
            },
          };
        },
        {} as { [example: string]: LfShowcaseExample<LfButtonPropsInterface> },
      ),
      //#endregion

      //#region Icon
      icon: {
        dropdown: {
          description: "Dropdown button",
          props: {
            lfDataset,
            lfIcon: brandNpm,
            lfLabel: "Dropdown",
            lfStyling: "icon",
          },
        },
        icon: {
          description: "Icon button",
          props: {
            lfIcon: brandGithub,
            lfStyling: "icon",
          },
        },
        spinner: {
          description: "Icon button with spinner",
          props: {
            lfIcon: brandNpm,
            lfShowSpinner: true,
            lfStyling: "icon",
          },
        },
        stretched: {
          description: "Stretched icon button",
          props: {
            lfIcon: brandNpm,
            lfLabel: "Stretched",
            lfStretchX: true,
            lfStretchY: true,
            lfStyling: "icon",
          },
        },
        style: {
          description: "Button with custom style",
          props: {
            lfIcon: brandNpm,
            lfStyle: randomStyle(),
            lfStyling: "icon",
          },
        },
        toggable: {
          description: "Toggable button",
          props: {
            lfIcon: palette,
            lfStyling: "icon",
            lfToggable: true,
            lfValue: true,
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
              description: `Button with size ${size}`,
              props: {
                lfLabel: size,
                lfStyling: "raised",
                lfUiSize: size,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfButtonPropsInterface>;
        },
      ),
      //#endregion

      //#region States
      states: Object.entries(stateFactory(theme)).reduce(
        (acc, [key, values]) => {
          const state = key as LfThemeUIState;
          const { icon, label } = values;

          return {
            ...acc,
            [state]: {
              description: `Button in ${state} state`,
              props: {
                lfIcon: icon,
                lfLabel: label.capitalized,
                lfUiState: state,
              },
            },
          };
        },
        {} as {
          [example: string]: LfShowcaseExample<LfButtonPropsInterface>;
        },
      ),
      //#endregion
    },
  };
};

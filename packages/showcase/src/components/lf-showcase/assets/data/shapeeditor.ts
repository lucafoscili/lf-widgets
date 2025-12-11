import imageEditorJson from "@lf-widgets/assets/assets/fixtures/shapeeditor/image-editor.json";
import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfShapeeditorConfigDsl,
  LfShapeeditorConfigSettings,
  LfShapeeditorElement,
  LfShapeeditorEventPayload,
  LfShapeeditorInterface,
  LfTreeEventPayload,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { SECTION_FACTORY } from "../../helpers/doc.section";
import { randomStyle } from "../../helpers/fixtures.helpers";
import { LfShowcaseComponentFixture } from "../../lf-showcase-declarations";

//#region Constants
const COMPONENT_NAME: LfComponentName = "LfShapeeditor";
const EVENT_NAME: LfEventName<"LfShapeeditor"> = "lf-shapeeditor-event";
const PAYLOAD_NAME: LfEventPayloadName<"LfShapeeditor"> =
  "LfShapeeditorEventPayload";
const TAG_NAME: LfComponentTag<"LfShapeeditor"> = "lf-shapeeditor";
//#endregion

//#region Simulation Utilities
/**
 * Creates a human-readable description for a filter operation.
 */
const describeFilterOperation = (
  filterType: string,
  settings: LfShapeeditorConfigSettings,
): string => {
  const descriptions: Record<
    string,
    (s: LfShapeeditorConfigSettings) => string
  > = {
    brightness: (s) => {
      const val = (s["brightness_strength"] as number) ?? 0;
      return `Brightness: ${val > 0 ? "+" : ""}${Math.round(val * 100)}%`;
    },
    contrast: (s) => {
      const val = (s["contrast_strength"] as number) ?? 0;
      return `Contrast: ${val > 0 ? "+" : ""}${Math.round(val * 100)}%`;
    },
    saturation: (s) =>
      `Saturation: ${Math.round(((s["saturation_intensity"] as number) ?? 1) * 100)}%`,
    gaussian_blur: (s) => `Blur: ${(s["gaussianBlur_sigma"] as number) ?? 0}px`,
    sepia: (s) =>
      `Sepia: ${Math.round(((s["sepia_intensity"] as number) ?? 0) * 100)}%`,
    vignette: (s) =>
      `Vignette: ${Math.round(((s["vignette_intensity"] as number) ?? 0) * 100)}%`,
  };

  const describe = descriptions[filterType];
  return describe
    ? describe(settings)
    : filterType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Simulated API response structure.
 */
interface SimulatedApiResponse {
  status: "success" | "error";
  message?: string;
  data: string;
}

/**
 * Creates a simulated API client for image processing.
 * Applies CSS filters to preview effects client-side.
 */
const createSimulatedApi = (delayMs = 500) => {
  const filterToCss: Record<
    string,
    (settings: LfShapeeditorConfigSettings) => string
  > = {
    brightness: (s) =>
      `brightness(${1 + ((s["brightness_strength"] as number) ?? 0)})`,
    contrast: (s) =>
      `contrast(${1 + ((s["contrast_strength"] as number) ?? 0)})`,
    saturation: (s) =>
      `saturate(${(s["saturation_intensity"] as number) ?? 1})`,
    gaussian_blur: (s) => `blur(${(s["gaussianBlur_sigma"] as number) ?? 0}px)`,
    sepia: (s) => `sepia(${(s["sepia_intensity"] as number) ?? 0})`,
  };

  const applyFilterToCanvas = (
    imageData: string,
    filterType: string,
    settings: LfShapeeditorConfigSettings,
  ): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Apply CSS filter if available
        const cssFilter = filterToCss[filterType];
        if (cssFilter) {
          ctx.filter = cssFilter(settings) || "none";
        }

        ctx.drawImage(img, 0, 0);
        ctx.filter = "none";

        // Apply vignette manually (not a CSS filter)
        if (filterType === "vignette") {
          const intensity = (settings["vignette_intensity"] as number) ?? 0;
          const radius = (settings["vignette_radius"] as number) ?? 0;

          if (intensity > 0) {
            const gradient = ctx.createRadialGradient(
              canvas.width / 2,
              canvas.height / 2,
              canvas.width * (0.3 + radius * 0.4),
              canvas.width / 2,
              canvas.height / 2,
              canvas.width * 0.8,
            );

            const color = (settings["vignette_color"] as string) ?? "#000000";
            const alpha = Math.round(intensity * 255)
              .toString(16)
              .padStart(2, "0");
            gradient.addColorStop(0, "transparent");
            gradient.addColorStop(1, color + alpha);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }

        resolve(canvas.toDataURL("image/png"));
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageData;
    });

  return {
    process: async (
      imageData: string,
      filterType: string,
      settings: LfShapeeditorConfigSettings,
    ): Promise<SimulatedApiResponse> => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      try {
        const processedData = await applyFilterToCanvas(
          imageData,
          filterType,
          settings,
        );
        return { status: "success", data: processedData };
      } catch (error) {
        return {
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
          data: imageData,
        };
      }
    },
  };
};
//#endregion

//#region Image Editor Fixture
interface ImageEditorFixtureJson {
  canvasDataset?: LfDataDataset;
  dsl?: Record<string, LfShapeeditorConfigDsl>;
  settingsDataset?: LfDataDataset;
}

const {
  canvasDataset: rawCanvasDataset,
  dsl: filterDsl,
  settingsDataset: rawSettingsDataset,
} = imageEditorJson as ImageEditorFixtureJson;

/**
 * Resolves asset paths in the canvas dataset nodes.
 */
const resolveCanvasDataset = (
  getAsset: (path: string) => { path: string },
): LfDataDataset => {
  const dataset = rawCanvasDataset ?? { nodes: [] };

  return {
    ...dataset,
    nodes: (dataset.nodes ?? []).map((node) => {
      const cells = node.cells ?? {};
      const canvasCell = cells.lfCanvas;

      if (!canvasCell) return node;

      const valuePath = String(canvasCell.value ?? "");
      const lfImageValuePath = String(canvasCell.lfImageProps?.lfValue ?? "");

      return {
        ...node,
        cells: {
          ...cells,
          lfCanvas: {
            ...canvasCell,
            value: valuePath ? getAsset(valuePath).path : canvasCell.value,
            lfImageProps: {
              ...(canvasCell.lfImageProps ?? {}),
              lfValue: lfImageValuePath
                ? getAsset(lfImageValuePath).path
                : canvasCell.lfImageProps?.lfValue,
            },
          },
        },
      };
    }),
  };
};

const settingsDataset: LfDataDataset = rawSettingsDataset ?? { nodes: [] };

//#region Code Explorer Fixture
/**
 * Sample code snippets for the navigation example.
 * Each snippet demonstrates a different language or concept.
 */
const codeSnippetsDataset: LfDataDataset = {
  nodes: [
    {
      id: "typescript-hello",
      value: "Hello World",
      cells: {
        lfCode: {
          shape: "code",
          value: `// TypeScript Hello World
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`,
          lfLanguage: "typescript",
        },
      },
    },
    {
      id: "typescript-interface",
      value: "Interface Example",
      cells: {
        lfCode: {
          shape: "code",
          value: `// TypeScript Interface
interface User {
  id: number;
  name: string;
  email?: string;
}

const user: User = {
  id: 1,
  name: "John Doe",
};`,
          lfLanguage: "typescript",
        },
      },
    },
    {
      id: "javascript-async",
      value: "Async/Await",
      cells: {
        lfCode: {
          shape: "code",
          value: `// JavaScript Async/Await
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}`,
          lfLanguage: "javascript",
        },
      },
    },
    {
      id: "css-flexbox",
      value: "Flexbox Layout",
      cells: {
        lfCode: {
          shape: "code",
          value: `/* CSS Flexbox Layout */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.item {
  flex: 1;
  padding: 1rem;
  background: var(--primary-color);
}`,
          lfLanguage: "css",
        },
      },
    },
    {
      id: "html-template",
      value: "HTML Template",
      cells: {
        lfCode: {
          shape: "code",
          value: `<!-- HTML Template -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample Page</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Content goes here.</p>
  </main>
</body>
</html>`,
          lfLanguage: "html",
        },
      },
    },
  ],
};

/**
 * Navigation tree dataset for the code explorer.
 * Organized by language/category folders.
 */
const codeNavigationTree: LfDataDataset = {
  columns: [
    { id: "name", title: "Name" },
    { id: "items", title: "Items" },
    { id: "updated", title: "Updated" },
  ],
  nodes: [
    {
      id: "projects",
      value: "Projects",
      cells: {
        name: { shape: "text", value: "Projects" },
        items: { shape: "number", value: 12 },
        updated: { shape: "text", value: "2 days ago" },
      },
      children: [
        {
          id: "projects/alpha",
          value: "Project Alpha",
          cells: {
            name: { shape: "text", value: "Project Alpha" },
            items: { shape: "number", value: 5 },
            updated: { shape: "text", value: "Yesterday" },
          },
        },
        {
          id: "projects/beta",
          value: "Project Beta",
          cells: {
            name: { shape: "text", value: "Project Beta" },
            items: { shape: "number", value: 7 },
            updated: { shape: "text", value: "3 days ago" },
          },
        },
      ],
    },
    {
      id: "reviews",
      value: "Reviews",
      cells: {
        name: { shape: "text", value: "Reviews" },
        items: { shape: "number", value: 8 },
        updated: { shape: "text", value: "Today" },
      },
      children: [
        {
          id: "reviews/internal",
          value: "Internal",
          cells: {
            name: { shape: "text", value: "Internal" },
            items: { shape: "number", value: 3 },
            updated: { shape: "text", value: "4 hours ago" },
          },
        },
        {
          id: "reviews/client",
          value: "Client",
          cells: {
            name: { shape: "text", value: "Client" },
            items: { shape: "number", value: 5 },
            updated: { shape: "text", value: "Last week" },
          },
        },
      ],
    },
  ],
};
//#endregion

//#region Exports
export const getShapeeditorFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseComponentFixture<"lf-shapeeditor"> => {
  const { get } = framework.assets;

  //#region Data
  const canvasDataset = resolveCanvasDataset(get);
  //#endregion

  const simulatedApi = createSimulatedApi(800);

  /**
   * State tracking for the image editor playground.
   * Tracks the current filter type and its behavioral metadata.
   */
  interface PlaygroundState {
    /** Current filter type ID (e.g., "brightness", "brush") */
    filterType: string | null;
    /** DSL configuration for the current filter */
    dsl: LfShapeeditorConfigDsl | null;
  }

  const state: PlaygroundState = {
    filterType: null,
    dsl: null,
  };

  /**
   * Updates the playground state when a new filter is selected.
   */
  const setCurrentFilter = (filterType: string | null): void => {
    state.filterType = filterType;
    state.dsl =
      filterType && filterDsl ? (filterDsl[filterType] ?? null) : null;
    console.log(
      `Filter selected: ${filterType ?? "none"}`,
      state.dsl ? `(behavior: ${state.dsl.behavior ?? "live"})` : "",
    );
  };

  /**
   * Event handler for the simulated image editor playground.
   *
   * Implements the three behavioral patterns:
   * - **live**: Preview on slider drag (preview event), commit on release (change event)
   * - **configure**: Settings are config only, commit on shape stroke (lf-event from canvas)
   * - **manual**: No preview, commit only on explicit Apply button click (apply event)
   */
  const playgroundEventHandler = async (
    e: CustomEvent<LfShapeeditorEventPayload>,
  ): Promise<void> => {
    const { comp, eventType, originalEvent } = e.detail;
    const shapeeditor = comp as unknown as LfShapeeditorElement;

    switch (eventType) {
      //#region apply
      /**
       * APPLY EVENT
       * Explicit apply button press - used for "manual" behavior filters.
       * Shows full feedback with progressbar and snackbar.
       */
      case "apply": {
        const settings = await shapeeditor.getSettings();
        const snapshot = await shapeeditor.getCurrentSnapshot();

        if (!state.filterType || !snapshot?.value) {
          await shapeeditor.setSnackbar({
            message: "Please select an image and filter first",
            uiState: "warning",
            visible: true,
          });
          setTimeout(() => shapeeditor.setSnackbar({ visible: false }), 3000);
          return;
        }

        // Show progress bar
        await shapeeditor.setProgressbar({
          visible: true,
          value: 0,
          uiState: "info",
        });

        // Simulate progress updates
        for (const progress of [10, 30, 50, 70, 90, 100]) {
          await new Promise((resolve) => setTimeout(resolve, 150));
          await shapeeditor.setProgressbar({ value: progress });
        }

        try {
          const result = await simulatedApi.process(
            snapshot.value,
            state.filterType,
            settings,
          );

          await shapeeditor.setProgressbar({ visible: false });

          if (result.status === "success") {
            await shapeeditor.addSnapshot(result.data);
            await shapeeditor.setSnackbar({
              message: `Applied: ${describeFilterOperation(state.filterType, settings)}`,
              uiState: "success",
              visible: true,
            });
          } else {
            await shapeeditor.setSnackbar({
              message: result.message || "Processing failed",
              uiState: "danger",
              visible: true,
            });
          }
        } catch (error) {
          await shapeeditor.setProgressbar({ visible: false });
          await shapeeditor.setSnackbar({
            message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            uiState: "danger",
            visible: true,
          });
        }

        setTimeout(() => shapeeditor.setSnackbar({ visible: false }), 3000);
        return;
      }
      //#endregion

      //#region change
      /**
       * CHANGE EVENT
       * Control value committed (e.g., slider released).
       * Only creates snapshot for "live" behavior filters.
       */
      case "change": {
        const behavior = state.dsl?.behavior ?? "live";

        // Only "live" behavior creates snapshots on change
        // - "configure": snapshot created by stroke event (handled in lf-event)
        // - "manual": snapshot created by explicit Apply button
        if (behavior !== "live") {
          console.log(
            `[change] Filter "${state.filterType}" has "${behavior}" behavior - no snapshot`,
          );
          return;
        }

        const settings = await shapeeditor.getSettings();
        const snapshot = await shapeeditor.getCurrentSnapshot();

        if (!state.filterType || !snapshot?.value) return;

        try {
          const result = await simulatedApi.process(
            snapshot.value,
            state.filterType,
            settings,
          );
          if (result.status === "success") {
            // Clear preview since we're committing to history
            await shapeeditor.setPreviewValue(null);
            await shapeeditor.addSnapshot(result.data);
            console.log(
              `[change] Snapshot created: ${describeFilterOperation(state.filterType, settings)}`,
            );
          }
        } catch (error) {
          console.error("[change] Processing failed:", error);
        }
        return;
      }
      //#endregion

      //#region lf-event
      /**
       * LF-EVENT (bubbled child events)
       * Handles two important cases:
       * 1. Tree selection -> update current filter type
       * 2. Canvas stroke (for "configure" behavior) -> create snapshot
       */
      case "lf-event": {
        // Try to identify the source of the event
        const childEvent = originalEvent as CustomEvent<unknown>;
        const detail = childEvent?.detail as
          | Record<string, unknown>
          | undefined;

        // Case 1: Tree selection - update current filter
        if (detail?.node) {
          const treeDetail = detail as unknown as LfTreeEventPayload;
          const { node, eventType: treeEventType } = treeDetail;

          // Only handle click events on leaf nodes (filters, not categories)
          if (treeEventType === "click" && !node.children?.length) {
            setCurrentFilter(node.id);
          }
          return;
        }

        // Case 2: Canvas stroke event - for "configure" behavior filters
        // When behavior is "configure", the stroke completion triggers snapshot
        if (detail?.eventType === "stroke" || detail?.eventType === "change") {
          const behavior = state.dsl?.behavior;
          const commitTrigger = state.dsl?.commitTrigger;

          // Check if this filter uses shape stroke as commit trigger
          if (
            behavior === "configure" &&
            commitTrigger?.source === "shape" &&
            (commitTrigger?.eventType === "stroke" ||
              commitTrigger?.eventType === detail?.eventType)
          ) {
            const snapshot = await shapeeditor.getCurrentSnapshot();

            if (state.filterType && snapshot?.value) {
              try {
                // For brush/line strokes, we commit the canvas state directly
                // The canvas already has the stroke applied
                await shapeeditor.addSnapshot(snapshot.value);
                console.log(
                  `[stroke] Snapshot created for "${state.filterType}" stroke`,
                );

                await shapeeditor.setSnackbar({
                  message: `Stroke applied`,
                  uiState: "success",
                  visible: true,
                });
                setTimeout(
                  () => shapeeditor.setSnackbar({ visible: false }),
                  1500,
                );
              } catch (error) {
                console.error("[stroke] Failed to create snapshot:", error);
              }
            }
          }
        }
        return;
      }
      //#endregion

      //#region preview
      /**
       * PREVIEW EVENT
       * Real-time preview during control interaction (e.g., slider drag).
       * Only applies to "live" behavior filters with enablePreview=true.
       */
      case "preview": {
        const behavior = state.dsl?.behavior ?? "live";
        const enablePreview = state.dsl?.enablePreview ?? behavior === "live";

        if (!enablePreview) {
          console.log(
            `[preview] Filter "${state.filterType}" has preview disabled - skipping`,
          );
          return;
        }

        const settings = await shapeeditor.getSettings();
        const snapshot = await shapeeditor.getCurrentSnapshot();

        if (!state.filterType || !snapshot?.value) return;

        try {
          const result = await simulatedApi.process(
            snapshot.value,
            state.filterType,
            settings,
          );
          if (result.status === "success") {
            // Update preview without creating snapshot
            await shapeeditor.setPreviewValue(result.data);
          }
        } catch (error) {
          console.error("[preview] Failed:", error);
        }
        return;
      }
      //#endregion

      //#region reset
      /**
       * RESET EVENT
       * Reset controls to defaults. Clear any active preview.
       */
      case "reset": {
        await shapeeditor.setPreviewValue(null);
        await shapeeditor.setSnackbar({
          message: "Controls reset to defaults",
          uiState: "info",
          visible: true,
        });
        setTimeout(() => shapeeditor.setSnackbar({ visible: false }), 2000);
        return;
      }
      //#endregion
    }
  };
  //#endregion

  //#region Documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: COMPONENT_NAME,
        children: [
          SECTION_FACTORY.overview(
            COMPONENT_NAME,
            "is a universal 4-panel explorer for interactive editing and preview of any LfShape type",
          ),
          SECTION_FACTORY.usage(COMPONENT_NAME, {
            data: JSON.stringify({
              nodes: [
                {
                  value: "Image 1",
                  id: "0",
                  cells: { lfCanvas: { lfValue: "url_of_image1" } },
                },
                {
                  value: "Image 2",
                  id: "1",
                  cells: { lfCanvas: { lfValue: "url_of_image2" } },
                },
              ],
            }),
            tag: TAG_NAME,
          }),
          SECTION_FACTORY.props(TAG_NAME),
          SECTION_FACTORY.events(
            COMPONENT_NAME,
            PAYLOAD_NAME,
            [
              {
                type: "apply",
                description:
                  "emitted when the Apply button is clicked, allowing consumers to process the current settings",
              },
              {
                type: "change",
                description:
                  "emitted when a control value is committed (e.g., slider released), suitable for capturing snapshots",
              },
              {
                type: "lf-event",
                description:
                  "emitted for all child component interactions (tree selections, etc.)",
              },
              {
                type: "preview",
                description:
                  "emitted during real-time control interaction (e.g., slider drag), suitable for live preview without snapshot",
              },
              {
                type: "ready",
                description:
                  "emitted when the component completes its first complete lifecycle",
              },
              {
                type: "reset",
                description:
                  "emitted when the Reset button is clicked, after controls are reset to their defaults",
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

  //#region Navigation Example Handler
  /**
   * Event handler for the navigation example.
   * Updates the jump textfield when clicking on tree nodes (files).
   */
  const navigationEventHandler = async (
    e: CustomEvent<LfShapeeditorEventPayload>,
  ): Promise<void> => {
    const { comp, eventType, originalEvent } = e.detail;
    const shapeeditor = comp as unknown as LfShapeeditorElement;

    // Only handle lf-event from tree clicks
    if (eventType !== "lf-event") return;

    // Check if this is a tree event
    const treeEvent = originalEvent as CustomEvent<LfTreeEventPayload>;
    if (!treeEvent?.detail?.node) return;

    const { node, eventType: treeEventType } = treeEvent.detail;

    // Only process click events on file nodes (not folders)
    if (treeEventType !== "click" || node.children?.length) return;

    // Update the jump textfield with the node's path (id)
    const components = await shapeeditor.getComponents();
    const textfield = components?.navigation?.jump?.textfield;
    if (textfield) {
      textfield.setValue(node.id);
    }

    // Show feedback
    await shapeeditor.setSnackbar({
      message: `Selected: ${node.id}`,
      uiState: "info",
      visible: true,
    });
    setTimeout(() => shapeeditor.setSnackbar({ visible: false }), 2000);
  };

  /**
   * Load callback for the navigation example.
   * Simulates loading data from a path.
   */
  const navigationLoadCallback = async (
    shapeeditor: LfShapeeditorInterface,
    dir: string,
  ): Promise<void> => {
    await shapeeditor.setSnackbar({
      message: `Loading from: ${dir}`,
      uiState: "info",
      visible: true,
    });

    // Simulate async load
    await new Promise((resolve) => setTimeout(resolve, 500));

    await shapeeditor.setSnackbar({
      message: `Loaded: ${dir}`,
      uiState: "success",
      visible: true,
    });
    setTimeout(() => shapeeditor.setSnackbar({ visible: false }), 2000);
  };
  //#endregion

  return {
    documentation,

    playground: {
      description:
        "Simulated Image Editor - Select an image from the masonry, choose a filter from the tree, " +
        "adjust settings with real-time preview, then click Apply to process. " +
        "Demonstrates preview/change/apply event flow with snackbar and progressbar feedback.",
      props: {
        lfDataset: canvasDataset,
        lfShape: "canvas" as const,
        lfValue: settingsDataset,
      },
      events: { "lf-shapeeditor-event": playgroundEventHandler },
    },

    examples: {
      uncategorized: {
        withNavigation: {
          description:
            "Code snippet explorer with navigation tree, jump textfield, and load callback. " +
            "Click on a file in the tree to update the textfield path. " +
            "Demonstrates full navigation panel integration.",
          props: {
            lfDataset: codeSnippetsDataset,
            lfShape: "code",
            lfLoadCallback: navigationLoadCallback,
            lfNavigation: {
              isTreeOpen: true,
              treeProps: {
                lfDataset: codeNavigationTree,
                lfGrid: true,
              },
            },
          },
          events: { "lf-shapeeditor-event": navigationEventHandler },
        },
        styledEditor: {
          description: "Image editor with custom styling",
          props: {
            lfDataset: canvasDataset,
            lfShape: "canvas",
            lfStyle: randomStyle(),
            lfValue: settingsDataset,
          },
        },
      },
    },
  };
};
//#endregion

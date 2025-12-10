import imageEditorJson from "@lf-widgets/assets/assets/fixtures/shapeeditor/image-editor.json";
import {
  LfArticleDataset,
  LfComponentName,
  LfComponentTag,
  LfDataDataset,
  LfEventName,
  LfEventPayloadName,
  LfFrameworkInterface,
  LfShapeeditorConfigSettings,
  LfShapeeditorElement,
  LfShapeeditorEventPayload,
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
 * Filter types supported by the simulated image editor.
 */
type SimulatedFilterType =
  | "brightness"
  | "contrast"
  | "saturation"
  | "gaussian_blur"
  | "sepia"
  | "vignette";

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
  settingsDataset?: LfDataDataset;
}

const { canvasDataset: rawCanvasDataset, settingsDataset: rawSettingsDataset } =
  imageEditorJson as ImageEditorFixtureJson;

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
  let currentFilterType: SimulatedFilterType | string | null = null;

  const playgroundEventHandler = async (
    e: CustomEvent<LfShapeeditorEventPayload>,
  ): Promise<void> => {
    const { comp, eventType } = e.detail;
    const shapeeditor = comp as unknown as LfShapeeditorElement;

    switch (eventType) {
      //#region apply
      // Explicit apply button press with full feedback
      case "apply": {
        const settings = await shapeeditor.getSettings();
        const snapshot = await shapeeditor.getCurrentSnapshot();

        if (!currentFilterType || !snapshot?.value) {
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
            currentFilterType,
            settings,
          );

          await shapeeditor.setProgressbar({ visible: false });

          if (result.status === "success") {
            await shapeeditor.addSnapshot(result.data);
            await shapeeditor.setSnackbar({
              message: `Applied: ${describeFilterOperation(currentFilterType, settings)}`,
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
      // Control value committed (e.g., slider released) - capture snapshot
      case "change": {
        const settings = await shapeeditor.getSettings();
        const snapshot = await shapeeditor.getCurrentSnapshot();

        if (!currentFilterType || !snapshot?.value) return;

        try {
          const result = await simulatedApi.process(
            snapshot.value,
            currentFilterType,
            settings,
          );
          if (result.status === "success") {
            // Clear preview since we're committing to history
            await shapeeditor.setPreviewValue(null);
            await shapeeditor.addSnapshot(result.data);
            console.log(
              "Snapshot:",
              describeFilterOperation(currentFilterType, settings),
            );
          }
        } catch (error) {
          console.error("Change processing failed:", error);
        }
        return;
      }
      //#endregion
      //#region lf-event
      // Track current filter from tree selection
      case "lf-event": {
        const snapshot = await shapeeditor.getCurrentSnapshot();
        const shapeIndex = snapshot?.shape?.index;
        if (shapeIndex !== undefined) {
          const nodeId = canvasDataset.nodes?.[shapeIndex]?.id;
          if (nodeId) currentFilterType = nodeId;
        }
        return;
      }
      //#endregion
      //#region preview
      // Real-time preview during control interaction (e.g., slider drag)
      case "preview": {
        const settings = await shapeeditor.getSettings();
        const snapshot = await shapeeditor.getCurrentSnapshot();

        if (!currentFilterType || !snapshot?.value) return;

        try {
          const result = await simulatedApi.process(
            snapshot.value,
            currentFilterType,
            settings,
          );
          if (result.status === "success") {
            // Update the preview image without creating a snapshot
            await shapeeditor.setPreviewValue(result.data);
          }
        } catch (error) {
          console.error("Preview failed:", error);
        }
        return;
      }
      //#endregion
      //#region reset
      // Reset controls to defaults
      case "reset": {
        // Clear any active preview
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
        simpleEditor: {
          description: "Basic image editor with default settings",
          props: {
            lfDataset: canvasDataset,
            lfShape: "canvas",
            lfValue: settingsDataset,
          },
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

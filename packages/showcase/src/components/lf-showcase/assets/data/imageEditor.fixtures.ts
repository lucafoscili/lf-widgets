import type { LfDataDataset, LfShapeeditorConfigDsl } from "@lf-widgets/foundations";
import imageEditorJson from "@lf-widgets/assets/assets/fixtures/shapeeditor/image-editor.json";

export type ImageEditorShapeeditorConfig = LfShapeeditorConfigDsl;

const {
  dsl,
  canvasDataset: rawCanvasDataset,
  settingsDataset: rawSettingsDataset,
} = imageEditorJson as {
  dsl: {
    brush: LfShapeeditorConfigDsl;
    brightness: LfShapeeditorConfigDsl;
    resizeEdge: LfShapeeditorConfigDsl;
  };
  canvasDataset?: LfDataDataset;
  settingsDataset?: LfDataDataset;
};

export const IMAGE_EDITOR_BRUSH_DSL: ImageEditorShapeeditorConfig = dsl.brush;

export const IMAGE_EDITOR_BRIGHTNESS_DSL: ImageEditorShapeeditorConfig =
  dsl.brightness;

export const IMAGE_EDITOR_RESIZE_EDGE_DSL: ImageEditorShapeeditorConfig =
  dsl.resizeEdge;

export const IMAGE_EDITOR_CANVAS_DATASET = (
  getAsset: (path: string) => { path: string },
): LfDataDataset => {
  const dataset = rawCanvasDataset ?? { nodes: [] };

  return {
    ...dataset,
    nodes: (dataset.nodes ?? []).map((node) => {
      const cells = node.cells ?? {};
      const canvasCell = cells.lfCanvas;

      if (!canvasCell) {
        return node;
      }

      const valuePath = String(canvasCell.value ?? "");
      const lfImageValuePath = String(canvasCell.lfImageProps?.lfValue ?? "");

      const resolvedValue = valuePath
        ? getAsset(valuePath).path
        : canvasCell.value;

      const resolvedLfImageValue = lfImageValuePath
        ? getAsset(lfImageValuePath).path
        : canvasCell.lfImageProps?.lfValue;

      return {
        ...node,
        cells: {
          ...cells,
          lfCanvas: {
            ...canvasCell,
            value: resolvedValue,
            lfImageProps: {
              ...(canvasCell.lfImageProps ?? {}),
              lfValue: resolvedLfImageValue,
            },
          },
        },
      };
    }),
  };
};

export const IMAGE_EDITOR_SETTINGS_DATASET: LfDataDataset =
  rawSettingsDataset ?? { nodes: [] };

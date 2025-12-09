/**
 * Image Editor Datasets
 *
 * Pre-configured datasets for the image editor shapeeditor:
 * - Settings tree dataset (navigation tree with DSL in cells)
 * - Canvas sample dataset (example images for the masonry)
 */

import type { LfDataDataset, LfDataNode } from "@lf-widgets/foundations";

import {
  IMAGE_EDITOR_BACKGROUND_REMOVER_DSL,
  IMAGE_EDITOR_BLEND_DSL,
  IMAGE_EDITOR_BLOOM_DSL,
  IMAGE_EDITOR_BRIGHTNESS_DSL,
  IMAGE_EDITOR_BRUSH_DSL,
  IMAGE_EDITOR_CLARITY_DSL,
  IMAGE_EDITOR_CONTRAST_DSL,
  IMAGE_EDITOR_DESATURATE_DSL,
  IMAGE_EDITOR_FILM_GRAIN_DSL,
  IMAGE_EDITOR_GAUSSIAN_BLUR_DSL,
  IMAGE_EDITOR_INPAINT_DSL,
  IMAGE_EDITOR_LINE_DSL,
  IMAGE_EDITOR_OUTPAINT_DSL,
  IMAGE_EDITOR_RESIZE_EDGE_DSL,
  IMAGE_EDITOR_RESIZE_FREE_DSL,
  IMAGE_EDITOR_SATURATION_DSL,
  IMAGE_EDITOR_SEPIA_DSL,
  IMAGE_EDITOR_SPLIT_TONE_DSL,
  IMAGE_EDITOR_TILT_SHIFT_DSL,
  IMAGE_EDITOR_UNSHARP_MASK_DSL,
  IMAGE_EDITOR_VIBRANCE_DSL,
  IMAGE_EDITOR_VIGNETTE_DSL,
} from "./settings/index";

//#region Helper
/**
 * Creates a tree node with embedded DSL configuration.
 */
const createFilterNode = (
  id: string,
  value: string,
  description: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dsl: any,
): LfDataNode => ({
  id,
  value,
  description,
  cells: {
    lfCode: {
      shape: "code",
      value: JSON.stringify(dsl),
    },
  },
});
//#endregion

//#region Settings Tree Dataset
/**
 * Complete settings tree dataset for the image editor.
 * Each leaf node contains a DSL configuration in its `lfCode` cell.
 *
 * Structure:
 * - Settings (brush configuration)
 * - Diffusion Tools (inpaint, outpaint)
 * - Cutouts (background remover)
 * - Basic Adjustments (brightness, contrast, etc.)
 * - Creative Effects (bloom, vignette, etc.)
 */
export const IMAGE_EDITOR_SETTINGS_DATASET: LfDataDataset = {
  nodes: [
    //#region Settings
    {
      id: "settings",
      value: "Settings",
      description: "Tool configuration.",
      icon: "brush",
      children: [
        createFilterNode(
          "brush",
          "Brush",
          "Brush configuration for masking and painting.",
          IMAGE_EDITOR_BRUSH_DSL,
        ),
        createFilterNode(
          "line",
          "Line",
          "Draw straight or smooth lines.",
          IMAGE_EDITOR_LINE_DSL,
        ),
      ],
    },
    //#endregion

    //#region Diffusion Tools
    {
      id: "diffusion_tools",
      value: "Diffusion Tools",
      description: "AI-powered retouching using diffusion models.",
      icon: "wand",
      children: [
        createFilterNode(
          "inpaint",
          "Inpaint",
          "Inpaint masked areas using the connected diffusion model. Advanced controls are available inside the inpaint panel.",
          IMAGE_EDITOR_INPAINT_DSL,
        ),
        createFilterNode(
          "outpaint",
          "Outpaint",
          "Outpaint beyond the current canvas. Brush along edges to choose which sides expand.",
          IMAGE_EDITOR_OUTPAINT_DSL,
        ),
      ],
    },
    //#endregion

    //#region Cutouts
    {
      id: "cutouts",
      value: "Cutouts",
      description: "Background removal and matting tools.",
      icon: "replace",
      children: [
        createFilterNode(
          "background_remover",
          "Background Remover",
          "Remove the background using rembg with optional solid fill.",
          IMAGE_EDITOR_BACKGROUND_REMOVER_DSL,
        ),
      ],
    },
    //#endregion

    //#region Basic Adjustments
    {
      id: "basic_adjustments",
      value: "Basic Adjustments",
      description: "Basic adjustments such as sharpening and color tuning.",
      icon: "settings",
      children: [
        createFilterNode(
          "brightness",
          "Brightness",
          "Adjusts the brightness of the image.",
          IMAGE_EDITOR_BRIGHTNESS_DSL,
        ),
        createFilterNode(
          "clarity",
          "Clarity",
          "Simulates the Lightroom clarity effect.",
          IMAGE_EDITOR_CLARITY_DSL,
        ),
        createFilterNode(
          "contrast",
          "Contrast",
          "Adjusts the contrast of the image.",
          IMAGE_EDITOR_CONTRAST_DSL,
        ),
        createFilterNode(
          "desaturate",
          "Desaturate",
          "Reduces the saturation with per-channel control.",
          IMAGE_EDITOR_DESATURATE_DSL,
        ),
        createFilterNode(
          "saturation",
          "Saturation",
          "Adjusts the saturation of the image.",
          IMAGE_EDITOR_SATURATION_DSL,
        ),
        createFilterNode(
          "unsharp_mask",
          "Unsharp Mask",
          "Sharpens edges using a classic unsharp mask pipeline.",
          IMAGE_EDITOR_UNSHARP_MASK_DSL,
        ),
        createFilterNode(
          "resize_edge",
          "Resize (by edge)",
          "Resize the image by fitting one edge to a target size while preserving aspect ratio.",
          IMAGE_EDITOR_RESIZE_EDGE_DSL,
        ),
        createFilterNode(
          "resize_free",
          "Resize (free)",
          "Resize the image to explicit width/height with optional crop or padding.",
          IMAGE_EDITOR_RESIZE_FREE_DSL,
        ),
      ],
    },
    //#endregion

    //#region Creative Effects
    {
      id: "creative_effects",
      value: "Creative Effects",
      description:
        "Artistic filters such as vignette effect and gaussian blur.",
      icon: "palette",
      children: [
        createFilterNode(
          "blend",
          "Blend",
          "Blends a color layer onto the image.",
          IMAGE_EDITOR_BLEND_DSL,
        ),
        createFilterNode(
          "bloom",
          "Bloom",
          "Applies a cinematic bloom effect to highlights.",
          IMAGE_EDITOR_BLOOM_DSL,
        ),
        createFilterNode(
          "film_grain",
          "Film Grain",
          "Applies a film grain effect for a vintage look.",
          IMAGE_EDITOR_FILM_GRAIN_DSL,
        ),
        createFilterNode(
          "gaussian_blur",
          "Gaussian Blur",
          "Blurs the image using a Gaussian kernel.",
          IMAGE_EDITOR_GAUSSIAN_BLUR_DSL,
        ),
        createFilterNode(
          "sepia",
          "Sepia",
          "Applies a sepia tone effect to the image.",
          IMAGE_EDITOR_SEPIA_DSL,
        ),
        createFilterNode(
          "split_tone",
          "Split Tone",
          "Applies different tones to highlights and shadows.",
          IMAGE_EDITOR_SPLIT_TONE_DSL,
        ),
        createFilterNode(
          "tilt_shift",
          "Tilt-Shift",
          "Simulates a miniature/tilt-shift lens effect.",
          IMAGE_EDITOR_TILT_SHIFT_DSL,
        ),
        createFilterNode(
          "vibrance",
          "Vibrance",
          "Applies a vibrance effect that protects skin tones.",
          IMAGE_EDITOR_VIBRANCE_DSL,
        ),
        createFilterNode(
          "vignette",
          "Vignette",
          "Applies a vignetting effect to the edges.",
          IMAGE_EDITOR_VIGNETTE_DSL,
        ),
      ],
    },
    //#endregion
  ],
};
//#endregion

//#region Canvas Sample Dataset
/**
 * Creates a sample canvas dataset with showcase images.
 * Pass a getAsset function to resolve asset paths.
 *
 * @param getAsset - Function that receives a relative asset path and returns the resolved path
 *
 * @example
 * ```typescript
 * // In a consumer that has assets at /assets
 * const dataset = IMAGE_EDITOR_CANVAS_DATASET((path) => ({
 *   path: path.replace("./assets", "/assets")
 * }));
 * ```
 */
export const IMAGE_EDITOR_CANVAS_DATASET = (
  getAsset: (path: string) => { path: string },
): LfDataDataset => ({
  nodes: [
    {
      id: "canvas_0",
      value: "Avatar 1",
      cells: {
        lfCanvas: {
          shape: "canvas",
          value: getAsset("./assets/showcase/avatar_thor_2.png").path,
          lfImageProps: {
            lfValue: getAsset("./assets/showcase/avatar_thor_2.png").path,
          },
        },
      },
    },
    {
      id: "canvas_1",
      value: "Forest Scene",
      cells: {
        lfCanvas: {
          shape: "canvas",
          value: getAsset("./assets/showcase/location_forest.png").path,
          lfImageProps: {
            lfValue: getAsset("./assets/showcase/location_forest.png").path,
          },
        },
      },
    },
    {
      id: "canvas_2",
      value: "Avatar 2",
      cells: {
        lfCanvas: {
          shape: "canvas",
          value: getAsset("./assets/showcase/avatar_freya.png").path,
          lfImageProps: {
            lfValue: getAsset("./assets/showcase/avatar_freya.png").path,
          },
        },
      },
    },
  ],
});
//#endregion

//#region Filter Metadata
/**
 * Metadata about each filter type for UI purposes.
 * Useful for building filter selection UIs outside the tree.
 */
export interface ImageEditorFilterMeta {
  id: string;
  name: string;
  description: string;
  category: "drawing" | "diffusion" | "cutout" | "adjustment" | "effect";
  icon: string;
  /** If true, this filter requires a canvas action (brush stroke) */
  hasCanvasAction?: boolean;
  /** If true, changes require manual "Apply" (not auto-preview) */
  manualApply?: boolean;
}

export const IMAGE_EDITOR_FILTER_METADATA: ImageEditorFilterMeta[] = [
  // Drawing
  {
    id: "brush",
    name: "Brush",
    description: "Paint masks for inpaint/outpaint",
    category: "drawing",
    icon: "brush",
    hasCanvasAction: true,
  },
  {
    id: "line",
    name: "Line",
    description: "Draw straight or curved lines",
    category: "drawing",
    icon: "line",
    hasCanvasAction: true,
  },

  // Diffusion
  {
    id: "inpaint",
    name: "Inpaint",
    description: "AI-powered fill for masked areas",
    category: "diffusion",
    icon: "wand",
    hasCanvasAction: true,
    manualApply: true,
  },
  {
    id: "outpaint",
    name: "Outpaint",
    description: "Expand canvas with AI generation",
    category: "diffusion",
    icon: "arrow-autofit-content",
    hasCanvasAction: true,
    manualApply: true,
  },

  // Cutout
  {
    id: "background_remover",
    name: "Background Remover",
    description: "Remove background using AI",
    category: "cutout",
    icon: "replace",
    manualApply: true,
  },

  // Adjustments
  {
    id: "brightness",
    name: "Brightness",
    description: "Adjust image brightness",
    category: "adjustment",
    icon: "brightness-2",
  },
  {
    id: "clarity",
    name: "Clarity",
    description: "Enhance local contrast",
    category: "adjustment",
    icon: "focus-2",
  },
  {
    id: "contrast",
    name: "Contrast",
    description: "Adjust image contrast",
    category: "adjustment",
    icon: "contrast-2",
  },
  {
    id: "desaturate",
    name: "Desaturate",
    description: "Remove color per-channel",
    category: "adjustment",
    icon: "palette-off",
  },
  {
    id: "saturation",
    name: "Saturation",
    description: "Adjust color saturation",
    category: "adjustment",
    icon: "palette",
  },
  {
    id: "unsharp_mask",
    name: "Unsharp Mask",
    description: "Sharpen image details",
    category: "adjustment",
    icon: "focus",
  },
  {
    id: "resize_edge",
    name: "Resize (by edge)",
    description: "Resize by longest/shortest edge",
    category: "adjustment",
    icon: "resize",
    manualApply: true,
  },
  {
    id: "resize_free",
    name: "Resize (free)",
    description: "Resize to specific dimensions",
    category: "adjustment",
    icon: "aspect-ratio",
    manualApply: true,
  },

  // Effects
  {
    id: "blend",
    name: "Blend",
    description: "Blend a solid color overlay",
    category: "effect",
    icon: "layers-intersect",
  },
  {
    id: "bloom",
    name: "Bloom",
    description: "Add cinematic glow",
    category: "effect",
    icon: "sun",
  },
  {
    id: "film_grain",
    name: "Film Grain",
    description: "Add vintage film texture",
    category: "effect",
    icon: "grain",
  },
  {
    id: "gaussian_blur",
    name: "Gaussian Blur",
    description: "Blur the entire image",
    category: "effect",
    icon: "blur",
  },
  {
    id: "sepia",
    name: "Sepia",
    description: "Apply sepia tone",
    category: "effect",
    icon: "photo-filled",
  },
  {
    id: "split_tone",
    name: "Split Tone",
    description: "Color highlights and shadows",
    category: "effect",
    icon: "color-swatch",
  },
  {
    id: "tilt_shift",
    name: "Tilt-Shift",
    description: "Miniature lens effect",
    category: "effect",
    icon: "camera",
  },
  {
    id: "vibrance",
    name: "Vibrance",
    description: "Smart saturation boost",
    category: "effect",
    icon: "sparkles",
  },
  {
    id: "vignette",
    name: "Vignette",
    description: "Darken image edges",
    category: "effect",
    icon: "circle",
  },
];
//#endregion

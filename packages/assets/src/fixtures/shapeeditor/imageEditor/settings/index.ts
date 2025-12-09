/**
 * Image Editor Settings DSL - Index
 *
 * Central export for all image editor DSL configurations.
 */

// Basic adjustments
export {
  IMAGE_EDITOR_BRIGHTNESS_DSL,
  IMAGE_EDITOR_CLARITY_DSL,
  IMAGE_EDITOR_CONTRAST_DSL,
  IMAGE_EDITOR_DESATURATE_DSL,
  IMAGE_EDITOR_RESIZE_EDGE_DSL,
  IMAGE_EDITOR_RESIZE_FREE_DSL,
  IMAGE_EDITOR_SATURATION_DSL,
  IMAGE_EDITOR_UNSHARP_MASK_DSL,
} from "./basicAdjustments";

// Background tools
export { IMAGE_EDITOR_BACKGROUND_REMOVER_DSL } from "./background";

// Creative effects
export {
  IMAGE_EDITOR_BLEND_DSL,
  IMAGE_EDITOR_BLOOM_DSL,
  IMAGE_EDITOR_FILM_GRAIN_DSL,
  IMAGE_EDITOR_GAUSSIAN_BLUR_DSL,
  IMAGE_EDITOR_SEPIA_DSL,
  IMAGE_EDITOR_SPLIT_TONE_DSL,
  IMAGE_EDITOR_TILT_SHIFT_DSL,
  IMAGE_EDITOR_VIBRANCE_DSL,
  IMAGE_EDITOR_VIGNETTE_DSL,
} from "./creativeEffects";

// Diffusion tools
export {
  IMAGE_EDITOR_INPAINT_DSL,
  IMAGE_EDITOR_OUTPAINT_DSL,
} from "./diffusion";

// Drawing tools
export { IMAGE_EDITOR_BRUSH_DSL, IMAGE_EDITOR_LINE_DSL } from "./drawing";

/**
 * All image editor DSL configurations keyed by filter type.
 * This is the canonical mapping from filter ID to configuration.
 */
export const IMAGE_EDITOR_DSL_MAP = {
  // Drawing
  brush: () => import("./drawing").then((m) => m.IMAGE_EDITOR_BRUSH_DSL),
  line: () => import("./drawing").then((m) => m.IMAGE_EDITOR_LINE_DSL),

  // Basic Adjustments
  brightness: () =>
    import("./basicAdjustments").then((m) => m.IMAGE_EDITOR_BRIGHTNESS_DSL),
  clarity: () =>
    import("./basicAdjustments").then((m) => m.IMAGE_EDITOR_CLARITY_DSL),
  contrast: () =>
    import("./basicAdjustments").then((m) => m.IMAGE_EDITOR_CONTRAST_DSL),
  desaturate: () =>
    import("./basicAdjustments").then((m) => m.IMAGE_EDITOR_DESATURATE_DSL),
  saturation: () =>
    import("./basicAdjustments").then((m) => m.IMAGE_EDITOR_SATURATION_DSL),
  unsharp_mask: () =>
    import("./basicAdjustments").then((m) => m.IMAGE_EDITOR_UNSHARP_MASK_DSL),
  resize_edge: () =>
    import("./basicAdjustments").then((m) => m.IMAGE_EDITOR_RESIZE_EDGE_DSL),
  resize_free: () =>
    import("./basicAdjustments").then((m) => m.IMAGE_EDITOR_RESIZE_FREE_DSL),

  // Background
  background_remover: () =>
    import("./background").then((m) => m.IMAGE_EDITOR_BACKGROUND_REMOVER_DSL),

  // Creative Effects
  blend: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_BLEND_DSL),
  bloom: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_BLOOM_DSL),
  film_grain: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_FILM_GRAIN_DSL),
  gaussian_blur: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_GAUSSIAN_BLUR_DSL),
  sepia: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_SEPIA_DSL),
  split_tone: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_SPLIT_TONE_DSL),
  tilt_shift: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_TILT_SHIFT_DSL),
  vibrance: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_VIBRANCE_DSL),
  vignette: () =>
    import("./creativeEffects").then((m) => m.IMAGE_EDITOR_VIGNETTE_DSL),

  // Diffusion
  inpaint: () => import("./diffusion").then((m) => m.IMAGE_EDITOR_INPAINT_DSL),
  outpaint: () =>
    import("./diffusion").then((m) => m.IMAGE_EDITOR_OUTPAINT_DSL),
} as const;

/**
 * Filter type identifier for the image editor.
 */
export type ImageEditorFilterType = keyof typeof IMAGE_EDITOR_DSL_MAP;

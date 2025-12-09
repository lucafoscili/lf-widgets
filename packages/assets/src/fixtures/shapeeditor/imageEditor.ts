/**
 * Image Editor Fixtures - Legacy Re-exports
 *
 * This file re-exports from the new modular structure for backwards compatibility.
 * New code should import from `./imageEditor/index` directly.
 *
 * @deprecated Import from `./imageEditor` instead
 */

// Re-export everything from the new modular structure
export * from "./imageEditor";

// Re-export specific items for backwards compatibility with the old API
export {
  IMAGE_EDITOR_BRIGHTNESS_DSL,
  IMAGE_EDITOR_BRUSH_DSL,
  IMAGE_EDITOR_RESIZE_EDGE_DSL,
} from "./imageEditor/settings";

export {
  IMAGE_EDITOR_CANVAS_DATASET,
  IMAGE_EDITOR_SETTINGS_DATASET,
} from "./imageEditor/datasets";

// Type alias for backwards compatibility
import type { LfShapeeditorConfigDsl } from "@lf-widgets/foundations";
export type ImageEditorShapeeditorConfig = LfShapeeditorConfigDsl;

/*
 * MIGRATION NOTES:
 *
 * The image editor fixtures have been reorganized into a modular structure:
 *
 * OLD:
 *   import { IMAGE_EDITOR_BRUSH_DSL } from './imageEditor'
 *
 * NEW:
 *   import { IMAGE_EDITOR_BRUSH_DSL } from './imageEditor/settings'
 *   // or
 *   import { IMAGE_EDITOR_BRUSH_DSL } from './imageEditor'
 *
 * New additions:
 * - All filter DSLs (brightness, contrast, saturation, etc.)
 * - Diffusion tools (inpaint, outpaint)
 * - API simulation for testing without backend
 * - History manager for undo/redo
 * - Filter metadata for UI building
 *
 * See `./imageEditor/index.ts` for the full API.
 */

// Legacy inline definitions removed - now imported from modular structure
// The following were the original exports, now re-exported above:
// - IMAGE_EDITOR_BRUSH_DSL
// - IMAGE_EDITOR_BRIGHTNESS_DSL
// - IMAGE_EDITOR_RESIZE_EDGE_DSL
// - IMAGE_EDITOR_CANVAS_DATASET
// - IMAGE_EDITOR_SETTINGS_DATASET

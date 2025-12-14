//#region Shapes
/**
 * Maps legacy `lf<Shape>` cell keys to their shape names.
 * @deprecated Use semantic keys with the `shape` property as discriminator instead.
 *
 * **Migration Guide**:
 * ```typescript
 * // Before (deprecated):
 * node.cells.lfButton  // Only one button allowed
 *
 * // After (v4.0.0+):
 * node.cells.primaryAction   // { shape: "button", value: "Submit" }
 * node.cells.secondaryAction // { shape: "button", value: "Cancel" }
 * ```
 *
 * @see LfDataCellContainer for the new flexible cells pattern
 */
export const LF_DATA_SHAPE_MAP = {
  lfAccordion: "accordion",
  lfBadge: "badge",
  lfButton: "button",
  lfCanvas: "canvas",
  lfCard: "card",
  lfChart: "chart",
  lfChat: "chat",
  lfChip: "chip",
  lfCode: "code",
  lfImage: "image",
  lfNumber: "number",
  lfPhotoframe: "photoframe",
  lfProgressbar: "progressbar",
  lfSlot: "slot",
  lfText: "text",
  lfTextfield: "textfield",
  lfToggle: "toggle",
  lfTypewriter: "typewriter",
  lfUpload: "upload",
} as const;
export const LF_DATA_SHAPES = [
  "accordion",
  "badge",
  "button",
  "canvas",
  "card",
  "chart",
  "chat",
  "chip",
  "code",
  "image",
  "number",
  "photoframe",
  "progressbar",
  "slot",
  "text",
  "textfield",
  "toggle",
  "typewriter",
  "upload",
] as const;
//#endregion

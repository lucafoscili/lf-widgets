import { LfCanvasPropsInterface } from "./canvas.declarations";

//#region Blocks
export const LF_CANVAS_BLOCKS = {
  canvas: {
    _: "canvas",
    board: "board",
    image: "image",
    preview: "preview",
  },
} as const;
//#endregion

//#region Brush
export const LF_CANVAS_BRUSH = ["round", "square"] as const;
//#endregion

//#region Cursor
export const LF_CANVAS_CURSOR = ["preview", "default"] as const;
//#endregion

//#region Events
export const LF_CANVAS_EVENTS = [
  "lf-event",
  "ready",
  "stroke",
  "unmount",
] as const;
//#endregion

//#region Parts
export const LF_CANVAS_PARTS = {
  board: "board",
  canvas: "canvas",
  image: "image",
  preview: "preview",
} as const;
//#endregion

//#region Props
export const LF_CANVAS_PROPS = [
  "lfBrush",
  "lfColor",
  "lfCursor",
  "lfImageProps",
  "lfOpacity",
  "lfPreview",
  "lfSize",
  "lfStrokeTolerance",
  "lfStyle",
] as const satisfies (keyof LfCanvasPropsInterface)[];
//#endregion

//#region Types
export const LF_CANVAS_TYPES = ["board", "preview"] as const;
//#endregion

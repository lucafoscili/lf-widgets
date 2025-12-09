/**
 * Image Editor Settings DSL - Drawing Tools
 *
 * Brush, line, and other drawing tool configurations.
 */

import type { LfShapeeditorConfigDsl } from "@lf-widgets/foundations";

import { common, control, extractDefaults } from "../../../controls";

//#region Brush
const brushControls = [
  common.size({
    prefix: "brush",
    min: 1,
    max: 500,
    defaultValue: 150,
    description: "Sets the size of the brush in pixels.",
  }),
  common.opacity("brush", {
    min: 0.05,
    max: 1,
    step: 0.05,
    defaultValue: 0.2,
    description: "Controls brush opacity from transparent to fully opaque.",
  }),
  common.color({
    prefix: "brush",
    defaultValue: "#ff0000",
    swatches: ["#ff0000", "#ffffff", "#000000", "#00bcd4"],
    label: "Brush Color",
    description: "Color used for brush strokes.",
  }),
];

export const IMAGE_EDITOR_BRUSH_DSL: LfShapeeditorConfigDsl = {
  controls: brushControls,
  layout: [
    {
      id: "brush_general",
      label: "Brush",
      controlIds: ["brush_size", "brush_opacity", "brush_color"],
    },
  ],
  defaultSettings: extractDefaults(brushControls),
};
//#endregion

//#region Line
const lineControls = [
  common.size({
    prefix: "line",
    min: 1,
    max: 500,
    defaultValue: 10,
    description: "Sets the thickness of the line.",
  }),
  common.opacity("line", {
    min: 0.05,
    max: 1,
    step: 0.05,
    defaultValue: 1,
    description: "Controls line opacity.",
  }),
  common.color({
    prefix: "line",
    defaultValue: "#ff0000",
    swatches: ["#ff0000", "#ffffff", "#000000", "#00bcd4"],
    label: "Line Color",
    description: "Color used for line strokes.",
  }),
  control.toggle("line_smooth", {
    defaultValue: false,
    label: "Smooth",
    description: "Draws a smooth curved line instead of straight segments.",
  }),
];

export const IMAGE_EDITOR_LINE_DSL: LfShapeeditorConfigDsl = {
  controls: lineControls,
  layout: [
    {
      id: "line_general",
      label: "Line",
      controlIds: ["line_size", "line_opacity", "line_color", "line_smooth"],
    },
  ],
  defaultSettings: extractDefaults(lineControls),
};
//#endregion

/**
 * Image Editor Settings DSL - Basic Adjustments
 *
 * Brightness, contrast, saturation, sharpening, and resize configurations.
 */

import type { LfShapeeditorConfigDsl } from "@lf-widgets/foundations";

import {
  common,
  control,
  extractDefaults,
  RESAMPLE_METHODS,
} from "../../../controls";

//#region Brightness
const brightnessControls = [
  common.strength({
    prefix: "brightness",
    label: "Strength",
    description:
      "Adjust the brightness of the image. Negative values darken, positive values brighten.",
  }),
  common.gamma({ prefix: "brightness" }),
  common.midpoint({ prefix: "brightness" }),
  common.localized("brightness", {
    description: "Enhance brightness locally in darker regions.",
  }),
];

export const IMAGE_EDITOR_BRIGHTNESS_DSL: LfShapeeditorConfigDsl = {
  controls: brightnessControls,
  layout: [
    {
      id: "brightness_general",
      label: "Brightness",
      controlIds: [
        "brightness_strength",
        "brightness_gamma",
        "brightness_midpoint",
        "brightness_localized",
      ],
    },
  ],
  defaultSettings: extractDefaults(brightnessControls),
};
//#endregion

//#region Contrast
const contrastControls = [
  common.strength({
    prefix: "contrast",
    label: "Strength",
    description:
      "Controls the intensity of the contrast adjustment. Below 0 reduces contrast, above 0 increases contrast.",
  }),
  common.midpoint({ prefix: "contrast" }),
  common.localized("contrast", {
    description: "Apply contrast enhancement locally to edges and textures.",
  }),
];

export const IMAGE_EDITOR_CONTRAST_DSL: LfShapeeditorConfigDsl = {
  controls: contrastControls,
  layout: [
    {
      id: "contrast_general",
      label: "Contrast",
      controlIds: [
        "contrast_strength",
        "contrast_midpoint",
        "contrast_localized",
      ],
    },
  ],
  defaultSettings: extractDefaults(contrastControls),
};
//#endregion

//#region Saturation
const saturationControls = [
  common.intensity({
    prefix: "saturation",
    min: 0,
    max: 5,
    step: 0.1,
    defaultValue: 1,
    label: "Intensity",
    description:
      "Controls the intensity of the saturation. 1.0 is no change, below 1 reduces, above 1 increases saturation.",
  }),
];

export const IMAGE_EDITOR_SATURATION_DSL: LfShapeeditorConfigDsl = {
  controls: saturationControls,
  layout: [
    {
      id: "saturation_general",
      label: "Saturation",
      controlIds: ["saturation_intensity"],
    },
  ],
  defaultSettings: extractDefaults(saturationControls),
};
//#endregion

//#region Desaturate
const desaturateControls = [
  common.strength({
    prefix: "desaturate",
    min: 0,
    max: 1,
    label: "Strength",
    description:
      "Controls the intensity of the desaturation. 0 is no effect, 1 is fully desaturated.",
  }),
  ...common.channels("desaturate", {
    description:
      "Controls the intensity of the {channel} channel desaturation relative to the total strength.",
  }),
];

export const IMAGE_EDITOR_DESATURATE_DSL: LfShapeeditorConfigDsl = {
  controls: desaturateControls,
  layout: [
    {
      id: "desaturate_general",
      label: "Desaturate",
      controlIds: [
        "desaturate_strength",
        "desaturate_r_channel",
        "desaturate_g_channel",
        "desaturate_b_channel",
      ],
    },
  ],
  defaultSettings: extractDefaults(desaturateControls),
};
//#endregion

//#region Clarity
const clarityControls = [
  control.slider("clarity_amount", {
    min: -1,
    max: 1,
    step: 0.05,
    defaultValue: 0,
    label: "Clarity Amount",
    description:
      "Lightroom-style clarity. Negative values soften details, positive values boost local contrast.",
  }),
];

export const IMAGE_EDITOR_CLARITY_DSL: LfShapeeditorConfigDsl = {
  controls: clarityControls,
  layout: [
    {
      id: "clarity_general",
      label: "Clarity",
      controlIds: ["clarity_amount"],
    },
  ],
  defaultSettings: extractDefaults(clarityControls),
};
//#endregion

//#region Unsharp Mask
const unsharpMaskControls = [
  control.slider("unsharp_amount", {
    min: 0,
    max: 5,
    step: 0.05,
    defaultValue: 0.5,
    label: "Amount",
    description: "Overall strength applied to the high-frequency detail mask.",
  }),
  common.radius({
    prefix: "unsharp",
    min: 1,
    max: 31,
    step: 2,
    defaultValue: 5,
    label: "Radius",
    description:
      "Gaussian blur kernel size (odd numbers give the best results).",
  }),
  control.slider("unsharp_sigma", {
    min: 0.1,
    max: 5,
    step: 0.1,
    defaultValue: 1,
    label: "Sigma",
    description:
      "Gaussian blur sigma controlling feather softness around edges.",
  }),
  common.threshold({
    prefix: "unsharp",
    description:
      "Skip sharpening for pixels below this normalized contrast level.",
  }),
];

export const IMAGE_EDITOR_UNSHARP_MASK_DSL: LfShapeeditorConfigDsl = {
  controls: unsharpMaskControls,
  layout: [
    {
      id: "unsharp_general",
      label: "Unsharp Mask",
      controlIds: [
        "unsharp_amount",
        "unsharp_radius",
        "unsharp_sigma",
        "unsharp_threshold",
      ],
    },
  ],
  defaultSettings: extractDefaults(unsharpMaskControls),
};
//#endregion

//#region Resize (by edge)
const resizeEdgeControls = [
  control.number("resize_edge_target", {
    min: 64,
    max: 4096,
    step: 16,
    defaultValue: 1024,
    label: "Target Edge (px)",
    description: "Target size for the selected image edge.",
  }),
  control.toggle("resize_edge_longest", {
    defaultValue: true,
    label: "Fit Longest Edge",
    description:
      "When enabled, the longest image edge is resized to the target size; otherwise the shortest edge is used.",
  }),
  control.select("resize_edge_method", {
    options: RESAMPLE_METHODS,
    defaultValue: "bicubic",
    label: "Resample Method",
    description: "Interpolation method used when resizing.",
  }),
];

export const IMAGE_EDITOR_RESIZE_EDGE_DSL: LfShapeeditorConfigDsl = {
  controls: resizeEdgeControls,
  layout: [
    {
      id: "resize_edge_general",
      label: "Resize (by edge)",
      controlIds: [
        "resize_edge_target",
        "resize_edge_longest",
        "resize_edge_method",
      ],
    },
  ],
  defaultSettings: extractDefaults(resizeEdgeControls),
};
//#endregion

//#region Resize (free)
const resizeFreeControls = [
  control.number("resize_free_width", {
    min: 1,
    max: 8192,
    step: 8,
    defaultValue: 832,
    label: "Width (px)",
    description: "Target image width in pixels.",
  }),
  control.number("resize_free_height", {
    min: 1,
    max: 8192,
    step: 8,
    defaultValue: 1216,
    label: "Height (px)",
    description: "Target image height in pixels.",
  }),
  control.select("resize_free_method", {
    options: RESAMPLE_METHODS,
    defaultValue: "bicubic",
    label: "Resample Method",
    description: "Interpolation method used when resizing.",
  }),
  control.select("resize_free_mode", {
    options: [
      { value: "crop", label: "Crop" },
      { value: "pad", label: "Pad" },
    ],
    defaultValue: "crop",
    label: "Resize Mode",
    description:
      "Choose whether to crop or pad when matching the target dimensions.",
  }),
  control.colorpicker("resize_free_pad_color", {
    defaultValue: "#000000",
    label: "Padding Color",
    description: "Hex color used when padding (only when mode is set to pad).",
  }),
];

export const IMAGE_EDITOR_RESIZE_FREE_DSL: LfShapeeditorConfigDsl = {
  controls: resizeFreeControls,
  layout: [
    {
      id: "resize_free_general",
      label: "Resize (free)",
      controlIds: [
        "resize_free_width",
        "resize_free_height",
        "resize_free_method",
        "resize_free_mode",
        "resize_free_pad_color",
      ],
    },
  ],
  defaultSettings: extractDefaults(resizeFreeControls),
};
//#endregion

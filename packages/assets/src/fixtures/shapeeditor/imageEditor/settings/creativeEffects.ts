/**
 * Image Editor Settings DSL - Creative Effects
 *
 * Artistic filters: blend, bloom, film grain, gaussian blur, sepia, split tone,
 * tilt-shift, vibrance, and vignette.
 */

import type { LfShapeeditorConfigDsl } from "@lf-widgets/foundations";

import { common, control, extractDefaults } from "../../../controls";

//#region Blend
const blendControls = [
  common.opacity("blend", {
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 0,
    label: "Opacity",
    description: "Adjust the opacity of the blended layer.",
  }),
  common.color({
    prefix: "blend",
    defaultValue: "#ff0000",
    label: "Color",
    description: "Sets the solid color that will be blended onto the image.",
  }),
];

export const IMAGE_EDITOR_BLEND_DSL: LfShapeeditorConfigDsl = {
  controls: blendControls,
  layout: [
    {
      id: "blend_general",
      label: "Blend",
      controlIds: ["blend_opacity", "blend_color"],
    },
  ],
  defaultSettings: extractDefaults(blendControls),
};
//#endregion

//#region Bloom
const bloomControls = [
  common.intensity({
    prefix: "bloom",
    min: 0,
    max: 2,
    step: 0.05,
    defaultValue: 0.6,
    label: "Intensity",
    description:
      "How strong the bloom reads after compositing. 1.0 = add the blurred highlights at full strength.",
  }),
  common.radius({
    prefix: "bloom",
    min: 3,
    max: 127,
    defaultValue: 15,
    label: "Radius",
    description:
      "Blur radius in pixels (odd numbers only). Bigger radius → softer, more cinematic glow.",
  }),
  common.threshold({
    prefix: "bloom",
    defaultValue: 0.8,
    description:
      "Bright-pass cutoff. 0 = everything glows, 1 = nothing glows. For dim scenes start around 0.15-0.35.",
  }),
  common.tint({
    prefix: "bloom",
    label: "Tint Color",
    description:
      "Hex color for the glow. Pure white #FFFFFF keeps original hue.",
  }),
];

export const IMAGE_EDITOR_BLOOM_DSL: LfShapeeditorConfigDsl = {
  controls: bloomControls,
  layout: [
    {
      id: "bloom_general",
      label: "Bloom",
      controlIds: [
        "bloom_intensity",
        "bloom_radius",
        "bloom_threshold",
        "bloom_tint",
      ],
    },
  ],
  defaultSettings: extractDefaults(bloomControls),
};
//#endregion

//#region Film Grain
const filmGrainControls = [
  common.intensity({
    prefix: "filmGrain",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0,
    label: "Intensity",
    description: "Sets the strength of the film grain effect.",
  }),
  common.size({
    prefix: "filmGrain",
    min: 0.5,
    max: 5,
    step: 0.1,
    defaultValue: 1,
    label: "Size",
    description: "Sets the size of the noise granularity.",
  }),
  common.tint({
    prefix: "filmGrain",
    description: "Hexadecimal color (default is #FFFFFF for no tint).",
  }),
  control.toggle("filmGrain_softBlend", {
    defaultValue: false,
    label: "Soft Blend",
    description: "If true, uses a soft blending mode for the grain.",
  }),
];

export const IMAGE_EDITOR_FILM_GRAIN_DSL: LfShapeeditorConfigDsl = {
  controls: filmGrainControls,
  layout: [
    {
      id: "filmGrain_general",
      label: "Film Grain",
      controlIds: [
        "filmGrain_intensity",
        "filmGrain_size",
        "filmGrain_tint",
        "filmGrain_softBlend",
      ],
    },
  ],
  defaultSettings: extractDefaults(filmGrainControls),
};
//#endregion

//#region Gaussian Blur
const gaussianBlurControls = [
  control.slider("gaussianBlur_sigma", {
    min: 0.1,
    max: 10,
    step: 0.1,
    defaultValue: 0,
    label: "Blur Sigma",
    description:
      "Standard deviation for the Gaussian kernel. Controls blur intensity.",
  }),
  control.slider("gaussianBlur_kernelSize", {
    min: 1,
    max: 51,
    step: 2,
    defaultValue: 7,
    label: "Kernel Size",
    description:
      "Controls the size of the Gaussian blur kernel. Higher values mean more smoothing.",
  }),
];

export const IMAGE_EDITOR_GAUSSIAN_BLUR_DSL: LfShapeeditorConfigDsl = {
  controls: gaussianBlurControls,
  layout: [
    {
      id: "gaussianBlur_general",
      label: "Gaussian Blur",
      controlIds: ["gaussianBlur_sigma", "gaussianBlur_kernelSize"],
    },
  ],
  defaultSettings: extractDefaults(gaussianBlurControls),
};
//#endregion

//#region Sepia
const sepiaControls = [
  common.intensity({
    prefix: "sepia",
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 0,
    label: "Intensity",
    description: "Controls the intensity of the sepia effect.",
  }),
];

export const IMAGE_EDITOR_SEPIA_DSL: LfShapeeditorConfigDsl = {
  controls: sepiaControls,
  layout: [
    {
      id: "sepia_general",
      label: "Sepia",
      controlIds: ["sepia_intensity"],
    },
  ],
  defaultSettings: extractDefaults(sepiaControls),
};
//#endregion

//#region Split Tone
const splitToneControls = [
  common.intensity({
    prefix: "splitTone",
    min: 0,
    max: 2,
    step: 0.05,
    defaultValue: 0.6,
    label: "Intensity",
    description: "Strength of the tint applied.",
  }),
  control.slider("splitTone_balance", {
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 0.5,
    label: "Balance",
    description:
      "Luminance pivot. 0 = lift even deep blacks; 1 = tint only the brightest pixels.",
  }),
  control.slider("splitTone_softness", {
    min: 0.01,
    max: 0.5,
    step: 0.01,
    defaultValue: 0.25,
    label: "Softness",
    description: "Width of the transition band around the balance value.",
  }),
  control.colorpicker("splitTone_highlights", {
    defaultValue: "#ffaa55",
    label: "Highlights",
    description: "Hex colour applied to highlights.",
  }),
  control.colorpicker("splitTone_shadows", {
    defaultValue: "#0066ff",
    label: "Shadows",
    description: "Hex colour applied to shadows.",
  }),
];

export const IMAGE_EDITOR_SPLIT_TONE_DSL: LfShapeeditorConfigDsl = {
  controls: splitToneControls,
  layout: [
    {
      id: "splitTone_general",
      label: "Split Tone",
      controlIds: [
        "splitTone_intensity",
        "splitTone_balance",
        "splitTone_softness",
        "splitTone_highlights",
        "splitTone_shadows",
      ],
    },
  ],
  defaultSettings: extractDefaults(splitToneControls),
};
//#endregion

//#region Tilt-Shift
const tiltShiftControls = [
  control.slider("tiltShift_focusPosition", {
    min: 0,
    max: 1,
    step: 0.01,
    defaultValue: 0.5,
    label: "Focus Position",
    description: "Vertical center of the sharp band (0 = top, 1 = bottom).",
  }),
  control.slider("tiltShift_focusSize", {
    min: 0.05,
    max: 0.9,
    step: 0.01,
    defaultValue: 0.25,
    label: "Focus Size",
    description: "Height of the sharp zone as a fraction of the image.",
  }),
  common.radius({
    prefix: "tiltShift",
    min: 3,
    max: 151,
    defaultValue: 25,
    label: "Blur Radius",
    description:
      "Gaussian radius for out-of-focus areas. Higher values mean more blur.",
  }),
  control.toggle("tiltShift_smooth", {
    defaultValue: false,
    label: "Smooth Fall-off",
    description:
      "Linear means constant fall-off, smooth means gradual transition.",
  }),
  control.toggle("tiltShift_vertical", {
    defaultValue: false,
    label: "Vertical Orientation",
    description:
      "Horizontal means the focus band is horizontal, vertical means it is vertical.",
  }),
];

export const IMAGE_EDITOR_TILT_SHIFT_DSL: LfShapeeditorConfigDsl = {
  controls: tiltShiftControls,
  layout: [
    {
      id: "tiltShift_general",
      label: "Tilt-Shift",
      controlIds: [
        "tiltShift_focusPosition",
        "tiltShift_focusSize",
        "tiltShift_radius",
        "tiltShift_smooth",
        "tiltShift_vertical",
      ],
    },
  ],
  defaultSettings: extractDefaults(tiltShiftControls),
};
//#endregion

//#region Vibrance
const vibranceControls = [
  common.intensity({
    prefix: "vibrance",
    min: -1,
    max: 2,
    step: 0.05,
    defaultValue: 0,
    label: "Intensity",
    description:
      "Controls vibrance. Negative values reduce, positive values increase vibrance.",
  }),
  control.toggle("vibrance_protectSkin", {
    defaultValue: true,
    label: "Protect Skin Tones",
    description:
      "If true, skin tones are less affected by the vibrance adjustment.",
  }),
  control.toggle("vibrance_clipSoft", {
    defaultValue: true,
    label: "Clip Softly",
    description:
      "If true, saturation is rolled off near maximum to avoid clipping.",
  }),
];

export const IMAGE_EDITOR_VIBRANCE_DSL: LfShapeeditorConfigDsl = {
  controls: vibranceControls,
  layout: [
    {
      id: "vibrance_general",
      label: "Vibrance",
      controlIds: [
        "vibrance_intensity",
        "vibrance_protectSkin",
        "vibrance_clipSoft",
      ],
    },
  ],
  defaultSettings: extractDefaults(vibranceControls),
};
//#endregion

//#region Vignette
const vignetteControls = [
  common.intensity({
    prefix: "vignette",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0,
    label: "Intensity",
    description:
      "Controls the darkness of the vignette effect. Higher values mean darker edges.",
  }),
  common.radius({
    prefix: "vignette",
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0,
    label: "Radius",
    description:
      "Controls the size of the vignette effect. Lower values mean a smaller vignette.",
  }),
  common.color({
    prefix: "vignette",
    defaultValue: "#000000",
    label: "Color",
    description: "Sets the color of the vignette.",
  }),
  control.toggle("vignette_circular", {
    defaultValue: false,
    label: "Circular",
    description:
      "Selects the shape of the vignette effect, defaults to elliptical.",
  }),
];

export const IMAGE_EDITOR_VIGNETTE_DSL: LfShapeeditorConfigDsl = {
  controls: vignetteControls,
  layout: [
    {
      id: "vignette_general",
      label: "Vignette",
      controlIds: [
        "vignette_intensity",
        "vignette_radius",
        "vignette_color",
        "vignette_circular",
      ],
    },
  ],
  defaultSettings: extractDefaults(vignetteControls),
};
//#endregion

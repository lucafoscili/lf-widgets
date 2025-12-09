/**
 * Image Editor Settings DSL - Diffusion Tools
 *
 * Inpaint and outpaint configurations for AI-powered image editing.
 * These tools leverage a connected diffusion model for sophisticated retouching.
 */

import type { LfShapeeditorConfigDsl } from "@lf-widgets/foundations";

import {
  common,
  control,
  extractDefaults,
  SAMPLER_OPTIONS,
  SCHEDULER_OPTIONS,
} from "../../../controls";

//#region Inpaint
const inpaintControls = [
  // Conditioning
  ...common.prompts("inpaint"),
  control.slider("inpaint_conditioningMix", {
    min: -1,
    max: 1,
    step: 0.1,
    defaultValue: 0,
    label: "Conditioning Mix",
    description:
      "-1=input only, 0=concat, 1=prompts only. Intermediate values blend between input and prompts.",
  }),
  control.toggle("inpaint_wd14Tagging", {
    defaultValue: false,
    label: "WD14 Tagging",
    description:
      "Automatically tag the inpaint patch with WD14 and add tags to conditioning.",
  }),

  // Sampling
  common.denoise({
    prefix: "inpaint",
    defaultValue: 40,
    description:
      "Noise applied during inpaint. 0 keeps original pixels, 100 fully regenerates.",
  }),
  control.select("inpaint_sampler", {
    options: SAMPLER_OPTIONS,
    defaultValue: "dpmpp_2m",
    label: "Sampler",
    description: "Sampler used for inpaint diffusion steps.",
  }),
  control.select("inpaint_scheduler", {
    options: SCHEDULER_OPTIONS,
    defaultValue: "karras",
    label: "Scheduler",
    description: "Scheduler used for inpaint diffusion steps.",
  }),
  common.cfg({
    prefix: "inpaint",
    description: "Classifier-free guidance applied during the inpaint pass.",
  }),
  common.steps({
    prefix: "inpaint",
    max: 30,
    defaultValue: 16,
    description: "Diffusion steps used for the inpaint sampler.",
  }),
  common.seed({ prefix: "inpaint" }),

  // ROI (Region of Interest)
  control.slider("inpaint_upsampleTarget", {
    min: 0,
    max: 2048,
    step: 16,
    defaultValue: 2048,
    label: "Upsample Target (px)",
    description:
      "Detailer path: upscale ROI longer side to this size before inpaint (0 disables).",
  }),
  control.toggle("inpaint_applyUnsharpMask", {
    defaultValue: true,
    label: "Apply Unsharp Mask",
    description:
      "Apply a gentle unsharp mask after downscaling the inpainted region.",
  }),
  common.dilate({
    prefix: "inpaint",
    description: "Expand mask edges before inpaint to avoid seams.",
  }),
  common.feather({
    prefix: "inpaint",
    description: "Soften mask edges to blend the inpainted region.",
  }),
  control.slider("inpaint_roiPadding", {
    min: 0,
    max: 256,
    step: 1,
    defaultValue: 32,
    unit: "px",
    label: "ROI Padding",
    description:
      "Pixels of padding around the mask bounding box when cropping the ROI.",
  }),
  control.slider("inpaint_roiAlign", {
    min: 1,
    max: 64,
    step: 1,
    defaultValue: 8,
    label: "ROI Align Multiple",
    description:
      "Align ROI size/position to this multiple. Keeps latent-friendly dims.",
  }),
  control.toggle("inpaint_roiAlignAuto", {
    defaultValue: false,
    label: "Auto-align ROI",
    description:
      "Infer alignment multiple from VAE/model. Disable to set a manual multiple.",
  }),
  control.slider("inpaint_roiMinSize", {
    min: 1,
    max: 1024,
    step: 1,
    defaultValue: 64,
    unit: "px",
    label: "ROI Min Size",
    description: "Enforce a minimum width/height for the cropped ROI.",
  }),
];

export const IMAGE_EDITOR_INPAINT_DSL: LfShapeeditorConfigDsl = {
  controls: inpaintControls,
  layout: [
    {
      id: "inpaint_conditioning",
      label: "Conditioning",
      icon: "robot",
      controlIds: [
        "inpaint_positivePrompt",
        "inpaint_negativePrompt",
        "inpaint_conditioningMix",
        "inpaint_wd14Tagging",
      ],
    },
    {
      id: "inpaint_sampling",
      label: "Sampling",
      icon: "wand",
      controlIds: [
        "inpaint_denoisePercentage",
        "inpaint_sampler",
        "inpaint_scheduler",
        "inpaint_cfg",
        "inpaint_steps",
        "inpaint_seed",
      ],
    },
    {
      id: "inpaint_roi",
      label: "Region of Interest",
      icon: "image-in-picture",
      controlIds: [
        "inpaint_upsampleTarget",
        "inpaint_applyUnsharpMask",
        "inpaint_dilate",
        "inpaint_feather",
        "inpaint_roiPadding",
        "inpaint_roiAlign",
        "inpaint_roiAlignAuto",
        "inpaint_roiMinSize",
      ],
    },
  ],
  defaultSettings: extractDefaults(inpaintControls),
};
//#endregion

//#region Outpaint
const outpaintControls = [
  // Conditioning
  ...common.prompts("outpaint"),
  control.slider("outpaint_conditioningMix", {
    min: -1,
    max: 1,
    step: 0.1,
    defaultValue: 0,
    label: "Conditioning Mix",
    description:
      "-1=input only, 0=concat, 1=prompts only. Intermediate values blend.",
  }),
  control.toggle("outpaint_wd14Tagging", {
    defaultValue: false,
    label: "WD14 Tagging",
    description:
      "Automatically tag the outpaint patch with WD14 and add tags to conditioning.",
  }),

  // Sampling
  common.denoise({
    prefix: "outpaint",
    defaultValue: 60,
    description:
      "Noise applied during outpaint. 0 keeps original pixels, 100 fully regenerates.",
  }),
  control.select("outpaint_sampler", {
    options: SAMPLER_OPTIONS,
    defaultValue: "dpmpp_2m",
    label: "Sampler",
    description: "Sampler used for outpaint diffusion steps.",
  }),
  control.select("outpaint_scheduler", {
    options: SCHEDULER_OPTIONS,
    defaultValue: "normal",
    label: "Scheduler",
    description: "Scheduler used for outpaint diffusion steps.",
  }),
  common.cfg({
    prefix: "outpaint",
    description: "Classifier-free guidance applied during the outpaint pass.",
  }),
  common.steps({
    prefix: "outpaint",
    defaultValue: 24,
    description: "Diffusion steps used when outpainting.",
  }),

  // Region
  control.slider("outpaint_amount", {
    min: 8,
    max: 1024,
    step: 8,
    defaultValue: 256,
    unit: "px",
    label: "Outpaint Amount",
    description: "Expand canvas by this many pixels on edges touched by brush.",
  }),
  common.feather({
    prefix: "outpaint",
    defaultValue: 12,
    description: "Soften mask edges to blend the outpainted region.",
  }),
];

export const IMAGE_EDITOR_OUTPAINT_DSL: LfShapeeditorConfigDsl = {
  controls: outpaintControls,
  layout: [
    {
      id: "outpaint_conditioning",
      label: "Conditioning",
      icon: "robot",
      controlIds: [
        "outpaint_positivePrompt",
        "outpaint_negativePrompt",
        "outpaint_conditioningMix",
        "outpaint_wd14Tagging",
      ],
    },
    {
      id: "outpaint_sampling",
      label: "Sampling",
      icon: "wand",
      controlIds: [
        "outpaint_denoisePercentage",
        "outpaint_sampler",
        "outpaint_scheduler",
        "outpaint_cfg",
        "outpaint_steps",
      ],
    },
    {
      id: "outpaint_region",
      label: "Region",
      icon: "arrow-autofit-content",
      controlIds: ["outpaint_amount", "outpaint_feather"],
    },
  ],
  defaultSettings: extractDefaults(outpaintControls),
};
//#endregion

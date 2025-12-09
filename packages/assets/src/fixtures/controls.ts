import type {
  LfShapeeditorCheckboxConfig,
  LfShapeeditorColorpickerConfig,
  LfShapeeditorControlConfig,
  LfShapeeditorMultiinputConfig,
  LfShapeeditorNumberConfig,
  LfShapeeditorSelectConfig,
  LfShapeeditorSliderConfig,
  LfShapeeditorTextfieldConfig,
  LfShapeeditorToggleConfig,
} from "@lf-widgets/foundations";

//#region Utilities
/**
 * Converts a control ID to a human-readable label.
 * - Replaces underscores and hyphens with spaces
 * - Capitalizes each word
 *
 * @example
 * idToLabel("brush_size") // "Brush Size"
 * idToLabel("neon-glow") // "Neon Glow"
 * idToLabel("followPointer") // "Follow Pointer" (camelCase support)
 */
const idToLabel = (id: string): string => {
  return id
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to spaces
    .replace(/[_-]/g, " ") // underscores/hyphens to spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize words
};
//#endregion

//#region Factory Types
/**
 * Options for colorpicker control factory.
 */
export interface ColorpickerOptions {
  defaultValue: string;
  swatches?: string[];
  label?: string;
  description?: string;
}
/**
 * Options for multiinput control factory.
 */
export interface MultiinputOptions {
  defaultValue: string;
  placeholder?: string;
  label?: string;
  description?: string;
}
/**
 * Options for number control factory.
 */
export interface NumberOptions {
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
}
/**
 * Single option for a select control.
 */
export interface SelectOption {
  value: string;
  label: string;
}
/**
 * Options for select control factory.
 */
export interface SelectOptions {
  options: SelectOption[];
  defaultValue: string;
  label?: string;
  description?: string;
}
/**
 * Options for slider control factory.
 */
export interface SliderOptions {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  /** Optional unit suffix (e.g., "px", "%", "ms", "°"). */
  unit?: string;
  /** Optional custom label (auto-generated from id if omitted). */
  label?: string;
  /** Optional description/tooltip. */
  description?: string;
}
/**
 * Options for textfield control factory.
 */
export interface TextfieldOptions {
  defaultValue: string;
  placeholder?: string;
  pattern?: string;
  label?: string;
  description?: string;
}
/**
 * Options for toggle/checkbox control factory.
 */
export interface ToggleOptions {
  defaultValue: boolean;
  label?: string;
  description?: string;
}
//#endregion

/**
 * Factory functions for creating shapeeditor control configurations.
 * Auto-generates labels from IDs and provides consistent typing.
 *
 * @example
 * ```typescript
 * const controls = [
 *   control.slider("intensity", { min: 0, max: 1, step: 0.05, defaultValue: 0.8 }),
 *   control.toggle("enabled", { defaultValue: false }),
 *   control.select("mode", {
 *     options: [{ value: "auto", label: "Auto" }, { value: "manual", label: "Manual" }],
 *     defaultValue: "auto"
 *   }),
 * ];
 * ```
 */
export const control = {
  //#region Checkbox
  /**
   * Creates a checkbox control configuration.
   * Alternative to toggle for boolean settings.
   */
  checkbox: (
    id: string,
    options: ToggleOptions,
  ): LfShapeeditorCheckboxConfig => ({
    id,
    type: "checkbox",
    label: options.label ?? idToLabel(id),
    description: options.description,
    defaultValue: options.defaultValue,
  }),
  //#endregion
  //#region Colorpicker
  /**
   * Creates a colorpicker control configuration.
   * Best for color selection with optional preset swatches.
   */
  colorpicker: (
    id: string,
    options: ColorpickerOptions,
  ): LfShapeeditorColorpickerConfig => ({
    id,
    type: "colorpicker",
    label: options.label ?? idToLabel(id),
    description: options.description,
    defaultValue: options.defaultValue,
    swatches: options.swatches,
  }),
  //#endregion
  //#region Multiinput
  /**
   * Creates a multiinput control configuration.
   * Best for multiple comma-separated values.
   */
  multiinput: (
    id: string,
    options: MultiinputOptions,
  ): LfShapeeditorMultiinputConfig => ({
    id,
    type: "multiinput",
    label: options.label ?? idToLabel(id),
    description: options.description,
    defaultValue: options.defaultValue,
    placeholder: options.placeholder,
  }),
  //#endregion
  //#region Number
  /**
   * Creates a number input control configuration.
   * Best for numeric values without a visual slider.
   */
  number: (id: string, options: NumberOptions): LfShapeeditorNumberConfig => ({
    id,
    type: "number",
    label: options.label ?? idToLabel(id),
    description: options.description,
    min: options.min,
    max: options.max,
    step: options.step,
    defaultValue: options.defaultValue,
  }),
  //#endregion
  //#region Select
  /**
   * Creates a select/dropdown control configuration.
   * Best for discrete choices from a predefined set.
   */
  select: (id: string, options: SelectOptions): LfShapeeditorSelectConfig => ({
    id,
    type: "select",
    label: options.label ?? idToLabel(id),
    description: options.description,
    options: options.options,
    defaultValue: options.defaultValue,
  }),
  //#endregion
  //#region Slider
  /**
   * Creates a slider control configuration.
   * Best for continuous numeric ranges with visual feedback.
   */
  slider: (id: string, options: SliderOptions): LfShapeeditorSliderConfig => ({
    id,
    type: "slider",
    label: options.label ?? idToLabel(id),
    description: options.description,
    min: options.min,
    max: options.max,
    step: options.step,
    defaultValue: options.defaultValue,
    unit: options.unit,
  }),
  //#endregion
  //#region Textfield
  /**
   * Creates a textfield control configuration.
   * Best for free-form text or CSS values.
   */
  textfield: (
    id: string,
    options: TextfieldOptions,
  ): LfShapeeditorTextfieldConfig => ({
    id,
    type: "textfield",
    label: options.label ?? idToLabel(id),
    description: options.description,
    defaultValue: options.defaultValue,
    placeholder: options.placeholder,
    pattern: options.pattern,
  }),
  //#endregion
  //#region Toggle
  /**
   * Creates a toggle switch control configuration.
   * Best for on/off boolean settings.
   */
  toggle: (id: string, options: ToggleOptions): LfShapeeditorToggleConfig => ({
    id,
    type: "toggle",
    label: options.label ?? idToLabel(id),
    description: options.description,
    defaultValue: options.defaultValue,
  }),
  //#endregion
};
//#endregion

/**
 * Pre-configured control templates for commonly used patterns.
 * These reduce boilerplate for frequently repeated controls.
 *
 * @example
 * ```typescript
 * const controls = [
 *   common.enabled("spotlight"),           // "spotlight_enabled" toggle
 *   common.intensity(),                    // 0-1 intensity slider
 *   common.duration({ max: 2000 }),        // duration slider with custom max
 *   common.opacity("brush"),               // "brush_opacity" slider
 * ];
 * ```
 */
export const common = {
  //#region Angle (slider)
  /**
   * Creates an angle slider in degrees.
   * Configurable range with sensible defaults for rotations.
   */
  angle: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_angle` : "angle";
    return control.slider(id, {
      min: 0,
      max: 360,
      step: 5,
      defaultValue: 45,
      unit: "°",
      label: "Angle",
      description: "Angle in degrees",
      ...options,
    });
  },
  //#endregion
  //#region Blur (slider)
  /**
   * Creates a blur radius slider in pixels.
   * Common for shadow/glow effects.
   */
  blur: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_blur` : "blur";
    return control.slider(id, {
      min: 0,
      max: 50,
      step: 1,
      defaultValue: 10,
      unit: "px",
      label: "Blur",
      description: "Blur radius in pixels",
      ...options,
    });
  },
  //#endregion
  //#region Color (colorpicker)
  /**
   * Creates a color picker with optional preset swatches.
   * Includes commonly used color presets by default.
   */
  color: (
    options?: Partial<ColorpickerOptions> & { prefix?: string },
  ): LfShapeeditorColorpickerConfig => {
    const id = options?.prefix ? `${options.prefix}_color` : "color";
    return control.colorpicker(id, {
      defaultValue: "#ffffff",
      swatches: ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"],
      label: "Color",
      description: "Select a color",
      ...options,
    });
  },
  //#endregion
  //#region Duration (slider)
  /**
   * Creates a duration slider in milliseconds.
   * Configurable range with sensible defaults.
   */
  duration: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_duration` : "duration";
    return control.slider(id, {
      min: 100,
      max: 2000,
      step: 50,
      defaultValue: 500,
      unit: "ms",
      label: "Duration",
      description: "Animation duration in milliseconds",
      ...options,
    });
  },
  //#endregion
  //#region Enabled (toggle)
  /**
   * Creates an "enabled" toggle for a feature/effect.
   * Uses prefixed ID pattern: `{prefix}_enabled`
   */
  enabled: (
    prefix: string,
    options?: Partial<ToggleOptions>,
  ): LfShapeeditorToggleConfig =>
    control.toggle(`${prefix}_enabled`, {
      defaultValue: false,
      label: "Enabled",
      description: `Toggle ${idToLabel(prefix).toLowerCase()} on/off`,
      ...options,
    }),
  //#endregion
  //#region Intensity (slider)
  /**
   * Creates a standard 0-1 intensity slider.
   * Common for effect strengths, opacities, and similar values.
   */
  intensity: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_intensity` : "intensity";
    return control.slider(id, {
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.8,
      label: "Intensity",
      description: "Controls the intensity level",
      ...options,
    });
  },
  //#endregion
  //#region Offset (slider)
  /**
   * Creates an offset slider (can be negative).
   * Common for position adjustments.
   */
  offset: (
    options?: Partial<SliderOptions> & { prefix?: string; axis?: "x" | "y" },
  ): LfShapeeditorSliderConfig => {
    const axis = options?.axis ?? "";
    const suffix = axis ? `_${axis}` : "";
    const id = options?.prefix
      ? `${options.prefix}_offset${suffix}`
      : `offset${suffix}`;
    return control.slider(id, {
      min: -100,
      max: 100,
      step: 1,
      defaultValue: 0,
      unit: "px",
      label: axis ? `Offset ${axis.toUpperCase()}` : "Offset",
      description: `Offset in pixels${axis ? ` (${axis} axis)` : ""}`,
      ...options,
    });
  },
  //#endregion
  //#region Opacity (slider)
  /**
   * Creates a standard 0-1 opacity slider.
   * Uses prefixed ID pattern if prefix provided.
   */
  opacity: (
    prefix?: string,
    options?: Partial<SliderOptions>,
  ): LfShapeeditorSliderConfig => {
    const id = prefix ? `${prefix}_opacity` : "opacity";
    return control.slider(id, {
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 1,
      label: "Opacity",
      description:
        "Controls transparency from fully transparent to fully opaque",
      ...options,
    });
  },
  //#endregion
  //#region Percentage (slider)
  /**
   * Creates a percentage slider (0-100).
   * Common for progress, completion, threshold values.
   */
  percentage: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_percentage` : "percentage";
    return control.slider(id, {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
      unit: "%",
      label: "Percentage",
      description: "Percentage value",
      ...options,
    });
  },
  //#endregion
  //#region Scale (slider)
  /**
   * Creates a scale/multiplier slider.
   * Common for zoom levels, size multipliers, etc.
   */
  scale: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_scale` : "scale";
    return control.slider(id, {
      min: 0.1,
      max: 3,
      step: 0.1,
      defaultValue: 1,
      label: "Scale",
      description: "Scale multiplier",
      ...options,
    });
  },
  //#endregion
  //#region Size (slider)
  /**
   * Creates a size slider in pixels.
   * Configurable range for dimensions, brush sizes, etc.
   */
  size: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_size` : "size";
    return control.slider(id, {
      min: 1,
      max: 500,
      step: 1,
      defaultValue: 100,
      unit: "px",
      label: "Size",
      description: "Size in pixels",
      ...options,
    });
  },
  //#endregion
  //#region Spacing (slider)
  /**
   * Creates a padding/margin slider in pixels.
   * Common for spacing controls.
   */
  spacing: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_spacing` : "spacing";
    return control.slider(id, {
      min: 0,
      max: 100,
      step: 4,
      defaultValue: 16,
      unit: "px",
      label: "Spacing",
      description: "Spacing in pixels",
      ...options,
    });
  },
  //#endregion
  //#region Speed (slider)
  /**
   * Creates a speed/rate slider.
   * Common for animation speeds, pulse rates, etc.
   */
  speed: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_speed` : "speed";
    return control.slider(id, {
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
      label: "Speed",
      description: "Speed multiplier",
      ...options,
    });
  },
  //#endregion
  //#region Strength (slider)
  /**
   * Creates a strength slider.
   * Common for filter intensities (brightness, contrast, desaturate).
   */
  strength: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_strength` : "strength";
    return control.slider(id, {
      min: -1,
      max: 1,
      step: 0.05,
      defaultValue: 0,
      label: "Strength",
      description: "Controls the strength of the effect",
      ...options,
    });
  },
  //#endregion
  //#region Gamma (slider)
  /**
   * Creates a gamma correction slider.
   * Values < 1 brighten shadows, > 1 darken highlights.
   */
  gamma: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_gamma` : "gamma";
    return control.slider(id, {
      min: 0.1,
      max: 3,
      step: 0.1,
      defaultValue: 1,
      label: "Gamma",
      description:
        "Gamma correction. Values < 1 brighten shadows, > 1 darken highlights.",
      ...options,
    });
  },
  //#endregion
  //#region Midpoint (slider)
  /**
   * Creates a tonal midpoint slider.
   * Defines the pivot point for brightness/contrast scaling.
   */
  midpoint: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_midpoint` : "midpoint";
    return control.slider(id, {
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.5,
      label: "Midpoint",
      description: "Defines the tonal midpoint for scaling.",
      ...options,
    });
  },
  //#endregion
  //#region Localized (toggle)
  /**
   * Creates a localized processing toggle.
   * Applies effect locally rather than globally.
   */
  localized: (
    prefix: string,
    options?: Partial<ToggleOptions>,
  ): LfShapeeditorToggleConfig =>
    control.toggle(`${prefix}_localized`, {
      defaultValue: false,
      label: "Localized",
      description: "Apply effect locally to relevant regions.",
      ...options,
    }),
  //#endregion
  //#region Threshold (slider)
  /**
   * Creates a normalized 0-1 threshold slider.
   * Common for bright-pass cutoffs, contrast limits, etc.
   */
  threshold: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_threshold` : "threshold";
    return control.slider(id, {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0,
      label: "Threshold",
      description: "Skip effect for values below this threshold.",
      ...options,
    });
  },
  //#endregion
  //#region Radius (slider)
  /**
   * Creates a blur/kernel radius slider in pixels.
   * Common for gaussian blur, bloom, unsharp mask.
   */
  radius: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_radius` : "radius";
    return control.slider(id, {
      min: 1,
      max: 51,
      step: 2,
      defaultValue: 5,
      unit: "px",
      label: "Radius",
      description: "Kernel radius in pixels (odd numbers work best).",
      ...options,
    });
  },
  //#endregion
  //#region Tint (colorpicker)
  /**
   * Creates a tint colorpicker with white default.
   * Common for film grain, bloom, and other overlay effects.
   */
  tint: (
    options?: Partial<ColorpickerOptions> & { prefix?: string },
  ): LfShapeeditorColorpickerConfig => {
    const id = options?.prefix ? `${options.prefix}_tint` : "tint";
    return control.colorpicker(id, {
      defaultValue: "#ffffff",
      label: "Tint",
      description: "Tint color (white = no tint).",
      ...options,
    });
  },
  //#endregion
  //#region Channel (slider)
  /**
   * Creates an RGB channel slider (0-1 range).
   * Common for channel-specific adjustments.
   */
  channel: (
    prefix: string,
    channel: "r" | "g" | "b",
    options?: Partial<SliderOptions>,
  ): LfShapeeditorSliderConfig => {
    const labels = { r: "Red Channel", g: "Green Channel", b: "Blue Channel" };
    const descriptions = {
      r: "Controls the red channel intensity.",
      g: "Controls the green channel intensity.",
      b: "Controls the blue channel intensity.",
    };
    return control.slider(`${prefix}_${channel}_channel`, {
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 1,
      label: labels[channel],
      description: descriptions[channel],
      ...options,
    });
  },
  /**
   * Creates RGB channel sliders as an array.
   * Convenience for filters that adjust all three channels.
   */
  channels: (
    prefix: string,
    options?: Partial<SliderOptions>,
  ): LfShapeeditorSliderConfig[] => [
    common.channel(prefix, "r", options),
    common.channel(prefix, "g", options),
    common.channel(prefix, "b", options),
  ],
  //#endregion
  //#region Feather (slider)
  /**
   * Creates a feather mask slider in pixels.
   * Softens edges for masking/compositing.
   */
  feather: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_feather` : "feather";
    return control.slider(id, {
      min: 0,
      max: 64,
      step: 1,
      defaultValue: 0,
      unit: "px",
      label: "Feather Mask",
      description: "Soften mask edges to blend regions.",
      ...options,
    });
  },
  //#endregion
  //#region Dilate (slider)
  /**
   * Creates a dilate mask slider in pixels.
   * Expands mask edges to avoid seams.
   */
  dilate: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_dilate` : "dilate";
    return control.slider(id, {
      min: 0,
      max: 64,
      step: 1,
      defaultValue: 0,
      unit: "px",
      label: "Dilate Mask",
      description: "Expand mask edges before processing.",
      ...options,
    });
  },
  //#endregion
  //#region Seed (textfield)
  /**
   * Creates a seed textfield for random generation.
   * -1 means random seed.
   */
  seed: (
    options?: Partial<TextfieldOptions> & { prefix?: string },
  ): LfShapeeditorTextfieldConfig => {
    const id = options?.prefix ? `${options.prefix}_seed` : "seed";
    return control.textfield(id, {
      defaultValue: "-1",
      placeholder: "-1 for random",
      label: "Seed",
      description: "Optional seed override. Leave at -1 for a random seed.",
      ...options,
    });
  },
  //#endregion
  //#region Prompt (multiinput)
  /**
   * Creates a prompt multiinput for diffusion models.
   * Use variant: "positive" or "negative".
   */
  prompt: (
    prefix: string,
    variant: "positive" | "negative",
    options?: Partial<MultiinputOptions>,
  ): LfShapeeditorMultiinputConfig => {
    const labels = {
      positive: "Positive Prompt",
      negative: "Negative Prompt",
    };
    const placeholders = {
      positive: "Enter tags or prompt...",
      negative: "Enter negative tags...",
    };
    const descriptions = {
      positive: "Prompt applied to the target region.",
      negative: "Negative prompt applied to the target region.",
    };
    return control.multiinput(
      `${prefix}_${variant === "positive" ? "positivePrompt" : "negativePrompt"}`,
      {
        defaultValue: "",
        placeholder: placeholders[variant],
        label: labels[variant],
        description: descriptions[variant],
        ...options,
      },
    );
  },
  /**
   * Creates positive and negative prompt inputs as an array.
   * Convenience for diffusion conditioning.
   */
  prompts: (
    prefix: string,
    options?: Partial<MultiinputOptions>,
  ): LfShapeeditorMultiinputConfig[] => [
    common.prompt(prefix, "positive", options),
    common.prompt(prefix, "negative", options),
  ],
  //#endregion
  //#region CFG (slider)
  /**
   * Creates a CFG scale slider for diffusion models.
   * Classifier-free guidance strength.
   */
  cfg: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_cfg` : "cfg";
    return control.slider(id, {
      min: 1,
      max: 30,
      step: 0.5,
      defaultValue: 7,
      label: "CFG Scale",
      description: "Classifier-free guidance strength.",
      ...options,
    });
  },
  //#endregion
  //#region Steps (slider)
  /**
   * Creates a diffusion steps slider.
   * Number of sampling steps.
   */
  steps: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix ? `${options.prefix}_steps` : "steps";
    return control.slider(id, {
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 20,
      label: "Steps",
      description: "Number of diffusion steps.",
      ...options,
    });
  },
  //#endregion
  //#region Denoise (slider)
  /**
   * Creates a denoise percentage slider.
   * 0 keeps original, 100 fully regenerates.
   */
  denoise: (
    options?: Partial<SliderOptions> & { prefix?: string },
  ): LfShapeeditorSliderConfig => {
    const id = options?.prefix
      ? `${options.prefix}_denoisePercentage`
      : "denoisePercentage";
    return control.slider(id, {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
      unit: "%",
      label: "Denoise Percentage",
      description: "0 keeps original pixels, 100 fully regenerates.",
      ...options,
    });
  },
  //#endregion
};

//#region Helpers
/**
 * Extracts default settings from an array of controls.
 * Useful for generating the `defaultSettings` object from controls.
 *
 * @example
 * ```typescript
 * const controls = [
 *   control.slider("intensity", { min: 0, max: 1, step: 0.05, defaultValue: 0.8 }),
 *   control.toggle("enabled", { defaultValue: false }),
 * ];
 * const settings = extractDefaults(controls);
 * // { intensity: 0.8, enabled: false }
 * ```
 */
export const extractDefaults = (
  controls: LfShapeeditorControlConfig[],
): Record<string, string | number | boolean> => {
  return controls.reduce(
    (acc, ctrl) => {
      acc[ctrl.id] = ctrl.defaultValue;
      return acc;
    },
    {} as Record<string, string | number | boolean>,
  );
};
/**
 * Creates select options from a simple array of values.
 * Labels are auto-generated from values.
 *
 * @example
 * ```typescript
 * const options = selectOptions(["cone", "narrow", "diffuse"]);
 * // [{ value: "cone", label: "Cone" }, { value: "narrow", label: "Narrow" }, ...]
 * ```
 */
export const selectOptions = (
  values: string[],
): Array<{ value: string; label: string }> => {
  return values.map((value) => ({
    value,
    label: idToLabel(value),
  }));
};
/**
 * Creates select options from an object mapping values to labels.
 *
 * @example
 * ```typescript
 * const options = selectOptionsFromMap({
 *   burst: "Burst (Cyberpunk)",
 *   slow: "Slow",
 *   fast: "Fast",
 * });
 * ```
 */
export const selectOptionsFromMap = (
  map: Record<string, string>,
): Array<{ value: string; label: string }> => {
  return Object.entries(map).map(([value, label]) => ({ value, label }));
};

//#region Preset Options
/**
 * Resample method options for image resizing.
 */
export const RESAMPLE_METHODS = selectOptionsFromMap({
  bicubic: "Bicubic",
  bilinear: "Bilinear",
  linear: "Linear",
  nearest: "Nearest",
  "nearest exact": "Nearest (exact)",
});

/**
 * Sampler options for diffusion models.
 */
export const SAMPLER_OPTIONS = selectOptionsFromMap({
  dpmpp_2m: "DPM++ 2M",
  dpmpp_2m_karras: "DPM++ 2M Karras",
  euler: "Euler",
  euler_ancestral: "Euler a",
});

/**
 * Scheduler options for diffusion models.
 */
export const SCHEDULER_OPTIONS = selectOptionsFromMap({
  normal: "Normal",
  karras: "Karras",
  exponential: "Exponential",
});
//#endregion

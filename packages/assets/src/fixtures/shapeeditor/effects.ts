import type {
  LfShapeeditorConfigDsl,
  LfShapeeditorLayout,
} from "@lf-widgets/foundations";

import {
  common,
  control,
  extractDefaults,
  selectOptionsFromMap,
} from "../controls";

//#region Declarations
type EffectSettings = NonNullable<LfShapeeditorConfigDsl["defaultSettings"]>;
export type EffectDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSettings: EffectSettings;
  presets: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    settings: Partial<EffectSettings>;
  }>;
  controls: LfShapeeditorConfigDsl["controls"];
};
//#endregion

//#region Spotlight
const spotlightControls = [
  control.select("beam", {
    options: selectOptionsFromMap({
      cone: "Cone",
      narrow: "Narrow",
      diffuse: "Diffuse",
      soft: "Soft",
    }),
    defaultValue: "cone",
    label: "Beam Shape",
    description: "The shape and spread pattern of the light beam",
  }),
  common.intensity({ description: "Overall brightness of the spotlight beam" }),
  common.angle({
    min: 10,
    max: 90,
    step: 5,
    defaultValue: 45,
    label: "Beam Angle",
    description: "Spread angle of the spotlight in degrees",
  }),
  control.slider("originX", {
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50,
    unit: "%",
    label: "Origin X",
    description: "Horizontal position of the beam origin",
  }),
  common.color({
    defaultValue: "#ffffff",
    swatches: ["#ffffff", "#fff5e6", "#e6f3ff", "#fff0f5"],
    label: "Beam Color",
    description: "Color of the spotlight beam",
  }),
  control.toggle("surfaceGlow", {
    defaultValue: true,
    description: "Show illumination where the beam hits the surface",
  }),
  control.slider("surfaceGlowIntensity", {
    min: 0,
    max: 1,
    step: 0.05,
    defaultValue: 0.4,
    description: "Brightness of the surface glow effect",
  }),
  control.toggle("followPointer", {
    defaultValue: false,
    description: "Beam follows cursor movement",
  }),
  control.toggle("sway", {
    defaultValue: false,
    label: "Sway Animation",
    description: "Enable subtle beam movement",
  }),
  control.slider("swayAmplitude", {
    min: 1,
    max: 15,
    step: 1,
    defaultValue: 5,
    unit: "°",
    description: "How far the beam sways",
  }),
  common.duration({
    prefix: "sway",
    min: 1000,
    max: 8000,
    step: 500,
    defaultValue: 3000,
    description: "Time for one complete sway cycle",
  }),
  control.select("trigger", {
    options: selectOptionsFromMap({
      hover: "On Hover",
      always: "Always Visible",
      manual: "Manual",
    }),
    defaultValue: "hover",
    label: "Trigger Mode",
    description: "When the spotlight appears",
  }),
  common.duration({
    prefix: "fadeIn",
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: 300,
    label: "Fade In Duration",
    description: "Time to fade in the spotlight",
  }),
  common.duration({
    prefix: "fadeOut",
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: 200,
    label: "Fade Out Duration",
    description: "Time to fade out the spotlight",
  }),
];

export const SPOTLIGHT_EFFECT: EffectDefinition = {
  id: "spotlight",
  name: "Spotlight",
  description:
    "A theatrical spotlight effect that creates a dramatic light beam from above with configurable beam shape, intensity, and tracking options.",
  icon: "lightbulb",
  defaultSettings: {
    ...extractDefaults(spotlightControls),
    // Override with RGBA for runtime (colorpicker uses hex)
    color: "rgba(255, 255, 255, 0.85)",
  },
  presets: [
    {
      id: "spotlight-dramatic",
      name: "Dramatic",
      description: "High intensity, narrow beam for emphasis",
      icon: "highlight",
      settings: {
        beam: "narrow",
        intensity: 1,
        angle: 30,
        surfaceGlow: true,
        surfaceGlowIntensity: 0.6,
      },
    },
    {
      id: "spotlight-subtle",
      name: "Subtle",
      description: "Soft, diffused lighting",
      icon: "blur_on",
      settings: {
        beam: "soft",
        intensity: 0.5,
        angle: 60,
        surfaceGlow: true,
        surfaceGlowIntensity: 0.2,
      },
    },
    {
      id: "spotlight-tracking",
      name: "Tracking",
      description: "Follows cursor movement",
      icon: "my_location",
      settings: {
        beam: "cone",
        followPointer: true,
        intensity: 0.7,
        surfaceGlow: true,
      },
    },
    {
      id: "spotlight-animated",
      name: "Animated",
      description: "Gentle swaying motion",
      icon: "animation",
      settings: {
        beam: "cone",
        sway: true,
        swayDuration: 4000,
        swayAmplitude: 8,
        intensity: 0.75,
      },
    },
    {
      id: "spotlight-always-on",
      name: "Always On",
      description: "Persistent spotlight without hover trigger",
      icon: "wb_sunny",
      settings: {
        beam: "diffuse",
        trigger: "always",
        intensity: 0.6,
      },
    },
  ],
  controls: spotlightControls,
};
//#endregion

//#region Neon Glow
const neonGlowControls = [
  control.select("mode", {
    options: selectOptionsFromMap({
      outline: "Outline",
      filled: "Filled",
    }),
    defaultValue: "outline",
    label: "Display Mode",
    description: "Outline shows border only; filled adds interior glow",
  }),
  common.intensity({
    defaultValue: 0.7,
    description: "Overall brightness of the glow effect",
  }),
  control.select("pulseSpeed", {
    options: selectOptionsFromMap({
      burst: "Burst (Cyberpunk)",
      slow: "Slow",
      normal: "Normal",
      fast: "Fast",
    }),
    defaultValue: "burst",
    description: "Animation timing for the pulsing effect",
  }),
  control.toggle("desync", {
    defaultValue: false,
    description: "Randomize timing for independent flickering across elements",
  }),
  control.toggle("reflection", {
    defaultValue: false,
    label: "Show Reflection",
    description: "Display a reflection below the element",
  }),
  common.opacity("reflection", {
    defaultValue: 0.5,
    description: "Transparency of the reflection",
  }),
  common.blur({
    prefix: "reflection",
    min: 0,
    max: 30,
    step: 2,
    defaultValue: 12,
    description: "Blur amount for the reflection",
  }),
  control.slider("reflectionOffset", {
    min: 0,
    max: 10,
    step: 0.5,
    defaultValue: 2.5,
    unit: "em",
    description: "Vertical offset of the reflection",
  }),
];

export const NEON_GLOW_EFFECT: EffectDefinition = {
  id: "neon-glow",
  name: "Neon Glow",
  description:
    "A cyberpunk-inspired neon glow effect with pulsating border and optional reflection. Adapts to theme colors automatically.",
  icon: "flare",
  defaultSettings: extractDefaults(neonGlowControls),
  presets: [
    {
      id: "neon-cyberpunk",
      name: "Cyberpunk",
      description: "Classic cyberpunk flickering with burst timing",
      icon: "electric_bolt",
      settings: {
        mode: "outline",
        intensity: 0.85,
        pulseSpeed: "burst",
        desync: true,
      },
    },
    {
      id: "neon-vapor",
      name: "Vaporwave",
      description: "Smooth, slow pulsing aesthetic",
      icon: "waves",
      settings: {
        mode: "filled",
        intensity: 0.6,
        pulseSpeed: "slow",
        desync: false,
      },
    },
    {
      id: "neon-intense",
      name: "Intense",
      description: "Maximum glow with fast pulsing",
      icon: "brightness_7",
      settings: {
        mode: "outline",
        intensity: 1,
        pulseSpeed: "fast",
      },
    },
    {
      id: "neon-subtle",
      name: "Subtle",
      description: "Gentle glow without pulsing",
      icon: "brightness_low",
      settings: {
        mode: "outline",
        intensity: 0.4,
        pulseSpeed: "slow",
      },
    },
    {
      id: "neon-reflected",
      name: "Reflected",
      description: "Includes floor reflection effect",
      icon: "content_copy",
      settings: {
        mode: "outline",
        intensity: 0.7,
        reflection: true,
        reflectionOpacity: 0.4,
      },
    },
  ],
  controls: neonGlowControls,
};
//#endregion

//#region Tilt
const tiltControls = [
  control.slider("intensity", {
    min: 1,
    max: 45,
    step: 1,
    defaultValue: 15,
    unit: "°",
    label: "Tilt Intensity",
    description: "Maximum rotation angle in degrees",
  }),
];

export const TILT_EFFECT: EffectDefinition = {
  id: "tilt",
  name: "Tilt",
  description:
    "A 3D perspective tilt effect that responds to pointer movement, creating an interactive parallax-like experience.",
  icon: "view_in_ar",
  defaultSettings: extractDefaults(tiltControls),
  presets: [
    {
      id: "tilt-subtle",
      name: "Subtle",
      description: "Gentle tilt for understated interaction",
      icon: "touch_app",
      settings: { intensity: 8 },
    },
    {
      id: "tilt-moderate",
      name: "Moderate",
      description: "Balanced tilt effect",
      icon: "3d_rotation",
      settings: { intensity: 15 },
    },
    {
      id: "tilt-dramatic",
      name: "Dramatic",
      description: "Pronounced 3D effect",
      icon: "flip_camera_android",
      settings: { intensity: 25 },
    },
  ],
  controls: tiltControls,
};
//#endregion

//#region Ripple
const rippleControls = [
  common.duration({
    min: 100,
    max: 1500,
    step: 50,
    defaultValue: 500,
    description: "Animation duration in milliseconds",
  }),
  common.scale({
    min: 0.5,
    max: 2,
    step: 0.1,
    defaultValue: 1,
    description: "Size multiplier for the ripple",
  }),
  control.toggle("autoSurfaceRadius", {
    defaultValue: true,
    label: "Auto Border Radius",
    description: "Inherit border-radius from parent element",
  }),
  control.textfield("borderRadius", {
    defaultValue: "",
    placeholder: "8px",
    label: "Custom Border Radius",
    description: "Override border-radius (e.g., '8px' or '50%')",
  }),
];

export const RIPPLE_EFFECT: EffectDefinition = {
  id: "ripple",
  name: "Ripple",
  description:
    "A material design-inspired ripple effect that emanates from the point of interaction.",
  icon: "water_drop",
  defaultSettings: {
    ...extractDefaults(rippleControls),
    // Additional runtime setting not exposed in UI
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  presets: [
    {
      id: "ripple-standard",
      name: "Standard",
      description: "Default material design ripple",
      icon: "radio_button_checked",
      settings: { duration: 500, scale: 1 },
    },
    {
      id: "ripple-slow",
      name: "Slow",
      description: "Slower, more pronounced ripple",
      icon: "slow_motion_video",
      settings: { duration: 800, scale: 1.2 },
    },
    {
      id: "ripple-fast",
      name: "Fast",
      description: "Quick ripple for snappy interactions",
      icon: "bolt",
      settings: { duration: 300, scale: 0.9 },
    },
    {
      id: "ripple-large",
      name: "Large",
      description: "Large ripple that expands beyond the element",
      icon: "circle",
      settings: { duration: 700, scale: 1.5 },
    },
  ],
  controls: rippleControls,
};
//#endregion

//#region Exports
export const EFFECTS_DEFINITIONS: EffectDefinition[] = [
  SPOTLIGHT_EFFECT,
  NEON_GLOW_EFFECT,
  TILT_EFFECT,
  RIPPLE_EFFECT,
];

export const createEffectDsl = (
  effect: EffectDefinition,
): LfShapeeditorConfigDsl => {
  const enabledControlId = `${effect.id}_enabled`;

  const layout: LfShapeeditorLayout = (() => {
    switch (effect.id) {
      case "spotlight":
        return [
          // Standalone control: enabled toggle at the top, outside accordion
          { controlId: enabledControlId },
          {
            id: "beam",
            label: "Beam",
            controlIds: ["beam", "color", "angle", "intensity", "originX"],
          },
          {
            id: "surface",
            label: "Surface",
            controlIds: ["surfaceGlow", "surfaceGlowIntensity"],
          },
          {
            id: "behaviour",
            label: "Behaviour",
            controlIds: [
              "followPointer",
              "sway",
              "swayAmplitude",
              "sway_duration",
            ],
          },
          {
            id: "trigger",
            label: "Trigger & Timing",
            controlIds: ["trigger", "fadeIn_duration", "fadeOut_duration"],
          },
        ];
      case "neon-glow":
        return [
          // Standalone enabled toggle
          { controlId: enabledControlId },
          {
            id: "glow",
            label: "Glow",
            controlIds: ["mode", "intensity", "pulseSpeed", "desync"],
          },
          {
            id: "reflection",
            label: "Reflection",
            controlIds: [
              "reflection",
              "reflection_opacity",
              "reflection_blur",
              "reflectionOffset",
            ],
          },
        ];
      case "tilt":
        return [
          // Standalone enabled toggle
          { controlId: enabledControlId },
          {
            id: "settings",
            label: "Settings",
            controlIds: ["intensity"],
          },
        ];
      case "ripple":
        return [
          // Standalone enabled toggle
          { controlId: enabledControlId },
          {
            id: "animation",
            label: "Animation",
            controlIds: ["duration", "scale"],
          },
          {
            id: "shape",
            label: "Shape",
            controlIds: ["autoSurfaceRadius", "borderRadius"],
          },
        ];
      default:
        // Default: just the standalone enabled toggle
        return [{ controlId: enabledControlId }];
    }
  })();

  return {
    controls: [common.enabled(effect.id), ...effect.controls],
    layout,
    defaultSettings: {
      [enabledControlId]: false,
      ...effect.defaultSettings,
    },
  };
};
//#endregion

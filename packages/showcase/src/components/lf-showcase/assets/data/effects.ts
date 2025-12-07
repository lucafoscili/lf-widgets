import {
  LfArticleDataset,
  LfShapeeditorConfigDsl,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

const FRAMEWORK_NAME = "Effects";

type EffectSettings = NonNullable<LfShapeeditorConfigDsl["defaultSettings"]>;

type EffectDefinition = {
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

/**
 * Spotlight effect definition used by the effects showcase and shapeeditor.
 */
export const SPOTLIGHT_EFFECT: EffectDefinition = {
  id: "spotlight",
  name: "Spotlight",
  description:
    "A theatrical spotlight effect that creates a dramatic light beam from above with configurable beam shape, intensity, and tracking options.",
  icon: "lightbulb",
  defaultSettings: {
    beam: "cone",
    color: "rgba(255, 255, 255, 0.85)",
    angle: 45,
    intensity: 0.8,
    originX: 50,
    surfaceGlow: true,
    surfaceGlowIntensity: 0.4,
    followPointer: false,
    sway: false,
    swayDuration: 3000,
    swayAmplitude: 5,
    trigger: "hover",
    fadeInDuration: 300,
    fadeOutDuration: 200,
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
  controls: [
    {
      id: "beam",
      type: "select",
      label: "Beam Shape",
      description: "The shape and spread pattern of the light beam",
      options: [
        { value: "cone", label: "Cone" },
        { value: "narrow", label: "Narrow" },
        { value: "diffuse", label: "Diffuse" },
        { value: "soft", label: "Soft" },
      ],
      defaultValue: "cone",
    },
    {
      id: "intensity",
      type: "slider",
      label: "Intensity",
      description: "Overall brightness of the spotlight beam",
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.8,
    },
    {
      id: "angle",
      type: "slider",
      label: "Beam Angle",
      description: "Spread angle of the spotlight in degrees",
      min: 10,
      max: 90,
      step: 5,
      defaultValue: 45,
      unit: "°",
    },
    {
      id: "originX",
      type: "slider",
      label: "Origin X",
      description: "Horizontal position of the beam origin",
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 50,
      unit: "%",
    },
    {
      id: "color",
      type: "colorpicker",
      label: "Beam Color",
      description: "Color of the spotlight beam",
      defaultValue: "#ffffff",
      swatches: ["#ffffff", "#fff5e6", "#e6f3ff", "#fff0f5"],
    },
    {
      id: "surfaceGlow",
      type: "toggle",
      label: "Surface Glow",
      description: "Show illumination where the beam hits the surface",
      defaultValue: true,
    },
    {
      id: "surfaceGlowIntensity",
      type: "slider",
      label: "Surface Glow Intensity",
      description: "Brightness of the surface glow effect",
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.4,
    },
    {
      id: "followPointer",
      type: "toggle",
      label: "Follow Pointer",
      description: "Beam follows cursor movement",
      defaultValue: false,
    },
    {
      id: "sway",
      type: "toggle",
      label: "Sway Animation",
      description: "Enable subtle beam movement",
      defaultValue: false,
    },
    {
      id: "swayAmplitude",
      type: "slider",
      label: "Sway Amplitude",
      description: "How far the beam sways",
      min: 1,
      max: 15,
      step: 1,
      defaultValue: 5,
      unit: "°",
    },
    {
      id: "swayDuration",
      type: "slider",
      label: "Sway Duration",
      description: "Time for one complete sway cycle",
      min: 1000,
      max: 8000,
      step: 500,
      defaultValue: 3000,
      unit: "ms",
    },
    {
      id: "trigger",
      type: "select",
      label: "Trigger Mode",
      description: "When the spotlight appears",
      options: [
        { value: "hover", label: "On Hover" },
        { value: "always", label: "Always Visible" },
        { value: "manual", label: "Manual" },
      ],
      defaultValue: "hover",
    },
    {
      id: "fadeInDuration",
      type: "slider",
      label: "Fade In Duration",
      description: "Time to fade in the spotlight",
      min: 0,
      max: 1000,
      step: 50,
      defaultValue: 300,
      unit: "ms",
    },
    {
      id: "fadeOutDuration",
      type: "slider",
      label: "Fade Out Duration",
      description: "Time to fade out the spotlight",
      min: 0,
      max: 1000,
      step: 50,
      defaultValue: 200,
      unit: "ms",
    },
  ],
};

/**
 * Neon Glow effect definition used by the effects showcase and shapeeditor.
 */
export const NEON_GLOW_EFFECT: EffectDefinition = {
  id: "neon-glow",
  name: "Neon Glow",
  description:
    "A cyberpunk-inspired neon glow effect with pulsating border and optional reflection. Adapts to theme colors automatically.",
  icon: "flare",
  defaultSettings: {
    mode: "outline",
    intensity: 0.7,
    pulseSpeed: "burst",
    desync: false,
    reflection: false,
    reflectionBlur: 12,
    reflectionOffset: 2.5,
    reflectionOpacity: 0.5,
  },
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
  controls: [
    {
      id: "mode",
      type: "select",
      label: "Display Mode",
      description: "Outline shows border only; filled adds interior glow",
      options: [
        { value: "outline", label: "Outline" },
        { value: "filled", label: "Filled" },
      ],
      defaultValue: "outline",
    },
    {
      id: "intensity",
      type: "slider",
      label: "Intensity",
      description: "Overall brightness of the glow effect",
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.7,
    },
    {
      id: "pulseSpeed",
      type: "select",
      label: "Pulse Speed",
      description: "Animation timing for the pulsing effect",
      options: [
        { value: "burst", label: "Burst (Cyberpunk)" },
        { value: "slow", label: "Slow" },
        { value: "normal", label: "Normal" },
        { value: "fast", label: "Fast" },
      ],
      defaultValue: "burst",
    },
    {
      id: "desync",
      type: "toggle",
      label: "Desync",
      description:
        "Randomize timing for independent flickering across elements",
      defaultValue: false,
    },
    {
      id: "reflection",
      type: "toggle",
      label: "Show Reflection",
      description: "Display a reflection below the element",
      defaultValue: false,
    },
    {
      id: "reflectionOpacity",
      type: "slider",
      label: "Reflection Opacity",
      description: "Transparency of the reflection",
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.5,
    },
    {
      id: "reflectionBlur",
      type: "slider",
      label: "Reflection Blur",
      description: "Blur amount for the reflection",
      min: 0,
      max: 30,
      step: 2,
      defaultValue: 12,
      unit: "px",
    },
    {
      id: "reflectionOffset",
      type: "slider",
      label: "Reflection Offset",
      description: "Vertical offset of the reflection",
      min: 0,
      max: 10,
      step: 0.5,
      defaultValue: 2.5,
      unit: "em",
    },
  ],
};

/**
 * Tilt effect definition used by the effects showcase and shapeeditor.
 */
export const TILT_EFFECT: EffectDefinition = {
  id: "tilt",
  name: "Tilt",
  description:
    "A 3D perspective tilt effect that responds to pointer movement, creating an interactive parallax-like experience.",
  icon: "view_in_ar",
  defaultSettings: {
    intensity: 15,
  },
  presets: [
    {
      id: "tilt-subtle",
      name: "Subtle",
      description: "Gentle tilt for understated interaction",
      icon: "touch_app",
      settings: {
        intensity: 8,
      },
    },
    {
      id: "tilt-moderate",
      name: "Moderate",
      description: "Balanced tilt effect",
      icon: "3d_rotation",
      settings: {
        intensity: 15,
      },
    },
    {
      id: "tilt-dramatic",
      name: "Dramatic",
      description: "Pronounced 3D effect",
      icon: "flip_camera_android",
      settings: {
        intensity: 25,
      },
    },
  ],
  controls: [
    {
      id: "intensity",
      type: "slider",
      label: "Tilt Intensity",
      description: "Maximum rotation angle in degrees",
      min: 1,
      max: 45,
      step: 1,
      defaultValue: 15,
      unit: "°",
    },
  ],
};

/**
 * Ripple effect definition used by the effects showcase and shapeeditor.
 */
export const RIPPLE_EFFECT: EffectDefinition = {
  id: "ripple",
  name: "Ripple",
  description:
    "A material design-inspired ripple effect that emanates from the point of interaction.",
  icon: "water_drop",
  defaultSettings: {
    duration: 500,
    scale: 1,
    autoSurfaceRadius: true,
    borderRadius: "",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  presets: [
    {
      id: "ripple-standard",
      name: "Standard",
      description: "Default material design ripple",
      icon: "radio_button_checked",
      settings: {
        duration: 500,
        scale: 1,
      },
    },
    {
      id: "ripple-slow",
      name: "Slow",
      description: "Slower, more pronounced ripple",
      icon: "slow_motion_video",
      settings: {
        duration: 800,
        scale: 1.2,
      },
    },
    {
      id: "ripple-fast",
      name: "Fast",
      description: "Quick ripple for snappy interactions",
      icon: "bolt",
      settings: {
        duration: 300,
        scale: 0.9,
      },
    },
    {
      id: "ripple-large",
      name: "Large",
      description: "Large ripple that expands beyond the element",
      icon: "circle",
      settings: {
        duration: 700,
        scale: 1.5,
      },
    },
  ],
  controls: [
    {
      id: "duration",
      type: "slider",
      label: "Duration",
      description: "Animation duration in milliseconds",
      min: 100,
      max: 1500,
      step: 50,
      defaultValue: 500,
      unit: "ms",
    },
    {
      id: "scale",
      type: "slider",
      label: "Scale",
      description: "Size multiplier for the ripple",
      min: 0.5,
      max: 2,
      step: 0.1,
      defaultValue: 1,
    },
    {
      id: "autoSurfaceRadius",
      type: "toggle",
      label: "Auto Border Radius",
      description: "Inherit border-radius from parent element",
      defaultValue: true,
    },
    {
      id: "borderRadius",
      type: "textfield",
      label: "Custom Border Radius",
      description: "Override border-radius (e.g., '8px' or '50%')",
      defaultValue: "",
      placeholder: "8px",
    },
  ],
};

/**
 * Collection of all effects definitions used across the showcase.
 */
export const EFFECTS_DEFINITIONS: EffectDefinition[] = [
  SPOTLIGHT_EFFECT,
  NEON_GLOW_EFFECT,
  TILT_EFFECT,
  RIPPLE_EFFECT,
];

export const getEffectsFixtures = (): LfShowcaseFixture => {
  //#region example map
  const CODE = new Map<string, { code: string; description: string }>([
    [
      "backdrop.show",
      {
        code: "lfEffects.backdrop.show(() => { console.log('Backdrop shown!'); });",
        description: "Shows a backdrop element.",
      },
    ],
    [
      "backdrop.hide",
      {
        code: "lfEffects.backdrop.hide();",
        description: "Hides the backdrop element.",
      },
    ],
    [
      "backdrop.isVisible",
      {
        code: "const isVisible = lfEffects.backdrop.isVisible();",
        description:
          "Returns a boolean indicating whether the backdrop is visible.",
      },
    ],
    [
      "lightbox.show",
      {
        code: "lfEffects.lightbox.show(element);",
        description: "Shows a lightbox element.",
      },
    ],
    [
      "lightbox.hide",
      {
        code: "lfEffects.lightbox.hide();",
        description: "Hides the lightbox element.",
      },
    ],
    [
      "lightbox.isVisible",
      {
        code: "const isVisible = lfEffects.lightbox.isVisible();",
        description:
          "Returns a boolean indicating whether the lightbox is visible.",
      },
    ],
    [
      "register.neonGlow",
      {
        code: `lfEffects.register.neonGlow(element, {
  mode: "outline",        // "outline" or "filled"
  color: undefined,       // Uses theme secondary color by default
  intensity: 0.7,         // Glow intensity (0-1)
  pulseSpeed: "burst",    // "burst" (8s cyberpunk), "slow", "normal", "fast"
  desync: true,           // Randomize timing for independent flickering
  reflection: false,      // Show reflection below element
});`,
        description:
          "Registers a neon glow effect on the element with pulsating border and optional reflection. Uses theme secondary color by default for automatic theme adaptation.",
      },
    ],
    [
      "register.spotlight",
      {
        code: `lfEffects.register.spotlight(element, {
  beam: "cone",           // "cone", "narrow", "diffuse", or "soft"
  color: "rgba(255, 255, 255, 0.85)", // Beam color
  angle: 45,              // Beam spread angle in degrees
  intensity: 0.8,         // Beam intensity (0-1)
  originX: 50,            // Horizontal beam origin (0-100%)
  surfaceGlow: true,      // Show illumination where beam hits
  surfaceGlowIntensity: 0.4, // Surface glow intensity (0-1)
  followPointer: false,   // Beam follows cursor position
  sway: false,            // Enable subtle beam sway animation
  swayDuration: 3000,     // Sway animation duration in ms
  swayAmplitude: 5,       // Sway amplitude in degrees
  trigger: "hover",       // "hover", "always", or "manual"
  fadeInDuration: 300,    // Fade-in duration in ms
  fadeOutDuration: 200,   // Fade-out duration in ms
});`,
        description:
          "Registers a theatrical spotlight effect that creates a dramatic light beam from above. Supports multiple beam presets, pointer-follow mode, and animated sway.",
      },
    ],
    [
      "register.tilt",
      {
        code: "lfEffects.register.tilt(element);",
        description: "Registers a tilt effect.",
      },
    ],
    [
      "ripple",
      {
        code: "lfEffects.ripple(event, element);",
        description: "Creates a ripple effect.",
      },
    ],
    [
      "unregister.neonGlow",
      {
        code: "lfEffects.unregister.neonGlow(element);",
        description: "Removes the neon glow effect from the element.",
      },
    ],
    [
      "unregister.spotlight",
      {
        code: "lfEffects.unregister.spotlight(element);",
        description:
          "Removes the spotlight effect from the element, including all layers and event listeners.",
      },
    ],
    [
      "unregister.tilt",
      {
        code: "lfEffects.unregister.tilt(element);",
        description: "Unregisters a tilt effect.",
      },
    ],
  ]);
  //#endregion

  //#region documentation
  const documentation: LfArticleDataset = {
    nodes: [
      {
        id: DOC_IDS.root,
        value: FRAMEWORK_NAME,
        children: [
          {
            id: DOC_IDS.section,
            value: "Overview",
            children: [
              {
                children: [
                  {
                    id: DOC_IDS.content,
                    tagName: "strong",
                    value: "LfEffects",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      " is a utility class for handling a variety of UI effects.",
                  },
                  {
                    id: DOC_IDS.content,
                    value:
                      "It provides methods for creating and managing backdrop, lightbox, neon glow, ripple, spotlight, and tilt effects.",
                  },
                ],
                id: DOC_IDS.paragraph,
                value: "",
              },
            ],
          },
          {
            id: DOC_IDS.section,
            value: "API",
            children: Array.from(CODE.keys()).map((key) =>
              PARAGRAPH_FACTORY.api(
                key,
                CODE.get(key).description,
                CODE.get(key).code!,
              ),
            ),
          },
        ],
      },
    ],
  };
  //#endregion

  return {
    documentation,
  };
};

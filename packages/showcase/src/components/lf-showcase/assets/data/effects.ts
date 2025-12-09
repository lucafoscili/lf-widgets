import effectsJson from "@lf-widgets/assets/assets/fixtures/shapeeditor/effects.json";
import type {
  LfShapeeditorConfigDsl,
  LfShapeeditorLayout,
} from "@lf-widgets/foundations";
import {
  LfArticleDataset,
  LfDataDataset,
  LfFrameworkInterface,
  LfIconType,
  LfShapeeditorElement,
  LfShapeeditorEventPayload,
} from "@lf-widgets/foundations";
import { DOC_IDS } from "../../helpers/constants";
import { PARAGRAPH_FACTORY } from "../../helpers/doc.paragraph";
import { LfShowcaseFixture } from "../../lf-showcase-declarations";

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

type SerializedEffect = EffectDefinition & {
  configDsl?: LfShapeeditorConfigDsl;
};

const SERIALIZED_EFFECTS = effectsJson.effects as SerializedEffect[];

export const EFFECTS_DEFINITIONS: EffectDefinition[] = SERIALIZED_EFFECTS.map(
  ({ configDsl: _configDsl, ...effect }) => effect,
);

export const SPOTLIGHT_EFFECT =
  EFFECTS_DEFINITIONS.find((effect) => effect.id === "spotlight") ??
  EFFECTS_DEFINITIONS[0];

export const createEffectDsl = (
  effect: EffectDefinition,
): LfShapeeditorConfigDsl => {
  const fromJson = SERIALIZED_EFFECTS.find(({ id }) => id === effect.id);

  if (fromJson?.configDsl) {
    return fromJson.configDsl;
  }

  const controlIds = effect.controls.map((control) => control.id);

  const layout: LfShapeeditorLayout = [
    {
      id: "general",
      label: "General",
      controlIds,
    },
  ];

  return {
    controls: effect.controls,
    layout,
    defaultSettings: effect.defaultSettings,
  };
};

const FRAMEWORK_NAME = "Effects";

export const getEffectsFixtures = (
  framework: LfFrameworkInterface,
): LfShowcaseFixture => {
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

  //#region Playground
  // Dataset for the masonry - shows a preview surface for each effect
  const effectsDataset: LfDataDataset = {
    nodes: EFFECTS_DEFINITIONS.map((effect) => ({
      cells: {
        lfImage: {
          shape: "image" as const,
          value: effect.icon,
        },
      },
      id: effect.id,
      value: effect.name,
    })),
  };

  // Settings dataset with tree structure - each effect is a selectable node
  const effectsSettingsDataset: LfDataDataset = {
    nodes: EFFECTS_DEFINITIONS.map((effect) => ({
      id: effect.id,
      value: effect.name,
      icon: effect.icon as LfIconType,
      cells: {
        lfCode: {
          shape: "code" as const,
          value: JSON.stringify(createEffectDsl(effect)),
        },
      },
      description: effect.description,
    })),
  };

  // Track which effects are currently registered
  const registeredEffects = new Set<string>();

  const playgroundEventHandler = async (
    e: CustomEvent<LfShapeeditorEventPayload>,
  ) => {
    const { comp, eventType } = e.detail;
    if (eventType !== "lf-event") {
      return;
    }

    const shapeeditor = comp as unknown as LfShapeeditorElement;
    const components = await shapeeditor.getComponents();
    const settings = await shapeeditor.getSettings();
    const surfaceEl = components.details.shape as HTMLElement | null;

    if (!surfaceEl) {
      return;
    }

    const { effects } = framework;

    // Determine which effect is currently being configured from the tree selection
    const snapshot = await shapeeditor.getCurrentSnapshot();
    const shapeIndex = snapshot?.shape?.index;

    if (shapeIndex === undefined) {
      return;
    }

    // Get the effect ID from the dataset using the index
    const currentEffectId = effectsDataset.nodes?.[shapeIndex]?.id;

    if (!currentEffectId) {
      return;
    }

    // Each effect has its own unique enabled control ID
    const enabledControlId = `${currentEffectId}_enabled`;
    const isEnabled = settings[enabledControlId] as boolean;

    // Handle enable/disable for the current effect
    const wasRegistered = registeredEffects.has(currentEffectId);

    if (isEnabled && !wasRegistered) {
      // First time enabling - register the effect
      registeredEffects.add(currentEffectId);
    } else if (!isEnabled && wasRegistered) {
      // Disabling - unregister the effect
      registeredEffects.delete(currentEffectId);
      switch (currentEffectId) {
        case "spotlight":
          effects.unregister.spotlight(surfaceEl);
          break;
        case "neon-glow":
          effects.unregister.neonGlow(surfaceEl);
          break;
        case "tilt":
          effects.unregister.tilt(surfaceEl);
          break;
        case "ripple":
          effects.unregister.ripple(surfaceEl);
          break;
      }
      return;
    }

    // Only apply settings if the effect is enabled
    if (!isEnabled) {
      return;
    }

    // Apply effect settings (re-register to update)
    switch (currentEffectId) {
      case "spotlight":
        effects.unregister.spotlight(surfaceEl);
        effects.register.spotlight(surfaceEl, {
          beam: settings.beam as "cone" | "narrow" | "diffuse" | "soft",
          color: settings.color as string,
          angle: settings.angle as number,
          intensity: settings.intensity as number,
          originX: settings.originX as number,
          surfaceGlow: settings.surfaceGlow as boolean,
          surfaceGlowIntensity: settings.surfaceGlowIntensity as number,
          followPointer: settings.followPointer as boolean,
          sway: settings.sway as boolean,
          swayDuration: settings.swayDuration as number,
          swayAmplitude: settings.swayAmplitude as number,
          trigger: settings.trigger as "hover" | "always" | "manual",
          fadeInDuration: settings.fadeInDuration as number,
          fadeOutDuration: settings.fadeOutDuration as number,
        });
        break;

      case "neon-glow":
        effects.unregister.neonGlow(surfaceEl);
        effects.register.neonGlow(surfaceEl, {
          mode: settings.mode as "outline" | "filled",
          intensity: settings.intensity as number,
          pulseSpeed: settings.pulseSpeed as
            | "burst"
            | "slow"
            | "normal"
            | "fast",
          desync: settings.desync as boolean,
          reflection: settings.reflection as boolean,
          reflectionOpacity: settings.reflectionOpacity as number,
          reflectionBlur: settings.reflectionBlur as number,
          reflectionOffset: settings.reflectionOffset as number,
        });
        break;

      case "tilt":
        effects.unregister.tilt(surfaceEl);
        effects.register.tilt(surfaceEl, settings.intensity as number);
        break;

      case "ripple":
        effects.unregister.ripple(surfaceEl);
        effects.register.ripple(surfaceEl, {
          duration: settings.duration as number,
          scale: settings.scale as number,
          autoSurfaceRadius: settings.autoSurfaceRadius as boolean,
          borderRadius: settings.borderRadius as string,
        });
        break;
    }
  };
  const playground = {
    description:
      "Interactive effects playground - configure and preview all visual effects",
    props: {
      lfDataset: effectsDataset,
      lfShape: "image" as const,
      lfValue: effectsSettingsDataset,
    },
    events: { "lf-shapeeditor-event": playgroundEventHandler },
  };
  //#endregion

  return {
    documentation,
    playground,
  };
};

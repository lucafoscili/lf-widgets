import {
  LF_EFFECTS_VARS,
  LF_THEME_COLORS,
  LfColorInput,
  LfEffectsNeonGlowOptions,
  LfEffectsNeonGlowPulseSpeed,
} from "@lf-widgets/foundations";
import { layerManager } from "./helpers.layers";

//#region Constants
const LAYER_NAMES = {
  glow: "neon-glow",
  reflection: "neon-glow-reflection",
} as const;
//#endregion

//#region Helpers
const getPulseDuration = (
  speed: LfEffectsNeonGlowPulseSpeed = "burst",
): string => {
  const durations: Record<LfEffectsNeonGlowPulseSpeed, string> = {
    burst: "8s",
    fast: "1.2s",
    normal: "2s",
    slow: "3.5s",
  };
  return durations[speed];
};

/**
 * Generates a random delay for desynchronized animations.
 * Returns a value between 0 and maxDelay seconds.
 */
const getRandomDelay = (maxDelay = 5): string => {
  const delay = Math.random() * maxDelay;
  return `${delay.toFixed(2)}s`;
};

const resolveColor = (color?: LfColorInput): string => {
  if (color) {
    return color;
  } else {
    const { secondary } = LF_THEME_COLORS;
    return `rgb(var(${secondary}))`;
  }
};
//#endregion

//#region State
/**
 * Tracks element-specific data for cleanup.
 */
const elementData = new WeakMap<
  HTMLElement,
  {
    originalStyles?: string;
  }
>();
//#endregion

//#region Public API
/**
 * Neon-glow effect implementation.
 */
export const neonGlowEffect = {
  register: (
    element: HTMLElement,
    options: LfEffectsNeonGlowOptions = {},
    defaultIntensity = 0.7,
  ): void => {
    const { neonGlow } = LF_EFFECTS_VARS;
    const {
      color,
      desync = false,
      intensity = defaultIntensity,
      mode = "outline",
      pulseSpeed = "burst",
      reflection = false,
      reflectionBlur = 8,
      reflectionOffset = 4,
      reflectionOpacity = 0.3,
    } = options;

    const resolvedColor = resolveColor(color);
    const pulseDuration = getPulseDuration(pulseSpeed);

    elementData.set(element, {
      originalStyles: element.getAttribute("style") || "",
    });

    element.dataset.lfNeonGlow = mode;
    element.style.setProperty(neonGlow.color, resolvedColor);
    element.style.setProperty(neonGlow.intensity, String(intensity));
    element.style.setProperty(neonGlow.pulseDuration, pulseDuration);

    const animationDelay = desync ? getRandomDelay(5) : undefined;
    if (animationDelay) {
      element.style.animationDelay = animationDelay;
    }

    layerManager.register(element, {
      name: LAYER_NAMES.glow,
      insertPosition: "prepend",
      onSetup: (layer) => {
        if (animationDelay) {
          layer.style.animationDelay = animationDelay;
        }
      },
    });

    if (reflection) {
      layerManager.register(element, {
        name: LAYER_NAMES.reflection,
        insertPosition: "prepend",
        onSetup: (layer) => {
          layer.style.setProperty(
            neonGlow.reflectionBlur,
            `${reflectionBlur}px`,
          );
          layer.style.setProperty(
            neonGlow.reflectionOpacity,
            String(reflectionOpacity),
          );

          layer.style.top = "auto";
          layer.style.bottom = `-${reflectionOffset}px`;
          layer.style.height = "50%";
          layer.style.transform = "scaleY(-1)";

          if (animationDelay) {
            layer.style.animationDelay = animationDelay;
          }
        },
      });
    }
  },

  unregister: (element: HTMLElement): void => {
    const { neonGlow } = LF_EFFECTS_VARS;

    delete element.dataset.lfNeonGlow;

    const data = elementData.get(element);
    if (data?.originalStyles !== undefined) {
      element.setAttribute("style", data.originalStyles);
    } else {
      element.style.removeProperty(neonGlow.color);
      element.style.removeProperty(neonGlow.intensity);
      element.style.removeProperty(neonGlow.pulseDuration);
      element.style.removeProperty("animation-delay");
    }
    elementData.delete(element);

    layerManager.unregister(element, LAYER_NAMES.glow);
    layerManager.unregister(element, LAYER_NAMES.reflection);
  },
};
//#endregion

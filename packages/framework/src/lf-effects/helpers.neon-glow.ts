import {
  LF_EFFECTS_VARS,
  LF_THEME_COLORS,
  LfColorInput,
  LfEffectsNeonGlowOptions,
  LfEffectsNeonGlowPulseSpeed,
} from "@lf-widgets/foundations";
import {
  createAdoptedStylesManager,
  createCachedCssGetter,
} from "./helpers.adopted-styles";
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
    burst: "8s", // Long cycle with intermittent flickers
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

/**
 * Gets the cached neon-glow :host() CSS string using shared utilities.
 * Uses regex-based host transformation for consistent pattern with tilt.
 * Includes layer element selectors for glow and reflection.
 */
const getNeonGlowCss = createCachedCssGetter({
  selectorFilter: (k) =>
    k.includes("data-lf-neon-glow") ||
    k.includes("data-lf-effect-layer") ||
    k.includes("lf-neon-") ||
    k.startsWith("@keyframes lf-neon"),
  hostTransform: (selector) => {
    // @keyframes are kept as-is (global)
    if (selector.startsWith("@keyframes")) return selector;

    // Layer selectors are kept as-is (they're children of host)
    if (selector.includes("data-lf-effect-layer")) return selector;

    // Only transform [data-lf-neon-glow] selectors
    if (!selector.startsWith("[data-lf-neon-glow]")) return selector;

    // Transform to :host() format using regex
    return selector.replace(
      /^\[data-lf-neon-glow([^\]]*)\]/,
      ":host([data-lf-neon-glow$1])",
    );
  },
});

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
 * Shared adopted styles manager for neon-glow effect.
 */
const stylesManager = createAdoptedStylesManager(getNeonGlowCss);

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
    const elementShadowRoot = element.shadowRoot;

    // Inject styles into shadow root if needed (uses shared manager)
    if (elementShadowRoot) {
      stylesManager.adopt(elementShadowRoot);
    }

    // Store original inline styles for cleanup
    elementData.set(element, {
      originalStyles: element.getAttribute("style") || "",
    });

    // Set host element attributes and properties
    element.dataset.lfNeonGlow = mode;
    element.style.setProperty(neonGlow.color, resolvedColor);
    element.style.setProperty(neonGlow.intensity, String(intensity));
    element.style.setProperty(neonGlow.pulseDuration, pulseDuration);

    // Generate random delay for desync mode
    const animationDelay = desync ? getRandomDelay(5) : undefined;
    if (animationDelay) {
      element.style.animationDelay = animationDelay;
    }

    // Register glow layer via layer manager
    layerManager.register(element, {
      name: LAYER_NAMES.glow,
      insertPosition: "prepend",
      onSetup: (layer) => {
        // Sync animation delay if desync is enabled
        if (animationDelay) {
          layer.style.animationDelay = animationDelay;
        }
      },
    });

    // Register reflection layer if enabled
    if (reflection) {
      layerManager.register(element, {
        name: LAYER_NAMES.reflection,
        insertPosition: "prepend",
        onSetup: (layer) => {
          // Set reflection-specific CSS custom properties
          layer.style.setProperty(
            neonGlow.reflectionBlur,
            `${reflectionBlur}px`,
          );
          layer.style.setProperty(
            neonGlow.reflectionOpacity,
            String(reflectionOpacity),
          );

          // Position reflection below the element
          layer.style.top = "auto";
          layer.style.bottom = `-${reflectionOffset}px`;
          layer.style.height = "50%";
          layer.style.transform = "scaleY(-1)";

          // Sync animation delay if desync is enabled
          if (animationDelay) {
            layer.style.animationDelay = animationDelay;
          }
        },
      });
    }
  },

  unregister: (element: HTMLElement): void => {
    const { neonGlow } = LF_EFFECTS_VARS;

    // Remove host element attributes
    delete element.dataset.lfNeonGlow;

    // Restore original styles or clean up properties
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

    // Unregister layers via layer manager
    layerManager.unregister(element, LAYER_NAMES.glow);
    layerManager.unregister(element, LAYER_NAMES.reflection);

    // Release adopted styles (uses shared manager with ref counting)
    const elementShadowRoot = element.shadowRoot;
    if (elementShadowRoot) {
      stylesManager.release(elementShadowRoot);
    }
  },
};
//#endregion

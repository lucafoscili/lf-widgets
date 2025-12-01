import {
  GLOBAL_STYLES,
  LF_ATTRIBUTES,
  LF_EFFECTS_VARS,
  LF_THEME_COLORS,
  LF_THEME_UI,
  LfColorInput,
  LfEffectsNeonGlowOptions,
  LfEffectsNeonGlowPulseSpeed,
} from "@lf-widgets/foundations";

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
 * Extracts and converts neon-glow related styles from GLOBAL_STYLES to CSS string.
 * This uses the pre-compiled SCSS from the build system.
 * When targeting a custom element's host, converts selectors to :host() format.
 */
const getNeonGlowCss = (forHost = false): string => {
  let css = "";

  // Get the neon-glow related selectors and keyframes
  const neonSelectors = [
    "[data-lf=neon-glow]",
    "[data-lf=neon-glow][data-lf-neon-mode=outline]",
    "[data-lf=neon-glow][data-lf-neon-mode=filled]",
    "[data-lf=neon-glow]::before",
    "[data-lf=neon-glow] > *",
    "[data-lf=neon-glow-reflection]",
    "[data-lf=neon-glow-surface]",
    "@keyframes lf-neon-pulse",
    "@keyframes lf-neon-flicker",
  ] as const;

  for (const selector of neonSelectors) {
    const rules = GLOBAL_STYLES[selector as keyof typeof GLOBAL_STYLES];
    if (!rules) continue;

    let outputSelector: string = selector;
    if (forHost && selector.startsWith("[data-lf=neon-glow]")) {
      // Convert [data-lf=neon-glow] to :host([data-lf=neon-glow])
      // And [data-lf=neon-glow]::before to :host([data-lf=neon-glow])::before
      // And [data-lf=neon-glow] > * to :host([data-lf=neon-glow]) > *
      if (selector === "[data-lf=neon-glow]") {
        outputSelector = ":host([data-lf=neon-glow])";
      } else if (selector.includes("::before")) {
        outputSelector = ":host([data-lf=neon-glow])::before";
      } else if (selector.includes("> *")) {
        outputSelector = ":host([data-lf=neon-glow]) > *";
      } else if (selector.includes("[data-lf-neon-mode=")) {
        const modeMatch = selector.match(/\[data-lf-neon-mode=([^\]]+)\]/);
        if (modeMatch) {
          outputSelector = `:host([data-lf=neon-glow][data-lf-neon-mode=${modeMatch[1]}])`;
        }
      }
    }

    if (selector.startsWith("@keyframes")) {
      css += `${selector} { `;
      if (Array.isArray(rules)) {
        for (const frame of rules) {
          for (const [frameKey, props] of Object.entries(frame)) {
            css += `${frameKey} { `;
            for (const [prop, value] of Object.entries(
              props as Record<string, string>,
            )) {
              css += `${prop}: ${value}; `;
            }
            css += `} `;
          }
        }
      }
      css += `} `;
    } else {
      css += `${outputSelector} { `;
      for (const [prop, value] of Object.entries(
        rules as Record<string, string>,
      )) {
        css += `${prop}: ${value}; `;
      }
      css += `} `;
    }
  }

  return css;
};

/** Cached CSS string for :host() neon-glow styles */
let cachedNeonGlowHostCss: string | null = null;

/**
 * Gets or builds the cached neon-glow :host() CSS string.
 * Only :host() selectors are needed - global.scss provides the standard selectors.
 */
const getOrBuildNeonGlowCss = (): string => {
  if (cachedNeonGlowHostCss === null) {
    cachedNeonGlowHostCss = getNeonGlowCss(true);
  }
  return cachedNeonGlowHostCss;
};

const resolveColor = (color?: LfColorInput): string => {
  if (color) {
    return color;
  } else {
    const { secondary } = LF_THEME_COLORS;
    const { alphaGlass } = LF_THEME_UI;
    return `rgba(var(${secondary}), var(${alphaGlass}))`;
  }
};
//#endregion

//#region State
/**
 * Tracks which shadow roots have adopted neon-glow :host() styles.
 * Key: ShadowRoot, Value: CSSStyleSheet
 */
const adoptedRoots = new WeakMap<ShadowRoot, CSSStyleSheet>();

/**
 * Tracks element-specific data for cleanup.
 */
const elementData = new WeakMap<
  HTMLElement,
  {
    resizeObserver?: ResizeObserver;
    reflection?: HTMLElement;
    originalStyles?: string;
  }
>();

/**
 * Reference count per shadow root (how many elements use neon-glow in that root).
 */
const rootRefCount = new WeakMap<ShadowRoot, number>();
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

    if (elementShadowRoot && !adoptedRoots.has(elementShadowRoot)) {
      const css = getOrBuildNeonGlowCss();
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      elementShadowRoot.adoptedStyleSheets = [
        ...elementShadowRoot.adoptedStyleSheets,
        sheet,
      ];
      adoptedRoots.set(elementShadowRoot, sheet);
      rootRefCount.set(elementShadowRoot, 1);
    } else if (elementShadowRoot) {
      rootRefCount.set(
        elementShadowRoot,
        (rootRefCount.get(elementShadowRoot) || 0) + 1,
      );
    }

    // Store original inline styles for cleanup
    elementData.set(element, {
      ...elementData.get(element),
      originalStyles: element.getAttribute("style") || "",
    });

    element.dataset.lf = LF_ATTRIBUTES.neonGlow;
    element.dataset.lfNeonMode = mode;

    element.style.setProperty(neonGlow.color, resolvedColor);
    element.style.setProperty(neonGlow.intensity, String(intensity));
    element.style.setProperty(neonGlow.pulseDuration, pulseDuration);

    if (desync) {
      const randomDelay = getRandomDelay(5);
      element.style.animationDelay = randomDelay;
    }

    // Handle reflection if enabled
    if (reflection) {
      const reflectionEl = createReflection(element, {
        color: resolvedColor,
        reflectionBlur,
        reflectionOffset,
        reflectionOpacity,
      });

      // Sync reflection animation delay with element for consistent flickering
      if (desync && element.style.animationDelay) {
        reflectionEl.style.animationDelay = element.style.animationDelay;
      }

      element.parentElement?.insertBefore(reflectionEl, element.nextSibling);

      const resizeObserver = new ResizeObserver(() => {
        updateReflectionPosition(element, reflectionEl, reflectionOffset);
      });
      resizeObserver.observe(element);

      const data = elementData.get(element) || {};
      elementData.set(element, {
        ...data,
        resizeObserver,
        reflection: reflectionEl,
      });
    }
  },

  unregister: (element: HTMLElement): void => {
    const { neonGlow } = LF_EFFECTS_VARS;

    // Clean up data attributes (removing these removes the CSS styling)
    delete element.dataset.lf;
    delete element.dataset.lfNeonMode;

    // Clean up CSS custom properties and restore original styles
    const data = elementData.get(element);
    if (data?.originalStyles !== undefined) {
      element.setAttribute("style", data.originalStyles);
    } else {
      element.style.removeProperty(neonGlow.color);
      element.style.removeProperty(neonGlow.intensity);
      element.style.removeProperty(neonGlow.pulseDuration);
    }

    // Clean up element-specific data
    if (data) {
      data.resizeObserver?.disconnect();
      data.reflection?.remove();
      elementData.delete(element);
    }

    // Decrement ref count and potentially clean up adopted stylesheet
    // Check element's own shadow root first (for custom elements)
    const elementShadowRoot = element.shadowRoot;
    const rootToClean = elementShadowRoot || element.getRootNode();

    if (rootToClean instanceof ShadowRoot && adoptedRoots.has(rootToClean)) {
      const count = (rootRefCount.get(rootToClean) || 1) - 1;
      rootRefCount.set(rootToClean, count);

      // If no more elements use neon-glow in this shadow root, remove the stylesheet
      if (count <= 0) {
        const sheet = adoptedRoots.get(rootToClean)!;
        rootToClean.adoptedStyleSheets = rootToClean.adoptedStyleSheets.filter(
          (s) => s !== sheet,
        );
        adoptedRoots.delete(rootToClean);
        rootRefCount.delete(rootToClean);
      }
    }
  },
};
//#endregion

//#region Reflection helpers
const createReflection = (
  element: HTMLElement,
  options: {
    color: string;
    reflectionBlur: number;
    reflectionOffset: number;
    reflectionOpacity: number;
  },
): HTMLElement => {
  const { neonGlow } = LF_EFFECTS_VARS;
  const reflection = document.createElement("div");

  // Set data attribute - SCSS handles all the base styling
  reflection.dataset.lf = LF_ATTRIBUTES.neonGlowReflection;
  reflection.setAttribute("aria-hidden", "true");

  // Position-related values (dynamic, must be inline)
  const rect = element.getBoundingClientRect();
  const computedStyle = getComputedStyle(element);

  reflection.style.width = `${rect.width}px`;
  reflection.style.height = `${rect.height * 0.5}px`;
  reflection.style.left = `${rect.left}px`;
  reflection.style.top = `${rect.bottom + options.reflectionOffset}px`;
  reflection.style.borderRadius = computedStyle.borderRadius;

  // Set CSS custom properties for customizable values
  reflection.style.setProperty(neonGlow.color, options.color);
  reflection.style.setProperty(
    neonGlow.reflectionBlur,
    `${options.reflectionBlur}px`,
  );
  reflection.style.setProperty(
    neonGlow.reflectionOffset,
    `${options.reflectionOffset}px`,
  );
  reflection.style.setProperty(
    neonGlow.reflectionOpacity,
    String(options.reflectionOpacity),
  );

  return reflection;
};

const updateReflectionPosition = (
  element: HTMLElement,
  reflection: HTMLElement,
  offset: number,
): void => {
  const rect = element.getBoundingClientRect();
  reflection.style.width = `${rect.width}px`;
  reflection.style.left = `${rect.left}px`;
  reflection.style.top = `${rect.bottom + offset}px`;
};
//#endregion

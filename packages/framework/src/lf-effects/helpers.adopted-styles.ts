import { GLOBAL_STYLES } from "@lf-widgets/foundations";

//#region Types
/**
 * Configuration for building effect CSS from GLOBAL_STYLES.
 */
export interface EffectCssConfig {
  /**
   * Filter predicate to select relevant selectors from GLOBAL_STYLES.
   * @param key - The selector key from GLOBAL_STYLES
   * @returns true if the selector should be included
   */
  selectorFilter: (key: string) => boolean;
  /**
   * Transforms a selector for :host() context.
   * @param selector - The original selector
   * @returns The transformed selector for shadow DOM :host()
   */
  hostTransform: (selector: string) => string | null;
}
//#endregion

//#region CSS Generation
/**
 * Builds CSS string from GLOBAL_STYLES using the provided configuration.
 * Handles both regular selectors and @keyframes.
 *
 * @param config - Configuration for selector filtering and transformation
 * @param forHost - If true, transforms selectors for shadow DOM :host() context
 * @returns The generated CSS string
 */
export const buildCssFromGlobalStyles = (
  config: EffectCssConfig,
  forHost = false,
): string => {
  let css = "";

  const selectors = Object.keys(GLOBAL_STYLES).filter(config.selectorFilter);

  for (const selector of selectors) {
    const rules = GLOBAL_STYLES[selector as keyof typeof GLOBAL_STYLES];
    if (!rules) continue;

    let outputSelector: string | null = selector;

    if (forHost) {
      outputSelector = config.hostTransform(selector);
      if (outputSelector === null) continue; // Skip if transform returns null
    }

    // Handle @keyframes
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
      // Regular selector
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

/**
 * Creates a cached CSS getter for an effect.
 * Only builds the CSS once, then returns the cached version.
 *
 * @param config - Configuration for selector filtering and transformation
 * @returns A function that returns the cached :host() CSS string
 */
export const createCachedCssGetter = (
  config: EffectCssConfig,
): (() => string) => {
  let cachedCss: string | null = null;

  return () => {
    if (cachedCss === null) {
      cachedCss = buildCssFromGlobalStyles(config, true);
    }
    return cachedCss;
  };
};
//#endregion

//#region Adopted Styles Manager
/**
 * Creates a manager for handling adopted stylesheets in shadow roots.
 * Tracks reference counts per root and handles cleanup automatically.
 *
 * @param getCss - Function that returns the CSS string to adopt
 * @returns Manager object with adopt/release methods
 */
export const createAdoptedStylesManager = (getCss: () => string) => {
  /** Tracks which shadow roots have adopted styles. Key: ShadowRoot, Value: CSSStyleSheet */
  const adoptedRoots = new WeakMap<ShadowRoot, CSSStyleSheet>();
  /** Reference count per shadow root */
  const rootRefCount = new WeakMap<ShadowRoot, number>();

  return {
    /**
     * Checks if styles are already adopted in the given shadow root.
     */
    isAdopted: (shadowRoot: ShadowRoot): boolean =>
      adoptedRoots.has(shadowRoot),

    /**
     * Adopts the effect's styles into a shadow root.
     * Uses reference counting to support multiple elements per root.
     *
     * @param shadowRoot - The shadow root to adopt styles into
     */
    adopt: (shadowRoot: ShadowRoot): void => {
      if (!adoptedRoots.has(shadowRoot)) {
        const css = getCss();
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        shadowRoot.adoptedStyleSheets = [
          ...shadowRoot.adoptedStyleSheets,
          sheet,
        ];
        adoptedRoots.set(shadowRoot, sheet);
        rootRefCount.set(shadowRoot, 1);
      } else {
        rootRefCount.set(shadowRoot, (rootRefCount.get(shadowRoot) || 0) + 1);
      }
    },

    /**
     * Releases styles from a shadow root.
     * Only removes when reference count reaches zero.
     *
     * @param shadowRoot - The shadow root to release styles from
     */
    release: (shadowRoot: ShadowRoot): void => {
      if (!rootRefCount.has(shadowRoot)) return;

      const count = rootRefCount.get(shadowRoot)! - 1;

      if (count <= 0) {
        const sheet = adoptedRoots.get(shadowRoot);
        if (sheet) {
          shadowRoot.adoptedStyleSheets = shadowRoot.adoptedStyleSheets.filter(
            (s) => s !== sheet,
          );
        }
        adoptedRoots.delete(shadowRoot);
        rootRefCount.delete(shadowRoot);
      } else {
        rootRefCount.set(shadowRoot, count);
      }
    },
  };
};
//#endregion

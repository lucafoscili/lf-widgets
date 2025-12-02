import {
    GLOBAL_STYLES,
    LfThemeSharedStylesManager,
} from "@lf-widgets/foundations";

//#region Constants
/**
 * Selectors that should ONLY be in document-level <style>, not adopted sheets.
 * These target light DOM elements outside shadow roots.
 */
const DOCUMENT_ONLY_SELECTORS = [".lf-effects", ".lf-portal"];

/**
 * Attribute selectors that should be transformed to :host() context.
 * These target the host element itself in shadow DOM.
 */
const HOST_ATTRIBUTE_SELECTORS = [
  "[data-lf-effect-host]",
  "[data-lf-tilt]",
  "[data-lf-neon-glow",
];
//#endregion

//#region Selector Utilities
/**
 * Checks if a selector should be excluded from adopted stylesheets.
 * Document-only selectors target light DOM containers that exist outside shadow roots.
 *
 * @param selector - The CSS selector to check
 * @returns true if the selector should only be in document-level styles
 */
export const isDocumentOnlySelector = (selector: string): boolean => {
  return DOCUMENT_ONLY_SELECTORS.some(
    (prefix) => selector.startsWith(prefix) || selector.includes(` ${prefix}`),
  );
};

/**
 * Transforms attribute selectors to :host() context for shadow DOM.
 * E.g., "[data-lf-effect-host]" → ":host([data-lf-effect-host])"
 *
 * @param selector - The original selector
 * @returns The transformed selector for shadow DOM context
 */
export const transformToHostSelector = (selector: string): string => {
  for (const attr of HOST_ATTRIBUTE_SELECTORS) {
    if (selector.startsWith(attr)) {
      // Transform [attr] to :host([attr]) and preserve any suffix
      return selector.replace(
        new RegExp(`^(\\[data-lf-[^\\]]+\\])`),
        ":host($1)",
      );
    }
  }
  return selector;
};
//#endregion

//#region CSS Building
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStyleRules = any;

/**
 * Builds CSS rules from a rules object (property-value pairs).
 *
 * @param rules - Object containing CSS property-value pairs
 * @returns CSS string of property declarations
 */
const buildRules = (rules: AnyStyleRules): string => {
  let css = "";
  for (const [prop, value] of Object.entries(rules)) {
    css += `${prop}: ${value}; `;
  }
  return css;
};

/**
 * Builds CSS for @keyframes at-rules.
 *
 * @param selector - The @keyframes selector
 * @param frames - Array of keyframe objects
 * @returns CSS string for the keyframes
 */
const buildKeyframes = (selector: string, frames: AnyStyleRules): string => {
  let css = `${selector} { `;
  for (const frame of frames) {
    for (const [frameKey, props] of Object.entries(frame)) {
      css += `${frameKey} { ${buildRules(props)} } `;
    }
  }
  css += `} `;
  return css;
};

/**
 * Builds CSS for @media at-rules, filtering document-only selectors.
 *
 * @param selector - The @media selector
 * @param rules - Object containing inner selectors and their rules
 * @param forDocument - If true, only includes document-only selectors; if false, excludes them
 * @returns CSS string for the media query
 */
const buildMediaQuery = (
  selector: string,
  rules: AnyStyleRules,
  forDocument: boolean,
): string => {
  let css = `${selector} { `;
  for (const [innerSelector, innerRules] of Object.entries(rules)) {
    const isDocOnly = isDocumentOnlySelector(innerSelector);

    // For document styles, only include document-only selectors
    // For adopted styles, exclude document-only selectors
    if (forDocument ? !isDocOnly : isDocOnly) {
      continue;
    }

    const outputSelector = forDocument
      ? innerSelector
      : transformToHostSelector(innerSelector);
    css += `${outputSelector} { ${buildRules(innerRules)} } `;
  }
  css += `} `;
  return css;
};

/**
 * Builds CSS string from GLOBAL_STYLES for adopted stylesheets.
 * Excludes document-only selectors and transforms host-targeting attribute selectors.
 *
 * @returns CSS string suitable for shadow DOM adoption
 */
export const buildAdoptableCss = (): string => {
  let css = "";

  for (const [selector, rules] of Object.entries(GLOBAL_STYLES)) {
    // Skip document-only selectors (light DOM containers)
    if (isDocumentOnlySelector(selector)) {
      continue;
    }

    if (selector.startsWith("@keyframes")) {
      css += buildKeyframes(selector, rules);
    } else if (selector.startsWith("@media")) {
      css += buildMediaQuery(selector, rules, false);
    } else {
      // Transform attribute selectors to :host() context
      const outputSelector = transformToHostSelector(selector);
      css += `${outputSelector} { ${buildRules(rules)} } `;
    }
  }

  return css;
};

/**
 * Builds CSS string from GLOBAL_STYLES for document-level <style> element.
 * Only includes document-only selectors (.lf-effects, .lf-portal).
 *
 * @returns CSS string for document-level styles
 */
export const buildDocumentCss = (): string => {
  let css = "";

  for (const [selector, rules] of Object.entries(GLOBAL_STYLES)) {
    // Only include document-only selectors
    if (!isDocumentOnlySelector(selector)) {
      continue;
    }

    if (selector.startsWith("@media")) {
      css += buildMediaQuery(selector, rules, true);
    } else {
      css += `${selector} { ${buildRules(rules)} } `;
    }
  }

  return css.trim();
};
//#endregion

//#region Shared Styles Manager
/**
 * Creates the shared styles manager for adopted stylesheets.
 * Uses a single CSSStyleSheet instance shared across all shadow roots.
 *
 * This is the central mechanism for sharing global styles (ripple, effects, etc.)
 * across all components without duplicating CSS in each shadow root.
 *
 * @returns Manager object with adopt/release/isAdopted methods
 */
export const createSharedStylesManager = (): LfThemeSharedStylesManager => {
  /** Single shared CSSStyleSheet instance - created lazily on first adopt */
  let sharedSheet: CSSStyleSheet | null = null;

  /** Tracks which shadow roots have adopted the shared sheet */
  const adoptedRoots = new WeakSet<ShadowRoot>();

  /** Reference count per shadow root (for multiple registrations per root) */
  const rootRefCount = new WeakMap<ShadowRoot, number>();

  /**
   * Gets or creates the shared CSSStyleSheet.
   */
  const getOrCreateSheet = (): CSSStyleSheet => {
    if (!sharedSheet) {
      const css = buildAdoptableCss();
      sharedSheet = new CSSStyleSheet();
      sharedSheet.replaceSync(css);
    }
    return sharedSheet;
  };

  return {
    /**
     * Adopts the shared stylesheet into a shadow root.
     * Uses reference counting to support multiple components per root.
     *
     * @param shadowRoot - The shadow root to adopt styles into
     */
    adopt: (shadowRoot: ShadowRoot): void => {
      if (!shadowRoot) return;

      if (!adoptedRoots.has(shadowRoot)) {
        const sheet = getOrCreateSheet();
        shadowRoot.adoptedStyleSheets = [
          ...shadowRoot.adoptedStyleSheets,
          sheet,
        ];
        adoptedRoots.add(shadowRoot);
        rootRefCount.set(shadowRoot, 1);
      } else {
        rootRefCount.set(shadowRoot, (rootRefCount.get(shadowRoot) || 0) + 1);
      }
    },

    /**
     * Checks if styles are already adopted in the given shadow root.
     *
     * @param shadowRoot - The shadow root to check
     * @returns true if styles are adopted
     */
    isAdopted: (shadowRoot: ShadowRoot): boolean => {
      return shadowRoot ? adoptedRoots.has(shadowRoot) : false;
    },

    /**
     * Releases styles from a shadow root.
     * Only removes the stylesheet when reference count reaches zero.
     *
     * @param shadowRoot - The shadow root to release styles from
     */
    release: (shadowRoot: ShadowRoot): void => {
      if (!shadowRoot || !rootRefCount.has(shadowRoot)) return;

      const count = rootRefCount.get(shadowRoot)! - 1;

      if (count <= 0) {
        if (sharedSheet) {
          shadowRoot.adoptedStyleSheets = shadowRoot.adoptedStyleSheets.filter(
            (s) => s !== sharedSheet,
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

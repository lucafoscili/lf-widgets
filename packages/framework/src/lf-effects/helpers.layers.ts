import {
  LF_EFFECTS_LAYER_ATTRIBUTES,
  LF_EFFECTS_LAYER_BASE_Z_INDEX,
  LF_EFFECTS_LAYER_DEFAULTS,
  LfEffectLayerData,
  LfEffectLayerManager,
} from "@lf-widgets/foundations";
import {
  createAdoptedStylesManager,
  createCachedCssGetter,
} from "./helpers.adopted-styles";

//#region CSS Configuration
/**
 * Gets the cached layer CSS string using shared utilities.
 * Targets [data-lf-effect-layer] selectors.
 */
const getLayerCss = createCachedCssGetter({
  selectorFilter: (k) =>
    k.includes("data-lf-effect-layer") || k.startsWith("@keyframes lf-"),
  hostTransform: (selector) => {
    // @keyframes are kept as-is (global)
    if (selector.startsWith("@keyframes")) return selector;

    // Only transform [data-lf-effect-layer] selectors
    if (!selector.startsWith("[data-lf-effect-layer")) return selector;

    // No transformation needed - layers are direct children, not :host()
    return selector;
  },
});
//#endregion

//#region State
/**
 * Global order counter for z-index calculation.
 * Incremented each time a layer is registered.
 */
let globalOrderCounter = 0;

/**
 * Tracks layers per host element.
 * WeakMap ensures automatic cleanup when host is garbage collected.
 */
const hostLayers = new WeakMap<HTMLElement, Map<string, LfEffectLayerData>>();

/**
 * Shared adopted styles manager for layer effects.
 */
const stylesManager = createAdoptedStylesManager(getLayerCss);
//#endregion

//#region Layer Manager Implementation
/**
 * Creates and manages isolated DOM elements ("layers") for visual effects.
 * Enables unlimited composable effects on a single element without pseudo-element conflicts.
 *
 * Key features:
 * - Handles both shadow DOM and light DOM scenarios
 * - Dynamic z-index ordering based on registration order
 * - Automatic cleanup via WeakMap when host is garbage collected
 * - Lifecycle callbacks for setup/cleanup logic
 */
export const layerManager: LfEffectLayerManager = {
  register: (host, config) => {
    const {
      name,
      insertPosition = LF_EFFECTS_LAYER_DEFAULTS.insertPosition,
      inheritBorderRadius = LF_EFFECTS_LAYER_DEFAULTS.inheritBorderRadius,
      pointerEvents = LF_EFFECTS_LAYER_DEFAULTS.pointerEvents,
      onSetup,
    } = config;

    // Get or create the layers map for this host
    let layers = hostLayers.get(host);
    if (!layers) {
      layers = new Map();
      hostLayers.set(host, layers);
      // Mark the host element for CSS targeting
      host.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.host, "");
    }

    // Prevent duplicate registration - return existing layer
    const existing = layers.get(name);
    if (existing) {
      return existing.layer;
    }

    // Create layer element
    const layer = document.createElement("div");
    layer.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.layer, name);
    layer.setAttribute(
      LF_EFFECTS_LAYER_ATTRIBUTES.order,
      String(++globalOrderCounter),
    );
    layer.setAttribute("aria-hidden", "true");

    // Base layer styles - absolute positioning with full coverage
    const baseStyles = [
      "position: absolute",
      "inset: 0",
      "overflow: hidden",
      `pointer-events: ${pointerEvents ? "auto" : "none"}`,
    ];

    if (inheritBorderRadius) {
      baseStyles.push("border-radius: inherit");
    }

    layer.style.cssText = baseStyles.join("; ");

    // Determine injection target (shadow root or host itself)
    const target = host.shadowRoot ?? host;

    // Inject styles into shadow root if present
    if (host.shadowRoot) {
      stylesManager.adopt(host.shadowRoot);
    }

    // Insert layer at specified position
    if (insertPosition === "prepend") {
      target.insertBefore(layer, target.firstChild);
    } else {
      target.appendChild(layer);
    }

    // Track layer data
    const order = globalOrderCounter;
    layers.set(name, { layer, config, order });

    // Recalculate z-indices for all layers on this host
    layerManager.reorderLayers(host);

    // Run setup callback
    onSetup?.(layer, host);

    return layer;
  },

  unregister: (host, effectName) => {
    const layers = hostLayers.get(host);
    if (!layers) return;

    const data = layers.get(effectName);
    if (!data) return;

    // Run cleanup callback before removal
    data.config.onCleanup?.(data.layer, host);

    // Remove from DOM
    data.layer.remove();

    // Remove from tracking
    layers.delete(effectName);

    // Release adopted styles if shadow root present
    if (host.shadowRoot) {
      stylesManager.release(host.shadowRoot);
    }

    // Recalculate z-indices for remaining layers
    if (layers.size > 0) {
      layerManager.reorderLayers(host);
    } else {
      // Clean up empty map entry and remove host marker
      hostLayers.delete(host);
      host.removeAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.host);
    }
  },

  getLayer: (host, effectName) => {
    return hostLayers.get(host)?.get(effectName)?.layer ?? null;
  },

  getAllLayers: (host) => {
    const layers = hostLayers.get(host);
    if (!layers) return [];

    return Array.from(layers.values())
      .sort((a, b) => a.order - b.order)
      .map((d) => d.layer);
  },

  reorderLayers: (host) => {
    const layers = hostLayers.get(host);
    if (!layers) return;

    // Sort by registration order
    const sorted = Array.from(layers.values()).sort(
      (a, b) => a.order - b.order,
    );

    // Apply z-indices
    sorted.forEach((data, index) => {
      const zIndex =
        data.config.zIndexOverride ?? LF_EFFECTS_LAYER_BASE_Z_INDEX + index;
      data.layer.style.zIndex = String(zIndex);
    });
  },
};
//#endregion

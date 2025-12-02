import {
  LF_EFFECTS_LAYER_ATTRIBUTES,
  LF_EFFECTS_LAYER_BASE_Z_INDEX,
  LF_EFFECTS_LAYER_DEFAULTS,
  LF_EFFECTS_TRANSFORM_PRIORITY,
  LF_EFFECTS_TRANSFORM_VAR,
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
    if (selector.startsWith("@keyframes")) {
      return selector;
    }

    // Only transform [data-lf-effect-layer] selectors
    if (!selector.startsWith("[data-lf-effect-layer")) {
      return selector;
    }

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
 * Tracks transform contributions per host element.
 * Each effect registers its transform with a priority for ordering.
 */
interface TransformEntry {
  transform: string;
  priority: number;
}
const hostTransforms = new WeakMap<HTMLElement, Map<string, TransformEntry>>();

/**
 * Shared adopted styles manager for layer effects.
 */
const stylesManager = createAdoptedStylesManager(getLayerCss);

/**
 * Composes all registered transforms for a host into a single CSS variable.
 * Transforms are ordered by priority (lower = first in chain).
 *
 * @param host - The host element to compose transforms for
 */
const composeTransforms = (host: HTMLElement): void => {
  const transforms = hostTransforms.get(host);

  if (!transforms || transforms.size === 0) {
    // No transforms - set to none
    host.style.setProperty(LF_EFFECTS_TRANSFORM_VAR, "none");
    return;
  }

  // Sort by priority and compose
  const sorted = Array.from(transforms.entries()).sort(
    ([, a], [, b]) => a.priority - b.priority,
  );

  const composed = sorted.map(([, entry]) => entry.transform).join(" ");
  host.style.setProperty(LF_EFFECTS_TRANSFORM_VAR, composed);
};
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
      // Clean up empty map entry
      hostLayers.delete(host);

      // Only remove host attribute if no transforms are registered either
      const transforms = hostTransforms.get(host);
      if (!transforms || transforms.size === 0) {
        host.removeAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.host);
      }
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

  registerTransform: (
    host,
    effectName,
    transform,
    priority = LF_EFFECTS_TRANSFORM_PRIORITY.rotate,
  ) => {
    // Get or create the transforms map for this host
    let transforms = hostTransforms.get(host);
    if (!transforms) {
      transforms = new Map();
      hostTransforms.set(host, transforms);
      // Mark the host element for CSS targeting (enables transform styles)
      host.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.host, "");
    }

    // Register the transform
    transforms.set(effectName, { transform, priority });

    // Recompose and apply
    composeTransforms(host);
  },

  updateTransform: (host, effectName, transform) => {
    const transforms = hostTransforms.get(host);
    if (!transforms) {
      return;
    }

    const existing = transforms.get(effectName);
    if (!existing) {
      return;
    }

    existing.transform = transform;

    composeTransforms(host);
  },

  unregisterTransform: (host, effectName) => {
    const transforms = hostTransforms.get(host);
    if (!transforms) {
      return;
    }

    transforms.delete(effectName);

    if (transforms.size === 0) {
      hostTransforms.delete(host);
      host.style.removeProperty(LF_EFFECTS_TRANSFORM_VAR);

      // Only remove host attribute if no layers are registered either
      const layers = hostLayers.get(host);
      if (!layers || layers.size === 0) {
        host.removeAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.host);
      }
    } else {
      composeTransforms(host);
    }
  },
};
//#endregion

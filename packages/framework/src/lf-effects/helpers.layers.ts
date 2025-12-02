import {
  LF_EFFECTS_LAYER_ATTRIBUTES,
  LF_EFFECTS_LAYER_BASE_Z_INDEX,
  LF_EFFECTS_LAYER_DEFAULTS,
  LF_EFFECTS_TRANSFORM_PRIORITY,
  LF_EFFECTS_TRANSFORM_VAR,
  LfEffectLayerData,
  LfEffectLayerManager,
} from "@lf-widgets/foundations";

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
 * Composes all registered transforms for a host into a single CSS variable.
 * Transforms are ordered by priority (lower = first in chain).
 *
 * @param host - The host element to compose transforms for
 */
const composeTransforms = (host: HTMLElement): void => {
  const transforms = hostTransforms.get(host);

  if (!transforms || transforms.size === 0) {
    host.style.setProperty(LF_EFFECTS_TRANSFORM_VAR, "none");
    return;
  }

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

    let layers = hostLayers.get(host);
    if (!layers) {
      layers = new Map();
      hostLayers.set(host, layers);
      // Mark the host element for CSS targeting
      host.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.host, "");
    }

    const existing = layers.get(name);
    if (existing) {
      return existing.layer;
    }

    const layer = document.createElement("div");
    layer.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.layer, name);
    layer.setAttribute(
      LF_EFFECTS_LAYER_ATTRIBUTES.order,
      String(++globalOrderCounter),
    );
    layer.setAttribute("aria-hidden", "true");

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

    const target = host.shadowRoot ?? host;

    if (insertPosition === "prepend") {
      target.insertBefore(layer, target.firstChild);
    } else {
      target.appendChild(layer);
    }

    const order = globalOrderCounter;
    layers.set(name, { layer, config, order });

    layerManager.reorderLayers(host);

    onSetup?.(layer, host);

    return layer;
  },

  unregister: (host, effectName) => {
    const layers = hostLayers.get(host);
    if (!layers) {
      return;
    }

    const data = layers.get(effectName);
    if (!data) {
      return;
    }

    data.config.onCleanup?.(data.layer, host);

    data.layer.remove();

    layers.delete(effectName);

    if (layers.size > 0) {
      layerManager.reorderLayers(host);
    } else {
      hostLayers.delete(host);

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

    const sorted = Array.from(layers.values()).sort(
      (a, b) => a.order - b.order,
    );

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
    let transforms = hostTransforms.get(host);
    if (!transforms) {
      transforms = new Map();
      hostTransforms.set(host, transforms);
      host.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.host, "");
    }

    transforms.set(effectName, { transform, priority });

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

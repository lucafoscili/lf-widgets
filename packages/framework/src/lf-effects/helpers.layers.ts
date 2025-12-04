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
 * Resets when approaching MAX_SAFE_INTEGER to prevent overflow in long-running SPAs.
 */
let globalOrderCounter = 0;
const MAX_ORDER_COUNTER = Number.MAX_SAFE_INTEGER - 1000;

/**
 * Safely increments the global order counter, resetting if near overflow.
 */
const getNextOrder = (): number => {
  if (globalOrderCounter >= MAX_ORDER_COUNTER) {
    globalOrderCounter = 0;
  }
  return ++globalOrderCounter;
};

/**
 * Tracks layers per host element.
 * WeakMap ensures automatic cleanup when host is garbage collected.
 */
const hostLayers = new WeakMap<HTMLElement, Map<string, LfEffectLayerData>>();

/**
 * Tracks which host attributes are set on each element.
 * Used for cleanup when all effects of a type are removed.
 */
const hostAttributes = new WeakMap<HTMLElement, Set<string>>();

/**
 * Tracks transform contributions per host element.
 * Each effect registers its transform with a priority for ordering.
 */
interface TransformEntry {
  transform: string;
  priority: number;
  hostAttribute?: string;
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
      hostAttribute,
      insertPosition = LF_EFFECTS_LAYER_DEFAULTS.insertPosition,
      inheritBorderRadius = LF_EFFECTS_LAYER_DEFAULTS.inheritBorderRadius,
      pointerEvents = LF_EFFECTS_LAYER_DEFAULTS.pointerEvents,
      onSetup,
    } = config;

    let layers = hostLayers.get(host);
    if (!layers) {
      layers = new Map();
      hostLayers.set(host, layers);
    }

    if (hostAttribute) {
      host.setAttribute(hostAttribute, "");
      let attrs = hostAttributes.get(host);
      if (!attrs) {
        attrs = new Set();
        hostAttributes.set(host, attrs);
      }
      attrs.add(hostAttribute);
    }

    const existing = layers.get(name);
    if (existing) {
      return existing.layer;
    }

    const layer = document.createElement("div");
    const order = getNextOrder();
    layer.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.layer, name);
    layer.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.order, String(order));
    layer.setAttribute("aria-hidden", "true");

    if (pointerEvents) {
      layer.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.pointerEvents, "");
    }
    if (!inheritBorderRadius) {
      layer.setAttribute(LF_EFFECTS_LAYER_ATTRIBUTES.noRadius, "");
    }

    const target = host.shadowRoot ?? host;

    if (insertPosition === "prepend") {
      target.insertBefore(layer, target.firstChild);
    } else {
      target.appendChild(layer);
    }

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

    const { hostAttribute } = data.config;
    if (hostAttribute) {
      host.removeAttribute(hostAttribute);
      const attrs = hostAttributes.get(host);
      if (attrs) {
        attrs.delete(hostAttribute);
        if (attrs.size === 0) {
          hostAttributes.delete(host);
        }
      }
    }

    data.config.onCleanup?.(data.layer, host);

    data.layer.remove();

    layers.delete(effectName);

    if (layers.size > 0) {
      layerManager.reorderLayers(host);
    } else {
      hostLayers.delete(host);
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
    hostAttribute,
  ) => {
    let transforms = hostTransforms.get(host);
    if (!transforms) {
      transforms = new Map();
      hostTransforms.set(host, transforms);
    }

    if (hostAttribute) {
      host.setAttribute(hostAttribute, "");
    }

    transforms.set(effectName, { transform, priority, hostAttribute });

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

    const entry = transforms.get(effectName);
    if (!entry) {
      return;
    }

    if (entry.hostAttribute) {
      const attrs = hostAttributes.get(host);
      const layerUsesAttribute = attrs?.has(entry.hostAttribute);
      if (!layerUsesAttribute) {
        host.removeAttribute(entry.hostAttribute);
      }
    }

    transforms.delete(effectName);

    if (transforms.size === 0) {
      hostTransforms.delete(host);
      host.style.removeProperty(LF_EFFECTS_TRANSFORM_VAR);
    } else {
      composeTransforms(host);
    }
  },
};
//#endregion

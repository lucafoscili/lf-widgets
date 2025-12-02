# Effects Layer Architecture

> **Status**: Design Document  
> **Created**: December 2025  
> **Applies to**: `@lf-widgets/framework` → `lf-effects`

## Executive Summary

This document defines the **Layer-Based Effects System** — a scalable architecture enabling unlimited composable visual effects on any element, with fire-and-forget registration.

---

## 1. Problem Statement

### Current Limitations

| Issue | Impact |
|-------|--------|
| Pseudo-element fights | Only 2 available (`::before`, `::after`); effects compete |
| Effect coupling | Tilt uses `::after` for highlight, neon-glow uses `::after` for animation |
| Limited composability | Adding a 3rd effect breaks existing ones |
| Inconsistent patterns | Ripple uses a "surface" element, others use pseudo-elements |

### Goals

1. **Unlimited effects** on a single element
2. **Fire-and-forget** API: `register()` / `unregister()` handles everything
3. **Zero conflicts** between effects
4. **Consistent pattern** across all effects (ripple, tilt, neon-glow, frost, etc.)
5. **DOM-agnostic**: works with shadow DOM and light DOM

---

## 2. Architecture Overview

### 2.1 Core Concept: Effect Layers

Each effect injects a **real DOM element** ("layer") rather than relying on pseudo-elements:

```
┌─────────────────────────────────────────────────────────┐
│  Host Element (e.g., <lf-card>)                         │
│  [data-lf-tilt] [data-lf-neon-glow] [data-lf-frost]     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Shadow Root (or Light DOM container)           │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │ [data-lf-effect-layer="neon-glow"]      │ z:1│    │
│  │  └─────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │ [data-lf-effect-layer="tilt"]           │ z:2│    │
│  │  └─────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │ [data-lf-effect-layer="frost"]          │ z:3│    │
│  │  └─────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │ [data-lf-effect-layer="ripple"]         │z:99│    │
│  │  └─────────────────────────────────────────┘    │    │
│  │                                                 │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │ Component Content                       │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Layer Element Structure

```html
<div 
  data-lf-effect-layer="<effect-name>"
  data-lf-effect-order="<registration-order>"
  aria-hidden="true"
  style="z-index: <dynamic>; pointer-events: none; position: absolute; inset: 0;">
</div>
```

### 2.3 CSS Strategy

| DOM Type | CSS Injection Method |
|----------|---------------------|
| **Shadow DOM** | Adopted stylesheets (per-effect, cached) |
| **Light DOM** | Global styles via `global.scss` imports |

Each effect has its own SCSS mixin (e.g., `lf-fw-neon-glow`) that targets:
- `[data-lf-<effect>]` — host element styling
- `[data-lf-effect-layer="<effect>"]` — layer element styling

---

## 3. Layer Manager API

### 3.1 Types (Foundations)

```typescript
// packages/foundations/src/framework/effects.types.ts

/**
 * Configuration for registering an effect layer.
 */
interface LfEffectLayerConfig {
  /** Unique effect identifier (e.g., "neon-glow", "tilt", "ripple") */
  name: string;
  
  /** 
   * Where to insert the layer relative to content.
   * - "prepend": Before content (default for visual overlays)
   * - "append": After content (for effects that should be on top)
   */
  insertPosition: "prepend" | "append";
  
  /** 
   * Optional: Override z-index calculation.
   * If not provided, z-index is assigned dynamically based on registration order.
   * Use sparingly — prefer dynamic ordering.
   */
  zIndexOverride?: number;
  
  /** 
   * Callback invoked after layer is created and inserted.
   * Use for setting up animations, observers, event listeners.
   */
  onSetup?: (layer: HTMLElement, host: HTMLElement) => void;
  
  /** 
   * Callback invoked before layer is removed.
   * Use for cleanup (disconnect observers, remove listeners).
   */
  onCleanup?: (layer: HTMLElement, host: HTMLElement) => void;
}

/**
 * Tracked layer data for cleanup.
 */
interface LfEffectLayerData {
  layer: HTMLElement;
  config: LfEffectLayerConfig;
  order: number;
}

/**
 * Layer manager API exposed by effects service.
 */
interface LfEffectLayerManager {
  /** 
   * Creates and injects a layer for the given effect.
   * Handles both shadow DOM and light DOM scenarios.
   */
  register: (host: HTMLElement, config: LfEffectLayerConfig) => HTMLElement;
  
  /** 
   * Removes a layer and runs cleanup callbacks.
   */
  unregister: (host: HTMLElement, effectName: string) => void;
  
  /** 
   * Gets an existing layer for an effect on the host.
   */
  getLayer: (host: HTMLElement, effectName: string) => HTMLElement | null;
  
  /** 
   * Gets all layers registered on a host, ordered by z-index.
   */
  getAllLayers: (host: HTMLElement) => HTMLElement[];
  
  /**
   * Recalculates z-indices for all layers on a host.
   * Called automatically after register/unregister.
   */
  reorderLayers: (host: HTMLElement) => void;
}
```

### 3.2 Implementation (Framework)

```typescript
// packages/framework/src/lf-effects/helpers.layers.ts

const BASE_Z_INDEX = 1;
const hostLayers = new WeakMap<HTMLElement, Map<string, LfEffectLayerData>>();
let globalOrderCounter = 0;

export const layerManager: LfEffectLayerManager = {
  register: (host, config) => {
    const { name, insertPosition = "prepend", zIndexOverride, onSetup } = config;
    
    // Get or create the layers map for this host
    let layers = hostLayers.get(host);
    if (!layers) {
      layers = new Map();
      hostLayers.set(host, layers);
    }
    
    // Prevent duplicate registration
    if (layers.has(name)) {
      return layers.get(name)!.layer;
    }
    
    // Create layer element
    const layer = document.createElement("div");
    layer.dataset.lfEffectLayer = name;
    layer.dataset.lfEffectOrder = String(++globalOrderCounter);
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      border-radius: inherit;
    `;
    
    // Determine injection target (shadow root or host itself)
    const target = host.shadowRoot ?? host;
    
    // Insert layer
    if (insertPosition === "prepend") {
      target.insertBefore(layer, target.firstChild);
    } else {
      target.appendChild(layer);
    }
    
    // Track layer data
    const order = globalOrderCounter;
    layers.set(name, { layer, config, order });
    
    // Recalculate z-indices
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
    
    // Run cleanup callback
    data.config.onCleanup?.(data.layer, host);
    
    // Remove from DOM
    data.layer.remove();
    
    // Remove from tracking
    layers.delete(effectName);
    
    // Recalculate z-indices for remaining layers
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
      .map(d => d.layer);
  },
  
  reorderLayers: (host) => {
    const layers = hostLayers.get(host);
    if (!layers) return;
    
    const sorted = Array.from(layers.values()).sort((a, b) => a.order - b.order);
    
    sorted.forEach((data, index) => {
      const zIndex = data.config.zIndexOverride ?? (BASE_Z_INDEX + index);
      data.layer.style.zIndex = String(zIndex);
    });
  },
};
```

---

## 4. Effect Migration Guide

### 4.1 Before (Pseudo-element approach)

```typescript
// Old neon-glow pattern
register: (element, options) => {
  element.dataset.lfNeonGlow = mode;
  // Relies on CSS ::after for glow animation
  // Conflicts with tilt's ::after usage
}
```

### 4.2 After (Layer approach)

```typescript
// New neon-glow pattern
register: (element, options) => {
  // 1. Set host attribute for base styling
  element.dataset.lfNeonGlow = mode;
  
  // 2. Create isolated layer for glow animation
  const layer = layerManager.register(element, {
    name: "neon-glow",
    insertPosition: "prepend",
    onSetup: (layer, host) => {
      // Apply glow-specific animations to layer
      layer.style.animation = `lf-neon-glow-pulse ${duration} ease-in-out infinite`;
      layer.style.boxShadow = `0 0 15px ${color}`;
      // Set up ResizeObserver if needed
    },
    onCleanup: (layer) => {
      // Disconnect observers
    },
  });
  
  // 3. Inject styles into shadow root if present
  if (element.shadowRoot) {
    stylesManager.adopt(element.shadowRoot);
  }
}
```

### 4.3 SCSS Mixin Updates

```scss
// Before: Animation on pseudo-element
[data-lf-neon-glow] {
  &::after {
    animation: lf-neon-glow-pulse ...;
    box-shadow: ...;
  }
}

// After: Animation on layer element
[data-lf-neon-glow] {
  // Host-level styling only (border, position, transform-style)
}

[data-lf-effect-layer="neon-glow"] {
  // Layer-specific animation
  animation: lf-neon-glow-pulse var(--lf-ui-neon-pulse-duration) ease-in-out infinite;
  box-shadow: 
    0 0 3px var(--lf-ui-neon-color),
    0 0 8px var(--lf-ui-neon-color),
    0 0 15px var(--lf-ui-neon-color),
    inset 0 0 3px var(--lf-ui-neon-color);
}
```

---

## 5. Effect Inventory & Migration Status

| Effect | Current Pattern | Layer Needed? | Migration Status |
|--------|-----------------|---------------|------------------|
| **Ripple** | Surface element | ✅ Already uses layer pattern | ✅ Reference implementation |
| **Tilt** | `::after` for highlight | ✅ Highlight layer | 🔄 Pending |
| **Neon Glow** | `::after` for animation | ✅ Glow layer | 🔄 Pending |
| **Neon Reflection** | Sibling element | ✅ Reflection layer | 🔄 Pending |
| **Frost** | `::before` for blur | ✅ Frost layer | 📋 Planned |
| **Parallax** | Transform on host | ❌ No layer needed | 📋 Planned |
| **Magnetic** | Transform on host | ❌ No layer needed | 📋 Planned |

---

## 6. Implementation Phases

### Phase 1: Layer Manager Foundation
1. Add `LfEffectLayerConfig` and related types to foundations
2. Implement `layerManager` in `helpers.layers.ts`
3. Export via effects service API
4. Unit tests for layer lifecycle

### Phase 2: Migrate Neon Glow
1. Update SCSS: move animation from `::after` to `[data-lf-effect-layer="neon-glow"]`
2. Update `helpers.neon-glow.ts` to use `layerManager.register()`
3. Migrate reflection to layer pattern
4. Verify glow + tilt composability

### Phase 3: Migrate Tilt
1. Update SCSS: move highlight from `::after` to `[data-lf-effect-layer="tilt"]`
2. Update `helpers.tilt.ts` to use `layerManager.register()`
3. Verify tilt responsiveness restored

### Phase 4: Validate & Document
1. E2E tests for composed effects (tilt + neon-glow + ripple)
2. Performance benchmarks
3. Update showcase examples
4. API documentation

---

## 7. CSS Custom Properties Contract

Each effect should namespace its CSS variables:

```scss
// Host-level (set by effect registration)
--lf-ui-<effect>-<property>

// Examples:
--lf-ui-neon-color
--lf-ui-neon-intensity
--lf-ui-neon-pulse-duration
--lf-ui-tilt-x
--lf-ui-tilt-y
--lf-ui-tilt-light-x
--lf-ui-tilt-light-y
--lf-ui-frost-blur
--lf-ui-frost-opacity
```

Layers inherit custom properties from the host, enabling coordination:

```scss
[data-lf-effect-layer="neon-glow"] {
  // Inherits --lf-ui-neon-color from host
  box-shadow: 0 0 15px var(--lf-ui-neon-color);
}
```

---

## 8. Performance Considerations

### 8.1 GPU Acceleration

Each layer should use compositor-friendly properties:
- `transform` (use `translateZ(0)` to force layer)
- `opacity`
- `filter` (sparingly)
- `box-shadow` with `will-change: box-shadow`

### 8.2 Layer Count

- Avoid excessive layers (aim for < 5 per element)
- Consider combining visual effects that don't conflict
- Use `content-visibility: auto` for off-screen elements

### 8.3 Memory

- WeakMap for element tracking (auto-cleanup on GC)
- Shared adopted stylesheets (deduplicated per shadow root)
- ResizeObserver cleanup on unregister

---

## 9. Testing Strategy

### Unit Tests (Jest)
- Layer creation/removal lifecycle
- Z-index ordering correctness
- Shadow DOM vs light DOM injection
- Cleanup callback invocation

### E2E Tests (Cypress)
- Visual regression for composed effects
- Performance metrics (FPS during animations)
- Interaction with component lifecycle

---

## 10. Open Questions

1. **Layer inheritance**: Should layers inherit `border-radius` automatically, or require explicit configuration?
   - **Decision**: Auto-inherit via `border-radius: inherit`

2. **Event passthrough**: Should layers ever capture pointer events?
   - **Decision**: Default `pointer-events: none`; opt-in for interactive layers (ripple)

3. **Animation synchronization**: Should composed effects sync their animation timing?
   - **Decision**: Independent by default; `desync` option randomizes timing

---

## Appendix: Ripple as Reference Implementation

The existing ripple effect already follows the layer pattern:

```typescript
// Current ripple pattern (already compliant)
ripple: (element: HTMLElement, event: PointerEvent) => {
  // Creates a "surface" element for the ripple animation
  const surface = document.createElement("div");
  surface.dataset.lf = "ripple";
  // ... animation logic
  element.appendChild(surface);
  // Cleanup after animation
  surface.addEventListener("animationend", () => surface.remove());
}
```

This validates the layer approach and provides a template for migrating other effects.

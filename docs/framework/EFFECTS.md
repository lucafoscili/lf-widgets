# LfEffects

`LfEffects` is a utility class designed for managing visual effects within the LF Widgets framework. It provides a suite of methods to control UI enhancements such as backdrop overlays, lightbox modals, ripple animations, neon glow, and tilt interactions on components. These effects enhance the user experience by adding depth, interactivity, and visual feedback.

---

## Overview

- **Primary Purpose:**  
  Offer a centralized and consistent set of tools to manage visual effects in LF Widgets, such as displaying modal overlays, creating ripple animations on pointer events, and adding tilt interactions to elements.
- **Integration:**  
  Relies on the LF Widgets framework for debugging and logging (e.g., warning when multiple lightboxes are attempted) and uses the DOM to create and manipulate effect elements. It also interacts with CSS custom properties defined via the framework's effects variables.
- **Architecture:**  
  Uses a **Layer-Based Effects System** that enables unlimited composable visual effects on any element through real DOM elements ("layers") instead of pseudo-elements.

---

## Core Concepts

### Layer-Based Architecture

Each registerable effect creates **real DOM elements** ("layers") rather than relying on pseudo-elements:

```
┌─────────────────────────────────────────────────────────┐
│  Host Element (e.g., <lf-card>)                         │
│  [data-lf-neon-glow-host] [data-lf-tilt-host]           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [data-lf-effect-layer="neon-glow"]         z:1  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [data-lf-effect-layer="tilt-highlight"]    z:2  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ [data-lf-effect-layer="ripple"]            z:3  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ Component Content                               │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**Benefits:**
- **Unlimited effects** on a single element (no pseudo-element conflicts)
- **Fire-and-forget** API: `register()` / `unregister()` handles everything
- **Zero conflicts** between effects
- **Consistent pattern** across all effects
- **DOM-agnostic**: works with shadow DOM and light DOM

### Effect Categories

| Category | Effects | Pattern |
|----------|---------|---------|
| **Global overlays** | `backdrop`, `lightbox` | Show/hide API, single instance |
| **Registerable** | `neon-glow`, `ripple`, `tilt` | Register/unregister on elements |

### Per-Effect Host Attributes

Each registerable effect sets its own host attribute for granular CSS targeting:

| Effect | Host Attribute | Purpose |
|--------|---------------|---------|
| `neon-glow` | `data-lf-neon-glow-host` | `overflow: visible` for glow |
| `ripple` | `data-lf-ripple-host` | `overflow: hidden` for containment |
| `tilt` | `data-lf-tilt-host` | `perspective`, `transform-style` |

---

## Adding a New Effect (Workflow Map)

This section provides a step-by-step guide for adding a new effect to the LfEffects system.

### Quick Reference Checklist

```text
1. [ ] Foundations: Add to LF_EFFECTS_LIST (alphabetical)
2. [ ] Foundations: Add to LF_EFFECTS_REGISTERABLE (if registerable)
3. [ ] Foundations: Add layer names to LF_EFFECTS_LAYER_NAMES
4. [ ] Foundations: Add host attribute to LF_EFFECTS_HOST_ATTRIBUTES
5. [ ] Foundations: Add CSS vars to LF_EFFECTS_VARS
6. [ ] Foundations: Define options interface (LfEffects<Name>Options)
7. [ ] Foundations: Define defaults constant (LF_EFFECTS_<NAME>_DEFAULTS)
8. [ ] Foundations: Update LfEffectsInterface (register/unregister)
9. [ ] Build: yarn build:foundations
10. [ ] SCSS: Add host mixin to _framework.scss (lf-fw-<name>-host)
11. [ ] SCSS: Add effect mixin to _framework.scss (lf-fw-<name>)
12. [ ] SCSS: Add to global.scss @include (correct order!)
13. [ ] Build: yarn build:core (triggers SCSS prebuild)
14. [ ] Framework: Create helper module (helpers.<name>.ts)
15. [ ] Framework: Wire register/unregister in lf-effects.ts
16. [ ] Build: yarn build (full rebuild)
17. [ ] Tests: Add unit tests to lf-effects.spec.ts
18. [ ] Showcase: Update effects.ts data
```

### File Locations

```text
packages/
├── foundations/src/framework/
│   ├── effects.constants.ts      # LF_EFFECTS_*, layer names, host attrs, CSS vars, defaults
│   └── effects.declarations.ts   # LfEffectsInterface, options types, layer manager types
├── framework/src/lf-effects/
│   ├── lf-effects.ts             # Main class
│   ├── helpers.layers.ts         # Layer manager (shared)
│   ├── helpers.neon-glow.ts      # Neon glow effect
│   ├── helpers.ripple.ts         # Ripple effect
│   └── helpers.tilt.ts           # Tilt effect
├── core/src/style/
│   ├── _variables.scss           # $lf-keyframes
│   ├── global.scss               # Effect includes (order matters!)
│   └── mixins/_framework.scss    # Effect mixins
└── showcase/src/components/lf-showcase/assets/data/
    └── effects.ts                # Showcase examples
```

### Step-by-Step Implementation

#### 1. Foundations Layer

**effects.constants.ts:**

```typescript
// Add to LF_EFFECTS_LIST (alphabetical)
export const LF_EFFECTS_LIST = [
  "backdrop",
  "lightbox",
  "neon-glow",
  "ripple",
  "tilt",
  "your-effect", // ADD
] as const;

// Add to LF_EFFECTS_REGISTERABLE (if effect uses register/unregister)
export const LF_EFFECTS_REGISTERABLE = ["neon-glow", "ripple", "tilt", "your-effect"] as const;

// Add layer names
export const LF_EFFECTS_LAYER_NAMES = {
  // ... existing ...
  yourEffect: {
    main: "your-effect",
    secondary: "your-effect-secondary", // if needed
  },
} as const;

// Add host attribute
export const LF_EFFECTS_HOST_ATTRIBUTES = {
  // ... existing ...
  yourEffect: "data-lf-your-effect-host",
} as const;

// Add CSS variables
export const LF_EFFECTS_VARS = {
  // ... existing ...
  yourEffect: {
    prop1: "--lf-ui-your-effect-prop1",
    prop2: "--lf-ui-your-effect-prop2",
  },
} as const;

// Add defaults
export const LF_EFFECTS_YOUR_EFFECT_DEFAULTS: {
  prop1: number;
  prop2: string;
} = {
  prop1: 10,
  prop2: "value",
};
```

**effects.declarations.ts:**

```typescript
// Add options interface
export interface LfEffectsYourEffectOptions {
  /** Description. Defaults to 10. */
  prop1?: number;
  /** Description. Defaults to "value". */
  prop2?: string;
}

// Update LfEffectsInterface
export interface LfEffectsInterface {
  register: {
    // ... existing ...
    yourEffect: (element: HTMLElement, options?: LfEffectsYourEffectOptions) => void;
  };
  unregister: {
    // ... existing ...
    yourEffect: (element: HTMLElement) => void;
  };
}
```

#### 2. SCSS Layer

**_framework.scss:**

```scss
/*******************************************
 * @mixin lf-fw-your-effect-host
 * Host styling for elements with your-effect.
 *******************************************/
@mixin lf-fw-your-effect-host {
  [data-lf-your-effect-host] {
    position: relative;
    // Effect-specific host requirements
  }
}

/*******************************************
 * @mixin lf-fw-your-effect
 * Layer styling for your-effect.
 *******************************************/
@mixin lf-fw-your-effect {
  [data-lf-effect-layer="your-effect"] {
    // Layer-specific styling
    // Use CSS custom properties: var(--lf-ui-your-effect-prop1)
  }
}
```

**global.scss:**

```scss
// Host styles (order matters for overflow handling!)
@include lf-fw-ripple-host;     // overflow: hidden
@include lf-fw-tilt-host;       // overflow: hidden
@include lf-fw-neon-glow-host;  // overflow: visible
@include lf-fw-your-effect-host; // ADD based on overflow needs

// Effect styles
@include lf-fw-neon-glow;
@include lf-fw-ripple;
@include lf-fw-tilt;
@include lf-fw-your-effect;     // ADD
```

#### 3. Framework Layer (Helper Module)

**helpers.your-effect.ts:**

```typescript
import {
  LF_EFFECTS_HOST_ATTRIBUTES,
  LF_EFFECTS_LAYER_NAMES,
  LF_EFFECTS_YOUR_EFFECT_DEFAULTS,
  LF_EFFECTS_VARS,
  LfEffectsYourEffectOptions,
} from "@lf-widgets/foundations";
import { layerManager } from "./helpers.layers";

//#region Constants
const LAYER_NAME = LF_EFFECTS_LAYER_NAMES.yourEffect.main;
const HOST_ATTRIBUTE = LF_EFFECTS_HOST_ATTRIBUTES.yourEffect;
const DEFAULTS = LF_EFFECTS_YOUR_EFFECT_DEFAULTS;
//#endregion

//#region State
const elementData = new WeakMap<HTMLElement, {
  // Effect-specific tracked data
  handler?: (e: Event) => void;
  options: Required<LfEffectsYourEffectOptions>;
}>();
//#endregion

//#region Public API
export const yourEffectEffect = {
  register: (element: HTMLElement, options: LfEffectsYourEffectOptions = {}): void => {
    if (elementData.has(element)) return;

    const resolvedOptions = { ...DEFAULTS, ...options };
    const { yourEffect } = LF_EFFECTS_VARS;

    // Set CSS custom properties
    element.style.setProperty(yourEffect.prop1, `${resolvedOptions.prop1}px`);
    element.style.setProperty(yourEffect.prop2, resolvedOptions.prop2);

    // Register layer via layer manager
    layerManager.register(element, {
      name: LAYER_NAME,
      hostAttribute: HOST_ATTRIBUTE,
      insertPosition: "prepend", // or "append"
      onSetup: (layer, host) => {
        // Layer-specific initialization
      },
    });

    // Store for cleanup
    elementData.set(element, { options: resolvedOptions });
  },

  unregister: (element: HTMLElement): void => {
    const data = elementData.get(element);
    if (!data) return;

    const { yourEffect } = LF_EFFECTS_VARS;

    // Remove event listeners if any
    // ...

    // Unregister layer
    layerManager.unregister(element, LAYER_NAME);

    // Clean up CSS custom properties
    element.style.removeProperty(yourEffect.prop1);
    element.style.removeProperty(yourEffect.prop2);

    elementData.delete(element);
  },
};
//#endregion
```

**lf-effects.ts:**

```typescript
import { yourEffectEffect } from "./helpers.your-effect";

export class LfEffects implements LfEffectsInterface {
  register = {
    // ... existing ...
    yourEffect: (element: HTMLElement, options: LfEffectsYourEffectOptions = {}) => {
      if (this.isRegistered(element, "your-effect")) {
        this.#MANAGER.debug.logs.new(this, "Element already has your-effect registered.", "warning");
        return;
      }

      yourEffectEffect.register(element, options);
      this.#addEffect(element, "your-effect");
    },
  };

  unregister = {
    // ... existing ...
    yourEffect: (element: HTMLElement) => {
      if (!this.isRegistered(element, "your-effect")) return;

      yourEffectEffect.unregister(element);
      this.#removeEffect(element, "your-effect");
    },
  };
}
```

### Build Commands

```bash
# After foundations changes
yarn build:foundations

# After SCSS changes (triggers prebuild → GLOBAL_STYLES regeneration)
yarn build:core

# Full rebuild (recommended after all changes)
yarn build

# Run tests
yarn test:unit
```

---

## Constructor

### `constructor(lfFramework: LfFrameworkInterface)`

- **Description:**  
  Instantiates an `LfEffects` instance by saving a reference to the LF Widgets framework. This reference is used for logging (through the framework's debug module) and to ensure consistent behavior with other framework-managed components.
- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";

  const lfFramework = await getLfFramework();
  const effectsManager = lfFramework.effects;
  ```

---

## Private Helpers

### `#appendToWrapper(element: HTMLElement): void`

- **Purpose:**  
  Ensures that global effect elements (backdrop, lightbox) are appended to a common wrapper in the document.
  - If the wrapper (`<div class="lf-effects">`) does not exist, it is created and appended to `document.body`.
  - The provided element is then appended to this wrapper.
- **Note:**  
  This method is used internally by the backdrop and lightbox methods to manage the placement of dynamically created DOM elements.

---

## Public Methods & Properties

### `layers`

- **Description:**  
  The Layer Manager API for creating and managing isolated effect layers. Used internally by registerable effects, but also exposed for advanced use cases.
- **Methods:**

  - **`register(host: HTMLElement, config: LfEffectLayerConfig): HTMLElement`**  
    Creates and injects a layer element for the given effect.

  - **`unregister(host: HTMLElement, effectName: string): void`**  
    Removes a layer and runs cleanup callbacks.

  - **`getLayer(host: HTMLElement, effectName: string): HTMLElement | null`**  
    Gets an existing layer for an effect on the host.

  - **`getAllLayers(host: HTMLElement): HTMLElement[]`**  
    Gets all layers registered on a host, ordered by z-index.

  - **`reorderLayers(host: HTMLElement): void`**  
    Recalculates z-indices for all layers on a host.

  - **`registerTransform(host, effectName, transform, priority?, hostAttribute?): void`**  
    Registers a transform contribution from an effect. The layer manager composes all transforms into `--lf-ui-effects-transform`.

  - **`updateTransform(host, effectName, transform): void`**  
    Updates an existing transform contribution (efficient for dynamic effects like tilt).

  - **`unregisterTransform(host, effectName): void`**  
    Removes a transform contribution and recomposes remaining transforms.

---

### `set`

- **Description:**  
  An object exposing methods to adjust effect parameters at runtime.
- **Methods:**

  - **`intensity(key: keyof LfEffectsIntensities, value: number): void`**  
    Sets the intensity for a given effect (e.g., tilt, neon-glow).  
    **Example:**

    ```ts
    effectsManager.set.intensity("tilt", 15);
    effectsManager.set.intensity("neon-glow", 0.8);
    ```

  - **`timeout(key: keyof LfEffectsTimeouts, value: number): void`**  
    Sets the timeout duration (in milliseconds) for timed effects.  
    **Example:**

    ```ts
    effectsManager.set.timeout("ripple", 600);
    effectsManager.set.timeout("lightbox", 400);
    ```

---

### `backdrop`

- **Description:**  
  An object managing the display and behavior of a backdrop overlay, often used with modal dialogs or lightboxes.
- **Methods:**

  - **`show(onClose?: () => void): void`**  
    Creates and displays a backdrop element as an overlay.

    - Prevents propagation of pointer events.
    - Accepts an optional callback (`onClose`) which is invoked when a pointer-down event is detected.

    **Example:**

    ```ts
    effectsManager.backdrop.show(() => {
      console.log("Backdrop clicked, closing modal...");
    });
    ```

  - **`hide(): void`**  
    Hides the backdrop by fading its opacity to 0 and then removing it from the DOM once the transition ends.

  - **`isVisible(): boolean`**  
    Returns a boolean indicating whether a backdrop is currently active.

---

### `lightbox`

- **Description:**  
  An object that controls the lightbox effect—a modal display for showcasing content.
- **Methods:**

  - **`show(element: HTMLElement, closeCb?: (...args: any[]) => void): Promise<void>`**  
    Displays a lightbox modal by:

    - Cloning the provided element (with special handling for components starting with `"LF-"` to transfer their properties).
    - Setting necessary accessibility attributes (`role`, `aria-modal`, etc.).
    - Adding a keyboard handler to close the modal on `Escape` key press.
    - Showing the backdrop alongside the lightbox.

    **Example:**

    ```ts
    await effectsManager.lightbox.show(
      document.querySelector(".my-element"),
      () => {
        console.log("Lightbox closed.");
      },
    );
    ```

  - **`hide(): void`**  
    Hides and removes the lightbox from the DOM, and then hides the backdrop.

  - **`isVisible(): boolean`**  
    Returns a boolean indicating whether a lightbox is currently open.

---

### `isRegistered(element: HTMLElement, effectName?: LfEffectName): boolean`

- **Description:**  
  Checks if an element has effects registered.
- **Parameters:**
  - **`element`** — The element to check.
  - **`effectName`** — (Optional) Check for a specific effect. If omitted, checks for any effect.
- **Returns:**  
  `true` if the element has the specified effect (or any effect if not specified).

**Example:**

```ts
// Check for specific effect
if (effectsManager.isRegistered(element, "tilt")) {
  console.log("Tilt effect is active");
}

// Check for any effect
if (effectsManager.isRegistered(element)) {
  console.log("Element has effects registered");
}
```

---

### `register`

- **Description:**  
  An object providing methods to register specific effects on elements.
- **Methods:**

  - **`neonGlow(element: HTMLElement, options?: LfEffectsNeonGlowOptions): void`**  
    Registers a neon glow effect with pulsating border and optional reflection.

    **Options:**
    | Option | Type | Default | Description |
    |--------|------|---------|-------------|
    | `color` | `LfColorInput` | Theme secondary | Glow color |
    | `desync` | `boolean` | `false` | Randomize timing for multiple elements |
    | `intensity` | `number` | `0.7` | Glow intensity (0-1) |
    | `mode` | `"outline" \| "filled"` | `"outline"` | Display mode |
    | `pulseSpeed` | `"burst" \| "fast" \| "normal" \| "slow"` | `"burst"` | Animation speed |
    | `reflection` | `boolean` | `false` | Show reflection below element |
    | `reflectionBlur` | `number` | `12` | Reflection blur in pixels |
    | `reflectionOffset` | `number` | `5` | Reflection offset percentage |
    | `reflectionOpacity` | `number` | `0.5` | Reflection opacity (0-1) |

    **Example:**

    ```ts
    effectsManager.register.neonGlow(element, {
      mode: "outline",
      color: "#00ffff",
      intensity: 0.8,
      pulseSpeed: "burst",
      desync: true,
      reflection: true,
    });
    ```

  - **`ripple(element: HTMLElement, options?: LfEffectsRippleOptions): void`**  
    Registers a ripple effect that triggers on pointerdown events.

    **Options:**
    | Option | Type | Default | Description |
    |--------|------|---------|-------------|
    | `autoSurfaceRadius` | `boolean` | `true` | Inherit border-radius from parent |
    | `borderRadius` | `string` | `""` | Custom border-radius (overrides auto) |
    | `color` | `string` | `""` | Custom ripple color |
    | `duration` | `number` | `500` | Animation duration in ms |
    | `easing` | `string` | `"cubic-bezier(0.4, 0, 0.2, 1)"` | CSS easing function |
    | `scale` | `number` | `1` | Scale factor for ripple size |

    **Example:**

    ```ts
    effectsManager.register.ripple(element, {
      duration: 600,
      color: "rgba(255, 255, 255, 0.3)",
      scale: 1.2,
    });
    ```

  - **`tilt(element: HTMLElement, intensity?: number): void`**  
    Registers a 3D tilt/hover effect with dynamic radial highlight.

    **Example:**

    ```ts
    effectsManager.register.tilt(element, 12);
    ```

---

### `unregister`

- **Description:**  
  An object providing methods to remove registered effects from elements.
- **Methods:**

  - **`neonGlow(element: HTMLElement): void`**  
    Removes the neon glow effect, cleaning up layers and CSS properties.

  - **`ripple(element: HTMLElement): void`**  
    Removes the ripple effect, cleaning up the surface layer and event listener.

  - **`tilt(element: HTMLElement): void`**  
    Removes the tilt effect, cleaning up layers, transforms, and event listeners.

**Example:**

```ts
effectsManager.unregister.neonGlow(element);
effectsManager.unregister.ripple(element);
effectsManager.unregister.tilt(element);
```

---

## Integration with the LF Widgets Framework

- **Logging & Debugging:**  
  Throughout its methods, `LfEffects` leverages the framework's `debug` module to log warnings—such as attempting to register an effect on an element that already has it.
- **Event Management:**  
  By attaching and removing event listeners (for pointer events and keyboard events), it ensures that effects such as ripple, tilt, and lightbox interactions remain responsive and accessible.
- **DOM Manipulation:**  
  It dynamically creates and appends DOM elements (e.g., backdrops, lightbox containers, effect layers) ensuring a consistent overlay environment for effects across the application.
- **WeakMap Tracking:**  
  Uses WeakMap for element-specific data, ensuring automatic cleanup when elements are garbage collected.

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = await getLfFramework();
const effectsManager = lfFramework.effects;

// ─── Global Effects ──────────────────────────────────────────────────────────

// Show a backdrop with an onClose callback
effectsManager.backdrop.show(() => {
  console.log("Backdrop was clicked. Closing any open modal...");
});

// Display a lightbox for a given element
const contentElement = document.querySelector(".modal-content") as HTMLElement;
effectsManager.lightbox.show(contentElement, () => {
  console.log("Lightbox closed via callback.");
});

// ─── Registerable Effects ────────────────────────────────────────────────────

// Neon glow with custom options
const card = document.querySelector(".card") as HTMLElement;
effectsManager.register.neonGlow(card, {
  mode: "outline",
  pulseSpeed: "burst",
  desync: true,
  reflection: true,
});

// Ripple effect (triggers automatically on pointerdown)
const button = document.querySelector(".button") as HTMLElement;
effectsManager.register.ripple(button, {
  duration: 500,
  color: "rgba(255, 255, 255, 0.3)",
});

// Tilt effect with custom intensity
const tiltCard = document.querySelector(".tilt-card") as HTMLElement;
effectsManager.register.tilt(tiltCard, 15);

// ─── Composing Multiple Effects ──────────────────────────────────────────────

// Multiple effects on the same element (layer-based architecture allows this!)
const fancyCard = document.querySelector(".fancy-card") as HTMLElement;
effectsManager.register.neonGlow(fancyCard, { mode: "filled" });
effectsManager.register.tilt(fancyCard, 10);
effectsManager.register.ripple(fancyCard);

// ─── Checking & Unregistering ────────────────────────────────────────────────

// Check if effect is registered
if (effectsManager.isRegistered(fancyCard, "neon-glow")) {
  console.log("Neon glow is active on this card");
}

// Unregister effects when done
effectsManager.unregister.neonGlow(fancyCard);
effectsManager.unregister.tilt(fancyCard);
effectsManager.unregister.ripple(fancyCard);
```

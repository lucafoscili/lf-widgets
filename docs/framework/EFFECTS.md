# LfEffects

`LfEffects` is a utility class designed for managing visual effects within the LF Widgets framework. It provides a suite of methods to control UI enhancements such as backdrop overlays, lightbox modals, ripple animations, neon glow, and tilt interactions on components. These effects enhance the user experience by adding depth, interactivity, and visual feedback.

---

## Overview

- **Primary Purpose:**  
  Offer a centralized and consistent set of tools to manage visual effects in LF Widgets, such as displaying modal overlays, creating ripple animations on pointer events, and adding tilt interactions to elements.
- **Integration:**  
  Relies on the LF Widgets framework for debugging and logging (e.g., warning when multiple lightboxes are attempted) and uses the DOM to create and manipulate effect elements. It also interacts with CSS custom properties defined via the framework's effects variables.

---

## Adding a New Effect (Workflow Map)

This section provides a step-by-step guide for adding a new effect to the LfEffects system.

### Quick Reference Checklist

```text
1. [ ] Foundations: Add to LF_EFFECTS_LIST (alphabetical)
2. [ ] Foundations: Add CSS vars to LF_EFFECTS_VARS
3. [ ] Foundations: Add to LF_ATTRIBUTES
4. [ ] Foundations: Define options interface (LfEffects<Name>Options)
5. [ ] Foundations: Update LfEffectsInterface (register/unregister)
6. [ ] Build: yarn build:foundations
7. [ ] SCSS: Add mixin to _framework.scss (lf-fw-<name>)
8. [ ] SCSS: Add to global.scss @include
9. [ ] Build: yarn build:core (triggers SCSS prebuild)
10. [ ] Framework: Create helper module (helpers/<name>.ts)
11. [ ] Framework: Wire register/unregister in lf-effects.ts
12. [ ] Build: yarn build (full rebuild)
13. [ ] Tests: Add unit tests to lf-effects.spec.ts
14. [ ] Showcase: Update effects.ts data
```

### Architecture Decision: Simple vs Fire-and-Forget

| Effect Type | Examples | Pattern |
|-------------|----------|---------|
| **Event-driven** | `tilt`, `ripple` | Direct event handlers in LfEffects class |
| **Fire-and-forget with CSS injection** | `neon-glow`, `frost` | Helper module in `helpers/` folder |

**Use a helper module when:**
- Effect needs CSS injection into Shadow DOM
- Effect has complex pseudo-element styling
- Effect requires `:host()` selector transformation for custom elements

### File Locations

```text
packages/
├── foundations/src/framework/
│   ├── effects.constants.ts      # LF_EFFECTS_LIST, LF_EFFECTS_VARS
│   └── effects.declarations.ts   # LfEffectsInterface, options types
├── foundations/src/foundations/
│   └── components.constants.ts   # LF_ATTRIBUTES
├── framework/src/lf-effects/
│   ├── lf-effects.ts             # Main class
│   └── helpers/                  # Effect-specific modules
│       └── <effect-name>.ts      # Fire-and-forget effects
├── core/src/style/
│   ├── _variables.scss           # $lf-keyframes
│   └── mixins/_framework.scss    # Effect mixins
└── showcase/src/style/mixins/
    └── _framework.scss           # Mirror of core mixins
```

### Step-by-Step Implementation

#### 1. Foundations Layer

**effects.constants.ts:**
```typescript
export const LF_EFFECTS_LIST = [
  "backdrop",
  "frost",       // alphabetical order
  "lightbox",
  "neon-glow",
  "ripple",
  "tilt",
  "your-effect", // ADD
] as const;

export const LF_EFFECTS_VARS = {
  // ... existing ...
  yourEffect: {
    prop1: "--lf-ui-your-effect-prop1",
    prop2: "--lf-ui-your-effect-prop2",
  },
} as const;
```

**components.constants.ts:**
```typescript
export const LF_ATTRIBUTES = {
  // ... existing ...
  yourEffect: "your-effect",
} as const;
```

**effects.declarations.ts:**
```typescript
export interface LfEffectsYourEffectOptions {
  /** Description. Defaults to X. */
  prop1?: number;
  /** Description. Defaults to Y. */
  prop2?: string;
}

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

#### 2. SCSS Layer (Core + Showcase)

**_framework.scss:**
```scss
@mixin lf-fw-your-effect {
  [data-lf="your-effect"] {
    // CSS custom property defaults
    --lf-ui-your-effect-prop1: 10px;
    --lf-ui-your-effect-prop2: blue;
    
    // Base styles
    position: relative;
    
    // Pseudo-elements for visual effect
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      // Effect-specific styles using CSS vars
    }
  }
}
```

**global.scss:**
```scss
@include lf-fw-your-effect;
```

#### 3. Framework Layer (Helper Module)

**helpers/your-effect.ts:**
```typescript
import { LF_ATTRIBUTES } from "@lf-widgets/foundations";
import { GLOBAL_STYLES } from "../../lf-theme/theme.global-styles.generated";
import type { LfEffects } from "../lf-effects";
import type { LfEffectsYourEffectOptions } from "@lf-widgets/foundations";

// ─── CSS Caching ─────────────────────────────────────────────────────────────
let cachedHostCss: string | null = null;

// ─── CSS Extraction ──────────────────────────────────────────────────────────
const getYourEffectCss = (forHost = false): string => {
  const selector = `[data-lf="${LF_ATTRIBUTES.yourEffect}"]`;
  const regex = new RegExp(
    `${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^}]*\\{[^}]*\\}`,
    "gs"
  );
  
  let css = "";
  let match: RegExpExecArray | null;
  while ((match = regex.exec(GLOBAL_STYLES)) !== null) {
    css += match[0] + "\n";
  }
  
  if (forHost && css) {
    // Transform [data-lf="your-effect"] → :host([data-lf="your-effect"])
    css = css.replace(
      new RegExp(`\\${selector}`, "g"),
      `:host(${selector})`
    );
  }
  
  return css;
};

const getOrBuildHostCss = (): string => {
  if (!cachedHostCss) {
    cachedHostCss = getYourEffectCss(true);
  }
  return cachedHostCss;
};

// ─── Registration ────────────────────────────────────────────────────────────
export const register = (
  element: HTMLElement,
  options: LfEffectsYourEffectOptions,
  effects: LfEffects,
): void => {
  const { prop1 = 10, prop2 = "blue" } = options;

  // Set data attribute for CSS targeting
  element.dataset.lf = LF_ATTRIBUTES.yourEffect;

  // Set CSS custom properties
  element.style.setProperty("--lf-ui-your-effect-prop1", `${prop1}px`);
  element.style.setProperty("--lf-ui-your-effect-prop2", prop2);

  // Inject :host() CSS into element's own shadow root (custom elements only)
  if (element.shadowRoot) {
    const css = getOrBuildHostCss();
    if (css) {
      const style = new CSSStyleSheet();
      style.replaceSync(css);
      element.shadowRoot.adoptedStyleSheets = [
        ...element.shadowRoot.adoptedStyleSheets,
        style,
      ];
    }
  }
  // NOTE: global.scss handles [data-lf] selectors for light DOM / parent shadow roots

  // Track element
  effects["_components"].add(element);
};

// ─── Unregistration ──────────────────────────────────────────────────────────
export const unregister = (
  element: HTMLElement,
  effects: LfEffects,
): void => {
  // Remove data attribute
  delete element.dataset.lf;

  // Remove CSS custom properties
  element.style.removeProperty("--lf-ui-your-effect-prop1");
  element.style.removeProperty("--lf-ui-your-effect-prop2");

  // Remove from tracking
  effects["_components"].delete(element);
};
```

**lf-effects.ts:**
```typescript
import * as yourEffectHelper from "./helpers/your-effect";

export class LfEffects implements LfEffectsInterface {
  register = {
    // ... existing ...
    yourEffect: (element: HTMLElement, options: LfEffectsYourEffectOptions = {}) => {
      if (this.isRegistered(element)) {
        this.#MANAGER.debug.logs.new(this, "Element already registered.", "warning");
        return;
      }
      yourEffectHelper.register(element, options, this);
    },
  };

  unregister = {
    // ... existing ...
    yourEffect: (element: HTMLElement) => {
      yourEffectHelper.unregister(element, this);
    },
  };
}
```

### Critical Gotchas (Shadow DOM)

| Issue | Wrong | Correct |
|-------|-------|---------|
| Getting element's shadow root | `element.getRootNode()` | `element.shadowRoot` |
| Host styling selector | `[data-lf="effect"]` | `:host([data-lf="effect"])` |
| Theme color usage | `color` (RGB triplet) | `rgb(${color})` |
| CSS injection scope | All shadow roots | Only `element.shadowRoot` |

**Why `element.getRootNode()` doesn't work:**
```typescript
// element.getRootNode() returns the PARENT shadow root, not element's own
const root = element.getRootNode(); // ❌ Parent's shadow root
const own = element.shadowRoot;      // ✅ Element's own shadow root
```

**Why selector transformation is needed:**
```scss
// global.scss provides this (works in light DOM / parent shadow):
[data-lf="effect"] { ... }

// Custom element's own shadow root needs:
:host([data-lf="effect"]) { ... }
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
  Instantiates an `LfEffects` instance by saving a reference to the LF Widgets framework. This reference is used for logging (through the framework’s debug module) and to ensure consistent behavior with other framework-managed components.
- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  import { LfEffects } from "./LfEffects";

  const lfFramework = getLfFramework();
  const effectsManager = new LfEffects(lfFramework);
  ```

---

## Private Helpers

### `#appendToWrapper(element: HTMLElement): void`

- **Purpose:**  
  Ensures that effect elements are appended to a common wrapper in the document.
  - If the wrapper (`<div class="lf-effects">`) does not exist, it is created and appended to `document.body`.
  - The provided element is then appended to this wrapper.
- **Note:**  
  This method is used internally by the backdrop and lightbox methods to manage the placement of dynamically created DOM elements.

---

### `#getParentStyle(element: HTMLElement): Pick<CSSStyleDeclaration, "backgroundColor" | "borderRadius" | "color">`

- **Purpose:**  
  Retrieves key style properties (`backgroundColor`, `borderRadius`, and `color`) from the element's parent.
  - These properties are used to ensure that effects (such as ripples) harmonize with the parent’s visual style.
- **Usage:**  
  Internally called by the ripple method to obtain style context for positioning and styling the effect.

---

## Public Methods & Properties

### `set`

- **Description:**  
  An object exposing methods to adjust effect parameters at runtime.
- **Methods:**

  - **`intensity(key: keyof LfEffectsIntensities, value: number): void`**  
    Sets the intensity for a given effect (e.g., tilt).  
    **Example:**

    ```ts
    effectsManager.set.intensity("tilt", 15);
    ```

  - **`timeout(key: keyof LfEffectsTimeouts, value: number): void`**  
    Sets the timeout duration (in milliseconds) for timed effects like the ripple or lightbox dismissal.  
    **Example:**

    ```ts
    effectsManager.set.timeout("ripple", 600);
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

### `ripple`

- **Description:**  
  Generates a ripple animation effect on a given element in response to a pointer event.
- **Parameters:**
  - **`e: PointerEvent`** — The triggering pointer event.
  - **`element: HTMLElement`** — The element on which the ripple should appear.
  - **`autoSurfaceRadius?: boolean`** — (Optional) If `true`, automatically applies the parent's border radius to the element.
- **How It Works:**
  - Computes the position of the ripple based on the event coordinates and the element's bounding rectangle.
  - Retrieves parent styles (color, background color, border radius) to style the ripple.
  - Appends a `<span>` element with appropriate CSS custom properties to create the ripple effect.
  - Schedules the ripple for removal after a timeout defined in `#TIMEOUT.ripple`.
- **Example:**

  ```ts
  element.addEventListener("pointerdown", (e) => {
    effectsManager.ripple(e, element);
  });
  ```

---

### `isRegistered(element: HTMLElement): boolean`

- **Description:**  
  Checks if an element has been registered for a tilt effect.
- **Returns:**  
  `true` if the element is registered; `false` otherwise.

---

### `register`

- **Description:**  
  An object providing methods to register specific effects on elements.
- **Methods:**

  - **`tilt(element: HTMLElement, intensity?: number): void`**  
    Registers a tilt effect on the specified element by:

    - Adding a `pointermove` event listener that calculates tilt angles and light coordinates based on pointer position.
    - Adding a `pointerleave` listener to reset the effect.
    - Storing the element in an internal set for tracking.

    **Example:**

    ```ts
    effectsManager.register.tilt(document.querySelector(".tilt-element"), 12);
    ```

---

### `unregister`

- **Description:**  
  An object providing methods to remove registered effects from elements.
- **Methods:**

  - **`tilt(element: HTMLElement): void`**  
    Removes the tilt effect by detaching the event listeners and removing the element from the internal tracking set.

    **Example:**

    ```ts
    effectsManager.unregister.tilt(document.querySelector(".tilt-element"));
    ```

---

## Integration with the LF Widgets Framework

- **Logging & Debugging:**  
  Throughout its methods, `LfEffects` leverages the framework's `debug` module to log warnings—such as attempting to open a lightbox when one is already active.
- **Event Management:**  
  By attaching and removing event listeners (for pointer events and keyboard events), it ensures that effects such as ripple and lightbox interactions remain responsive and accessible.
- **DOM Manipulation:**  
  It dynamically creates and appends DOM elements (e.g., backdrops, lightbox containers) ensuring a consistent overlay environment for effects across the application.

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();
const effectsManager = lfFramework.effects;

// Show a backdrop with an onClose callback
effectsManager.backdrop.show(() => {
  console.log("Backdrop was clicked. Closing any open modal...");
});

// Display a lightbox for a given element
const contentElement = document.querySelector(".modal-content") as HTMLElement;
effectsManager.lightbox.show(contentElement, () => {
  console.log("Lightbox closed via callback.");
});

// Apply a ripple effect on pointer events
document
  .querySelector(".ripple-button")
  ?.addEventListener("pointerdown", (e) => {
    effectsManager.ripple(e, e.currentTarget as HTMLElement);
  });

// Register a tilt effect on an element with a custom intensity
const tiltElement = document.querySelector(".tilt-card") as HTMLElement;
effectsManager.register.tilt(tiltElement, 15);

// Later, if needed, unregister the tilt effect
effectsManager.unregister.tilt(tiltElement);
```

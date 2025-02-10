# LfEffects

`LfEffects` is a utility class designed for managing visual effects within the LF Widgets framework. It provides a suite of methods to control UI enhancements such as backdrop overlays, lightbox modals, ripple animations, and tilt interactions on components. These effects enhance the user experience by adding depth, interactivity, and visual feedback.

---

## Overview

- **Primary Purpose:**  
  Offer a centralized and consistent set of tools to manage visual effects in LF Widgets, such as displaying modal overlays, creating ripple animations on pointer events, and adding tilt interactions to elements.
- **Integration:**  
  Relies on the LF Widgets framework for debugging and logging (e.g., warning when multiple lightboxes are attempted) and uses the DOM to create and manipulate effect elements. It also interacts with CSS custom properties defined via the framework’s effects variables.

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

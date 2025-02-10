# LfPortal

`LfPortal` is a utility class that manages elements within a dedicated portal container. It is responsible for positioning these elements relative to an anchor (which can be either an HTML element or coordinate object) and handling click-away behavior to dismiss them when the user interacts outside of their boundaries.

## Overview

- **Primary Purpose:**  
  To control the dynamic placement and dismissal of elements (such as tooltips, modals, or dropdowns) by:
  - Appending them to a dedicated portal container.
  - Continuously updating their position using `requestAnimationFrame`.
  - Handling click-away actions to automatically close the element when necessary.
- **Integration:**  
  Relies on the LF Widgets framework to:
  - Register and remove click-away callbacks.
  - Log debug information via the framework's debug module.
  - Maintain consistent state management across portal-managed elements.

---

## Constructor

### `constructor(lfFramework: LfFrameworkInterface)`

- **Description:**  
  Instantiates an `LfPortal` instance by saving a reference to the provided LF Widgets framework. This reference is used for accessing global debugging and click callback functionality.
- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  import { LfPortal } from "./LfPortal";

  const lfFramework = getLfFramework();
  const portalManager = new LfPortal(lfFramework);
  ```

---

## Private Helpers

### `#appendToWrapper(element: HTMLElement): void`

- **Purpose:** Ensures that a dedicated portal container (a `<div>` with the class `"lf-portal"`) exists in the DOM and appends the provided element to it.
- **Details:**
  - If the portal container does not exist, it is created and appended to `document.body`.
  - Operates only in browser environments (checks for the existence of `document`).

---

### `#clean(element: HTMLElement): void`

- **Purpose:** Cleans up the portal management state for the specified element.
- **How It Works:**
  - Verifies that the element is currently managed by the portal.
  - Retrieves the associated state (which includes the original parent and a dismiss callback).
  - Removes the click-away callback from the framework.
  - Restores the element to its original parent (if available).
  - Deletes the element’s state from the internal WeakMap.

---

### `#schedulePositionUpdate(element: HTMLElement): void`

- **Purpose:** Queues the provided element for a repositioning update.
- **How It Works:**
  - Adds the element to an internal queue.
  - Uses `requestAnimationFrame` to batch and execute position updates for all queued elements in the next animation frame.

---

### `#executeRun(element: HTMLElement): void`

- **Purpose:** Performs the actual repositioning logic for a portal-managed element.
- **Process:**
  1. **Validation:**
     - Checks whether the element is still registered in the portal and is connected to the DOM.
     - If not, cleans up the element.
  2. **Resetting Style:**
     - Calls `#resetStyle` to clear any previous inline positioning.
  3. **Position Calculation:**
     - Retrieves the current state (which includes the anchor, margin, and placement settings).
     - If the anchor is not an HTML element, it uses raw `x` and `y` coordinates to position the element relative to the viewport.
     - If the anchor is an HTML element, it calculates available space using the element’s bounding rectangle and dynamically adjusts the position based on the specified `placement` (or defaults to `"auto"`).
  4. **Continuous Update:**
     - Schedules further position updates using `requestAnimationFrame` to adapt to any changes.

---

### `#isAnchorHTMLElement(anchor: LfPortalAnchor): anchor is HTMLElement`

- **Purpose:** Type guards whether the provided `anchor` is an HTML element.
- **Returns:** `true` if the anchor has a `tagName` property (i.e., is an HTMLElement), otherwise `false`.

---

### `#resetStyle(element: HTMLElement): void`

- **Purpose:** Clears inline styling related to positioning (such as `top`, `bottom`, `left`, `right`, and `display`) on the provided element.
- **Use Case:** Prepares the element for a fresh positioning calculation.

---

## Public Methods

### `close(element: HTMLElement): void`

- **Description:** Closes the portal element by cleaning up its state and resetting its inline styles.
- **How It Works:**
  - Invokes the internal `#clean` method to remove the element’s portal state and click-away callback.
  - Calls `#resetStyle` to clear any positioning styles applied to the element.

---

### `getState(element: HTMLElement): LfPortalState | undefined`

- **Description:** Retrieves the current portal state associated with the given element.
- **Usage Example:**

  ```ts
  const state = portalManager.getState(myElement);
  if (state) {
    // Access state properties like anchor, margin, and placement.
  }
  ```

---

### `isInPortal(element: HTMLElement): boolean`

- **Description:** Checks whether the specified element is currently managed by the portal.
- **Returns:** `true` if the element is registered in the portal’s state, otherwise `false`.

---

### `open(

element: HTMLElement, parent: HTMLElement, anchor?: LfPortalAnchor, margin?: number, placement?: LfPortalPlacements ): void`

- **Description:** Opens (or reopens) a portal element, positioning it relative to a given anchor and registering it for click-away dismissal.
- **Parameters:**
  - `element`: The HTML element to be managed within the portal.
  - `parent`: The original parent of the element, used for restoring its placement upon closing.
  - `anchor`: The reference point for positioning. Defaults to the `parent` if not provided. Can be either an HTML element or an object with coordinate properties (`x` and `y`).
  - `margin`: A numeric value (default is `0`) specifying the margin to apply around the element when positioning.
  - `placement`: A string (e.g., `"auto"`, `"tl"`, `"br"`) indicating the desired placement. Defaults to `"auto"`, which allows dynamic adjustment based on available space.
- **How It Works:**
  - **State Update:**
    - If the element is already managed, updates its existing state with new parameters.
    - If not, creates a new state with a dismiss callback that calls the `close` method.
  - **Registration & Positioning:**
    - Registers the click-away callback with the LF Widgets framework.
    - Appends the element to the portal container using `#appendToWrapper`.
    - Schedules a position update via `#schedulePositionUpdate` to ensure correct placement.

---

## Integration with the LF Widgets Framework

- **Logging & Debugging:** Throughout its operations, `LfPortal` leverages the framework's debug system to log warnings—such as when an expected state is missing—ensuring developers have insight into the portal’s behavior.
- **Click-Away Management:** By registering dismiss callbacks with the framework's click callback system (`addClickCallback`), `LfPortal` ensures that elements are automatically closed when a user clicks outside their boundaries.

- **Continuous Updates:** The use of `requestAnimationFrame` facilitates smooth, continuous updates to element positioning, allowing the portal to adapt dynamically to changes in the viewport or element dimensions.

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();
const portalManager = lfFramework.portal;

const myElement = document.createElement("div");
myElement.textContent = "I am a portal element";

// Open the element in the portal with a margin of 10 pixels and auto placement.
portalManager.open(myElement, document.body, myElement, 10, "auto");

// Later, to close the portal element:
portalManager.close(myElement);
```

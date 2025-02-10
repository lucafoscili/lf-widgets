# LfDrag

`LfDrag` is a utility class designed to manage drag interactions within the LF Widgets framework. It provides a robust set of methods to register various drag behaviors—such as custom drag, drag-to-drop, drag-to-resize, drag-to-scroll, and swipe gestures—by handling pointer events, thresholds, and momentum. Additionally, it offers methods to unregister these behaviors and access active drag sessions, ensuring efficient session management and cleanup.

---

## Overview

- **Primary Purpose:**  
  Handle and orchestrate drag interactions on HTML elements within the LF Widgets library. It supports multiple drag types by monitoring pointer events and applying movement logic (e.g., position updates, resizing, scrolling, and swipe detection).
- **Integration:**  
  Leverages the LF Widgets framework for logging and debugging. It maintains drag sessions using a WeakMap to associate elements with their respective drag data and callbacks, ensuring proper cleanup and avoiding memory leaks.

---

## Constructor

### `constructor(lfFramework: LfFrameworkInterface)`

- **Description:**  
  Instantiates an `LfDrag` instance and stores a reference to the LF Widgets framework. This reference is used primarily for logging (e.g., issuing warnings when an unregistered element is interacted with) and accessing debug utilities.
- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  import { LfDrag } from "./LfDrag";

  const lfFramework = getLfFramework();
  const lfDrag = new LfDrag(lfFramework);
  ```

---

## Private Helpers

### `#initializeSession(element: HTMLElement, callbacks: LfDragCallbacks = {}, dragLogicHandler: (e: PointerEvent, distX: number, distY: number) => void): void`

- **Purpose:** Sets up a new drag session for the specified element. It first cleans up any existing session on the element, then attaches threshold-aware pointer listeners to track when dragging should commence.
- **Behavior:**
  - Clears any pre-existing session for the element.
  - Attaches pointer event listeners with a threshold (defined by `#DRAG_THRESHOLD`).
  - Once the pointer movement exceeds the threshold, calls the provided `dragLogicHandler`.
  - Stores the session—including a cleanup callback—in an internal WeakMap.
- **Note:** The session’s cleanup callback resets the element’s styles (e.g., cursor and user select) and removes any temporary attributes.

---

### `#defaultPointerMoveAndUp(element: HTMLElement, session: LfDragSession): void`

- **Purpose:** Provides default behavior for pointer movement and termination if custom callbacks are not provided.
- **Behavior:**
  - Adds a `pointermove` listener to invoke the session’s `onMove` callback.
  - Adds a `pointerup` (and `pointercancel`) listener to remove the movement listeners and invoke the session’s `onEnd` callback.
- **Usage Context:** Invoked automatically during custom drag registration if the user does not supply their own `onMove` or `onEnd` handlers.

---

### `#setupThresholdAwarePointerDown(element: HTMLElement, threshold: number, startDragHandler: (downEvent: PointerEvent, distX: number, distY: number) => void): () => void`

- **Purpose:** Monitors pointer down events and tracks pointer movement until a defined distance threshold is exceeded, at which point it initiates the drag behavior.
- **Behavior:**
  - Records the initial pointer position on `pointerdown`.
  - On `pointermove`, computes the distance from the initial position.
  - When the computed distance exceeds the threshold, it prevents default behavior, captures the pointer, and invokes the `startDragHandler`.
- **Returns:** A cleanup function that removes the pointer event listeners attached during this process.

---

### `#dragToDropHandler(element: HTMLElement, e: PointerEvent): void`

- **Purpose:** Implements drag-to-drop behavior by updating the element’s position as it is dragged.
- **Behavior:**
  - Retrieves the current drag session for the element.
  - Captures the initial pointer coordinates and element positioning.
  - On pointer movement, adjusts the element’s `left` and `top` CSS properties accordingly.
  - Invokes the `onStart`, `onMove`, and `onEnd` callbacks to communicate the drag lifecycle.
- **Note:** Applies styles such as `position: absolute` and `cursor: grabbing` to provide visual feedback during the drag.

---

### `#dragToResizeHandler(element: HTMLElement, e: PointerEvent): void`

- **Purpose:** Manages the drag-to-resize interaction by adjusting the element’s dimensions.
- **Behavior:**
  - Records the element’s initial width and height, as well as the starting pointer coordinates.
  - On pointer movement, computes the new width and height based on pointer deltas.
  - Updates the element’s inline styles to reflect the new dimensions.
  - Uses callbacks to signal the start, progress, and end of the resize action.
- **Note:** Temporarily changes the cursor (e.g., to `nwse-resize`) during the resizing operation.

---

### `#dragToScrollHandler(element: HTMLElement, e: PointerEvent, direction: LfDragScrollDirection, distX: number, distY: number): void`

- **Purpose:** Enables drag-to-scroll behavior, allowing the user to scroll an element by dragging it.
- **Behavior:**
  - Captures the starting pointer coordinates and the element’s initial scroll positions.
  - Calculates the difference between the current and starting pointer positions to adjust the scroll (`scrollLeft` or `scrollTop`) based on the specified direction.
  - Computes and applies velocity for momentum scrolling, if reduced motion is not enabled.
  - Uses requestAnimationFrame to animate the momentum after the drag completes.
- **Note:** Sets styles such as `cursor: grabbing` and disables text selection during the drag.

---

### `#swipeHandler(element: HTMLElement, e: PointerEvent, direction: LfDragScrollDirection): void`

- **Purpose:** Detects swipe gestures on an element and determines the swipe direction.
- **Behavior:**
  - Records the starting pointer coordinates.
  - Monitors pointer movement and calculates the distance traveled.
  - If the movement exceeds a predefined threshold (e.g., 50 pixels), determines the swipe direction (left/right for horizontal, up/down for vertical).
  - Invokes the corresponding callbacks once a swipe is recognized.
- **Note:** Prevents default behavior when necessary to ensure a smooth swipe detection.

---

## Public Methods

### `register`

The `register` property is an object that exposes methods for attaching various drag behaviors to an element. Each method initializes a drag session with the relevant behavior and associated callbacks.

#### `register.customDrag(element: HTMLElement, onPointerDown: (e: PointerEvent, session: LfDragSession) => void, callbacks?: LfDragCallbacks): void`

- **Description:** Registers a custom drag behavior on the specified element. The user supplies a custom `onPointerDown` handler to manage how the drag is initiated.
- **Behavior:**
  - Initializes a drag session via `#initializeSession`.
  - If custom `onMove`/`onEnd` callbacks are not provided, defaults to using `#defaultPointerMoveAndUp`.
- **Example:**

  ```ts
  lfDrag.register.customDrag(
    element,
    (e, session) => {
      console.log("Custom drag started!", session);
    },
    {
      onMove: (e, session) => console.log("Dragging..."),
      onEnd: (e, session) => console.log("Custom drag ended!"),
    },
  );
  ```

---

#### `register.dragToDrop(element: HTMLElement, callbacks?: LfDragCallbacks): void`

- **Description:** Registers drag-to-drop behavior on an element.
- **Behavior:**
  - Sets up a drag session and applies the drag-to-drop logic via `#dragToDropHandler`.
- **Example:**

  ```ts
  lfDrag.register.dragToDrop(element, {
    onStart: (e, session) => console.log("Drag-to-drop started!"),
    onMove: (e, session) => console.log("Dragging element..."),
    onEnd: (e, session) => console.log("Drag-to-drop ended!"),
  });
  ```

---

#### `register.dragToResize(element: HTMLElement, callbacks?: LfDragCallbacks): void`

- **Description:** Registers drag-to-resize behavior on an element.
- **Example:**

  ```ts
  lfDrag.register.dragToResize(element, {
    onStart: (e, session) => console.log("Resize started!"),
    onMove: (e, session) => console.log("Resizing element..."),
    onEnd: (e, session) => console.log("Resize ended!"),
  });
  ```

---

#### `register.dragToScroll(element: HTMLElement, callbacks?: LfDragCallbacks, direction: LfDragScrollDirection = "x"): void`

- **Description:** Registers drag-to-scroll behavior on an element.
- **Behavior:**
  - Initializes a session that uses a threshold-aware pointer down listener.
  - Applies scroll logic via `#dragToScrollHandler`, including momentum scrolling if appropriate.
- **Example:**

  ```ts
  lfDrag.register.dragToScroll(
    element,
    {
      onStart: (e, session) => console.log("Scroll drag started!"),
      onMove: (e, session) => console.log("Scrolling..."),
      onEnd: (e, session) => console.log("Scroll drag ended!"),
    },
    "x",
  );
  ```

---

#### `register.swipe(element: HTMLElement, callbacks?: LfDragCallbacks, direction: LfDragScrollDirection = "x"): void`

- **Description:** Registers a swipe gesture handler on an element.
- **Behavior:**
  - Uses `#swipeHandler` to detect swipe direction and invoke callbacks.
- **Example:**

  ```ts
  lfDrag.register.swipe(
    element,
    {
      onStart: (e, session) => console.log("Swipe started!"),
      onMove: (e, session) => console.log("Swiping..."),
      onEnd: (e, session) => console.log("Swipe ended!"),
    },
    "x",
  );
  ```

---

### `unregister`

The `unregister` property is an object that exposes methods for removing registered drag behaviors from an element. This helps in cleaning up event listeners and associated drag sessions.

#### `unregister.all(element: HTMLElement): void`

- **Description:** Unregisters all drag behaviors (custom, drag-to-drop, drag-to-resize, drag-to-scroll, swipe) from the specified element.
- **Example:**

  ```ts
  lfDrag.unregister.all(element);
  ```

---

#### `unregister.customDrag(element: HTMLElement): void`

- **Description:** Unregisters custom drag behavior from the specified element.
- **Example:**

  ```ts
  lfDrag.unregister.customDrag(element);
  ```

---

#### `unregister.dragToDrop(element: HTMLElement): void`

- **Description:** Unregisters drag-to-drop behavior from the specified element.
- **Example:**

  ```ts
  lfDrag.unregister.dragToDrop(element);
  ```

---

#### `unregister.dragToResize(element: HTMLElement): void`

- **Description:** Unregisters drag-to-resize behavior from the specified element.
- **Example:**

  ```ts
  lfDrag.unregister.dragToResize(element);
  ```

---

#### `unregister.dragToScroll(element: HTMLElement): void`

- **Description:** Unregisters drag-to-scroll behavior from the specified element.
- **Example:**

  ```ts
  lfDrag.unregister.dragToScroll(element);
  ```

---

#### `unregister.swipe(element: HTMLElement): void`

- **Description:** Unregisters swipe gesture behavior from the specified element.
- **Example:**

  ```ts
  lfDrag.unregister.swipe(element);
  ```

---

### `getActiveSession(element: HTMLElement): LfDragSession | undefined`

- **Description:** Returns the active drag session associated with the given element, if any.
- **Usage Example:**

  ```ts
  const session = lfDrag.getActiveSession(element);
  if (session) {
    console.log("Active drag session found:", session);
  }
  ```

---

## Integration with the LF Widgets Framework

- **Logging & Debugging:** Throughout its methods, `LfDrag` leverages the LF Widgets framework’s debug module to log warnings (for example, when attempting to interact with an unregistered element). This aids in diagnosing issues during development.
- **Session Management:** Uses a WeakMap to associate elements with their drag sessions, ensuring efficient cleanup and minimizing memory leaks.
- **Accessibility & Styling:** During drag interactions, the class updates element styles (such as cursor changes and user-select adjustments) and attributes (e.g., `aria-grabbed`) to provide clear visual feedback to users.

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();
const lfDrag = lfFramework.drag;
const element = document.getElementById("draggable");

if (element) {
  // Register a drag-to-drop behavior on the element
  lfDrag.register.dragToDrop(element, {
    onStart: (e, session) => console.log("Drag started!"),
    onMove: (e, session) => console.log("Dragging..."),
    onEnd: (e, session) => console.log("Drag ended!"),
  });

  // Later, if needed, unregister all behaviors
  // lfDrag.unregister.all(element);
}
```

# LfDebug

The `LfDebug` class is the debugging backbone of the LF Widgets framework. It not only tracks component lifecycles and performance but also provides a structured logging system and a registration mechanism for debug-aware components. In short: it’s your go-to tool for getting granular insight into what your components are doing—and for spotting performance hiccups before they become full-blown issues.

---

## Overview

**Responsibilities:**

- **Lifecycle Tracking & Performance Measurement:**  
  Records timestamps for key lifecycle events (`will-render`, `did-render`, `did-load`, and custom breakpoints) and computes render durations.

- **Debug Log Management:**  
  Captures logs with different categories (informational, error, warning) and groups them by type (render, load, resize, misc). It enforces a log limit and provides utilities to dump or print logs.

- **Component Registration:**  
  Supports registration of two types of debug-enabled components:

  - **`lf-code` components:** Receives log messages that get prepended to their display value.
  - **Toggle components:** Get updated with the current debug mode state (`on`/`off`).

- **Debug Mode Toggling:**  
  Enables/disables debug mode. When toggled, it dispatches the new state to all registered toggle components.

---

## API Reference

### Properties & Methods

#### 1. **Debug Information (`info` Object)**

The `info` object provides helper methods to create and update debug information for any component.

- **`create(): DebugInfo`**  
  Initializes and returns a new debug information object with the following properties:

  - `startTime`: Timestamp when debug info is created.
  - `renderStart`: Timestamp marking the start of a render.
  - `renderCount`: Number of times the component has rendered.
  - `renderEnd`: Timestamp marking the end of the last render.
  - `endTime`: Timestamp when the component finishes loading.

- **`update(comp: LfComponent, lifecycle: LfDebugLifecycles): Promise<void>`**  
  Updates the provided component’s debug info based on the lifecycle phase:
  - **`"will-render"`:**  
    Increments the render count and records the start time of rendering.
  - **`"did-render"`:**  
    Captures the render end time and logs the render duration.
  - **`"did-load"`:**  
    Captures the overall load time and logs the total time taken for the component to be ready.
  - **`"custom"`:**  
    Supports custom breakpoints, logging the time difference since the last render start.

#### 2. **Logging (`logs` Object)**

The `logs` factory provides a set of methods to manage and output debug logs.

- **`dump(): void`**  
  Clears all stored logs and resets the code display for all registered `lf-code` components.

- **`fromComponent(comp: LfDebugLogClass): comp is LfComponent`**  
  A type guard that checks if the given component is debug-enabled (i.e., has a `rootElement`).

- **`new(comp: LfDebugLogClass | LfCode, message: string, category?: "informational" | "error" | "warning"): Promise<void>`**  
  Creates and stores a new debug log entry.

  - Logs are automatically classified based on message content (e.g., render-related messages are tagged as `"render"`).
  - If the log count exceeds a predefined limit (`#LOG_LIMIT`), it dumps all logs to prevent overflow, issuing a warning in the console if debug mode is active.

- **`print(): void`**  
  Groups and prints logs to the console by type:
  - **Groups:** `load`, `misc`, `render`, `resize`
  - Also outputs a full table of all logs for a quick overview.

#### 3. **Utility Methods**

- **`isEnabled(): boolean`**  
  Returns the current state of debug mode.

- **`toggleAutoPrint(value?: boolean): boolean`**  
  Toggles or sets the auto-print feature. When enabled, debug logs are automatically printed to the console based on their category (error, warning, informational). If no value is provided, toggles the current state.

- **`register(comp: LfDebugManagedComponents): void`**  
  Registers a component with the debug manager:

  - If the component’s `rootElement` has a tag name of `"lf-code"`, it’s added to the `codes` collection.
  - Otherwise, it’s assumed to be a toggle component and is added to the `toggles` collection.

- **`unregister(comp: LfDebugManagedComponents): void`**  
  Unregisters a component from the debug system to prevent memory leaks or stale references.

- **`toggle(value?: boolean, dispatch?: boolean): boolean`**  
  Toggles debug mode:
  - If an explicit `true` or `false` is provided, it sets the state accordingly.
  - Without an argument, it inverts the current state.
  - Optionally dispatches the updated state to all registered toggle components.

---

## Internal Dispatch Mechanisms

The class uses two private helper methods to synchronize debug state and logs with registered components:

- **`#codeDispatcher(log?: LfDebugLog): void`**  
  Iterates over all registered `lf-code` components and:

  - If a new log is provided, prepends the log (including its ID and message) to the component’s display value.
  - Clears the display if no log is provided (e.g., on a dump).

- **`#toggleDispatcher(): void`**  
  Iterates over all registered toggle components and updates their value to `"on"` or `"off"` based on the current debug mode.

---

## Debug Lifecycle Flow

The debug manager leverages specific lifecycle events to monitor performance:

```mermaid
flowchart TD
    A[Component Initiates Debug Info]
    B[Component Enters "will-render"]
    C[Records renderStart and increments renderCount]
    D[Component Enters "did-render"]
    E[Records renderEnd and calculates render duration]
    F[Logs render information]
    G[Component Enters "did-load"]
    H[Records overall load time]
    I[Logs load time and finalizes debug info]

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
```

# LfFramework

`LfFramework` is the central orchestration class of the LF Widgets library. It manages submodule registration, asset handling, theming, event listeners, and provides access to a suite of utility modules. By unifying these responsibilities under a single API, `LfFramework` enables consistent behavior and resource management across all LF Widgets components.

---

## Overview

- **Primary Purpose:**  
  Serve as the backbone of the LF Widgets runtime environment by:
  - Managing and exposing various utility modules (e.g., color, data, debug, drag, effects, llm, portal, theme).
  - Handling asset paths for modules through a centralized asset management system.
  - Enabling module registration for extended functionality.
  - Setting up global event listeners (e.g., for click events) to handle common interactions.
- **Integration:**  
  The class is designed to be instantiated once (via the `getLfFramework()` helper) and then globally exposed on the `window` object. Upon initialization, it dispatches a custom event (using `LF_FRAMEWORK_EVENT_NAME`) to signal readiness, allowing dependent components to await proper setup.

---

## Constructor

### `constructor()`

- **Description:**  
  Creates a new `LfFramework` instance. During instantiation, it:
  - Initializes the asset management API with built-in functions.
  - Registers the default module (`"lf-framework"`) along with its asset functions.
  - Instantiates various utility submodules such as color, data, debug, drag, effects, llm, portal, and theme.
  - Sets up an internal utilities object for managing click callbacks.
- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  const lfFramework = getLfFramework();
  ```

---

## Private Helpers

### `#setupListeners()`

- **Purpose:**  
  Sets up a global click event listener on the document. This listener monitors all click events and triggers registered callbacks when a click occurs outside specified elements.
- **How It Works:**
  - The listener retrieves the event's composed path.
  - It iterates over all registered click callbacks stored in `utilities.clickCallbacks`.
  - For each callback, it checks whether the associated element (or its portal parent) is part of the click path. If not, the callback is executed.
- **Note:**  
  This method is only invoked once, upon the registration of the first click callback.

---

## Public Methods

### `addClickCallback(cb: LfFrameworkClickCb, async?: boolean): void`

- **Description:**  
  Registers a click callback function to be executed when the user clicks outside a designated element.
- **Parameters:**
  - `cb`: The callback function to execute on a qualifying click.
  - `async` (optional): If set to `true`, the callback is added asynchronously via `requestAnimationFrame`.
- **Usage Example:**

  ```ts
  lfFramework.addClickCallback(() => {
    console.log("Detected click outside the target element.");
  });
  ```

---

### `assignRef<R extends string>(refs: Record<R, HTMLElement>, key: R): (el: HTMLElement) => void`

- **Description:**  
  Returns a function that assigns an HTMLElement to a specific key within a provided references object. This is useful for dynamically capturing and managing element references.
- **Usage Example:**

  ```ts
  const refs: { container?: HTMLElement } = {};
  const assignContainerRef = lfFramework.assignRef(refs, "container");
  // In a component render method (e.g., in JSX):
  // <div ref={assignContainerRef}></div>
  ```

---

### `getModules(): Map<LfFrameworkModuleKey, LfFrameworkModuleOptions>`

- **Description:**  
  Retrieves the internal map containing all registered modules along with their configuration options.
- **Usage Example:**

  ```ts
  const modules = lfFramework.getModules();
  console.log("Currently registered modules:", modules);
  ```

---

### `register(module: LfFrameworkModuleKey, options: Partial<Omit<LfFrameworkModuleOptions, "name">>): void`

- **Description:**  
  Registers a new module with the framework. If the module key already exists, an error is logged via the framework's debug system.
- **Parameters:**
  - `module`: A unique identifier for the module.
  - `options`: An object containing configuration options (e.g., custom asset management functions) for the module.
- **Usage Example:**

  ```ts
  lfFramework.register("custom-module", {
    getAssetPath: (value) => `/custom/assets/${value}`,
    setAssetPath: (value) => console.log(`Asset path set to: ${value}`),
  });
  ```

---

### `removeClickCallback(cb: LfFrameworkClickCb): void`

- **Description:**  
  Removes a previously registered click callback from the framework’s internal registry.
- **Usage Example:**

  ```ts
  const myCallback = () => console.log("Click callback executed.");
  lfFramework.addClickCallback(myCallback);
  // Later, if needed...
  lfFramework.removeClickCallback(myCallback);
  ```

---

### `sanitizeProps<P>(props: P, compName?: LfComponentName): P | LfComponentPropsFor<typeof compName>`

- **Description:**  
  Filters and sanitizes a props object by removing:
  - Any properties starting with "on" (to avoid inline event handlers).
  - Attributes not explicitly allowed (either globally or for a specific component).
  - Values that are potentially malicious (e.g., containing JavaScript URLs or script tags).
- **Parameters:**
  - `props`: The properties object to be sanitized.
  - `compName` (optional): The name of the component, allowing component-specific attribute whitelisting.
- **Usage Example:**

  ```ts
  const rawProps = {
    onClick: 'alert("malicious")',
    "data-id": "component1",
    style: "color: red;",
  };
  const safeProps = lfFramework.sanitizeProps(rawProps, "custom-component");
  console.log("Sanitized properties:", safeProps);
  ```

---

## Asset Management

- **Property:** `assets`
- **Description:**  
  Provides methods to manage asset paths for registered modules.
  - **`get(value, module = "lf-framework")`**:  
    Returns an object with:
    - `path`: The resolved asset path.
    - `style`: An object containing CSS mask properties for the asset (suitable for icon usage).
  - **`set(value, module?)`**:  
    Updates the asset path for a specified module or for all modules if no module is provided.
- **Usage Example:**

  ```ts
  // Retrieve asset information for an icon
  const assetInfo = lfFramework.assets.get("icon.svg");
  console.log("Asset path:", assetInfo.path);

  // Update the asset path for all modules
  lfFramework.assets.set("/new/path/to/assets");
  ```

---

## Integration with the LF Widgets Framework

- **Global Exposure:**  
  The `LfFramework` instance is exposed globally (typically attached to the `window` object under a unique symbol) once initialized via `getLfFramework()`. This allows any component in the LF Widgets ecosystem to access shared functionality.
- **Readiness & Event Dispatching:**  
  After initialization, the framework dispatches a custom event (using `LF_FRAMEWORK_EVENT_NAME`) to signal that it is ready. Components waiting on framework readiness can listen for this event.
- **Modular Architecture:**  
  By centralizing module registration, asset management, and event handling, `LfFramework` provides a robust environment where individual components and utility classes (like `LfColor`) operate cohesively.

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();

// Register a custom module with tailored asset management functions
lfFramework.register("custom-module", {
  getAssetPath, // from @stencil/core
  setAssetPath, // from @stencil/core
});

// Add a click callback to handle interactions outside a target element
lfFramework.addClickCallback(() => {
  console.log("Detected click outside the designated element!");
});

// Sanitize a set of component properties before usage
const rawProps = {
  onClick: 'alert("should not execute")',
  "data-id": "component-123",
  style: "background: blue;",
};
const sanitizedProps = lfFramework.sanitizeProps(rawProps, "custom-component");
console.log("Sanitized props:", sanitizedProps);

// Use asset management to retrieve and set asset paths
const assetDetails = lfFramework.assets.get("icon.svg");
console.log("Asset details:", assetDetails);

lfFramework.assets.set("/updated/path/to/assets");
```

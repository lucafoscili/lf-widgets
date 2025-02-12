# LfTheme

`LfTheme` is a utility class designed for theme management within the LF Widgets framework. It centralizes the creation and application of theme-specific CSS—such as global styles, fonts, and CSS variables—ensuring that web components remain in sync with the active theme. It also provides helper functions to generate BEM class names, manage component registrations, and handle dynamic theme updates.

## Overview

- **Primary Purpose:**  
  Offer a centralized and consistent set of tools for managing themes in LF Widgets. This includes generating and applying CSS variables, handling global styles and fonts, and updating registered components whenever the theme changes.
- **Integration:**  
  Works closely with the LF Widgets framework for asset retrieval, debug logging, and document-level style manipulation. It uses the framework’s assets to load fonts and icons, and it dispatches custom events to signal theme updates.

---

## Constructor

### `constructor(lfFramework: LfFrameworkInterface)`

- **Description:**  
  Instantiates an `LfTheme` instance. It saves a reference to the LF Widgets framework, initializes the theme list, and sets the default theme.
- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  const lfFramework = getLfFramework();
  const themeManager = new LfTheme(lfFramework);
  ```

---

## Private Helpers

### `#consistencyCheck(): void`

- **Purpose:**  
  Validates that the currently selected theme exists in the theme list. If it does not, a warning is logged via the framework’s debug module, and the theme falls back to the default.
- **Note:**  
  Ensures that invalid or outdated theme names do not cause unpredictable styling issues.

---

### `#prepFont(): string`

- **Purpose:**  
  Prepares CSS `@font-face` rules for each font specified in the active theme.
- **How It Works:**
  - Retrieves the list of fonts from the current theme.
  - For each font, uses the framework’s asset manager to determine the correct font file path.
  - Constructs the CSS rules to load the fonts.
- **Returns:**  
  A string containing the generated `@font-face` CSS declarations.

---

### `#prepGlobalStyles(): string`

- **Purpose:**  
  Compiles global CSS rules from a predefined `GLOBAL_STYLES` object.
- **How It Works:**  
  Iterates over each selector in `GLOBAL_STYLES` and generates the corresponding CSS. Special handling is applied to `@keyframes` rules.
- **Returns:**  
  A string of concatenated global CSS styles.

---

### `#prepVariables(): string`

- **Purpose:**  
  Generates CSS variable declarations based on the current theme’s variables.
- **How It Works:**
  - Iterates through the theme’s variables.
  - For keys related to colors or icons, performs necessary conversions (e.g., using the framework’s color utilities or asset retrieval).
- **Returns:**  
  A string of CSS variable definitions to be applied to the document’s root.

---

### `#updateComponents(): void`

- **Purpose:**  
  Triggers a refresh on each registered component, ensuring they reflect the updated theme.
- **Note:**  
  Only components that are connected to the document will be refreshed.

---

### `#updateDocument(): void`

- **Purpose:**  
  Applies theme-specific attributes to the `<html>` element.
- **How It Works:**
  - Sets a `lf-theme` attribute with the current theme name.
  - Applies either a `dark` or `light` attribute based on the theme’s `isDark` flag.
  - Dispatches a custom `"lf-theme-change"` event to signal that the theme has been updated.

---

### `#updateStyleElement(): void`

- **Purpose:**  
  Assembles and injects the complete CSS (including fonts, global styles, and theme variables) into a dedicated `<style>` element in the document head.
- **How It Works:**
  - Calls `#prepFont()`, `#prepGlobalStyles()`, and `#prepVariables()` to construct the final CSS string.
  - Updates the inner text of the style element with the new styles.

---

## Public Methods

### `bemClass(block: string, element?: string, modifiers?: Partial<LfThemeBEMModifier>): string`

- **Description:**  
  Generates a BEM (Block Element Modifier) class name string.
- **How It Works:**
  - Constructs the base class name using the provided block and optional element.
  - Appends modifier classes for each active modifier.
- **Usage Examples:**

  ```ts
  // Returns "button"
  themeManager.bemClass("button");

  // Returns "button__icon"
  themeManager.bemClass("button", "icon");

  // Returns "button__icon button__icon--large button__icon--active"
  themeManager.bemClass("button", "icon", {
    large: true,
    active: true,
    disabled: false,
  });
  ```

---

### `get`

An object exposing several getters for theme-related data:

- **`current(): ThemeData`**

  - **Description:**  
    Returns the active theme's data, including CSS variables, custom styles, fonts, and theme metadata (e.g., name and dark/light flag).
  - **Usage Example:**

    ```ts
    const currentTheme = themeManager.get.current();
    console.log(currentTheme.name, currentTheme.variables);
    ```

- **`icon(name: keyof typeof LF_ICONS_REGISTRY): string`**

  - **Description:**  
    Retrieves the icon URL or definition corresponding to the provided name from the LF Icons Registry.
  - **Usage Example:**

    ```ts
    const iconPath = themeManager.get.icon("colorSwatch");
    ```

- **`icons(): typeof LF_ICONS_REGISTRY`**
  - **Description:**  
    Returns the entire icons registry.
- **`themes(): { asArray: string[]; asDataset: LfDataDataset; }`**

  - **Description:**  
    Returns available themes as both an array of names and a dataset formatted for UI components.
  - **Usage Example:**

    ```ts
    const themeList = themeManager.get.themes();
    console.log(themeList.asArray);
    ```

---

### `set(name?: string, list?: LfThemeList): void`

- **Description:**  
  Sets and applies a new theme. Optionally, a new theme name or an entirely new theme list can be provided.
- **How It Works:**
  - If a `<style>` element doesn’t exist, it creates one in the document head.
  - Updates the current theme and, if applicable, replaces the theme list.
  - Runs consistency checks, updates the style element, refreshes registered components, and adjusts document attributes accordingly.
- **Usage Example:**

  ```ts
  // Change the theme to "light"
  themeManager.set("light");
  ```

---

### `refresh(): void`

- **Description:**  
  Refreshes the current theme by re-applying the CSS rules to the document and updating all registered components.
- **How It Works:**
  - Rebuilds and re-injects the CSS via `#updateStyleElement()`.
  - Dispatches a `lf-theme-refresh` event.
  - Logs a success message, or a warning if the refresh fails.
- **Usage Example:**

  ```ts
  themeManager.refresh();
  ```

---

### `setLfStyle(comp: LfComponent): string`

- **Description:**  
  Combines and validates custom CSS styles for a specific LF Widgets component.
- **Style Sources (in order of priority):**
  1. Master custom style defined in the theme's `customStyles`.
  2. Component-specific style based on the component’s tag name.
  3. The component’s own `lfStyle` property.
- **Validation:**  
  Checks for malicious CSS (e.g., JavaScript injections or `<script>` tags) and returns an empty string if any issues are detected.
- **Usage Example:**

  ```ts
  const componentStyles = themeManager.setLfStyle(myComponent);
  if (componentStyles) {
    // Apply the styles to the component
  }
  ```

---

### `randomize(): void`

- **Description:**  
  Randomly selects and applies a theme from the available theme list.
- **How It Works:**
  - Retrieves an array of available theme names.
  - Continuously generates a random index until a different theme from the current one is selected.
  - Applies the new theme using the `set` method.
  - Logs a warning if no themes are available.
- **Usage Example:**

  ```ts
  themeManager.randomize();
  ```

---

### `register(comp: LfComponent): void`

- **Description:**  
  Registers a component with the theme manager so that it will be automatically refreshed when the theme changes.
- **Usage Example:**

  ```ts
  themeManager.register(myComponent);
  ```

---

### `unregister(comp: LfComponent): void`

- **Description:**  
  Unregisters a component from the theme manager, stopping it from receiving further theme updates.
- **Usage Example:**

  ```ts
  themeManager.unregister(myComponent);
  ```

---

## Integration with the LF Widgets Framework

- **Logging & Debugging:**  
  Throughout its methods, `LfTheme` leverages the framework’s debug module to log theme inconsistencies, updates, and errors, providing transparency during theme transitions.
- **Asset Management:**  
  Uses the framework’s asset retrieval capabilities to load fonts and icons dynamically based on the active theme.
- **Document Styling:**  
  Directly manipulates the document’s `<html>` attributes and maintains a dedicated `<style>` element to inject theme-specific CSS rules, ensuring that global styles are consistently applied.

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();
const themeManager = lfFramework.theme;

// Retrieve and log the current theme data
const currentTheme = themeManager.get.current();
console.log("Current Theme:", currentTheme.name);

// Change the theme to "light"
themeManager.set("light");

// Refresh the theme to reapply styles
themeManager.refresh();

// Register a component for theme updates
themeManager.register(myComponent);

// Apply custom styles for a component
const customStyles = themeManager.setLfStyle(myComponent);
if (customStyles) {
  // Apply the custom styles to the component
}

// Randomize the theme
themeManager.randomize();
```

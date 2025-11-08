# LfColor

`LfColor` is a utility class designed for color manipulation and conversion within the LF Widgets framework. It provides a suite of methods to convert between different color formats (HEX, RGB, HSL), compute various color representations, generate random colors with controlled brightness, and determine an optimal contrasting text color for legibility.

## Overview

- **Primary Purpose:**  
  Offer a centralized and consistent set of tools for dealing with colors in web components.
- **Integration:**  
  Relies on the LF Widgets framework for theming (e.g., substituting `"transparent"` with a theme background color) and for logging debug information during color conversions.

---

## Constructor

### `constructor(lfFramework: LfFrameworkInterface)`

- **Description:**  
  Instantiates an `LfColor` instance and saves a reference to the framework. This reference is used for debugging logs and accessing theme variables.
- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  const lfFramework = getLfFramework();
  const colorManager = new LfColor(lfFramework);
  ```

---

## Private Helpers

### `#handleEdgeCases(color: string): LfColorInput`

- **Purpose:**  
  Pre-processes the input color string to handle non-standard or edge-case values:
  - Converts `"transparent"` into the current theme background color.
  - Recognizes alternative RGB formats (e.g., `"R123G45B67"`) and converts them to standard RGB notation.
- **Note:**  
  Uses the framework's debug module to log any substitutions or transformations.

---

## Public Methods

### `autoContrast(color: LfColorInput): string`

- **Description:**  
  Calculates an optimal contrasting text color (either black or white) based on the brightness of the input color.
- **How It Works:**
  1. Converts the input color to its RGB representation using the `compute` method.
  2. Extracts the RGB components and calculates brightness using a weighted formula.
  3. Returns `#000000` (black) for brighter backgrounds and `#ffffff` (white) for darker backgrounds.
- **Example:**

  ```ts
  const textColor = colorManager.autoContrast("#FF0000"); // Likely returns "#ffffff"
  ```

---

### `compute(color: string): LfColorValues`

- **Description:**  
  Converts the given color (which may be provided in HEX, HSL(A), RGB(A), or even a non-standard code) into various color representations.
- **Returned Object Contains:**
  - `hexColor`: A HEX string (e.g., "#FF0000").
  - `hslColor`: A formatted HSL string (e.g., "hsl(0,100%,50%)").
  - `hslValues`: A string with numeric HSL components (e.g., "0,100%,50%").
  - `hue`, `saturation`, `lightness`: Individual HSL components.
  - `rgbColor`: A formatted RGB string (e.g., "rgb(255,0,0)").
  - `rgbValues`: Comma-separated numeric RGB components.
- **How It Works:**
  - First, calls `#handleEdgeCases` to normalize the input.
  - Checks the format of the input (HEX, HSL(A), or RGB(A)); if none match, attempts to convert via a helper (`codeToHex`).
  - Uses the internal `convert` object to perform conversions between formats.
  - Logs the conversion steps through the framework’s debug system.
- **Example:**

  ```ts
  const colorValues = colorManager.compute("#3498db");
  console.log(colorValues);
  /* Might log an object similar to:
  {
    hexColor: "#3498db",
    hslColor: "hsl(204,70%,53%)",
    hslValues: "204,70%,53%",
    hue: "204",
    saturation: "70%",
    lightness: "53%",
    rgbColor: "rgb(52,152,219)",
    rgbValues: "52,152,219"
  }
  */
  ```

---

### `random(brightness: number): LfColorHexString`

- **Description:**  
  Generates a random HEX color while ensuring that each RGB channel meets a specified minimum brightness threshold.
- **Parameters:**
  - `brightness`: A numeric value between 0 and 255 that sets the lower limit for the random channel values. Higher values produce brighter colors.
- **Example:**

  ```ts
  const randomBrightColor = colorManager.random(200); // Could return "#F0E2C8" or similar.
  ```

---

## Conversion Utilities

The `LfColor` class includes a nested `convert` object which exposes helper functions for color conversion:

- **`hexToRgb(hex: string): LfColorRGBValues`**  
  Converts a hexadecimal color string to an RGB object with properties `r`, `g`, and `b`.

- **`hslToRgb(h: number, s: number, l: number): LfColorRGBValues`**  
  Converts HSL values to an RGB object.

- **`rgbToHex(r: number, g: number, b: number):`#${string}``**  
  Converts RGB values to a hexadecimal string, using `valueToHex` internally.

- **`rgbToHsl(r: number, g: number, b: number)`**  
  Converts RGB values to HSL components and returns an object containing `h`, `s`, and `l`.

- **`valueToHex(c: number): string`**  
  Helper function to convert a decimal color channel (0–255) into a two-digit HEX string.

- **`codeToHex(color: string): string`**  
  Converts a named color code (if present in a predefined mapping `LF_COLOR_CODES`) into its corresponding HEX value. Logs a warning if the conversion fails.

---

## Integration with the LF Widgets Framework

- **Logging & Debugging:**  
  Throughout its methods, `LfColor` leverages the framework's `debug` module to log important transformation steps, errors, and edge-case adjustments. This ensures that developers have visibility when something unexpected occurs.

- **Theming:**  
  By accessing the current theme variables (via `lfFramework.theme.get.current()`), the class ensures that special cases like `"transparent"` are substituted with the appropriate theme-specific color (typically the background color).

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();
const colorManager = lfFramework.color;

// Compute and log various representations of a color
const colorValues = colorManager.compute("#3498db");
console.log("Computed color values:", colorValues);

// Determine a contrasting text color for a given background
const contrastingTextColor = colorManager.autoContrast("#3498db");
console.log("Optimal contrasting text color:", contrastingTextColor);

// Generate a random bright color (minimum brightness of 200)
const randomColor = colorManager.random(200);
console.log("Random bright color:", randomColor);
```

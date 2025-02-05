import {
  LF_COLOR_CODES,
  LfColorHexString,
  LfColorHSLPercentage,
  LfColorHSLString,
  LfColorHSLValuesString,
  LfColorInput,
  LfColorInterface,
  LfColorRGBString,
  LfColorRGBValues,
  LfColorRGBValuesString,
  LfColorValues,
  LfCoreInterface,
} from "@lf-widgets/foundations";

/**
 * A utility class for color manipulation and conversion.
 * Provides methods for working with different color formats (HEX, RGB, HSL)
 * and performing color-related calculations.
 *
 * @class
 * @example
 * ```ts
 * // Convert and compute color values
 * const colorValues = colorManager.compute('#FF0000');
 *
 * // Get contrasting text color
 * const textColor = colorManager.autoContrast('#FF0000');
 *
 * // Generate random color
 * const randomColor = colorManager.random(200);
 *
 * @see {@link LfCore} For the main framework manager
 * ```
 *
 * @property {Object} convert - Collection of color conversion methods
 * @property {Function} autoContrast - Determines optimal text color (black/white) for given background
 * @property {Function} compute - Converts colors between different formats
 * @property {Function} random - Generates random colors with specified brightness
 */
export class LfColor implements LfColorInterface {
  #LF_MANAGER: LfCoreInterface;

  constructor(lfCore: LfCoreInterface) {
    this.#LF_MANAGER = lfCore;
  }

  #handleEdgeCases = (color: string): LfColorInput => {
    const { logs } = this.#LF_MANAGER.debug;
    const { variables } = this.#LF_MANAGER.theme.get.current();

    if (color === "transparent") {
      color = variables["--lf-color-bg"];
      logs.new(
        this,
        "Received TRANSPARENT color, converted to " +
          color +
          " (theme background).",
      );
    }

    const altRgbRe = /R(\d{1,3})G(\d{1,3})B(\d{1,3})/;
    const altRgb = altRgbRe.test(color);
    if (altRgb) {
      const parts = color.match(altRgbRe);
      color = "rgb(" + parts[1] + "," + parts[2] + "," + parts[3] + ")";
    }

    return color as LfColorInput;
  };

  //#region autoContrast
  /**
   * Computes the contrast color for legibility based on the brightness of the given color.
   *
   * @param color - The color input to calculate brightness from.
   * @returns A string representing the optimal text color (black or white) for the given background color.
   *
   * @example
   * ```ts
   * const textColor = autoContrast("#FF0000"); // Returns "white"
   * ```
   */
  autoContrast = (color: LfColorInput) => {
    const rgb = this.compute(color).rgbColor;
    const colorValues = rgb.replace(/[^\d,.]/g, "").split(",");
    const brightness = Math.round(
      (Number(colorValues[0]) * 299 +
        Number(colorValues[1]) * 587 +
        Number(colorValues[2]) * 114) /
        1000,
    );

    return brightness > 125 ? "#000000" : "#ffffff";
  };
  //#endregion

  //#region compute
  /**
   * Computes various color representations (hex, RGB, HSL) from the given color input.
   *
   * @param color - A string representing the color to be converted. Can be a hex value,
   *                HSL(A) notation, RGB(A) notation, or a code convertible to a valid color.
   * @returns An object containing the color in different representations:
   *          - hexColor: The color in hexadecimal format.
   *          - hslColor: The color in HSL notation.
   *          - hslValues: The numeric HSL components as a string.
   *          - hue: The hue component of the color.
   *          - saturation: The saturation component of the color.
   *          - lightness: The lightness component of the color.
   *          - rgbColor: The color in RGB notation.
   *          - rgbValues: The numeric RGB components as a string.
   *
   * @example
   * ```ts
   * const colorValues = compute("#FF0000");
   * // Returns {
   * //   hexColor: "#FF0000",
   * //   hslColor: "hsl(0,100%,50%)",
   * //   hslValues: "0,100%,50%",
   * //   hue: "0",
   * //   saturation: "100%",
   * //   lightness: "50%",
   * //   rgbColor: "rgb(255,0,0)",
   * //   rgbValues: "255,0,0"
   * // }
   * ```
   */
  compute = (color: string): LfColorValues => {
    const { logs } = this.#LF_MANAGER.debug;

    color = this.#handleEdgeCases(color);

    const lowerColor = color.toLowerCase();
    let isHex = lowerColor.startsWith("#");
    const isHslOrHsla =
      lowerColor.startsWith("hsl(") || lowerColor.startsWith("hsla(");
    const isRgbOrRgba =
      lowerColor.startsWith("rgb(") || lowerColor.startsWith("rgba(");

    if (!isHex && !isHslOrHsla && !isRgbOrRgba) {
      const maybeHex = this.convert.codeToHex(color);
      if (maybeHex.startsWith("#")) {
        color = maybeHex as LfColorHexString;
        isHex = true;
      }
    }

    let colorValues: LfColorValues = {
      hexColor: "#000000",
      hslColor: "hsl(0,0%,0%)",
      hslValues: "0,0%,0%",
      hue: "0",
      saturation: "0%",
      lightness: "0%",
      rgbColor: "rgb(0,0,0)",
      rgbValues: "0,0,0",
    };

    if (isHex || isHslOrHsla) {
      const originalInput = color;
      let rgbObj: LfColorRGBValues | null = null;

      if (isHex) {
        colorValues.hexColor = color as LfColorHexString;
        rgbObj = this.convert.hexToRgb(color);
      } else {
        colorValues.hslColor = color as LfColorHSLString;

        const hslRegex =
          /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?%)\s*,\s*(\d+(?:\.\d+)?%)/i;
        const hslMatch = color.match(hslRegex);

        if (hslMatch) {
          const [_, hRaw, sRaw, lRaw] = hslMatch;
          colorValues.hslValues =
            `${hRaw},${sRaw},${lRaw}` as LfColorHSLValuesString;
          colorValues.hue = hRaw as `${number}`;
          colorValues.saturation = sRaw as LfColorHSLPercentage;
          colorValues.lightness = lRaw as LfColorHSLPercentage;

          const hNum = parseFloat(hRaw.replace("deg", ""));
          const sNum = parseFloat(sRaw.replace("%", "")) / 100;
          const lNum = parseFloat(lRaw.replace("%", "")) / 100;
          rgbObj = this.convert.hslToRgb(hNum, sNum, lNum);
        } else {
          logs.new(this, `Invalid HSL(A) color: ${color}. Using defaults.`);
        }
      }

      if (rgbObj) {
        const { r, g, b } = rgbObj;
        const rgbString = `rgb(${r},${g},${b})` as LfColorRGBString;
        colorValues.rgbColor = rgbString;
        colorValues.rgbValues = `${r},${g},${b}`;

        if (isHex) {
          const { h, s, l } = this.convert.rgbToHsl(r, g, b);
          const hslStr = `${h},${s}%,${l}%` as LfColorHSLValuesString;
          colorValues.hue = `${h}`;
          colorValues.saturation = `${s}%`;
          colorValues.lightness = `${l}%`;
          colorValues.hslValues = hslStr;
          colorValues.hslColor = `hsl(${hslStr})`;
        } else {
          colorValues.hexColor = this.convert.rgbToHex(
            r,
            g,
            b,
          ) as LfColorHexString;
        }

        logs.new(
          this,
          `Received color "${originalInput}" → Final RGB: ${colorValues.rgbColor}.`,
        );
      }
    }

    const rgbaMatch = color.match(
      /rgba?\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})(?:,\s?[\d.]+)?\)/i,
    );
    if (rgbaMatch) {
      const [_, rStr, gStr, bStr] = rgbaMatch;
      colorValues.rgbValues =
        `${rStr},${gStr},${bStr}` as LfColorRGBValuesString;
      colorValues.rgbColor = `rgb(${rStr},${gStr},${bStr})` as LfColorRGBString;

      // Possibly fill in missing fields if needed
      if (!colorValues.hexColor || colorValues.hexColor === "#000000") {
        try {
          const r = parseInt(rStr, 10);
          const g = parseInt(gStr, 10);
          const b = parseInt(bStr, 10);
          colorValues.hexColor = this.convert.rgbToHex(
            r,
            g,
            b,
          ) as LfColorHexString;
        } catch {
          logs.new(this, `Color not converted to hex value: ${color}.`);
        }
      }

      if (!colorValues.hslColor || colorValues.hslColor === "hsl(0,0%,0%)") {
        try {
          const r = parseInt(rStr, 10);
          const g = parseInt(gStr, 10);
          const b = parseInt(bStr, 10);
          const { h, s, l } = this.convert.rgbToHsl(r, g, b);
          const hslStr = `${h},${s}%,${l}%` as LfColorHSLValuesString;

          colorValues.hue = `${h}`;
          colorValues.saturation = `${s}%`;
          colorValues.lightness = `${l}%`;
          colorValues.hslValues = hslStr;
          colorValues.hslColor = `hsl(${hslStr})`;
        } catch {
          logs.new(this, `Color not converted to HSL value: ${color}.`);
        }
      }
    } else {
      logs.new(this, `Color not converted to RGB values: ${color}.`);
    }

    // --- 5) Return the now fully-populated color object
    return colorValues;
  };

  /**
   * Object containing color conversion methods
   * @property {Function} hexToRgb - Converts a hexadecimal color string to RGB values
   * @property {Function} hslToRgb - Converts HSL color values to RGB values
   * @property {Function} rgbToHex - Converts RGB color values to hexadecimal string
   * @property {Function} rgbToHsl - Converts RGB color values to HSL values
   * @property {Function} valueToHex - Converts a decimal number to hexadecimal string
   * @property {Function} codeToHex - Converts a color name to its hexadecimal representation
   *
   * @example
   * ```ts
   * const { hexToRgb, hslToRgb, rgbToHex, rgbToHsl, valueToHex, codeToHex } = convert;
   *
   * const rgbValues = hexToRgb("#FF0000"); // Returns { r: 255, g: 0, b: 0 }
   * const rgbValues = hslToRgb(0, 100, 50); // Returns { r: 255, g: 0, b: 0 }
   * const hexColor = rgbToHex(255, 0, 0); // Returns "#FF0000"
   * const hslValues = rgbToHsl(255, 0, 0); // Returns { h: 0, s: 100, l: 50 }
   * const hexValue = valueToHex(255); // Returns "FF"
   * const hexColor = codeToHex("red"); // Returns "#FF0000"
   * ```
   */
  convert = {
    //#region hexToRgb
    hexToRgb: (hex: string): LfColorRGBValues => {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    },
    //#endregion

    //#region hslToRgb
    hslToRgb: (h: number, s: number, l: number): LfColorRGBValues => {
      if (h == undefined) {
        return { r: 0, g: 0, b: 0 };
      }

      let huePrime = h / 60;
      const chroma = (1 - Math.abs(2 * l - 1)) * s;
      const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

      huePrime = Math.floor(huePrime);
      let red: number, green: number, blue: number;

      if (huePrime === 0) {
        red = chroma;
        green = secondComponent;
        blue = 0;
      } else if (huePrime === 1) {
        red = secondComponent;
        green = chroma;
        blue = 0;
      } else if (huePrime === 2) {
        red = 0;
        green = chroma;
        blue = secondComponent;
      } else if (huePrime === 3) {
        red = 0;
        green = secondComponent;
        blue = chroma;
      } else if (huePrime === 4) {
        red = secondComponent;
        green = 0;
        blue = chroma;
      } else if (huePrime === 5) {
        red = chroma;
        green = 0;
        blue = secondComponent;
      }

      const lightnessAdjustment = l - chroma / 2;
      red += lightnessAdjustment;
      green += lightnessAdjustment;
      blue += lightnessAdjustment;
      return {
        r: Math.round(red * 255),
        g: Math.round(green * 255),
        b: Math.round(blue * 255),
      };
    },
    //#endregion

    //#region rgbToHex
    rgbToHex: (r: number, g: number, b: number): `#${string}` => {
      const { valueToHex } = this.convert;

      return `#${valueToHex(r)}${valueToHex(g)}${valueToHex(b)}`;
    },
    //#endregion

    //#region rgbToHsl
    rgbToHsl: (r: number, g: number, b: number) => {
      r /= 255;
      g /= 255;
      b /= 255;

      const cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin;
      let h = 0,
        s = 0,
        l = 0;

      if (delta == 0) h = 0;
      else if (cmax == r) h = ((g - b) / delta) % 6;
      else if (cmax == g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      if (h < 0) h += 360;

      l = (cmax + cmin) / 2;

      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      return { h: h, s: s, l: l };
    },
    //#endregion

    //#region valueToHex
    valueToHex: (c: number) => {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    //#endregion

    //#region codeToHex
    codeToHex: (color: string): string => {
      const { logs } = this.#LF_MANAGER.debug;

      const code = color.toLowerCase() as keyof typeof LF_COLOR_CODES;

      if (LF_COLOR_CODES[code]) {
        return LF_COLOR_CODES[code];
      } else {
        logs.new(this, "Could not decode color " + color + "!");
        return color;
      }
    },
    //#endregion
  };

  //#region random
  /**
   * Generates a random hexadecimal color string with a specified brightness level.
   * The color is created by randomly generating values for each RGB channel while maintaining
   * a minimum brightness threshold.
   *
   * @param brightness - A number between 0 and 255 representing the minimum brightness value for each color channel.
   * Higher values result in brighter colors.
   * @returns A string representing a hexadecimal color code in the format "#RRGGBB".
   *
   * @example
   * ```typescript
   * // Generate a random bright color (minimum brightness of 200)
   * const brightColor = random(200); // Returns something like "#F0E2C8"
   *
   * // Generate a random dark color (minimum brightness of 50)
   * const darkColor = random(50);    // Returns something like "#4A3B32"
   * ```
   */
  random = (brightness: number): LfColorHexString => {
    function randomChannel(brightness: number) {
      var r = 255 - brightness;
      var n = 0 | (Math.random() * r + brightness);
      var s = n.toString(16);
      return s.length == 1 ? "0" + s : s;
    }

    return `#${randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness)}`;
  };
  //#endregion
}

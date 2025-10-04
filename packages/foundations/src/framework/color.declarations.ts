import { LF_COLOR_CODES } from "./color.constants";

//#region Class
/**
 * Primary interface exposing the color utilities.
 */
export interface LfColorInterface {
  /**
   * Resolves a readable contrast color (black/white) for the supplied input.
   */
  autoContrast: (color: LfColorInput) => string;
  /**
   * Produces the full set of derived color values (hex, RGB, HSL, etc.).
   */
  compute: (color: string) => LfColorValues;
  convert: {
    /**
     * Converts a named color reference or shorthand code (for example `primary`) into a hex string.
     */
    codeToHex: (color: string) => string;
    /** Converts a hex string into numeric RGB components. */
    hexToRgb: (hex: string) => LfColorRGBValues;
    /** Converts numeric HSL values (0-360, 0-1, 0-1) into an RGB triplet. */
    hslToRgb: (h: number, s: number, l: number) => LfColorRGBValues;
    /** Converts an RGB triplet into a hex string. */
    rgbToHex: (r: number, g: number, b: number) => LfColorHexString;
    /** Converts an RGB triplet into HSL values (degrees, saturation %, lightness %). */
    rgbToHsl: (
      r: number,
      g: number,
      b: number,
    ) => { h: number; s: number; l: number };
    /** Normalises an individual channel into a two-character hex pair. */
    valueToHex: (c: number) => string;
  };
  /**
   * Generates a random hex color constrained by the provided brightness.
   */
  random: (brightness: number) => LfColorHexString;
}
//#endregion

//#region Colors
/**
 * Union of accepted color inputs handled by the color utilities.
 */
export type LfColorInput =
  | LfColorHexString
  | LfColorRGBString
  | LfColorRGBAString
  | LfColorHSLString
  | LfColorHSLAString
  | (typeof LF_COLOR_CODES)[keyof typeof LF_COLOR_CODES];
/**
 * Collection of color values produced by the color utilities.
 */
export interface LfColorValues {
  /** Hex representation with leading `#`. */
  hexColor: LfColorHexString;
  hslColor: LfColorHSLString;
  hslValues: LfColorHSLValuesString;
  hue: `${number}`;
  lightness: LfColorHSLPercentage;
  saturation: LfColorHSLPercentage;
  rgbColor: LfColorRGBString;
  rgbValues: LfColorRGBValuesString;
}
/**
 * Template literal string representing a hex color value.
 */
export type LfColorHexString = `#${string}`;
/**
 * Template literal string representing an RGB color value.
 */
export type LfColorRGBValuesString = `${number},${number},${number}`;
/**
 * Template literal string representing an HSL color value.
 */
export type LfColorHSLValuesString =
  `${number},${LfColorHSLPercentage},${LfColorHSLPercentage}`;
/**
 * Template literal string representing an RGB color value.
 */
export type LfColorRGBString = `rgb(${LfColorRGBValuesString})`;
/**
 * Template literal string representing an RGBA color value.
 */
export type LfColorRGBAString = `rgba(${LfColorRGBValuesString},${number})`;
/**
 * Template literal string representing an HSL color value.
 */
export type LfColorHSLString = `hsl(${LfColorHSLValuesString})`;
/**
 * Template literal string representing an HSLA color value.
 */
export type LfColorHSLAString = `hsla(${LfColorHSLValuesString},${number})`;
/**
 * Percentage string used by the module's calculations.
 */
export type LfColorHSLPercentage = `${number}%`;
/**
 * Collection of RGB values produced by the color utilities.
 */
export interface LfColorRGBValues {
  r: number;
  g: number;
  b: number;
}
/**
 * Collection of HSL values produced by the color utilities.
 */
export interface LfColorHSLValues {
  h: number;
  s: number;
  l: number;
}
//#endregion

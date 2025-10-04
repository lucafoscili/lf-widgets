import { LF_COLOR_CODES } from "./color.constants";

//#region Class
/**
 * Primary interface exposing the color utilities.
 */
export interface LfColorInterface {
  autoContrast: (color: LfColorInput) => string;
  compute: (color: string) => LfColorValues;
  convert: {
    codeToHex: (color: string) => string;
    hexToRgb: (hex: string) => LfColorRGBValues;
    hslToRgb: (h: number, s: number, l: number) => LfColorRGBValues;
    rgbToHex: (r: number, g: number, b: number) => LfColorHexString;
    rgbToHsl: (
      r: number,
      g: number,
      b: number,
    ) => { h: number; s: number; l: number };
    valueToHex: (c: number) => string;
  };
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

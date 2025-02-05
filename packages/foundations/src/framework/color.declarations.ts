import { LF_COLOR_CODES } from "./color.constants";

//#region Class
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
export type LfColorInput =
  | LfColorHexString
  | LfColorRGBString
  | LfColorRGBAString
  | LfColorHSLString
  | LfColorHSLAString
  | (typeof LF_COLOR_CODES)[keyof typeof LF_COLOR_CODES];
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
export type LfColorHexString = `#${string}`;
export type LfColorRGBValuesString = `${number},${number},${number}`;
export type LfColorHSLValuesString =
  `${number},${LfColorHSLPercentage},${LfColorHSLPercentage}`;
export type LfColorRGBString = `rgb(${LfColorRGBValuesString})`;
export type LfColorRGBAString = `rgba(${LfColorRGBValuesString},${number})`;
export type LfColorHSLString = `hsl(${LfColorHSLValuesString})`;
export type LfColorHSLAString = `hsla(${LfColorHSLValuesString},${number})`;
export type LfColorHSLPercentage = `${number}%`;
export interface LfColorRGBValues {
  r: number;
  g: number;
  b: number;
}
export interface LfColorHSLValues {
  h: number;
  s: number;
  l: number;
}
//#endregion

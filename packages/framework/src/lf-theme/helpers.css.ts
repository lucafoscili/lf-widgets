import {
  LF_THEME_COLORS_PREFIX,
  LF_THEME_ICONS_PREFIX,
  LfColorInput,
  LfComponent,
  LfFrameworkInterface,
  LfThemeCustomStyles,
  LfThemeElement,
} from "@lf-widgets/foundations";
import { buildDocumentCss } from "./helpers.shared-styles";

//#region Font CSS
/**
 * Generates @font-face CSS declarations for theme fonts.
 *
 * @param theme - The theme entry containing font configuration
 * @param getAssetPath - Function to resolve asset paths
 * @returns CSS string with @font-face declarations
 */
export const buildFontCss = (
  theme: LfThemeElement,
  getAssetPath: (path: string) => { path: string },
): string => {
  let css = "";
  const { font } = theme;

  if (font?.length) {
    font.forEach((f: string) => {
      const path = getAssetPath(`./assets/fonts/${f}-Regular`).path;
      // Convert camelCase/PascalCase to spaced font name
      const fontFamily = f.split("-")[0].replace(/(?<!^)(?=[A-Z])/g, " ");

      css += `@font-face{font-family:${fontFamily};`;
      css += `src:url('${path}.woff2')format('woff2');}`;
    });
  }

  return css;
};
//#endregion

//#region Variables CSS
/**
 * Generates CSS custom property declarations for theme variables.
 * Handles color variables (converted to RGB values), icon variables (converted to URLs),
 * and standard variables (passed through directly).
 *
 * @param theme - The theme entry containing variable definitions
 * @param manager - Framework manager for color computation and asset resolution
 * @returns CSS string with custom property declarations
 */
export const buildVariablesCss = (
  theme: LfThemeElement,
  manager: LfFrameworkInterface,
): string => {
  const { assets, color } = manager;
  let css = "";
  const { variables } = theme;

  Object.entries(variables).forEach(([key, val]) => {
    switch (key) {
      case key.startsWith(LF_THEME_COLORS_PREFIX) && key:
        const { rgbValues } = color.compute(val as LfColorInput);
        css += `${key}: ${rgbValues};`;
        break;

      case key.startsWith(LF_THEME_ICONS_PREFIX) && key:
        const path = assets.get(`./assets/svg/${val}.svg`).path;
        css += `${key}: url(${path}) no-repeat center;`;
        break;

      default:
        css += `${key}: ${val};`;
        break;
    }
  });

  return css;
};
//#endregion

//#region Global Styles CSS
/**
 * Generates document-level global styles CSS.
 * Only includes selectors that target light DOM elements (.lf-effects, .lf-portal).
 *
 * @returns CSS string for document-level styles
 */
export const buildGlobalStylesCss = (): string => {
  return buildDocumentCss();
};
//#endregion

//#region Custom Styles
/**
 * Master custom style key used for global custom styles.
 */
const MASTER_CUSTOM_STYLE: keyof LfThemeCustomStyles = "MASTER";

/**
 * Checks if a CSS string contains potentially malicious content.
 *
 * @param css - The CSS string to validate
 * @returns true if malicious content is detected
 */
const isMaliciousCss = (css: string): boolean => {
  if (!css) return true;
  if (/javascript:/i.test(css)) return true;
  if (/<script>/i.test(css)) return true;
  if (/url\(.*(javascript|data):/i.test(css)) return true;
  return false;
};

/**
 * Builds and validates custom CSS styles for a component.
 * Combines styles from multiple sources in order of specificity:
 * 1. Master custom style (if exists)
 * 2. Component-specific style based on tag name (if exists)
 * 3. Component's lfStyle property (if exists)
 *
 * @param comp - The component to build styles for
 * @param customStyles - The theme's custom styles configuration
 * @returns Combined CSS string if valid, empty string if malicious content detected
 */
export const buildComponentCustomCss = (
  comp: LfComponent,
  customStyles?: LfThemeCustomStyles,
): string => {
  let css = "";
  const tag = comp.rootElement.tagName as keyof LfThemeCustomStyles;

  if (customStyles?.[MASTER_CUSTOM_STYLE]) {
    css += customStyles[MASTER_CUSTOM_STYLE];
  }
  if (customStyles?.[tag]) {
    css += ` ${customStyles[tag]}`;
  }
  if (comp.lfStyle) {
    css += ` ${comp.lfStyle}`;
  }

  return (!isMaliciousCss(css) && css) || "";
};
//#endregion

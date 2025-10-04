import {
  LfComponent,
  LfComponentTag,
} from "../foundations/components.declarations";
import { LfColorInput } from "./color.declarations";
import { LfDataDataset } from "./data.declarations";
import {
  LF_ICONS_REGISTRY,
  LF_THEME_COLORS,
  LF_THEME_COLORS_DATA_PREFIX,
  LF_THEME_FONTS,
  LF_THEME_ICONS,
  LF_THEME_MODIFIERS,
  LF_THEME_UI,
  LF_THEME_UI_NUMERICS,
  LF_THEME_UI_SIZES,
  LF_THEME_UI_STATES,
} from "./theme.constants";

//#region Class
/**
 * Interface representing the theme system for LF Widgets.
 *
 * Provides methods and properties for managing theme variables, custom styles, icons, sprites, and theme switching.
 *
 * @remarks
 * This interface is designed to facilitate theme management, including BEM class generation, theme retrieval and setting, icon management, and component registration for style updates.
 *
 * @property bemClass - Generates a BEM (Block Element Modifier) class string based on the provided block, element, and optional modifiers.
 * @property get - An object containing methods to retrieve current theme data, icons, sprite information, and available themes.
 * @property set - Sets the current theme by name and optionally updates the theme list.
 * @property refresh - Forces a refresh of the theme, reapplying styles as needed.
 * @property setLfStyle - Returns the style string for a given component.
 * @property randomize - Randomizes the current theme (useful for testing or demo purposes).
 * @property register - Registers a component to receive theme/style updates.
 * @property unregister - Unregisters a component from receiving theme/style updates.
 */
export interface LfThemeInterface {
  bemClass: (
    block: string,
    element?: string,
    modifiers?: Partial<LfThemeBEMModifier>,
  ) => string;
  get: {
    current: () => {
      variables: LfThemeVariables;
      customStyles: LfThemeCustomStyles;
      font: string[];
      isDark: boolean;
      name: string;
      full: LfThemeList[string];
    };
    icon: (name: keyof typeof LF_ICONS_REGISTRY) => string;
    icons: () => typeof LF_ICONS_REGISTRY;
    sprite: {
      path: () => string;
      ids: () => Promise<Set<string>>;
      hasIcon: (id: string) => Promise<boolean>;
    };
    themes: () => {
      asArray: string[];
      asDataset: LfDataDataset;
    };
  };
  set: (name?: string, list?: LfThemeList) => void;
  refresh: () => void;
  setLfStyle: (comp: LfComponent) => string;
  randomize: () => void;
  register: (comp: LfComponent) => void;
  unregister: (comp: LfComponent) => void;
}
//#endregion

//#region Theme
/**
 * Utility interface used by the theme system.
 */
export interface LfThemeList {
  [index: string]: LfThemeElement;
}
/**
 * Utility type used by the theme system.
 */
export type LfThemeCustomStyles = Partial<
  Record<LfComponentTag | "MASTER", string>
>;
/**
 * Utility interface used by the theme system.
 */
export interface LfThemeElement {
  isDark: boolean;
  variables: LfThemeVariables;
  customStyles?: LfThemeCustomStyles;
  font?: string[];
}
/**
 * Utility type used by the theme system.
 */
export type LfThemeBEMModifier = Record<
  (typeof LF_THEME_MODIFIERS)[number],
  boolean
>;
/**
 * Utility type used by the theme system.
 */
export type LfThemeVariables = LfThemeColorVariables &
  LfThemeColorDataVariables &
  LfThemeFontVariables &
  LfThemeIconVariables &
  LfThemeUIVariables;
//#endregion

//#region Colors
/**
 * Utility type used by the theme system.
 */
export type LfThemeColorDataVariableKey =
  `${typeof LF_THEME_COLORS_DATA_PREFIX}${number}`;
/**
 * Utility type used by the theme system.
 */
export type LfThemeColorDataVariables = {
  [K in LfThemeColorDataVariableKey]: string;
};
/**
 * Utility type used by the theme system.
 */
export type LfThemeColorVariable =
  (typeof LF_THEME_COLORS)[keyof typeof LF_THEME_COLORS];
/**
 * Utility type used by the theme system.
 */
export type LfThemeColorVariables = Record<LfThemeColorVariable, LfColorInput>;
//#endregion

//#region Fonts
/**
 * Utility type used by the theme system.
 */
export type LfThemeFontVariable =
  (typeof LF_THEME_FONTS)[keyof typeof LF_THEME_FONTS];
/**
 * Utility type used by the theme system.
 */
export type LfThemeFontVariables = Record<LfThemeFontVariable, string>;
//#endregion

//#region Icons
/**
 * Utility type used by the theme system.
 */
export type LfThemeIconRegistry = typeof LF_ICONS_REGISTRY;
/**
 * Utility type used by the theme system.
 */
export type LfThemeIconKey = keyof LfThemeIconRegistry;
/**
 * Utility type used by the theme system.
 */
export type LfThemeIcon = LfThemeIconRegistry[LfThemeIconKey];
/**
 * Utility type used by the theme system.
 */
export type LfThemeIconVariable =
  (typeof LF_THEME_ICONS)[keyof typeof LF_THEME_ICONS];
/**
 * Utility type used by the theme system.
 */
export type LfThemeIconVariables = Record<LfThemeIconVariable, LfThemeIcon>;
//#endregion

//#region UI
/**
 * Utility type used by the theme system.
 */
export type LfThemeUISizes = typeof LF_THEME_UI_SIZES;
/**
 * Utility type used by the theme system.
 */
export type LfThemeUISize = LfThemeUISizes[number];
/**
 * Utility type used by the theme system.
 */
export type LfThemeUIStates = typeof LF_THEME_UI_STATES;
/**
 * Utility type used by the theme system.
 */
export type LfThemeUIState = LfThemeUIStates[number];
/**
 * Utility type used by the theme system.
 */
export type LfThemeUINumericKeys = typeof LF_THEME_UI_NUMERICS;
/**
 * Utility type used by the theme system.
 */
export type LfThemeUIVariable = (typeof LF_THEME_UI)[keyof typeof LF_THEME_UI];
/**
 * Utility type used by the theme system.
 */
export type LfThemeUIVariables = {
  [K in keyof typeof LF_THEME_UI as (typeof LF_THEME_UI)[K]]: K extends (typeof LF_THEME_UI_NUMERICS)[number]
    ? number
    : string;
};
//#endregion

//#region Theme Fixtures
/**
 * Utility type used by the theme system.
 */
export type LfThemeFixtures = {
  state: {
    [state in LfThemeUIState]: {
      color: {
        bg: LfColorInput;
        text: LfColorInput;
      };
      icon: LfThemeIcon;
      label: {
        capitalized: string;
        lower: string;
        upper: string;
      };
    };
  };
};
//#endregion

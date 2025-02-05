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
export interface LfThemeList {
  [index: string]: LfThemeElement;
}
export type LfThemeCustomStyles = Partial<
  Record<LfComponentTag | "MASTER", string>
>;
export interface LfThemeElement {
  isDark: boolean;
  variables: LfThemeVariables;
  customStyles?: LfThemeCustomStyles;
  font?: string[];
}
export type LfThemeBEMModifier = Record<
  (typeof LF_THEME_MODIFIERS)[number],
  boolean
>;
export type LfThemeVariables = LfThemeColorVariables &
  LfThemeColorDataVariables &
  LfThemeFontVariables &
  LfThemeIconVariables &
  LfThemeUIVariables;
//#endregion

//#region Colors
export type LfThemeColorDataVariableKey =
  `${typeof LF_THEME_COLORS_DATA_PREFIX}${number}`;
export type LfThemeColorDataVariables = {
  [K in LfThemeColorDataVariableKey]: string;
};
export type LfThemeColorVariable =
  (typeof LF_THEME_COLORS)[keyof typeof LF_THEME_COLORS];
export type LfThemeColorVariables = Record<LfThemeColorVariable, LfColorInput>;
//#endregion

//#region Fonts
export type LfThemeFontVariable =
  (typeof LF_THEME_FONTS)[keyof typeof LF_THEME_FONTS];
export type LfThemeFontVariables = Record<LfThemeFontVariable, string>;
//#endregion

//#region Icons
export type LfThemeIconRegistry = typeof LF_ICONS_REGISTRY;
export type LfThemeIconKey = keyof LfThemeIconRegistry;
export type LfThemeIcon = LfThemeIconRegistry[LfThemeIconKey];
export type LfThemeIconVariable =
  (typeof LF_THEME_ICONS)[keyof typeof LF_THEME_ICONS];
export type LfThemeIconVariables = Record<LfThemeIconVariable, LfThemeIcon>;
//#endregion

//#region UI
export type LfThemeUISizes = typeof LF_THEME_UI_SIZES;
export type LfThemeUISize = LfThemeUISizes[number];
export type LfThemeUIStates = typeof LF_THEME_UI_STATES;
export type LfThemeUIState = LfThemeUIStates[number];
export type LfThemeUINumericKeys = typeof LF_THEME_UI_NUMERICS;
export type LfThemeUIVariable = (typeof LF_THEME_UI)[keyof typeof LF_THEME_UI];
export type LfThemeUIVariables = {
  [K in keyof typeof LF_THEME_UI as (typeof LF_THEME_UI)[K]]: K extends (typeof LF_THEME_UI_NUMERICS)[number]
    ? number
    : string;
};
//#endregion

//#region Theme Fixtures
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

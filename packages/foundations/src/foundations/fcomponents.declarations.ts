import {
  LF_ICONS_REGISTRY,
  LF_THEME_ICONS,
  LfFrameworkInterface,
  LfThemeUIState,
} from "../framework";

//#region Icon
export type LfIconType =
  | (typeof LF_THEME_ICONS)[keyof typeof LF_THEME_ICONS]
  | (typeof LF_ICONS_REGISTRY)[keyof typeof LF_ICONS_REGISTRY];
/**
 * Input contract provided to the FIcon functional component for rendering sprite-based icons.
 */
export interface FIconPropsInterface {
  /**
   * Runtime framework instance used to access theme and sprite helpers.
   */
  framework: LfFrameworkInterface;
  /**
   * Icon name from the sprite (e.g., "clear", "check") or a CSS variable reference
   * (e.g., "--lf-icon-clear").
   */
  icon: LfIconType;
  /**
   * Optional CSS class to apply to the wrapper element.
   */
  wrapperClass?: string;
  /**
   * Optional CSS class to apply to the SVG icon element.
   */
  iconClass?: string;
  /**
   * Optional click handler.
   */
  onClick?: (e: MouseEvent) => void;
  /**
   * Optional inline styles to apply to the SVG element.
   */
  style?: { [key: string]: string | number };
  /**
   * Optional UI state to reflect on the icon via `data-lf` attribute.
   */
  uiState?: LfThemeUIState;
}
//#endregion

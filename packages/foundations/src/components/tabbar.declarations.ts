import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset, LfDataNode } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_TABBAR_EVENTS, LF_TABBAR_SCROLL } from "./tabbar.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-tabbar` component. It merges the shared component contract with the component-specific props.
 */
export interface LfTabbarInterface
  extends LfComponent<"LfTabbar">,
    LfTabbarPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-tabbar`.
 */
export interface LfTabbarElement
  extends HTMLStencilElement,
    Omit<LfTabbarInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-tabbar`.
 */
export type LfTabbarEvent = (typeof LF_TABBAR_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-tabbar` events.
 */
export interface LfTabbarEventPayload
  extends LfEventPayload<"LfTabbar", LfTabbarEvent> {
  index?: number;
  node?: LfDataNode;
}
//#endregion

//#region States
/**
 * Utility type used by the `lf-tabbar` component.
 */
export type LfTabbarScroll = (typeof LF_TABBAR_SCROLL)[number];
/**
 * Union of runtime states supported by `lf-tabbar`.
 */
export interface LfTabbarState {
  index?: number;
  node?: LfDataNode;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-tabbar` component.
 */
export interface LfTabbarPropsInterface {
  lfAriaLabel?: string;
  lfDataset?: LfDataDataset;
  lfNavigation?: boolean;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number | string;
}
//#endregion

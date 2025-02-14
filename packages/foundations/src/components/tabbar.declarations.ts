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
export interface LfTabbarInterface
  extends LfComponent<"LfTabbar">,
    LfTabbarPropsInterface {}
export interface LfTabbarElement
  extends HTMLStencilElement,
    Omit<LfTabbarInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfTabbarEvent = (typeof LF_TABBAR_EVENTS)[number];
export interface LfTabbarEventPayload
  extends LfEventPayload<"LfTabbar", LfTabbarEvent> {
  index?: number;
  node?: LfDataNode;
}
//#endregion

//#region States
export type LfTabbarScroll = (typeof LF_TABBAR_SCROLL)[number];
export interface LfTabbarState {
  index?: number;
  node?: LfDataNode;
}
//#endregion

//#region Props
export interface LfTabbarPropsInterface {
  lfDataset?: LfDataDataset;
  lfNavigation?: boolean;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number | string;
}
//#endregion

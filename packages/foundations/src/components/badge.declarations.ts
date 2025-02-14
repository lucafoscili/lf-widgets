import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_BADGE_EVENTS, LF_BADGE_POSITIONS } from "./badge.constants";
import { LfImagePropsInterface } from "./image.declarations";

//#region Class
export interface LfBadgeInterface
  extends LfComponent<"LfBadge">,
    LfBadgePropsInterface {}
export interface LfBadgeElement
  extends HTMLStencilElement,
    Omit<LfBadgeInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfBadgeEvent = (typeof LF_BADGE_EVENTS)[number];
export interface LfBadgeEventPayload
  extends LfEventPayload<"LfBadge", LfBadgeEvent> {}
//#endregion

//#region Props
export interface LfBadgePropsInterface {
  lfImageProps?: LfImagePropsInterface;
  lfLabel?: string;
  lfPosition?: LfBadgePositions;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
export type LfBadgePositions = (typeof LF_BADGE_POSITIONS)[number];
//#endregion

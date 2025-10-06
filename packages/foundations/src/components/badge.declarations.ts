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
/**
 * Primary interface implemented by the `lf-badge` component. It merges the shared component contract with the component-specific props.
 */
export interface LfBadgeInterface
  extends LfComponent<"LfBadge">,
    LfBadgePropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-badge`.
 */
export interface LfBadgeElement
  extends HTMLStencilElement,
    Omit<LfBadgeInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-badge`.
 */
export type LfBadgeEvent = (typeof LF_BADGE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-badge` events.
 */
export interface LfBadgeEventPayload
  extends LfEventPayload<"LfBadge", LfBadgeEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-badge` component.
 */
export interface LfBadgePropsInterface {
  lfImageProps?: LfImagePropsInterface;
  lfLabel?: string;
  lfPosition?: LfBadgePositions;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
/**
 * Utility type used by the `lf-badge` component.
 */
export type LfBadgePositions = (typeof LF_BADGE_POSITIONS)[number];
//#endregion

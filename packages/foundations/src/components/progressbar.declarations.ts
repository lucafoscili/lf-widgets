import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_PROGRESSBAR_EVENTS } from "./progressbar.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-progressbar` component. It merges the shared component contract with the component-specific props.
 */
export interface LfProgressbarInterface
  extends LfComponent<"LfProgressbar">,
    LfProgressbarPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-progressbar`.
 */
export interface LfProgressbarElement
  extends HTMLStencilElement,
    Omit<LfProgressbarInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-progressbar`.
 */
export type LfProgressbarEvent = (typeof LF_PROGRESSBAR_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-progressbar` events.
 */
export interface LfProgressbarEventPayload
  extends LfEventPayload<"LfProgressbar", LfProgressbarEvent> {
  isPlaceholder?: boolean;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-progressbar` component.
 */
export interface LfProgressbarPropsInterface {
  lfAnimated?: boolean;
  lfCenteredLabel?: boolean;
  lfIcon?: string;
  lfIsRadial?: boolean;
  lfLabel?: string;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number;
}
//#endregion

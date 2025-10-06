import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_SLIDER_EVENTS } from "./slider.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-slider` component. It merges the shared component contract with the component-specific props.
 */
export interface LfSliderInterface
  extends LfComponent<"LfSlider">,
    LfSliderPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-slider`.
 */
export interface LfSliderElement
  extends HTMLStencilElement,
    Omit<LfSliderInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-slider`.
 */
export type LfSliderEvent = (typeof LF_SLIDER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-slider` events.
 */
export interface LfSliderEventPayload
  extends LfEventPayload<"LfSlider", LfSliderEvent> {
  value: LfSliderValue;
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-slider` component.
 */
export interface LfSliderPropsInterface {
  lfLabel?: string;
  lfLeadingLabel?: boolean;
  lfMax?: number;
  lfMin?: number;
  lfRipple?: boolean;
  lfStep?: number;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: number;
}
//#endregion

//#region State
/**
 * Utility interface used by the `lf-slider` component.
 */
export interface LfSliderValue {
  display: number;
  real: number;
}
//#endregion

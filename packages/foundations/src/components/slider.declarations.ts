import { HTMLStencilElement, LfComponent } from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_SLIDER_EVENTS } from "./slider.constants";

//#region Class
export interface LfSliderInterface
  extends LfComponent<"LfSlider">,
    LfSliderPropsInterface {}
export interface LfSliderElement
  extends HTMLStencilElement,
    LfSliderInterface {}
//#endregion

//#region Events
export type LfSliderEvent = (typeof LF_SLIDER_EVENTS)[number];
export interface LfSliderEventPayload
  extends LfEventPayload<"LfSlider", LfSliderEvent> {
  value: LfSliderValue;
}
//#endregion

//#region Props
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
export interface LfSliderValue {
  display: number;
  real: number;
}
//#endregion

import { HTMLStencilElement, LfComponent } from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_PROGRESSBAR_EVENTS } from "./progressbar.constants";

//#region Class
export interface LfProgressbarInterface
  extends LfComponent<"LfProgressbar">,
    LfProgressbarPropsInterface {}
export interface LfProgressbarElement
  extends HTMLStencilElement,
    LfProgressbarInterface {}
//#endregion

//#region Events
export type LfProgressbarEvent = (typeof LF_PROGRESSBAR_EVENTS)[number];
export interface LfProgressbarEventPayload
  extends LfEventPayload<"LfProgressbar", LfProgressbarEvent> {
  isPlaceholder?: boolean;
}
//#endregion

//#region Props
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

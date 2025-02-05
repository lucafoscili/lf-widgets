import { HTMLStencilElement, LfComponent } from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_SPINNER_EVENTS } from "./spinner.constants";

//#region Class
export interface LfSpinnerInterface
  extends LfComponent<"LfSpinner">,
    LfSpinnerPropsInterface {}
export interface LfSpinnerElement
  extends HTMLStencilElement,
    LfSpinnerInterface {}
//#endregion

//#region Events
export type LfSpinnerEvent = (typeof LF_SPINNER_EVENTS)[number];
export interface LfSpinnerEventPayload
  extends LfEventPayload<"LfSpinner", LfSpinnerEvent> {}
//#endregion

//#region Props
export interface LfSpinnerPropsInterface {
  lfActive?: boolean;
  lfBarVariant?: boolean;
  lfDimensions?: string;
  lfFader?: boolean;
  lfFaderTimeout?: number;
  lfFullScreen?: boolean;
  lfLayout?: number;
  lfStyle?: string;
  lfTimeout?: number;
}
//#endregion

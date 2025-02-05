import {
  HTMLStencilElement,
  LfComponent,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfDataDataset } from "../framework/data.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_ACCORDION_EVENTS } from "./accordion.constants";

//#region Class
export interface LfAccordionInterface
  extends LfComponent<"LfAccordion">,
    LfAccordionPropsInterface {}
export interface LfAccordionElement
  extends HTMLStencilElement,
    LfAccordionInterface {}
//#endregion

//#region Events
export type LfAccordionEvent = (typeof LF_ACCORDION_EVENTS)[number];
export interface LfAccordionEventPayload
  extends LfEventPayload<"LfAccordion", LfAccordionEvent> {}
//#endregion

//#region Props
export interface LfAccordionPropsInterface {
  lfDataset?: LfDataDataset;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
//#endregion

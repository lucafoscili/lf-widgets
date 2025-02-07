import {
  HTMLStencilElement,
  LfComponent,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_CODE_EVENTS } from "./code.constants";

//#region Class
export interface LfCodeInterface
  extends LfComponent<"LfCode">,
    LfCodePropsInterface {}
export interface LfCodeElement extends HTMLStencilElement, LfCodeInterface {}
//#endregion

//#region Events
export type LfCodeEvent = (typeof LF_CODE_EVENTS)[number];
export interface LfCodeEventPayload
  extends LfEventPayload<"LfCode", LfCodeEvent> {}
//#endregion

//#region Props
export interface LfCodePropsInterface {
  lfFormat?: boolean;
  lfLanguage?: string;
  lfPreserveSpaces?: boolean;
  lfShowCopy?: boolean;
  lfShowHeader?: boolean;
  lfStickyHeader?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
//#endregion

import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_TOGGLE_EVENTS, LF_TOGGLE_STATES } from "./toggle.constants";

//#region Class
export interface LfToggleInterface
  extends LfComponent<"LfToggle">,
    LfTogglePropsInterface {
  setValue: (value: LfToggleState | boolean) => Promise<void>;
}
export interface LfToggleElement
  extends HTMLStencilElement,
    Omit<LfToggleInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfToggleEvent = (typeof LF_TOGGLE_EVENTS)[number];
export interface LfToggleEventPayload
  extends LfEventPayload<"LfToggle", LfToggleEvent> {
  value: string;
  valueAsBoolean: boolean;
}
//#endregion

//#region States
export type LfToggleState = (typeof LF_TOGGLE_STATES)[number];
//#endregion

//#region Props
export interface LfTogglePropsInterface {
  lfLabel?: string;
  lfLeadingLabel?: boolean;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: boolean;
}
//#endregion

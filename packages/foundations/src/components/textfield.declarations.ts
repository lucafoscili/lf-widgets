import {
  HTMLStencilElement,
  LfComponent,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkAllowedKeysMap } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_TEXTFIELD_EVENTS,
  LF_TEXTFIELD_MODIFIERS,
  LF_TEXTFIELD_STYLINGS,
} from "./textfield.constants";

//#region Class
export interface LfTextfieldInterface
  extends LfComponent<"LfTextfield">,
    LfTextfieldPropsInterface {
  getValue: () => Promise<string>;
  setBlur: () => Promise<void>;
  setFocus: () => Promise<void>;
  setValue: (value: string) => Promise<void>;
}
export interface LfTextfieldElement
  extends HTMLStencilElement,
    LfTextfieldInterface {}
//#endregion

//#region Events
export type LfTextfieldEvent = (typeof LF_TEXTFIELD_EVENTS)[number];
export interface LfTextfieldEventPayload
  extends LfEventPayload<"LfTextfield", LfTextfieldEvent> {
  inputValue?: string;
  target: HTMLInputElement | HTMLDivElement | HTMLTextAreaElement;
  value?: string;
}
//#endregion

//#region States
export type LfTextfieldModifiers = (typeof LF_TEXTFIELD_MODIFIERS)[number];
//#endregion

//#region Props
export interface LfTextfieldPropsInterface {
  lfHelper?: LfTextfieldHelper;
  lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
  lfIcon?: string;
  lfLabel?: string;
  lfStretchY?: boolean;
  lfStyle?: string;
  lfStyling?: LfTextfieldStyling;
  lfTrailingIcon?: boolean;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
export interface LfTextfieldHelper {
  showWhenFocused?: boolean;
  value: string;
}
export type LfTextfieldStyling = (typeof LF_TEXTFIELD_STYLINGS)[number];
//#endregion

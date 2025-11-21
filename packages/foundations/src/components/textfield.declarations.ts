import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_THEME_ICONS } from "../framework";
import { LfFrameworkAllowedKeysMap } from "../framework/framework.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import {
  LF_TEXTFIELD_EVENTS,
  LF_TEXTFIELD_MODIFIERS,
  LF_TEXTFIELD_STYLINGS,
} from "./textfield.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-textfield` component. It merges the shared component contract with the component-specific props.
 */
export interface LfTextfieldInterface
  extends LfComponent<"LfTextfield">,
    LfTextfieldPropsInterface {
  formatJSON: () => Promise<void>;
  getElement: () => Promise<HTMLTextAreaElement | HTMLInputElement>;
  getValue: () => Promise<string>;
  setBlur: () => Promise<void>;
  setFocus: () => Promise<void>;
  setValue: (value: string) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-textfield`.
 */
export interface LfTextfieldElement
  extends HTMLStencilElement,
    Omit<LfTextfieldInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-textfield`.
 */
export type LfTextfieldEvent = (typeof LF_TEXTFIELD_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-textfield` events.
 */
export interface LfTextfieldEventPayload
  extends LfEventPayload<"LfTextfield", LfTextfieldEvent> {
  iconType?: "regular" | "action";
  inputValue?: string;
  target: HTMLInputElement | HTMLDivElement | HTMLTextAreaElement;
  value?: string;
}
//#endregion

//#region States
/**
 * Utility type used by the `lf-textfield` component.
 */
export type LfTextfieldModifiers = (typeof LF_TEXTFIELD_MODIFIERS)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-textfield` component.
 */
export interface LfTextfieldPropsInterface {
  lfFormatJSON?: LfTextfieldFormatJSON | null;
  lfHelper?: LfTextfieldHelper;
  lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
  lfIcon?: string;
  lfLabel?: string;
  lfStretchY?: boolean;
  lfStyle?: string;
  lfStyling?: LfTextfieldStyling;
  lfTrailingIcon?: boolean;
  lfTrailingIconAction?: LfTextfieldTrailingIconAction;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
/**
 * Configuration interface for JSON formatting in the `lf-textfield` component.
 * Only applicable to textfields with `lfStyling="textarea"`.
 */
export interface LfTextfieldFormatJSON {
  displayBorderOnError?: boolean;
  displayErrorAsTitle?: boolean;
  indentSpaces?: number;
  onBlur?: boolean;
  onInput?: number;
}
export type LfTextfieldTrailingIconAction =
  | (typeof LF_THEME_ICONS)[keyof typeof LF_THEME_ICONS]
  | null;
/**
 * Utility interface used by the `lf-textfield` component.
 */
export interface LfTextfieldHelper {
  showWhenFocused?: boolean;
  value: string;
}
/**
 * Union of styling tokens listed in `LF_TEXTFIELD_STYLINGS`.
 */
export type LfTextfieldStyling = (typeof LF_TEXTFIELD_STYLINGS)[number];
//#endregion

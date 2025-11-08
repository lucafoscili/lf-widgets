import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_CHECKBOX_EVENTS, LF_CHECKBOX_STATES } from "./checkbox.constants";

export interface LfCheckboxInterface
  extends LfComponent<"LfCheckbox">,
    LfCheckboxPropsInterface {
  getValue: () => Promise<LfCheckboxState>;
  setValue: (value: LfCheckboxState | boolean) => Promise<void>;
}

export interface LfCheckboxElement
  extends HTMLStencilElement,
    Omit<LfCheckboxInterface, LfComponentClassProperties> {}

export type LfCheckboxEvent = (typeof LF_CHECKBOX_EVENTS)[number];

export interface LfCheckboxEventPayload
  extends LfEventPayload<"LfCheckbox", LfCheckboxEvent> {
  value: string;
  valueAsBoolean: boolean;
  isIndeterminate: boolean;
}

export type LfCheckboxState = (typeof LF_CHECKBOX_STATES)[number];

export interface LfCheckboxPropsInterface {
  lfAriaLabel?: string;
  lfLabel?: string;
  lfLeadingLabel?: boolean;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: boolean | null;
}

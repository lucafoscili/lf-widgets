import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_TOGGLE_EVENTS, LF_TOGGLE_STATES } from "./toggle.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-toggle` component. It merges the shared component contract with the component-specific props.
 */
export interface LfToggleInterface
  extends LfComponent<"LfToggle">,
    LfTogglePropsInterface {
  setValue: (value: LfToggleState | boolean) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-toggle`.
 */
export interface LfToggleElement
  extends HTMLStencilElement,
    Omit<LfToggleInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-toggle`.
 */
export type LfToggleEvent = (typeof LF_TOGGLE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-toggle` events.
 */
export interface LfToggleEventPayload
  extends LfEventPayload<"LfToggle", LfToggleEvent> {
  value: string;
  valueAsBoolean: boolean;
}
//#endregion

//#region States
/**
 * Union of runtime states declared in `LF_TOGGLE_STATES`.
 */
export type LfToggleState = (typeof LF_TOGGLE_STATES)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-toggle` component.
 */
export interface LfTogglePropsInterface {
  lfAriaLabel?: string;
  lfLabel?: string;
  lfLeadingLabel?: boolean;
  lfRipple?: boolean;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfValue?: boolean;
}
//#endregion

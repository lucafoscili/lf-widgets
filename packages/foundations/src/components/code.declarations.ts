import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfThemeUISize, LfThemeUIState } from "../framework/theme.declarations";
import { LF_CODE_EVENTS } from "./code.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-code` component. It merges the shared component contract with the component-specific props.
 */
export interface LfCodeInterface
  extends LfComponent<"LfCode">,
    LfCodePropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-code`.
 */
export interface LfCodeElement
  extends HTMLStencilElement,
    Omit<LfCodeInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-code`.
 */
export type LfCodeEvent = (typeof LF_CODE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-code` events.
 */
export interface LfCodeEventPayload
  extends LfEventPayload<"LfCode", LfCodeEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-code` component.
 */
export interface LfCodePropsInterface {
  lfFadeIn?: boolean;
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

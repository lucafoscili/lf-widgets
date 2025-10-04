import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import {
  LfThemeIcon,
  LfThemeUISize,
  LfThemeUIState,
} from "../framework/theme.declarations";
import { LF_TOAST_EVENTS } from "./toast.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-toast` component. It merges the shared component contract with the component-specific props.
 */
export interface LfToastInterface
  extends LfComponent<"LfToast">,
    LfToastPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-toast`.
 */
export interface LfToastElement
  extends HTMLStencilElement,
    Omit<LfToastPropsInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-toast`.
 */
export type LfToastEvent = (typeof LF_TOAST_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-toast` events.
 */
export interface LfToastEventPayload
  extends LfEventPayload<"LfToast", LfToastEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-toast` component.
 */
export interface LfToastPropsInterface {
  lfCloseCallback?: LfToastCloseCallback;
  lfCloseIcon?: string | LfThemeIcon;
  lfIcon?: string | LfThemeIcon;
  lfMessage?: string;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
  lfTimer?: number;
}
/**
 * Utility type used by the `lf-toast` component.
 */
export type LfToastCloseCallback = (
  toast: LfToastInterface,
  e: PointerEvent,
  ...args: any[]
) => any;
//#endregion

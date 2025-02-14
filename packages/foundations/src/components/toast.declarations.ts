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
export interface LfToastInterface
  extends LfComponent<"LfToast">,
    LfToastPropsInterface {}
export interface LfToastElement
  extends HTMLStencilElement,
    Omit<LfToastPropsInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfToastEvent = (typeof LF_TOAST_EVENTS)[number];
export interface LfToastEventPayload
  extends LfEventPayload<"LfToast", LfToastEvent> {}
//#endregion

//#region Props
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
export type LfToastCloseCallback = (
  toast: LfToastInterface,
  e: PointerEvent,
  ...args: any[]
) => any;
//#endregion

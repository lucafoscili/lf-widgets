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
import {
  LF_SNACKBAR_EVENTS,
  LF_SNACKBAR_POSITIONS,
} from "./snackbar.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-snackbar` component.
 */
export interface LfSnackbarInterface
  extends LfComponent<"LfSnackbar">,
    LfSnackbarPropsInterface {}

/**
 * DOM element type for the custom element registered as `lf-snackbar`.
 */
export interface LfSnackbarElement
  extends HTMLStencilElement,
    Omit<LfSnackbarInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-snackbar`.
 */
export type LfSnackbarEvent = (typeof LF_SNACKBAR_EVENTS)[number];

/**
 * Detail payload structure dispatched with `lf-snackbar` events.
 */
export interface LfSnackbarEventPayload
  extends LfEventPayload<"LfSnackbar", LfSnackbarEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-snackbar` component.
 */
export interface LfSnackbarPropsInterface {
  lfAction?: string;
  lfActionCallback?: LfSnackbarActionCallback;
  lfCloseIcon?: string | LfThemeIcon;
  lfDuration?: number;
  lfIcon?: string | LfThemeIcon;
  lfMessage?: string;
  lfPosition?: LfSnackbarPositions;
  lfStyle?: string;
  lfUiSize?: LfThemeUISize;
  lfUiState?: LfThemeUIState;
}
/**
 * Callback invoked when the snackbar action button is clicked.
 */
export type LfSnackbarActionCallback = (
  snackbar: LfSnackbarInterface,
  e: PointerEvent,
  ...args: unknown[]
) => unknown;
/**
 * Positioning options for the snackbar.
 */
export type LfSnackbarPositions = (typeof LF_SNACKBAR_POSITIONS)[number];
//#endregion

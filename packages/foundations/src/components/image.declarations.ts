import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkAllowedKeysMap } from "../framework/framework.declarations";
import { LF_IMAGE_EVENTS } from "./image.constants";
import { LfThemeUIState } from "../framework/theme.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-image` component. It merges the shared component contract with the component-specific props.
 */
export interface LfImageInterface
  extends LfComponent<"LfImage">,
    LfImagePropsInterface {
  getImage: () => Promise<HTMLImageElement | SVGElement | null>;
}
/**
 * DOM element type for the custom element registered as `lf-image`.
 */
export interface LfImageElement
  extends HTMLStencilElement,
    Omit<LfImageInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-image`.
 */
export type LfImageEvent = (typeof LF_IMAGE_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-image` events.
 */
export interface LfImageEventPayload
  extends LfEventPayload<"LfImage", LfImageEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-image` component.
 */
export interface LfImagePropsInterface {
  lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
  lfShowSpinner?: boolean;
  lfSizeX?: string;
  lfSizeY?: string;
  lfStyle?: string;
  lfUiState?: LfThemeUIState;
  lfValue?: string;
}
//#endregion

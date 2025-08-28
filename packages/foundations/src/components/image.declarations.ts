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
export interface LfImageInterface
  extends LfComponent<"LfImage">,
    LfImagePropsInterface {}
export interface LfImageElement
  extends HTMLStencilElement,
    Omit<LfImageInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfImageEvent = (typeof LF_IMAGE_EVENTS)[number];
export interface LfImageEventPayload
  extends LfEventPayload<"LfImage", LfImageEvent> {}
//#endregion

//#region Props
export interface LfImagePropsInterface {
  lfHtmlAttributes?: Partial<LfFrameworkAllowedKeysMap>;
  lfSizeX?: string;
  lfSizeY?: string;
  lfStyle?: string;
  /** Visual state color (theme token). */
  lfUiState?: LfThemeUIState;
  lfValue?: string;
  /** Rendering mode for non-URL values: sprite (SVG <use>) or mask (legacy CSS mask). Default: sprite */
  lfMode?: LfImageMode;
}
export type LfImageMode = "sprite" | "mask";
//#endregion

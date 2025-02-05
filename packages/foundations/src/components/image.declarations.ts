import { HTMLStencilElement, LfComponent } from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfCoreAllowedKeysMap } from "../framework/core.declarations";
import { LF_IMAGE_EVENTS } from "./image.constants";

//#region Class
export interface LfImageInterface
  extends LfComponent<"LfImage">,
    LfImagePropsInterface {}
export interface LfImageElement extends HTMLStencilElement, LfImageInterface {}
//#endregion

//#region Events
export type LfImageEvent = (typeof LF_IMAGE_EVENTS)[number];
export interface LfImageEventPayload
  extends LfEventPayload<"LfImage", LfImageEvent> {}
//#endregion

//#region Props
export interface LfImagePropsInterface {
  lfHtmlAttributes?: Partial<LfCoreAllowedKeysMap>;
  lfSizeX?: string;
  lfSizeY?: string;
  lfStyle?: string;
  lfValue?: string;
}
//#endregion

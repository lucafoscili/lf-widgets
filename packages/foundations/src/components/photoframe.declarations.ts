import { HTMLStencilElement, LfComponent } from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfCoreAllowedKeysMap } from "../framework/core.declarations";
import {
  LF_PHOTOFRAME_EVENTS,
  LF_PHOTOFRAME_ORIENTATION,
} from "./photoframe.constants";

//#region Class
export interface LfPhotoframeInterface
  extends LfComponent<"LfPhotoframe">,
    LfPhotoframePropsInterface {}
export interface LfPhotoframeElement
  extends HTMLStencilElement,
    LfPhotoframeInterface {}
//#endregion

//#region Events
export type LfPhotoframeEvent = (typeof LF_PHOTOFRAME_EVENTS)[number];
export interface LfPhotoframeEventPayload
  extends LfEventPayload<"LfPhotoframe", LfPhotoframeEvent> {
  isPlaceholder?: boolean;
}
//#endregion

//#region States
export type LfPhotoframeOrientation =
  (typeof LF_PHOTOFRAME_ORIENTATION)[number];
//#endregion

//#region Props
export interface LfPhotoframePropsInterface {
  lfOverlay?: LfPhotoframeOverlay;
  lfPlaceholder?: Partial<LfCoreAllowedKeysMap>;
  lfStyle?: string;
  lfThreshold?: number;
  lfValue?: Partial<LfCoreAllowedKeysMap>;
}
export interface LfPhotoframeOverlay {
  description?: string;
  icon?: string;
  hideOnClick?: boolean;
  title?: string;
}
//#endregion

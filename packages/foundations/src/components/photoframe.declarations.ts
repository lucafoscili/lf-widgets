import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkAllowedKeysMap } from "../framework/framework.declarations";
import {
  LF_PHOTOFRAME_EVENTS,
  LF_PHOTOFRAME_ORIENTATION,
} from "./photoframe.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-photoframe` component. It merges the shared component contract with the component-specific props.
 */
export interface LfPhotoframeInterface
  extends LfComponent<"LfPhotoframe">,
    LfPhotoframePropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-photoframe`.
 */
export interface LfPhotoframeElement
  extends HTMLStencilElement,
    Omit<LfPhotoframeInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-photoframe`.
 */
export type LfPhotoframeEvent = (typeof LF_PHOTOFRAME_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-photoframe` events.
 */
export interface LfPhotoframeEventPayload
  extends LfEventPayload<"LfPhotoframe", LfPhotoframeEvent> {
  isPlaceholder?: boolean;
}
//#endregion

//#region States
/**
 * Utility type used by the `lf-photoframe` component.
 */
export type LfPhotoframeOrientation =
  (typeof LF_PHOTOFRAME_ORIENTATION)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-photoframe` component.
 */
export interface LfPhotoframePropsInterface {
  lfOverlay?: LfPhotoframeOverlay;
  lfPlaceholder?: Partial<LfFrameworkAllowedKeysMap>;
  lfStyle?: string;
  lfThreshold?: number;
  lfValue?: Partial<LfFrameworkAllowedKeysMap>;
}
/**
 * Utility interface used by the `lf-photoframe` component.
 */
export interface LfPhotoframeOverlay {
  description?: string;
  icon?: string;
  hideOnClick?: boolean;
  title?: string;
}
//#endregion

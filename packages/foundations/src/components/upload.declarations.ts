import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_UPLOAD_EVENTS } from "./upload.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-upload` component. It merges the shared component contract with the component-specific props.
 */
export interface LfUploadInterface
  extends LfComponent<"LfUpload">,
    LfUploadPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-upload`.
 */
export interface LfUploadElement
  extends HTMLStencilElement,
    Omit<LfUploadInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-upload`.
 */
export type LfUploadEvent = (typeof LF_UPLOAD_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-upload` events.
 */
export interface LfUploadEventPayload
  extends LfEventPayload<"LfUpload", LfUploadEvent> {
  selectedFiles: File[];
}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-upload` component.
 */
export interface LfUploadPropsInterface {
  lfLabel?: string;
  lfRipple?: boolean;
  lfStyle?: string;
  lfValue?: File[];
}
//#endregion

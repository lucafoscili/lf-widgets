import {
  HTMLStencilElement,
  LfComponent,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_UPLOAD_EVENTS } from "./upload.constants";

//#region Class
export interface LfUploadInterface
  extends LfComponent<"LfUpload">,
    LfUploadPropsInterface {}
export interface LfUploadElement
  extends HTMLStencilElement,
    LfUploadInterface {}
//#endregion

//#region Events
export type LfUploadEvent = (typeof LF_UPLOAD_EVENTS)[number];
export interface LfUploadEventPayload
  extends LfEventPayload<"LfUpload", LfUploadEvent> {
  selectedFiles: File[];
}
//#endregion

//#region Props
export interface LfUploadPropsInterface {
  lfLabel?: string;
  lfRipple?: boolean;
  lfStyle?: string;
  lfValue?: File[];
}
//#endregion

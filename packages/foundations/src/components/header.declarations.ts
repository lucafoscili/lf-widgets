import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_HEADER_EVENTS } from "./header.constants";

//#region Class
export interface LfHeaderInterface
  extends LfComponent<"LfHeader">,
    LfHeaderPropsInterface {}
export interface LfHeaderElement
  extends HTMLStencilElement,
    Omit<LfHeaderInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfHeaderEvent = (typeof LF_HEADER_EVENTS)[number];
export interface LfHeaderEventPayload
  extends LfEventPayload<"LfHeader", LfHeaderEvent> {}
//#endregion

//#region Props
export interface LfHeaderPropsInterface {
  lfStyle?: string;
}
//#endregion

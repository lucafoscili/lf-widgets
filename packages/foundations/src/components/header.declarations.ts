import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_HEADER_EVENTS } from "./header.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-header` component. It merges the shared component contract with the component-specific props.
 */
export interface LfHeaderInterface
  extends LfComponent<"LfHeader">,
    LfHeaderPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-header`.
 */
export interface LfHeaderElement
  extends HTMLStencilElement,
    Omit<LfHeaderInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-header`.
 */
export type LfHeaderEvent = (typeof LF_HEADER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-header` events.
 */
export interface LfHeaderEventPayload
  extends LfEventPayload<"LfHeader", LfHeaderEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-header` component.
 */
export interface LfHeaderPropsInterface {
  lfStyle?: string;
}
//#endregion

import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_SPINNER_EVENTS } from "./spinner.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-spinner` component. It merges the shared component contract with the component-specific props.
 */
export interface LfSpinnerInterface
  extends LfComponent<"LfSpinner">,
    LfSpinnerPropsInterface {
  getProgress(): Promise<number>;
}
/**
 * DOM element type for the custom element registered as `lf-spinner`.
 */
export interface LfSpinnerElement
  extends HTMLStencilElement,
    Omit<LfSpinnerInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-spinner`.
 */
export type LfSpinnerEvent = (typeof LF_SPINNER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-spinner` events.
 */
export interface LfSpinnerEventPayload
  extends LfEventPayload<"LfSpinner", LfSpinnerEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-spinner` component.
 */
export interface LfSpinnerPropsInterface {
  lfActive?: boolean;
  lfBarVariant?: boolean;
  lfDimensions?: string;
  lfFader?: boolean;
  lfFaderTimeout?: number;
  lfFullScreen?: boolean;
  lfLayout?: number;
  lfStyle?: string;
  lfTimeout?: number;
}
//#endregion

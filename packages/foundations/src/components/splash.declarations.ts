import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_SPLASH_EVENTS, LF_SPLASH_STATES } from "./splash.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-splash` component. It merges the shared component contract with the component-specific props.
 */
export interface LfSplashInterface
  extends LfComponent<"LfSplash">,
    LfSplashPropsInterface {}
/**
 * DOM element type for the custom element registered as `lf-splash`.
 */
export interface LfSplashElement
  extends HTMLStencilElement,
    Omit<LfSplashInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-splash`.
 */
export type LfSplashEvent = (typeof LF_SPLASH_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-splash` events.
 */
export interface LfSplashEventPayload
  extends LfEventPayload<"LfSplash", LfSplashEvent> {}
//#endregion

//#region States
/**
 * Union of state identifiers exported in `LF_SPLASH_STATES`.
 */
export type LfSplashStates = (typeof LF_SPLASH_STATES)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-splash` component.
 */
export interface LfSplashPropsInterface {
  lfLabel?: string;
  lfStyle?: string;
}
//#endregion

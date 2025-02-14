import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LF_SPLASH_EVENTS, LF_SPLASH_STATES } from "./splash.constants";

//#region Class
export interface LfSplashInterface
  extends LfComponent<"LfSplash">,
    LfSplashPropsInterface {}
export interface LfSplashElement
  extends HTMLStencilElement,
    Omit<LfSplashInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
export type LfSplashEvent = (typeof LF_SPLASH_EVENTS)[number];
export interface LfSplashEventPayload
  extends LfEventPayload<"LfSplash", LfSplashEvent> {}
//#endregion

//#region States
export type LfSplashStates = (typeof LF_SPLASH_STATES)[number];
//#endregion

//#region Props
export interface LfSplashPropsInterface {
  lfLabel?: string;
  lfStyle?: string;
}
//#endregion

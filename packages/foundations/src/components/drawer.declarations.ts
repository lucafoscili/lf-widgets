import { HTMLStencilElement, LfComponent } from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import {
  LF_DRAWER_DISPLAYS,
  LF_DRAWER_EVENTS,
  LF_DRAWER_POSITIONS,
} from "./drawer.constants";

//#region Class
export interface LfDrawerInterface
  extends LfComponent<"LfDrawer">,
    LfDrawerPropsInterface {}
export interface LfDrawerElement
  extends HTMLStencilElement,
    LfDrawerInterface {}
//#endregion

//#region Events
export type LfDrawerEvent = (typeof LF_DRAWER_EVENTS)[number];
export interface LfDrawerEventPayload
  extends LfEventPayload<"LfDrawer", LfDrawerEvent> {}
//#endregion

//#region Props
export interface LfDrawerPropsInterface {
  lfDisplay?: LfDrawerDisplay;
  lfPosition?: LfDrawerPosition;
  lfResponsive?: number;
  lfStyle?: string;
  lfValue?: boolean;
}
export type LfDrawerDisplay = (typeof LF_DRAWER_DISPLAYS)[number];
export type LfDrawerPosition = (typeof LF_DRAWER_POSITIONS)[number];
//#endregion

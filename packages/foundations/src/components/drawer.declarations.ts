import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import {
  LF_DRAWER_DISPLAYS,
  LF_DRAWER_EVENTS,
  LF_DRAWER_POSITIONS,
} from "./drawer.constants";

//#region Class
/**
 * Primary interface implemented by the `lf-drawer` component. It merges the shared component contract with the component-specific props.
 */
export interface LfDrawerInterface
  extends LfComponent<"LfDrawer">,
    LfDrawerPropsInterface {
  close: () => Promise<void>;
  isOpened: () => Promise<boolean>;
  open: () => Promise<void>;
  toggle: () => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-drawer`.
 */
export interface LfDrawerElement
  extends HTMLStencilElement,
    Omit<LfDrawerInterface, LfComponentClassProperties> {}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-drawer`.
 */
export type LfDrawerEvent = (typeof LF_DRAWER_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-drawer` events.
 */
export interface LfDrawerEventPayload
  extends LfEventPayload<"LfDrawer", LfDrawerEvent> {}
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-drawer` component.
 */
export interface LfDrawerPropsInterface {
  lfDisplay?: LfDrawerDisplay;
  lfPosition?: LfDrawerPosition;
  lfResponsive?: number;
  lfStyle?: string;
  lfValue?: boolean;
}
/**
 * Utility type used by the `lf-drawer` component.
 */
export type LfDrawerDisplay = (typeof LF_DRAWER_DISPLAYS)[number];
/**
 * Utility type used by the `lf-drawer` component.
 */
export type LfDrawerPosition = (typeof LF_DRAWER_POSITIONS)[number];
//#endregion

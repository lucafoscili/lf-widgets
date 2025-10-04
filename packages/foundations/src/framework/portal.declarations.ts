import { LfFrameworkClickCb } from "./framework.declarations";
import { LF_PORTAL_PLACEMENTS } from "./portal.constants";

//#region Class
/**
 * Primary interface exposing the portal manager.
 */
export interface LfPortalInterface {
  close: (element: HTMLElement) => void;
  getState: (element: HTMLElement) => LfPortalState | undefined;
  isInPortal: (element: HTMLElement) => boolean;
  open: (
    element: HTMLElement,
    parent: HTMLElement,
    anchor?: LfPortalAnchor,
    margin?: number,
    placement?: LfPortalPlacements,
  ) => void;
}
//#endregion

//#region Utilities
/**
 * Utility type used by the portal manager.
 */
export type LfPortalAnchor = HTMLElement | LfPortalCoordinates;
/**
 * Utility interface used by the portal manager.
 */
export interface LfPortalState {
  anchor: LfPortalAnchor;
  dismissCb: LfFrameworkClickCb;
  margin: number;
  parent: HTMLElement;
  placement: LfPortalPlacements;
}
/**
 * Utility interface used by the portal manager.
 */
export interface LfPortalCoordinates {
  x: number;
  y: number;
}
/**
 * Utility type used by the portal manager.
 */
export type LfPortalPlacement = keyof typeof LF_PORTAL_PLACEMENTS;
/**
 * Utility type used by the portal manager.
 */
export type LfPortalPlacements =
  (typeof LF_PORTAL_PLACEMENTS)[LfPortalPlacement];
//#endregion

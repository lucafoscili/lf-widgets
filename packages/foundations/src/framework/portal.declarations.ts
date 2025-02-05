import { LfCoreClickCb } from "./core.declarations";
import { LF_PORTAL_PLACEMENTS } from "./portal.constants";

//#region Class
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
export type LfPortalAnchor = HTMLElement | LfPortalCoordinates;
export interface LfPortalState {
  anchor: LfPortalAnchor;
  dismissCb: LfCoreClickCb;
  margin: number;
  parent: HTMLElement;
  placement: LfPortalPlacements;
}
export interface LfPortalCoordinates {
  x: number;
  y: number;
}
export type LfPortalPlacement = keyof typeof LF_PORTAL_PLACEMENTS;
export type LfPortalPlacements =
  (typeof LF_PORTAL_PLACEMENTS)[LfPortalPlacement];
//#endregion

import { LfFrameworkClickCb } from "./framework.declarations";
import { LF_PORTAL_PLACEMENTS } from "./portal.constants";

//#region Class
/**
 * Primary interface exposing the portal manager.
 */
export interface LfPortalInterface {
  /** Removes the element from the portal and restores its parent. */
  close: (element: HTMLElement) => void;
  /** Returns the portal state for the element if it is active. */
  getState: (element: HTMLElement) => LfPortalState | undefined;
  /** Indicates whether the element is currently hosted in the portal wrapper. */
  isInPortal: (element: HTMLElement) => boolean;
  /** Moves an element into the portal layer with optional anchor, margin, and placement. */
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
/** Anchor element or coordinates driving portal positioning. */
export type LfPortalAnchor = HTMLElement | LfPortalCoordinates;
/**
 * Utility interface used by the portal manager.
 */
export interface LfPortalState {
  /** Anchor element or coordinates driving positioning. */
  anchor: LfPortalAnchor;
  /** Click-away callback registered to dismiss the portal. */
  dismissCb: LfFrameworkClickCb;
  /** Margin applied when positioning relative to the anchor. */
  margin: number;
  /** Original parent the element is returned to on close. */
  parent: HTMLElement;
  /** Preferred placement string (auto, top-left, etc.). */
  placement: LfPortalPlacements;
}
/** Explicit viewport coordinates used as an anchor fallback. */
export interface LfPortalCoordinates {
  /** X coordinate in viewport space. */
  x: number;
  /** Y coordinate in viewport space. */
  y: number;
}
/** Keys available in the placement constants map (tl, br, auto, etc.). */
export type LfPortalPlacement = keyof typeof LF_PORTAL_PLACEMENTS;
/**
 * Utility type used by the portal manager.
 */
export type LfPortalPlacements =
  (typeof LF_PORTAL_PLACEMENTS)[LfPortalPlacement];
//#endregion

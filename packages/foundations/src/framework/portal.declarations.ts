import { LfFrameworkClickCb } from "./framework.declarations";
import {
  LF_PORTAL_PLACEMENTS,
  LF_PORTAL_POSITION_STRATEGIES,
} from "./portal.constants";

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
    options?: LfPortalOptions,
  ) => void;
  /** Force recalculation of portal position. */
  recalculate: (element: HTMLElement) => void;
}
//#endregion

//#region Options
/**
 * Configuration options for portal behavior.
 */
export interface LfPortalOptions {
  /**
   * Disable automatic click-away dismissal.
   * When true, the portal will not close when clicking outside.
   * Useful for modal dialogs or persistent panels.
   * @default false
   */
  disableClickAway?: boolean;
  /**
   * CSS class to add when the portal enters (for animations).
   * The class is added immediately when the portal opens.
   * @example "fade-in"
   */
  enterClass?: string;
  /**
   * CSS class to add when the portal exits (for animations).
   * The class is added before closing, with a delay for the animation.
   * @example "fade-out"
   */
  exitClass?: string;
  /**
   * Duration to wait for exit animation before removing element (ms).
   * Only used when exitClass is specified.
   * @default 0
   */
  exitDuration?: number;
  /**
   * Fullscreen mode - element covers entire viewport.
   * When true, ignores anchor positioning and uses fixed positioning at 100vw/100vh.
   * @default false
   */
  fullscreen?: boolean;
  /**
   * Override max-height for the portal element (CSS value).
   * @example "300px" or "50vh"
   */
  maxHeight?: string;
  /**
   * Override max-width for the portal element (CSS value).
   * @example "400px" or "80vw"
   */
  maxWidth?: string;
  /**
   * Position strategy for the portal element.
   * - 'absolute': Document-relative, scrolls with page naturally (default for element anchors)
   * - 'fixed': Viewport-relative, stays fixed on screen (default for coordinate anchors)
   * @default auto-detected based on anchor type
   */
  positionStrategy?: LfPortalPositionStrategy;
  /**
   * Whether to recalculate position on window resize.
   * @default false
   */
  recalculateOnResize?: boolean;
  /**
   * Scrollable container to watch for scroll events.
   * When specified, portal position recalculates on container scroll.
   * Useful for portals anchored to elements inside scrollable containers.
   */
  scrollContainer?: HTMLElement;
  /**
   * Watch the anchor element for size/position changes using ResizeObserver.
   * Automatically recalculates position when anchor changes.
   * @default false
   */
  watchAnchor?: boolean;
  /**
   * Custom z-index for the portal.
   * - If a number, uses that exact value
   * - If 'auto', assigns an auto-incrementing z-index (useful for nested portals)
   * @default uses CSS variable --lf-ui-zindex-portal
   */
  zIndex?: number | "auto";
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
  /** ResizeObserver watching the anchor element (if watchAnchor is true). */
  anchorObserver?: ResizeObserver;
  /** Click-away callback registered to dismiss the portal. */
  dismissCb: LfFrameworkClickCb | null;
  /** Margin applied when positioning relative to the anchor. */
  margin: number;
  /** Portal configuration options. */
  options: LfPortalOptions;
  /** Original parent the element is returned to on close. */
  parent: HTMLElement;
  /** Preferred placement string (auto, top-left, etc.). */
  placement: LfPortalPlacements;
  /** Scroll handler for scrollContainer option. */
  scrollHandler?: () => void;
  /** Assigned z-index value (for auto-increment tracking). */
  zIndex?: number;
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
/** Position strategy key type. */
export type LfPortalPositionStrategyKey =
  keyof typeof LF_PORTAL_POSITION_STRATEGIES;
/** Position strategy value type. */
export type LfPortalPositionStrategy =
  (typeof LF_PORTAL_POSITION_STRATEGIES)[LfPortalPositionStrategyKey];
//#endregion

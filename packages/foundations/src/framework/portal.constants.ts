//#region Placements
export const LF_PORTAL_PLACEMENTS = {
  auto: "auto",
  bottom: "b",
  bottomLeft: "bl",
  bottomRight: "br",
  left: "l",
  right: "r",
  top: "t",
  topLeft: "tl",
  topRight: "tr",
} as const;
//#endregion

//#region Position Strategies
export const LF_PORTAL_POSITION_STRATEGIES = {
  /** Document-relative positioning - scrolls with page naturally */
  absolute: "absolute",
  /** Viewport-relative positioning - stays fixed on screen */
  fixed: "fixed",
} as const;
//#endregion

//#region Default Options
export const LF_PORTAL_DEFAULT_OPTIONS: {
  disableClickAway: boolean;
  enterClass: undefined;
  exitClass: undefined;
  exitDuration: number;
  fullscreen: boolean;
  maxHeight: undefined;
  maxWidth: undefined;
  positionStrategy: undefined;
  recalculateOnResize: boolean;
  scrollContainer: undefined;
  watchAnchor: boolean;
  zIndex: undefined;
} = {
  /** Disable click-away dismissal */
  disableClickAway: false,
  /** CSS class for enter animation */
  enterClass: undefined,
  /** CSS class for exit animation */
  exitClass: undefined,
  /** Duration to wait for exit animation (ms) */
  exitDuration: 0,
  /** Fullscreen mode - element covers entire viewport */
  fullscreen: false,
  /** Override max-height */
  maxHeight: undefined,
  /** Override max-width */
  maxWidth: undefined,
  /** Position strategy - auto-detected based on anchor type if undefined */
  positionStrategy: undefined,
  /** Whether to recalculate position on window resize */
  recalculateOnResize: false,
  /** Scrollable container to watch */
  scrollContainer: undefined,
  /** Watch anchor element for changes */
  watchAnchor: false,
  /** Custom z-index */
  zIndex: undefined,
};
//#endregion

//#region Z-Index
/** Base z-index for auto-incrementing portal layers */
export const LF_PORTAL_BASE_ZINDEX = 1000;
//#endregion

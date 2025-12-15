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
  recalculateOnResize: boolean;
  positionStrategy: undefined;
  fullscreen: boolean;
} = {
  /** Whether to recalculate position on window resize */
  recalculateOnResize: false,
  /** Position strategy - auto-detected based on anchor type if undefined */
  positionStrategy: undefined,
  /** Fullscreen mode - element covers entire viewport */
  fullscreen: false,
};
//#endregion

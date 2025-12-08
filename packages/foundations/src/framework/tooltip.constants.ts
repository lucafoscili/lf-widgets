//#region Attributes
/**
 * Data attributes for tooltip functionality.
 */
export const LF_TOOLTIP_ATTRIBUTES = {
  /** Attribute to mark an element as a tooltip anchor */
  anchor: "data-lf-tooltip",
  /** Attribute to store the tooltip content */
  content: "data-lf-tooltip-content",
} as const;

/**
 * CSS class names for tooltip elements.
 */
export const LF_TOOLTIP_CLASSES = {
  /** Arrow element class */
  arrow: "lf-tooltip__arrow",
  /** Root tooltip element class */
  tooltip: "lf-tooltip",
  /** Visible state modifier */
  visible: "lf-tooltip--visible",
} as const;
//#endregion

//#region Defaults
/**
 * Default configuration values for tooltip behavior.
 */
export const LF_TOOLTIP_DEFAULTS = {
  /** Delay before hiding tooltip (ms) */
  hideDelay: 100,
  /** Offset from anchor element (px) */
  offset: 8,
  /** Default placement */
  placement: "top" as const,
  /** Delay before showing tooltip (ms) */
  showDelay: 300,
} as const;
//#endregion

//#region Placement
/**
 * Available tooltip placement options.
 */
export const LF_TOOLTIP_PLACEMENTS = [
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
  "top",
  "top-start",
  "top-end",
] as const;
//#endregion

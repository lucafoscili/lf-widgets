import { LF_TOOLTIP_PLACEMENTS } from "./tooltip.constants";

//#region Placement
/**
 * Available tooltip placement options.
 */
export type LfTooltipPlacement = (typeof LF_TOOLTIP_PLACEMENTS)[number];
//#endregion

//#region Options
/**
 * Configuration options for tooltip registration.
 */
export interface LfTooltipOptions {
  /**
   * The text content to display in the tooltip.
   */
  content: string;
  /**
   * Delay before hiding the tooltip in milliseconds.
   * @default 100
   */
  hideDelay?: number;
  /**
   * Offset from the anchor element in pixels.
   * @default 8
   */
  offset?: number;
  /**
   * Placement of the tooltip relative to the anchor element.
   * @default "top"
   */
  placement?: LfTooltipPlacement;
  /**
   * Delay before showing the tooltip in milliseconds.
   * @default 300
   */
  showDelay?: number;
}
/**
 * Resolved options with all defaults applied.
 */
export type LfTooltipResolvedOptions = Required<LfTooltipOptions>;
//#endregion

//#region Element Data
/**
 * Internal data tracked for each registered tooltip anchor.
 */
export interface LfTooltipElementData {
  /** Handler for blur events */
  blurHandler: (e: FocusEvent) => void;
  /** Handler for mouseenter events */
  enterHandler: (e: MouseEvent) => void;
  /** Handler for focus events */
  focusHandler: (e: FocusEvent) => void;
  /** Handler for mouseleave events */
  leaveHandler: (e: MouseEvent) => void;
  /** Timeout ID for delayed hide */
  hideTimeoutId?: ReturnType<typeof setTimeout>;
  /** Resolved options for this tooltip */
  options: LfTooltipResolvedOptions;
  /** Timeout ID for delayed show */
  showTimeoutId?: ReturnType<typeof setTimeout>;
}
//#endregion

//#region Interface
/**
 * Public interface for the tooltip service.
 * Provides fire-and-forget registration pattern similar to effects.
 */
export interface LfTooltipInterface {
  /**
   * Programmatically hides the tooltip for an element.
   *
   * @param element - The anchor element to hide the tooltip for
   */
  hide: (element: HTMLElement) => void;
  /**
   * Hides all visible tooltips.
   */
  hideAll: () => void;
  /**
   * Checks if an element has a tooltip registered.
   *
   * @param element - The element to check
   * @returns true if the element has a registered tooltip
   */
  isRegistered: (element: HTMLElement) => boolean;
  /**
   * Registers a tooltip on an anchor element.
   * The tooltip will automatically show/hide on hover and focus.
   *
   * @param element - The anchor element to attach the tooltip to
   * @param options - Configuration options for the tooltip
   */
  register: (element: HTMLElement, options: LfTooltipOptions) => void;
  /**
   * Programmatically shows the tooltip for an element.
   *
   * @param element - The anchor element to show the tooltip for
   */
  show: (element: HTMLElement) => void;
  /**
   * Unregisters a tooltip from an anchor element.
   * Removes all event listeners and cleans up resources.
   *
   * @param element - The anchor element to remove the tooltip from
   */
  unregister: (element: HTMLElement) => void;
  /**
   * Updates the content of an existing tooltip.
   *
   * @param element - The anchor element with the tooltip
   * @param content - The new content to display
   */
  updateContent: (element: HTMLElement, content: string) => void;
}
//#endregion

import { LfCompareAdapterControllerComputed } from "@lf-widgets/foundations";

/**
 * Factory for creating computed controller values for lf-compare.
 *
 * Computed values are derived from state and are pure functions with no side effects.
 *
 * @param getSliderPosition - Getter for current slider position (0-100)
 * @param getView - Getter for current view mode
 * @param hasShapes - Predicate checking if shapes are available
 * @returns Computed controller interface
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const createComputed = (
  getSliderPosition: () => number,
  getView: () => string,
  hasShapes: () => boolean,
): LfCompareAdapterControllerComputed => {
  return {
    /**
     * Whether the current view is overlay mode.
     * Overlay mode shows images stacked with a slider to reveal/hide.
     */
    isOverlay: () => getView() === "main",

    /**
     * Whether the slider is at the start position (0).
     * At start, the left image is fully visible.
     */
    isAtStart: () => getSliderPosition() === 0,

    /**
     * Whether the slider is at the end position (100).
     * At end, the right image is fully visible.
     */
    isAtEnd: () => getSliderPosition() === 100,

    /**
     * Whether there are shapes available to compare.
     */
    hasShapes,
  };
};

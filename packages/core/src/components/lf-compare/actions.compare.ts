import { LfCompareAdapterControllerActions } from "@lf-widgets/foundations";

/**
 * Factory for creating action controller methods for lf-compare.
 *
 * Actions are multi-step operations that may have side effects,
 * toggle state, or batch multiple changes.
 *
 * @param toggleLeftPanel - Toggle left panel visibility
 * @param toggleRightPanel - Toggle right panel visibility
 * @param setSliderPosition - Set slider position with CSS variable update
 * @returns Actions controller interface
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const createActions = (
  toggleLeftPanel: () => void,
  toggleRightPanel: () => void,
  setSliderPosition: (
    position: number,
    updateCss: (value: number) => void,
  ) => void,
  updateCssVariable: (value: number) => void,
): LfCompareAdapterControllerActions => {
  return {
    /**
     * Toggle left panel visibility.
     */
    toggleLeftPanel,

    /**
     * Toggle right panel visibility.
     */
    toggleRightPanel,

    /**
     * Set slider position with bounds checking (clamps 0-100).
     * Also updates the CSS variable for the overlay width.
     */
    setPositionWithBounds: (position: number) => {
      const clampedPosition = Math.max(0, Math.min(100, position));
      setSliderPosition(clampedPosition, updateCssVariable);
    },
  };
};

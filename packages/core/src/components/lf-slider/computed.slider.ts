import {
  LfSliderAdapter,
  LfSliderAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-slider.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepSliderComputed = (
  getAdapter: () => LfSliderAdapter,
): LfSliderAdapterControllerComputed => ({
  /**
   * Whether the slider is disabled based on lfUiState.
   * Used to control pointer-events and aria-disabled.
   */
  isDisabled: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfUiState === "disabled";
  },

  /**
   * Calculates the percentage of current value within min/max range.
   * Used for CSS custom property to position the thumb.
   */
  valuePercentage: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    const { lfMin, lfMax, value } = comp;
    return ((value.display - lfMin) / (lfMax - lfMin)) * 100;
  },

  /**
   * Normalizes a value to be within min/max bounds.
   * Clamps the value and respects step increments.
   */
  normalizeValue: (value: number) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    const { lfMin, lfMax, lfStep } = comp;

    // Clamp to bounds
    let normalized = Math.max(lfMin, Math.min(lfMax, value));

    // Snap to step
    if (lfStep > 0) {
      normalized = Math.round((normalized - lfMin) / lfStep) * lfStep + lfMin;
    }

    return normalized;
  },
});

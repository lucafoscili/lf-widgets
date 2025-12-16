import {
  LfSliderAdapter,
  LfSliderAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-slider.
 *
 * "Adapter as Core" Architecture:
 * - Computed values read internal state via `controller.get.value()`
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping computed logic separate
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
   * Reads from adapter's internal state via the getter.
   */
  valuePercentage: () => {
    const adapter = getAdapter();
    const { compInstance, value } = adapter.controller.get;
    const comp = compInstance();
    const { lfMin, lfMax } = comp;
    const currentValue = value();
    return ((currentValue.display - lfMin) / (lfMax - lfMin)) * 100;
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

import {
  LfSliderAdapter,
  LfSliderAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-slider.
 *
 * "Adapter as Core" Architecture:
 * - Actions read internal state via `controller.get.value()`
 * - Actions write via `controller.set.value()` which triggers onStateChange
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping action logic separate
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepSliderActions = (
  getAdapter: () => LfSliderAdapter,
): LfSliderAdapterControllerActions => ({
  /**
   * Sets the slider value (both display and real).
   * Used when the user releases the slider or directly sets a value.
   * Reads current state via getter, writes via setter.
   * The setter handles disabled check and triggers re-render.
   */
  setValue: (value: number) => {
    const adapter = getAdapter();
    adapter.controller.set.value({ display: value, real: value });
  },

  /**
   * Updates only the display value.
   * Used during drag operations to show preview without committing.
   * Reads current state via getter, writes via setter.
   */
  setDisplayValue: (value: number) => {
    const adapter = getAdapter();
    const currentValue = adapter.controller.get.value();
    adapter.controller.set.value({ ...currentValue, display: value });
  },
});

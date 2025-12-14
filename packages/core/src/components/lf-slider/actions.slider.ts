import {
  LfSliderAdapter,
  LfSliderAdapterControllerActions,
} from "@lf-widgets/foundations";
import { forceUpdate } from "@stencil/core";

/**
 * Factory to create action functions for lf-slider.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
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
   */
  setValue: (value: number) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    comp.value = { display: value, real: value };
    forceUpdate(comp);
  },

  /**
   * Updates only the display value.
   * Used during drag operations to show preview without committing.
   */
  setDisplayValue: (value: number) => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    comp.value = { ...comp.value, display: value };
    forceUpdate(comp);
  },
});

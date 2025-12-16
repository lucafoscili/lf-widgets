import {
  LfToggleAdapter,
  LfToggleAdapterControllerActions,
  LfToggleState,
} from "@lf-widgets/foundations";

/**
 * Prepares actions for the toggle adapter.
 *
 * "Adapter as Core" Architecture:
 * - Actions read internal state via `controller.get.value()`
 * - Actions write via `controller.set.value()` which triggers onStateChange
 * - The actual state lives in the adapter factory's closure
 * - This file maintains SoC by keeping action logic separate
 *
 * @param getAdapter - Function to retrieve the current adapter instance
 * @returns Actions object with complex operations
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepToggleActions = (
  getAdapter: () => LfToggleAdapter,
): LfToggleAdapterControllerActions => ({
  /**
   * Toggle between "on" and "off".
   * Reads current state via getter, writes via setter.
   * The setter handles disabled check and triggers re-render.
   */
  toggle: () => {
    const adapter = getAdapter();
    const currentValue = adapter.controller.get.value();
    const newValue: LfToggleState = currentValue === "on" ? "off" : "on";
    adapter.controller.set.value(newValue);
  },
});

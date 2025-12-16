import {
  LfButtonAdapter,
  LfButtonAdapterControllerActions,
  LfButtonState,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-button.
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
export const prepButtonActions = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterControllerActions => ({
  /**
   * Controls dropdown list visibility.
   * Multi-step portal operation with open/close/toggle logic.
   */
  list: (state = "toggle") => {
    const adapter = getAdapter();
    const { controller, elements } = adapter;
    const { framework } = controller.get;
    const { dropdown, list } = elements.refs;

    const { close, isInPortal, open } = framework().portal;

    switch (state) {
      case "close":
        close(list);
        break;
      case "open":
        open(list, dropdown);
        break;
      default:
        if (isInPortal(list)) {
          close(list);
        } else {
          open(list, dropdown);
        }
        break;
    }
  },

  /**
   * Toggles the button state between "on" and "off".
   * Reads current state via getter, writes via setter.
   * The setter handles toggable check, disabled check, and triggers re-render.
   */
  toggle: () => {
    const adapter = getAdapter();
    const currentValue = adapter.controller.get.value();
    const newValue: LfButtonState = currentValue === "on" ? "off" : "on";
    adapter.controller.set.value(newValue);
  },
});

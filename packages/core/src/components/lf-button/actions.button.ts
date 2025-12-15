import {
  LfButtonAdapter,
  LfButtonAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-button.
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
   * Only works when:
   * - lfToggable is true
   * - Button is not disabled
   */
  toggle: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    if (comp.lfToggable && comp.lfUiState !== "disabled") {
      comp.value = comp.value === "on" ? "off" : "on";
    }
  },
});

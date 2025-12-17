import {
  LfSplashAdapter,
  LfSplashAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-splash.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * In "Adapter as Core" pattern, actions use controller.set.* to mutate
 * adapter's internal state, which triggers onStateChange for re-renders.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepSplashActions = (
  getAdapter: () => LfSplashAdapter,
): LfSplashAdapterControllerActions => ({
  /**
   * Initiates the unmount sequence.
   * Sets state to "unmounting" after initial delay, then removes element.
   *
   * @param ms - Delay before starting unmount sequence (default: 575ms)
   */
  unmount: (ms: number = 575) => {
    const adapter = getAdapter();
    const { set } = adapter.controller;
    const { compInstance } = adapter.controller.get;

    setTimeout(() => {
      // Set state to unmounting - triggers re-render for fade animation
      set.state("unmounting");

      // After animation completes, emit event and remove element
      setTimeout(() => {
        adapter.dispatcher.emit("unmount");
        compInstance().rootElement.remove();
      }, 300);
    }, ms);
  },
});

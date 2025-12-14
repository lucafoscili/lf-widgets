import {
  LfSpinnerAdapter,
  LfSpinnerAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-spinner.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @param state - Mutable state object for animation frame and timer references
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepSpinnerActions = (
  getAdapter: () => LfSpinnerAdapter,
  state: {
    progressAnimationFrame: number | null;
    faderTimer: number | null;
  },
): LfSpinnerAdapterControllerActions => ({
  /**
   * Starts the progress bar animation.
   * Updates progress from 0 to 100 over the lfTimeout duration.
   */
  startProgressBar: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    comp.progress = 0;
    const startTime = Date.now();
    const duration = comp.lfTimeout;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      comp.progress = Math.min((elapsed / duration) * 100, 100);

      if (comp.progress < 100) {
        state.progressAnimationFrame = requestAnimationFrame(updateProgress);
      } else {
        if (state.progressAnimationFrame !== null) {
          cancelAnimationFrame(state.progressAnimationFrame);
          state.progressAnimationFrame = null;
        }
      }
    };

    state.progressAnimationFrame = requestAnimationFrame(updateProgress);
  },

  /**
   * Cancels the progress bar animation.
   * Resets progress to 0 and cancels any pending animation frame.
   */
  cancelProgressBar: () => {
    const { compInstance } = getAdapter().controller.get;

    compInstance().progress = 0;
    if (state.progressAnimationFrame !== null) {
      cancelAnimationFrame(state.progressAnimationFrame);
      state.progressAnimationFrame = null;
    }
  },

  /**
   * Schedules the fader timeout.
   * After lfFaderTimeout ms, sets bigWait to true to show the fader overlay.
   */
  scheduleFader: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();

    // Clear existing timer
    if (state.faderTimer !== null) {
      clearTimeout(state.faderTimer);
      state.faderTimer = null;
    }

    comp.bigWait = false;
    if (comp.lfFader && comp.lfActive) {
      state.faderTimer = window.setTimeout(() => {
        comp.bigWait = true;
      }, comp.lfFaderTimeout);
    }
  },

  /**
   * Clears the fader timeout.
   * Used during cleanup to prevent memory leaks.
   */
  clearFaderTimer: () => {
    if (state.faderTimer !== null) {
      clearTimeout(state.faderTimer);
      state.faderTimer = null;
    }
  },
});

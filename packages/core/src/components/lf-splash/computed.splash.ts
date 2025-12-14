import {
  LfSplashAdapter,
  LfSplashAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-splash.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepSplashComputed = (
  getAdapter: () => LfSplashAdapter,
): LfSplashAdapterControllerComputed => ({
  /**
   * Whether the splash is in unmounting state.
   * Used to control animation and label display.
   */
  isUnmounting: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().state === "unmounting";
  },
});

import {
  LfToastAdapter,
  LfToastAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-toast.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepToastComputed = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterControllerComputed => ({
  /**
   * Whether the toast has a close icon.
   * Used to determine if close button should render.
   */
  hasCloseIcon: () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().lfCloseIcon);
  },

  /**
   * Whether the toast has an icon.
   * Used to determine if icon section should render.
   */
  hasIcon: () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().lfIcon);
  },

  /**
   * Whether the toast has a timer.
   * Used to determine if auto-close behavior should be enabled.
   */
  hasTimer: () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().lfTimer);
  },
});

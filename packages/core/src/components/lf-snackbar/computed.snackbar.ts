import {
  LfSnackbarAdapter,
  LfSnackbarAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-snackbar.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepSnackbarComputed = (
  getAdapter: () => LfSnackbarAdapter,
): LfSnackbarAdapterControllerComputed => ({
  /**
   * Whether the snackbar has an action button.
   * Determines if the action button should render.
   */
  hasAction: () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().lfAction);
  },

  /**
   * Whether the snackbar has a close icon.
   * Determines if the close button should render.
   */
  hasCloseIcon: () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().lfCloseIcon);
  },

  /**
   * Whether the snackbar has an icon.
   * Determines if the icon section should render.
   */
  hasIcon: () => {
    const { compInstance } = getAdapter().controller.get;
    return Boolean(compInstance().lfIcon);
  },
});

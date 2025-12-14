import {
  LfDrawerAdapter,
  LfDrawerAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-drawer.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepDrawerComputed = (
  getAdapter: () => LfDrawerAdapter,
): LfDrawerAdapterControllerComputed => ({
  /**
   * Whether the drawer is currently open.
   * Based on lfValue prop.
   */
  isOpen: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfValue === true;
  },

  /**
   * Whether the drawer is in responsive mode.
   * True when lfResponsive > 0.
   */
  isResponsive: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfResponsive > 0;
  },

  /**
   * Whether the drawer is in slide (modal) display mode.
   */
  isSlide: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfDisplay === "slide";
  },

  /**
   * Whether the drawer is in dock (fixed) display mode.
   */
  isDock: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfDisplay === "dock";
  },

  /**
   * Whether the drawer should show as modal (slide mode + open).
   * Used for aria-modal and backdrop visibility.
   */
  isModal: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    return comp.lfDisplay === "slide" && comp.lfValue === true;
  },
});

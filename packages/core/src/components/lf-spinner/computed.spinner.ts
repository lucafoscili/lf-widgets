import {
  LfSpinnerAdapter,
  LfSpinnerAdapterControllerComputed,
} from "@lf-widgets/foundations";
import { LF_SPINNER_BARS } from "./helpers.bar";
import { LF_SPINNER_WIDGETS } from "./helpers.widget";

/**
 * Factory to create computed predicates for lf-spinner.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepSpinnerComputed = (
  getAdapter: () => LfSpinnerAdapter,
): LfSpinnerAdapterControllerComputed => ({
  /**
   * Whether the spinner is displaying the bar variant.
   * Used to determine which helper to use for rendering.
   */
  isBarVariant: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfBarVariant;
  },

  /**
   * Whether the fader overlay should be displayed.
   * Based on bigWait state, which is set after faderTimeout.
   */
  showFader: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().bigWait;
  },

  /**
   * Get the spinner configuration based on variant and layout.
   * Returns the appropriate config from helpers.bar or helpers.widget.
   */
  getConfig: () => {
    const { compInstance } = getAdapter().controller.get;
    const { lfBarVariant, lfLayout } = compInstance();

    return lfBarVariant
      ? LF_SPINNER_BARS[lfLayout]
      : LF_SPINNER_WIDGETS[lfLayout];
  },

  /**
   * Get the wrapper class based on variant.
   * Returns different wrapper class for bar vs widget spinner.
   */
  getWrapperClass: () => {
    const { compInstance } = getAdapter().controller.get;
    return compInstance().lfBarVariant
      ? "loading-wrapper-master-bar"
      : "loading-wrapper-master-spinner";
  },

  /**
   * Get the master element classes.
   * Includes spinner-version and loading-wrapper-big-wait classes.
   */
  getMasterClass: () => {
    const { compInstance } = getAdapter().controller.get;
    const { lfBarVariant, bigWait } = compInstance();

    return {
      "spinner-version": !lfBarVariant,
      "loading-wrapper-big-wait": bigWait,
    };
  },
});

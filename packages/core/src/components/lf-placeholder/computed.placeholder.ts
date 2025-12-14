import {
  LfPlaceholderAdapter,
  LfPlaceholderAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-placeholder.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepPlaceholderComputed = (
  getAdapter: () => LfPlaceholderAdapter,
): LfPlaceholderAdapterControllerComputed => ({
  /**
   * Whether the placeholder should render the actual component.
   * Based on trigger conditions (viewport, props, or both).
   */
  shouldRender: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    const { isInViewport, lfProps, lfTrigger } = comp;

    return Boolean(
      (lfTrigger === "viewport" && isInViewport) ||
        (lfTrigger === "props" && lfProps) ||
        (lfTrigger === "both" && lfProps && isInViewport),
    );
  },
});

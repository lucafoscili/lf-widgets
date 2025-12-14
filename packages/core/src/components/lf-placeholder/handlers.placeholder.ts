import {
  LfPlaceholderAdapter,
  LfPlaceholderAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the placeholder component.
 *
 * v4.0.0 Architecture:
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepPlaceholderHandlers = (
  getAdapter: () => LfPlaceholderAdapter,
): LfPlaceholderAdapterHandlers => {
  return {
    component: (e) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;

      dispatcher.emit("lf-event", { originalEvent: e });
    },
  };
};

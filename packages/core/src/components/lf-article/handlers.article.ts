import {
  LfArticleAdapter,
  LfArticleAdapterHandlers,
  LfEvent,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the article component.
 *
 * v4.0.0 Architecture:
 * - Routes LfShape events through dispatcher as lf-event
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepArticleHandlers = (
  getAdapter: () => LfArticleAdapter,
): LfArticleAdapterHandlers => {
  return {
    /**
     * Forwards LfShape events through the component's lf-event emission.
     * This allows parent components to listen to shape interactions.
     */
    shape: async (e: LfEvent) => {
      const adapter = getAdapter();
      const { dispatcher } = adapter;

      dispatcher.emit("lf-event", { originalEvent: e });
    },
  };
};

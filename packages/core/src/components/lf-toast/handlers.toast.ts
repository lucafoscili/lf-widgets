import {
  LfToastAdapter,
  LfToastAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the toast component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (close)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepToastHandlers = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterHandlers => {
  return {
    /**
     * Handler for the close button pointer down event.
     * Triggers the close action.
     */
    closeButton: (e: PointerEvent) => {
      const adapter = getAdapter();
      const { actions } = adapter.controller;

      actions.close(e);
    },
  };
};

import {
  LfSnackbarAdapter,
  LfSnackbarAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the snackbar component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (close)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepSnackbarHandlers = (
  getAdapter: () => LfSnackbarAdapter,
): LfSnackbarAdapterHandlers => {
  return {
    /**
     * Handles action button click.
     * Emits action event and invokes the action callback.
     */
    action: (e) => {
      e.stopPropagation();
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const { compInstance } = controller.get;

      const comp = compInstance();
      dispatcher.emit("action", { originalEvent: e });
      comp.lfActionCallback?.(comp, e);
    },

    /**
     * Handles close button click.
     * Emits close event and unmounts the snackbar.
     */
    close: (e) => {
      e.stopPropagation();
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const { actions } = controller;

      dispatcher.emit("close", { originalEvent: e });
      actions.close();
    },
  };
};

import {
  LfButtonAdapter,
  LfButtonAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the button component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.actions` for complex operations (toggle, list)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepButtonHandlers = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterHandlers => {
  return {
    list: (e) => {
      const { eventType } = e.detail;
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const { actions } = controller;

      switch (eventType) {
        case "click":
          actions.list("close");
          dispatcher.emit("lf-event", { originalEvent: e });
          break;
      }
    },
  };
};

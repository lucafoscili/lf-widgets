import {
  LfButtonAdapter,
  LfButtonAdapterHandlers,
} from "@lf-widgets/foundations";

/**
 * Prepares event handlers for the button component.
 * Uses dispatcher for event emission (see Section 5.3 of 4_0_0_REFACTORING.md).
 */
export const prepButtonHandlers = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterHandlers => {
  return {
    list: (e) => {
      const { eventType } = e.detail;
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;
      const { set } = controller;

      switch (eventType) {
        case "click":
          dispatcher.emit("lf-event", { originalEvent: e });
          set.list("close");
          break;
      }
    },
  };
};

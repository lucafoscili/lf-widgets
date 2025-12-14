import {
  LfListEventPayload,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterHandlers,
} from "@lf-widgets/foundations";
import { LfShapeeditor } from "./lf-shapeeditor";

export const prepPreviewHandlers = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterHandlers["preview"] => {
  return {
    //#region History list handler
    historyList: async (e) => {
      const adapter = getAdapter();
      const { compInstance, history } = adapter.controller.get;
      const { current } = history;
      const { set } = adapter.controller;

      const comp = compInstance() as LfShapeeditor;
      const { eventType, node } = e.detail as LfListEventPayload;

      switch (eventType) {
        case "click":
          // Navigate to selected history entry
          const selectedIndex = parseInt(node.id, 10);
          if (!isNaN(selectedIndex)) {
            set.history.index(selectedIndex);
          }
          break;
        case "delete":
          // Delete history entry
          const deleteIndex = parseInt(node.id, 10);
          if (!isNaN(deleteIndex)) {
            const currentHistory = current();
            if (currentHistory && currentHistory.length > 1) {
              // Remove the entry from history
              const currentIdx = history.index();
              currentHistory.splice(deleteIndex, 1);

              // Adjust historyIndex if needed
              if (deleteIndex <= currentIdx && currentIdx > 0) {
                set.history.index(currentIdx - 1);
              } else if (deleteIndex === currentIdx) {
                // If we deleted the current entry, move to previous or stay at 0
                set.history.index(Math.max(0, deleteIndex - 1));
              }
              // Trigger re-render
              comp.refresh();
            }
          }
          break;
      }

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion

    //#region Shape
    shape: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const comp = compInstance() as LfShapeeditor;

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion
  };
};

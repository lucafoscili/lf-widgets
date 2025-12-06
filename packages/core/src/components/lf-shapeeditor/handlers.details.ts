import {
  IDS,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterHandlers,
} from "@lf-widgets/foundations";
import {
  clearHistory,
  deleteShape,
  redo,
  save,
  toggleButtonSpinner,
  undo,
} from "./helpers.utils";
import { LfShapeeditor } from "./lf-shapeeditor";

export const prepDetailsHandlers = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterHandlers["details"] => {
  return {
    //#region Button handler
    button: async (e) => {
      const { comp, eventType, id } = e.detail;

      const adapter = getAdapter();
      const { compInstance, currentShape } = adapter.controller.get;

      const c = compInstance as LfShapeeditor;

      c.onLfEvent(e, "lf-event");

      switch (eventType) {
        case "click":
          switch (id) {
            case IDS.details.clearHistory:
              const index = currentShape().shape.index;
              const cb = async () => clearHistory(adapter, index);
              toggleButtonSpinner(comp, cb);
              break;
            case IDS.details.deleteShape:
              toggleButtonSpinner(comp, () => deleteShape(adapter));
              break;
            case IDS.details.redo:
              toggleButtonSpinner(comp, () => redo(adapter));
              break;

            case IDS.details.save:
              toggleButtonSpinner(comp, () => save(adapter));
              break;
            case IDS.details.undo:
              toggleButtonSpinner(comp, () => undo(adapter));
              break;
          }
      }
    },
    //#endregion

    //#region Shape handler
    shape: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const comp = compInstance as LfShapeeditor;

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion

    //#region Tree handler
    tree: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const comp = compInstance as LfShapeeditor;

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion
  };
};

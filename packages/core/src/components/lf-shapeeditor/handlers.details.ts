import {
  IDS,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterHandlers,
} from "@lf-widgets/foundations";
import {
  clearHistory,
  deleteShape,
  parseConfigDslFromNode,
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
    //#region Button
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

    //#region Shape
    shape: (e) => {
      const adapter = getAdapter();
      const { compInstance } = adapter.controller.get;

      const comp = compInstance as LfShapeeditor;

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion

    //#region Tree
    tree: (e) => {
      const adapter = getAdapter();
      const { compInstance, manager } = adapter.controller.get;

      const comp = compInstance as LfShapeeditor;

      const { data } = manager;
      const { find } = data.node;
      const { lfValue } = compInstance;
      const { node } = e.detail;

      if (node.id) {
        const node = find(lfValue, (n) => n.id === node.id);
        const dsl = parseConfigDslFromNode(node as any);

        if (dsl) {
          const { set } = adapter.controller;

          set.config.controls(dsl.controls || []);
          set.config.layout(dsl.layout);
          set.config.settings(dsl.defaultSettings || {});
        }
      }

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion

    //#region Control
    controlChange: (e, controlId, value) => {
      const adapter = getAdapter();
      const { compInstance, config } = adapter.controller.get;

      const comp = compInstance as LfShapeeditor;

      const currentSettings = {
        ...(config?.settings?.() || {}),
        [controlId]: value,
      };

      adapter.controller.set.config.settings(currentSettings);

      comp.onLfEvent(e, "lf-event");
    },
    //#endregion
  };
};

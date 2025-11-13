import {
  LfSelectAdapter,
  LfSelectAdapterHandlers,
} from "@lf-widgets/foundations";
import { LfSelect } from "./lf-select";

export const prepSelectHandlers = (
  _getAdapter: () => LfSelectAdapter,
): LfSelectAdapterHandlers => {
  return {
    //#region List
    list: async (event) => {
      const { eventType, node } = event.detail;
      const { controller } = _getAdapter();
      const { compInstance } = controller.get;
      const comp = compInstance as LfSelect;

      switch (eventType) {
        case "click":
          controller.set.select.value(node.id);
          controller.set.list("close");
          break;
      }

      comp.onLfEvent(event, "lf-event", node);
    },
    //#endregion

    //#region Textfield
    textfield: async (event) => {
      const { eventType } = event.detail;
      const { controller } = _getAdapter();
      const { compInstance } = controller.get;
      const comp = compInstance as LfSelect;

      switch (eventType) {
        case "click":
          controller.set.list();
          break;
      }

      comp.onLfEvent(event, "lf-event");
    },
    //#endregion
  };
};

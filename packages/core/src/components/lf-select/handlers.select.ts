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
          controller.set.select.open(false);
          comp.onLfEvent(event, "select", node);
          break;
      }
    },
    //#endregion

    //#region Textfield
    textfield: async (event) => {
      const { eventType } = event.detail;
      const { controller } = _getAdapter();
      const { compInstance } = controller.get;
      const comp = compInstance as LfSelect;

      switch (eventType) {
        case "focus":
          controller.set.select.open(true);
          comp.onLfEvent(event, "focus");
          break;
        case "blur":
          controller.set.select.open(false);
          comp.onLfEvent(event, "blur");
          break;
        case "click":
          controller.set.select.open(!controller.get.isOpen());
          break;
      }
    },
    //#endregion
  };
};

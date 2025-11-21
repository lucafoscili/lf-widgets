import {
  LfMultiInputAdapter,
  LfMultiInputAdapterHandlers,
} from "@lf-widgets/foundations";
import { LfMultiInput } from "./lf-multiinput";

export const prepMultiInputHandlers = (
  getAdapter: () => LfMultiInputAdapter,
): LfMultiInputAdapterHandlers => {
  return {
    //#region Chip
    chips: async (event) => {
      const { eventType, node } = event.detail || {};
      const { controller } = getAdapter();
      const comp = controller.get.compInstance as LfMultiInput;

      if (controller.get.isDisabled()) {
        comp.onLfEvent(event, "lf-event", { node });
        return;
      }

      switch (eventType) {
        case "click":
          if (node) {
            comp.onLfEvent(event, "select-history", { node });
          }
          break;
        default:
          comp.onLfEvent(event, "lf-event", { node });
          break;
      }
    },
    //#endregion

    //#region Textfield
    textfield: async (event) => {
      const { eventType, iconType, inputValue } = event.detail || {};
      const { controller } = getAdapter();
      const comp = controller.get.compInstance as LfMultiInput;

      if (controller.get.isDisabled()) {
        comp.onLfEvent(event, "lf-event");
        return;
      }

      switch (eventType) {
        case "click":
          if (iconType === "action") {
            comp.onLfEvent(event, "clear-history", {
              value: inputValue || "",
            });
          }
          break;
        case "input":
          comp.onLfEvent(event, "input", {
            value: inputValue || "",
          });
          break;
        case "keydown":
          const og = event.detail?.originalEvent as KeyboardEvent;
          if (og.key === "Enter") {
            comp.onLfEvent(event, "change", {
              value: inputValue || "",
            });
          }
          break;
        default:
          comp.onLfEvent(event, "lf-event");
          break;
      }
    },
    //#endregion
  };
};

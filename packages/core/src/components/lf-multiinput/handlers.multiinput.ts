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
      const { controller, dispatcher } = getAdapter();
      const comp = controller.get.compInstance() as LfMultiInput;

      if (controller.computed.isDisabled()) {
        dispatcher.emit("lf-event", { originalEvent: event, node });
        return;
      }

      switch (eventType) {
        case "click":
          if (node) {
            comp.onLfEvent(event, "select-history", { node });
          }
          break;
        default:
          dispatcher.emit("lf-event", { originalEvent: event, node });
          break;
      }
    },
    //#endregion

    //#region Textfield
    textfield: async (event) => {
      const { eventType, iconType, inputValue } = event.detail || {};
      const { controller, dispatcher } = getAdapter();
      const comp = controller.get.compInstance() as LfMultiInput;

      if (controller.computed.isDisabled()) {
        dispatcher.emit("lf-event", { originalEvent: event });
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
          dispatcher.emit("lf-event", { originalEvent: event });
          break;
      }
    },
    //#endregion

    //#region FC-compatible Textfield handlers
    /**
     * FC-compatible textfield input handler.
     * Called directly by LfTextfieldFC's onInput callback.
     */
    textfieldInput: (event: Event, value: string) => {
      const { controller, dispatcher } = getAdapter();
      const comp = controller.get.compInstance() as LfMultiInput;

      if (controller.computed.isDisabled()) {
        dispatcher.emit("lf-event", { originalEvent: event as CustomEvent });
        return;
      }

      comp.onLfEvent(event, "input", { value: value || "" });
    },

    /**
     * FC-compatible textfield keydown handler.
     * Called directly by LfTextfieldFC's onKeyDown callback.
     */
    textfieldKeyDown: (event: KeyboardEvent) => {
      const { controller, dispatcher, elements } = getAdapter();
      const comp = controller.get.compInstance() as LfMultiInput;

      if (controller.computed.isDisabled()) {
        dispatcher.emit("lf-event", {
          originalEvent: event as unknown as CustomEvent,
        });
        return;
      }

      if (event.key === "Enter") {
        // Get value from the input element since onKeyDown doesn't pass value
        const inputEl = elements.refs.textfield;
        const value = inputEl?.value || "";
        comp.onLfEvent(event, "change", { value });
      }
    },

    /**
     * FC-compatible textfield action icon click handler.
     * Called directly by LfTextfieldFC's onIconClick callback.
     */
    textfieldIconClick: (event: MouseEvent, iconType: "regular" | "action") => {
      const { controller, dispatcher } = getAdapter();
      const comp = controller.get.compInstance() as LfMultiInput;

      if (controller.computed.isDisabled()) {
        dispatcher.emit("lf-event", {
          originalEvent: event as unknown as CustomEvent,
        });
        return;
      }

      if (iconType === "action") {
        // Get current value from the input ref
        const textfield = controller.get.compInstance();
        const inputValue = (textfield as LfMultiInput).lfValue || "";
        comp.onLfEvent(event, "clear-history", { value: inputValue });
      }
    },
    //#endregion
  };
};

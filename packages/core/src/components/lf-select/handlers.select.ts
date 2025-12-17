import {
  LfSelectAdapter,
  LfSelectAdapterHandlers,
} from "@lf-widgets/foundations";

export const prepSelectHandlers = (
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapterHandlers => {
  return {
    //#region List
    list: async (event) => {
      const { eventType, node } = event.detail;
      const { controller, dispatcher, elements } = getAdapter();
      const { refs } = elements;

      switch (eventType) {
        case "click":
          await controller.actions.setValue(node.id);
          controller.actions.list("close");
          refs.textfield?.focus();
          break;
      }

      dispatcher.emit("lf-event", {
        originalEvent: event,
        node,
      });
    },
    //#endregion

    //#region Textfield (WC event handler - deprecated, use FC handlers)
    /** @deprecated Use textfieldClick, textfieldKeydown for FC usage */
    textfield: async (event) => {
      const { eventType } = event.detail || {};
      const { controller, dispatcher } = getAdapter();

      switch (eventType) {
        case "click": {
          controller.actions.list();
          break;
        }
        case "keydown": {
          const ogEv = event.detail.originalEvent as KeyboardEvent;
          await keydownHandler(ogEv, controller);
          break;
        }
      }

      dispatcher.emit("lf-event", {
        originalEvent: event,
      });
    },
    //#endregion

    //#region Textfield FC handlers
    /**
     * FC-compatible click handler for textfield.
     * Called directly by LfTextfieldFC's onClick callback.
     */
    textfieldClick: (event: MouseEvent) => {
      const { controller, dispatcher } = getAdapter();
      controller.actions.list();
      dispatcher.emit("lf-event", {
        originalEvent: event as unknown as CustomEvent,
      });
    },

    /**
     * FC-compatible keydown handler for textfield.
     * Called directly by LfTextfieldFC's onKeyDown callback.
     */
    textfieldKeydown: async (event: KeyboardEvent) => {
      const { controller, dispatcher } = getAdapter();
      await keydownHandler(event, controller);
      dispatcher.emit("lf-event", {
        originalEvent: event as unknown as CustomEvent,
      });
    },

    /**
     * FC-compatible icon click handler for textfield.
     * Called directly by LfTextfieldFC's onIconClick callback.
     */
    textfieldIconClick: (event: MouseEvent) => {
      const { controller, dispatcher } = getAdapter();
      controller.actions.list();
      dispatcher.emit("lf-event", {
        originalEvent: event as unknown as CustomEvent,
      });
    },
    //#endregion
  };
};

//#region Helpers
const keydownHandler = async (
  event: KeyboardEvent,
  controller: LfSelectAdapter["controller"],
) => {
  const { compInstance } = controller.get;
  const comp = compInstance();

  if (!comp.lfNavigation) {
    return;
  }

  const dataset = comp.lfDataset;
  if (!dataset?.nodes?.length) {
    return;
  }

  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      await controller.actions.navigate("next");
      break;
    }
    case "ArrowUp": {
      event.preventDefault();
      await controller.actions.navigate("prev");
      break;
    }
    case "Escape": {
      event.preventDefault();
      controller.actions.list("close");
      break;
    }
    case "Enter": {
      event.preventDefault();
      controller.actions.list();
      break;
    }
    default: {
      break;
    }
  }
};
//#endregion

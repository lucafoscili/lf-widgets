import {
  LfSelectAdapter,
  LfSelectAdapterHandlers,
} from "@lf-widgets/foundations";
import { LfSelect } from "./lf-select";

export const prepSelectHandlers = (
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapterHandlers => {
  return {
    //#region List
    list: async (event) => {
      const { eventType, node } = event.detail;
      const { controller, elements } = getAdapter();
      const { compInstance } = controller.get;
      const { refs } = elements;
      const comp = compInstance as LfSelect;

      switch (eventType) {
        case "click":
          controller.set.value(node.id);
          controller.set.list("close");
          refs.textfield.setFocus();
          break;
      }

      comp.onLfEvent(event, "lf-event", node);
    },
    //#endregion

    //#region Textfield
    textfield: async (event) => {
      const { eventType } = event.detail || {};
      const { controller } = getAdapter();
      const { compInstance } = controller.get;
      const comp = compInstance as LfSelect;

      switch (eventType) {
        case "click": {
          controller.set.list();
          break;
        }
        case "keydown": {
          const ogEv = event.detail.originalEvent as KeyboardEvent;
          await keydownHandler(ogEv, controller);
          break;
        }
      }

      comp.onLfEvent(event, "lf-event");
    },
    //#endregion
  };
};

//#region Helpers
const keydownHandler = async (
  event: KeyboardEvent,
  controller: LfSelectAdapter["controller"],
) => {
  const { compInstance, lfDataset } = controller.get;
  const comp = compInstance as LfSelect;

  if (!comp.lfNavigation) {
    return;
  }

  const dataset = lfDataset();
  if (!dataset?.nodes?.length) {
    return;
  }

  const currentIndex = await comp.getSelectedIndex();
  let newIndex = currentIndex;

  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      if (currentIndex === -1) {
        newIndex = 0;
      } else {
        newIndex = (currentIndex + 1) % dataset.nodes.length;
      }
      break;
    }
    case "ArrowUp": {
      event.preventDefault();
      if (currentIndex === -1) {
        newIndex = dataset.nodes.length - 1;
      } else {
        newIndex =
          currentIndex === 0 ? dataset.nodes.length - 1 : currentIndex - 1;
      }
      break;
    }
    case "Escape": {
      event.preventDefault();
      controller.set.list("close");
      break;
    }
    case "Enter": {
      event.preventDefault();
      controller.set.list();
      break;
    }
    default: {
      break;
    }
  }

  if (newIndex !== currentIndex) {
    const newNode = dataset.nodes[newIndex];
    controller.set.value(newNode.id);
    comp.onLfEvent(event, "lf-event", newNode);
  }
};
//#endregion

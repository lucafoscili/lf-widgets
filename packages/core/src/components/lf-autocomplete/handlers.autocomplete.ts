import {
  LfAutocompleteAdapter,
  LfAutocompleteAdapterHandlers,
} from "@lf-widgets/foundations";
import { LfAutocomplete } from "./lf-autocomplete";

export const prepAutocompleteHandlers = (
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterHandlers => {
  return {
    //#region List
    list: async (event) => {
      const { eventType, node } = event.detail;
      const { controller } = getAdapter();
      const comp = controller.get.compInstance as LfAutocomplete;

      switch (eventType) {
        case "click":
          controller.set.blurTimeout.clear();
          if (node) {
            controller.set.highlight(-1);
            await controller.set.select(node);
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
      const { eventType, inputValue, originalEvent } = event.detail || {};
      const { controller, elements } = getAdapter();
      const comp = controller.get.compInstance as LfAutocomplete;

      switch (eventType) {
        case "input": {
          await controller.set.input(inputValue);
          comp.onLfEvent(event, "input", { query: inputValue });
          break;
        }
        case "keydown": {
          const ogEv = originalEvent as KeyboardEvent;
          await keydownHandler(ogEv, controller, elements.refs);
          comp.onLfEvent(event, "lf-event");
          break;
        }
        case "blur": {
          controller.set.blurTimeout.new(() => {
            if (!controller.get.isLoading()) {
              controller.set.list("close");
              controller.set.highlight(-1);
            }
          });
          comp.onLfEvent(event, "lf-event");
          break;
        }
        case "click": {
          controller.set.list();
          comp.onLfEvent(event, "lf-event");
          break;
        }
        default: {
          comp.onLfEvent(event, "lf-event");
          break;
        }
      }
    },
    //#endregion
  };
};

//#region Helpers
const keydownHandler = async (
  event: KeyboardEvent,
  controller: LfAutocompleteAdapter["controller"],
  refs: LfAutocompleteAdapter["elements"]["refs"],
) => {
  const { lfDataset, highlightedIndex } = controller.get;
  const comp = controller.get.compInstance as LfAutocomplete;

  if (!comp.lfNavigation) {
    return;
  }

  const dataset = lfDataset();
  if (!dataset?.nodes?.length) {
    return;
  }

  let newIndex = highlightedIndex();

  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      newIndex = newIndex < dataset.nodes.length - 1 ? newIndex + 1 : 0;
      controller.set.highlight(newIndex);
      if (newIndex >= 0 && refs.list) {
        await refs.list.selectNode(newIndex);
      }
      break;
    }
    case "ArrowUp": {
      event.preventDefault();
      newIndex = newIndex > 0 ? newIndex - 1 : dataset.nodes.length - 1;
      controller.set.highlight(newIndex);
      if (newIndex >= 0 && refs.list) {
        await refs.list.selectNode(newIndex);
      }
      break;
    }
    case "Escape": {
      event.preventDefault();
      controller.set.list("close");
      controller.set.highlight(-1);
      break;
    }
    case "Tab": {
      controller.set.list("close");
      controller.set.highlight(-1);
      break;
    }
    case "Enter": {
      event.preventDefault();
      controller.set.list();
      break;
    }
  }
};
//#endregion

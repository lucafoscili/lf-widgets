import {
  LfAutocompleteAdapter,
  LfAutocompleteAdapterHandlers,
} from "@lf-widgets/foundations";

// Debounce timer stored at module level to be accessible
let debounceTimer: NodeJS.Timeout | null = null;

export const prepAutocompleteHandlers = (
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterHandlers => {
  return {
    //#region List
    list: async (event) => {
      const { eventType, node } = event.detail;
      const adapter = getAdapter();
      const { controller, dispatcher } = adapter;

      switch (eventType) {
        case "click":
          controller.set.blurTimeout.clear();
          if (node) {
            controller.set.highlight(-1);
            await controller.actions.selectNode(node);
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
      const { eventType, inputValue, originalEvent } = event.detail || {};
      const adapter = getAdapter();
      const { controller, dispatcher, elements } = adapter;
      const comp = controller.get.compInstance();

      switch (eventType) {
        case "input": {
          // Update input value via action
          comp.inputValue = inputValue;
          const { textfield } = elements.refs;
          if (textfield) {
            await textfield.setValue(inputValue);
          }

          // Clear existing debounce
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          // Check minimum characters
          if (inputValue.length < comp.lfMinChars) {
            controller.set.list("close");
            comp.loading = false;
            dispatcher.emit("input", {
              query: inputValue,
              originalEvent: event,
            });
            return;
          }

          controller.set.list("open");
          controller.set.highlight(-1);

          // Normalize and check cache
          const cache = controller.get.cache();
          const normalized = inputValue.trim().toLowerCase();
          if (comp.lfCache && cache.has(normalized)) {
            const entry = cache.get(normalized);
            if (Date.now() - entry.timestamp > comp.lfCacheTTL) {
              cache.delete(normalized);
            } else {
              comp.lfDataset = entry.dataset;
              comp.lfListProps = { ...comp.lfListProps, lfFilter: false };
              comp.loading = false;
              dispatcher.emit("input", {
                query: inputValue,
                originalEvent: event,
              });
              return;
            }
          }

          // No cache hit - trigger request after debounce
          comp.lfDataset = null;
          comp.loading = true;

          debounceTimer = setTimeout(() => {
            comp.lastRequestedQuery = inputValue;
            dispatcher.emit("request", { query: inputValue });
          }, comp.lfDebounceMs);

          dispatcher.emit("input", { query: inputValue, originalEvent: event });
          break;
        }
        case "keydown": {
          const ogEv = originalEvent as KeyboardEvent;
          await keydownHandler(ogEv, controller, elements.refs);
          dispatcher.emit("lf-event", { originalEvent: event });
          break;
        }
        case "blur": {
          controller.set.blurTimeout.new(() => {
            if (!controller.computed.isLoading()) {
              controller.set.list("close");
              controller.set.highlight(-1);
            }
          });
          dispatcher.emit("lf-event", { originalEvent: event });
          break;
        }
        case "click": {
          controller.set.list();
          dispatcher.emit("lf-event", { originalEvent: event });
          break;
        }
        default: {
          dispatcher.emit("lf-event", { originalEvent: event });
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
  const { compInstance } = controller.get;
  const { computed } = controller;
  const comp = compInstance();

  if (!comp.lfNavigation) {
    return;
  }

  const dataset = comp.lfDataset;
  if (!dataset?.nodes?.length) {
    return;
  }

  let newIndex = computed.highlightedIndex();

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

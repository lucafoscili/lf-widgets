import {
  LfAutocompleteAdapter,
  LfAutocompleteAdapterInitializerGetters,
  LfAutocompleteAdapterInitializerSetters,
  LfAutocompleteAdapterRefs,
} from "@lf-widgets/foundations";
import { prepAutocompleteJsx } from "./elements.autocomplete";
import { prepAutocompleteHandlers } from "./handlers.autocomplete";

//#region Adapter
export const createAdapter = (
  getters: LfAutocompleteAdapterInitializerGetters,
  setters: LfAutocompleteAdapterInitializerSetters,
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapter => {
  const enhancedSetters = {
    ...setters,
    list: (state = "toggle") => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { manager } = controller.get;
      const { autocomplete, dropdown, textfield } = elements.refs;
      const { close, isInPortal, open } = manager.portal;

      const syncDropdownWidth = () => {
        if (!dropdown || !textfield) {
          return;
        }
        const { width } = textfield.getBoundingClientRect();
        if (width > 0) {
          dropdown.style.minWidth = `${width}px`;
        }
      };

      switch (state) {
        case "close":
          close(dropdown);
          break;
        case "open":
          open(dropdown, autocomplete, textfield);
          syncDropdownWidth();
          break;
        default:
          if (isInPortal(dropdown)) {
            close(dropdown);
          } else {
            open(dropdown, autocomplete, textfield);
            syncDropdownWidth();
          }
          break;
      }
    },
  };

  return {
    controller: {
      get: getters,
      set: enhancedSetters,
    },
    elements: {
      jsx: prepAutocompleteJsx(getAdapter),
      refs: prepRefs(),
    },
    handlers: prepAutocompleteHandlers(getAdapter),
  };
};

const prepRefs = (): LfAutocompleteAdapterRefs => {
  return {
    autocomplete: null,
    dropdown: null,
    list: null,
    spinner: null,
    textfield: null,
  };
};
//#endregion

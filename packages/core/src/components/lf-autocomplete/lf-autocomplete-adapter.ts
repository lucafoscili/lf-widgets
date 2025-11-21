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
      const { dropdown, textfield } = elements.refs;
      const { close, getState, isInPortal, open } = manager.portal;

      const resolveParent = () => {
        const existingState = dropdown && getState(dropdown);
        if (existingState?.parent) {
          return existingState.parent;
        }
        return (dropdown?.parentElement || textfield) as HTMLElement;
      };
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
          open(dropdown, resolveParent(), textfield);
          syncDropdownWidth();
          break;
        default:
          if (isInPortal(dropdown)) {
            close(dropdown);
          } else {
            open(dropdown, resolveParent(), textfield);
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
    dropdown: null,
    list: null,
    spinner: null,
    textfield: null,
  };
};
//#endregion

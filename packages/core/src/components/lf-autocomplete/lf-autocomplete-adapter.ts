import {
  LfAutocompleteAdapter,
  LfAutocompleteAdapterControllerActions,
  LfAutocompleteAdapterControllerComputed,
  LfAutocompleteAdapterControllerGetters,
  LfAutocompleteAdapterControllerSetters,
  LfAutocompleteAdapterHandlers,
  LfAutocompleteAdapterJsx,
  LfAutocompleteAdapterRefs,
} from "@lf-widgets/foundations";
import { prepAutocompleteJsx } from "./elements.autocomplete";
import { prepAutocompleteHandlers } from "./handlers.autocomplete";

/**
 * Creates the canonical adapter for lf-autocomplete.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + cache
 * - controller.set: Simple setters (blurTimeout, dataset, list, highlight)
 * - controller.computed: Derived predicates (isDisabled, isLoading, hasCache, etc.)
 * - controller.actions: Complex operations (updateInput, selectNode, highlight, etc.)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfAutocompleteAdapterControllerGetters,
  setters: LfAutocompleteAdapterControllerSetters,
  computed: LfAutocompleteAdapterControllerComputed,
  actions: LfAutocompleteAdapterControllerActions,
  getAdapter: () => LfAutocompleteAdapter,
): Omit<LfAutocompleteAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: createSetters(setters, getAdapter),
      computed,
      actions,
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};
//#endregion

//#region Controller
export const createSetters = (
  setters: LfAutocompleteAdapterControllerSetters,
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterControllerSetters => {
  return {
    ...setters,
    list: (state = "toggle") => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { framework } = controller.get;
      const { autocomplete, dropdown, textfield } = elements.refs;
      const { close, isInPortal, open } = framework().portal;

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
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterJsx => {
  return prepAutocompleteJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfAutocompleteAdapter,
): LfAutocompleteAdapterHandlers => {
  return prepAutocompleteHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_AUTOCOMPLETE_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfAutocompleteAdapterRefs => {
  return {
    autocomplete: null,
    dropdown: null,
    list: null,
    spinner: null,
    textfield: null,
  };
};
//#endregion

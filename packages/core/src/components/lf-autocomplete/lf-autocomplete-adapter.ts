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
      set: createSetters(setters),
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
): LfAutocompleteAdapterControllerSetters => {
  return {
    ...setters,
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

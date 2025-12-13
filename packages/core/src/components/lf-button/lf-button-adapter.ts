import {
  LfButtonAdapter,
  LfButtonAdapterControllerActions,
  LfButtonAdapterControllerComputed,
  LfButtonAdapterControllerGetters,
  LfButtonAdapterControllerSetters,
  LfButtonAdapterHandlers,
  LfButtonAdapterJsx,
  LfButtonAdapterRefs,
} from "@lf-widgets/foundations";
import { prepButton } from "./elements.button";
import { prepButtonHandlers } from "./handlers.button";

/**
 * Creates the canonical adapter for lf-button.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + styling
 * - controller.set: Simple setters (list)
 * - controller.computed: Derived predicates (isDisabled, isDropdown, isOn)
 * - controller.actions: Complex operations (toggle)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfButtonAdapterControllerGetters,
  setters: LfButtonAdapterControllerSetters,
  computed: LfButtonAdapterControllerComputed,
  actions: LfButtonAdapterControllerActions,
  getAdapter: () => LfButtonAdapter,
): Omit<LfButtonAdapter, "dispatcher"> => {
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
  setters: LfButtonAdapterControllerSetters,
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterControllerSetters => {
  return {
    ...setters,
    list: (state = "toggle") => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { framework } = controller.get;
      const { dropdown, list } = elements.refs;

      const { close, isInPortal, open } = framework().portal;

      switch (state) {
        case "close":
          close(list);
          break;
        case "open":
          open(list, dropdown);
          break;
        default:
          if (isInPortal(list)) {
            close(list);
          } else {
            open(list, dropdown);
          }
          break;
      }
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterJsx => {
  return prepButton(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterHandlers => {
  return prepButtonHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_BUTTON_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfButtonAdapterRefs => {
  return {
    button: null,
    dropdown: null,
    icon: null,
    label: null,
    list: null,
    spinner: null,
  };
};
//#endregion

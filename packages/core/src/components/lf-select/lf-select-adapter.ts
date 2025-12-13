import {
  LfSelectAdapter,
  LfSelectAdapterControllerActions,
  LfSelectAdapterControllerComputed,
  LfSelectAdapterControllerGetters,
  LfSelectAdapterControllerSetters,
  LfSelectAdapterHandlers,
  LfSelectAdapterJsx,
  LfSelectAdapterRefs,
} from "@lf-widgets/foundations";
import { prepSelectJsx } from "./elements.select";
import { prepSelectHandlers } from "./handlers.select";

/**
 * Creates the canonical adapter for lf-select.
 *
 * v4.0.0 Architecture:
 * - controller.get: Base getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts) + component state
 * - controller.set: Simple setters (list)
 * - controller.computed: Derived predicates (isDisabled)
 * - controller.actions: Complex operations (setValue, navigate)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfSelectAdapterControllerGetters,
  setters: LfSelectAdapterControllerSetters,
  computed: LfSelectAdapterControllerComputed,
  actions: LfSelectAdapterControllerActions,
  getAdapter: () => LfSelectAdapter,
): Omit<LfSelectAdapter, "dispatcher"> => {
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
  setters: LfSelectAdapterControllerSetters,
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapterControllerSetters => {
  return {
    ...setters,
    list: (state = "toggle") => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { framework } = controller.get;
      const { list, select, textfield } = elements.refs;

      const { close, isInPortal, open } = framework().portal;

      switch (state) {
        case "close":
          close(list);
          break;
        case "open":
          open(list, select, textfield);
          break;
        default:
          if (isInPortal(list)) {
            close(list);
          } else {
            open(list, select, textfield);
          }
          break;
      }
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapterJsx => {
  return prepSelectJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapterHandlers => {
  return prepSelectHandlers(getAdapter);
};
//#endregion

//#region Refs
/**
 * Creates refs structure matching LF_SELECT_BLOCKS.
 * All values explicitly nullable per v4.0.0 Section 5.7.
 */
export const createRefs = (): LfSelectAdapterRefs => {
  return {
    list: null,
    select: null,
    textfield: null,
  };
};
//#endregion

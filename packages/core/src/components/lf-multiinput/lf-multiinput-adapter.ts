import {
  LfMultiInputAdapter,
  LfMultiInputAdapterControllerActions,
  LfMultiInputAdapterControllerComputed,
  LfMultiInputAdapterControllerGetters,
  LfMultiInputAdapterControllerSetters,
  LfMultiInputAdapterDispatcher,
  LfMultiInputAdapterRefs,
} from "@lf-widgets/foundations";
import { prepMultiInputJsx } from "./elements.multiinput";
import { prepMultiInputHandlers } from "./handlers.multiinput";

//#region Adapter
/**
 * Creates the v4.0.0 compliant adapter for lf-multiinput.
 *
 * @param getters - Controller getter functions
 * @param setters - Controller setter functions
 * @param computed - Controller computed functions
 * @param actions - Controller action functions
 * @param dispatcher - Event dispatcher
 * @param getAdapter - Factory to retrieve current adapter
 * @returns Complete adapter instance
 */
export const createAdapter = (
  getters: LfMultiInputAdapterControllerGetters,
  setters: LfMultiInputAdapterControllerSetters,
  computed: LfMultiInputAdapterControllerComputed,
  actions: LfMultiInputAdapterControllerActions,
  dispatcher: LfMultiInputAdapterDispatcher,
  getAdapter: () => LfMultiInputAdapter,
): LfMultiInputAdapter => {
  return {
    controller: {
      get: getters,
      set: setters,
      computed,
      actions,
    },
    dispatcher,
    elements: {
      jsx: prepMultiInputJsx(getAdapter),
      refs: prepRefs(),
    },
    handlers: prepMultiInputHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
const prepRefs = (): LfMultiInputAdapterRefs => {
  return {
    chips: null,
    textfield: null,
  };
};
//#endregion

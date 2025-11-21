import {
  LfMultiInputAdapter,
  LfMultiInputAdapterInitializerGetters,
  LfMultiInputAdapterInitializerSetters,
  LfMultiInputAdapterRefs,
} from "@lf-widgets/foundations";
import { prepMultiInputJsx } from "./elements.multiinput";
import { prepMultiInputHandlers } from "./handlers.multiinput";

//#region Adapter
export const createAdapter = (
  getters: LfMultiInputAdapterInitializerGetters,
  setters: LfMultiInputAdapterInitializerSetters,
  getAdapter: () => LfMultiInputAdapter,
): LfMultiInputAdapter => {
  return {
    controller: {
      get: getters,
      set: setters,
    },
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

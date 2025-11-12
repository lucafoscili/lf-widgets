import {
  LfSelectAdapter,
  LfSelectAdapterHandlers,
  LfSelectAdapterInitializerGetters,
  LfSelectAdapterInitializerSetters,
  LfSelectAdapterJsx,
  LfSelectAdapterRefs,
} from "@lf-widgets/foundations";
import { prepSelectJsx } from "./elements.select";
import { prepSelectHandlers } from "./handlers.select";

export const createAdapter = (
  getters: LfSelectAdapterInitializerGetters,
  setters: LfSelectAdapterInitializerSetters,
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapter => {
  return {
    controller: {
      get: getters,
      set: setters,
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};

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
export const createRefs = (): LfSelectAdapterRefs => {
  return {
    list: null,
    textfield: null,
  };
};
//#endregion

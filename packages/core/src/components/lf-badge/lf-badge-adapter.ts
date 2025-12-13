import {
  LfBadgeAdapter,
  LfBadgeAdapterHandlers,
  LfBadgeAdapterInitializerGetters,
  LfBadgeAdapterJsx,
  LfBadgeAdapterRefs,
} from "@lf-widgets/foundations";
import { prepBadgeJsx } from "./elements.badge";
import { prepBadgeHandlers } from "./handlers.badge";

//#region Adapter
export const createAdapter = (
  getters: LfBadgeAdapterInitializerGetters,
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapter => {
  return {
    controller: {
      get: getters,
      set: {},
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapterJsx => {
  return prepBadgeJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (): LfBadgeAdapterHandlers => {
  return prepBadgeHandlers();
};
//#endregion

//#region Refs
export const createRefs = (): LfBadgeAdapterRefs => {
  return {
    badge: null,
  };
};
//#endregion

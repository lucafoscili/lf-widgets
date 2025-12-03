import {
  LfListAdapter,
  LfListAdapterInitializerGetters,
  LfListAdapterInitializerSetters,
  LfListAdapterRefs,
} from "@lf-widgets/foundations";
import { prepList } from "./elements.list";
import { prepListHandlers } from "./handlers.list";

//#region Adapter
export const createAdapter = (
  getters: LfListAdapterInitializerGetters,
  setters: LfListAdapterInitializerSetters,
  getAdapter: () => LfListAdapter,
): LfListAdapter => {
  return {
    controller: {
      get: getters,
      set: setters,
    },
    elements: {
      jsx: prepList(getAdapter),
      refs: prepRefs(),
    },
    handlers: prepListHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const prepRefs = (): LfListAdapterRefs => {
  return {
    deleteIcon: null,
    filter: null,
    icon: null,
    node: null,
    subtitle: null,
    title: null,
  };
};
//#endregion

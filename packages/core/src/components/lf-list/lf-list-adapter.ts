import {
  LfListAdapter,
  LfListAdapterHandlers,
  LfListAdapterInitializerGetters,
  LfListAdapterJsx,
  LfListAdapterRefs,
} from "@lf-widgets/foundations";
import { prepList } from "./elements.list";
import { prepListHandlers } from "./handlers.list";

//#region Adapter
export const createAdapter = (
  getters: LfListAdapterInitializerGetters,
  getAdapter: () => LfListAdapter,
): LfListAdapter => {
  return {
    controller: {
      get: createGetters(getters),
      set: createSetters(getAdapter),
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
export const createGetters = (getters: LfListAdapterInitializerGetters) => {
  return getters;
};

export const createSetters = (getAdapter: () => LfListAdapter) => {
  return {
    filter: {
      apply: async (value: string) => {
        const adapter = getAdapter();
        const { controller } = adapter;
        const { compInstance } = controller.get;

        // Call the component's filter method
        await compInstance.applyFilter(value);
      },
      setValue: async (value: string) => {
        const adapter = getAdapter();
        const { controller } = adapter;
        const { compInstance } = controller.get;

        // Call the component's setFilterValue method
        await compInstance.setFilterValue(value);
      },
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfListAdapter,
): LfListAdapterJsx => {
  return prepList(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfListAdapter,
): LfListAdapterHandlers => {
  return prepListHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfListAdapterRefs => {
  return {
    filter: null, // NEW
    // ... existing refs would go here
  };
};
//#endregion

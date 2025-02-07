import {
  LfImageviewerAdapter,
  LfImageviewerAdapterControllerGetters,
  LfImageviewerAdapterControllerSetters,
  LfImageviewerAdapterHandlers,
  LfImageviewerAdapterInitializerGetters,
  LfImageviewerAdapterInitializerSetters,
  LfImageviewerAdapterJsx,
  LfImageviewerAdapterRefs,
} from "@lf-widgets/foundations";
import { prepDetails } from "./elements.details";
import { prepNavigation } from "./elements.navigation";
import { prepDetailsHandlers } from "./handlers.details";
import { prepNavigationHandlers } from "./handlers.navigation";

export const createAdapter = (
  getters: LfImageviewerAdapterInitializerGetters,
  setters: LfImageviewerAdapterInitializerSetters,
  getAdapter: () => LfImageviewerAdapter,
): LfImageviewerAdapter => {
  return {
    controller: {
      get: createGetters(getters),
      set: createSetters(setters, getAdapter),
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
export const createGetters = (
  getters: LfImageviewerAdapterInitializerGetters,
): LfImageviewerAdapterControllerGetters => {
  return getters;
};
export const createSetters = (
  setters: LfImageviewerAdapterInitializerSetters,
  getAdapter: () => LfImageviewerAdapter,
): LfImageviewerAdapterControllerSetters => {
  return {
    ...setters,
    spinnerStatus: (active) =>
      (getAdapter().elements.refs.details.spinner.lfActive = active),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfImageviewerAdapter,
): LfImageviewerAdapterJsx => {
  return {
    details: prepDetails(getAdapter),
    navigation: prepNavigation(getAdapter),
  };
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfImageviewerAdapter,
): LfImageviewerAdapterHandlers => {
  return {
    details: prepDetailsHandlers(getAdapter),
    navigation: prepNavigationHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const createRefs = (): LfImageviewerAdapterRefs => {
  return {
    details: {
      canvas: null,
      clearHistory: null,
      deleteShape: null,
      redo: null,
      save: null,
      spinner: null,
      undo: null,
      tree: null,
    },
    navigation: {
      load: null,
      masonry: null,
      textfield: null,
    },
  };
};
//#endregion

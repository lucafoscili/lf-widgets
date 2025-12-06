import {
  LfShapeeditorAdapter,
  LfShapeeditorAdapterControllerSetters,
  LfShapeeditorAdapterHandlers,
  LfShapeeditorAdapterInitializerGetters,
  LfShapeeditorAdapterInitializerSetters,
  LfShapeeditorAdapterJsx,
  LfShapeeditorAdapterRefs,
} from "@lf-widgets/foundations";
import { prepDetails } from "./elements.details";
import { prepNavigation } from "./elements.navigation";
import { prepDetailsHandlers } from "./handlers.details";
import { prepNavigationHandlers } from "./handlers.navigation";

//#region Adapter
export const createAdapter = (
  getters: LfShapeeditorAdapterInitializerGetters,
  setters: LfShapeeditorAdapterInitializerSetters,
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapter => {
  return {
    controller: {
      get: getters,
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
export const createSetters = (
  setters: LfShapeeditorAdapterInitializerSetters,
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterControllerSetters => {
  return {
    ...setters,
    spinnerStatus: (active) =>
      (getAdapter().elements.refs.details.spinner.lfActive = active),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx => {
  return {
    details: prepDetails(getAdapter),
    navigation: prepNavigation(getAdapter),
  };
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterHandlers => {
  return {
    details: prepDetailsHandlers(getAdapter),
    navigation: prepNavigationHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const createRefs = (): LfShapeeditorAdapterRefs => {
  return {
    details: {
      clearHistory: null,
      deleteShape: null,
      redo: null,
      save: null,
      shape: null,
      spinner: null,
      tree: null,
      undo: null,
    },
    navigation: {
      load: null,
      masonry: null,
      navToggle: null,
      textfield: null,
      tree: null,
    },
  };
};
//#endregion

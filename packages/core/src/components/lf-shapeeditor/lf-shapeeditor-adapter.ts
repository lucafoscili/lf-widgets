import {
  LfShapeeditorAdapter,
  LfShapeeditorAdapterControllerSetters,
  LfShapeeditorAdapterHandlers,
  LfShapeeditorAdapterInitializerGetters,
  LfShapeeditorAdapterInitializerSetters,
  LfShapeeditorAdapterJsx,
  LfShapeeditorAdapterRefs,
} from "@lf-widgets/foundations";
import { prepNavigation } from "./elements.navigation";
import { prepPreview } from "./elements.preview";
import { prepSettings } from "./elements.settings";
import { prepNavigationHandlers } from "./handlers.navigation";
import { prepPreviewHandlers } from "./handlers.preview";
import { prepSettingsHandlers } from "./handlers.settings";

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
      (getAdapter().elements.refs.preview.spinner.lfActive = active),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx => {
  return {
    navigation: prepNavigation(getAdapter),
    preview: prepPreview(getAdapter),
    settings: prepSettings(getAdapter),
  };
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterHandlers => {
  return {
    navigation: prepNavigationHandlers(getAdapter),
    preview: prepPreviewHandlers(getAdapter),
    settings: prepSettingsHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const createRefs = (): LfShapeeditorAdapterRefs => {
  return {
    navigation: {
      explorer: {
        tree: null,
        expander: null,
      },
      jump: {
        textfield: null,
        load: null,
      },
      masonry: null,
    },
    preview: {
      history: {
        list: null,
      },
      shape: null,
      spinner: null,
    },
    settings: {
      actions: {
        delete: null,
        badge: null,
        clear: null,
        redo: null,
        undo: null,
        commit: null,
      },
      progressbar: null,
      tree: null,
      controls: {
        snackbar: null,
        items: {
          accordion: null,
          infoIcons: new Map<string, HTMLElement>(),
        },
        controlActions: {
          apply: null,
          reset: null,
        },
      },
    },
  };
};
//#endregion

import {
  LfShapeeditorAdapter,
  LfShapeeditorAdapterControllerActions,
  LfShapeeditorAdapterControllerComputed,
  LfShapeeditorAdapterControllerGetters,
  LfShapeeditorAdapterControllerSetters,
  LfShapeeditorAdapterHandlers,
  LfShapeeditorAdapterJsx,
  LfShapeeditorAdapterRefs,
} from "@lf-widgets/foundations";
import { prepNavigation } from "./elements.navigation";
import { prepPreview } from "./elements.preview";
import { prepSettings } from "./elements.settings";
import { prepNavigationHandlers } from "./handlers.navigation";
import { prepPreviewHandlers } from "./handlers.preview";
import { prepSettingsHandlers } from "./handlers.settings";

/**
 * Creates the canonical adapter for lf-shapeeditor.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (toggles, batch changes)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks grouped by panel
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfShapeeditorAdapterControllerGetters,
  setters: Omit<LfShapeeditorAdapterControllerSetters, "spinnerStatus">,
  computed: LfShapeeditorAdapterControllerComputed,
  actions: LfShapeeditorAdapterControllerActions,
  getAdapter: () => LfShapeeditorAdapter,
): Omit<LfShapeeditorAdapter, "dispatcher"> => {
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
  setters: Omit<LfShapeeditorAdapterControllerSetters, "spinnerStatus">,
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterControllerSetters => {
  return {
    ...setters,
    spinnerStatus: (active: boolean) =>
      (getAdapter().elements.refs.preview.spinner.lfActive = active),
  } as unknown as LfShapeeditorAdapterControllerSetters;
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

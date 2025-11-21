import {
  LfButtonAdapter,
  LfButtonAdapterHandlers,
  LfButtonAdapterInitializerGetters,
  LfButtonAdapterJsx,
  LfButtonAdapterRefs,
} from "@lf-widgets/foundations";
import { prepButton } from "./elements.button";
import { prepSideButtonHandlers } from "./handlers.button";

//#region Adapter
export const createAdapter = (
  getters: LfButtonAdapterInitializerGetters,
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapter => {
  return {
    controller: {
      get: getters,
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
export const createSetters = (getAdapter: () => LfButtonAdapter) => {
  return {
    list: (state = "toggle") => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { manager } = controller.get;
      const { dropdown, list } = elements.refs;

      const { close, isInPortal, open } = manager.portal;

      switch (state) {
        case "close":
          close(list);
          break;
        case "open":
          open(list, dropdown);
          break;
        default:
          if (isInPortal(list)) {
            close(list);
          } else {
            open(list, dropdown);
          }
          break;
      }
    },
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterJsx => {
  return prepButton(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterHandlers => {
  return prepSideButtonHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfButtonAdapterRefs => {
  return {
    button: null,
    dropdown: null,
    dropdownRipple: null,
    icon: null,
    list: null,
    ripple: null,
  };
};
//#endregion

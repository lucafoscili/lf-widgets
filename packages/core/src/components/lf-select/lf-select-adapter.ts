import {
  LfSelectAdapter,
  LfSelectAdapterInitializerGetters,
  LfSelectAdapterInitializerSetters,
  LfSelectAdapterRefs,
} from "@lf-widgets/foundations";
import { prepSelectJsx } from "./elements.select";
import { prepSelectHandlers } from "./handlers.select";

//#region Adapter
export const createAdapter = (
  getters: LfSelectAdapterInitializerGetters,
  setters: LfSelectAdapterInitializerSetters,
  getAdapter: () => LfSelectAdapter,
): LfSelectAdapter => {
  const enhancedSetters = {
    ...setters,
    list: (state = "toggle") => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { manager } = controller.get;
      const { list, select, textfield } = elements.refs;

      const { close, isInPortal, open } = manager.portal;

      switch (state) {
        case "close":
          close(list);
          break;
        case "open":
          open(list, select, textfield);
          break;
        default:
          if (isInPortal(list)) {
            close(list);
          } else {
            open(list, select, textfield);
          }
          break;
      }
    },
  };

  return {
    controller: {
      get: getters,
      set: enhancedSetters,
    },
    elements: {
      jsx: prepSelectJsx(getAdapter),
      refs: prepRefs(),
    },
    handlers: prepSelectHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const prepRefs = (): LfSelectAdapterRefs => {
  return {
    list: null,
    select: null,
    textfield: null,
  };
};
//#endregion

import {
  LF_CARD_DEFAULTS,
  LfCardAdapter,
  LfCardAdapterControllerGetters,
  LfCardAdapterHandlers,
  LfCardAdapterInitializerGetters,
  LfCardAdapterJsx,
  LfCardAdapterRefs,
} from "@lf-widgets/foundations";
import { prepDebug } from "./elements.debug";
import { prepKeywords } from "./elements.keywords";
import { prepMaterial } from "./elements.material";
import { prepUpload } from "./elements.upload";
import { prepWeather } from "./elements.weather";
import { prepDebugHandlers } from "./handlers.debug";
import { prepKeywordsHandlers } from "./handlers.keywords";

export const createAdapter = (
  getters: LfCardAdapterInitializerGetters,
  getAdapter: () => LfCardAdapter,
): LfCardAdapter => {
  return {
    controller: {
      get: createGetters(getters, getAdapter),
    },
    elements: {
      jsx: { layouts: createJsx(getAdapter) },
      refs: createRefs(),
    },
    handlers: { layouts: createHandlers(getAdapter) },
  };
};
//#endregion

//#region Controller
export const createGetters = (
  getters: LfCardAdapterInitializerGetters,
  getAdapter: () => LfCardAdapter,
): LfCardAdapterControllerGetters => {
  return {
    ...getters,
    defaults: LF_CARD_DEFAULTS(getAdapter),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfCardAdapter,
): LfCardAdapterJsx["layouts"] => {
  return {
    debug: () => prepDebug(getAdapter),
    keywords: () => prepKeywords(getAdapter),
    material: () => prepMaterial(getAdapter),
    upload: () => prepUpload(getAdapter),
    weather: () => prepWeather(getAdapter),
  };
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfCardAdapter,
): LfCardAdapterHandlers["layouts"] => {
  return {
    debug: prepDebugHandlers(getAdapter),
    keywords: prepKeywordsHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const createRefs = (): LfCardAdapterRefs => {
  return {
    layouts: {
      debug: { button: null, code: null, toggle: null },
      keywords: { button: null, chip: null },
      material: null,
    },
  };
};
//#endregion

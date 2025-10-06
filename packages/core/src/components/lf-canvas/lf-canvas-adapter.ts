import {
  LfCanvasAdapter,
  LfCanvasAdapterHandlers,
  LfCanvasAdapterInitializerGetters,
  LfCanvasAdapterInitializerSetters,
  LfCanvasAdapterJsx,
  LfCanvasAdapterRefs,
  LfCanvasAdapterToolkit,
} from "@lf-widgets/foundations";
import { prepCanvasJsx } from "./elements.canvas";
import { prepCanvasHandlers } from "./handlers.canvas";
import { coordinates } from "./helpers.coordinates";
import { ctx } from "./helpers.ctx";
import { draw } from "./helpers.draw";

//#region Adapter
export const createAdapter = (
  getters: LfCanvasAdapterInitializerGetters,
  setters: LfCanvasAdapterInitializerSetters,
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapter => {
  return {
    controller: {
      get: getters,
      set: setters,
    },
    elements: {
      jsx: createJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
    toolkit: getToolkit(getAdapter),
  };
};
//#endregion

//#region Elements
export const createJsx = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterJsx => {
  return prepCanvasJsx(getAdapter);
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterHandlers => {
  return prepCanvasHandlers(getAdapter);
};
//#endregion

//#region Refs
export const createRefs = (): LfCanvasAdapterRefs => {
  return {
    board: null,
    image: null,
    preview: null,
  };
};
//#endregion

//#region Toolkit
export const getToolkit = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterToolkit => ({
  ctx: ctx(getAdapter),
  coordinates,
  draw: draw(getAdapter),
});
//#endregion

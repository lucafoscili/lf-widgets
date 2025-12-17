import {
  LfCanvasAdapter,
  LfCanvasAdapterControllerActions,
  LfCanvasAdapterControllerComputed,
  LfCanvasAdapterControllerGetters,
  LfCanvasAdapterControllerSetters,
  LfCanvasAdapterHandlers,
  LfCanvasAdapterJsx,
  LfCanvasAdapterRefs,
  LfCanvasAdapterToolkit,
} from "@lf-widgets/foundations";
import { prepCanvasActions } from "./actions.canvas";
import { prepCanvasComputed } from "./computed.canvas";
import { prepCanvasJsx } from "./elements.canvas";
import { prepCanvasHandlers } from "./handlers.canvas";
import { coordinates } from "./helpers.coordinates";
import { ctx } from "./helpers.ctx";
import { draw } from "./helpers.draw";

//#region Adapter
/**
 * Creates the canvas adapter with all four controller domains.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (clear, finalize, etc.)
 *
 * @param getters - Controller getters for state reads
 * @param setters - Controller setters for state mutations
 * @param getAdapter - Function returning the adapter instance
 * @returns Adapter without dispatcher (dispatcher is added inline in component)
 */
export const createAdapter = (
  getters: LfCanvasAdapterControllerGetters,
  setters: LfCanvasAdapterControllerSetters,
  getAdapter: () => LfCanvasAdapter,
): Omit<LfCanvasAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: setters,
      computed: createComputed(getAdapter),
      actions: createActions(getAdapter),
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

//#region Computed
export const createComputed = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterControllerComputed => {
  return prepCanvasComputed(getAdapter);
};
//#endregion

//#region Actions
export const createActions = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterControllerActions => {
  return prepCanvasActions(getAdapter);
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
    canvas: null,
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

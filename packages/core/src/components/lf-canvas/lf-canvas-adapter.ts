import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
  LF_CANVAS_BLOCKS,
  LF_CANVAS_IDS,
  LF_CANVAS_PARTS,
  LfCanvasAdapter,
  LfCanvasAdapterControllerActions,
  LfCanvasAdapterControllerComputed,
  LfCanvasAdapterHandlers,
  LfCanvasAdapterJsx,
  LfCanvasAdapterRefs,
  LfCanvasAdapterToolkit,
  LfCanvasBoxing,
  LfCanvasOrientation,
  LfCanvasPoints,
  LfFrameworkInterface,
} from "@lf-widgets/foundations";
import { prepCanvasActions } from "./actions.canvas";
import { prepCanvasComputed } from "./computed.canvas";
import { prepCanvasJsx } from "./elements.canvas";
import { prepCanvasHandlers } from "./handlers.canvas";
import { coordinates } from "./helpers.coordinates";
import { ctx } from "./helpers.ctx";
import { draw } from "./helpers.draw";
import { LfCanvas } from "./lf-canvas";

//#region Adapter
/**
 * Creates the canvas adapter with all four controller domains.
 *
 * v4.0.0 "Adapter as Core" Architecture:
 * - State lives in adapter closure, WC becomes thin shell
 * - controller.get: Pure state reads from closure (ALL must be functions `() => T`)
 * - controller.set: Write to closure + trigger onStateChange
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (clear, finalize, etc.)
 *
 * @param getComp - Function returning the component instance
 * @param getFramework - Function returning the framework instance
 * @param onStateChange - Callback to trigger re-render when closure state changes
 * @returns Adapter without dispatcher (dispatcher is added inline in component)
 */
export const createAdapter = (
  getComp: () => LfCanvas,
  getFramework: () => LfFrameworkInterface,
  onStateChange: () => void,
): Omit<LfCanvasAdapter, "dispatcher"> => {
  //#region Closure state
  let _boxing: LfCanvasBoxing = null;
  let _isPainting = false;
  let _orientation: LfCanvasOrientation = null;
  let _points: LfCanvasPoints = [];
  //#endregion

  // Adapter reference for lazy initialization
  let _adapter: LfCanvasAdapter | null = null;
  const getAdapter = () => _adapter!;

  const adapterCore: Omit<LfCanvasAdapter, "dispatcher"> = {
    controller: {
      get: {
        blocks: () => LF_CANVAS_BLOCKS.canvas,
        compInstance: () => getComp(),
        cyAttributes: () => CY_ATTRIBUTES,
        framework: () => getFramework(),
        ids: () => LF_CANVAS_IDS.canvas,
        lfAttributes: () => LF_ATTRIBUTES,
        parts: () => LF_CANVAS_PARTS,
        // Closure state getters
        boxing: () => _boxing,
        isPainting: () => _isPainting,
        orientation: () => _orientation,
        points: () => _points,
      },
      set: {
        boxing: (value) => {
          _boxing = value;
          onStateChange();
        },
        isPainting: (value) => {
          _isPainting = value;
          onStateChange();
        },
        orientation: (value) => {
          _orientation = value;
          onStateChange();
        },
        points: (value) => {
          _points = [...value]; // Clone for reactivity
          onStateChange();
        },
      },
      computed: null as unknown as LfCanvasAdapterControllerComputed,
      actions: null as unknown as LfCanvasAdapterControllerActions,
    },
    elements: {
      jsx: null as unknown as LfCanvasAdapterJsx,
      refs: createRefs(),
    },
    handlers: null as unknown as LfCanvasAdapterHandlers,
    toolkit: null as unknown as LfCanvasAdapterToolkit,
  };

  // Initialize computed, actions, handlers, jsx, toolkit after adapter is created
  adapterCore.controller.computed = createComputed(getAdapter);
  adapterCore.controller.actions = createActions(getAdapter);
  adapterCore.elements.jsx = createJsx(getAdapter);
  adapterCore.handlers = createHandlers(getAdapter);
  adapterCore.toolkit = getToolkit(getAdapter);

  // Store reference for getAdapter
  _adapter = adapterCore as LfCanvasAdapter;

  return adapterCore;
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

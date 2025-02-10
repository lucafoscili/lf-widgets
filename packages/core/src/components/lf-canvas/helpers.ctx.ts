import {
  LfCanvasAdapter,
  LfCanvasAdapterToolkitCtx,
  LfCanvasType,
} from "@lf-widgets/foundations";

/**
 * Creates a canvas toolkit context object for handling canvas operations.
 *
 * @param getAdapter - A function that returns the LfCanvasAdapter instance
 * @returns An object containing methods for canvas operations:
 *   - clear: Clears the specified canvas type
 *   - get: Retrieves the canvas context and dimensions for the specified type
 *   - redraw: Redraws the canvas content based on stored points
 *   - setup: Configures the canvas context with current drawing settings
 *
 * The toolkit context provides essential methods for managing both the main board
 * and preview canvases, handling operations like clearing, getting context,
 * redrawing content, and setting up drawing parameters.
 */
export const ctx = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterToolkitCtx => ({
  //#region Clear
  clear: (type: LfCanvasType) => {
    const { ctx, height, width } = getAdapter().toolkit.ctx.get(type);

    ctx.clearRect(0, 0, width, height);
  },
  //#endregion

  //#region Get
  get: (type: LfCanvasType) => {
    const { board, preview } = getAdapter().elements.refs;

    const canvas = type === "board" ? board : preview;
    const ctx = canvas.getContext("2d");
    const { height, width } = ctx.canvas;

    return { ctx, height, width };
  },
  //#endregion

  //#region Redraw
  redraw: (type: LfCanvasType) => {
    const { controller, toolkit } = getAdapter();
    const { points } = controller.get;

    const { ctx, height, width } = toolkit.ctx.get(type);
    toolkit.ctx.clear(type);
    toolkit.ctx.setup(type);

    const pts = points();
    if (pts.length === 1) {
      const singlePoint = pts[0];
      const x = singlePoint.x * width;
      const y = singlePoint.y * height;
      toolkit.draw.shape(type, x, y, true);
    } else if (pts.length > 1) {
      ctx.beginPath();
      const firstPoint = pts[0];
      ctx.moveTo(firstPoint.x * width, firstPoint.y * height);

      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        ctx.lineTo(p.x * width, p.y * height);
      }

      ctx.stroke();
    }
  },
  //#endregion

  //#region Setup
  setup: (type: LfCanvasType, isFill = false) => {
    const { controller, toolkit } = getAdapter();
    const { lfColor, lfOpacity, lfSize } = controller.get.compInstance;

    const { ctx } = toolkit.ctx.get(type);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lfOpacity;
    ctx.globalCompositeOperation = "source-over";

    if (isFill) {
      ctx.fillStyle = lfColor;
    } else {
      ctx.strokeStyle = lfColor;
      ctx.lineWidth = lfSize;
    }
  },
  //#endregion
});

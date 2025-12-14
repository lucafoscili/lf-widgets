import {
  LfCanvasAdapter,
  LfCanvasAdapterControllerActions,
  LfCanvasType,
} from "@lf-widgets/foundations";

/**
 * Factory function that creates action methods for the canvas adapter.
 * Contains multi-step operations that may batch changes or have side effects.
 *
 * @param getAdapter - Function returning the canvas adapter instance
 * @returns Object containing action methods
 */
export const prepCanvasActions = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterControllerActions => ({
  //#region clearCanvas
  /**
   * Clears the specified canvas type and optionally resets points state.
   * @param type - Canvas type to clear ("board" or "preview"), defaults to "board"
   */
  clearCanvas: (type: LfCanvasType = "board") => {
    const { controller, toolkit } = getAdapter();
    const { set } = controller;

    toolkit.ctx.clear(type);

    // Reset points when clearing board
    if (type === "board") {
      set.points([]);
    }
  },
  //#endregion

  //#region finalizeStroke
  /**
   * Finalizes the current stroke by committing points to the board canvas.
   * Handles both single-point (shape) and multi-point (path) strokes.
   */
  finalizeStroke: () => {
    const { controller, toolkit } = getAdapter();
    const { computed, get } = controller;

    const pts = get.points();
    if (pts.length === 0) return;

    const { height, width } = toolkit.ctx.get("board");

    if (pts.length === 1) {
      // Single point - draw filled shape
      toolkit.ctx.setup("board", true);
      const singlePoint = pts[0];
      const x = singlePoint.x * width;
      const y = singlePoint.y * height;
      toolkit.draw.shape("board", x, y, true);
    } else {
      // Multiple points - draw stroke path
      toolkit.ctx.setup("board");
      const { ctx } = toolkit.ctx.get("board");

      ctx.beginPath();
      const firstPoint = pts[0];
      ctx.moveTo(firstPoint.x * width, firstPoint.y * height);

      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        ctx.lineTo(p.x * width, p.y * height);
      }
      ctx.stroke();
    }

    // Clear preview if active
    if (computed.isCursorPreview() || get.compInstance().lfPreview) {
      toolkit.ctx.clear("preview");
    }
  },
  //#endregion

  //#region setupContext
  /**
   * Sets up canvas context with current drawing settings.
   * @param type - Canvas type to setup ("board" or "preview")
   * @param isFill - Whether to set up for fill (true) or stroke (false)
   */
  setupContext: (type: LfCanvasType, isFill = false) => {
    const { toolkit } = getAdapter();
    toolkit.ctx.setup(type, isFill);
  },
  //#endregion

  //#region redrawPreview
  /**
   * Clears and redraws the preview canvas with current points.
   */
  redrawPreview: () => {
    const { toolkit } = getAdapter();
    toolkit.ctx.redraw("preview");
  },
  //#endregion
});

import {
  LfCanvasAdapter,
  LfCanvasAdapterToolkitDraw,
  LfCanvasType,
} from "@lf-widgets/foundations";

/**
 * Factory function that creates a drawing toolkit for the canvas adapter.
 * Contains methods for cursor preview, shape drawing, and point tracking.
 *
 * @param getAdapter - A function that returns the canvas adapter instance
 * @returns An object containing drawing methods:
 *  - cursor: Handles cursor preview drawing based on pointer events
 *  - shape: Draws shapes (round/square) on specified canvas context
 *  - point: Tracks and stores pointer coordinates
 *
 * @example
 * const drawToolkit = draw(() => myCanvasAdapter);
 * drawToolkit.cursor(pointerEvent); // Draws cursor preview
 * drawToolkit.shape('preview', 100, 100); // Draws shape at coordinates
 * drawToolkit.point(pointerEvent); // Tracks point
 */
export const draw = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterToolkitDraw => ({
  //#region Cursor
  cursor: (e: PointerEvent) => {
    const { elements, toolkit } = getAdapter();
    const { board } = elements.refs;

    toolkit.ctx.clear("preview");

    const rect = board.getBoundingClientRect();
    const { x, y } = toolkit.coordinates.get(e, rect);

    toolkit.ctx.setup("preview", true);
    toolkit.draw.shape("preview", x, y, true);
  },
  //#endregion

  //#region Point
  point: (e: PointerEvent) => {
    const { controller, elements, toolkit } = getAdapter();
    const { board } = elements.refs;
    const { points } = controller.get;

    const rect = board.getBoundingClientRect();

    const { x, y } = toolkit.coordinates.normalize(e, rect);
    points().push({ x, y });
  },
  //#endregion

  //#region Shape
  shape: (type: LfCanvasType, x: number, y: number, isFill = true) => {
    const { controller, toolkit } = getAdapter();
    const { lfBrush, lfSize } = controller.get.compInstance;

    const { ctx } = toolkit.ctx.get(type);

    ctx.beginPath();
    switch (lfBrush) {
      case "round":
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.arc(x, y, lfSize / 2, 0, Math.PI * 2);
        break;
      case "square":
        ctx.lineJoin = "miter";
        ctx.lineCap = "butt";
        const halfSize = lfSize / 2;
        ctx.rect(
          Math.round(x) - halfSize,
          Math.round(y) - halfSize,
          lfSize,
          lfSize,
        );
        break;
    }

    if (isFill) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  },
  //#endregion
});

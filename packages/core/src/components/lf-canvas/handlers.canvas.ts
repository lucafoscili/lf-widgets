import {
  LfCanvasAdapter,
  LfCanvasAdapterHandlers,
} from "@lf-widgets/foundations";
import { calcOrientation } from "./helpers.utils";
import { LfCanvas } from "./lf-canvas";

export const prepCanvasHandlers = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterHandlers => {
  return {
    board: {
      //#region endCapture
      endCapture: (e) => {
        e.preventDefault();

        const { controller, dispatcher, elements, toolkit } = getAdapter();
        const { computed, get, set } = controller;
        const { compInstance, points } = get;
        const { isCursorPreview } = computed;
        const { board } = elements.refs;
        const { lfPreview } = compInstance();

        board.releasePointerCapture(e.pointerId);
        const { ctx, height, width } = toolkit.ctx.get("board");

        const pts = points();
        if (pts.length > 0) {
          if (pts.length === 1) {
            toolkit.ctx.setup("board", true);

            const singlePoint = pts[0];
            const x = singlePoint.x * width;
            const y = singlePoint.y * height;

            toolkit.draw.shape("board", x, y, true);
          } else {
            toolkit.ctx.setup("board");

            ctx.beginPath();
            const firstPoint = pts[0];
            ctx.moveTo(firstPoint.x * width, firstPoint.y * height);

            for (let i = 1; i < pts.length; i++) {
              const p = pts[i];
              ctx.lineTo(p.x * width, p.y * height);
            }
            ctx.stroke();
          }
        }

        if (isCursorPreview() || lfPreview) {
          toolkit.ctx.clear("preview");
        }

        dispatcher.emit("stroke", { originalEvent: e });

        set.isPainting(false);
      },
      //#endregion

      //#region onPointerDown
      onPointerDown: (e) => {
        e.preventDefault();

        const { controller, elements, toolkit } = getAdapter();
        const { set } = controller;
        const { board } = elements.refs;

        board.setPointerCapture(e.pointerId);
        requestAnimationFrame(() => {
          set.isPainting(true);
          set.points([]);

          toolkit.draw.point(e);
        });
      },
      //#endregion

      //#region onPointerMove
      onPointerMove: (e) => {
        e.preventDefault();

        const { controller, toolkit } = getAdapter();
        const { computed, get } = controller;
        const { compInstance, isPainting } = get;
        const { isCursorPreview } = computed;
        const { lfPreview } = compInstance();

        if (isPainting()) {
          if (isCursorPreview()) {
            toolkit.draw.cursor(e);
          }

          toolkit.draw.point(e);

          if (lfPreview) {
            toolkit.ctx.redraw("preview");
          }
        } else {
          if (isCursorPreview()) {
            toolkit.draw.cursor(e);
          }
        }
      },
      //#endregion

      //#region onPointerOut
      onPointerOut: (e) => {
        const { controller, handlers } = getAdapter();
        const { isPainting } = controller.get;
        const { endCapture } = handlers.board;

        if (isPainting()) {
          endCapture(e);
        }
      },
      onPointerUp: (e: PointerEvent) => {
        const { handlers } = getAdapter();
        const { endCapture } = handlers.board;

        endCapture(e);
      },
      //#endregion
    },

    //#region Image
    image: {
      onLoad: async (e) => {
        const adapter = getAdapter();
        const { controller, dispatcher } = adapter;
        const { get, set } = controller;
        const { compInstance } = get;

        const image = e.target as HTMLImageElement;
        if (image) {
          const orientation = calcOrientation(image);
          set.orientation(orientation);
          // Recalculate boxing now that image dimensions are available
          await (compInstance() as LfCanvas).resizeCanvas();
        }
        dispatcher.emit("lf-event", {
          originalEvent: e as Event & CustomEvent,
        });
      },
    },
    //#endregion
  };
};

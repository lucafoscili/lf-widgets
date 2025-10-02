import {
  LfCanvasAdapter,
  LfCanvasAdapterHandlers,
  LfCanvasOrientation,
} from "@lf-widgets/foundations";
import { LfCanvas } from "./lf-canvas";

export const prepCanvasHandlers = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterHandlers => {
  return {
    board: {
      //#region endCapture
      endCapture: (e) => {
        e.preventDefault();

        const { controller, elements, toolkit } = getAdapter();
        const { get, set } = controller;
        const { compInstance, isCursorPreview, points } = get;
        const { board } = elements.refs;
        const { lfPreview } = compInstance;

        const comp = compInstance as LfCanvas;

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

        comp.onLfEvent(e, "stroke");

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
        const { compInstance, isCursorPreview, isPainting } = controller.get;
        const { lfPreview } = compInstance;

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
        const { controller } = adapter;
        const { get, set } = controller;
        const { compInstance } = get;

        const image = await e.detail.comp.getImage();
        if (image) {
          if (image instanceof HTMLImageElement) {
            const { naturalWidth, naturalHeight } = image;
            const orientation: LfCanvasOrientation =
              naturalWidth > naturalHeight ? "landscape" : "portrait";

            set.orientation(orientation);
          } else if (image instanceof SVGElement) {
            const svgGraphics = image as SVGGraphicsElement;
            let w = 0;
            let h = 0;

            try {
              const bbox = svgGraphics.getBBox ? svgGraphics.getBBox() : null;
              if (bbox && bbox.width && bbox.height) {
                w = bbox.width;
                h = bbox.height;
              }
            } catch {
              // getBBox can throw for certain SVGs, fall back to attributes
            }

            if (w === 0 || h === 0) {
              const attrW = (image as SVGElement).getAttribute("width");
              const attrH = (image as SVGElement).getAttribute("height");
              w = w || parseFloat(attrW ?? "0");
              h = h || parseFloat(attrH ?? "0");
            }

            if (w > 0 && h > 0) {
              const orientation: LfCanvasOrientation =
                w >= h ? "landscape" : "portrait";
              set.orientation(orientation);
            }
          } else {
            // fallback for other element-like objects
            const anyImg = image as any;
            const nw = anyImg.naturalWidth ?? anyImg.width ?? 0;
            const nh = anyImg.naturalHeight ?? anyImg.height ?? 0;
            if (nw > 0 && nh > 0) {
              const orientation: LfCanvasOrientation =
                nw >= nh ? "landscape" : "portrait";
              set.orientation(orientation);
            }
          }
        }
        (compInstance as LfCanvas).onLfEvent(e, "lf-event");
      },
    },
    //#endregion
  };
};

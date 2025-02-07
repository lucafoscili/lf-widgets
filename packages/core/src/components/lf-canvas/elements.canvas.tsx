import { LfCanvasAdapter, LfCanvasAdapterJsx } from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepCanvasJsx = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterJsx => {
  return {
    //#region Board
    board: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;
      const { onPointerDown, onPointerMove, onPointerOut, onPointerUp } =
        handlers.board;

      return (
        <canvas
          class={bemClass(blocks.canvas._, blocks.canvas.board)}
          data-cy={cyAttributes.canvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerOut={onPointerOut}
          onPointerUp={onPointerUp}
          part={parts.board}
          ref={assignRef(refs, "board")}
        ></canvas>
      );
    },
    //#endregion

    //#region Image
    image: () => {
      const { controller, elements } = getAdapter();
      const { refs } = elements;
      const { blocks, compInstance, cyAttributes, manager, parts } =
        controller.get;
      const { assignRef, sanitizeProps, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-image
          {...sanitizeProps(compInstance.lfImageProps, "LfImage")}
          class={bemClass(blocks.canvas._, blocks.canvas.image)}
          data-cy={cyAttributes.image}
          part={parts.image}
          ref={assignRef(refs, "image")}
        ></lf-image>
      );
    },
    //#endregion

    //#region Preview
    preview: () => {
      const { controller, elements } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { assignRef, theme } = manager;
      const { refs } = elements;
      const { bemClass } = theme;

      return (
        <canvas
          class={bemClass(blocks.canvas._, blocks.canvas.preview)}
          data-cy={cyAttributes.canvas}
          part={parts.preview}
          ref={assignRef(refs, "preview")}
        ></canvas>
      );
    },
    //#endregion
  };
};

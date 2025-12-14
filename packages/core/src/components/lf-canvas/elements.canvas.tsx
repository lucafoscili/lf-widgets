import {
  LfCanvasAdapter,
  LfCanvasAdapterJsx,
  LfImageEventPayload,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepCanvasJsx = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterJsx => {
  return {
    //#region Board
    board: () => {
      const { controller, elements, handlers } = getAdapter();
      const { refs } = elements;
      const { blocks, cyAttributes, framework, parts } = controller.get;
      const { assignRef, theme } = framework();
      const { bemClass } = theme;
      const { onPointerDown, onPointerMove, onPointerOut, onPointerUp } =
        handlers.board;

      return (
        <canvas
          class={bemClass(blocks()._, blocks().board)}
          data-cy={cyAttributes().canvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerOut={onPointerOut}
          onPointerUp={onPointerUp}
          part={parts().board}
          ref={assignRef(refs, "board")}
        ></canvas>
      );
    },
    //#endregion

    //#region Image
    image: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, framework, parts } =
        controller.get;
      const { refs } = elements;
      const { onLoad } = handlers.image;
      const onImageEvent = (event: CustomEvent<LfImageEventPayload>) => {
        const { eventType } = event.detail;

        switch (eventType) {
          case "load":
            void onLoad(event);
            break;
        }
      };
      const { assignRef, sanitizeProps, theme } = framework();
      const { bemClass } = theme;

      return (
        <lf-image
          {...sanitizeProps(compInstance().lfImageProps, "LfImage")}
          class={bemClass(blocks()._, blocks().image)}
          data-cy={cyAttributes().image}
          onLf-image-event={onImageEvent}
          part={parts().image}
          ref={assignRef(refs, "image")}
        ></lf-image>
      );
    },
    //#endregion

    //#region Preview
    preview: () => {
      const { controller, elements } = getAdapter();
      const { blocks, cyAttributes, framework, parts } = controller.get;
      const { assignRef, theme } = framework();
      const { refs } = elements;
      const { bemClass } = theme;

      return (
        <canvas
          class={bemClass(blocks()._, blocks().preview)}
          data-cy={cyAttributes().canvas}
          part={parts().preview}
          ref={assignRef(refs, "preview")}
        ></canvas>
      );
    },
    //#endregion
  };
};

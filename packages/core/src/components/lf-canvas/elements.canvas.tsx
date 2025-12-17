import {
  LfCanvasAdapter,
  LfCanvasAdapterJsx,
  LF_IMAGE_BLOCKS,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfImageFC } from "../lf-image/lf-image-fc";

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
      const { blocks, compInstance, framework } = controller.get;
      const { refs } = elements;
      const { onLoad } = handlers.image;
      const { assignRef, theme } = framework();
      const { bemClass } = theme;

      const imageBlocks = LF_IMAGE_BLOCKS;
      const imageProps = compInstance().lfImageProps ?? {};

      return (
        <LfImageFC
          className={bemClass(blocks()._, blocks().image)}
          framework={framework()}
          imageRef={(el) => {
            if (el) {
              assignRef(refs, "image")(el);
            }
          }}
          onLoad={(e) => void onLoad(e)}
          sizeX={imageProps.lfSizeX}
          sizeY={imageProps.lfSizeY}
          style={{
            ["--" + imageBlocks.image._.replace("lf-", "lf_") + "_object_fit"]:
              "var(--lf-canvas-object-fit, contain)",
          }}
          uiState={imageProps.lfUiState}
          value={imageProps.lfValue}
        />
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

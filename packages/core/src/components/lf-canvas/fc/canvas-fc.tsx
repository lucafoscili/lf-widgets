import { LfCanvasAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { LfCanvasFC } from "../lf-canvas-fc";

//#region Props
export interface CanvasFCProps {
  adapter: LfCanvasAdapter;
}
//#endregion

/**
 * FC for the canvas component wrapper.
 * Per Section 5.9 "Mirroring Rule" - receives adapter and renders pure UI.
 * Composes LfCanvasFC (pure presentational) with adapter state.
 */
export const CanvasFC: FunctionalComponent<CanvasFCProps> = ({ adapter }) => {
  const { controller, elements } = adapter;
  const { get, computed } = controller;

  const framework = get.framework();
  const { assignRef } = framework;
  const { refs, jsx } = elements;

  const { isCursorPreview, shouldRenderPreview } = computed;

  return (
    <LfCanvasFC
      boardElement={jsx.board()}
      canvasRef={assignRef(refs, "canvas")}
      framework={framework}
      imageElement={jsx.image()}
      isCursorPreview={isCursorPreview()}
      previewElement={jsx.preview()}
      showPreview={shouldRenderPreview()}
    />
  );
};

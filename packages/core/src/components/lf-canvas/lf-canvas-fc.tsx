import {
  LF_CANVAS_BLOCKS,
  LF_CANVAS_PARTS,
  LfCanvasFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfCanvasFC - Functional Component for Canvas
 *
 * This is a stateless functional component that renders a canvas drawing surface.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-canvas Web Component (thin wrapper)
 * 2. Inside other components like imageeditor (composed usage)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfCanvasFC: FunctionalComponent<LfCanvasFCProps> = ({
  boardElement,
  canvasRef,
  className,
  framework,
  id,
  imageElement,
  isCursorPreview = false,
  previewElement,
  showPreview = false,
  style,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_CANVAS_BLOCKS;
  const parts = LF_CANVAS_PARTS;

  const { canvas } = blocks;

  return (
    <div
      class={`${bemClass(canvas._, null, { hidden: isCursorPreview })}${className ? ` ${className}` : ""}`}
      id={id}
      part={parts.canvas}
      ref={canvasRef}
      style={style}
    >
      {imageElement}
      {boardElement}
      {showPreview && previewElement}
    </div>
  );
};

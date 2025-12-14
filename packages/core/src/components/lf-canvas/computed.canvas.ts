import {
  LfCanvasAdapter,
  LfCanvasAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory function that creates computed properties for the canvas adapter.
 * Contains derived values and predicates computed from state.
 * All functions are pure with no side effects.
 *
 * @param getAdapter - Function returning the canvas adapter instance
 * @returns Object containing computed property functions
 */
export const prepCanvasComputed = (
  getAdapter: () => LfCanvasAdapter,
): LfCanvasAdapterControllerComputed => ({
  //#region isCursorPreview
  /**
   * Checks if the cursor preview mode is enabled.
   * @returns True if cursor is set to "preview", false otherwise
   */
  isCursorPreview: () => {
    const { controller } = getAdapter();
    const { compInstance } = controller.get;
    return compInstance().lfCursor === "preview";
  },
  //#endregion

  //#region shouldRenderPreview
  /**
   * Checks if preview canvas should be rendered.
   * Preview is rendered when cursor preview is active OR lfPreview prop is true.
   * @returns True if preview should be rendered
   */
  shouldRenderPreview: () => {
    const { controller } = getAdapter();
    const { computed, get } = controller;
    const { compInstance } = get;
    return computed.isCursorPreview() || compInstance().lfPreview;
  },
  //#endregion

  //#region isDrawing
  /**
   * Checks if currently drawing a stroke (alias for isPainting state).
   * @returns True if actively drawing
   */
  isDrawing: () => {
    const { controller } = getAdapter();
    const { isPainting } = controller.get;
    return isPainting();
  },
  //#endregion

  //#region hasPoints
  /**
   * Checks if canvas has any points in the current stroke.
   * @returns True if points array has at least one point
   */
  hasPoints: () => {
    const { controller } = getAdapter();
    const { points } = controller.get;
    return points().length > 0;
  },
  //#endregion
});

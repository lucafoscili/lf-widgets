import {
  LfMasonryAdapterControllerComputed,
  LfMasonryAdapterControllerGetters,
} from "@lf-widgets/foundations";

/**
 * Creates computed properties for the masonry adapter.
 * These are derived values and predicates computed from state.
 * Pure functions with no side effects.
 *
 * @param getters - The controller getters to derive computed values from
 * @returns The computed properties object
 */
export const createComputed = (
  getters: LfMasonryAdapterControllerGetters,
): LfMasonryAdapterControllerComputed => {
  return {
    //#region hasShapes
    /**
     * Predicate: whether the component has any shapes for the current shape type.
     * @returns true if shapes exist for the current shape type
     */
    hasShapes: () => {
      const shapes = getters.shapes();
      const comp = getters.compInstance();
      return !!shapes?.[comp.lfShape]?.length;
    },
    //#endregion

    //#region hasSelection
    /**
     * Predicate: whether any shape is currently selected.
     * @returns true if a shape is selected
     */
    hasSelection: () => {
      const selectedShape = getters.selectedShape();
      return selectedShape?.index !== undefined;
    },
    //#endregion

    //#region isSelected
    /**
     * Predicate: whether a specific index is currently selected.
     * @param index - The index to check
     * @returns true if the specified index is selected
     */
    isSelected: (index: number) => {
      const selectedShape = getters.selectedShape();
      return selectedShape?.index === index;
    },
    //#endregion

    //#region isMasonry
    /**
     * Predicate: whether the current view is masonry mode.
     * @returns true if view is "main" (masonry layout)
     */
    isMasonry: () => {
      return getters.view() === "main";
    },
    //#endregion

    //#region isVertical
    /**
     * Predicate: whether the current view is vertical mode.
     * @returns true if view is "vertical"
     */
    isVertical: () => {
      return getters.view() === "vertical";
    },
    //#endregion
  };
};

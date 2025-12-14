import {
  LfMasonryAdapter,
  LfMasonryAdapterControllerActions,
  LfMasonrySelectedShape,
} from "@lf-widgets/foundations";

/**
 * Creates action functions for the masonry adapter.
 * These are multi-step operations that may batch changes or toggle state.
 * May have side effects.
 *
 * @param getAdapter - Function to get the current adapter instance
 * @returns The actions object
 */
export const createActions = (
  getAdapter: () => LfMasonryAdapter,
): LfMasonryAdapterControllerActions => {
  return {
    //#region select
    /**
     * Select a shape by index.
     * Updates the selection state and emits click event.
     * @param index - The index of the shape to select
     */
    select: (index: number) => {
      const adapter = getAdapter();
      const { get, set } = adapter.controller;
      const { dispatcher } = adapter;

      const shapes = get.shapes();
      const comp = get.compInstance();
      const shape = shapes?.[comp.lfShape]?.[index];

      if (shape) {
        const newState: LfMasonrySelectedShape = {
          index,
          shape,
        };
        set.selectedShape(newState);

        dispatcher.emit("click", {
          selectedShape: newState,
        });
      }
    },
    //#endregion

    //#region clearSelection
    /**
     * Clear the current selection.
     * Resets the selected shape to an empty state.
     */
    clearSelection: () => {
      const adapter = getAdapter();
      const { set } = adapter.controller;

      set.selectedShape({});
    },
    //#endregion

    //#region toggleSelection
    /**
     * Toggle selection for an index.
     * If the index is already selected, clears the selection.
     * Otherwise, selects the specified index.
     * @param index - The index to toggle
     */
    toggleSelection: (index: number) => {
      const adapter = getAdapter();
      const { computed, actions } = adapter.controller;

      if (computed.isSelected(index)) {
        actions.clearSelection();
      } else {
        actions.select(index);
      }
    },
    //#endregion

    //#region cycleView
    /**
     * Cycle through view modes: main -> vertical -> horizontal -> main.
     */
    cycleView: () => {
      const adapter = getAdapter();
      const { computed, set } = adapter.controller;
      const { compInstance } = adapter.controller.get;

      const comp = compInstance();

      if (computed.isMasonry()) {
        comp.lfView = "vertical";
        set.view("vertical");
      } else if (computed.isVertical()) {
        comp.lfView = "horizontal";
        set.view("horizontal");
      } else {
        comp.lfView = "main";
        set.view("main");
      }
    },
    //#endregion

    //#region addColumn
    /**
     * Add a column to the masonry layout.
     * Increments the column count by 1.
     */
    addColumn: () => {
      const adapter = getAdapter();
      const { get } = adapter.controller;

      const current = get.currentColumns();
      const comp = get.compInstance();
      comp.lfColumns = current + 1;
    },
    //#endregion

    //#region removeColumn
    /**
     * Remove a column from the masonry layout.
     * Decrements the column count by 1, minimum 1.
     */
    removeColumn: () => {
      const adapter = getAdapter();
      const { get } = adapter.controller;

      const current = get.currentColumns();
      const comp = get.compInstance();

      if (current > 1) {
        comp.lfColumns = current - 1;
      }
    },
    //#endregion
  };
};

import { LfMasonryAdapter } from "@lf-widgets/foundations";

/**
 * @deprecated Use adapter.controller.actions.addColumn() instead
 * Increment the masonry component's column count by one.
 */
export const addColumn = async (adapter: LfMasonryAdapter) => {
  adapter.controller.actions.addColumn();
};

/**
 * @deprecated Use adapter.controller.actions.removeColumn() instead
 * Decrements the column count of an LfMasonry component by one.
 */
export const removeColumn = async (adapter: LfMasonryAdapter) => {
  adapter.controller.actions.removeColumn();
};

/**
 * @deprecated Use adapter.controller.actions.cycleView() instead
 * Changes the view mode of the masonry component.
 */
export const changeView = async (adapter: LfMasonryAdapter) => {
  adapter.controller.actions.cycleView();
};

import { LfMasonryAdapter } from "@lf-widgets/foundations";
import { LfMasonry } from "./lf-masonry";

//#region addColumn
/**
 * Increment the masonry component's column count by one.
 *
 * @remarks
 * This function retrieves the masonry controller via the provided adapter,
 * reads the current number of columns using `currentColumns()`, casts the
 * controller's `compInstance` to `LfMasonry`, and sets `comp.lfColumns` to
 * `current + 1`.
 *
 * The function is declared `async` but does not perform any asynchronous
 * operations internally, so it returns an already-resolved `Promise<void>`.
 *
 * @param adapter - The `LfMasonryAdapter` providing access to the controller and component.
 * @returns A `Promise<void>` that resolves once the component's column count has been updated.
 *
 * @throws If `adapter`, the controller returned by `adapter.controller`, or the
 * values returned by `get` are missing or not of the expected shape.
 */
export const addColumn = async (adapter: LfMasonryAdapter) => {
  const { get } = adapter.controller;
  const { compInstance, currentColumns } = get;

  const current = currentColumns();
  const comp = compInstance as LfMasonry;
  comp.lfColumns = current + 1;
};
//#endregion

//#region removeColumn
/**
 * Decrements the column count of an LfMasonry component by one, if the current count is greater than 1.
 *
 * This function obtains the component instance and a callback to read the current column count
 * from the provided adapter. If the current column count is greater than 1, it updates the
 * component's `lfColumns` property to `current - 1`. The function is declared `async` for
 * compatibility with potential future asynchronous behavior but currently performs a synchronous update.
 *
 * No changes are made when the current column count is 1 or less.
 *
 * @param adapter - The LfMasonryAdapter used to access the controller and component instance.
 * @async
 * @returns A Promise that resolves when the operation completes.
 */
export const removeColumn = async (adapter: LfMasonryAdapter) => {
  const { get } = adapter.controller;
  const { compInstance, currentColumns } = get;

  const comp = compInstance as LfMasonry;

  const current = currentColumns();
  if (current > 1) {
    comp.lfColumns = current - 1;
  }
};
//#endregion

//#region changeView
/**
 * Changes the view mode of the masonry component based on current state.
 * Cycles through masonry -> vertical -> horizontal -> masonry views.
 * @param adapter - The masonry adapter instance containing component and controller
 * @async
 * @returns {Promise<void>}
 */
export const changeView = async (adapter: LfMasonryAdapter) => {
  const { compInstance, isMasonry, isVertical } = adapter.controller.get;

  if (isMasonry()) {
    compInstance.lfView = "vertical";
  } else if (isVertical()) {
    compInstance.lfView = "horizontal";
  } else {
    compInstance.lfView = "main";
  }
};
//#endregion

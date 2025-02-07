//#region addColumn

import { LF_MASONRY_CSS_VARS, LfMasonryAdapter } from "@lf-widgets/foundations";
import { LfMasonry } from "./lf-masonry";

/**
 * Increases the number of columns in the masonry layout by one.
 *
 * @param adapter - The masonry adapter instance that manages the layout
 * @returns A Promise that resolves when the column has been added
 *
 * @remarks
 * This function:
 * - Retrieves the current number of columns from CSS or component state
 * - Increments that value by 1
 * - Updates the CSS value with the new column count
 */
export const addColumn = async (adapter: LfMasonryAdapter) => {
  const { compInstance, currentColumns } = adapter.controller.get;

  const comp = compInstance as LfMasonry;

  const current = getCSSValue(comp) || currentColumns();
  setCSSValue(comp, current + 1);
};
//#endregion

//#region removeColumn
/**
 * Decrements the number of columns in the masonry layout by one if current columns count is greater than 1.
 *
 * @param adapter - The masonry adapter instance containing component and controller information
 * @returns A Promise that resolves when the column removal operation is complete
 *
 * @example
 * ```typescript
 * await removeColumn(masonryAdapter);
 * ```
 */
export const removeColumn = async (adapter: LfMasonryAdapter) => {
  const { compInstance, currentColumns } = adapter.controller.get;

  const comp = compInstance as LfMasonry;

  const current = getCSSValue(comp) || currentColumns();
  if (current > 1) {
    setCSSValue(comp, current - 1);
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

//#region Helpers
/**
 * Retrieves the CSS custom property value for columns from the root element of a LfMasonry component.
 * @param compInstance - The LfMasonry component instance to extract the CSS value from
 * @returns The numeric value of the columns CSS custom property
 */
const getCSSValue = (compInstance: LfMasonry) => {
  return Number(
    compInstance.rootElement.style.getPropertyValue(
      LF_MASONRY_CSS_VARS.columns,
    ),
  );
};
/**
 * Sets the CSS custom property for columns count in the masonry component.
 *
 * @param compInstance - The LfMasonry component instance containing the root element
 * @param value - The number of columns to set
 * @returns The numeric value that was set (always returns 0 since setProperty returns void)
 */
const setCSSValue = (compInstance: LfMasonry, value: number) => {
  return Number(
    compInstance.rootElement.style.setProperty(
      LF_MASONRY_CSS_VARS.columns,
      String(value),
    ),
  );
};
//#endregion

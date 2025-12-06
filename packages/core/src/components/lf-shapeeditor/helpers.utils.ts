//#region Clear history

import {
  LfButtonInterface,
  LfDataCell,
  LfDataNode,
  LfDataShapes,
  LfMasonrySelectedShape,
  LfShapeeditorAdapter,
  LfShapeeditorConfigDsl,
} from "@lf-widgets/foundations";

/**
 * Clears the history of operations in the shape editor adapter.
 * If an index is provided, it removes the history entry at that specific index.
 * Otherwise, it removes the last history entry and clears the current selection.
 *
 * @param adapter - The shape editor adapter instance containing the controller and history
 * @param index - Optional index to remove a specific history entry. If null, removes the last entry
 * @returns Promise that resolves when history clearing is complete
 */
export const clearHistory = async (
  adapter: LfShapeeditorAdapter,
  index: number = null,
) => {
  const { history } = adapter.controller.set;

  if (index === null) {
    history.pop();
    clearSelection(adapter);
  } else {
    history.pop(index);
  }
};
//#endregion

//#region Clear selection
/**
 * Clears the current selection state in the shape editor.
 * This includes resetting the current shape, history index, and selected shape in the masonry layout.
 *
 * @param adapter - The shape editor adapter containing controller and element references
 * @returns A Promise that resolves when the selection has been cleared
 */
export const clearSelection = async (adapter: LfShapeeditorAdapter) => {
  const { controller, elements } = adapter;
  const { masonry } = elements.refs.navigation;
  const { set } = controller;

  set.currentShape({});
  set.history.index(null);
  if (masonry?.setSelectedShape) {
    masonry.setSelectedShape(-1);
  }
};
//#endregion

//#region Delete shape
/**
 * Deletes the currently selected shape from the shape editor.
 * This operation includes clearing the shape's history, removing it from the data structure,
 * and clearing the current selection.
 *
 * @param adapter - The LfShapeeditor adapter instance containing the component and controller references
 * @returns A Promise that resolves when the shape deletion is complete
 */
export const deleteShape = async (adapter: LfShapeeditorAdapter) => {
  const { compInstance, currentShape, manager } = adapter.controller.get;
  const { lfDataset } = compInstance;
  const { findNodeByCell, pop } = manager.data.node;

  await clearHistory(adapter, currentShape().shape.index);

  const cell = findImage(adapter);
  const node = findNodeByCell(lfDataset, cell);
  pop(lfDataset.nodes, node);
  compInstance.lfDataset = { ...lfDataset };

  await clearSelection(adapter);
};
//#endregion

//#region Find image
/**
 * Finds a specific image cell within the data structure based on the current shape.
 *
 * @param adapter - The shape editor adapter instance containing controller and component data
 * @returns The matching image cell if found, undefined otherwise
 *
 * @remarks
 * The function compares the value or lfValue of image cells with the current shape's value
 * to find a matching cell.
 */
export const findImage = (adapter: LfShapeeditorAdapter) => {
  const { compInstance, currentShape, manager } = adapter.controller.get;
  const { lfDataset } = compInstance;
  const { getAll } = manager.data.cell.shapes;

  const s = currentShape();
  const cells = getAll(lfDataset, false);

  return cells["image"].find(
    (c) => c.value === s.value || c.lfValue === s.value,
  );
};
//#endregion

//#region Load
/**
 * Asynchronously loads data via the provided adapter's callback.
 * After a successful load operation, the history is cleared.
 *
 * @param adapter - The LfShapeeditorAdapter instance containing controller and element references
 * @throws {Error} When the load operation fails
 * @returns A Promise that resolves when the load operation completes
 */
export const load = async (adapter: LfShapeeditorAdapter) => {
  const { controller, elements } = adapter;
  const { textfield } = elements.refs.navigation;
  const { compInstance } = controller.get;
  const { lfLoadCallback } = compInstance;

  try {
    await lfLoadCallback(compInstance, await textfield.getValue());
    clearHistory(adapter);
  } catch (error) {
    console.error("Load operation failed:", error);
  }
};
//#endregion

//#region Redo
/**
 * Performs a redo operation on the shape editor.
 * Advances the history index forward if there are changes to redo.
 *
 * @param adapter - The shape editor adapter instance containing controller and history state
 * @returns A promise that resolves when the redo operation is complete
 */
export const redo = async (adapter: LfShapeeditorAdapter) => {
  const { controller } = adapter;
  const { get, set } = controller;
  const { current, index } = get.history;

  const currentHistory = current();
  const idx = index();
  if (currentHistory && idx < currentHistory.length - 1) {
    set.history.index(idx + 1);
  }
};
//#endregion

//#region Save
/**
 * Saves the current state of the shape editor.
 * This function updates both the internal state and the data model with the current shape's value,
 * and clears the editing history afterwards.
 *
 * @param adapter - The LfShapeeditor adapter instance containing component and controller information
 * @returns A promise that resolves when the save operation and history clearing are complete
 *
 * @throws Will return early if no current shape is selected
 */
export const save = async (adapter: LfShapeeditorAdapter) => {
  const { compInstance, currentShape, history } = adapter.controller.get;
  const { lfDataset } = compInstance;

  const s = currentShape();
  if (!s) {
    return;
  }
  const index = s.shape.index;
  const shape = s.shape.shape;

  const currentSnapshot = history.currentSnapshot();
  const value = currentSnapshot.value;

  const cell = findImage(adapter);
  cell.value = value;
  cell.lfValue = value;

  updateValue(shape, value);
  await clearHistory(adapter, index);

  compInstance.lfDataset = { ...lfDataset };
};
//#endregion

//#region newShape
/**
 * Creates a deep copy of a masonry shape object.
 * @param shape - The shape object to clone
 * @returns A new independent copy of the input shape
 */
export const newShape = (
  shape: LfMasonrySelectedShape,
): LfMasonrySelectedShape => {
  return JSON.parse(JSON.stringify(shape));
};
//#endregion

//#region toggleButtonSpinner
/**
 * Toggles a spinner state on a button while executing an asynchronous callback function.
 * The spinner is shown before the callback execution and hidden after it completes.
 *
 * @param button - The LfButton element to toggle the spinner on
 * @param cb - An async callback function to execute while the spinner is shown
 * @returns A Promise that resolves when the callback completes and spinner is hidden
 *
 * @example
 * const button = document.querySelector('lf-button');
 * await toggleButtonSpinner(button, async () => {
 *   await someAsyncOperation();
 * });
 */
export const toggleButtonSpinner = async (
  button: LfButtonInterface,
  cb: () => Promise<unknown>,
) => {
  requestAnimationFrame(() => (button.lfShowSpinner = true));

  await cb();

  requestAnimationFrame(() => (button.lfShowSpinner = false));
};
//#endregion

//#region Undo
/**
 * Moves back one step in the shape editor history if possible.
 * This function decrements the history index by one if it's greater than zero.
 *
 * @param adapter - The LfShapeeditorAdapter instance containing the controller with history management
 * @returns Promise<void>
 */
export const undo = async (adapter: LfShapeeditorAdapter) => {
  const { controller } = adapter;
  const { get, set } = controller;
  const { history } = get;
  const { index } = history;

  const idx = index();
  if (idx > 0) {
    const newIdx = idx - 1;
    set.history.index(newIdx);
  }
};
//#endregion

//#region updateValue
/**
 * Updates the value property of a data cell shape and optionally its lfValue property if present.
 * @param shape - The data cell shape object to update
 * @param value - The new value to set
 */
export const updateValue = (
  shape: Partial<LfDataCell<LfDataShapes>>,
  value: string,
) => {
  const s = shape as Partial<LfDataCell<"image">>;
  shape.value = value;
  if (s.lfValue) {
    s.lfValue = value;
  }
};
//#endregion

//#region Config DSL
export const parseConfigDslFromNode = (
  node: LfDataNode | undefined,
): LfShapeeditorConfigDsl | null => {
  if (!node || !node.cells || !("lfCode" in node.cells)) {
    return null;
  }

  const cell = node.cells.lfCode;
  if (!cell?.value) {
    return null;
  }

  try {
    const parsed = JSON.parse(cell.value) as LfShapeeditorConfigDsl;
    if (!parsed || !Array.isArray(parsed.controls)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};
//#endregion

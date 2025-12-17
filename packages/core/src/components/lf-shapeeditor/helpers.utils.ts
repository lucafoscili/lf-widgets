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
  const { history } = adapter.controller.actions;

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
  const { compInstance, currentShape } = adapter.controller.get;
  const comp = compInstance();
  const { lfDataset } = comp;

  const s = currentShape();
  if (!s?.shape) {
    return;
  }

  const index = s.shape.index;
  await clearHistory(adapter, index);

  // Remove the node at the index from the dataset
  const nodes = [...lfDataset.nodes];
  if (index >= 0 && index < nodes.length) {
    nodes.splice(index, 1);
    comp.lfDataset = { ...lfDataset, nodes };
  }

  await clearSelection(adapter);
};
//#endregion

//#region Find cell by index
/**
 * Finds the cell at a specific index in the dataset.
 * This is shape-agnostic and works with any cell type.
 *
 * @param adapter - The shape editor adapter instance
 * @param index - The index of the node in the dataset
 * @param cellKey - Optional cell key to look up (defaults to lfShape-based key)
 * @returns The cell at the specified index, or undefined if not found
 */
export const findCellByIndex = (
  adapter: LfShapeeditorAdapter,
  index: number,
  cellKey?: string,
): Partial<LfDataCell<LfDataShapes>> | undefined => {
  const { compInstance, framework } = adapter.controller.get;

  const comp = compInstance();
  const mgr = framework();

  const { lfDataset, lfShape } = comp;
  const { getAll } = mgr.data.cell.shapes;

  if (!lfDataset?.nodes?.[index]) {
    return undefined;
  }

  const node = lfDataset.nodes[index];

  // If cellKey provided, use it directly
  if (cellKey && node.cells?.[cellKey]) {
    return node.cells[cellKey] as Partial<LfDataCell<LfDataShapes>>;
  }

  // Otherwise, find the cell matching the current shape type
  const allCells = getAll({ nodes: [node] }, false);
  const shapeCells = allCells[lfShape];
  return shapeCells?.[0];
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
  const { textfield } = elements.refs.navigation.jump;
  const { compInstance } = controller.get;
  const comp = compInstance();
  const { lfLoadCallback } = comp;

  try {
    // Use native input value property since textfield is now HTMLInputElement
    await lfLoadCallback(comp, textfield.value);
    clearHistory(adapter);
  } catch (error) {
    console.error("Load operation failed:", error);
  }
};
//#endregion

//#region Reset controls
/**
 * Resets the configuration controls to their default values.
 * Builds default settings from control definitions and merges with current settings,
 * preserving any settings not defined in the current control set.
 * Also increments the resetKey to force control re-creation.
 *
 * @param adapter - The shape editor adapter instance containing controller and config state
 * @returns A promise that resolves when the reset operation is complete
 */
export const resetControls = async (adapter: LfShapeeditorAdapter) => {
  const currentSettings = adapter.controller.get.config.settings();
  const controls = adapter.controller.get.config.controls();

  // Build default settings from control definitions
  const defaultSettings: Record<string, string | number | boolean> = {};
  for (const ctrl of controls) {
    if ("defaultValue" in ctrl) {
      defaultSettings[ctrl.id] = ctrl.defaultValue;
    }
  }

  // Reset to defaults, preserving only settings not in current controls
  const resetSettings = { ...currentSettings };
  for (const key of Object.keys(defaultSettings)) {
    resetSettings[key] = defaultSettings[key];
  }

  adapter.controller.set.config.settings(resetSettings);

  // Increment resetKey to force control re-creation
  adapter.controller.actions.incrementResetKey();
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
 * This function updates the dataset with the current snapshot's cell props,
 * and clears the editing history afterwards.
 *
 * This is now shape-agnostic: it copies all cell properties from the snapshot
 * to the dataset node, not just value/lfValue.
 *
 * @param adapter - The LfShapeeditor adapter instance containing component and controller information
 * @returns A promise that resolves when the save operation and history clearing are complete
 *
 * @throws Will return early if no current shape is selected
 */
export const save = async (adapter: LfShapeeditorAdapter) => {
  const { compInstance, currentShape, framework } = adapter.controller.get;
  const { history } = adapter.controller.computed;

  const comp = compInstance();
  const mgr = framework();

  const { lfDataset, lfShape } = comp;
  const { getAll } = mgr.data.cell.shapes;

  const s = currentShape();
  if (!s?.shape) {
    return;
  }

  const index = s.shape.index;
  const currentSnapshot = history.currentSnapshot();
  const snapshotCell = currentSnapshot.shape?.shape;

  if (!snapshotCell || index < 0 || index >= lfDataset.nodes.length) {
    return;
  }

  const node = lfDataset.nodes[index];
  const allCells = getAll({ nodes: [node] }, false);
  const shapeCells = allCells[lfShape];

  if (!shapeCells?.length) {
    return;
  }

  const cellKey = Object.keys(node.cells || {}).find((key) => {
    const cell = node.cells?.[key];
    return cell && shapeCells.some((sc) => sc === cell);
  });

  if (!cellKey) {
    return;
  }

  const nodes = [...lfDataset.nodes];
  nodes[index] = {
    ...node,
    cells: {
      ...node.cells,
      [cellKey]: { ...snapshotCell } as LfDataCell<LfDataShapes>,
    },
  };

  await clearHistory(adapter, index);

  comp.lfDataset = { ...lfDataset, nodes };
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

//#region updateCellProps
/**
 * Updates multiple properties on a data cell shape.
 * This is the primary method for modifying cell properties in an agnostic way.
 *
 * @param shape - The data cell shape object to update
 * @param props - An object containing the property key-value pairs to set
 *
 * @example
 * // For image editing (legacy pattern):
 * updateCellProps(shape, { value: base64Data, lfValue: base64Data });
 *
 * // For component playgrounds:
 * updateCellProps(shape, { lfLabel: "New Label", lfDisabled: true });
 */
export const updateCellProps = (
  shape: Partial<LfDataCell<LfDataShapes>>,
  props: Record<string, unknown>,
) => {
  for (const [key, value] of Object.entries(props)) {
    (shape as Record<string, unknown>)[key] = value;
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
    const parsed = JSON.parse(cell.value) as Partial<LfShapeeditorConfigDsl>;
    if (!parsed || !Array.isArray(parsed.controls)) {
      return null;
    }
    return {
      controls: parsed.controls,
      layout: parsed.layout,
      defaultSettings: parsed.defaultSettings || {},
      // Behavioral metadata
      behavior: parsed.behavior,
      commitTrigger: parsed.commitTrigger,
      showApplyButton: parsed.showApplyButton,
      showResetButton: parsed.showResetButton,
      enablePreview: parsed.enablePreview,
    };
  } catch {
    return null;
  }
};
//#endregion

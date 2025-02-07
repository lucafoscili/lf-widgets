import {
  LfDataCell,
  LfDataDataset,
  LfThemeIcon,
} from "@lf-widgets/foundations";

//#region prepTreeDataset
export const prepTreeDataset = (
  currentShape: LfDataCell,
  currentIcon: LfThemeIcon,
  shapes: LfDataCell[],
) => {
  const dataset: LfDataDataset = { nodes: [] };

  for (let index = 0; index < shapes.length; index++) {
    const shape = shapes[index];
    const strIndex = String(index).valueOf();

    dataset.nodes.push({
      icon: currentShape === shape && currentIcon,
      id: strIndex,
      value: `#${strIndex}`,
    });
  }

  return dataset;
};
//#endregion

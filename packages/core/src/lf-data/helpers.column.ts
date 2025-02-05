import { LfDataColumn, LfDataDataset } from "@lf-widgets/foundations";

//#region columnFind
/**
 * Searches for columns in a dataset that match the given filter criteria
 *
 * @param dataset - The dataset to search in, can be either a LfDataDataset object or an array of LfDataColumn
 * @param filters - An object containing the filter criteria as key-value pairs matching LfDataColumn properties
 * @returns An array of LfDataColumn objects that match all the filter criteria
 *
 * @example
 * ```typescript
 * // Find all columns with name 'id'
 * const idColumns = columnFind(dataset, { name: 'id' });
 *
 * // Find columns that are both visible and required
 * const visibleRequired = columnFind(dataset, { visible: true, required: true });
 * ```
 */
export const columnFind = (
  dataset: LfDataDataset | LfDataColumn[],
  filters: Partial<LfDataColumn>,
) => {
  const result: LfDataColumn[] = [];
  if (!dataset) {
    return result;
  }
  const columns = (dataset as LfDataDataset).columns
    ? (dataset as LfDataDataset).columns
    : (dataset as LfDataColumn[]);
  for (let index = 0; index < columns.length; index++) {
    const column = columns[index];
    for (const key in filters) {
      const k = key as keyof LfDataColumn;
      const filter = filters[k];
      if (column[k] === filter) {
        result.push(column);
      }
    }
  }
  return result;
};
//#endregion

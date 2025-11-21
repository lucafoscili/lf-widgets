import { LfDataDataset, LfDataNode } from "@lf-widgets/foundations";

//#region Find Node
export const findNodeById = (
  dataset: LfDataDataset | null,
  id: string | null,
): LfDataNode | null => {
  if (!dataset?.nodes || !id) {
    return null;
  }
  return dataset.nodes.find((node) => node?.id === id) || null;
};
//#endregion

//#region Has Node
export const hasNodeWithId = (
  dataset: LfDataDataset | null,
  id: string | null,
): boolean => {
  if (!dataset?.nodes || !id) {
    return false;
  }
  return dataset.nodes.some((node) => node?.id === id);
};
//#endregion

//#region Validate Dataset
export const validateDataset = (dataset: LfDataDataset | null): boolean => {
  if (!dataset) {
    return true;
  }

  if (!Array.isArray(dataset.nodes)) {
    return false;
  }

  const ids = new Set<string>();
  for (const node of dataset.nodes) {
    if (!node || typeof node !== "object") {
      return false;
    }
    if (!node.id || typeof node.id !== "string") {
      return false;
    }
    if (ids.has(node.id)) {
      return false;
    }
    ids.add(node.id);
  }

  return true;
};
//#endregion

//#region Get Display Value
export const getNodeDisplayValue = (node: LfDataNode | null): string => {
  if (!node) {
    return "";
  }
  return String(node.value || node.id || "");
};
//#endregion

import { LfDataNode } from "@lf-widgets/foundations";

//#region historyValues
/**
 * Extracts the string values from a list of history nodes.
 */
export const historyValues = (nodes: LfDataNode[]): string[] => {
  return (nodes || []).map((node) =>
    node?.value !== undefined && node?.value !== null ? String(node.value) : "",
  );
};
//#endregion

//#region normalizeHistoryValues
/**
 * Normalizes a list of history values by:
 * - enforcing maxHistory
 * - removing duplicates while preserving first occurrence
 */
export const normalizeHistoryValues = (
  values: string[],
  maxHistory: number,
): string[] => {
  if (!maxHistory) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of values || []) {
    const value = raw !== undefined && raw !== null ? String(raw) : (raw ?? "");
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push(value);
    if (normalized.length >= maxHistory) {
      break;
    }
  }

  return normalized;
};
//#endregion

//#region normalizeHistoryNodes
/**
 * Normalizes a list of history nodes by:
 * - enforcing maxHistory
 * - removing duplicates by value while preserving first occurrence
 * - ensuring each node has a stable id
 */
export const normalizeHistoryNodes = (
  nodes: LfDataNode[],
  maxHistory: number,
  createNodeId: (value: string, index: number) => string,
): LfDataNode[] => {
  if (!maxHistory) {
    return [];
  }

  const seen = new Set<string>();
  const normalized: LfDataNode[] = [];

  for (const node of nodes || []) {
    if (!node) {
      continue;
    }
    const value =
      node.value !== undefined && node.value !== null ? String(node.value) : "";
    if (seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push({
      ...node,
      id: node.id || createNodeId(value, normalized.length),
      value,
    });
    if (normalized.length >= maxHistory) {
      break;
    }
  }

  return normalized;
};
//#endregion

//#region historyDiffers
/**
 * Shallow comparison of history node arrays used to decide whether
 * a resync of the underlying dataset is required.
 */
export const historyDiffers = (a: LfDataNode[], b: LfDataNode[]): boolean => {
  if (!a && !b) {
    return false;
  }
  if (!a || !b || a.length !== b.length) {
    return true;
  }

  return a.some((node, index) => {
    const other = b[index];
    return (
      !other ||
      String(node?.value ?? "") !== String(other?.value ?? "") ||
      (node?.id || "") !== (other?.id || "")
    );
  });
};
//#endregion

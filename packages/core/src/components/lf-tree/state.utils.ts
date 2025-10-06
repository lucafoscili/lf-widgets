import type { LfDataNode } from "@lf-widgets/foundations";

const fallbackNodeIds = new WeakMap<LfDataNode, string>();
let fallbackNodeIdCounter = 0;

const normalizeFallbackBase = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 32) || null
    );
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }

  return null;
};

export const normalizeIdInput = (value: unknown): string[] => {
  if (value == null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) =>
        typeof entry === "string" || typeof entry === "number"
          ? String(entry)
          : null,
      )
      .filter((entry): entry is string => !!entry);
  }
  if (value instanceof Set) {
    return Array.from(value)
      .map((entry) =>
        typeof entry === "string" || typeof entry === "number"
          ? String(entry)
          : null,
      )
      .filter((entry): entry is string => !!entry);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return normalizeIdInput(parsed);
      }
    } catch (_err) {
      const tokens = value
        .split(/[\,\s]+/)
        .map((token) => token.trim())
        .filter(Boolean);
      if (tokens.length) {
        return tokens;
      }
    }
    return value ? [value] : [];
  }
  return [];
};

export const normalizeTargetInput = (
  input: string | LfDataNode | Array<string | LfDataNode>,
): Array<string | LfDataNode> => {
  if (input == null) {
    return [];
  }
  return Array.isArray(input) ? input : [input];
};

export const getNodeId = (
  node: LfDataNode | null | undefined,
): string | null => {
  if (!node) {
    return null;
  }
  const idCandidate = node.id;
  if (idCandidate != null) {
    const trimmed = String(idCandidate).trim();
    if (trimmed) {
      fallbackNodeIds.delete(node);
      return trimmed;
    }
  }

  const existingFallback = fallbackNodeIds.get(node);
  if (existingFallback) {
    node.id = existingFallback;
    return existingFallback;
  }

  const base = normalizeFallbackBase(node.value) ?? "node";
  const fallback = `${base}-${(++fallbackNodeIdCounter).toString(36)}`;
  fallbackNodeIds.set(node, fallback);
  node.id = fallback;
  return fallback;
};

export const extractIdCandidates = (
  targets: Array<string | LfDataNode>,
): string[] => {
  const ids: string[] = [];
  for (const entry of targets) {
    if (typeof entry === "string" || typeof entry === "number") {
      const id = String(entry);
      if (id) {
        ids.push(id);
      }
    } else {
      const nodeId = getNodeId(entry);
      if (nodeId) {
        ids.push(nodeId);
      }
    }
  }
  return ids;
};

export const arraysEqual = (left: string[], right: string[]): boolean => {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((value, index) => value === right[index]);
};

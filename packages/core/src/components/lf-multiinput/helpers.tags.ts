//#region parseTags
/**
 * Parses a raw comma-separated tags string into an array of trimmed,
 * non-empty tokens.
 */
export const parseTags = (raw: string): string[] => {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
};
//#endregion

//#region historyValues
/**
 * Normalizes a list of tags by trimming, removing empties and duplicates
 * while preserving first occurrence.
 */
export const normalizeTags = (tags: string[]): string[] => {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const raw of tags || []) {
    const value = (raw ?? "").trim();
    if (!value || seen.has(value)) {
      continue;
    }
    seen.add(value);
    normalized.push(value);
  }

  return normalized;
};
//#endregion

//#region stringifyTags
/**
 * Stringifies a list of tags into a comma-separated representation.
 */
export const stringifyTags = (tags: string[]): string => {
  return (tags || []).join(", ");
};
//#endregion

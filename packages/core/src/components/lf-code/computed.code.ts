import {
  LfCodeAdapter,
  LfCodeAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed values for lf-code.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Computed values object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepCodeComputed = (
  getAdapter: () => LfCodeAdapter,
): LfCodeAdapterControllerComputed => ({
  /**
   * Returns the formatted code value.
   * Applies JSON formatting when format is enabled and language is JSON.
   */
  formattedCode: () => {
    const { compInstance, framework } = getAdapter().controller.get;
    const comp = compInstance();
    const { lfFormat, lfLanguage, lfValue } = comp;

    if (!lfFormat) {
      return lfValue;
    }

    const { stringify } = framework().data.cell;

    if (typeof lfValue === "string" && /^[\{\}]\s*$/i.test(lfValue)) {
      return lfValue.trim();
    } else if (isJson(lfLanguage, lfValue)) {
      try {
        const parsed = JSON.parse(lfValue);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return stringify(lfValue);
      }
    } else {
      return stringify(lfValue);
    }
  },

  /**
   * Whether the code should preserve spaces (use <pre> tag).
   */
  shouldPreserveSpace: () => {
    const { compInstance } = getAdapter().controller.get;
    const { lfLanguage, lfPreserveSpaces } = compInstance();

    const isPreserveSpaceMissing = !!(
      lfPreserveSpaces !== true && lfPreserveSpaces !== false
    );
    const lowerCaseLanguage = lfLanguage.toLowerCase();
    const isLikelyTextual =
      lowerCaseLanguage === "css" ||
      lowerCaseLanguage === "doc" ||
      lowerCaseLanguage === "markdown" ||
      lowerCaseLanguage === "plaintext" ||
      lowerCaseLanguage === "text" ||
      lowerCaseLanguage === "";

    return lfPreserveSpaces || (isPreserveSpaceMissing && !isLikelyTextual);
  },
});

/**
 * Helper to check if value is JSON or dictionary-like.
 */
const isJson = (lfLanguage: string, lfValue: string): boolean => {
  const isJsonLanguage = lfLanguage?.toLowerCase() === "json";
  const isDictionary = isDictionaryLike(lfValue);
  return isJsonLanguage || isDictionary;
};

/**
 * Helper to check if value looks like a dictionary/object.
 */
const isDictionaryLike = (value: string): boolean => {
  if (typeof value !== "string") {
    return false;
  }
  try {
    const parsed = JSON.parse(value);
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      Object.values(parsed).every((v) => v != null)
    );
  } catch {
    return false;
  }
};

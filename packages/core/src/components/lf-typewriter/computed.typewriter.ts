import {
  LfTypewriterAdapter,
  LfTypewriterAdapterControllerComputed,
} from "@lf-widgets/foundations";

/**
 * Factory to create computed predicates for lf-typewriter.
 *
 * Computed values are pure functions that derive state without side effects.
 * They're used in JSX/handlers to make rendering decisions.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @param getTexts - Accessor function to get the texts array
 * @returns Computed predicates object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepTypewriterComputed = (
  getAdapter: () => LfTypewriterAdapter,
  getTexts: () => string[],
): LfTypewriterAdapterControllerComputed => ({
  /**
   * Whether the cursor should be displayed based on lfCursor setting.
   * Shows cursor when:
   * - lfCursor is "enabled", OR
   * - lfCursor is "auto" AND not deleting AND text is not complete
   */
  shouldShowCursor: () => {
    const { compInstance } = getAdapter().controller.get;
    const comp = compInstance();
    const texts = getTexts();
    const { currentTextIndex, displayedText, isDeleting, lfCursor } = comp;

    return (
      lfCursor === "enabled" ||
      (lfCursor === "auto" &&
        !isDeleting &&
        displayedText !== texts[currentTextIndex])
    );
  },

  /**
   * Get the current text being typed from the texts array.
   */
  currentText: () => {
    const { compInstance } = getAdapter().controller.get;
    const texts = getTexts();
    return texts[compInstance().currentTextIndex] || "";
  },

  /**
   * Get all texts array.
   */
  texts: () => getTexts(),
});

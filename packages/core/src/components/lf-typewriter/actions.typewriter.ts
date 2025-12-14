import {
  LfTypewriterAdapter,
  LfTypewriterAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-typewriter.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Control animation timing
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @param setTimeout_ - Function to set timeout reference
 * @param clearTimeout_ - Function to clear timeout reference
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepTypewriterActions = (
  getAdapter: () => LfTypewriterAdapter,
  setTimeout_: (timeout: NodeJS.Timeout | undefined) => void,
  clearTimeout_: () => void,
): LfTypewriterAdapterControllerActions => ({
  /**
   * Starts the typing animation.
   * Handles both typing and deleting phases.
   */
  start: () => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const { currentText, texts } = adapter.controller.computed;
    const comp = compInstance();
    const allTexts = texts();

    const current = currentText();

    if (comp.isDeleting) {
      comp.displayedText = current.substring(0, comp.displayedText.length - 1);
    } else {
      comp.displayedText = current.substring(0, comp.displayedText.length + 1);
    }

    if (!comp.isDeleting && comp.displayedText === current) {
      setTimeout_(
        setTimeout(() => {
          if (comp.lfLoop) comp.isDeleting = true;
        }, comp.lfPause),
      );
    } else if (comp.isDeleting && comp.displayedText === "") {
      comp.isDeleting = false;
      comp.currentTextIndex = (comp.currentTextIndex + 1) % allTexts.length;
    } else {
      const delay = comp.isDeleting ? comp.lfDeleteSpeed : comp.lfSpeed;
      setTimeout_(setTimeout(() => adapter.controller.actions.start(), delay));
    }
  },

  /**
   * Resets the typing animation.
   * If there's displayed text, deletes it first before resetting.
   */
  reset: () => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const { deleteText, completeReset } = adapter.controller.actions;
    const comp = compInstance();

    clearTimeout_();

    if (comp.displayedText) {
      comp.isDeleting = true;
      deleteText(() => {
        completeReset();
      });
    } else {
      completeReset();
    }
  },

  /**
   * Deletes text character by character with callback.
   */
  deleteText: (callback: () => void) => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const comp = compInstance();

    if (comp.displayedText.length > 0) {
      comp.displayedText = comp.displayedText.slice(0, -1);

      setTimeout_(
        setTimeout(() => {
          adapter.controller.actions.deleteText(callback);
        }, comp.lfDeleteSpeed),
      );
    } else {
      callback();
    }
  },

  /**
   * Completes the reset by resetting state and starting animation.
   */
  completeReset: () => {
    const adapter = getAdapter();
    const { compInstance } = adapter.controller.get;
    const comp = compInstance();

    comp.isDeleting = false;
    comp.currentTextIndex = 0;
    adapter.controller.actions.start();
  },
});

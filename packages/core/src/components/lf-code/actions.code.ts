import {
  LfCodeAdapter,
  LfCodeAdapterControllerActions,
} from "@lf-widgets/foundations";

/**
 * Factory to create action functions for lf-code.
 *
 * Actions are complex multi-step operations that may:
 * - Have side effects
 * - Trigger re-renders
 * - Batch multiple state changes
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns Actions object
 *
 * @see Section 5.4 of 4_0_0_REFACTORING.md
 */
export const prepCodeActions = (
  getAdapter: () => LfCodeAdapter,
): LfCodeAdapterControllerActions => ({
  /**
   * Highlights the code element using the syntax highlighting service.
   * Called after render to apply Prism.js highlighting.
   */
  highlight: () => {
    const adapter = getAdapter();
    const { framework } = adapter.controller.get;
    const { pre } = adapter.elements.refs;

    if (pre) {
      framework().syntax.highlightElement(pre);
    }
  },

  /**
   * Copies the current code value to clipboard.
   * Updates the copy button state on success/failure.
   */
  copyToClipboard: async () => {
    const adapter = getAdapter();
    const { compInstance, framework } = adapter.controller.get;
    const comp = compInstance();

    const { "--lf-icon-copy-ok": copyOk, "--lf-icon-warning": warning } =
      framework().theme.get.current().variables;

    const copyButton = adapter.elements.refs.copyButton as HTMLElement & {
      setMessage?: (label: string, icon: string) => Promise<void>;
    };

    try {
      await navigator.clipboard.writeText(comp.lfValue);
      if (copyButton?.setMessage) {
        await copyButton.setMessage("Copied!", copyOk);
      }
    } catch {
      if (copyButton?.setMessage) {
        await copyButton.setMessage("Failed...", warning);
      }
    }
  },

  /**
   * Loads the language grammar for syntax highlighting.
   */
  loadLanguage: async () => {
    const adapter = getAdapter();
    const { compInstance, framework } = adapter.controller.get;
    const { lfLanguage } = compInstance();
    const { syntax } = framework();

    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const lang = lfLanguage.toLowerCase();

    if (!syntax.isLanguageLoaded(lang)) {
      await syntax.loadLanguage(lang);
    }
  },
});

import { LfCodeAdapter, LfCodeAdapterJsx } from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { CodeFC } from "./fc/code-fc";

/**
 * Prepares JSX factory functions for the code component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived values (formattedCode, shouldPreserveSpace)
 * - Routes all events through dispatcher
 * - Now delegates rendering to LfCodeFC (pure presentational component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepCodeJsx = (
  getAdapter: () => LfCodeAdapter,
): LfCodeAdapterJsx => {
  return {
    //#region Code
    code: () => {
      const adapter = getAdapter();
      return <CodeFC adapter={adapter} />;
    },
    //#endregion
  };
};

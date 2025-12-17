import {
  LfTypewriterAdapter,
  LfTypewriterAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { TypewriterFC } from "./fc/typewriter-fc";

/**
 * Prepares JSX factory functions for the typewriter component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (shouldShowCursor, currentText)
 * - Routes all events through dispatcher
 * - Delegates rendering to TypewriterFC (pure presentational component)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepTypewriterJsx = (
  getAdapter: () => LfTypewriterAdapter,
): LfTypewriterAdapterJsx => {
  return {
    //#region Typewriter
    typewriter: (): VNode => {
      const adapter = getAdapter();
      return <TypewriterFC adapter={adapter} />;
    },
    //#endregion
  };
};

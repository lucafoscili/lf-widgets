import { LfToastAdapter, LfToastAdapterJsx } from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfToastFC } from "./lf-toast-fc";

/**
 * Prepares JSX factory functions for the toast component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (hasCloseIcon, hasIcon, hasTimer)
 * - Routes all events through handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepToastJsx = (
  getAdapter: () => LfToastAdapter,
): LfToastAdapterJsx => {
  return {
    //#region Toast
    toast: () => {
      const adapter = getAdapter();
      const { controller, handlers } = adapter;
      const { compInstance, framework } = controller.get;

      const comp = compInstance();
      const mgr = framework();

      const { lfCloseIcon, lfIcon, lfMessage, lfTimer, lfUiSize, lfUiState } =
        comp;

      return (
        <LfToastFC
          closeCallback={() => handlers.closeButton(null)}
          closeIcon={lfCloseIcon as string}
          framework={mgr}
          icon={lfIcon as string}
          message={lfMessage}
          timer={lfTimer}
          uiSize={lfUiSize}
          uiState={lfUiState}
        />
      );
    },
    //#endregion
  };
};

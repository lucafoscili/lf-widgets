import {
  LfSnackbarAdapter,
  LfSnackbarAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfSnackbarFC } from "./fc";

/**
 * Prepares JSX factory functions for the snackbar component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (hasAction, hasCloseIcon, hasIcon)
 * - Uses `handlers` for event callbacks
 * - Routes all events through dispatcher
 * - Wraps `LfSnackbarFC` functional component for actual rendering
 *
 * @see Section 2 & 5 of 4_0_0_REFACTORING.md
 */
export const prepSnackbarJsx = (
  getAdapter: () => LfSnackbarAdapter,
): LfSnackbarAdapterJsx => {
  return {
    //#region Snackbar
    snackbar: (): VNode => {
      const adapter = getAdapter();
      const { controller, handlers } = adapter;
      const { compInstance, framework } = controller.get;
      const { hasAction, hasCloseIcon, hasIcon } = controller.computed;

      const comp = compInstance();
      const mgr = framework();

      const {
        lfAction,
        lfCloseIcon,
        lfIcon,
        lfMessage,
        lfPosition,
        lfUiSize,
        lfUiState,
      } = comp;

      return (
        <LfSnackbarFC
          action={lfAction}
          closeIcon={lfCloseIcon}
          framework={mgr}
          hasAction={hasAction()}
          hasCloseIcon={hasCloseIcon()}
          hasIcon={hasIcon()}
          icon={lfIcon}
          message={lfMessage}
          onAction={(e) => handlers.action(e)}
          onClose={(e) => handlers.close(e)}
          position={lfPosition}
          uiSize={lfUiSize}
          uiState={lfUiState}
        />
      );
    },
    //#endregion
  };
};

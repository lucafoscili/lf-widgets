import {
  LfProgressbarAdapter,
  LfProgressbarAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfProgressbarFC } from "./fc";

/**
 * Prepares JSX factory functions for the progressbar component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Wraps `LfProgressbarFC` functional component for actual rendering
 * - Routes all events through dispatcher (none for display component)
 *
 * @see Section 2 & 5 of 4_0_0_REFACTORING.md
 */
export const prepProgressbarJsx = (
  getAdapter: () => LfProgressbarAdapter,
): LfProgressbarAdapterJsx => {
  return {
    //#region Progressbar
    progressbar: (): VNode => {
      const adapter = getAdapter();
      const { controller } = adapter;
      const { compInstance, framework } = controller.get;

      const comp = compInstance();
      const mgr = framework();

      const {
        lfAnimated,
        lfCenteredLabel,
        lfIcon,
        lfIsRadial,
        lfLabel,
        lfUiSize,
        lfUiState,
        lfValue,
      } = comp;

      return (
        <LfProgressbarFC
          animated={lfAnimated}
          centeredLabel={lfCenteredLabel}
          framework={mgr}
          icon={lfIcon}
          isRadial={lfIsRadial}
          label={lfLabel}
          uiSize={lfUiSize}
          uiState={lfUiState}
          value={lfValue}
        />
      );
    },
    //#endregion
  };
};

import { LfHeaderAdapter, LfHeaderAdapterJsx } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { LfHeaderFC } from "./lf-header-fc";

/**
 * Prepares JSX factory functions for the header component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Routes all events through dispatcher
 * - Wraps `LfHeaderFC` functional component for actual rendering
 *
 * @see Section 2 & 5 of 4_0_0_REFACTORING.md
 */
export const prepHeaderJsx = (
  getAdapter: () => LfHeaderAdapter,
): LfHeaderAdapterJsx => {
  return {
    //#region Header
    header: (): VNode => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { framework } = controller.get;

      const mgr = framework();

      const { assignRef } = mgr;
      const { refs } = elements;

      return (
        <LfHeaderFC
          framework={mgr}
          ref={(el: HTMLElement | null) => {
            if (el) {
              assignRef(refs, "header")(el);
            }
          }}
        />
      );
    },
    //#endregion
  };
};

import {
  LF_HEADER_SLOT,
  LfHeaderAdapter,
  LfHeaderAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

/**
 * Prepares JSX factory functions for the header component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepHeaderJsx = (
  getAdapter: () => LfHeaderAdapter,
): LfHeaderAdapterJsx => {
  return {
    //#region Header
    header: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { blocks, framework, parts } = controller.get;

      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      return (
        <header
          class={bemClass(b.header._)}
          part={p.header}
          ref={assignRef(refs, "header")}
        >
          <section
            class={bemClass(b.header._, b.header.section)}
            part={p.section}
            ref={assignRef(refs, "section")}
          >
            <slot name={LF_HEADER_SLOT}></slot>
          </section>
        </header>
      );
    },
    //#endregion
  };
};

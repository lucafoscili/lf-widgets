import {
  LF_ATTRIBUTES,
  LF_DRAWER_SLOT,
  LfDrawerAdapter,
  LfDrawerAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

/**
 * Factory to create JSX rendering functions for lf-drawer.
 *
 * JSX factories are pure functions that return VNode fragments.
 * They read state from the adapter and return rendered output.
 *
 * @param getAdapter - Accessor function to get the current adapter instance
 * @returns JSX factory object
 *
 * @see Section 5.6 of 4_0_0_REFACTORING.md
 */
export const prepDrawerJsx = (
  getAdapter: () => LfDrawerAdapter,
): LfDrawerAdapterJsx => {
  return {
    //#region Drawer
    drawer: () => {
      const { controller, elements } = getAdapter();
      const { blocks, framework, parts } = controller.get;
      const { refs } = elements;
      const { theme } = framework();
      const { bemClass } = theme;

      const b = blocks();

      return (
        <div class={bemClass(b._)} part={parts().drawer}>
          <div
            class={bemClass(b._, b.content)}
            data-lf={LF_ATTRIBUTES.fadeIn}
            part={parts().content}
            ref={(el) => {
              if (el) {
                refs.content = el;
              }
            }}
          >
            <slot name={LF_DRAWER_SLOT}></slot>
          </div>
        </div>
      );
    },
    //#endregion
  };
};

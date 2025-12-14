import {
  LF_ATTRIBUTES,
  LfComponentRootElement,
  LfComponentTag,
  LfEvent,
  LfPlaceholderAdapter,
  LfPlaceholderAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the placeholder component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (shouldRender)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepPlaceholderJsx = (
  getAdapter: () => LfPlaceholderAdapter,
): LfPlaceholderAdapterJsx => {
  return {
    //#region Placeholder
    placeholder: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, framework, lfAttributes, parts } =
        controller.get;
      const { shouldRender } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const lf = lfAttributes();

      const { lfIcon, lfProps, lfValue } = comp;

      const { assignRef, sanitizeProps, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      let content: VNode;

      if (shouldRender()) {
        const name = lfValue.toLowerCase().replace("lf", "");
        const evDispatcher = {
          [`onLf-${name}-event`]: (e: LfEvent) => {
            handlers.component(e);
          },
        };
        const Tag = ("lf-" + name) as LfComponentTag<typeof lfValue>;
        content = (
          <Tag
            {...(sanitizeProps(lfProps, lfValue) as any)}
            {...evDispatcher}
            data-lf={LF_ATTRIBUTES.fadeIn}
            ref={
              assignRef(refs, "component") as (
                el: LfComponentRootElement,
              ) => void
            }
          ></Tag>
        );
      } else if (lfIcon) {
        content = (
          <div
            class={bemClass(b.placeholder._, b.placeholder.icon)}
            data-lf={lf.fadeIn}
            part={p.icon}
          >
            <FIcon framework={mgr} icon={lfIcon} />
          </div>
        );
      }

      return (
        <div
          class={bemClass(b.placeholder._)}
          part={p.placeholder}
          ref={assignRef(refs, "placeholder")}
        >
          {content}
        </div>
      );
    },
    //#endregion
  };
};

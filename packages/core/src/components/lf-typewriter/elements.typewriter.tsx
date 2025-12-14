import {
  LfTypewriterAdapter,
  LfTypewriterAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares JSX factory functions for the typewriter component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (shouldShowCursor, currentText)
 * - Routes all events through dispatcher
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
      const { controller, elements } = adapter;
      const { blocks, compInstance, framework, parts } = controller.get;
      const { shouldShowCursor } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { displayedText, lfTag } = comp;

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      const TagName = lfTag || "div";

      return (
        <div
          class={bemClass(b.typewriter._)}
          part={p.typewriter}
          ref={assignRef(refs, "typewriter")}
        >
          <TagName
            class={bemClass(b.typewriter._, b.typewriter.text)}
            part={p.text}
            ref={assignRef(refs, "text")}
          >
            <span>{displayedText || "\u00A0"}</span>
            {shouldShowCursor() && (
              <span
                class={bemClass(b.typewriter._, b.typewriter.cursor)}
                part={p.cursor}
                ref={assignRef(refs, "cursor")}
              ></span>
            )}
          </TagName>
        </div>
      );
    },
    //#endregion
  };
};

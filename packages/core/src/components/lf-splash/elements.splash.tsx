import { LfSplashAdapter, LfSplashAdapterJsx } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares JSX factory functions for the splash component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (isUnmounting)
 * - Routes all events through dispatcher
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepSplashJsx = (
  getAdapter: () => LfSplashAdapter,
): LfSplashAdapterJsx => {
  return {
    //#region Splash
    splash: (): VNode => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { blocks, compInstance, framework, parts } = controller.get;
      const { isUnmounting } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();

      const { lfLabel } = comp;
      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      const { splash } = b;

      return (
        <div
          class={bemClass(splash._, null, {
            active: isUnmounting(),
          })}
          part={p.splash}
          ref={assignRef(refs, "splash")}
        >
          <div
            class={bemClass(splash._, splash.content)}
            part={p.content}
            ref={assignRef(refs, "content")}
          >
            <div
              class={bemClass(splash._, splash.widget)}
              part={p.widget}
              ref={assignRef(refs, "widget")}
            >
              <slot></slot>
            </div>
            <div
              class={bemClass(splash._, splash.label)}
              part={p.label}
              ref={assignRef(refs, "label")}
            >
              {isUnmounting() ? "Ready!" : lfLabel}
            </div>
          </div>
        </div>
      );
    },
    //#endregion
  };
};

import {
  LF_TOAST_CSS_VARIABLES,
  LfIconType,
  LfToastAdapter,
  LfToastAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

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
      const { controller, elements } = adapter;
      const { blocks, compInstance, framework, lfAttributes } = controller.get;
      const { hasCloseIcon, hasIcon, hasTimer } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const lf = lfAttributes();

      const { lfMessage, lfTimer, lfUiState } = comp;

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      const v = LF_TOAST_CSS_VARIABLES;

      return (
        <div
          class={bemClass(b.toast._)}
          data-lf={lf[lfUiState]}
          ref={assignRef(refs, "toast")}
          style={hasTimer() ? { [v.timer]: `${lfTimer}ms` } : undefined}
        >
          <div
            class={bemClass(b.toast._, b.toast.accent, {
              temporary: hasTimer(),
            })}
          ></div>
          <div
            class={bemClass(b.toast._, b.toast.messageWrapper, {
              full: hasIcon() && hasCloseIcon(),
              "has-actions": hasCloseIcon(),
              "has-icon": hasIcon(),
            })}
          >
            {hasIcon() && prepIcon(adapter, false)}
            {lfMessage && (
              <div
                class={bemClass(b.toast._, b.toast.message)}
                ref={assignRef(refs, "message")}
              >
                {lfMessage}
              </div>
            )}
            {hasCloseIcon() && prepIcon(adapter, true)}
          </div>
        </div>
      );
    },
    //#endregion
  };
};

//#region Helpers
/**
 * Prepares the icon VNode for the toast.
 * @param adapter - The toast adapter instance
 * @param isClose - Whether this is the close icon
 * @returns The icon VNode
 */
const prepIcon = (adapter: LfToastAdapter, isClose: boolean): VNode => {
  const { controller, elements, handlers } = adapter;
  const { blocks, compInstance, framework, parts } = controller.get;

  const comp = compInstance();
  const mgr = framework();
  const b = blocks();
  const p = parts();

  const { lfCloseIcon, lfIcon } = comp;
  const icon = isClose ? lfCloseIcon : lfIcon;

  const { assignRef, theme } = mgr;
  const { bemClass } = theme;
  const { refs } = elements;

  return (
    <div
      class={bemClass(b.toast._, b.toast.icon, {
        "has-actions": isClose,
      })}
      onPointerDown={isClose ? handlers.closeButton : null}
      part={isClose ? p.closeButton : p.icon}
      ref={isClose ? assignRef(refs, "closeButton") : assignRef(refs, "icon")}
      tabIndex={isClose ? 0 : undefined}
    >
      <FIcon framework={mgr} icon={icon as LfIconType} />
    </div>
  );
};
//#endregion

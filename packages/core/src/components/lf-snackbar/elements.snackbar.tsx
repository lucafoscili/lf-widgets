import {
  LfIconType,
  LfSnackbarAdapter,
  LfSnackbarAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { FIcon } from "../../utils/icon";

/**
 * Prepares JSX factory functions for the snackbar component.
 *
 * v4.0.0 Architecture:
 * - Uses `controller.get` for base getters (blocks, compInstance, framework, etc.)
 * - Uses `controller.computed` for derived predicates (hasAction, hasCloseIcon, hasIcon)
 * - Routes all events through dispatcher via handlers
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepSnackbarJsx = (
  getAdapter: () => LfSnackbarAdapter,
): LfSnackbarAdapterJsx => {
  return {
    //#region Snackbar
    snackbar: () => {
      const adapter = getAdapter();
      const { controller, elements, handlers } = adapter;
      const { blocks, compInstance, framework, lfAttributes, parts } =
        controller.get;
      const { hasAction, hasCloseIcon, hasIcon } = controller.computed;

      const comp = compInstance();
      const mgr = framework();
      const b = blocks();
      const p = parts();
      const lf = lfAttributes();

      const { lfAction, lfCloseIcon, lfIcon, lfMessage, lfUiState } = comp;

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;
      const { refs } = elements;

      return (
        <div
          class={bemClass(b.snackbar._)}
          data-lf={lf[lfUiState]}
          ref={assignRef(refs, "snackbar")}
        >
          <div
            class={bemClass(b.snackbar._, b.snackbar.content, {
              "has-icon": hasIcon(),
            })}
            ref={assignRef(refs, "content")}
          >
            {hasIcon() && (
              <div
                class={bemClass(b.snackbar._, b.snackbar.icon, {
                  main: lfUiState === "primary",
                })}
                part={p.icon}
                ref={assignRef(refs, "icon")}
              >
                <FIcon framework={mgr} icon={lfIcon} />
              </div>
            )}
            {lfMessage && (
              <div
                class={bemClass(b.snackbar._, b.snackbar.message)}
                part={p.message}
                ref={assignRef(refs, "message")}
              >
                {lfMessage}
              </div>
            )}
          </div>
          {(hasAction() || hasCloseIcon()) && (
            <div class={bemClass(b.snackbar._, b.snackbar.actions)}>
              {hasAction() && (
                <button
                  class={bemClass(b.snackbar._, b.snackbar.actionButton)}
                  onPointerDown={handlers.action}
                  part={p.actionButton}
                  ref={assignRef(refs, "actionButton")}
                  type="button"
                >
                  {lfAction}
                </button>
              )}
              {hasCloseIcon() && prepCloseButton(adapter, lfCloseIcon)}
            </div>
          )}
        </div>
      );
    },
    //#endregion
  };
};

/**
 * Prepares the close button icon element.
 */
const prepCloseButton = (
  adapter: LfSnackbarAdapter,
  icon: LfIconType | null,
): VNode => {
  const { controller, elements, handlers } = adapter;
  const { blocks, framework, parts } = controller.get;

  const mgr = framework();
  const b = blocks();
  const p = parts();
  const { refs } = elements;
  const { assignRef, theme } = mgr;
  const { bemClass } = theme;

  return (
    <div
      class={bemClass(b.snackbar._, b.snackbar.closeButton)}
      onPointerDown={handlers.close}
      part={p.closeButton}
      ref={assignRef(refs, "closeButton")}
      tabIndex={0}
    >
      <FIcon framework={mgr} icon={icon} />
    </div>
  );
};

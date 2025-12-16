import { LfSnackbarAdapter } from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

//#region Props
export interface SnackbarFCProps {
  adapter: LfSnackbarAdapter;
}
//#endregion

/**
 * FC for the snackbar component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates snackbar UI.
 */
export const SnackbarFC: FunctionalComponent<SnackbarFCProps> = ({
  adapter,
}) => {
  const { controller, elements, handlers } = adapter;
  const { get, computed } = controller;

  const { lfAttributes, parts } = get;
  const { hasAction, hasCloseIcon, hasIcon } = computed;
  const { theme, assignRef } = get.framework();
  const { bemClass } = theme;
  const b = get.blocks();
  const p = parts();
  const lf = lfAttributes();
  const { refs } = elements;
  const comp = get.compInstance();
  const { lfAction, lfCloseIcon, lfIcon, lfMessage, lfUiState } = comp;

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
            <FIcon framework={get.framework()} icon={lfIcon} />
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
          {hasCloseIcon() && (
            <div
              class={bemClass(b.snackbar._, b.snackbar.closeButton)}
              onPointerDown={handlers.close}
              part={p.closeButton}
              ref={assignRef(refs, "closeButton")}
              tabIndex={0}
            >
              <FIcon framework={get.framework()} icon={lfCloseIcon} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

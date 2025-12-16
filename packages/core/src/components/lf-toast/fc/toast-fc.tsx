import {
  LF_TOAST_CSS_VARIABLES,
  LfIconType,
  LfToastAdapter,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";
import { FIcon } from "../../../utils/icon";

//#region Props
export interface ToastFCProps {
  adapter: LfToastAdapter;
}
//#endregion

/**
 * FC for the toast component.
 * Per Section 5.9 "Mirroring Rule" - encapsulates toast UI.
 */
export const ToastFC: FunctionalComponent<ToastFCProps> = ({ adapter }) => {
  const { controller, elements, handlers } = adapter;
  const { get, computed } = controller;

  const blocks = get.blocks();
  const comp = get.compInstance();
  const framework = get.framework();
  const lfAttributes = get.lfAttributes();
  const parts = get.parts();
  const { hasCloseIcon, hasIcon, hasTimer } = computed;

  const { lfCloseIcon, lfIcon, lfMessage, lfTimer, lfUiState } = comp;
  const { assignRef, theme } = framework;
  const { bemClass } = theme;
  const { refs } = elements;
  const { toast } = blocks;
  const v = LF_TOAST_CSS_VARIABLES;

  return (
    <div
      class={bemClass(toast._)}
      data-lf={lfAttributes[lfUiState]}
      ref={assignRef(refs, "toast")}
      style={hasTimer() ? { [v.timer]: `${lfTimer}ms` } : undefined}
    >
      <div class={bemClass(toast._, toast.accent, { temporary: hasTimer() })} />
      <div
        class={bemClass(toast._, toast.messageWrapper, {
          full: hasIcon() && hasCloseIcon(),
          "has-actions": hasCloseIcon(),
          "has-icon": hasIcon(),
        })}
      >
        {hasIcon() && (
          <div
            class={bemClass(toast._, toast.icon)}
            part={parts.icon}
            ref={assignRef(refs, "icon")}
          >
            <FIcon framework={framework} icon={lfIcon as LfIconType} />
          </div>
        )}
        {lfMessage && (
          <div
            class={bemClass(toast._, toast.message)}
            ref={assignRef(refs, "message")}
          >
            {lfMessage}
          </div>
        )}
        {hasCloseIcon() && (
          <div
            class={bemClass(toast._, toast.icon, { "has-actions": true })}
            onPointerDown={handlers.closeButton}
            part={parts.closeButton}
            ref={assignRef(refs, "closeButton")}
            tabIndex={0}
          >
            <FIcon framework={framework} icon={lfCloseIcon as LfIconType} />
          </div>
        )}
      </div>
    </div>
  );
};

import { LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { prepControlActions } from "./elements.controlActions";
import { prepItems } from "./elements.items";

/**
 * Prepares the controls sub-block JSX (snackbar + items + controlActions).
 * Part of the settings panel.
 */
export const prepControls = (
  getAdapter: () => LfShapeeditorAdapter,
): (() => VNode) => {
  return () => {
    const adapter = getAdapter();
    const { controller, elements } = adapter;
    const { blocks, ids, lfAttributes, framework, parts, snackbar } =
      controller.get;
    const { settings } = elements.refs;

    const b = blocks();
    const i = ids();
    const lf = lfAttributes();
    const p = parts();
    const mgr = framework();

    const { assignRef, theme } = mgr;
    const { bemClass } = theme;

    const snackbarState = snackbar();

    // Get items and controlActions JSX
    const itemsJsx = prepItems(getAdapter);
    const controlActionsJsx = prepControlActions(getAdapter);

    return (
      <div class={bemClass(b.settings.controls._)} part={p.settings.controls._}>
        {/* Snackbar notification */}
        {snackbarState.visible && (
          <lf-snackbar
            class={bemClass(
              b.settings.controls._,
              b.settings.controls.snackbar,
            )}
            data-lf={lf.fadeIn}
            id={i.settings.controls.snackbar}
            lfIcon={"--lf-icon-info"}
            lfMessage={snackbarState.message}
            lfPosition="inline"
            lfUiState={snackbarState.uiState}
            ref={assignRef(settings.controls, "snackbar")}
          ></lf-snackbar>
        )}

        {/* Items (accordion with controls) */}
        {itemsJsx()}

        {/* Control actions (reset/apply buttons) */}
        {controlActionsJsx()}
      </div>
    );
  };
};

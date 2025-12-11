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
    const { blocks, ids, lfAttribute, manager, parts, snackbar } =
      controller.get;
    const { settings } = elements.refs;
    const { assignRef, theme } = manager;
    const { bemClass } = theme;

    const snackbarState = snackbar();

    // Get items and controlActions JSX
    const itemsJsx = prepItems(getAdapter);
    const controlActionsJsx = prepControlActions(getAdapter);

    return (
      <div
        class={bemClass(blocks.settings.controls._)}
        part={parts.settings.controls._}
      >
        {/* Snackbar notification */}
        {snackbarState.visible && (
          <lf-snackbar
            class={bemClass(
              blocks.settings.controls._,
              blocks.settings.controls.snackbar,
            )}
            data-lf={lfAttribute.fadeIn}
            id={ids.settings.controls.snackbar}
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

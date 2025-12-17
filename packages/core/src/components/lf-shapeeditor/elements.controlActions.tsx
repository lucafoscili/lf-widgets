import { LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";

/**
 * Prepares the controlActions sub-block JSX (apply + reset buttons).
 * Part of the controls sub-block within settings panel.
 */
export const prepControlActions = (
  getAdapter: () => LfShapeeditorAdapter,
): (() => VNode) => {
  return () => {
    const adapter = getAdapter();
    const { controller, elements, handlers } = adapter;
    const { blocks, config, cyAttributes, ids, framework, parts } =
      controller.get;
    const { settings } = elements.refs;
    const { controlActionsButton } = handlers.settings;

    const b = blocks();
    const cy = cyAttributes();
    const i = ids();
    const p = parts();
    const mgr = framework();

    const { assignRef, theme } = mgr;
    const { bemClass } = theme;

    // Get DSL behavior metadata to determine button visibility
    const controls = config?.controls?.() || [];
    const hasControls = controls.length > 0;

    // Use DSL flags if available, otherwise fallback to defaults:
    // - showApplyButton: default false (only show for "manual" behavior)
    // - showResetButton: default true (always show unless explicitly disabled)
    const showApply = config?.showApplyButton?.() ?? false;
    const showReset = config?.showResetButton?.() ?? true;

    // Don't render anything if no controls and no explicit button config
    if (!hasControls) {
      return null;
    }

    return (
      <div
        class={bemClass(b.settings.controls.controlActions._)}
        part={p.settings.controls.controlActions}
      >
        {/* Reset */}
        {showReset && (
          <ButtonFC
            className={bemClass(
              b.settings.controls.controlActions._,
              b.settings.controls.controlActions.reset,
            )}
            dataCy={cy.button}
            framework={mgr}
            icon={"--lf-icon-refresh"}
            id={i.settings.controls.controlActions.reset}
            label="Reset"
            onClick={(e) =>
              controlActionsButton(e, i.settings.controls.controlActions.reset)
            }
            buttonRef={assignRef(settings.controls.controlActions, "reset")}
            styling="flat"
            uiState="warning"
          />
        )}

        {/* Apply */}
        {showApply && (
          <ButtonFC
            className={bemClass(
              b.settings.controls.controlActions._,
              b.settings.controls.controlActions.apply,
            )}
            dataCy={cy.button}
            framework={mgr}
            icon={"--lf-icon-success"}
            id={i.settings.controls.controlActions.apply}
            label="Apply"
            onClick={(e) =>
              controlActionsButton(e, i.settings.controls.controlActions.apply)
            }
            buttonRef={assignRef(settings.controls.controlActions, "apply")}
            styling="flat"
            uiState="success"
          />
        )}
      </div>
    );
  };
};

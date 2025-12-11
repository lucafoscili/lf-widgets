import { LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

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
    const { blocks, config, cyAttributes, ids, manager, parts } =
      controller.get;
    const { settings } = elements.refs;
    const { controlActionsButton } = handlers.settings;
    const { assignRef, theme } = manager;
    const { bemClass } = theme;

    // Get DSL behavior metadata to determine if Apply button should show
    const controls = config?.controls?.() || [];
    const showApply = controls.length > 0;

    return (
      <div
        class={bemClass(blocks.settings.controls.controlActions._)}
        part={parts.settings.controls.controlActions}
      >
        {/* Reset */}
        <lf-button
          class={bemClass(
            blocks.settings.controls.controlActions._,
            blocks.settings.controls.controlActions.reset,
          )}
          data-cy={cyAttributes.button}
          id={ids.settings.controls.controlActions.reset}
          lfIcon={"--lf-icon-refresh"}
          lfLabel="Reset"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState="warning"
          onLf-button-event={controlActionsButton}
          ref={assignRef(settings.controls.controlActions, "reset")}
        ></lf-button>

        {/* Apply */}
        {showApply && (
          <lf-button
            class={bemClass(
              blocks.settings.controls.controlActions._,
              blocks.settings.controls.controlActions.apply,
            )}
            data-cy={cyAttributes.button}
            id={ids.settings.controls.controlActions.apply}
            lfIcon={"--lf-icon-success"}
            lfLabel="Apply"
            lfStretchX={true}
            lfStyling="flat"
            lfUiState="success"
            onLf-button-event={controlActionsButton}
            ref={assignRef(settings.controls.controlActions, "apply")}
          ></lf-button>
        )}
      </div>
    );
  };
};

import {
  IDS,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterJsx,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { prepActions } from "./elements.actions";
import { prepControls } from "./elements.controls";

/**
 * Prepares the settings panel JSX functions.
 * Contains actions, progressbar, tree, and controls sub-blocks.
 */
export const prepSettings = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx["settings"] => {
  return {
    //#region Actions (delete, badge, list, clear, redo, undo, commit)
    actions: prepActions(getAdapter),
    //#endregion

    //#region Controls (snackbar + items + controlActions)
    controls: prepControls(getAdapter),
    //#endregion

    //#region Progressbar
    progressbar: (): VNode => {
      const { controller, elements } = getAdapter();
      const { blocks, lfAttribute, manager, progressbar } = controller.get;
      const { settings } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const settingsBlock = blocks.settings;

      const state = progressbar();
      if (!state.visible) {
        return null;
      }

      return (
        <lf-progressbar
          class={bemClass(settingsBlock._, settingsBlock.progressbar, {
            hidden: !state.visible,
          })}
          data-lf={lfAttribute.fadeIn}
          id={IDS.settings.progressbar}
          lfAnimated={true}
          lfCenteredLabel={true}
          lfLabel={` `}
          lfUiSize="xsmall"
          lfUiState="info"
          lfValue={state.value}
          ref={assignRef(settings, "progressbar")}
        ></lf-progressbar>
      );
    },
    //#endregion

    //#region Tree (DSL selector)
    tree: (): VNode => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, manager } = controller.get;
      const { settings } = elements.refs;
      const { tree } = handlers.settings;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const settingsBlock = blocks.settings;

      return (
        <lf-tree
          class={bemClass(settingsBlock._, settingsBlock.tree)}
          data-cy={cyAttributes.input}
          id={IDS.settings.tree}
          lfAccordionLayout={true}
          lfDataset={compInstance.lfValue}
          lfFilter={false}
          lfSelectable={true}
          lfUiSize="small"
          onLf-tree-event={tree}
          ref={assignRef(settings, "tree")}
        ></lf-tree>
      );
    },
    //#endregion
  };
};

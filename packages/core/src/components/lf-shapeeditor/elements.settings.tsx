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
      const { blocks, lfAttributes, framework, progressbar } = controller.get;
      const { settings } = elements.refs;

      const b = blocks();
      const lf = lfAttributes();
      const mgr = framework();

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      const settingsBlock = b.settings;

      const state = progressbar();
      if (!state.visible) {
        return null;
      }

      return (
        <lf-progressbar
          class={bemClass(settingsBlock._, settingsBlock.progressbar, {
            hidden: !state.visible,
          })}
          data-lf={lf.fadeIn}
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
      const { blocks, compInstance, cyAttributes, framework } = controller.get;
      const { settings } = elements.refs;
      const { tree } = handlers.settings;

      const b = blocks();
      const cy = cyAttributes();
      const mgr = framework();
      const comp = compInstance();

      const { assignRef, theme } = mgr;
      const { bemClass } = theme;

      const settingsBlock = b.settings;

      return (
        <lf-tree
          class={bemClass(settingsBlock._, settingsBlock.tree)}
          data-cy={cy.input}
          id={IDS.settings.tree}
          lfAccordionLayout={true}
          lfDataset={comp.lfValue}
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

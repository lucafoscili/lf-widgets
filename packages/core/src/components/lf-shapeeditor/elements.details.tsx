import {
  IDS,
  LfDataCell,
  LfDataShapes,
  LfShapeeditorAdapter,
  LfShapeeditorAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { LfShape } from "../../utils/shapes";

export const prepDetails = (
  getAdapter: () => LfShapeeditorAdapter,
): LfShapeeditorAdapterJsx["details"] => {
  return {
    // #region Shape
    shape: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, history, lfAttribute, manager } =
        controller.get;
      const { details } = elements.refs;
      const { shape } = handlers.details;
      const { currentSnapshot } = history;
      const { lfShape } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const snapshot = currentSnapshot();
      if (!snapshot) {
        return;
      }

      // Use the original cell from the snapshot (contains full props like lfDataset, lfSeries, etc.)
      // Fall back to a minimal cell with just value for backwards compatibility
      const originalCell = snapshot.shape?.shape;
      const cell = (
        originalCell
          ? { ...originalCell, shape: lfShape }
          : {
              shape: lfShape,
              value: snapshot.value,
              lfValue: snapshot.value,
            }
      ) as LfDataCell<LfDataShapes>;

      return (
        <div
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.shape)}
          data-lf={lfAttribute.fadeIn}
          id={IDS.details.shape}
          ref={assignRef(details, "shape")}
        >
          <LfShape
            cell={cell}
            eventDispatcher={async (e) => shape(e)}
            framework={manager}
            index={snapshot.shape?.index ?? 0}
            shape={lfShape}
          />
        </div>
      );
    },
    // #endregion

    // #region Clear history
    clearHistory: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, history, manager } = controller.get;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { current } = history;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const icon = get.icon("stackPop");
      const hasHistory = !!(current()?.length > 1);
      const isDisabled = !hasHistory;

      return (
        <lf-button
          class={bemClass(
            blocks.detailsGrid._,
            blocks.detailsGrid.clearHistory,
          )}
          data-cy={cyAttributes.button}
          id={IDS.details.clearHistory}
          lfIcon={icon}
          lfLabel="Clear history"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "danger"}
          onLf-button-event={button}
          ref={assignRef(details, "clearHistory")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Delete shape
    deleteShape: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager } = controller.get;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { "--lf-icon-clear": icon } = get.current().variables;

      return (
        <lf-button
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.delete)}
          data-cy={cyAttributes.button}
          id={IDS.details.deleteShape}
          lfIcon={icon}
          lfLabel="Delete"
          lfStretchX={true}
          lfUiState="danger"
          onLf-button-event={button}
          ref={assignRef(details, "deleteShape")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Redo
    redo: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, history, manager } = controller.get;
      const { current, index } = history;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { "--lf-icon-next": icon } = get.current().variables;

      const currentHistory = current();
      const hasHistory = !!currentHistory?.length;
      const isDisabled = !(hasHistory && index() < currentHistory.length - 1);

      return (
        <lf-button
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.redo)}
          data-cy={cyAttributes.button}
          id={IDS.details.redo}
          lfIcon={icon}
          lfLabel="Redo"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "primary"}
          onLf-button-event={button}
          ref={assignRef(details, "redo")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Save
    save: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, history, manager } = controller.get;
      const { current } = history;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { "--lf-icon-success": icon } = get.current().variables;

      const hasHistory = !!(current()?.length > 1);
      const isDisabled = !hasHistory;

      return (
        <lf-button
          class={bemClass(
            blocks.detailsGrid._,
            blocks.detailsGrid.commitChanges,
          )}
          data-cy={cyAttributes.button}
          id={IDS.details.save}
          lfIcon={icon}
          lfLabel="Save snapshot"
          lfStretchX={true}
          lfUiState={isDisabled ? "disabled" : "success"}
          onLf-button-event={button}
          ref={assignRef(details, "save")}
        ></lf-button>
      );
    },
    // #endregion

    // #region Spinner
    spinner: () => {
      const { controller, elements } = getAdapter();
      const { blocks, manager, spinnerStatus } = controller.get;
      const { details } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-spinner
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.spinner)}
          id={IDS.details.spinner}
          lfActive={spinnerStatus()}
          lfDimensions="16px"
          lfFader={true}
          lfFaderTimeout={125}
          lfLayout={14}
          ref={assignRef(details, "save")}
        ></lf-spinner>
      );
    },
    // #endregion

    // #region Tree
    tree: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, compInstance, cyAttributes, manager } = controller.get;
      const { details } = elements.refs;
      const { tree } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-tree
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.tree)}
          data-cy={cyAttributes.input}
          id={IDS.details.tree}
          lfAccordionLayout={true}
          lfDataset={compInstance.lfValue}
          lfFilter={false}
          lfSelectable={true}
          lfUiSize="small"
          onLf-tree-event={tree}
          ref={assignRef(details, "tree")}
        ></lf-tree>
      );
    },
    // #endregion

    // #region Undo
    undo: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, history, manager } = controller.get;
      const { current, index } = history;
      const { details } = elements.refs;
      const { button } = handlers.details;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { "--lf-icon-previous": icon } = get.current().variables;

      const hasHistory = !!current()?.length;
      const isDisabled = !(hasHistory && index() > 0);

      return (
        <lf-button
          class={bemClass(blocks.detailsGrid._, blocks.detailsGrid.undo)}
          data-cy={cyAttributes.button}
          id={IDS.details.undo}
          lfIcon={icon}
          lfLabel="Undo"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "primary"}
          onLf-button-event={button}
          ref={assignRef(details, "undo")}
        ></lf-button>
      );
    },
    // #endregion
  };
};

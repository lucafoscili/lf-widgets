import { LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";

/**
 * Prepares the actions sub-block JSX (delete, badge, clear, redo, undo, commit).
 * Part of the settings panel.
 */
export const prepActions = (
  getAdapter: () => LfShapeeditorAdapter,
): (() => VNode) => {
  return () => {
    const adapter = getAdapter();
    const { controller, elements, handlers } = adapter;
    const { blocks, cyAttributes, history, ids, manager, parts } =
      controller.get;
    const { current, index, isPopupOpen } = history;
    const { settings } = elements.refs;
    const { actionsButton } = handlers.settings;
    const { assignRef, theme } = manager;
    const { bemClass, get } = theme;

    const actionsBlock = blocks.settings.actions;
    const settingsParts = parts.settings;

    const currentHistory = current();
    const hasHistory = !!currentHistory?.length;
    const currentIndex = index();

    // Icon variables
    const {
      "--lf-icon-clear": deleteIcon,
      "--lf-icon-next": redoIcon,
      "--lf-icon-previous": undoIcon,
      "--lf-icon-success": saveIcon,
    } = get.current().variables;
    const clearHistoryIcon = get.icon("stackPop");

    // Button states
    const isUndoDisabled = !(hasHistory && currentIndex > 0);
    const isRedoDisabled = !(
      hasHistory && currentIndex < currentHistory.length - 1
    );
    const isClearHistoryDisabled = !(currentHistory?.length > 1);
    const isSaveDisabled = !(currentHistory?.length > 1);

    // History badge data
    const total = currentHistory?.length || 0;
    const historyIcon = get.icon("stackPop");
    const isHistoryOpen = isPopupOpen();

    return (
      <div class={bemClass(actionsBlock._)} part={settingsParts.actions}>
        {/* Delete Shape */}
        <lf-button
          class={bemClass(actionsBlock._, actionsBlock.delete)}
          data-cy={cyAttributes.button}
          id={ids.settings.actions.delete}
          lfIcon={deleteIcon}
          lfLabel="Delete"
          lfStretchX={true}
          lfUiState="danger"
          onLf-button-event={actionsButton}
          ref={assignRef(settings.actions, "delete")}
        ></lf-button>

        {/* History Toggle Button */}
        {hasHistory && (
          <lf-button
            class={bemClass(actionsBlock._, actionsBlock.badge)}
            data-cy={cyAttributes.button}
            id={ids.settings.actions.badge}
            lfIcon={historyIcon}
            lfLabel={`History: ${currentIndex + 1}/${total}`}
            lfStretchY={true}
            lfStyling={isHistoryOpen ? "raised" : "flat"}
            lfUiSize="small"
            lfUiState={isHistoryOpen ? "secondary" : "primary"}
            onLf-button-event={actionsButton}
            ref={assignRef(settings.actions, "badge")}
          ></lf-button>
        )}

        {/* Clear History */}
        <lf-button
          class={bemClass(actionsBlock._, actionsBlock.clear)}
          data-cy={cyAttributes.button}
          id={ids.settings.actions.clear}
          lfIcon={clearHistoryIcon}
          lfLabel="Clear history"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isClearHistoryDisabled ? "disabled" : "danger"}
          onLf-button-event={actionsButton}
          ref={assignRef(settings.actions, "clear")}
        ></lf-button>

        {/* Undo */}
        <lf-button
          class={bemClass(actionsBlock._, actionsBlock.undo)}
          data-cy={cyAttributes.button}
          id={ids.settings.actions.undo}
          lfIcon={undoIcon}
          lfLabel="Undo"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isUndoDisabled ? "disabled" : "primary"}
          onLf-button-event={actionsButton}
          ref={assignRef(settings.actions, "undo")}
        ></lf-button>

        {/* Redo */}
        <lf-button
          class={bemClass(actionsBlock._, actionsBlock.redo)}
          data-cy={cyAttributes.button}
          id={ids.settings.actions.redo}
          lfIcon={redoIcon}
          lfLabel="Redo"
          lfStretchX={true}
          lfStyling="flat"
          lfUiState={isRedoDisabled ? "disabled" : "primary"}
          onLf-button-event={actionsButton}
          ref={assignRef(settings.actions, "redo")}
        ></lf-button>

        {/* Commit/Save Snapshot */}
        <lf-button
          class={bemClass(actionsBlock._, actionsBlock.commit)}
          data-cy={cyAttributes.button}
          id={ids.settings.actions.commit}
          lfIcon={saveIcon}
          lfLabel="Save snapshot"
          lfStretchX={true}
          lfUiState={isSaveDisabled ? "disabled" : "success"}
          onLf-button-event={actionsButton}
          ref={assignRef(settings.actions, "commit")}
        ></lf-button>
      </div>
    );
  };
};

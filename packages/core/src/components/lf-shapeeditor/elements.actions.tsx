import { LfShapeeditorAdapter } from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";

/**
 * Prepares the actions sub-block JSX (delete, badge, clear, redo, undo, commit).
 * Part of the settings panel.
 *
 * v4.0.0 Architecture:
 * - All getters are called as functions: `blocks()`, `framework()`, etc.
 * - Uses `framework` (renamed from `manager`)
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
export const prepActions = (
  getAdapter: () => LfShapeeditorAdapter,
): (() => VNode) => {
  return () => {
    const adapter = getAdapter();
    const { controller, elements, handlers } = adapter;
    const { blocks, cyAttributes, history, ids, framework, parts } =
      controller.get;
    const { current, index, isPopupOpen } = history;
    const { settings } = elements.refs;
    const { actionsButton } = handlers.settings;

    // Call getters as functions (v4.0.0)
    const b = blocks();
    const cy = cyAttributes();
    const p = parts();
    const mgr = framework();

    const { assignRef, theme } = mgr;
    const { bemClass, get } = theme;

    const actionsBlock = b.settings.actions;
    const settingsParts = p.settings;

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
        <ButtonFC
          className={bemClass(actionsBlock._, actionsBlock.delete)}
          dataCy={cy.button}
          framework={mgr}
          icon={deleteIcon}
          id={ids().settings.actions.delete}
          label="Delete"
          onClick={(e) => actionsButton(e, ids().settings.actions.delete)}
          buttonRef={assignRef(settings.actions, "delete")}
          uiState="danger"
        />

        {/* History Toggle Button */}
        {hasHistory && (
          <ButtonFC
            className={bemClass(actionsBlock._, actionsBlock.badge)}
            dataCy={cy.toggle}
            framework={mgr}
            icon={historyIcon}
            id={ids().settings.actions.badge}
            label={`History: ${currentIndex + 1}/${total}`}
            onClick={(e) => actionsButton(e, ids().settings.actions.badge)}
            buttonRef={assignRef(settings.actions, "badge")}
            styling={isHistoryOpen ? "raised" : "flat"}
            uiSize="small"
            uiState={isHistoryOpen ? "secondary" : "primary"}
          />
        )}

        {/* Clear History */}
        <ButtonFC
          className={bemClass(actionsBlock._, actionsBlock.clear)}
          dataCy={cy.button}
          disabled={isClearHistoryDisabled}
          framework={mgr}
          icon={clearHistoryIcon}
          id={ids().settings.actions.clear}
          label="Clear history"
          onClick={(e) => actionsButton(e, ids().settings.actions.clear)}
          buttonRef={assignRef(settings.actions, "clear")}
          styling="flat"
          uiState={isClearHistoryDisabled ? "disabled" : "danger"}
        />

        {/* Undo */}
        <ButtonFC
          className={bemClass(actionsBlock._, actionsBlock.undo)}
          dataCy={cy.button}
          disabled={isUndoDisabled}
          framework={mgr}
          icon={undoIcon}
          id={ids().settings.actions.undo}
          label="Undo"
          onClick={(e) => actionsButton(e, ids().settings.actions.undo)}
          buttonRef={assignRef(settings.actions, "undo")}
          styling="flat"
          uiState={isUndoDisabled ? "disabled" : "primary"}
        />

        {/* Redo */}
        <ButtonFC
          className={bemClass(actionsBlock._, actionsBlock.redo)}
          dataCy={cy.button}
          disabled={isRedoDisabled}
          framework={mgr}
          icon={redoIcon}
          id={ids().settings.actions.redo}
          label="Redo"
          onClick={(e) => actionsButton(e, ids().settings.actions.redo)}
          buttonRef={assignRef(settings.actions, "redo")}
          styling="flat"
          uiState={isRedoDisabled ? "disabled" : "primary"}
        />

        {/* Commit/Save Snapshot */}
        <ButtonFC
          className={bemClass(actionsBlock._, actionsBlock.commit)}
          dataCy={cy.button}
          disabled={isSaveDisabled}
          framework={mgr}
          icon={saveIcon}
          id={ids().settings.actions.commit}
          label="Save snapshot"
          onClick={(e) => actionsButton(e, ids().settings.actions.commit)}
          buttonRef={assignRef(settings.actions, "commit")}
          uiState={isSaveDisabled ? "disabled" : "success"}
        />
      </div>
    );
  };
};

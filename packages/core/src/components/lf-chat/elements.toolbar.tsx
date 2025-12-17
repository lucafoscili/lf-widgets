import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
  LfChipElement,
  LfLLMChoiceMessage,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";

export const prepToolbar = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["toolbar"] => {
  return {
    //#region Copy content
    copyContent: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const parts = get.parts();
      const { toolbar } = elements.refs;
      const { button } = handlers.toolbar;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      const isDisabled = Boolean(get.currentPrompt());

      return (
        <ButtonFC
          className={bemClass(blocks.toolbar._, blocks.toolbar.button)}
          framework={get.framework()}
          icon={themeGet.current().variables["--lf-icon-copy"]}
          id={LF_CHAT_IDS.toolbar.copyContent}
          disabled={isDisabled}
          onClick={(e) => button(e, LF_CHAT_IDS.toolbar.copyContent, m)}
          buttonRef={assignRef(toolbar, "copyContent")}
          styling="flat"
          uiState={isDisabled ? "disabled" : "primary"}
        />
      );
    },
    //#endregion
    //#region Edit message
    editMessage: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const parts = get.parts();
      const { toolbar } = elements.refs;
      const { button } = handlers.toolbar;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      const isDisabled = Boolean(get.currentPrompt());

      return (
        <ButtonFC
          className={bemClass(blocks.toolbar._, blocks.toolbar.button)}
          framework={get.framework()}
          icon={themeGet.current().variables["--lf-icon-edit"]}
          id={LF_CHAT_IDS.toolbar.editMessage}
          disabled={isDisabled}
          onClick={(e) => button(e, LF_CHAT_IDS.toolbar.editMessage, m)}
          buttonRef={assignRef(toolbar, "editMessage")}
          styling="flat"
          uiState={isDisabled ? "disabled" : "primary"}
        />
      );
    },
    //#endregion

    //#region Delete message
    deleteMessage: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const parts = get.parts();
      const { toolbar } = elements.refs;
      const { button } = handlers.toolbar;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      const isDisabled = Boolean(get.currentPrompt());

      return (
        <ButtonFC
          className={bemClass(blocks.toolbar._, blocks.toolbar.button)}
          framework={get.framework()}
          icon={themeGet.current().variables["--lf-icon-delete"]}
          id={LF_CHAT_IDS.toolbar.deleteMessage}
          disabled={isDisabled}
          onClick={(e) => button(e, LF_CHAT_IDS.toolbar.deleteMessage, m)}
          buttonRef={assignRef(toolbar, "deleteMessage")}
          styling="flat"
          uiState={isDisabled ? "disabled" : "danger"}
        />
      );
    },
    //#endregion

    //#region Regenerate
    regenerate: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const parts = get.parts();
      const { toolbar } = elements.refs;
      const { button } = handlers.toolbar;
      const { assignRef, theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      const isDisabled = Boolean(get.currentPrompt());

      return (
        <ButtonFC
          className={bemClass(blocks.toolbar._, blocks.toolbar.button)}
          framework={get.framework()}
          icon={themeGet.current().variables["--lf-icon-refresh"]}
          id={LF_CHAT_IDS.toolbar.regenerate}
          disabled={isDisabled}
          onClick={(e) => button(e, LF_CHAT_IDS.toolbar.regenerate, m)}
          buttonRef={assignRef(toolbar, "regenerate")}
          styling="flat"
          uiState={isDisabled ? "disabled" : "primary"}
        />
      );
    },
    //#endregion

    //#region Message attachments
    messageAttachments: (m, isEditing = false) => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const parts = get.parts();
      const { toolbar } = elements.refs;
      const { chip } = handlers.toolbar;
      const { theme } = get.framework();
      const { bemClass, get: themeGet } = theme;

      const attachments = m.attachments;
      if (!attachments || attachments.length === 0) {
        return null;
      }

      const messageIndex = get.history().indexOf(m);
      const refKey = String(messageIndex);

      const styling = isEditing ? "input" : "choice";

      return (
        <div
          class={bemClass(blocks.toolbar._, blocks.toolbar.messageAttachments)}
        >
          <lf-chip
            lfDataset={{
              nodes: attachments.map((att) => ({
                description: att.name,
                icon:
                  att.type === "image_url"
                    ? themeGet.current().variables["--lf-icon-image"]
                    : themeGet.current().variables["--lf-icon-attachment"],
                id: att.id,
                value: att.name,
              })),
            }}
            lfStyling={styling}
            lfUiSize="xsmall"
            onLf-chip-event={(e) => chip(e, m)}
            part={parts.messageAttachments}
            ref={(el) => {
              if (el) {
                toolbar.messageAttachments.set(refKey, el as LfChipElement);
              }
            }}
          />
        </div>
      );
    },
    //#endregion

    //#region Tool chip
    toolExecution: (m) => {
      const { controller, elements } = getAdapter();
      const { get } = controller;

      const blocks = get.blocks();
      const { toolbar } = elements.refs;
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      const dataset = m.toolExecution;
      if (!dataset || !dataset.nodes || !dataset.nodes[0]) {
        return null;
      }

      const root = dataset.nodes[0];
      const isWorking = root.value === "Working..." && !root.icon;

      return (
        <div class={bemClass(blocks.toolbar._, blocks.toolbar.toolExecution)}>
          <lf-chip
            lfDataset={dataset}
            lfFlat={true}
            lfUiSize="xsmall"
            lfShowSpinner={isWorking}
            ref={assignRef(toolbar, "toolExecution")}
          />
        </div>
      );
    },
    //#endregion
  };
};

import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { ButtonFC } from "../lf-button/fc/button-fc";
import { LfTextfieldFC } from "../lf-textfield/lf-textfield-fc";

export const prepChat = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["chat"] => {
  return {
    //#region Attachments
    attachments: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { chat } = elements.refs;
      const { chip } = handlers.chat;

      const blocks = get.blocks();
      const lfAttributes = get.lfAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      const attachments = get.currentAttachments();
      const currentTheme = theme.get.current();

      if (!attachments?.length) {
        return null;
      }

      return (
        <lf-chip
          class={bemClass(blocks.chat._, blocks.chat.attachments)}
          data-lf={lfAttributes.fadeIn}
          id={LF_CHAT_IDS.chat.attachments}
          lfDataset={{
            nodes: attachments.map((att) => ({
              description: att.name,
              icon:
                att.type === "image_url"
                  ? currentTheme.variables["--lf-icon-image"]
                  : currentTheme.variables["--lf-icon-attachment"],
              id: att.id,
              type: att.type,
              value: att.name,
            })),
          }}
          lfStyling="input"
          onLf-chip-event={chip}
          part={parts.attachments}
          ref={assignRef(chat, "attachments")}
        ></lf-chip>
      );
    },
    //#endregion

    //#region Clear
    clear: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { button } = handlers.chat;
      const { chat } = elements.refs;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      return (
        <ButtonFC
          className={bemClass(blocks.commands._, blocks.commands.clear)}
          framework={get.framework()}
          icon="--lf-icon-clear"
          id={LF_CHAT_IDS.chat.clear}
          label="Clear"
          disabled={Boolean(get.currentPrompt())}
          onClick={(e) => button(e, LF_CHAT_IDS.chat.clear)}
          buttonRef={assignRef(chat, "clear")}
          styling="flat"
          uiState={get.currentPrompt() ? "disabled" : "danger"}
        />
      );
    },
    //#endregion

    //#region Configuration
    configuration: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { chat } = elements.refs;
      const { button } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      return (
        <ButtonFC
          className={bemClass(blocks.chat._, blocks.chat.configuration)}
          framework={get.framework()}
          icon="--lf-icon-settings"
          id={LF_CHAT_IDS.chat.configuration}
          label="Configuration"
          onClick={(e) => button(e, LF_CHAT_IDS.chat.configuration)}
          buttonRef={assignRef(chat, "configuration")}
          styling="outlined"
        />
      );
    },
    //#endregion

    //#region Editable Message
    editableMessage: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { chat } = elements.refs;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      return (
        <div class={bemClass(blocks.chat._, blocks.chat.editContainer)}>
          <LfTextfieldFC
            className={bemClass(blocks.chat._, blocks.chat.editTextarea)}
            framework={get.framework()}
            id={LF_CHAT_IDS.chat.editTextarea}
            styling="textarea"
            uiState="primary"
            value={m.content}
            inputRef={assignRef(chat, "editTextarea")}
            style={{ width: "100%" }}
          />
          <div class={bemClass(blocks.chat._, blocks.chat.editButtons)}>
            <ButtonFC
              framework={get.framework()}
              icon="--lf-icon-clear"
              id={LF_CHAT_IDS.chat.editCancel}
              label="Cancel"
              onClick={(e) =>
                handlers.chat.button(e, LF_CHAT_IDS.chat.editCancel)
              }
              buttonRef={assignRef(chat, "editCancel")}
              styling="flat"
              uiState="danger"
              style={{ width: "100%" }}
            />
            <ButtonFC
              framework={get.framework()}
              icon="--lf-icon-success"
              id={LF_CHAT_IDS.chat.editConfirm}
              label="Confirm"
              onClick={(e) =>
                handlers.chat.button(e, LF_CHAT_IDS.chat.editConfirm)
              }
              buttonRef={assignRef(chat, "editConfirm")}
              styling="flat"
              uiState="success"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      );
    },
    //#endregion

    //#region Message
    messageBlock: (text) => {
      const { controller } = getAdapter();
      const { get } = controller;
      const blocks = get.blocks();
      const { theme } = get.framework();
      const { bemClass } = theme;

      return (
        <div class={bemClass(blocks.messages._, blocks.messages.paragraph)}>
          {text}
        </div>
      );
    },
    //#endregion

    //#region Retry
    retry: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { chat } = elements.refs;
      const { button } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      return (
        <ButtonFC
          className={bemClass(blocks.chat._, blocks.chat.retry)}
          framework={get.framework()}
          icon="--lf-icon-refresh"
          id={LF_CHAT_IDS.chat.retry}
          onClick={(e) => button(e, LF_CHAT_IDS.chat.retry)}
          buttonRef={assignRef(chat, "retry")}
          styling="icon"
        />
      );
    },
    //#endregion

    //#region Send
    send: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { chat } = elements.refs;
      const { button } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      const isStreaming = Boolean(get.currentAbortStreaming());
      const showSpinner = Boolean(get.currentPrompt() && !isStreaming);
      const label = isStreaming ? "Stop" : "Send";
      const status: LfThemeUIState = isStreaming ? "danger" : "primary";

      return (
        <ButtonFC
          className={bemClass(blocks.chat._, blocks.chat.send)}
          framework={get.framework()}
          icon={isStreaming ? "off-send" : "send"}
          id={LF_CHAT_IDS.chat.send}
          label={label}
          showSpinner={showSpinner}
          onClick={(e) => button(e, LF_CHAT_IDS.chat.send)}
          buttonRef={assignRef(chat, "send")}
          uiState={status}
        />
      );
    },
    //#endregion

    //#region Spinner
    spinner: () => {
      const { controller, elements } = getAdapter();
      const { get } = controller;
      const { chat } = elements.refs;
      const { assignRef } = get.framework();

      const showSpinner = Boolean(get.currentPrompt());

      return (
        <lf-spinner
          lfActive={showSpinner}
          lfBarVariant={true}
          lfLayout="dots"
          ref={assignRef(chat, "spinner")}
        ></lf-spinner>
      );
    },
    //#endregion

    //#region Stt
    stt: () => {
      const { controller, elements, handlers } = getAdapter();
      const { get } = controller;
      const { chat } = elements.refs;
      const { button } = handlers.chat;

      const blocks = get.blocks();
      const cyAttributes = get.cyAttributes();
      const parts = get.parts();
      const { assignRef, theme } = get.framework();
      const { bemClass } = theme;

      return (
        <ButtonFC
          className={bemClass(blocks.commands._, blocks.commands.stt)}
          framework={get.framework()}
          icon="microphone"
          id={LF_CHAT_IDS.chat.stt}
          onClick={(e) => button(e, LF_CHAT_IDS.chat.stt)}
          buttonRef={assignRef(chat, "stt")}
          styling="icon"
        />
      );
    },
    //#endregion
  };
};

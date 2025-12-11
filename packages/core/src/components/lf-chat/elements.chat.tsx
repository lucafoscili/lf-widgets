import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepChat = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["chat"] => {
  return {
    //#region Attachments
    attachments: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, lfAttributes, manager } = controller.get;
      const { chat } = elements.refs;
      const { chip } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const attachments = controller.get.currentAttachments();
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
          part={blocks.chat.attachments}
          ref={assignRef(chat, "attachments")}
        ></lf-chip>
      );
    },
    //#endregion

    //#region Clear
    clear: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, currentPrompt, cyAttributes, manager, parts } =
        controller.get;
      const { button } = handlers.chat;
      const { chat } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-button
          class={bemClass(blocks.commands._, blocks.commands.clear)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.clear}
          lfIcon={"--lf-icon-clear"}
          lfLabel="Clear"
          lfStyling={"flat"}
          lfUiState={currentPrompt() ? "disabled" : "danger"}
          onLf-button-event={button}
          part={parts.clear}
          ref={assignRef(chat, "clear")}
          title="Clear the textarea."
        ></lf-button>
      );
    },
    //#endregion

    //#region Configuration
    configuration: () => {
      const { controller, elements, handlers } = getAdapter();

      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { chat } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-button
          class={bemClass(blocks.chat._, blocks.chat.configuration)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.configuration}
          key={LF_CHAT_IDS.chat.configuration}
          lfIcon={"--lf-icon-settings"}
          lfLabel="Configuration"
          lfStyling="outlined"
          onLf-button-event={button}
          part={parts.configuration}
          ref={assignRef(chat, "configuration")}
        ></lf-button>
      );
    },
    //#endregion

    //#region Editable Message
    editableMessage: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { chat } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <div class={bemClass(blocks.chat._, blocks.chat.editContainer)}>
          <lf-textfield
            class={bemClass(blocks.chat._, blocks.chat.editTextarea)}
            data-cy={cyAttributes.input}
            id={LF_CHAT_IDS.chat.editTextarea}
            lfStretchX={true}
            lfStyling="textarea"
            lfUiState="primary"
            lfValue={m.content}
            ref={assignRef(chat, "editTextarea")}
          ></lf-textfield>
          <div class={bemClass(blocks.chat._, blocks.chat.editButtons)}>
            <lf-button
              data-cy={cyAttributes.button}
              id={LF_CHAT_IDS.chat.editCancel}
              lfIcon="--lf-icon-clear"
              lfLabel="Cancel"
              lfStretchX={true}
              lfStyling="flat"
              lfUiState="danger"
              onLf-button-event={handlers.chat.button}
              part={parts.editCancel}
              ref={assignRef(chat, "editCancel")}
              title="Cancel editing message."
            ></lf-button>
            <lf-button
              data-cy={cyAttributes.button}
              id={LF_CHAT_IDS.chat.editConfirm}
              lfIcon="--lf-icon-success"
              lfLabel="Confirm"
              lfStretchX={true}
              lfStyling="flat"
              lfUiState="success"
              onLf-button-event={handlers.chat.button}
              part={parts.editConfirm}
              ref={assignRef(chat, "editConfirm")}
              title="Confirm editing message."
            ></lf-button>
          </div>
        </div>
      );
    },
    //#endregion

    //#region Message
    messageBlock: (text) => {
      const { controller } = getAdapter();
      const { blocks, manager } = controller.get;
      const { theme } = manager;
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
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { chat } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-button
          lfAriaLabel="Retry connection"
          class={bemClass(blocks.chat._, blocks.chat.retry)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.retry}
          lfIcon={"--lf-icon-refresh"}
          lfStyling={"icon"}
          onLf-button-event={button}
          part={parts.retry}
          ref={assignRef(chat, "retry")}
          title="Retry connection to the server."
        ></lf-button>
      );
    },
    //#endregion

    //#region Send
    send: () => {
      const { controller, elements, handlers } = getAdapter();
      const {
        blocks,
        currentAbortStreaming,
        currentPrompt,
        cyAttributes,
        manager,
        parts,
      } = controller.get;
      const { chat } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const isStreaming = Boolean(currentAbortStreaming());
      const showSpinner = Boolean(currentPrompt() && !isStreaming);
      const label = isStreaming ? "Stop" : "Send";
      const status: LfThemeUIState = isStreaming ? "danger" : "primary";

      return (
        <lf-button
          class={bemClass(blocks.chat._, blocks.chat.send)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.send}
          lfIcon={isStreaming ? "off-send" : "send"}
          lfLabel={label}
          lfShowSpinner={showSpinner}
          lfUiState={status}
          onLf-button-event={button}
          part={parts.send}
          ref={assignRef(chat, "send")}
          title="Send your prompt (CTRL + Enter)."
        ></lf-button>
      );
    },
    //#endregion

    //#region Spinner
    spinner: () => {
      const { controller, elements } = getAdapter();
      const { currentPrompt, manager } = controller.get;
      const { chat } = elements.refs;
      const { assignRef } = manager;

      const showSpinner = Boolean(currentPrompt());

      return (
        <lf-spinner
          lfActive={showSpinner}
          lfBarVariant={true}
          lfDimensions="3px"
          lfLayout={2}
          ref={assignRef(chat, "spinner")}
        ></lf-spinner>
      );
    },
    //#endregion

    //#region Stt
    stt: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager, parts } = controller.get;
      const { chat } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-button
          class={bemClass(blocks.commands._, blocks.commands.stt)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.stt}
          lfIcon={"microphone"}
          lfStyling="icon"
          onLf-button-event={button}
          part={parts.stt}
          ref={assignRef(chat, "stt")}
          title="Activate Speech To Text with your browser's API (if supported)."
        ></lf-button>
      );
    },
    //#endregion
  };
};

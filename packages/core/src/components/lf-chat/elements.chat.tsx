import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
  LfThemeUIState,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";
import { getEffectiveConfig } from "./helpers.config";

export const prepChat = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["chat"] => {
  return {
    //#region Attach Image
    attachImage: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, currentAttachments, currentPrompt, manager, parts } =
        controller.get;
      const { chat } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;
      const imgIcon = get.current().variables["--lf-icon-image"];

      const hasAttachments = currentAttachments().length > 0;
      const title = hasAttachments
        ? currentAttachments()
            .map((att) => att.name)
            .join(", ")
        : "Attach an image (ensure the model supports image inputs).";

      return (
        <lf-button
          class={bemClass(blocks.chat._, blocks.chat.attachImage)}
          id={LF_CHAT_IDS.chat.attachImage}
          lfIcon={imgIcon}
          lfStretchY={true}
          lfStyling={hasAttachments ? "raised" : "flat"}
          lfUiState={currentPrompt() ? "disabled" : "primary"}
          onLf-button-event={button}
          part={parts.attachImage}
          ref={assignRef(chat, "attachImage")}
          title={title}
        ></lf-button>
      );
    },
    //#endregion

    //#region Attach File
    attachFile: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, currentAttachments, currentPrompt, manager, parts } =
        controller.get;
      const { chat } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;
      const attachIcon = get.current().variables["--lf-icon-attachment"];

      const hasAttachments = currentAttachments().length > 0;
      const title = hasAttachments
        ? currentAttachments()
            .map((att) => att.name)
            .join(", ")
        : "Attach a file (ensure the model supports file inputs).";

      return (
        <lf-button
          class={bemClass(blocks.chat._, blocks.chat.attachFile)}
          id={LF_CHAT_IDS.chat.attachFile}
          lfIcon={attachIcon}
          lfStretchY={true}
          lfStyling={hasAttachments ? "raised" : "flat"}
          lfUiState={currentPrompt() ? "disabled" : "primary"}
          onLf-button-event={button}
          part={parts.attachFile}
          ref={assignRef(chat, "attachFile")}
          title={title}
        ></lf-button>
      );
    },
    //#endregion

    //#region Attachments
    attachments: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, manager } = controller.get;
      const { chat } = elements.refs;
      const { chip } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const attachments = controller.get.currentAttachments();

      return (
        <lf-chip
          class={bemClass(blocks.chat._, blocks.chat.attachments)}
          id={LF_CHAT_IDS.chat.attachments}
          lfDataset={{
            nodes: attachments.map((att) => ({
              description: att.name,
              icon:
                att.type === "image_url"
                  ? theme.get.current().variables["--lf-icon-image"]
                  : theme.get.current().variables["--lf-icon-attachment"],
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
      const { bemClass, get } = theme;

      const { "--lf-icon-clear": icon } = get.current().variables;

      return (
        <lf-button
          class={bemClass(blocks.commands._, blocks.commands.clear)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.clear}
          lfIcon={icon}
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
      const { bemClass, get } = theme;

      return (
        <lf-button
          class={bemClass(blocks.chat._, blocks.chat.configuration)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.configuration}
          key={LF_CHAT_IDS.chat.configuration}
          lfIcon={get.current().variables["--lf-icon-settings"]}
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
      const { blocks, manager, parts } = controller.get;
      const { chat } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <div class={bemClass(blocks.chat._, blocks.chat.editContainer)}>
          <lf-textfield
            class={bemClass(blocks.chat._, blocks.chat.editTextarea)}
            lfStretchX={true}
            lfStyling="textarea"
            lfUiState="primary"
            lfValue={m.content}
            ref={assignRef(chat, "editTextarea")}
          ></lf-textfield>
          <div class={bemClass(blocks.chat._, blocks.chat.editButtons)}>
            <lf-button
              id={LF_CHAT_IDS.chat.editCancel}
              lfLabel="Cancel"
              lfStretchX={true}
              lfStyling="flat"
              lfUiState="danger"
              onLf-button-event={handlers.chat.button}
              part={parts.editCancel}
              ref={assignRef(chat, "editCancel")}
            ></lf-button>
            <lf-button
              id={LF_CHAT_IDS.chat.editConfirm}
              lfLabel="Confirm"
              lfStretchX={true}
              lfStyling="flat"
              lfUiState="success"
              onLf-button-event={handlers.chat.button}
              part={parts.editConfirm}
              ref={assignRef(chat, "editConfirm")}
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

      const className = bemClass(blocks.messages._, blocks.messages.paragraph);

      return <div class={className}>{text}</div>;
    },
    //#endregion

    //#region Progressbar
    progressbar: () => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { chat } = elements.refs;
      const { blocks, currentTokens, manager } = controller.get;
      const effectiveConfig = getEffectiveConfig(adapter);
      const lfContextWindow = effectiveConfig.llm.contextWindow;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const { current, percentage } = currentTokens();
      const title = `Estimated tokens used: ${current}/${lfContextWindow}`;

      return (
        <lf-progressbar
          class={bemClass(blocks.input._, blocks.input.progressbar)}
          lfCenteredLabel={true}
          lfIcon={get.icon("percentage60")}
          lfLabel="Context window"
          lfUiSize="xsmall"
          lfValue={percentage}
          ref={assignRef(chat, "progressbar")}
          title={title}
        ></lf-progressbar>
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
      const icon = isStreaming
        ? theme.get.icon("offSend")
        : theme.get.icon("send");
      const label = isStreaming ? "Stop" : "Send";
      const status: LfThemeUIState = isStreaming ? "danger" : "primary";

      return (
        <lf-button
          class={bemClass(blocks.chat._, blocks.chat.send)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.send}
          lfIcon={icon}
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

    //#region Settings
    settings: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, cyAttributes, manager } = controller.get;
      const { chat } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-button
          class={bemClass(blocks.input._, blocks.input.button)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.settings}
          lfIcon="settings"
          lfStretchY={true}
          lfStyling="flat"
          onLf-button-event={button}
          ref={assignRef(chat, "settings")}
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
      const { bemClass, get } = theme;

      const icon = get.icon("microphone");

      return (
        <lf-button
          class={bemClass(blocks.commands._, blocks.commands.stt)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.stt}
          lfIcon={icon}
          lfStyling="icon"
          onLf-button-event={button}
          part={parts.stt}
          ref={assignRef(chat, "stt")}
          title="Activate Speech To Text with your browser's API (if supported)."
        ></lf-button>
      );
    },
    //#endregion

    //#region Textarea
    textarea: () => {
      const { controller, elements } = getAdapter();
      const { blocks, currentPrompt, cyAttributes, manager, parts } =
        controller.get;
      const { chat } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      return (
        <lf-textfield
          class={bemClass(blocks.input._, blocks.input.textarea)}
          data-cy={cyAttributes.input}
          id={LF_CHAT_IDS.chat.prompt}
          lfStretchX={true}
          lfLabel="What's on your mind?"
          lfStyling="textarea"
          lfUiState={currentPrompt() ? "disabled" : "primary"}
          part={parts.prompt}
          ref={assignRef(chat, "textarea")}
        ></lf-textfield>
      );
    },
    //#endregion

    //#region Tool Execution Chip
    toolExecutionChip: () => {
      const { controller, elements } = getAdapter();
      const { blocks, compInstance, currentToolExecution, manager } =
        controller.get;
      const { chat } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const dataset = currentToolExecution();
      if (!dataset) {
        return null;
      }

      return (
        <div class={bemClass(blocks.messages._, blocks.messages.container)}>
          <lf-chip
            lfDataset={dataset}
            lfUiSize={compInstance.lfUiSize}
            ref={assignRef(chat, "toolExecutionChip")}
          />
        </div>
      );
    },
    //#endregion
  };
};

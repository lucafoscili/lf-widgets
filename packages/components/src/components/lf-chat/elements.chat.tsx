import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepChat = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["chat"] => {
  return {
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
          class={bemClass(blocks.chat._, blocks.chat.clear)}
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

    //#region Message
    messageBlock: (text, role) => {
      const { controller } = getAdapter();
      const { blocks, compInstance, manager } = controller.get;
      const { lfTypewriterProps } = compInstance;
      const { sanitizeProps, theme } = manager;
      const { bemClass } = theme;

      const useTypewriter = !!(
        role === "assistant" &&
        typeof lfTypewriterProps === "object" &&
        lfTypewriterProps !== null
      );

      const className = bemClass(blocks.messages._, blocks.messages.paragraph);

      return useTypewriter ? (
        <lf-typewriter
          class={className}
          {...sanitizeProps(lfTypewriterProps, "LfTypewriter")}
          lfUpdatable={false}
          lfValue={text}
        ></lf-typewriter>
      ) : (
        <div class={className}>{text}</div>
      );
    },
    //#endregion

    //#region Progressbar
    progressbar: () => {
      const { controller, elements } = getAdapter();
      const { chat } = elements.refs;
      const { blocks, compInstance, currentTokens, manager } = controller.get;
      const { lfContextWindow } = compInstance;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const value = currentTokens();
      const title = `Estimated tokens used: ${value}/${lfContextWindow}`;

      return (
        <lf-progressbar
          class={bemClass(blocks.input._, blocks.input.progressbar)}
          lfCenteredLabel={true}
          lfIcon={get.icon("percentage60")}
          lfLabel="Context window"
          lfValue={value}
          ref={assignRef(chat, "progressbar")}
          title={title}
        ></lf-progressbar>
      );
    },
    //#endregion

    //#region Send
    send: () => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, currentPrompt, cyAttributes, manager, parts } =
        controller.get;
      const { chat } = elements.refs;
      const { button } = handlers.chat;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      const showSpinner = Boolean(currentPrompt());

      return (
        <lf-button
          class={bemClass(blocks.chat._, blocks.chat.send)}
          data-cy={cyAttributes.button}
          id={LF_CHAT_IDS.chat.send}
          lfIcon="check"
          lfLabel="Send"
          lfShowSpinner={showSpinner}
          onLf-button-event={button}
          part={parts.send}
          ref={assignRef(chat, "send")}
          title="Send your prompt (CTRL + Enter)."
        >
          <lf-spinner
            lfActive={showSpinner}
            lfDimensions="0.6em"
            slot="spinner"
          ></lf-spinner>
        </lf-button>
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
  };
};

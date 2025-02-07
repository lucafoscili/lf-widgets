import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterJsx,
} from "@lf-widgets/foundations";
import { h } from "@stencil/core";

export const prepToolbar = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx["toolbar"] => {
  return {
    //#region Copy content
    copyContent: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, currentPrompt, manager, parts } = controller.get;
      const { toolbar } = elements.refs;
      const { button } = handlers.toolbar;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const isDisabled = Boolean(currentPrompt());

      return (
        <lf-button
          class={bemClass(blocks.toolbar._, blocks.toolbar.button)}
          id={LF_CHAT_IDS.toolbar.copyContent}
          lfIcon={get.current().variables["--lf-icon-copy"]}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "primary"}
          onLf-button-event={(e) => button(e, m)}
          part={parts.copyContent}
          ref={assignRef(toolbar, "copyContent")}
          title="Copy text to clipboard."
        ></lf-button>
      );
    },
    //#endregion

    //#region Delete message
    deleteMessage: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, currentPrompt, manager, parts } = controller.get;
      const { toolbar } = elements.refs;
      const { button } = handlers.toolbar;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const isDisabled = Boolean(currentPrompt());

      return (
        <lf-button
          class={bemClass(blocks.toolbar._, blocks.toolbar.button)}
          id={LF_CHAT_IDS.toolbar.deleteMessage}
          lfIcon={get.current().variables["--lf-icon-delete"]}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "danger"}
          onLf-button-event={(e) => button(e, m)}
          part={parts.deleteMessage}
          ref={assignRef(toolbar, "deleteMessage")}
          title="Delete this message from the chat history."
        ></lf-button>
      );
    },
    //#endregion

    //#region Regenerate
    regenerate: (m) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, currentPrompt, manager, parts } = controller.get;
      const { toolbar } = elements.refs;
      const { button } = handlers.toolbar;
      const { assignRef, theme } = manager;
      const { bemClass, get } = theme;

      const isDisabled = Boolean(currentPrompt());

      return (
        <lf-button
          class={bemClass(blocks.toolbar._, blocks.toolbar.button)}
          id={LF_CHAT_IDS.toolbar.regenerate}
          lfIcon={get.current().variables["--lf-icon-refresh"]}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "primary"}
          onLf-button-event={(e) => button(e, m)}
          part={parts.regenerate}
          ref={assignRef(toolbar, "regenerate")}
          title="Regenerate the response to this request."
        ></lf-button>
      );
    },
    //#endregion
  };
};

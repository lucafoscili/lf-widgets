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
    //#region Edit message
    editMessage: (m) => {
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
          id={LF_CHAT_IDS.toolbar.editMessage}
          lfIcon={get.current().variables["--lf-icon-edit"]}
          lfStyling="flat"
          lfUiState={isDisabled ? "disabled" : "primary"}
          onLf-button-event={(e) => button(e, m)}
          part={parts.regenerate}
          ref={assignRef(toolbar, "editMessage")}
          title="Edit this message"
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

    //#region Tool chip
    toolExecution: (m) => {
      const { controller, elements } = getAdapter();
      const { blocks, manager } = controller.get;
      const { toolbar } = elements.refs;
      const { assignRef, theme } = manager;
      const { bemClass } = theme;

      if (!m.toolExecution) {
        return null;
      }

      return (
        <div class={bemClass(blocks.toolbar._, blocks.toolbar.toolExecution)}>
          <lf-chip
            lfDataset={m.toolExecution}
            lfFlat={true}
            lfUiSize="xsmall"
            ref={assignRef(toolbar, "toolExecution")}
          />
        </div>
      );
    },
    //#endregion
  };
};

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

    //#region Message attachments
    messageAttachments: (m, isEditing = false) => {
      const { controller, elements, handlers } = getAdapter();
      const { blocks, history, manager, parts } = controller.get;
      const { toolbar } = elements.refs;
      const { chip } = handlers.toolbar;
      const { theme } = manager;
      const { bemClass, get } = theme;

      const attachments = m.attachments;
      if (!attachments || attachments.length === 0) {
        return null;
      }

      const messageIndex = history().indexOf(m);
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
                    ? get.current().variables["--lf-icon-image"]
                    : get.current().variables["--lf-icon-attachment"],
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
                toolbar.messageAttachments.set(refKey, el);
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
      const { blocks, manager } = controller.get;
      const { toolbar } = elements.refs;
      const { assignRef, theme } = manager;
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

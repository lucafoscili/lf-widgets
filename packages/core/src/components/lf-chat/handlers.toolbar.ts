import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterHandlers,
} from "@lf-widgets/foundations";
import {
  deleteMessage,
  editMessage,
  regenerateMessage,
} from "./helpers.messages";
import {
  handleAttachmentClick,
  handleAttachmentDelete,
} from "./helpers.attachments";

export const prepToolbarHandlers = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterHandlers["toolbar"] => {
  return {
    //#region Button
    button: async (e, m) => {
      const { eventType, id } = e.detail;

      switch (eventType) {
        case "click":
          switch (id) {
            // Copy Content
            case LF_CHAT_IDS.toolbar.copyContent:
              navigator.clipboard.writeText(m.content);
              break;
            // Delete Message
            case LF_CHAT_IDS.toolbar.deleteMessage:
              deleteMessage(getAdapter(), m);
              break;
            // Edit Message
            case LF_CHAT_IDS.toolbar.editMessage:
              editMessage(getAdapter(), m);
              break;
            // Regenerate
            case LF_CHAT_IDS.toolbar.regenerate:
              regenerateMessage(getAdapter(), m);
              break;
          }
      }
    },
    //#endregion

    //#region Chip (message attachments)
    chip: async (e, m) => {
      const { eventType, node } = e.detail;
      const adapter = getAdapter();

      switch (eventType) {
        case "click":
          await handleAttachmentClick(adapter, m, node.id);
          break;
        case "delete":
          await handleAttachmentDelete(adapter, m, node.id);
          break;
      }
    },
    //#endregion
  };
};

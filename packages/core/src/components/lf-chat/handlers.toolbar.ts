import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterHandlers,
} from "@lf-widgets/foundations";
import { deleteMessage, editMessage, regenerateMessage } from "./helpers.utils";

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
  };
};

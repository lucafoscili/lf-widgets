import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterHandlers,
} from "@lf-widgets/foundations";
import { deleteMessage, regenerateMessage } from "./helpers.utils";

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
            case LF_CHAT_IDS.toolbar.copyContent:
              navigator.clipboard.writeText(m.content);
              break;
            case LF_CHAT_IDS.toolbar.deleteMessage:
              deleteMessage(getAdapter(), m);
              break;
            case LF_CHAT_IDS.toolbar.regenerate:
              regenerateMessage(getAdapter(), m);
              break;
          }
      }
    },
    //#endregion
  };
};

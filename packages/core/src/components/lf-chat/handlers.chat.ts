import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterHandlers,
} from "@lf-widgets/foundations";
import {
  clearTextarea,
  regenerateMessage,
  submitPrompt,
} from "./helpers.messages";
import { LfChat } from "./lf-chat";

export const prepChatHandlers = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterHandlers["chat"] => {
  return {
    //#region Button
    button: async (e) => {
      const { eventType, id } = e.detail;

      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { get, set } = controller;
      const { refs } = elements;
      const { stt, textarea } = refs.chat;
      const { llm } = get.manager;
      const comp = get.compInstance as LfChat;

      switch (eventType) {
        case "click":
          switch (id) {
            // Clear
            case LF_CHAT_IDS.chat.clear: {
              clearTextarea(adapter);
              set.currentAttachments([]);
              break;
            }
            // Send
            case LF_CHAT_IDS.chat.send: {
              if (get.currentAbortStreaming()) {
                comp.abortStreaming();
              } else {
                submitPrompt(adapter);
              }
              break;
            }
            // Configuration
            case LF_CHAT_IDS.chat.configuration:
            case LF_CHAT_IDS.chat.settings: {
              set.view("settings");
              break;
            }
            // STT
            case LF_CHAT_IDS.chat.stt: {
              llm.speechToText(textarea, stt);
              break;
            }
            // Attach Image
            case LF_CHAT_IDS.chat.attachImage: {
              await get.compInstance.handleImageAttachment();
              break;
            }
            // Attach File
            case LF_CHAT_IDS.chat.attachFile: {
              await get.compInstance.handleFileAttachment();
              break;
            }
            // Edit Confirm
            case LF_CHAT_IDS.chat.editConfirm: {
              try {
                const { controller, elements } = adapter;
                const { get, set } = controller;
                const comp = get.compInstance as LfChat;

                const idx = get.currentEditingIndex();
                const content =
                  (await elements.refs.chat.editTextarea.getValue()) || "";

                await set.history(() => {
                  const h = get.history();
                  const updated = h.map((it, i) =>
                    i === idx ? { ...it, content } : it,
                  );
                  comp.history = updated;
                });

                set.currentEditingIndex(null);

                const updatedMsg = get.history()?.[idx];
                if (updatedMsg && updatedMsg.role === "user") {
                  await regenerateMessage(adapter, updatedMsg);
                }
              } catch (err) {}
              break;
            }
            // Edit Cancel
            case LF_CHAT_IDS.chat.editCancel: {
              const { controller } = adapter;
              const { set } = controller;
              set.currentEditingIndex(null);
              break;
            }
          }
      }
    },
    //#endregion

    //#region Chip
    chip: (e) => {
      const { eventType, node } = e.detail;
      const { controller } = getAdapter();
      const { get, set } = controller;

      switch (eventType) {
        case "delete":
          const newAttachments = (get.currentAttachments() || []).filter(
            (att) => att.id !== node.id,
          );
          set.currentAttachments(newAttachments);
          break;
        default:
          break;
      }
    },
    //#endregion
  };
};

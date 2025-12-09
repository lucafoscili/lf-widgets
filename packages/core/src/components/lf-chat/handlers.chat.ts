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
            // Attach File
            case LF_CHAT_IDS.chat.attachFile: {
              await get.compInstance.handleFileAttachment();
              break;
            }

            // Attach Image
            case LF_CHAT_IDS.chat.attachImage: {
              await get.compInstance.handleImageAttachment();
              break;
            }

            // Clear
            case LF_CHAT_IDS.chat.clear: {
              clearTextarea(adapter);
              set.currentAttachments([]);
              break;
            }

            // Configuration
            case LF_CHAT_IDS.chat.configuration:
            case LF_CHAT_IDS.chat.settings: {
              set.view("settings");
              break;
            }

            // Edit Cancel
            case LF_CHAT_IDS.chat.editCancel: {
              const { controller } = adapter;
              const { set } = controller;
              set.currentEditingId(null);
              break;
            }

            // Edit Confirm
            case LF_CHAT_IDS.chat.editConfirm: {
              try {
                const { controller, elements } = adapter;
                const { get, set } = controller;
                const comp = get.compInstance as LfChat;

                const editingId = get.currentEditingId();
                if (!editingId) {
                  break;
                }

                const content =
                  (await elements.refs.chat.editTextarea.getValue()) || "";

                await set.history(() => {
                  const h = get.history();
                  const updated = h.map((it) =>
                    it.id === editingId ? { ...it, content } : it,
                  );
                  comp.history = updated;
                });

                set.currentEditingId(null);

                const updatedMsg = get
                  .history()
                  ?.find((msg) => msg.id === editingId);
                if (updatedMsg && updatedMsg.role === "user") {
                  await regenerateMessage(adapter, updatedMsg);
                }
              } catch (err) {}
              break;
            }

            // Full Screen
            case LF_CHAT_IDS.chat.fullScreen: {
              set.toggleFullScreen();
              break;
            }

            // Retry
            case LF_CHAT_IDS.chat.retry: {
              await comp.retryConnection();
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

            // STT
            case LF_CHAT_IDS.chat.stt: {
              llm.speechToText(textarea, stt);
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

    //region Textarea
    textfield: (e) => {
      const adapter = getAdapter();
      const { eventType, originalEvent } = e.detail;

      switch (eventType) {
        case "keydown":
          const { ctrlKey, key } = originalEvent as KeyboardEvent;
          switch (key) {
            case "Enter":
              if (ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
                submitPrompt(adapter);
              }
              break;
            default:
              e.stopPropagation();
          }
      }
    },
    //#endregion
  };
};

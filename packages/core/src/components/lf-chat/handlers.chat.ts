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
    button: async (_e: MouseEvent, id: string) => {
      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { get, set } = controller;
      const { refs } = elements;
      const { input } = refs;
      const { llm } = get.framework();
      const comp = get.compInstance() as LfChat;

      switch (id) {
        // Attach File
        case LF_CHAT_IDS.input.attachFile: {
          await get.compInstance().handleFileAttachment();
          break;
        }

        // Attach Image
        case LF_CHAT_IDS.input.attachImage: {
          await get.compInstance().handleImageAttachment();
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
        case LF_CHAT_IDS.input.configuration: {
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
            const comp = get.compInstance() as LfChat;

            const editingId = get.currentEditingId();
            if (!editingId) {
              break;
            }

            // FC: Get value from native element
            const textareaEl = elements.refs.chat.editTextarea;
            const content = textareaEl?.value || "";

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
        case LF_CHAT_IDS.input.fullScreen: {
          controller.actions.toggleFullScreen();
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
          // Create shims to adapt native elements to WC interfaces
          const textareaShim = {
            setValue: async (value: string) => {
              if (input.textarea) {
                input.textarea.value = value;
              }
            },
            setFocus: async () => {
              input.textarea?.focus();
            },
          } as unknown as import("@lf-widgets/foundations").LfTextfieldElement;
          const buttonShim = {
            get lfShowSpinner() {
              return false;
            },
            set lfShowSpinner(_val: boolean) {
              // Button FC doesn't have spinner - ignore
            },
          } as unknown as import("@lf-widgets/foundations").LfButtonElement;
          llm.speechToText(textareaShim, buttonShim);
          break;
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
    textfield: (e: KeyboardEvent) => {
      const adapter = getAdapter();

      const { ctrlKey, key } = e;
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
    },
    //#endregion
  };
};

import {
  LF_CHAT_IDS,
  LfButtonEventPayload,
  LfChatAdapter,
  LfChatAdapterHandlers,
} from "@lf-widgets/foundations";
import { clearTextarea, submitPrompt } from "./helpers.utils";
import { LfChat } from "./lf-chat";

export const prepChatHandlers = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterHandlers["chat"] => {
  return {
    //#region Button
    button: async (e: CustomEvent<LfButtonEventPayload>) => {
      const { eventType, id } = e.detail;

      const adapter = getAdapter();
      const { controller, elements } = adapter;
      const { get, set } = controller;
      const { refs } = elements;
      const { stt, textarea } = refs.chat;
      const { llm } = get.manager;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_CHAT_IDS.chat.clear:
              clearTextarea(adapter);
              break;
            case LF_CHAT_IDS.chat.send:
              if (get.currentAbortStreaming()) {
                (get.compInstance as LfChat).abortStreaming();
              } else {
                submitPrompt(adapter);
              }
              break;
            case LF_CHAT_IDS.chat.configuration:
            case LF_CHAT_IDS.chat.settings:
              set.view("settings");
              break;
            case LF_CHAT_IDS.chat.stt:
              llm.speechToText(textarea, stt);
              break;
          }
      }
    },
    //#endregion
  };
};

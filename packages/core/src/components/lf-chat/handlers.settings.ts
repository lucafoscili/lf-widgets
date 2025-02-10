import {
  LF_CHAT_IDS,
  LfChatAdapter,
  LfChatAdapterHandlers,
} from "@lf-widgets/foundations";
import { LfChat } from "./lf-chat";

export const prepSettingsHandlers = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterHandlers["settings"] => {
  return {
    //#region Button
    button: async (e) => {
      const { eventType, id } = e.detail;

      const { get, set } = getAdapter().controller;
      const { compInstance } = get;

      switch (eventType) {
        case "click":
          switch (id) {
            case LF_CHAT_IDS.options.back:
              const comp = compInstance as LfChat;
              comp.onLfEvent(e, "config");
              set.view("main");
              break;
          }
      }
    },
    //#endregion

    //#region Textfield
    textfield: (e) => {
      const { eventType, id, value } = e.detail;

      const { get } = getAdapter().controller;
      const { compInstance } = get;

      switch (eventType) {
        case "change":
          switch (id) {
            case LF_CHAT_IDS.options.contextWindow:
              compInstance.lfContextWindow = parseInt(value);
              break;
            case LF_CHAT_IDS.options.endpointUrl:
              compInstance.lfEndpointUrl = value;
              break;
            case LF_CHAT_IDS.options.maxTokens:
              compInstance.lfMaxTokens = parseInt(value);
              break;
            case LF_CHAT_IDS.options.polling:
              compInstance.lfPollingInterval = parseInt(value);
              break;
            case LF_CHAT_IDS.options.system:
              compInstance.lfSystem = value;
              break;
            case LF_CHAT_IDS.options.temperature:
              compInstance.lfTemperature = parseFloat(value);
              break;
          }
          break;
      }
    },
    //#endregion
  };
};

import {
  LfChatAdapter,
  LfChatAdapterControllerGetters,
  LfChatAdapterControllerSetters,
  LfChatAdapterHandlers,
  LfChatAdapterInitializerGetters,
  LfChatAdapterInitializerSetters,
  LfChatAdapterJsx,
  LfChatAdapterRefs,
  LfLLMChoiceMessage,
} from "@lf-widgets/foundations";
import { prepChat } from "./elements.chat";
import { prepSettings } from "./elements.settings";
import { prepToolbar } from "./elements.toolbar";
import { prepChatHandlers } from "./handlers.chat";
import { prepSettingsHandlers } from "./handlers.settings";
import { prepToolbarHandlers } from "./handlers.toolbar";

export const createAdapter = (
  getters: LfChatAdapterInitializerGetters,
  setters: LfChatAdapterInitializerSetters,
  getAdapter: () => LfChatAdapter,
): LfChatAdapter => {
  return {
    controller: {
      get: createGetters(getters, getAdapter),
      set: createSetters(setters),
    },
    elements: {
      jsx: createElementsJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
};
//#endregion

//#region Controller
export const createGetters = (
  getters: LfChatAdapterInitializerGetters,
  getAdapter: () => LfChatAdapter,
): LfChatAdapterControllerGetters => {
  return {
    ...getters,
    newPrompt: async () => {
      const { textarea } = getAdapter().elements.refs.chat;

      await textarea.setBlur();
      const message = await textarea.getValue();
      if (message) {
        const newMessage: LfLLMChoiceMessage = {
          role: "user",
          content: message,
        };
        return newMessage;
      } else {
        return null;
      }
    },
  };
};
export const createSetters = (
  setters: LfChatAdapterInitializerSetters,
): LfChatAdapterControllerSetters => {
  return setters;
};
//#endregion

//#region Elements
export const createElementsJsx = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterJsx => {
  return {
    chat: prepChat(getAdapter),
    settings: prepSettings(getAdapter),
    toolbar: prepToolbar(getAdapter),
  };
};
//#endregion

//#region Handlers
export const createHandlers = (
  getAdapter: () => LfChatAdapter,
): LfChatAdapterHandlers => {
  return {
    chat: prepChatHandlers(getAdapter),
    settings: prepSettingsHandlers(getAdapter),
    toolbar: prepToolbarHandlers(getAdapter),
  };
};
//#endregion

//#region Refs
export const createRefs = (): LfChatAdapterRefs => {
  return {
    chat: {
      clear: null,
      configuration: null,
      progressbar: null,
      send: null,
      settings: null,
      spinner: null,
      stt: null,
      textarea: null,
    },
    settings: {
      back: null,
      endpoint: null,
      maxTokens: null,
      polling: null,
      system: null,
      temperature: null,
    },
    toolbar: {
      deleteMessage: null,
      copyContent: null,
      regenerate: null,
    },
  };
};
//#endregion

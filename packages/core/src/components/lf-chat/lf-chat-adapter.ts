import {
  LfChatAdapter,
  LfChatAdapterControllerGetters,
  LfChatAdapterControllerSetters,
  LfChatAdapterHandlers,
  LfChatAdapterInitializerGetters,
  LfChatAdapterInitializerSetters,
  LfChatAdapterJsx,
  LfChatAdapterRefs,
} from "@lf-widgets/foundations";
import { prepChat } from "./elements.chat";
import { prepContentElements } from "./elements.content";
import { prepInput } from "./elements.input";
import { prepSettings } from "./elements.settings";
import { prepToolbar } from "./elements.toolbar";
import { prepChatHandlers } from "./handlers.chat";
import { prepSettingsHandlers } from "./handlers.settings";
import { prepToolbarHandlers } from "./handlers.toolbar";
import { ensureMessageId } from "./helpers.message-id";

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
      const { textarea } = getAdapter().elements.refs.input;

      await textarea.setBlur();
      const message = await textarea.getValue();
      if (message) {
        const newMessage = ensureMessageId({
          role: "user",
          content: message,
        });
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
    content: prepContentElements(getAdapter),
    input: prepInput(getAdapter),
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
      attachments: null,
      clear: null,
      configuration: null,
      editCancel: null,
      editConfirm: null,
      editTextarea: null,
      fileInput: null,
      imageInput: null,
      retry: null,
      send: null,
      spinner: null,
      stt: null,
    },
    input: {
      attachFile: null,
      attachImage: null,
      configuration: null,
      fullScreen: null,
      progressbar: null,
      textarea: null,
    },
    settings: {
      agentEnabled: null,
      agentMaxIterations: null,
      agentSystemPromptSuffix: null,
      back: null,
      contextWindow: null,
      endpoint: null,
      exportHistory: null,
      frequencyPenalty: null,
      historyInput: null,
      importHistory: null,
      maxTokens: null,
      polling: null,
      presencePenalty: null,
      seed: null,
      system: null,
      temperature: null,
      tools: new Map(),
      topP: null,
    },
    toolbar: {
      copyContent: null,
      deleteMessage: null,
      editMessage: null,
      messageAttachments: new Map(),
      regenerate: null,
      toolExecution: null,
    },
  };
};
//#endregion

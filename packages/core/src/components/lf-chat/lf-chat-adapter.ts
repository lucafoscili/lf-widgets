import {
  LfChatAdapter,
  LfChatAdapterControllerActions,
  LfChatAdapterControllerComputed,
  LfChatAdapterControllerGetters,
  LfChatAdapterControllerSetters,
  LfChatAdapterHandlers,
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

/**
 * Creates the canonical adapter for lf-chat.
 *
 * v4.0.0 Architecture:
 * - controller.get: Pure state reads (ALL must be functions `() => T`)
 * - controller.set: Simple single-value assignments
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (async ops, toggles)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (passed from component)
 * - handlers: Event callbacks grouped by domain
 *
 * @see Section 5 of 4_0_0_REFACTORING.md
 */
//#region Adapter
export const createAdapter = (
  getters: LfChatAdapterControllerGetters,
  setters: Omit<LfChatAdapterControllerSetters, "spinnerStatus">,
  computed: LfChatAdapterControllerComputed,
  actions: LfChatAdapterControllerActions,
  getAdapter: () => LfChatAdapter,
): Omit<LfChatAdapter, "dispatcher"> => {
  return {
    controller: {
      get: getters,
      set: createSetters(setters),
      computed,
      actions,
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
export const createSetters = (
  setters: Omit<LfChatAdapterControllerSetters, "spinnerStatus">,
): LfChatAdapterControllerSetters => {
  return setters as LfChatAdapterControllerSetters;
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

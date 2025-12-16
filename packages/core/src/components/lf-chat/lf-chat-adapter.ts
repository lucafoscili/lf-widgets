import {
  LfChatAdapter,
  LfChatAdapterControllerGetters,
  LfChatAdapterControllerSetters,
  LfChatAdapterHandlers,
  LfChatAdapterJsx,
  LfChatAdapterRefs,
  LfChatAgentState,
  LfChatCurrentTokens,
  LfChatHistory,
  LfChatStatus,
  LfChatView,
  LfDataDataset,
  LfLLMAttachment,
  LfLLMChoiceMessage,
} from "@lf-widgets/foundations";
import { prepChatActions } from "./actions.chat";
import { prepChatComputed } from "./computed.chat";
import { prepChat } from "./elements.chat";
import { prepContentElements } from "./elements.content";
import { prepInput } from "./elements.input";
import { prepSettings } from "./elements.settings";
import { prepToolbar } from "./elements.toolbar";
import { prepChatHandlers } from "./handlers.chat";
import { prepSettingsHandlers } from "./handlers.settings";
import { prepToolbarHandlers } from "./handlers.toolbar";
import { calcTokens } from "./helpers.messages";

//#region Types
/**
 * Initial state for lf-chat closure variables.
 * These values are captured at adapter creation time and owned by the adapter.
 */
export interface LfChatInitialState {
  agentState: LfChatAgentState | null;
  currentAbortStreaming: AbortController | null;
  currentAttachments: LfLLMAttachment[];
  currentEditingId: string | null;
  currentPrompt: LfLLMChoiceMessage | null;
  currentTokens: LfChatCurrentTokens;
  currentToolExecution: LfDataDataset | null;
  fullScreen: boolean;
  history: LfChatHistory;
  status: LfChatStatus;
  view: LfChatView;
}

/**
 * Base getters that are passed in (not derived from closure state).
 * These read from the WC instance directly (blocks, framework, ids, etc.)
 */
export type LfChatBaseGetters = Omit<
  LfChatAdapterControllerGetters,
  | "agentState"
  | "currentAbortStreaming"
  | "currentAttachments"
  | "currentEditingId"
  | "currentPrompt"
  | "currentTokens"
  | "currentToolExecution"
  | "fullScreen"
  | "history"
  | "lastMessage"
  | "status"
  | "view"
>;
//#endregion

/**
 * Creates the canonical adapter for lf-chat using "Adapter as Core" pattern.
 *
 * v4.0.0 + Section 5.9 Architecture:
 * - **Closure State**: All runtime state lives in adapter closure variables
 * - **Single @State**: WC has only `_renderTick` - incremented by `onStateChange()`
 * - **Explicit Renders**: Only `onStateChange()` triggers re-render
 * - controller.get: Pure state reads from closure
 * - controller.set: Writes to closure + calls `onStateChange()`
 * - controller.computed: Derived values, predicates (pure functions)
 * - controller.actions: Multi-step operations (async ops, toggles)
 * - elements: JSX factories + refs
 * - dispatcher: Centralized event emission (added by WC after creation)
 * - handlers: Event callbacks grouped by domain
 *
 * @see Section 5.9 of 4_0_0_REFACTORING.md ("Adapter as Core" Pattern)
 */
//#region Adapter
export const createAdapter = (
  baseGetters: LfChatBaseGetters,
  initialState: LfChatInitialState,
  onStateChange: () => void,
  getAdapter: () => LfChatAdapter,
): Omit<LfChatAdapter, "dispatcher"> => {
  // ═══════════════════════════════════════════════════════════════
  // CLOSURE STATE - The single source of truth (replaces @State)
  // ═══════════════════════════════════════════════════════════════
  let _agentState: LfChatAgentState | null = initialState.agentState;
  let _currentAbortStreaming: AbortController | null =
    initialState.currentAbortStreaming;
  let _currentAttachments: LfLLMAttachment[] = initialState.currentAttachments;
  let _currentEditingId: string | null = initialState.currentEditingId;
  let _currentPrompt: LfLLMChoiceMessage | null = initialState.currentPrompt;
  let _currentTokens: LfChatCurrentTokens = initialState.currentTokens;
  let _currentToolExecution: LfDataDataset | null =
    initialState.currentToolExecution;
  let _fullScreen: boolean = initialState.fullScreen;
  let _history: LfChatHistory = initialState.history;
  let _status: LfChatStatus = initialState.status;
  let _view: LfChatView = initialState.view;

  // ═══════════════════════════════════════════════════════════════
  // GETTERS - Read from closure
  // ═══════════════════════════════════════════════════════════════
  const getters: LfChatAdapterControllerGetters = {
    ...baseGetters,
    agentState: () => _agentState,
    currentAbortStreaming: () => _currentAbortStreaming,
    currentAttachments: () => _currentAttachments,
    currentEditingId: () => _currentEditingId,
    currentPrompt: () => _currentPrompt,
    currentTokens: () => _currentTokens,
    currentToolExecution: () => _currentToolExecution,
    fullScreen: () => _fullScreen,
    history: () => _history,
    lastMessage: (role = "user") => {
      return _history
        .slice()
        .reverse()
        .find((m) => m.role === role);
    },
    status: () => _status,
    view: () => _view,
  };

  // ═══════════════════════════════════════════════════════════════
  // SETTERS - Write to closure + trigger re-render
  // ═══════════════════════════════════════════════════════════════
  const setters: LfChatAdapterControllerSetters = {
    agentState: (value: LfChatAgentState | null) => {
      if (_agentState !== value) {
        _agentState = value;
        onStateChange();
      }
    },
    currentAbortStreaming: (value: AbortController | null) => {
      if (_currentAbortStreaming !== value) {
        _currentAbortStreaming = value;
        onStateChange();
      }
    },
    currentAttachments: (value: LfLLMAttachment[]) => {
      _currentAttachments = value;
      onStateChange();
    },
    currentEditingId: (value: string | null) => {
      if (_currentEditingId !== value) {
        _currentEditingId = value;
        onStateChange();
      }
    },
    currentPrompt: (value: LfLLMChoiceMessage | null) => {
      _currentPrompt = value;
      onStateChange();
    },
    currentTokens: (value: LfChatCurrentTokens) => {
      _currentTokens = value;
      onStateChange();
    },
    currentToolExecution: (value: LfDataDataset | null) => {
      _currentToolExecution = value;
      onStateChange();
    },
    fullScreen: (value: boolean) => {
      if (_fullScreen !== value) {
        _fullScreen = value;
        onStateChange();
      }
    },
    history: async (cb: () => unknown) => {
      cb();
      // Recalculate tokens after history change
      _currentTokens = await calcTokens(getAdapter());
      onStateChange();
      // Emit update event via dispatcher (if available)
      const adapter = getAdapter();
      if (adapter.dispatcher) {
        adapter.dispatcher.emit("update", {});
      }
    },
    status: (status: LfChatStatus) => {
      if (_status !== status) {
        _status = status;
        onStateChange();
      }
    },
    view: (view: LfChatView) => {
      if (_view !== view) {
        _view = view;
        onStateChange();
      }
    },
  };

  return {
    controller: {
      get: getters,
      set: setters,
      computed: prepChatComputed(getAdapter),
      actions: prepChatActions(getAdapter),
    },
    elements: {
      jsx: createElementsJsx(getAdapter),
      refs: createRefs(),
    },
    handlers: createHandlers(getAdapter),
  };
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

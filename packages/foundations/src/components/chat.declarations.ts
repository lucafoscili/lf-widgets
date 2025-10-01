import {
  LfComponentAdapter,
  LfComponentAdapterGetters,
  LfComponentAdapterHandlers,
  LfComponentAdapterJsx,
  LfComponentAdapterRefs,
  LfComponentAdapterSetters,
} from "../foundations/adapter.declarations";
import {
  CY_ATTRIBUTES,
  LF_ATTRIBUTES,
} from "../foundations/components.constants";
import {
  HTMLStencilElement,
  LfComponent,
  LfComponentClassProperties,
  VNode,
} from "../foundations/components.declarations";
import { LfEventPayload } from "../foundations/events.declarations";
import { LfFrameworkInterface } from "../framework/framework.declarations";
import { LfLLMChoiceMessage, LfLLMRole } from "../framework/llm.declarations";
import { LfThemeUISize } from "../framework/theme.declarations";
import { LfButtonElement, LfButtonEventPayload } from "./button.declarations";
import {
  LF_CHAT_BLOCKS,
  LF_CHAT_EVENTS,
  LF_CHAT_LAYOUT,
  LF_CHAT_PARTS,
  LF_CHAT_STATUS,
  LF_CHAT_VIEW,
} from "./chat.constants";
import { LfProgressbarElement } from "./progressbar.declarations";
import { LfSpinnerElement } from "./spinner.declarations";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
} from "./textfield.declarations";
import { LfTypewriterPropsInterface } from "./typewriter.declarations";

//#region Class
export interface LfChatInterface
  extends LfComponent<"LfChat">,
    LfChatPropsInterface {}
export interface LfChatElement
  extends HTMLStencilElement,
    Omit<LfChatInterface, LfComponentClassProperties> {
  abortStreaming: () => Promise<void>;
  getHistory: () => Promise<string>;
  getLastMessage: () => Promise<string>;
  scrollToBottom: (block?: ScrollLogicalPosition) => Promise<void>;
  setHistory: (value: string) => Promise<void>;
}
//#endregion

//#region Adapter
export interface LfChatAdapter extends LfComponentAdapter<LfChatInterface> {
  controller: {
    get: LfChatAdapterControllerGetters;
    set: LfChatAdapterControllerSetters;
  };
  elements: {
    jsx: LfChatAdapterJsx;
    refs: LfChatAdapterRefs;
  };
  handlers: LfChatAdapterHandlers;
}
export interface LfChatAdapterJsx extends LfComponentAdapterJsx {
  chat: {
    clear: () => VNode;
    configuration: () => VNode;
    messageBlock: (text: string, role: LfLLMRole) => VNode;
    progressbar: () => VNode;
    send: () => VNode;
    settings: () => VNode;
    spinner: () => VNode;
    stt: () => VNode;
    textarea: () => VNode;
  };
  settings: {
    back: () => VNode;
    endpoint: () => VNode;
    maxTokens: () => VNode;
    polling: () => VNode;
    system: () => VNode;
    temperature: () => VNode;
  };
  toolbar: {
    copyContent: (m: LfLLMChoiceMessage) => VNode;
    deleteMessage: (m: LfLLMChoiceMessage) => VNode;
    regenerate: (m: LfLLMChoiceMessage) => VNode;
  };
}
export interface LfChatAdapterRefs extends LfComponentAdapterRefs {
  chat: {
    clear: LfButtonElement;
    configuration: LfButtonElement;
    progressbar: LfProgressbarElement;
    send: LfButtonElement;
    settings: LfButtonElement;
    spinner: LfSpinnerElement;
    stt: LfButtonElement;
    textarea: LfTextfieldElement;
  };
  settings: {
    back: LfButtonElement;
    endpoint: LfTextfieldElement;
    maxTokens: LfTextfieldElement;
    polling: LfTextfieldElement;
    system: LfTextfieldElement;
    temperature: LfTextfieldElement;
  };
  toolbar: {
    copyContent: LfButtonElement;
    deleteMessage: LfButtonElement;
    regenerate: LfButtonElement;
  };
}
export interface LfChatAdapterHandlers extends LfComponentAdapterHandlers {
  chat: {
    button: (e: CustomEvent<LfButtonEventPayload>) => void;
  };
  settings: {
    button: (e: CustomEvent<LfButtonEventPayload>) => void;
    textfield: (e: CustomEvent<LfTextfieldEventPayload>) => void;
  };
  toolbar: {
    button: (
      e: CustomEvent<LfButtonEventPayload>,
      m: LfLLMChoiceMessage,
    ) => void;
  };
}
export type LfChatAdapterInitializerGetters = Pick<
  LfChatAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "currentAbortStreaming"
  | "currentPrompt"
  | "currentTokens"
  | "cyAttributes"
  | "history"
  | "lastMessage"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "status"
  | "view"
>;
export type LfChatAdapterInitializerSetters = Pick<
  LfChatAdapterControllerSetters,
  | "currentAbortStreaming"
  | "currentPrompt"
  | "currentTokens"
  | "history"
  | "status"
  | "view"
>;
export interface LfChatAdapterControllerGetters
  extends LfComponentAdapterGetters<LfChatInterface> {
  blocks: typeof LF_CHAT_BLOCKS;
  compInstance: LfChatInterface;
  currentAbortStreaming: () => AbortController | null;
  currentPrompt: () => LfLLMChoiceMessage;
  currentTokens: () => LfChatCurrentTokens;
  cyAttributes: typeof CY_ATTRIBUTES;
  history: () => LfChatHistory;
  lastMessage: (role?: LfLLMRole) => LfLLMChoiceMessage;
  lfAttributes: typeof LF_ATTRIBUTES;
  manager: LfFrameworkInterface;
  newPrompt: () => Promise<LfLLMChoiceMessage>;
  parts: typeof LF_CHAT_PARTS;
  status: () => LfChatStatus;
  view: () => LfChatView;
}
export interface LfChatAdapterControllerSetters
  extends LfComponentAdapterSetters {
  currentAbortStreaming: (value: AbortController | null) => void;
  currentPrompt: (value: LfLLMChoiceMessage) => void;
  currentTokens: (value: LfChatCurrentTokens) => void;
  history: (cb: () => unknown) => Promise<void>;
  status: (status: LfChatStatus) => void;
  view: (view: LfChatView) => void;
}
//#endregion

//#region Events
export type LfChatEvent = (typeof LF_CHAT_EVENTS)[number];
export interface LfChatEventPayload
  extends LfEventPayload<"LfChat", LfChatEvent> {
  history: string;
  status: LfChatStatus;
}
//#endregion

//#region States
export interface LfChatCurrentTokens {
  current: number;
  percentage: number;
}
export type LfChatHistory = LfLLMChoiceMessage[];
export type LfChatStatus = (typeof LF_CHAT_STATUS)[number];
export type LfChatView = (typeof LF_CHAT_VIEW)[number];
//#endregion

//#region Props
export interface LfChatPropsInterface {
  lfContextWindow?: number;
  lfEmpty?: string;
  lfEndpointUrl?: string;
  lfLayout?: LfChatLayout;
  lfMaxTokens?: number;
  lfPollingInterval?: number;
  lfSeed?: number;
  lfStyle?: string;
  lfSystem?: string;
  lfTemperature?: number;
  lfTypewriterProps?: LfTypewriterPropsInterface | false;
  lfUiSize?: LfThemeUISize;
  lfValue?: LfChatHistory;
}
export type LfChatLayout = (typeof LF_CHAT_LAYOUT)[number];
//#endregion

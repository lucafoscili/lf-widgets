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
import {
  LfLLMAttachment,
  LfLLMChoiceMessage,
  LfLLMRole,
} from "../framework/llm.declarations";
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
import { LfChipElement, LfChipEventPayload } from "./chip.declarations";
import { LfProgressbarElement } from "./progressbar.declarations";
import { LfSpinnerElement } from "./spinner.declarations";
import {
  LfTextfieldElement,
  LfTextfieldEventPayload,
} from "./textfield.declarations";

//#region Class
/**
 * Primary interface implemented by the `lf-chat` component. It merges the shared component contract with the component-specific props.
 */
export interface LfChatInterface
  extends LfComponent<"LfChat">,
    LfChatPropsInterface {
  abortStreaming: () => Promise<void>;
  exportHistory: () => Promise<void>;
  getHistory: () => Promise<string>;
  getLastMessage: () => Promise<string>;
  handleFileAttachment: () => Promise<void>;
  handleImageAttachment: () => Promise<void>;
  refresh: () => Promise<void>;
  removeAttachment: (id: string) => Promise<void>;
  scrollToBottom: (block?: ScrollLogicalPosition | boolean) => Promise<void>;
  setHistory: (value: string, fromFile?: boolean) => Promise<void>;
  unmount: (ms?: number) => Promise<void>;
}
/**
 * DOM element type for the custom element registered as `lf-chat`.
 */
export interface LfChatElement
  extends HTMLStencilElement,
    Omit<LfChatInterface, LfComponentClassProperties> {}
//#endregion

//#region Adapter
/**
 * Adapter contract that wires `lf-chat` into host integrations.
 */
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
/**
 * Factory helpers returning Stencil `VNode` fragments for the adapter.
 */
export interface LfChatAdapterJsx extends LfComponentAdapterJsx {
  chat: {
    attachFile: () => VNode;
    attachImage: () => VNode;
    attachments: () => VNode;
    clear: () => VNode;
    configuration: () => VNode;
    editableMessage: (m: LfLLMChoiceMessage) => VNode;
    messageBlock: (text: string, role: LfLLMRole) => VNode;
    progressbar: () => VNode;
    send: () => VNode;
    settings: () => VNode;
    spinner: () => VNode;
    stt: () => VNode;
    textarea: () => VNode;
  };
  content: {
    bold: (children: (VNode | string)[]) => VNode;
    blockquote: (children: (VNode | string)[]) => VNode;
    bulletList: (children: VNode[]) => VNode;
    codeFence: (language: string, code: string) => VNode;
    heading: (level: number, children: (VNode | string)[]) => VNode;
    horizontalRule: () => VNode;
    image: (url: string, alt?: string) => VNode;
    inlineCode: (content: string) => VNode;
    inlineContainer: (children: (VNode | string)[]) => VNode;
    italic: (children: (VNode | string)[]) => VNode;
    lineBreak: () => VNode;
    link: (href: string, children: (VNode | string)[]) => VNode;
    listItem: (children: (VNode | string)[]) => VNode;
    orderedList: (children: VNode[]) => VNode;
    paragraph: (children: (VNode | string)[]) => VNode;
  };
  settings: {
    back: () => VNode;
    contextWindow: () => VNode;
    endpoint: () => VNode;
    exportHistory: () => VNode;
    frequencyPenalty: () => VNode;
    importHistory: () => VNode;
    maxTokens: () => VNode;
    polling: () => VNode;
    presencePenalty: () => VNode;
    system: () => VNode;
    temperature: () => VNode;
    seed: () => VNode;
    topP: () => VNode;
  };
  toolbar: {
    copyContent: (m: LfLLMChoiceMessage) => VNode;
    deleteMessage: (m: LfLLMChoiceMessage) => VNode;
    editMessage: (m: LfLLMChoiceMessage) => VNode;
    regenerate: (m: LfLLMChoiceMessage) => VNode;
  };
}
/**
 * Strongly typed DOM references captured by the component adapter.
 */
export interface LfChatAdapterRefs extends LfComponentAdapterRefs {
  chat: {
    attachFile: LfButtonElement | null;
    attachImage: LfButtonElement | null;
    attachments: LfChipElement | null;
    clear: LfButtonElement | null;
    configuration: LfButtonElement | null;
    editCancel: LfButtonElement | null;
    editConfirm: LfButtonElement | null;
    editTextarea: LfTextfieldElement | null;
    fileInput: HTMLInputElement | null;
    imageInput: HTMLInputElement | null;
    progressbar: LfProgressbarElement | null;
    send: LfButtonElement | null;
    settings: LfButtonElement | null;
    spinner: LfSpinnerElement | null;
    stt: LfButtonElement | null;
    textarea: LfTextfieldElement | null;
  };
  settings: {
    back: LfButtonElement | null;
    contextWindow: LfTextfieldElement | null;
    endpoint: LfTextfieldElement | null;
    exportHistory: LfButtonElement | null;
    frequencyPenalty: LfTextfieldElement | null;
    historyInput: HTMLInputElement | null;
    importHistory: LfButtonElement | null;
    maxTokens: LfTextfieldElement | null;
    polling: LfTextfieldElement | null;
    presencePenalty: LfTextfieldElement | null;
    system: LfTextfieldElement | null;
    seed: LfTextfieldElement | null;
    temperature: LfTextfieldElement | null;
    topP: LfTextfieldElement | null;
  };
  toolbar: {
    copyContent: LfButtonElement | null;
    deleteMessage: LfButtonElement | null;
    editMessage: LfButtonElement | null;
    regenerate: LfButtonElement | null;
  };
}
/**
 * Handler map consumed by the adapter to react to framework events.
 */
export interface LfChatAdapterHandlers extends LfComponentAdapterHandlers {
  chat: {
    button: (e: CustomEvent<LfButtonEventPayload>) => void;
    chip: (e: CustomEvent<LfChipEventPayload>) => void;
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
/**
 * Subset of adapter getters required during initialisation.
 */
export type LfChatAdapterInitializerGetters = Pick<
  LfChatAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "currentAbortStreaming"
  | "currentAttachments"
  | "currentEditingIndex"
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

/**
 * Subset of adapter setters required during initialisation.
 */
export type LfChatAdapterInitializerSetters = Pick<
  LfChatAdapterControllerSetters,
  | "currentAbortStreaming"
  | "currentAttachments"
  | "currentEditingIndex"
  | "currentPrompt"
  | "currentTokens"
  | "history"
  | "status"
  | "view"
>;
/**
 * Read-only controller surface exposed by the adapter for integration code.
 */
export interface LfChatAdapterControllerGetters
  extends LfComponentAdapterGetters<LfChatInterface> {
  blocks: typeof LF_CHAT_BLOCKS;
  compInstance: LfChatInterface;
  currentAbortStreaming: () => AbortController | null;
  currentAttachments: () => LfLLMAttachment[];
  currentEditingIndex: () => number;
  currentPrompt: () => LfLLMChoiceMessage | null;
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
/**
 * Imperative controller callbacks exposed by the adapter.
 */
export interface LfChatAdapterControllerSetters
  extends LfComponentAdapterSetters {
  currentAbortStreaming: (value: AbortController | null) => void;
  currentAttachments: (value: LfLLMAttachment[]) => void;
  currentEditingIndex: (value: number) => void;
  currentPrompt: (value: LfLLMChoiceMessage | null) => void;
  currentTokens: (value: LfChatCurrentTokens) => void;
  history: (cb: () => unknown) => Promise<void>;
  status: (status: LfChatStatus) => void;
  view: (view: LfChatView) => void;
}
//#endregion

//#region Events
/**
 * Union of event identifiers emitted by `lf-chat`.
 */
export type LfChatEvent = (typeof LF_CHAT_EVENTS)[number];
/**
 * Detail payload structure dispatched with `lf-chat` events.
 */
export interface LfChatEventPayload
  extends LfEventPayload<"LfChat", LfChatEvent> {
  history: string;
  status: LfChatStatus;
}
//#endregion

//#region States
/**
 * Utility interface used by the `lf-chat` component.
 */
export interface LfChatCurrentTokens {
  current: number;
  percentage: number;
}
/**
 * History snapshot maintained by the component to enable undo/redo flows.
 */
export type LfChatHistory = LfLLMChoiceMessage[];
/**
 * Utility type used by the `lf-chat` component.
 */
export type LfChatStatus = (typeof LF_CHAT_STATUS)[number];
/**
 * Utility type used by the `lf-chat` component.
 */
export type LfChatView = (typeof LF_CHAT_VIEW)[number];
//#endregion

//#region Props
/**
 * Public props accepted by the `lf-chat` component.
 */
export interface LfChatPropsInterface {
  /**
   * Timeout in milliseconds to apply to the upload callback. If the callback does
   * not resolve within this time it will be considered failed. Default is 60000 (60s).
   */
  lfAttachmentUploadTimeout?: number;
  lfContextWindow?: number;
  lfEmpty?: string;
  lfEndpointUrl?: string;
  lfFrequencyPenalty?: number;
  lfLayout?: LfChatLayout;
  lfMaxTokens?: number;
  lfPollingInterval?: number;
  lfPresencePenalty?: number;
  lfSeed?: number;
  lfStyle?: string;
  lfSystem?: string;
  lfTemperature?: number;
  lfTopP?: number;
  lfUiSize?: LfThemeUISize;
  lfValue?: LfChatHistory;
  /**
   * Optional callback provided by the host to upload files. If present the component
   * will call this function with the selected File[] and expect a Promise resolving
   * to an array of `LfLLMAttachment` objects describing uploaded files (including
   * public `url` entries). If omitted the component falls back to inline base64
   * encoding using the `data` field on attachments.
   */
  lfUploadCallback?: (files: File[]) => Promise<LfLLMAttachment[]>;
}
/**
 * Union of layouts listed in `LF_CHAT_LAYOUT`.
 */
export type LfChatLayout = (typeof LF_CHAT_LAYOUT)[number];
//#endregion

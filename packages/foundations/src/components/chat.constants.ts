import { LfChatPropsInterface } from "./chat.declarations";

//#region Blocks
export const LF_CHAT_BLOCKS = {
  chat: {
    _: "chat",
    clear: "clear",
    configuration: "configuration",
    error: "error",
    icon: "icon",
    prompt: "prompt",
    send: "send",
    settings: "settings",
    spinner: "spinner",
    spinnerBar: "spinner-bar",
    text: "text",
    title: "title",
  },
  commands: {
    _: "commands",
    stt: "stt",
  },
  input: {
    _: "input",
    button: "button",
    progressbar: "progressbar",
    textarea: "textarea",
  },
  messages: {
    _: "messages",
    blockquote: "blockquote",
    bold: "bold",
    bulletList: "bullet-list",
    code: "code",
    container: "container",
    content: "content",
    empty: "empty",
    heading: "heading",
    hr: "hr",
    inlineCode: "inline-code",
    italic: "italic",
    lineBreak: "line-break",
    link: "link",
    list: "list",
    listItem: "list-item",
    paragraph: "paragraph",
  },
  request: { _: "request" },
  settings: {
    _: "settings",
    back: "back",
    configuration: "configuration",
    textarea: "textarea",
    textfield: "textfield",
  },
  toolbar: {
    _: "toolbar",
    button: "button",
  },
} as const;
//#endregion

//#region Events
export const LF_CHAT_EVENTS = [
  "config",
  "polling",
  "ready",
  "unmount",
  "update",
] as const;
//#endregion

//#region Ids
export const LF_CHAT_IDS = {
  chat: {
    clear: "chat-clear",
    configuration: "chat-configuration",
    prompt: "chat-prompt",
    send: "chat-send",
    settings: "chat-settings",
    stt: "chat-stt",
  },
  options: {
    back: "option-back",
    contextWindow: "option-context",
    endpointUrl: "option-endpoint",
    maxTokens: "option-maxtokens",
    polling: "option-polling",
    system: "option-system",
    temperature: "option-temperature",
  },
  toolbar: {
    copyContent: "toolbar-copy-content",
    deleteMessage: "toolbar-delete-message",
    regenerate: "toolbar-regenerate",
  },
} as const;
//#endregion

//#region Layout
export const LF_CHAT_LAYOUT = ["bottom", "top"] as const;
//#endregion

//#region Parts
export const LF_CHAT_PARTS = {
  back: "back",
  chat: "chat",
  clear: "clear",
  configuration: "configuration",
  contextWindow: "context-window",
  copyContent: "copy-content",
  deleteMessage: "delete-message",
  endpointUrl: "endpoint-url",
  maxTokens: "max-tokens",
  polling: "polling",
  regenerate: "regenerate",
  prompt: "prompt",
  send: "send",
  settings: "settings",
  stt: "stt",
  system: "system",
  temperature: "temperature",
  toolbar: "toolbar",
} as const;
//#endregion

//#region Props
export const LF_CHAT_PROPS = [
  "lfContextWindow",
  "lfEmpty",
  "lfEndpointUrl",
  "lfLayout",
  "lfMaxTokens",
  "lfPollingInterval",
  "lfSeed",
  "lfStyle",
  "lfSystem",
  "lfTemperature",
  "lfTypewriterProps",
  "lfUiSize",
  "lfValue",
] as const satisfies (keyof LfChatPropsInterface)[];
//#endregion

//#region Status
export const LF_CHAT_STATUS = ["connecting", "offline", "ready"] as const;
//#endregion

//#region View
export const LF_CHAT_VIEW = ["main", "settings"] as const;
//#endregion

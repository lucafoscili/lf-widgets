import { LfChatPropsInterface } from "./chat.declarations";

//#region Blocks
export const LF_CHAT_BLOCKS = {
  chat: {
    _: "chat",
    attachImage: "attach-image",
    attachFile: "attach-file",
    attachments: "attachments",
    clear: "clear",
    configuration: "configuration",
    editButtons: "edit-buttons",
    editContainer: "edit-container",
    editTextarea: "edit-textarea",
    error: "error",
    icon: "icon",
    prompt: "prompt",
    retry: "retry",
    send: "send",
    settings: "settings",
    spinner: "spinner",
    spinnerBar: "spinner-bar",
    text: "text",
    title: "title",
  },
  commands: {
    _: "commands",
    clear: "clear",
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
    inlineContainer: "inline-container",
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
    accordion: "accordion",
    agentContainer: "agent-container",
    agentHeader: "agent-header",
    back: "back",
    configuration: "configuration",
    exportHistory: "export-history",
    header: "header",
    importHistory: "import-history",
    slotContent: "slot-content",
    textarea: "textarea",
    textfield: "textfield",
    tools: "tools",
    toolsCategory: "tools-category",
    toolsCheckbox: "tools-checkbox",
    toolsContainer: "tools-container",
    toolsHeader: "tools-header",
    toolsItem: "tools-item",
  },
  toolbar: {
    _: "toolbar",
    button: "button",
    buttons: "buttons",
    messageAttachments: "message-attachments",
    toolExecution: "tool-execution",
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
    attachFile: "chat-attach-file",
    attachImage: "chat-attach-image",
    attachments: "chat-attachments",
    editCancel: "chat-edit-cancel",
    editConfirm: "chat-edit-confirm",
    editTextarea: "chat-edit-textarea",
    clear: "chat-clear",
    configuration: "chat-configuration",
    prompt: "chat-prompt",
    retry: "chat-retry",
    send: "chat-send",
    settings: "chat-settings",
    stt: "chat-stt",
  },
  options: {
    agentEnabled: "option-agent-enabled",
    agentMaxIterations: "option-agent-max-iterations",
    agentSystemPromptSuffix: "option-agent-system-prompt-suffix",
    back: "option-back",
    contextWindow: "option-context",
    endpointUrl: "option-endpoint",
    exportHistory: "option-export-history",
    frequencyPenalty: "option-frequency-penalty",
    importHistory: "option-import-history",
    maxTokens: "option-maxtokens",
    polling: "option-polling",
    presencePenalty: "option-presence-penalty",
    seed: "option-seed",
    system: "option-system",
    temperature: "option-temperature",
    tools: "option-tools",
    topP: "option-top-p",
  },
  toolbar: {
    copyContent: "toolbar-copy-content",
    deleteMessage: "toolbar-delete-message",
    editMessage: "toolbar-edit-message",
    regenerate: "toolbar-regenerate",
  },
} as const;
//#endregion

//#region Layout
export const LF_CHAT_LAYOUT = ["bottom", "top"] as const;
//#endregion

//#region Parts
export const LF_CHAT_PARTS = {
  agentEnabled: "agent-enabled",
  agentMaxIterations: "agent-max-iterations",
  agentSettings: "agent-settings",
  agentSystemPromptSuffix: "agent-system-prompt-suffix",
  attachFile: "attach-file",
  attachImage: "attach-image",
  attachments: "attachments",
  back: "back",
  chat: "chat",
  clear: "clear",
  configuration: "configuration",
  contextWindow: "context-window",
  copyContent: "copy-content",
  deleteMessage: "delete-message",
  divider: "divider",
  editButtons: "edit-buttons",
  editCancel: "edit-cancel",
  editConfirm: "edit-confirm",
  editContainer: "edit-container",
  editTextarea: "edit-textarea",
  endpointUrl: "endpoint-url",
  exportHistory: "export-history",
  frequencyPenalty: "frequency-penalty",
  importHistory: "import-history",
  maxTokens: "max-tokens",
  messageAttachments: "message-attachments",
  polling: "polling",
  presencePenalty: "presence-penalty",
  prompt: "prompt",
  regenerate: "regenerate",
  retry: "retry",
  seed: "seed",
  send: "send",
  settings: "settings",
  stt: "stt",
  system: "system",
  temperature: "temperature",
  toolbar: "toolbar",
  tools: "tools",
  topP: "top-p",
} as const;
//#endregion

//#region Props
export const LF_CHAT_PROPS = [
  "lfConfig",
  "lfStyle",
  "lfToolHandlers",
  "lfUiSize",
  "lfUploadCallback",
  "lfValue",
] as const satisfies (keyof LfChatPropsInterface)[];
//#endregion

//#region Status
export const LF_CHAT_STATUS = ["connecting", "offline", "ready"] as const;
//#endregion

//#region View
export const LF_CHAT_VIEW = ["main", "settings"] as const;
//#endregion

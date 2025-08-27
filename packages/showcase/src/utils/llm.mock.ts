import {
  LfButtonElement,
  LfFrameworkInterface,
  LfLLMChoiceMessage,
  LfLLMCompletionObject,
  LfLLMRequest,
  LfTextfieldElement,
} from "@lf-widgets/foundations";

// Internal key to store original methods (string literal for simpler typing)
const ORIGINALS_KEY = "__lf_llm_originals__" as const;

interface OriginalLlmMethods {
  fetch: (request: LfLLMRequest, url: string) => Promise<LfLLMCompletionObject>;
  poll: (url: string) => Promise<Response>;
  speechToText: (
    textarea: LfTextfieldElement,
    button: LfButtonElement,
  ) => Promise<void>;
}

type LlmWithOriginals = {
  [ORIGINALS_KEY]?: OriginalLlmMethods;
} & LfFrameworkInterface["llm"]; // augment runtime instance

export type LfMockLlmMode = "echo" | "reverse" | "summarize" | "classify";

export interface EnableMockLlmOptions {
  mode?: LfMockLlmMode;
  classifyLabels?: string[];
}

const defaultLabels = ["info", "warning", "error", "debug", "success"];

const hash = (input: string): number => {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return h >>> 0;
};

const buildMockResponse = (
  request: LfLLMRequest,
  content: string,
  model = request.model || "mock-model",
): LfLLMCompletionObject => {
  const idSeed = JSON.stringify(request) + Date.now();
  return {
    id: "cmpl_" + hash(idSeed).toString(16),
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        finish_reason: "stop",
        message: {
          role: "assistant",
          content,
        } as LfLLMChoiceMessage,
      },
    ],
  };
};

const transformContent = (
  mode: LfMockLlmMode,
  original: string,
  _request: LfLLMRequest,
  options: EnableMockLlmOptions,
) => {
  switch (mode) {
    case "reverse":
      return original.split("").reverse().join("");
    case "summarize": {
      const words = original.split(/\s+/);
      const limit = 12;
      return (
        "Summary (mock): " +
        (words.length <= limit
          ? original
          : words.slice(0, limit).join(" ") + " … (" + words.length + " words)")
      );
    }
    case "classify": {
      const labels = options.classifyLabels?.length
        ? options.classifyLabels
        : defaultLabels;
      const idx = hash(original) % labels.length;
      return `Class (${labels[idx]}): ${original}`;
    }
    case "echo":
    default:
      return `Echo: ${original}`;
  }
};

export const enableMockLLM = (
  framework: LfFrameworkInterface,
  options: EnableMockLlmOptions = {},
) => {
  const { llm, debug } = framework;
  const mode: LfMockLlmMode = options.mode || "echo";
  const store = llm as LlmWithOriginals;

  if (!store[ORIGINALS_KEY]) {
    store[ORIGINALS_KEY] = {
      fetch: llm.fetch.bind(llm),
      poll: llm.poll.bind(llm),
      speechToText: llm.speechToText.bind(llm),
    };
  }

  debug.logs.new(llm, `[MockLLM] Enabled mode='${mode}'`);

  llm.fetch = async (
    request: LfLLMRequest,
    _url: string,
  ): Promise<LfLLMCompletionObject> => {
    const lastContent =
      request.messages
        ?.slice()
        .reverse()
        .find((m) => m.content)?.content ||
      request.prompt ||
      "";
    const content = transformContent(mode, lastContent, request, options);
    return buildMockResponse(request, content);
  };

  llm.poll = async (_url: string): Promise<Response> => {
    const body = JSON.stringify({ status: "ok", ts: Date.now(), mock: true });
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  llm.speechToText = async (
    textarea: LfTextfieldElement,
    button: LfButtonElement,
  ): Promise<void> => {
    button.lfShowSpinner = true;
    await new Promise((r) => setTimeout(r, 150));
    const mockText = "mock transcription";
    await textarea.setValue(mockText);
    button.lfShowSpinner = false;
  };
};

export const disableMockLLM = (framework: LfFrameworkInterface) => {
  const { llm, debug } = framework;

  const store = llm as LlmWithOriginals;
  const originals = store[ORIGINALS_KEY];
  if (!originals) return;
  llm.fetch = originals.fetch;
  llm.poll = originals.poll;
  llm.speechToText = originals.speechToText;
  debug.logs.new(llm, `[MockLLM] Disabled (restored originals)`);
};

export const isMockLLMEnabled = (framework: LfFrameworkInterface) => {
  const store = framework.llm as LlmWithOriginals;
  return Boolean(store[ORIGINALS_KEY]);
};

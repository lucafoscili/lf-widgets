import {
  LfFrameworkInterface,
  LfLLMChoiceMessage,
  LfLLMCompletionObject,
  LfLLMRequest,
} from "@lf-widgets/foundations";

const ORIGINALS_KEY = Symbol.for("__lf_llm_originals__");

interface OriginalLlmMethods {
  fetch: (request: LfLLMRequest, url: string) => Promise<any>;
  poll: (url: string) => Promise<Response>;
  speechToText: (textarea: any, button: any) => Promise<void>;
}

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
  const store: any = llm as any;

  if (!store[ORIGINALS_KEY]) {
    store[ORIGINALS_KEY] = {
      fetch: llm.fetch.bind(llm),
      poll: llm.poll.bind(llm),
      speechToText: llm.speechToText.bind(llm),
    } as OriginalLlmMethods;
  }

  debug.logs.new(llm, `[MockLLM] Enabled mode='${mode}'`);

  llm.fetch = (async (request: LfLLMRequest, _url: string) => {
    const lastContent =
      request.messages
        ?.slice()
        .reverse()
        .find((m) => m.content)?.content ||
      request.prompt ||
      "";
    const content = transformContent(mode, lastContent, request, options);
    return buildMockResponse(request, content);
  }) as any;

  llm.poll = (async (_url: string) => {
    const body = JSON.stringify({ status: "ok", ts: Date.now(), mock: true });
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as any;

  llm.speechToText = (async (
    textarea: { setValue: (v: string) => Promise<void> },
    button: { lfShowSpinner: boolean },
  ) => {
    button.lfShowSpinner = true;
    await new Promise((r) => setTimeout(r, 150));
    const mockText = "mock transcription";
    await textarea.setValue(mockText);
    button.lfShowSpinner = false;
  }) as any;
};

export const disableMockLLM = (framework: LfFrameworkInterface) => {
  const { llm, debug } = framework;
  const store: any = llm as any;
  const originals: OriginalLlmMethods | undefined = store[ORIGINALS_KEY];
  if (!originals) return;
  llm.fetch = originals.fetch;
  llm.poll = originals.poll;
  llm.speechToText = originals.speechToText;
  debug.logs.new(llm, `[MockLLM] Disabled (restored originals)`);
};

export const isMockLLMEnabled = (framework: LfFrameworkInterface) => {
  const store: any = framework.llm as any;
  return Boolean(
    store[ORIGINALS_KEY] && store.fetch !== store[ORIGINALS_KEY]?.fetch,
  );
};

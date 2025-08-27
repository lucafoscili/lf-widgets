import {
  LfButtonElement,
  LfFrameworkInterface,
  LfLLMCompletionObject,
  LfLLMInterface,
  LfLLMRequest,
  LfLLMRetryPolicy,
  LfLLMUtils,
  LfTextfieldElement,
} from "@lf-widgets/foundations";

export class LfLLM implements LfLLMInterface {
  #IS_ABORT_ERROR = (e: unknown): e is DOMException =>
    e instanceof DOMException && e.name === "AbortError";
  #LF_MANAGER: LfFrameworkInterface;

  /**
   * Utility functions for LLM operations including request hashing and token estimation.
   *
   * @property hash - Generates a deterministic hash string from an LfLLMRequest object.
   * Creates a pruned copy of the request (removing undefined values, sorting keys),
   * then applies FNV-1a hashing algorithm to the JSON stringified result.
   * Used for cache key generation.
   *
   * @property estimateTokens - Provides a heuristic estimation of token count for message arrays.
   * Uses an approximation of 4 characters per token and includes overhead for role information.
   * Returns the estimated number of tokens as a rounded-up integer.
   */
  utils: LfLLMUtils = {
    hash: (request: LfLLMRequest): string => {
      const prune = (obj: unknown): unknown => {
        if (obj === null || typeof obj !== "object") return obj;
        if (Array.isArray(obj)) return obj.map(prune);
        const original = obj as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        Object.keys(original)
          .sort()
          .forEach((k) => {
            const v = original[k];
            if (v === undefined) return;
            out[k] = prune(v);
          });
        return out;
      };
      const base = prune({
        model: request.model,
        messages: request.messages,
        prompt: request.prompt,
        max_tokens: request.max_tokens,
        temperature: request.temperature,
        top_p: request.top_p,
        stop: request.stop,
        presence_penalty: request.presence_penalty,
        frequency_penalty: request.frequency_penalty,
        seed: request.seed,
      });

      // Simple FNV-1a hash over stringified content (sufficient for cache key usage).
      const str = JSON.stringify(base);
      let h = 0x811c9dc5;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)) >>> 0;
      }
      return h.toString(16);
    },

    estimateTokens: (
      messages: NonNullable<LfLLMRequest["messages"]>,
    ): number => {
      let chars = 0;
      messages.forEach((m) => {
        chars += m.content.length + m.role.length + 4;
      });
      return Math.ceil(chars / 4);
    },
  };

  constructor(lfFramework: LfFrameworkInterface) {
    this.#LF_MANAGER = lfFramework;
  }

  //#region Fetch
  /**
   * Sends a chat completion request to the LLM service.
   * @param request - Chat completion parameters.
   * @param url - Base URL of the LLM service (without trailing /v1...).
   * @returns The parsed completion object.
   * @throws {Error} When network fails or non-OK status code.
   */
  fetch = async (
    request: LfLLMRequest,
    url: string,
  ): Promise<LfLLMCompletionObject> => {
    try {
      const response = await fetch(`${url}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as LfLLMCompletionObject;
      return data;
    } catch (error) {
      console.error("Error calling LLM:", error);
      throw error;
    }
  };
  //#endregion

  //#region Poll
  /**
   * Performs a polling request to the specified URL.
   * @param url - The URL to poll.
   * @returns A Promise that resolves with the fetch response.
   */
  poll = async (url: string) => {
    return fetch(url);
  };
  //#endregion

  //#region Streaming

  /**
   * Creates a new AbortController instance for cancelling ongoing operations.
   *
   * @returns A new AbortController that can be used to abort asynchronous operations
   *
   * @example
   * ```typescript
   * const controller = createAbort();
   * // Use controller.signal in fetch or other abortable operations
   * // Call controller.abort() to cancel the operation
   * ```
   */
  createAbort = () => new AbortController();
  /**
   * Streams chat completions from an OpenAI-compatible API endpoint using Server-Sent Events (SSE).
   *
   * This async generator function makes a POST request to the `/v1/chat/completions` endpoint
   * and yields streaming content deltas as they arrive. It handles both streaming and non-streaming
   * responses, with fallback mechanisms for different response formats.
   *
   * @param request - The LLM request object containing the chat completion parameters
   * @param url - The base URL of the API endpoint (without the `/v1/chat/completions` path)
   * @param opts - Optional configuration object
   * @param opts.signal - AbortSignal to cancel the request if needed
   *
   * @yields {Object} Streaming response objects with the following properties:
   * @yields {Object.contentDelta} - The incremental content text from the response
   * @yields {Object.done} - Boolean indicating if the stream has completed
   * @yields {Object.raw} - The raw response object from the API
   *
   * @throws {Error} Throws an error if the HTTP request fails or returns a non-ok status
   *
   * @example
   * ```typescript
   * for await (const chunk of llm.stream(request, 'https://api.openai.com')) {
   *   if (chunk.contentDelta) {
   *     console.log(chunk.contentDelta);
   *   }
   *   if (chunk.done) {
   *     break;
   *   }
   * }
   * ```
   *
   * @remarks
   * - Automatically sets `stream: true` in the request payload if not explicitly provided
   * - Handles abort signals gracefully by silently exiting on AbortError
   * - Falls back to parsing single JSON response if streaming is not available
   * - Supports OpenAI-compatible SSE format with "data: [DONE]" termination
   * - Ignores malformed JSON chunks to maintain stream stability
   */
  stream = async function* (
    this: LfLLM,
    request: LfLLMRequest,
    url: string,
    opts?: { signal?: AbortSignal },
  ) {
    const payload = { ...request, stream: request.stream ?? true };
    let response: Response | null = null;
    try {
      response = await fetch(`${url}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: opts?.signal,
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return;
      }
      throw e;
    }
    if (!response || !response.ok) {
      throw new Error(`HTTP error! status: ${response?.status}`);
    }
    const reader = response.body?.getReader();
    if (!reader) {
      const full = (await response.json()) as LfLLMCompletionObject;
      const text = full.choices?.[0]?.message?.content || "";
      yield { contentDelta: text, done: true, raw: full };
      return;
    }
    const decoder = new TextDecoder();

    let buffered = "";
    while (true) {
      let result: ReadableStreamReadResult<Uint8Array>;
      try {
        result = await reader.read();
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        throw e;
      }
      if (result.done) {
        break;
      }
      buffered += decoder.decode(result.value, { stream: true });
      const lines = buffered.split(/\r?\n/);
      buffered = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed === "data: [DONE]") {
          yield { done: true };
          return;
        }
        if (trimmed.startsWith("data:")) {
          const jsonPart = trimmed.slice(5).trim();
          try {
            const obj = JSON.parse(jsonPart);
            const delta =
              obj.choices?.[0]?.delta?.content ||
              obj.choices?.[0]?.message?.content;
            if (delta) {
              yield { contentDelta: delta, raw: obj };
            }
          } catch (_err) {}
        }
      }
    }

    if (buffered.trim()) {
      try {
        const obj = JSON.parse(buffered.trim());
        const delta =
          obj.choices?.[0]?.delta?.content ||
          obj.choices?.[0]?.message?.content;
        if (delta) {
          yield { contentDelta: delta, raw: obj };
        }
      } catch {}
    }

    yield { done: true };
  };
  //#endregion

  //#region SpeechToText
  /**
   * Initiates speech-to-text functionality using the browser's Speech Recognition API.
   * The recognized speech is automatically populated into the provided textarea element.
   * The function handles the recognition process, including visual feedback through a spinner on the button.
   *
   * @param textarea - The HTMLLfTextfieldElement where the transcribed text will be inserted
   * @param button - The HTMLLfButtonElement that triggers the speech recognition and displays spinner feedback
   * @returns A Promise that resolves when the speech recognition process is complete
   *
   * @throws Will alert if speech recognition is not supported by the browser
   * @throws May throw errors during speech recognition initialization
   *
   * @remarks
   * - Uses either standard SpeechRecognition or webkitSpeechRecognition API
   * - Sets interimResults to true for real-time transcription
   * - Automatically stops recognition when a final result is received
   * - Handles recognition start, result, and end events
   */
  speechToText = async (
    textarea: LfTextfieldElement,
    button: LfButtonElement,
  ) => {
    const { debug } = this.#LF_MANAGER;

    const speechConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!speechConstructor) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new speechConstructor();
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.addEventListener("result", (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      debug.logs.new(this, "STT response: " + transcript);
      textarea.setValue(transcript);
      const isFinal = event.results[event.results.length - 1].isFinal;
      if (isFinal) {
        recognition.stop();
      }
    });

    recognition.addEventListener("end", () => {
      recognition.stop();
      button.lfShowSpinner = false;
    });

    recognition.addEventListener("start", () => {
      textarea.setFocus();
      button.lfShowSpinner = true;
    });

    try {
      recognition.start();
    } catch (err) {
      debug.logs.new(this, "Error: " + err, "error");
    }
  };
  //#endregion

  //#region Retry
  /**
   * Executes a function with automatic retry logic based on configurable retry policies.
   *
   * This method implements exponential backoff with optional jitter for handling transient failures
   * such as network errors, timeouts, and specific HTTP status codes. The retry behavior can be
   * customized through the policy parameter.
   *
   * @template T - The return type of the function being executed
   * @param fn - The async function to execute with retry logic
   * @param policy - Optional retry policy configuration to override defaults
   * @param policy.maxAttempts - Maximum number of retry attempts (default: 3)
   * @param policy.baseDelayMs - Base delay in milliseconds for exponential backoff (default: 300)
   * @param policy.jitter - Whether to apply random jitter to delay calculation (default: true)
   * @param policy.retriableStatus - HTTP status codes that should trigger a retry (default: [408, 429, 500, 502, 503, 504])
   * @param policy.retriableErrorNames - Error names that should trigger a retry (default: ["TypeError", "NetworkError"])
   *
   * @returns A promise that resolves with the result of the successful function execution
   * @throws The last error encountered if all retry attempts are exhausted or if an AbortError occurs
   *
   * @example
   * ```typescript
   * const result = await withRetry(() => fetchData(), {
   *   maxAttempts: 5,
   *   baseDelayMs: 500,
   *   jitter: false
   * });
   * ```
   */
  withRetry = async <T>(
    fn: () => Promise<T>,
    policy?: Partial<LfLLMRetryPolicy>,
  ): Promise<T> => {
    const p: LfLLMRetryPolicy = {
      maxAttempts: policy?.maxAttempts ?? 3,
      baseDelayMs: policy?.baseDelayMs ?? 300,
      jitter: policy?.jitter ?? true,
      retriableStatus: policy?.retriableStatus ?? [
        408, 429, 500, 502, 503, 504,
      ],
      retriableErrorNames: policy?.retriableErrorNames ?? [
        "TypeError",
        "NetworkError",
      ],
    };
    let attempt = 0;
    let lastError: unknown;
    while (attempt < p.maxAttempts) {
      try {
        return await fn();
      } catch (e) {
        lastError = e;
        attempt++;
        // AbortError and DOMExceptions shouldn't be retried here.
        if (this.#IS_ABORT_ERROR(e)) {
          break;
        }
        // TODO: Non-network HTTP status errors must be surfaced: we can optionally attach status in custom error shape; skip for now.
        if (attempt >= p.maxAttempts) {
          break;
        }
        const delayBase = p.baseDelayMs * Math.pow(2, attempt - 1);
        const delay = p.jitter
          ? Math.floor(Math.random() * delayBase)
          : delayBase;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    throw lastError;
  };
  //#endregion
}

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
   * hash:
   *  - Builds a pruned & key‑sorted subset of the request (only model, messages, prompt, and core sampling knobs; excludes user/system/etc. for stability)
   *  - Applies a lightweight FNV‑1a style 32‑bit mixing hash over the JSON string
   *  - Intended ONLY for short‑lived cache keys / memo maps (not cryptographic)
   *
   * estimateTokens:
   *  - Heuristic: ~4 characters ≈ 1 token
   *  - Adds small per‑message overhead (role length + 4) to approximate protocol framing
   *  - Returns Math.ceil of the estimate
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
   * Sends a chat completion request to an OpenAI‑style endpoint.
   * NOTE: This helper does NOT add auth headers; caller must inject them upstream.
   * @param request Chat completion parameters
   * @param url Base service URL (without trailing /v1...)
   * @returns Parsed completion object
   * @throws {Error} Network failure or non‑OK status (generic Error with status embedded in message)
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
   * Performs a simple poll fetch. Thin wrapper: no retries, no headers, no error shaping.
   * @param url URL to poll
   * @returns Raw fetch Response promise
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
   * Yields chunk objects with:
   *  - contentDelta: incremental text (only when present)
   *  - done: final sentinel chunk (always the last emission)
   *  - raw: raw parsed SSE JSON object (only for chunks that contained content OR the single non‑stream fallback)
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
   * - Automatically sets `stream: true` only when request.stream is undefined
   * - Handles abort signals gracefully by silently exiting on AbortError
   * - Falls back to a single JSON response (emitting one chunk with contentDelta + done + raw) if body reader missing
   * - Final streaming termination yields a { done: true } chunk (no raw) after all deltas
   * - Supports OpenAI-compatible SSE lines with "data: [DONE]" termination
   * - Silently ignores malformed JSON lines for resilience
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
   * Starts browser speech recognition and streams interim & final transcript into the provided textfield.
   * Adds spinner state to the trigger button while active.
   *
   * @param textarea LfTextfieldElement target for transcript
   * @param button LfButtonElement used to show spinner while capturing
   * @returns Promise resolving after recognition lifecycle finishes
   *
   * @throws Alerts if recognition API unsupported
   *
   * Notes:
   *  - Uses (webkit)SpeechRecognition with interimResults=true, maxAlternatives=1
   *  - Stops automatically on first final result
   *  - Cleans up spinner on end
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
   * Implements exponential backoff (baseDelayMs * 2^(attempt-1)) with optional full jitter
   * (random 0..delayBase). Retries only when BOTH (a) error name (if present) is in the
   * configured retriableErrorNames AND (b) status (if detectable) is in retriableStatus.
   * If either list rejects the error, it stops early. AbortError is never retried.
   *
   * @template T - The return type of the function being executed
   * @param fn - The async function to execute with retry logic
   * @param policy - Optional retry policy configuration to override defaults
   * @param policy.maxAttempts - Maximum number of retry attempts (default: 3)
   * @param policy.baseDelayMs - Base delay in milliseconds for exponential backoff (default: 300)
   * @param policy.jitter - Whether to apply random jitter to delay calculation (default: true)
   * @param policy.retriableStatus - HTTP status codes considered transient (default: [408, 429, 500, 502, 503, 504])
   * @param policy.retriableErrorNames - Error names considered transient (default: ["TypeError", "NetworkError"]) - (fetch network failures often surface as TypeError in browsers)
   *
   * @returns A promise that resolves with the result of the successful function execution
   * @throws The last error encountered if attempts exhausted or non‑retriable condition encountered
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
        // Determine retriable by name & status (if discoverable)
        const name = (e as { name?: string })?.name;
        const message = (e as { message?: string })?.message;
        let status: number | undefined;
        // Attempt to extract status if error message follows pattern 'HTTP error! status: N'
        if (message) {
          const m = message.match(/status:\s*(\d{3})/i);
          if (m) status = parseInt(m[1], 10);
        }
        // Allow custom error objects with status property
        if (
          status === undefined &&
          typeof e === "object" &&
          e &&
          "status" in (e as any)
        ) {
          const maybe = (e as any).status;
          if (typeof maybe === "number") status = maybe;
        }
        const nameOk = !name || p.retriableErrorNames?.includes(name);
        const statusOk =
          status === undefined || p.retriableStatus?.includes(status);
        const shouldRetry = nameOk && statusOk;
        if (!shouldRetry) {
          break; // Non-retriable condition
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

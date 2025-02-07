import {
  LfButtonElement,
  LfFrameworkInterface,
  LfLLMInterface,
  LfLLMRequest,
  LfTextfieldElement,
} from "@lf-widgets/foundations";

export class LfLLM implements LfLLMInterface {
  #LF_MANAGER: LfFrameworkInterface;

  constructor(lfFramework: LfFrameworkInterface) {
    this.#LF_MANAGER = lfFramework;
  }

  //#region Fetch
  /**
   * Sends a chat completion request to the LLM service.
   * @param request - The request object containing the chat completion parameters
   * @param url - The base URL of the LLM service
   * @returns Promise<any> - The JSON response from the LLM service
   * @throws {Error} - Throws if the HTTP request fails or returns a non-200 status
   */
  fetch = async (request: LfLLMRequest, url: string) => {
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
      const data = await response.json();
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
}

# LfLLM

`LfLLM` is a utility class designed to integrate with an external Large Language Model (LLM) service within the LF Widgets framework. It provides a set of methods to send chat completion requests, perform polling operations, and enable speech-to-text functionality using the browser's native Speech Recognition API.

---

## Overview

- **Primary Purpose:**  
  Facilitate communication with an LLM service by handling HTTP requests for chat completions, polling endpoints for updates, and providing a speech-to-text interface.

- **Integration:**  
  Leverages the LF Widgets framework for logging and debugging. It uses the native `fetch` API for HTTP communication and the Speech Recognition API for voice-based interactions, ensuring that all operations are logged and managed consistently within the LF Widgets ecosystem.

---

## Constructor

### `constructor(lfFramework: LfFrameworkInterface)`

- **Description:**  
  Instantiates an `LfLLM` instance and stores a reference to the LF Widgets framework. This stored framework reference is used for accessing debugging utilities and logging information throughout the class methods.

- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  import { LfLLM } from "./LfLLM";

  const lfFramework = getLfFramework();
  const llmManager = new LfLLM(lfFramework);
  ```

---

## Public Methods

### `fetch(request: LfLLMRequest, url: string): Promise<any>`

- **Description:** Sends a chat completion request to the LLM service using a POST HTTP request.

- **How It Works:**

  1. Constructs the target URL by appending `/v1/chat/completions` to the provided base URL.
  2. Sends a POST request with the request payload encoded as JSON.
  3. Checks the HTTP response; if the response status is not OK, throws an error.
  4. Parses and returns the JSON response from the service.

- **Example:**

  ```ts
  const requestPayload = {
    // ...chat completion parameters
  };

  try {
    const response = await llmManager.fetch(
      requestPayload,
      "https://api.llm-service.com",
    );
    console.log("Chat Completion Response:", response);
  } catch (error) {
    console.error("Error during fetch:", error);
  }
  ```

---

### `poll(url: string): Promise<Response>`

- **Description:** Performs a polling operation by sending a GET request to the specified URL.

- **How It Works:**

  - Utilizes the native `fetch` API to perform a GET request.
  - Returns the resulting promise from the `fetch` call, which resolves with a `Response` object.

- **Example:**

  ```ts
  try {
    const pollResponse = await llmManager.poll(
      "https://api.llm-service.com/status",
    );
    console.log("Poll Response:", pollResponse);
  } catch (error) {
    console.error("Polling error:", error);
  }
  ```

---

### `speechToText(textarea: LfTextfieldElement, button: LfButtonElement): Promise<void>`

- **Description:** Initiates speech-to-text functionality using the browser's Speech Recognition API. The recognized speech is automatically inserted into the specified textarea element, while the button element provides visual feedback (spinner) during the recognition process.

- **How It Works:**

  1. **API Detection:**
     - Checks for the availability of the Speech Recognition API (`SpeechRecognition` or `webkitSpeechRecognition`).
     - If unsupported, alerts the user that speech recognition is not available.
  2. **Configuration:**
     - Creates a new speech recognition instance with `interimResults` enabled and limits the recognition to a single alternative.
  3. **Event Handling:**
     - **`result` Event:** Captures the recognized speech, concatenates the transcript, logs the output using the framework’s debug module, and updates the textarea’s value. Stops recognition once a final result is received.
     - **`start` Event:** Sets focus on the textarea and shows a spinner on the button.
     - **`end` Event:** Stops recognition and hides the spinner on the button.
  4. **Error Handling:**
     - Wraps the call to `recognition.start()` in a try-catch block to log any errors encountered during initiation.

- **Example:**

  ```ts
  const textarea = document.querySelector("lf-textfield");
  const button = document.querySelector("lf-button");

  try {
    await llmManager.speechToText(textarea, button);
  } catch (error) {
    console.error("Speech-to-Text Error:", error);
  }
  ```

---

## Integration with the LF Widgets Framework

- **Logging & Debugging:** The `LfLLM` class makes use of the LF Widgets framework’s `debug` module to log critical events and errors. This ensures that every API response, successful or otherwise, is captured and available for troubleshooting.

- **Error Handling:** Network errors in the `fetch` method and any issues during speech recognition are logged to the console, providing clear insights into failures and facilitating easier debugging.

- **Native API Utilization:** By integrating native browser features (such as the Speech Recognition API), `LfLLM` extends the framework's functionality, offering developers additional interactivity options without compromising on the consistency provided by the framework.

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();
const llmManager = lfFramework.llm;

// Example: Sending a chat completion request
const chatRequest = {
  // Define your chat request parameters here
};

llmManager
  .fetch(chatRequest, "https://api.llm-service.com")
  .then((data) => console.log("Chat Completion:", data))
  .catch((err) => console.error("Fetch Error:", err));

// Example: Polling an endpoint for updates
llmManager
  .poll("https://api.llm-service.com/status")
  .then((response) => console.log("Poll Response:", response))
  .catch((err) => console.error("Poll Error:", err));

// Example: Initiating speech-to-text functionality
const textarea = document.querySelector("lf-textfield");
const button = document.querySelector("lf-button");

llmManager
  .speechToText(textarea, button)
  .catch((err) => console.error("Speech-to-Text Error:", err));
```

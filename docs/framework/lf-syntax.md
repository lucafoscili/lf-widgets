# LfSyntax

`LfSyntax` is a utility class designed to provide centralized syntax processing for both markdown parsing and code syntax highlighting within the LF Widgets framework. It offers a single MarkdownIt instance for consistent markdown parsing and a single Prism instance for code highlighting with lazy language loading and deduplication.

---

## Overview

- **Primary Purpose:**  
  Offer a centralized and consistent set of tools for syntax processing in LF Widgets, including markdown parsing and code syntax highlighting.

- **Integration:**  
  Leverages the LF Widgets framework for logging and debugging. It uses MarkdownIt for markdown parsing and Prism for syntax highlighting, with built-in language loaders for common languages.

---

## Constructor

### `constructor(lfFramework: LfFrameworkInterface)`

- **Description:**  
  Instantiates an `LfSyntax` instance and stores a reference to the LF Widgets framework. This reference is used for logging and debugging throughout the class methods.

- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  const lfFramework = getLfFramework();
  const syntaxManager = new LfSyntax(lfFramework);
  ```

---

## Public Methods

### `json`

An object containing JSON utility methods:

- **`areEqual(obj1: unknown, obj2: unknown): boolean`**  
  Compares two JSON objects for deep equality, handling nested structures.

- **`isLikeString(str: string): boolean`**  
  Checks if a string appears to be JSON-like without fully parsing it.

- **`isValid(str: string): boolean`**  
  Validates if a string contains valid JSON syntax.

- **`parse(str: string): unknown`**  
  Parses a JSON string with additional safety checks and error handling.

- **`unescape(str: string): string`**  
  Unescapes JSON string values that may contain escaped characters.

### `parseMarkdown(content: string): ReturnType<MarkdownIt["parse"]>`

- **Description:**  
  Parses markdown content into an array of tokens using the markdown-it parser.

- **Parameters:**
  - `content`: The markdown string to parse.

- **Returns:** Array of Token objects representing the parsed structure.

- **Usage Example:**

  ```ts
  const tokens = syntax.parseMarkdown("# Hello\n\n**World**");
  ```

### `get markdown(): MarkdownIt`

- **Description:**  
  Gets the underlying MarkdownIt instance for advanced configuration or plugin usage.

- **Usage Example:**

  ```ts
  const md = syntax.markdown;
  md.use(somePlugin);
  ```

### `highlightElement(element: HTMLElement): void`

- **Description:**  
  Highlights a DOM element containing code using Prism. The element should have a `language-*` class.

- **Parameters:**
  - `element`: The HTML element to highlight (typically `<pre>` or `<code>`).

- **Usage Example:**

  ```ts
  const preElement = document.querySelector('pre.language-javascript');
  syntax.highlightElement(preElement);
  ```

### `highlightCode(code: string, language: string): string`

- **Description:**  
  Highlights a code string directly and returns the HTML string with syntax highlighting markup.

- **Parameters:**
  - `code`: The code string to highlight.
  - `language`: The language identifier (e.g., 'javascript', 'python').

- **Returns:** HTML string with syntax highlighting markup.

- **Usage Example:**

  ```ts
  const highlighted = syntax.highlightCode('const x = 5;', 'javascript');
  ```

### `registerLanguage(name: string, loader: (prism: typeof Prism) => void): void`

- **Description:**  
  Registers a language module for syntax highlighting. Languages are loaded lazily and cached to prevent duplicate registration.

- **Parameters:**
  - `name`: The language identifier.
  - `loader`: Function that registers the language grammar with Prism.

- **Usage Example:**

  ```ts
  syntax.registerLanguage('typescript', (prism) => {
    // Language grammar registration code
  });
  ```

### `isLanguageLoaded(name: string): boolean`

- **Description:**  
  Checks if a language grammar has been registered.

- **Parameters:**
  - `name`: The language identifier to check.

- **Returns:** `true` if the language is loaded, `false` otherwise.

- **Usage Example:**

  ```ts
  if (!syntax.isLanguageLoaded('python')) {
    syntax.registerLanguage('python', PYTHON_LOADER);
  }
  ```

### `loadLanguage(name: string): Promise<boolean>`

- **Description:**  
  Loads a language grammar asynchronously from the built-in language loaders.

- **Parameters:**
  - `name`: The language identifier.

- **Returns:** Promise that resolves to `true` if loaded successfully, `false` otherwise.

- **Usage Example:**

  ```ts
  await syntax.loadLanguage('typescript');
  ```

### `get prism(): typeof Prism`

- **Description:**  
  Gets the underlying Prism instance for advanced usage or plugin integration.

- **Usage Example:**

  ```ts
  const prism = syntax.prism;
  // Use Prism API directly
  ```

---

## Integration with the LF Widgets Framework

- **Logging & Debugging:**  
  Throughout its methods, `LfSyntax` leverages the framework's debug module to log warnings and errors, such as when a language fails to load.

- **Lazy Loading:**  
  Language grammars are loaded on-demand and cached to improve performance and reduce bundle size.

- **Singleton Pattern:**  
  The class is designed as a singleton to ensure consistent parsing and highlighting across all components.

---

## Example Usage

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();
const syntax = lfFramework.syntax;

// Parse markdown
const tokens = syntax.parseMarkdown("**Hello** _world_!");

// Highlight code
const highlighted = syntax.highlightCode('const x = 5;', 'javascript');

// Load a language
await syntax.loadLanguage('typescript');
```

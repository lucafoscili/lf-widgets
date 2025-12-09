# LLM Article SDK & Tooling

This document captures the design of the `lf-article` SDK used by the LLM
integration: how tools build rich articles, how layouts work, and how chat
messages and documentation views are composed.

## Goals

- Provide a **declarative, typed builder** (`LfArticleBuilder`) for
  `LfArticleDataset` so callers never manipulate `children` arrays or depths
  manually.
- Keep `lf-article` itself **strict and structural** (depth-based templates
  only); all convenience logic lives in the framework layer.
- Enable LLM tools (weather, docs, etc.) to return **article responses** that
  can act as the main chat message (card + narrative + details).
- Support **layout presets** and higher-level patterns (accordion + code,
  collapsed sections) without coupling them to the `lf-article` component.

## Builder Overview

The builder is exposed via the data framework:

```ts
const article = framework.data.article;
const builder = article.builder.create({
  id: "weather-article",
  title: "Weather for Rome, Italy",
  layout: "stack",
});

const dataset = builder.getDataset();
```

Types live in `packages/foundations/src/framework/data.declarations.ts` and
the implementation in `packages/framework/src/lf-data/helpers.article.builder.ts`.

### Depth Semantics

The builder honors the existing `lf-article` traversal rules:

- depth 0 → article root (`<article>` / `<h1>`)
- depth 1 → sections (`<section>` / `<h2>`)
- depth 2 → paragraphs (`<p>` / optional `<h3>`)
- depth 3+ → leaf content (plain text or shapes rendered via `LfShape`)

No special cases are baked into `lf-article`; the SDK simply ensures nodes are
created at the appropriate depth so that shapes render where expected.

## Layout Presets

Layout hints are encoded in the data layer as
`LfDataArticleLayoutPreset`:

```ts
type LfDataArticleLayoutPreset =
  | "stack"
  | "row"
  | "two-columns"
  | "hero-top"
  | "hero-side"
  | "cards-grid";
```

These are interpreted by the builder (not by `lf-article`) and mapped to
`cssStyle` on container nodes. `lf-article` remains layout-agnostic and simply
applies the inline styles.

Examples:

- `"hero-top"` → article/section/paragraph arranged as a column with card
  underneath a textual summary (used by the weather tool).
- `"stack"` → simple vertical flow (used by docs / README views).

## LfArticleBuilder API

`LfArticleBuilder` is fluent and grouped by responsibility.

```ts
interface LfArticleBuilder {
  getDataset(): LfArticleDataset;
  toDataset(): LfArticleDataset;

  section: {
    get(id: string): LfArticleNode | undefined;
    add: {
      empty(...): LfArticleNode;
      withText(...): { section: LfArticleNode; paragraph: LfArticleNode };
      withLeaf(...): {
        section: LfArticleNode;
        paragraph: LfArticleNode;
        leaf: LfArticleNode;
      };
    };
  };

  // Legacy depth-0 helpers (thin wrappers around the section helpers):
  addSection(...): LfArticleNode;
  getSection(id: string): LfArticleNode | undefined;
  addParagraph(...): LfArticleNode;
  getParagraph(id: string): LfArticleNode | undefined;
  addLeaf(...): LfArticleNode;
  addSectionWithText(...): { section: LfArticleNode; paragraph: LfArticleNode };
  addSectionWithLeaf(...): {
    section: LfArticleNode;
    paragraph: LfArticleNode;
    leaf: LfArticleNode;
  };
}
```

### Section Helpers

#### `section.add.empty`

Creates a section under the article root:

```ts
const section = builder.section.add.empty({
  id: "weather-section",
  title: "Current conditions",
  layout: "hero-top",
});
```

Internally this calls `addSection` and registers the section for subsequent
paragraph/leaf operations.

#### `section.add.withText`

Creates both a section and a paragraph with a text leaf:

```ts
const { section, paragraph } = builder.section.add.withText({
  sectionId: "docs-section",
  sectionTitle: "Overview",
  text: "Short human-friendly summary here.",
  layout: "stack",
});
```

Used for tool responses that consist mainly of narrative content (no shapes)
or where shapes are added later.

#### `section.add.withLeaf`

Creates a section, a paragraph (optionally with text), and appends a leaf
node (usually a shape) at the correct depth:

```ts
const cardNode = article.shapes.card({
  id: "weather-card",
  lfDataset: weatherDataset,
  lfLayout: "weather",
});

builder.section.add.withLeaf({
  sectionId: "weather-section",
  sectionTitle: "Current conditions",
  text: summary,
  layout: "hero-top",
  leaf: cardNode,
});
```

This is the main building block for LLM tools that combine a narrative
summary with a visual representation (card, chart, etc.).

## Integration with LLM Tools

### Weather (`get_weather`)

Location: `packages/framework/src/lf-llm/helpers.tool.weather.ts`.

- Calls the public wttr.in JSON API.
- Builds a `LfDataDataset` used by the `lf-card` `"weather"` layout.
- Uses the article builder to create an article where:
  - the root title is `"Weather for <city>"` (depth 0),
  - a `"Current conditions"` section hosts both
    - a textual bullet-style summary (via `text`), and
    - the weather card as a leaf shape.

Snippet:

```ts
const article = framework.data.article;
const builder = article.builder.create({
  id: "weather-article",
  title: `Weather for ${fullLocation}`,
});

builder.section.add.withLeaf({
  sectionId: "weather-section",
  sectionTitle: "Current conditions",
  text: summary,
  layout: "hero-top",
  leaf: article.shapes.card({
    id: "weather-card",
    lfDataset: weatherDataset,
    lfLayout: "weather",
  }),
});
```

The resulting article dataset is attached to the assistant message and
rendered via `<lf-article>` inside `lf-chat`.

### Docs (`get_component_docs`)

Location: `packages/framework/src/lf-llm/helpers.tool.docs.ts`.

- Fetches the authoritative README for a component directly from GitHub:

  ```txt
  https://raw.githubusercontent.com/lucafoscili/lf-widgets/main/packages/core/src/components/<tag>/readme.md
  ```

- Returns an `article` tool response with:
  - `dataset` → article that wraps the README markdown in a `lf-code` shape.
  - `content` → a textual payload containing the full README text so the
    model can reference it in subsequent turns.

Snippet:

```ts
const article = framework.data.article;
const builder = article.builder.create({
  id: "docs-article",
  title: normalizedTag,
});

builder.section.add.withLeaf({
  sectionId: "docs-readme",
  sectionTitle: "README.md",
  layout: "stack",
  leaf: article.shapes.codeBlock({
    id: "docs-readme",
    language: "markdown",
    code: markdown,
  }),
});
```

In the chat layer, the associated tool message is hidden and only the
article is shown for docs responses. At the same time, the tool result’s
`content` (full README) remains in the conversation history so the LLM can
answer follow-up questions grounded in that source.

## Chat Integration

Key pieces in `lf-chat`:

- `helpers.tools.executeTools` converts `LfLLMToolResponse` into
  `role: "tool"` messages, attaching `articleContent` when `type === "article"`.
- `helpers.tools.handleToolCalls`:
  - pushes tool results into history,
  - attaches the first `articleContent` to the last assistant message,
  - for the `get_component_docs` tool, clears `msg.content` so the docs
    article becomes the entire visible answer (no hallucinated prose).
- `lf-chat.tsx` renders `message.articleContent` via `<lf-article>`
  before any textual message content.

This wiring allows tools to “own” the visual content of a message while the
LLM focuses on natural-language explanations and follow-up reasoning.

## Future Extensions

- **Syntax → article nodes**
  Introduce a `framework.syntax.toArticleNodes(markdown, { variant })`
  helper that converts markdown into article nodes styled like chat
  messages. This keeps text styling rules in the `LfSyntax` service while
  letting `lf-article` host message-like content.

- **Additional layout presets**
  New entries in `LfDataArticleLayoutPreset` can be added over time (for
  comparison tables, side-by-side charts, etc.) without touching
  `lf-article`. The builder remains the sole translator from semantic
  layout names to `cssStyle`.

## Accordion Shape (Collapsible Content)

The `accordion` shape enables collapsible content sections, perfect for large
content like READMEs that would otherwise overwhelm the chat UI.

### Shape Helpers

Two accordion helpers are available via `framework.data.article.shapes`:

```ts
// Basic accordion with custom dataset
const accordionNode = article.shapes.accordion({
  id: "my-accordion",
  lfDataset: {
    nodes: [
      { id: "section-1", value: "Section Title", cells: { ... } },
    ],
  },
  lfUiSize: "medium",
  lfUiState: "primary",
});

// Convenience helper for code blocks (used by docs tool)
const codeAccordion = article.shapes.accordionCodeBlock({
  id: "readme-accordion",
  title: "README.md",        // Header shown when collapsed
  code: markdownContent,
  language: "markdown",
});
```

### Usage in Docs Tool

The `get_component_docs` tool now uses `accordionCodeBlock` to wrap README
content in a collapsible section:

```ts
builder.section.add.withLeaf({
  sectionId: "docs-readme",
  sectionTitle: "",
  layout: "stack",
  leaf: article.shapes.accordionCodeBlock({
    id: "docs-readme-accordion",
    title: "README.md",
    language: "markdown",
    code: markdown,
  }),
});
```

This ensures large documentation doesn't drown out the LLM response.

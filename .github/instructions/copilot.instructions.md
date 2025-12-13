---
applyTo: "**"
---

# AI Assistant Guidelines (LF Widgets)

Focused rules only; everything else is normal Stencil / TypeScript best practice.

> **Canonical Reference:** See `docs/architecture.md` for the complete architectural specification ("Holy Bible"). This document provides quick-reference rules that derive from that specification.

## TL;DR (Quick Compliance Snapshot)

- **TDD First**: Write tests before implementation. Unit tests (Jest) for framework/adapters, E2E (Cypress) for user flows.
- Monorepo flow: foundations (types) → framework (services) → core (web components) → showcase → react wrappers.
- Single outward event (`lf-<name>-event`) via `onLfEvent`.
- Data: `LfDataDataset`; non‑primitives through `<LfShape/>`, primitives via `stringify`; add `lfValue` if missing.
- Adapter: `{ controller.get/set, elements.jsx/refs, handlers }`; getters are functions; types only from foundations.
- **DOM-Driven**: `LF_<COMP>_BLOCKS` defines DOM hierarchy; refs/IDS/SCSS/files all mirror this structure (see 5.4).
- Foundations: no runtime logic. Framework: generic utilities only. Core: component state + rendering.
- Styling: only `theme.bemClass` with `LF_<COMP>_BLOCKS`; each block gets its own SCSS block.
- State mutation: clone Sets/Maps before reassign; debounce filters (300ms).
- Avoid: extra events, ad‑hoc traversal duplicated from framework, local shape maps, timers in refs, monolithic >300 line adapters.
- Pre-PR: build foundations/core, docs sync, run unit tests (`yarn test:unit`), verify adapter + SoC + TDD + DOM-driven checklists.

## 1. Packages (monorepo)

- foundations: types/constants only (NO runtime).
- framework: singleton services (theme, data, effects, debug, portal, llm, drag, color, utilities) acquired via `awaitFramework`.
- core: web components (`lf-*`), plus shared utilities (`utils/`). Single consolidated event per component (`lf-<name>-event`).
- showcase: demo + docs generation (consumes `core/doc.json`).
- react-\* wrappers: generated via react output target.

### 1.1 Layer Responsibilities (Separation of Concerns)

Explicit ownership to prevent logic bleed:

Foundations (types/constants only):

- Owns: public type surfaces (component props, adapter interfaces, enums/constants, event payloads, string literal maps), discriminated unions.
- Forbid: runtime functions, conditionals, loops, data mutation, service access, DOM, timers.
- Reason: zero side-effects, fastest builds, single truth for types.

Framework (runtime singleton services):

- Owns: generic, UI-agnostic data utilities (dataset traversal/filter, shape extraction), theming resolution, effects, portals, drag, color, LLM, debug helpers.
- May expose: generic traversal helpers with predicate callbacks (e.g. `data.node.traverseVisible`).
- Forbid: component-specific assumptions, direct component state mutation, hard-coded tags, adapter imports.

Core (web components + adapters):

- Owns: component state (expanded/selected/hidden), adapter factories, JSX, event funneling, UI-specific decoration of generic outputs.
- Forbid: duplicating framework utilities, redefining foundations types, cross-component singletons, embedding a generic helper already in framework.

Showcase: demos, docs, deterministic samples, Cypress specs.

React wrappers: generated bindings only; no logic.

### 1.2 Placement Cheatsheet

| Task | Layer | Notes |
| --- | --- | --- |
| Declare new adapter getter type | Foundations | Update declarations then `yarn build:foundations` |
| Depth-first traversal (generic) | Framework | Accept predicates; no UI flags stored globally |
| Flatten + UI flags for rendering | Core | Use framework traversal, add view-only data locally |
| Blocks / parts / events constants | Foundations | Pure object literals |
| Shape prop sanitization | Core utility (`LfShape`) | Reuse across components |
| Cell stringify | Framework | Central formatting |
| Expanded nodes Set | Core | Clone before reassign |
| Theming variable lookup | Framework theme service | Always after `awaitFramework` |

### 1.3 Guardrails

- No service or DOM access from foundations.
- No UI semantics baked into framework; predicates in, generic structure out.
- No traversal snapshots stored in refs (recompute; O(n)).
- No promotion of ephemeral UI flags (expanded/selected/hidden) to foundations.
- Prefer wrapping a framework utility over rewriting it in core.

### 1.4 Decision Flow

1. Pure type? → Foundations.
2. Data manipulation w/out UI semantics? → Framework.
3. Needs component instance state or emits events? → Core.
4. Produces JSX? → Core only.
5. Side-effects (DOM/timers)? → Framework service if generic, otherwise Core.

### 1.5 Traversal Rules

- Use `framework.data.node.traverseVisible` for flattening; pass predicates (`isExpanded`, etc.).
- Derive additional UI decoration (indent, guides) after traversal in JSX layer.
- Introduce specialized traversal only if profiling shows a bottleneck; upstream generic part first.

### 1.6 Adapter Boundary Recap

- Foundations: declarative shapes only.
- Framework: unaware of adapters.
- Core: wires framework → adapter → JSX.

Pre-PR SoC Checklist (all must be true):

- [ ] No functions in foundations beyond type exports.
- [ ] No framework helper references component tag names.
- [ ] No duplicate traversal logic in core.
- [ ] Single outward event per component.
- [ ] All adapter interfaces imported from foundations directly.

## 2. Build / Dev / Test

- Install: `yarn install` (Yarn v4).
- Full build: `yarn build` (foundations → framework → core → sync docs/mixins → showcase → react wrappers → markdown).
- Dev: first `yarn dev:setup`, then `yarn dev` for subsequent runs.
- Clean: `yarn clean`. Docs/mixins: `yarn sync:showcase` (usually implicit in build).
- **Testing**:
  - Unit tests: `yarn test:unit` (Jest, runs in CI on candidate/main pushes).
  - Unit tests watch mode: `yarn test:unit:watch` (during development).
  - E2E tests: `yarn test` (Cypress, runs on PRs to main).
  - E2E open mode: `yarn test:open` (interactive Cypress).

## 3. Component Patterns

- Always shadow DOM: `@Component({ tag: 'lf-xyz', shadow: true })`.
- One custom event per component (`lf-xyz-event`) with an `eventType` discriminator (see unified model in 5.1).
- Public API via `@Method()` returning Promise.
- Reactive sets/maps: reassign a cloned Set to trigger re-render.
- Theme registration: `theme.register/unregister` on connect/disconnect (once `#framework` ready).
- Debounced filtering: replicate `lf-tree` pattern (`#filterTimeout`, 300ms) when needed.
- Text fallback: `framework.data.cell.stringify`.
- BEM classes only via `theme.bemClass` + `LF_<COMP>_BLOCKS` maps.

## 4. Data / Cells

- Dataset: `LfDataDataset = { nodes, columns? }`.
- Node optional `cells` map: `cells[columnId] -> LfDataCell`; missing cell ⇒ fallback (`node.value` for primary column else empty in grids).
- Use `framework.data.node.*` & `framework.data.cell.*` helpers; avoid ad‑hoc traversal/filter logic.
- Bulk shape scenarios: precompute once with `data.cell.shapes.getAll(dataset)`; otherwise `data.cell.shapes.get(cell)` inline.

## 5. Shape Rendering (LfShape) ✅

Central abstraction for turning dataset cells into actual elements.

File: `packages/core/src/utils/shapes.tsx` exports `<LfShape/>`.

Use LfShape when:

- Rendering non‑primitive shapes (`badge|button|canvas|card|chart|chat|chip|code|image|photoframe|toggle|typewriter|upload`).
- You need prop sanitization (`sanitizeProps`) + automatic `lfValue` fallback + unified event plumbing.

Skip for primitives (`text|number|slot`) — inline `stringify(value)` / `<slot>` instead.

Event pattern:

```tsx
<LfShape
  framework={this.#framework}
  shape={shape}
  index={i}
  cell={cellProps}
  eventDispatcher={async (e) => this.onLfEvent(e, "lf-event", { node })}
/>
```

`eventDispatcher` MUST return a Promise (async) to satisfy the functional component typings.

Prop preparation: use `shapes.get(cell)` or prefetch via `shapes.getAll(dataset)`; ensure `lfValue` exists (add if absent).

Do NOT:

- Maintain per-component shape-to-tag maps (removed from `lf-tree`).
- Manually forward every single prop; rely on `sanitizeProps` via LfShape.

Performance: precompute with `getAll` for large collections; skip `<LfShape/>` for primitive-only columns.

## 5.1 Adapter Pattern (Data + Shape + Events) — Canonical Reference (see `lf-messenger`)

Three pillars ensure cross-component consistency: Data, Adapter Structure, Unified Event Management.

> **⚠️ v4.0.0 ARCHITECTURE**: This section reflects the canonical adapter pattern. See `docs/4_0_0_REFACTORING.md` Section 5 for the complete specification.

### A. Base Adapter Interface (v4.0.0)

ALL adapters extend the base interface with mandatory domains:

```ts
interface LfComponentAdapter<
  C,
  Payload,
  H,
  J,
  R,
  CGet,
  CSet,
  CComputed,
  CActions,
> {
  controller: {
    get: CGet; // Required: state reads
    set?: CSet; // Optional: simple assignments
    computed?: CComputed; // Optional: predicates, builders
    actions?: CActions; // Optional: complex operations
  };
  dispatcher: LfComponentAdapterDispatcher<Payload>; // REQUIRED
  elements: { jsx: J; refs: R };
  handlers?: H;
}
```

### B. Base Getters (Enforced by Type)

ALL adapters get these getters automatically via `LfComponentAdapterGetters`:

```ts
interface LfComponentAdapterGetters<C, Blocks, Ids, Parts> {
  blocks: () => Blocks; // BEM block structure
  compInstance: () => C; // Live component instance
  cyAttributes: () => typeof CY_ATTRIBUTES; // Cypress attrs
  framework: () => LfFrameworkInterface; // Framework services (renamed from manager!)
  ids: () => Ids; // Element IDs
  lfAttributes: () => typeof LF_ATTRIBUTES; // LF attrs
  parts: () => Parts; // CSS ::part() names
}
```

**Key Rule**: ALL getters are functions `() => T`. No direct values!

### C. Controller Domains

| Domain | Purpose | Returns | Side Effects |
| --- | --- | --- | --- |
| `get` | Read current state | Value | None |
| `set` | Write single value | void | Single assignment |
| `computed` | Derive from state (predicates, builders) | Value | None |
| `actions` | Complex operations (multi-step, async) | void or result | Multiple changes |

Example for complex component:

```ts
controller: {
  get: {
    // Base getters (type-enforced)
    blocks: () => LF_TREE_BLOCKS,
    compInstance: () => this,
    framework: () => this.#framework,
    // ... other base getters
    // Simple state reads
    filterValue: () => this.#filterValue,
  },
  set: {
    filterValue: (v) => { this.#filterValue = v; },
  },
  computed: {
    isExpanded: (node) => this.#expandedNodes.has(node.id),
    isHidden: (node) => this.#hiddenNodes.has(node.id),
  },
  actions: {
    expansion: {
      toggle: (node) => { /* multi-step logic */ },
      expandAll: () => { /* batch operation */ },
    },
  },
},
```

### D. Dispatcher (REQUIRED)

Every adapter MUST have a dispatcher for centralized event emission:

```ts
dispatcher: {
  emit: (eventType, detail) => {
    this.#framework.debug?.logs.new(this, `Event: ${eventType}`, "informational");
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      ...detail,
    });
  },
},
```

Usage in elements/handlers:

```tsx
<button
  onBlur={(e) => dispatcher.emit("blur", { originalEvent: e })}
  onClick={(e) => dispatcher.emit("click", { originalEvent: e })}
/>
```

### E. Component Complexity Tiers

Components fall into three complexity tiers:

| Tier | Complexity | File Pattern | Examples |
| --- | --- | --- | --- |
| **Simple** | Single JSX section, few handlers | `lf-<name>-adapter.ts`, `elements.<name>.tsx`, `handlers.<name>.ts` | `lf-breadcrumbs`, `lf-radio`, `lf-chip` |
| **Medium** | Multiple JSX sections, enhanced setters, portal | Same as Simple + enhanced setters in adapter | `lf-autocomplete`, `lf-select` |
| **Complex** | Domain segmentation, multiple files per domain | `controller.<domain>.ts`, `elements.<domain>.tsx`, `handlers.<domain>.ts`, `helpers.<function>.ts` | `lf-messenger`, `lf-chat` |

### F. Standard Adapter Factory (Simple/Medium)

```ts
// In component's #initAdapter() - inline definition
this.#adapter = {
  controller: {
    get: {
      // Base getters (type-enforced)
      blocks: () => LF_BUTTON_BLOCKS,
      compInstance: () => this,
      cyAttributes: () => CY_ATTRIBUTES,
      framework: () => this.#framework,
      ids: () => LF_BUTTON_IDS,
      lfAttributes: () => LF_ATTRIBUTES,
      parts: () => LF_BUTTON_PARTS,
      // Component-specific
      isDisabled: () => this.lfUiState === "disabled",
    },
    set: prepButtonSetters(() => this.#adapter),
  },
  dispatcher: this.#createDispatcher(),
  elements: {
    jsx: prepButtonJsx(() => this.#adapter),
    refs: createButtonRefs(),
  },
  handlers: prepButtonHandlers(() => this.#adapter),
};
```

Type sourcing:

- Adapter interfaces (e.g. `LfTreeAdapter`, `LfMessengerAdapter`) are defined ONLY in foundations; components must import them from `@lf-widgets/foundations` instead of re-exporting locally. This keeps a single source of truth and prevents divergent type surfaces.

### G. Complex Component Pattern (Tier 3)

Domain-segmented file structure:

```text
lf-messenger/
├── lf-messenger.tsx              # Main component
├── lf-messenger-adapter.ts       # Adapter factory (imports domain modules)
├── controller.character.ts       # Domain: Character getters/setters
├── controller.image.ts           # Domain: Image getters/setters
├── controller.ui.ts              # Domain: UI state getters/setters
├── elements.character.tsx        # Domain: Character JSX
├── elements.chat.tsx             # Domain: Chat JSX
├── handlers.character.ts         # Domain: Character handlers
├── handlers.chat.ts              # Domain: Chat handlers
├── helpers.api.ts                # Business logic: API calls
├── helpers.messages.ts           # Business logic: Message handling
└── helpers.utils.ts              # Shared utilities
```

Domain controller pattern:

```ts
// controller.character.ts
export const prepCharacterGetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterGettersCharacter => ({
  all: () => getAdapter().controller.get.compInstance().lfDataset?.nodes || [],
  byId: (id) => {
    /* ... */
  },
  current: () => getAdapter().controller.get.compInstance().currentCharacter,
});

export const prepCharacterSetters = (
  getAdapter: () => LfMessengerAdapter,
): LfMessengerAdapterSettersCharacter => ({
  current: (character) => {
    getAdapter().controller.get.compInstance().currentCharacter = character;
  },
});
```

### H. Handler Patterns

Switch on eventType, then id with constants:

```ts
export const prepChatHandlers = (getAdapter) => ({
  button: async (e) => {
    const { eventType, id } = e.detail;
    switch (eventType) {
      case "click":
        switch (id) {
          case LF_CHAT_IDS.chat.clear:
            clearTextarea(getAdapter());
            break;
          case LF_CHAT_IDS.chat.send:
            submitPrompt(getAdapter());
            break;
          case LF_CHAT_IDS.chat.settings:
            getAdapter().controller.set.view("settings");
            break;
        }
    }
  },
});
```

Composition handler for child components:

```ts
list: async (event) => {
  const { eventType, node } = event.detail;
  switch (eventType) {
    case "click":
      controller.set.value(node.id);
      controller.actions.list.close();  // Use actions for complex operations
      break;
  }
  adapter.dispatcher.emit("lf-event", { originalEvent: event, node });
},
```

### I. Helper Files

Complex components extract business logic:

| Helper File              | Purpose               |
| ------------------------ | --------------------- |
| `helpers.api.ts`         | API/LLM communication |
| `helpers.messages.ts`    | Message processing    |
| `helpers.attachments.ts` | File/image handling   |
| `helpers.utils.ts`       | Shared utilities      |

Helpers receive adapter for state access:

```ts
export const submitPrompt = async (adapter: LfChatAdapter) => {
  const { controller, elements } = adapter;
  const { get, set, actions } = controller;
  // Implementation
};
```

### J. Ripple Effect Pattern

For interactive elements:

1. **Dedicated ripple element:** Add `<div>` for ripple
2. **Use `pointerdown`:** Not `click` - ripple starts on press
3. **Store refs in Map:** Track by item ID

```tsx
// In JSX
<div
  class={bemClass(blocks.item._, blocks.item.ripple)}
  data-lf={lfAttributes.ripple}
  onPointerDown={(e) => handler(e, node)}
  ref={(el) => {
    if (el) refs.ripples.set(node.id, el);
  }}
></div>;

// In handler
const ripple = refs.ripples.get(node.id);
if (ripple) framework().effects.ripple(ripple, e);
```

### K. Unified Event Management

Single outward event (`lf-<comp>-event`); all interactions route through `dispatcher.emit(eventType, detail)`. Shape events use `<LfShape eventDispatcher>` → `lf-event`. Ripple & side-effects centralized there.

Quick checklist (TDD approach):

1. **Write tests first**: Create spec file with failing tests for expected behavior.
2. Add / update foundations declarations (getters, setters, computed, actions, handlers, refs, jsx entries).
3. Build foundations (`yarn build:foundations`).
4. Implement adapter with ALL getters as functions `() => T`.
5. Use dispatcher for ALL event emissions.
6. Use `<LfShape/>` for every non-primitive shape; inline primitives.
7. **Verify tests pass**: Run `yarn test:unit` to ensure implementation satisfies tests.
8. Rebuild core and verify docs regenerated.
9. Add/adjust showcase examples + (optional) Cypress E2E tests.
10. Ensure component imports its adapter type directly from foundations (no local re-export kept behind for convenience).

Guidelines (summary – see SoC section for details): no duplicated traversal, no `any`, no direct component import inside handlers/JSX, follow messenger for large scale.

## 5.2 Scaling Up (Messenger Pattern Summary)

When complexity grows (see `lf-messenger` for full example):

- Segment domains (`controller.*`, `elements.*`, `handlers.*`).
- Use `computed` for predicates/builders, `actions` for complex operations.
- Keep refs as element handles only.
- JSX pure + `sanitizeProps` + keyed resets.
- Handlers domain-grouped; async-capable.
- Centralize dataset updates via one setter.
- Single dispatcher for all events.
- Avoid monolithic >300 line adapter files, snapshot getters, timers in refs, multiple outward events.

Advanced checklist (condensed): domains present · ALL getters are functions · dispatcher used everywhere · computed/actions separated · pure JSX · grouped handlers · single event · centralized data · theme lookups inside JSX · no cross-domain mutation.

## 5.3 JSX Function Guidelines

JSX functions should be small and focused:

- **Max ~50 lines per function:** Split larger renders into sub-functions
- **Pure functions:** No side effects, no state mutations
- **Return consistent types:** `VNode` or `VNode[]` (use Fragment for multiple)
- **Named keys:** For lists, use stable node IDs as keys

Example structure:

```tsx
export const prepBreadcrumbsJsx = (
  getAdapter: () => LfBreadcrumbsAdapter,
): LfBreadcrumbsAdapterJsx => ({
  // Root container ~30 lines
  breadcrumbs: () => {
    /* ... */
  },
  // Individual items ~40 lines
  items: () => {
    /* ... */
  },
  // Sub-components ~20 lines each
  itemContent: (node) => {
    /* ... */
  },
  separator: () => {
    /* ... */
  },
  ripple: (node) => {
    /* ... */
  },
});
```

## 5.4 DOM-Driven Architecture (Canonical Pattern)

**The DOM structure MUST mirror `LF_<COMP>_BLOCKS`**. This ensures consistency between BEM classes, refs, IDs, parts, and file organization.

### A. Blocks Define DOM Hierarchy

Each entry in `LF_<COMP>_BLOCKS` represents a BEM block that:

1. Gets its own SCSS block (not just an element of parent)
2. Gets a dedicated `elements.<block>.tsx` file (for medium/complex components)
3. Maps to a nested structure in `refs`
4. Has corresponding entries in `IDS` and `PARTS`

Example (`lf-shapeeditor`):

```ts
// In foundations: shapeeditor.constants.ts
export const LF_SHAPEEDITOR_BLOCKS = {
  shapeeditor: { _: "shapeeditor", grid: "grid", viewer: "viewer", navigation: "navigation", ... },
  navigation: { _: "navigation", explorer: "explorer", jump: "jump", masonry: "masonry" },
  explorer: { _: "explorer", tree: "tree", expander: "expander" },
  jump: { _: "jump", textfield: "textfield", load: "load" },
  // ... more blocks
};
```

### B. Refs Mirror DOM Nesting

Refs structure MUST nest to match the DOM hierarchy:

```ts
// ✅ Correct: nested refs mirror DOM
refs: {
  navigation: {
    explorer: { tree: null, expander: null },
    jump: { textfield: null, load: null },
    masonry: null,
  },
  settings: {
    actions: { badge: null, list: null, delete: null, ... },
    controls: {
      snackbar: null,
      items: { accordion: null, infoIcons: [] },
      controlActions: { apply: null, reset: null },
    },
  },
}

// ❌ Wrong: flat refs don't reflect DOM structure
refs: {
  tree: null,
  expander: null,
  textfield: null,
  // ...
}
```

### C. IDS Mirror Blocks

IDs follow the same nested pattern for consistency:

```ts
export const LF_SHAPEEDITOR_IDS = {
  navigation: {
    explorer: { tree: "tree", expander: "expander" },
    jump: { textfield: "textfield", load: "load" },
  },
  settings: {
    actions: { badge: "history-badge", list: "history-list", ... },
    controls: { snackbar: "snackbar", ... },
  },
};
```

### D. File Organization by Block

For medium/complex components, split element files by block scope:

```text
lf-shapeeditor/
├── elements.navigation.tsx      # Parent: delegates to explorer, jump, masonry
├── elements.explorer.tsx        # Sub-block: tree + expander
├── elements.jump.tsx            # Sub-block: textfield + load
├── elements.settings.tsx        # Parent: delegates to actions, controls, tree, progressbar
├── elements.actions.tsx         # Sub-block: badge, list, delete, clear, redo, undo, commit
├── elements.controls.tsx        # Sub-block: snackbar, items, controlActions
├── elements.items.tsx           # Sub-block: accordion, control items
├── elements.controlActions.tsx  # Sub-block: apply, reset buttons
└── elements.preview.tsx         # Standalone: shape + spinner
```

### E. SCSS Block Structure

Each block in `LF_<COMP>_BLOCKS` gets its own SCSS block:

```scss
// ✅ Correct: each block is independent
.navigation {
  &__explorer { ... }
  &__jump { ... }
  &__masonry { ... }
}

.explorer {
  &__tree { ... }
  &__expander { ... }
}

.jump {
  &__textfield { ... }
  &__load { ... }
}

// ❌ Wrong: deeply nested elements in parent block
.navigation {
  &__tree { ... }        // Should be in .explorer block
  &__textfield { ... }   // Should be in .jump block
}
```

### F. Parts for CSS Customization

Every block element should expose a `::part()` for external styling:

```ts
export const LF_SHAPEEDITOR_PARTS = {
  shapeeditor: "shapeeditor",
  navigation: "navigation",
  explorer: "explorer",
  explorerTree: "explorer-tree",
  explorerExpander: "explorer-expander",
  jump: "jump",
  jumpTextfield: "jump-textfield",
  jumpLoad: "jump-load",
  // ... all blocks and their elements
};
```

### G. Handler Splitting by Domain

Split handlers when they serve logically distinct interactions:

```ts
// ✅ Correct: split by interaction domain
handlers: {
  navigation: {
    expander: async (e) => { /* toggle drawer */ },
    load: async (e) => { /* load from path */ },
    tree: async (e) => { /* navigate tree */ },
  },
  settings: {
    actionsButton: async (e) => { /* history/delete/commit actions */ },
    controlActionsButton: async (e) => { /* apply/reset */ },
    tree: async (e) => { /* settings tree navigation */ },
  },
}

// ❌ Wrong: monolithic button handler
handlers: {
  button: async (e) => {
    // Giant switch handling ALL buttons from ALL panels
  },
}
```

### H. Quick Reference Table

| Artifact | Naming Pattern | Location |
| --- | --- | --- |
| Block constant | `LF_<COMP>_BLOCKS.<block>` | `foundations/shapeeditor.constants.ts` |
| ID constant | `LF_<COMP>_IDS.<panel>.<block>.<element>` | `foundations/shapeeditor.constants.ts` |
| Part constant | `LF_<COMP>_PARTS.<block><Element>` | `foundations/shapeeditor.constants.ts` |
| Refs interface | `refs.<panel>.<block>.<element>` | `foundations/shapeeditor.declarations.ts` |
| JSX function | `jsx.<block>()` | `core/elements.<block>.tsx` |
| SCSS block | `.<block> { &__<element> }` | `core/lf-<comp>.scss` |
| Handler | `handlers.<panel>.<domain>` | `core/handlers.<panel>.ts` |

### I. DOM-Driven Checklist

Before finalizing a component structure:

- [ ] Each `LF_<COMP>_BLOCKS` entry has a corresponding SCSS block
- [ ] Refs nest to exactly match DOM hierarchy
- [ ] IDS structure mirrors blocks structure
- [ ] Parts exist for all block elements needing external styling
- [ ] Element files split by block (for medium/complex)
- [ ] Handlers grouped by interaction domain, not by element type
- [ ] Main TSX `#prep*()` methods delegate to JSX functions from element files

## 6. Styling & Theming

- Use provided mixins (`lf-comp-*`, `lf-el-*`).
- Expose CSS custom props with `@prop` JSDoc, naming: `--lf-<component>-<token>`.
- Avoid `!important` unless truly unavoidable.
- Glassmorphism: Use `@include lf-comp-glassmorphize($comp, "surface", "all", 0.75);`
- Borders: Use `@include lf-comp-border($comp, "all");`

### Tiered Glass Alpha Variables

Use CSS custom properties for consistent transparency across the library:

| Variable | Default | Use Case |
| --- | --- | --- |
| `--lf-ui-alpha-glass-hint` | 0.125 | Subtle backgrounds, hover hints |
| `--lf-ui-alpha-glass` | 0.375 | Default glass panels, containers |
| `--lf-ui-alpha-glass-heavy` | 0.75 | Interactive items (chips, breadcrumbs) |
| `--lf-ui-alpha-glass-solid` | 0.875 | Buttons, badges, active states |

Map hardcoded alphas to these tiers: 0.075-0.175 → hint, 0.225-0.475 → default, 0.5-0.775 → heavy, 0.8-0.875 → solid.

## 7. Event System

### Single Event Pattern

Each component emits exactly ONE custom event: `lf-<component>-event`. All interactions route through `onLfEvent()`:

```typescript
onLfEvent(
  event: CustomEvent | PointerEvent,
  eventType: LfButtonEventTypes,
  args?: { node?: LfDataNode }
) {
  const payload = { comp: this, id: this.lfId, eventType, originalEvent: event, ...args };
  this.lfEvent.emit(payload);
}
```

### Event Payload Structure

Every payload includes: `comp` (instance), `id` (lfId), `eventType` (discriminator), `originalEvent`, plus component-specific args.

### Composition Handlers

When containing child LF components:

1. Handle internal logic first (state updates)
2. Always forward to `onLfEvent` for external consumers
3. Include relevant context in args

## 8. Effects & Ripple

- Ripple only if `lfRipple` true; store refs in a local map (see `#r` in tree) for the effect system.
- Distinguish expansion vs selection via `args` object in `onLfEvent` (tree/list pattern).
- **Ripple pattern:** Use `pointerdown` event on a dedicated ripple `<div>`, not `click` on the item itself.
- **Event forwarding:** Child component events should be forwarded through the composition handler to the parent's `onLfEvent`.

Ripple implementation:

```tsx
// JSX: Dedicated ripple div
<div
  class={bemClass(blocks.item._, blocks.item.ripple)}
  data-lf={lfAttributes.ripple}
  onPointerDown={(e) => handler(e, node)}
  ref={(el) => {
    if (el) refs.ripples.set(node.id, el);
  }}
></div>;

// Handler: Trigger ripple effect
const ripple = refs.ripples.get(node.id);
if (ripple) {
  manager.effects.ripple(ripple, e);
}
```

## 9. Testing / Docs

### 9.1 Test-Driven Development (TDD) Workflow

**ALWAYS write tests before implementation**. Follow this sequence:

1. **Unit tests first** (for framework/adapters):
   - Location: `packages/core/tests/` for framework services, or `packages/core/src/components/<component>/<component>.spec.ts` for components.
   - Write failing tests that describe expected behavior.
   - Use Jest + Stencil test utilities.
   - Framework services: test via `getLfFramework()` from `@lf-widgets/framework`.
   - Component tests: mount component, assert props/events/methods.
2. **Implement to pass tests**:
   - Write minimal code to make tests pass.
   - Run `yarn test:unit` or `yarn test:unit:watch` during development.
   - Refactor while keeping tests green.

3. **E2E tests for user flows** (optional, after implementation):
   - Location: `packages/showcase/cypress/e2e/components/<component>.cy.ts`.
   - Test complete user interactions through showcase examples.
   - Use `cy.checkComponentExamples`, `cy.checkEvent`, etc.
   - Run with `yarn test` or `yarn test:open`.

### 9.2 Testing Strategy

- **Unit/Integration (Jest)**: Fast, isolated, test framework services and component logic.
  - Framework utilities (data, theme, etc.) → `packages/core/tests/lf-<service>.spec.ts`.
  - Component behavior → `packages/core/src/components/<component>/<component>.spec.ts`.
  - Mock only when necessary; prefer real framework API.
- **E2E (Cypress)**: Slower, integrated, test user flows through showcase.
  - User interactions → `packages/showcase/cypress/e2e/components/<component>.cy.ts`.
  - No Jest in showcase; Cypress only.
  - Deterministic examples in `packages/showcase/src/components/lf-showcase/assets/data/`.

### 9.3 TDD Checklist (enforce before implementation)

- [ ] Tests written first describing expected behavior.
- [ ] Tests fail initially (red).
- [ ] Implementation makes tests pass (green).
- [ ] Code refactored while maintaining green tests.
- [ ] `yarn test:unit` passes locally.
- [ ] Coverage includes happy path + edge cases.

### 9.4 Docs Regeneration

- Regenerate docs when component APIs change: `yarn sync:showcase` (or `yarn build`).

## 10. Common Pitfalls

- Missing foundations declaration for new prop → TS errors downstream → build foundations only when adding new props with `yarn build:foundations`.
- Mutating a Set without cloning → no re-render.
- Runtime code sneaking into foundations.
- Accessing framework services before `awaitFramework` resolves.

## 11. Quick Commands

`yarn build` · `yarn dev:setup` · `yarn dev` · `yarn sync:showcase` · `yarn clean` · `yarn test:unit` · `yarn test:unit:watch` · `yarn test` · `yarn test:open`.

## 12. Absolute Don'ts

- Use `any` casually (if a new prop is introduced remember to build the foundations to spread it downstream).
- Duplicate shape rendering logic (use `LfShape`).
- Break alphabetical / logical ordering in large maps without reason.
- Hacks and workarounds that bypass the established architecture or that do not follow the best practices.

---

Write concise PR descriptions referencing affected components & new/changed props.

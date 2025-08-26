---
applyTo: "**"
---

# AI Assistant Guidelines (LF Widgets)

Focused rules only; everything else is normal Stencil / TypeScript best practice.

## TL;DR (Quick Compliance Snapshot)

- Monorepo flow: foundations (types only) → framework (services) → core (web components) → showcase → react wrappers.
- One event per component (`lf-<name>-event`); everything funneled via `onLfEvent(event, eventType, args?)`.
- Dataset + shapes: use `LfDataDataset`; render non‑primitive cells with `<LfShape/>`; primitives via `stringify`; ensure `lfValue`.
- Adapter structure: `{ controller: { get, set }, elements: { jsx, refs }, handlers }`; getters return functions for dynamic state.
- No logic in foundations; no snapshotting dynamic getters; mutate via setters; clone Sets/Maps for re-render.
- BEM classes only via `theme.bemClass` + `LF_<COMP>_BLOCKS`; theme services after `awaitFramework`.
- Refs store only elements; domain modules for large adapters (see messenger) with namespaced getters/setters.
- Debounce filters (300ms), centralize dataset updates (`set.data()`), sanitize nested component props.
- Avoid: extra events, ad‑hoc traversal, per-component shape maps, storing timers in refs, large monolithic adapters.
- Before PR: build foundations/core, regenerate docs, check single event usage & adapter checklist.

## 1. Packages (monorepo)

- foundations: types/constants only (NO runtime).
- framework: singleton services (theme, data, effects, debug, portal, llm, drag, color, utilities) acquired via `awaitFramework`.
- core: web components (`lf-*`), plus shared utilities (`utils/`). Single consolidated event per component (`lf-<name>-event`).
- showcase: demo + docs generation (consumes `core/doc.json`).
- react-\* wrappers: generated via react output target.

## 2. Build / Dev

- Install: `yarn install` (Yarn v4).
- Full build: `yarn build` (foundations → framework → core → sync docs/mixins → showcase → react wrappers → markdown).
- Dev: first `yarn dev:setup`, then `yarn dev` for subsequent runs.
- Clean: `yarn clean`. Docs/mixins: `yarn sync:showcase` (usually implicit in build).

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
  shape={shape as any}
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

Performance: precompute with `getAll` for large collections; skip `<LfShape/>` for primitive-only columns to reduce DOM depth.

## 5.1 Adapter Pattern (Data + Shape + Events) — Canonical Reference (see `lf-messenger`)

Three pillars ensure cross-component consistency:

### A. Data Pattern

Leverages Section 4 & 5: dataset + cell shapes + `<LfShape/>` (non‑primitives) with fallback text logic for primitives / missing cells. First grid column retains hierarchical affordances.

### B. Adapter Structure

Canonical factory signature:

```ts
export const createAdapter = (getters, setters, getAdapter) => ({
  controller: { get: createGetters(getters), set: createSetters(setters) },
  elements: { jsx: createJsx(getAdapter), refs: createRefs() },
  handlers: createHandlers(getAdapter),
});
```

Standard partitions:

- `controller.get` (pure getters, no eager evaluation that would snapshot mutable state; functions stay functions e.g. `filterValue: () => string`).
- `controller.set` (imperative state mutators; cloning Sets/Maps inside to trigger re-render).
- `elements.jsx` (pure/side-effect-free VNode producers; no state mutation here).
- `elements.refs` (stable object storing mutable element references only; never shape or data caches — precomputed shape maps can be local variables outside render or inside traversal helpers).
- `handlers` (UI event callbacks calling setters + funnel events through component `onLfEvent`).

Guidelines:

- Zero business logic duplication: data traversal (e.g. tree walking) can live in an adapter helper (like `lf-tree-traverse.tsx`) but must consume the unified getters/setters.
- Avoid `any`; if a new dynamic getter is needed, add it to foundations declarations first and rebuild.
- No cross-calling between handlers and jsx via importing component class directly (always go through `getAdapter()`).
- Messenger is the richest example (multiple nested handler groups, rich refs usage, complex toolbar) — follow its layering & naming.

### C. Unified Event Management

Single outward custom event (`lf-<comp>-event`) per component. All internal interactions invoke `onLfEvent(event, eventType, args?)`. Shape events route via `<LfShape eventDispatcher>` → `lf-event`. Keep legacy dual emissions only when necessary. Ripple & side-effects centralized in `onLfEvent`.

Quick checklist when adding/refactoring a component adapter:

1. Add / update foundations declarations (getters, setters, handlers, refs, jsx entries).
2. Build foundations (`yarn build:foundations`).
3. Implement adapter with pure pass-through getters (no invocation) for dynamic values.
4. Use `<LfShape/>` for every non-primitive shape; inline primitives.
5. Funnel all interactions via `onLfEvent` to emit the single outward event.
6. Rebuild core and verify docs regenerated.
7. Add/adjust showcase examples + (optional) Cypress tests.

## 5.2 Advanced Adapter Patterns (Messenger Deep-Dive)

Use `lf-messenger` as the canonical large/complex reference. Replicate these when a component grows:

### Domain Segmentation

- Split large adapters into domain modules: `controller.<domain>.ts`, `elements.<domain>.tsx`, `handlers.<domain>.ts` (e.g. character, image, ui, chat, customization, options).
- Each exposes factories: `prep<Domain>Getters`, `prep<Domain>Setters`, `prep<Domain>` (JSX object), `prep<Domain>Handlers`.
- Main adapter only aggregates; factory surface stays `{ controller, elements, handlers }`.

### Namespaced Getters & Setters

- Dynamic values are functions (never snapshot mutable state).
- Setters mirror getter namespace 1:1.
- Composite getters (`config()`, `history()`, `data()`) bundle frequently co-accessed state.

### Refs Tree Mirrors UI

- Deep ref structure follows visual hierarchy (e.g. `refs.customization.form.avatars.confirm`).
- Refs store only element handles (focus, effects) — never caches or timers.

### Pure JSX Producers

- JSX functions are pure (read-only).
- Use `sanitizeProps(...)` for nested LF components.
- Keyed renders (`key={current().id}`) reset nested component internal state on identity change.

### Handler Design

- Grouped per domain → switch on `eventType` → branch by id.
- Only call namespaced setters; allow setters to return flags for immediate UI updates.

### Async-Ready

- Mark handlers `async` even if sync now for future extensibility.

### Dataset & Shapes

- Central dataset update entrypoint (e.g. `set.data()`) invokes a utility (like `updateDataset`) to handle recalculation / cache invalidation.

### Event Funnel

- Domain handlers mutate state only; component `onLfEvent` handles all outward emission & side-effects.

### Theming & Icons

- Resolve icons/vars inside JSX; destructure minimally.

### Cross-Domain Boundaries

- Domains interact only via namespaced setters (no direct mutation).

### Avoid Anti-Patterns

- Monolithic adapter file >300 lines.
- Snapshotting dynamic getters.
- Storing timers/caches in `refs`.
- Multiple outward events.

### Advanced Checklist

1. Domain modules present.
2. Dynamic getters are functions.
3. Setters mirror namespace.
4. Refs only store elements.
5. JSX pure & sanitized.
6. Handlers grouped & eventType-first.
7. Single event funnel intact.
8. Dataset updates centralized.
9. Theme/icon lookups inside JSX.
10. No cross-domain direct mutation.

## 6. Styling & Theming

- Use provided mixins (`lf-comp-*`, `lf-el-*`).
- Expose CSS custom props with `@prop` JSDoc, naming: `--lf-<component>-<token>`.
- Avoid `!important` unless truly unavoidable.

## 7. Events & Effects

- Ripple only if `lfRipple` true; store refs in a local map (see `#r` in tree) for the effect system.
- Distinguish expansion vs selection via `args` object in `onLfEvent` (tree/list pattern).

## 8. Testing / Docs

- Cypress lives in showcase; new deterministic examples go in `packages/showcase/src/components/lf-showcase/assets/data/`.
- Regenerate docs when component APIs change: `yarn sync:showcase` (or `yarn build`).

## 9. Common Pitfalls

- Missing foundations declaration for new prop → TS errors downstream → build foundations only when adding new props with `yarn build:foundations`.
- Mutating a Set without cloning → no re-render.
- Runtime code sneaking into foundations.
- Accessing framework services before `awaitFramework` resolves.

## 10. Quick Commands

`yarn build` · `yarn dev:setup` · `yarn dev` · `yarn sync:showcase` · `yarn clean`.

## 11. Absolute Don'ts

- Add runtime logic to foundations.
- Use `any` casually (if a new prop is introduced remember to build the foundations to spread it downstream).
- Duplicate shape rendering logic (use `LfShape`).
- Break alphabetical / logical ordering in large maps without reason.

---

Write concise PR descriptions referencing affected components & new/changed props.

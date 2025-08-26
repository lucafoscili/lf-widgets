---
applyTo: "**"
---

# AI Assistant Guidelines (LF Widgets)

Focused rules only; everything else is normal Stencil / TypeScript best practice.

## 1. Packages (monorepo)
- foundations: types/constants only (NO runtime).
- framework: singleton services (theme, data, effects, debug, portal, llm, drag, color, utilities) acquired via `awaitFramework`.
- core: web components (`lf-*`), plus shared utilities (`utils/`). Single consolidated event per component (`lf-<name>-event`).
- showcase: demo + docs generation (consumes `core/doc.json`).
- react-* wrappers: generated via react output target.

## 2. Build / Dev
- Install: `yarn install` (Yarn v4).
- Full build: `yarn build` (foundations → framework → core → sync docs/mixins → showcase → react wrappers → markdown).
- Dev: first `yarn dev:setup`, then `yarn dev` for subsequent runs.
- Clean: `yarn clean`. Docs/mixins: `yarn sync:showcase` (usually implicit in build).

## 3. Component Patterns
- Always shadow DOM: `@Component({ tag: 'lf-xyz', shadow: true })`.
- One custom event: `lf-xyz-event`; route all interactions through `onLfEvent` with an `eventType` discriminator.
- Public API via `@Method()` returning Promise.
- Reactive sets/maps: reassign a cloned Set to trigger re-render.
- Theme registration: `theme.register/unregister` on connect/disconnect (once `#framework` ready).
- Debounced filtering: replicate `lf-tree` pattern (`#filterTimeout`, 300ms) when needed.
- Text fallback: `framework.data.cell.stringify`.
- BEM classes only via `theme.bemClass` + `LF_<COMP>_BLOCKS` maps.

## 4. Data / Cells
- `LfDataDataset = { nodes, columns? }`.
- Node optional `cells` keyed by column id / semantic key. Missing cell => show node.value (or empty in grid non‑primary column).
- Helpers: use `framework.data.node.*` & `framework.data.cell.*` instead of manual traversal/filter.
- Precompute shape props for bulk rendering with `data.cell.shapes.getAll(dataset)` when iterating many shapes repeatedly; otherwise `data.cell.shapes.get(cell)` inline is fine.

## 5. Shape Rendering (LfShape) ✅
Central abstraction for turning dataset cells into actual elements.

File: `packages/core/src/utils/shapes.tsx` exports `<LfShape/>`.

Use LfShape when:
- Rendering any non‑primitive shape (`badge|button|canvas|card|chart|chat|chip|code|image|photoframe|toggle|typewriter|upload`).
- You want consistent prop sanitization (`sanitizeProps`) and automatic `lfValue` fallback mapping.
- You need uniform event dispatch plumbing (each underlying component emits its own `lf-*-event`; LfShape lets you centralize handling through an `eventDispatcher`).

Skip LfShape when:
- Shape is textual primitive: `text`, `number`, or `slot` (cheaper to inline `stringify(value)` or a `<slot name=...>` as done inside LfShape itself).

Event pattern:
```tsx
<LfShape
  framework={this.#framework}
  shape={shape as any}
  index={i}
  cell={cellProps}
  eventDispatcher={async (e) => this.onLfEvent(e, 'lf-event', { node })}
/>
```
`eventDispatcher` MUST return a Promise (async) to satisfy the functional component typings.

Prop preparation:
- Use `framework.data.cell.shapes.get(cell)` for a single cell OR prefetch all via `getAll(dataset)` and index by shape if iterating.
- Ensure `lfValue` exists if the transformation didn't add it (rare edge cases); add manually only when missing.

Do NOT:
- Maintain per-component shape-to-tag maps (removed from `lf-tree`).
- Manually forward every single prop; rely on `sanitizeProps` via LfShape.

Performance hints:
- Large grids/trees: precompute once (`getAll`) and attach references; avoid repeated `get(cell)` in deep loops when counts are large.
- Primitive-only columns: short‑circuit to `stringify` without `<LfShape/>` to reduce DOM depth.

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
- Missing foundations declaration for new prop → TS errors downstream.
- Mutating a Set without cloning → no re-render.
- Runtime code sneaking into foundations.
- Accessing framework services before `awaitFramework` resolves.

## 10. Quick Commands
`yarn build` · `yarn dev:setup` · `yarn dev` · `yarn sync:showcase` · `yarn clean`.

## 11. Absolute Don'ts
- Add runtime logic to foundations.
- Use `any` casually.
- Duplicate shape rendering logic (use LfShape).
- Break alphabetical / logical ordering in large maps without reason.

---
Write concise PR descriptions referencing affected components & new/changed props.

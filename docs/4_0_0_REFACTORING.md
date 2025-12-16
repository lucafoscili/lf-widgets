# LF Widgets v4.0.0 Architectural Refactoring Proposal

> **Status**: PHASE 0 + PHASE 1 (Adapter-Everywhere) COMPLETE ✅  
> **Status**: PHASE 2 (Functional Components) IN PROGRESS 🚧  
> **Branch**: Already has 200+ files edited  
> **Timeline**: Phase 0+1 (Adapter Architecture) completed December 2024  
> **Philosophy**: "This might be the last chance for an architectural overhaul"
>
> **🎉 MILESTONE**: All 39 components now have v4.0.0 compliant adapters!
>
> - 1332/1332 unit tests passing
> - Full build passing
>
> **🏆 GOLDEN STANDARD**: `lf-shapeeditor` is the reference implementation for complex components.
> **🥈 SILVER STANDARD**: `lf-button` is the reference for simple components.
> **🌟 FC REFERENCE**: `lf-slider` is the first Functional Component conversion.

---

## FC Reference: `lf-slider` (First Functional Component)

The `lf-slider` component is the **first FC conversion** demonstrating the dual-mode pattern (WC wrapper + FC core).

### Key Files

| File | Purpose |
|------|---------|
| `packages/foundations/src/components/slider.declarations.ts` | Includes `LfSliderFCProps` interface |
| `packages/core/src/components/lf-slider/lf-slider-fc.tsx` | Stateless Functional Component |
| `packages/core/src/components/lf-slider/lf-slider.tsx` | Web Component (thin wrapper) |
| `packages/core/src/components/lf-slider/elements.slider.tsx` | JSX using `<LfSliderFC>` |

### FC Pattern Summary

1. **FC is stateless**: All state managed by parent WC
2. **Framework as prop**: FC receives `framework` for theming utilities
3. **Callbacks not events**: FC uses `onChange`, `onInput` callbacks instead of CustomEvents
4. **Ref forwarding**: FC exposes `inputRef`, `thumbRef`, `trackRef` for parent to capture DOM references
5. **WC remains thin wrapper**: Handles lifecycle, events, state, passes to FC

---

## Golden Standard Reference: `lf-shapeeditor`

The `lf-shapeeditor` component serves as the **golden standard** for v4.0.0 adapter architecture. All other component migrations should follow its patterns.

### Key Files (Study These First)

| File | Purpose |
|------|---------|
| `packages/foundations/src/components/shapeeditor.declarations.ts` | Type definitions - extends `LfComponentAdapterBaseGetters` |
| `packages/core/src/components/lf-shapeeditor/lf-shapeeditor.tsx` | Main component - dispatcher + function getters |
| `packages/core/src/components/lf-shapeeditor/lf-shapeeditor-adapter.ts` | Adapter factory - domain separation |
| `packages/core/src/components/lf-shapeeditor/elements.*.tsx` | JSX functions - uses `controller.get` as functions |
| `packages/core/src/components/lf-shapeeditor/handlers.*.ts` | Event handlers - grouped by panel |

### Compliance Checklist (Verified ✅)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| 5.1 Base Interface Overhaul | ✅ | `extends LfComponentAdapterBaseGetters<...>` |
| 5.2 All Getters as Functions | ✅ | `blocks: () => this.#b`, `framework: () => this.#framework` |
| 5.3 No Initializer Types | ✅ | No `*InitializerGetters/Setters` |
| 5.4 Controller Domains (get/set/computed/actions) | ✅ | All four domains properly separated |
| 5.5 Dispatcher Mandatory | ✅ | `dispatcher: { emit: ... }` inline |
| 5.6 Extends Base Interface | ✅ | `LfShapeeditorAdapter extends LfComponentAdapter<...>` |
| 5.7 Explicit Null in Refs | ✅ | Properly typed element references |
| `manager` → `framework` | ✅ | All files use `framework` |
| `lfAttribute` → `lfAttributes` | ✅ | All files use `lfAttributes` |

#### Shapeeditor Domain Separation (Reference Implementation)

**`controller.get`** (pure state reads):

- `config.*` - configuration state
- `currentShape` - current shape data
- `history.current`, `history.full`, `history.index`, `history.isPopupOpen`
- `navigation.isTreeOpen`
- `previewValue`, `progressbar`, `resetKey`, `snackbar`, `spinnerStatus`

**`controller.set`** (simple single-value assignments):

- `config.*` - configuration setters
- `currentShape`, `history.index`, `history.isPopupOpen`
- `navigation.isTreeOpen`
- `previewValue`, `progressbar`, `snackbar`

**`controller.computed`** (derived values, predicates):

- `history.currentSnapshot` - derives from shape + index
- `navigation.hasNav` - predicate checking dataset presence

**`controller.actions`** (multi-step operations):

- `history.new` - splice, conditional push, index update
- `history.pop` - conditional splice, refresh, index reset
- `history.toggle` - toggle popup visibility
- `navigation.toggle` - toggle tree visibility
- `incrementResetKey` - increment counter

### Silver Reference: `lf-button`

For **simpler components** (Tier 1), use `lf-button` as the reference. It demonstrates the minimal v4.0.0 compliant adapter without the complexity of multi-panel layouts.

---

## Executive Summary

This document catalogs architectural improvements for the v4.0.0 major release. Items are prioritized by impact and complexity. The goal is to reduce technical debt, improve developer experience, and ensure long-term maintainability before the API surface grows too large.

### Critical Path (Phase 0)

The **Adapter Pattern Standardization** (Section 5) has been elevated to immediate priority. This involves:

1. **Base Interface Overhaul** - Promote common getters (blocks, cyAttributes, framework, ids, lfAttributes, parts) to base type with generics
2. **Standardize All Getters as Functions** - Every getter returns `() => T`, no exceptions
3. **Rename `manager` → `framework`** - Clearer semantics throughout codebase
4. **Remove Initializer Types** - Eliminate redundant `*AdapterInitializerGetters/Setters` boilerplate
5. **Controller Domain Separation (MANDATORY)** - Operations MUST go in correct domain: `get` (pure reads), `set` (single assignments), `computed` (predicates/derived), `actions` (multi-step)
6. **Make Dispatcher Mandatory** - Centralized event emission for all components
7. **All Adapters Extend Base** - Type safety enforcement
8. **Adapter-Everywhere** - All 39 components get adapters

**This will break builds until complete. Estimated: 2-3 days focused work.**

> **✅ Phase 0 Complete** (December 2024): All 24 adapter-enabled components migrated to v4.0.0 pattern. 1333/1333 unit tests passing.

---

## Table of Contents

1. [Data Layer Simplification](#1-data-layer-simplification)
   - 1.1 LfDataCell Type Refactoring
   - 1.2 Flexible Cells Container
   - 1.3 Value vs lfValue Clarification
   - 1.4 LfDataCellContainer Duplicate Definition
2. [Functional Components Architecture](#2-functional-components-architecture)
3. [Component Boilerplate Reduction](#3-component-boilerplate-reduction)
4. [Type System Consolidation](#4-type-system-consolidation)
5. [Adapter Pattern Standardization](#5-adapter-pattern-standardization) ⭐ **HOLY BIBLE**
   - 5.1 Base Interface Overhaul (common getters + generics)
   - 5.2 Standardize All Getters as Functions
   - 5.3 Eliminate Initializer Types (REMOVED)
   - 5.4 Controller Domain Separation (get/set/computed/actions)
   - 5.5 Dispatcher as Mandatory Domain
   - 5.6 All Adapters Must Extend Base Interface
   - 5.7 Explicit Null in Refs
   - 5.8 Adapter-Everywhere Philosophy
6. [Architecture Enforcement](#6-architecture-enforcement)
7. [Testing Coverage](#7-testing-coverage)
8. [Implementation Priority Matrix](#8-implementation-priority-matrix)
   - Phase 0: Adapter Architecture Overhaul (IMMEDIATE)
   - Phase 1-4: Standard rollout

---

## 1. Data Layer Simplification

### 1.1 LfDataCell Type Refactoring ✅ COMPLETE

> **Status**: Implemented (December 2024). Replaced 120-line nested ternary with clean mapped types.

**Original Problem**: The `LfDataCell` type in `data.declarations.ts` used a 120-line nested conditional type with 17 levels of nesting.

**Solution Implemented**: Mapped types with shape-to-props and shape-to-value lookup tables.

```typescript
// NEW: Clean mapped type approach (~50 lines total)
interface LfDataCellPropsMap {
  accordion: Partial<LfAccordionPropsInterface>;
  badge: Partial<LfBadgePropsInterface>;
  button: Partial<LfButtonPropsInterface>;
  // ... all 19 shapes
}

interface LfDataCellValueMap {
  accordion: string;
  badge: string;
  chat: LfChatHistory;  // Custom type
  number: number;
  toggle: boolean;
  // ... shape-specific value types
}

export type LfDataCell<T extends LfDataShapes = LfDataShapes> =
  T extends LfDataShapes
    ? LfDataCellPropsMap[T] & {
        shape: T extends "text" ? T | undefined : T;  // Optional only for "text"
        value: LfDataCellValueMap[T];
        htmlProps?: Partial<LfFrameworkAllowedKeysMap>;
      }
    : LfDataBaseCell;
```

**Benefits**:

- Reduced from ~120 lines to ~50 lines
- Better TypeScript error messages
- Easier to maintain and extend
- Cleaner separation of props vs value types

**Files Changed**: `packages/foundations/src/framework/data.declarations.ts`

**Complexity**: ~~Medium~~ → Resolved
**Priority**: ~~P0~~ → Complete

---

### 1.2 Flexible Cells Container ✅ COMPLETE

> **Status**: Implemented (December 2024). Semantic keys now supported with shape discriminator.

**Original Problem**: `LfDataCellContainer` used rigid `lf<Shape>` key naming, limiting to one cell per shape type.

**Solution Implemented**: Index signature allows any key; `shape` property is now the type discriminator.

```typescript
// NEW: Flexible keys with shape discriminator
export interface LfDataCellContainer {
  /** @deprecated Use semantic keys instead. Kept for backward compatibility. */
  lfButton?: LfDataCell<"button">;
  // ... other legacy keys (deprecated)
  
  /** Flexible index signature allowing any semantic key */
  [key: string]: LfDataCell<LfDataShapes>;
}

// Usage example - NOW WORKS!
const cells: LfDataCellContainer = {
  primaryAction: { shape: "button", value: "Submit", lfIcon: "check" },
  secondaryAction: { shape: "button", value: "Cancel", lfIcon: "close" },
  avatar: { shape: "image", value: "/user.jpg" },
  background: { shape: "image", value: "/bg.jpg" },
};
```

**Breaking Change**: Yes - `shape` property is now **required** for all cells (except "text" which is optional).

**Migration Applied**:

- ✅ `packages/framework/src/lf-llm/helpers.tool.wikipedia.ts` - Added shape to text cells
- ✅ `packages/showcase/src/components/lf-showcase/helpers/dashboard.builder.ts` - Added shape to chart data cells  
- ✅ `packages/showcase/src/components/lf-showcase/assets/data/card.ts` - Added shape to all cells
- ✅ `packages/showcase/src/components/lf-showcase/assets/data/carousel.ts` - Added shape to card cells
- ✅ `packages/showcase/src/components/lf-showcase/assets/data/chart.ts` - Added shape to all data cells
- ✅ `packages/showcase/src/components/lf-showcase/assets/data/compare.ts` - Added shape to card cells
- ✅ `packages/showcase/src/components/lf-showcase/lf-showcase.tsx` - Added shape to text cells

**Also Deprecated**:

- `LF_DATA_SHAPE_MAP` constant (in `data.constants.ts`)
- `LfDataCellNameToShape` type
- `LfDataCellFromName` utility type
- All `lf<Shape>` keys in `LfDataCellContainer` (kept for backward compatibility)

**Files Changed**:

- `packages/foundations/src/framework/data.declarations.ts`
- `packages/foundations/src/framework/data.constants.ts`
- Multiple showcase/framework files for migration

**Complexity**: ~~High~~ → Resolved
**Priority**: ~~P1~~ → Complete

---

### 1.3 Value vs lfValue Clarification

**Current Confusion**: Perceived as "two value properties" but actually a cell→component mapping.

**Reality Check**: Looking at `LfDataCell` type (lines 451-566 in `data.declarations.ts`):

- Cells have `value` property (storage/canonical)
- Cells inherit component props via `Partial<LfComponentPropsInterface>`
- Components have `lfValue` prop (rendering)

```typescript
// Cell type structure (simplified)
type LfDataCell<"button"> = Partial<LfButtonPropsInterface> & {
  shape: "button";
  value: string;  // Cell's value
  // lfValue comes from LfButtonPropsInterface, NOT a separate cell property
};

// The "confusion" is actually a MAPPING, not duplication
// shapes.tsx maps cell.value → component's lfValue prop
```

**Actual Behavior** (in `shapes.tsx`):

```typescript
// shapes.tsx automatically maps cell.value → component.lfValue
if ("value" in props && !("lfValue" in props)) {
  (props as Record<string, unknown>).lfValue = props.value;
}
```

**Clarification Table**:

| Context | Property | Purpose | Location |
|---------|----------|---------|----------|
| Cell (data layer) | `value` | Canonical storage value | `LfDataCell.value` |
| Component (UI layer) | `lfValue` | Rendering prop | `LfComponentPropsInterface.lfValue` |
| Mapping | `value` → `lfValue` | Auto-derived if not explicit | `shapes.tsx` |

**Key Insight**: This is NOT two cell properties—it's a cell property being mapped to a component prop. The perceived duplication is actually the shape renderer bridging data and UI layers.

**Recommendation**:

1. Add JSDoc to `LfDataCell.value` explaining the mapping
2. Document in architecture.md under "Shape Rendering"
3. Consider renaming for clarity: `cell.value` is the source, `lfValue` is auto-derived

**Files Affected**:

- `packages/foundations/src/framework/data.declarations.ts` (JSDoc)
- `packages/core/src/shapes/shapes.tsx` (already handles mapping)
- `docs/architecture.md` (add Shape Rendering section)

**Complexity**: Low
**Priority**: P2 (Documentation, Non-Breaking)

---

### 1.4 LfDataCellContainer Duplicate Definition ✅ RESOLVED

> **Status**: Resolved (December 2024). `lfTypewriter` added to typed interface. Index signature retained pending Section 1.2 implementation.

**Original Problem**: `LfDataCellContainer` had both typed keys AND an index signature in the same interface, with `lfTypewriter` missing from the typed keys.

**Resolution**:

1. ✅ `lfTypewriter` added to the typed interface
2. ✅ Index signature retained (Option B) since Section 1.2 (Flexible Cells) is imminent
3. The typed keys now serve as documentation/autocomplete hints while the index signature allows flexible semantic keys

**Current State** (`data.declarations.ts` lines 579-601):

```typescript
export interface LfDataCellContainer {
  lfAccordion?: LfDataCellFromName<"lfAccordion">;
  // ... 18 typed entries for autocomplete
  lfTypewriter?: LfDataCellFromName<"lfTypewriter">;  // ✅ Added
  lfUpload?: LfDataCellFromName<"lfUpload">;
  /** Index signature for flexible cell keys */
  [index: string]: LfDataCell<LfDataShapes>;  // Retained for 1.2 compatibility
}
```

**Next Step**: When Section 1.2 is implemented, the typed keys can be removed entirely—`shape` will be the sole discriminator, and semantic keys (e.g., `avatar`, `background`) will replace `lf<Shape>` convention.

**Files Affected**: `packages/foundations/src/framework/data.declarations.ts`

**Complexity**: Low
**Priority**: ~~P1~~ → Resolved

---

## 2. Functional Components Architecture

### 2.1 Vision: Dual-Mode Components

**Ideal End State**:

1. Every Web Component has a Functional Component (FC) counterpart
2. Web Components are thin wrappers around FCs (for standalone usage)
3. When composed inside other components, always use the FC version
4. All shapes render via FCs, not Web Components
5. State always lives in the parent, FCs are purely presentational

```plaintext
┌─────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Standalone Usage          Composed Usage (e.g., Shapeeditor) │
│   ────────────────          ─────────────────────────────────  │
│                                                                 │
│   <lf-textfield>            <LfTextfieldFC                     │
│     ├─ @State value           value={parentState.value}        │
│     ├─ @Event onChange        onChange={parentHandler}         │
│     └─ render() {             framework={framework}            │
│          return (           />                                 │
│            <LfTextfieldFC                                      │
│              value={this.value}   ← FC receives props          │
│              ...                  ← FC has NO state            │
│            />                     ← FC delegates events up     │
│          )                                                     │
│        }                                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Problem Statement

Current pain points when using Web Components inside other components:

| Issue | Impact | Example |
|-------|--------|---------|
| Shadow DOM overhead | Performance | Each `<lf-slider>` in shapeeditor has its own shadow root |
| Lifecycle hooks | Memory/CPU | `connectedCallback`/`disconnectedCallback` × N instances |
| Theme registration | Redundant | Each child registers with theme service separately |
| State synchronization | Complexity | Parent must sync props → child, listen for events → update |
| Detached element risk | Memory leaks | Removed children may retain references |
| Value setting overhead | Latency | Props flow through Stencil's proxy layer |

### 2.3 Proposed Architecture

#### Layer 1: Functional Component (Core Logic)

```tsx
// packages/core/src/components/lf-textfield/lf-textfield-fc.tsx
import { FunctionalComponent, h } from "@stencil/core";

export interface LfTextfieldFCProps {
  // Required: framework for theming/utilities
  framework: LfFramework;
  
  // All "lf*" props become regular props
  value: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: string;
  
  // Event handlers (callbacks, not CustomEvents)
  onInput?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  
  // Refs for parent access
  inputRef?: (el: HTMLInputElement) => void;
}

export const LfTextfieldFC: FunctionalComponent<LfTextfieldFCProps> = (props) => {
  const { framework, value, label, onInput, inputRef } = props;
  const { theme } = framework;
  const bemClass = theme.bemClass;
  
  return (
    <div class={bemClass("textfield", null)}>
      {label && <label class={bemClass("textfield", "label")}>{label}</label>}
      <input
        class={bemClass("textfield", "input")}
        value={value}
        onInput={(e) => onInput?.((e.target as HTMLInputElement).value)}
        ref={inputRef}
      />
    </div>
  );
};
```

#### Layer 2: Web Component (Thin Wrapper)

```tsx
// packages/core/src/components/lf-textfield/lf-textfield.tsx
@Component({ tag: "lf-textfield", shadow: true, styleUrl: "lf-textfield.scss" })
export class LfTextfield {
  // State lives HERE, in the Web Component
  @State() value = "";
  
  @Prop() lfLabel?: string;
  @Prop() lfPlaceholder?: string;
  @Prop() lfDisabled?: boolean;
  
  @Event() lfEvent: EventEmitter<LfTextfieldEventPayload>;
  
  #framework: LfFramework;
  
  render() {
    // Web Component is just a wrapper that:
    // 1. Holds state
    // 2. Passes props to FC
    // 3. Converts FC callbacks to CustomEvents
    return (
      <LfTextfieldFC
        framework={this.#framework}
        value={this.value}
        label={this.lfLabel}
        placeholder={this.lfPlaceholder}
        disabled={this.lfDisabled}
        onInput={(v) => {
          this.value = v;
          this.lfEvent.emit({ eventType: "input", value: v });
        }}
      />
    );
  }
}
```

#### Layer 3: Shape Rendering (Always FC)

```tsx
// packages/core/src/shapes/shapes.tsx
// Shapes ALWAYS use FC, never instantiate Web Components

const renderShape = (cell: LfDataCell, framework: LfFramework, handlers: ShapeHandlers) => {
  switch (cell.shape) {
    case "textfield":
      return (
        <LfTextfieldFC
          framework={framework}
          value={cell.value}
          label={cell.lfLabel}
          onInput={handlers.onInput}  // Parent handles state
        />
      );
    case "slider":
      return (
        <LfSliderFC
          framework={framework}
          value={cell.value}
          min={cell.lfMin}
          max={cell.lfMax}
          onChange={handlers.onChange}
        />
      );
    // ... all shapes use FCs
  }
};
```

### 2.4 Component Categorization

| Category | FC Only | WC + FC | Notes |
|----------|---------|---------|-------|
| **Input Controls** | | ✅ | slider, textfield, toggle, checkbox, radio, select |
| **Display** | | ✅ | badge, chip, button, card, image, icon |
| **Complex Stateful** | | ✅ | chat, messenger, tree, masonry |
| **Layout** | | ✅ | accordion, drawer, tabbar |
| **Internal Only** | ✅ | | Shapeeditor controls, internal decorations |

### 2.5 Implementation Pattern

#### File Structure (per component)

```plaintext
lf-textfield/
├── lf-textfield.tsx           # Web Component (thin wrapper)
├── lf-textfield-fc.tsx        # Functional Component (core logic)
├── lf-textfield.scss          # Styles (shared)
├── lf-textfield-adapter.ts    # Adapter (for WC only)
├── elements.textfield.tsx     # JSX helpers
└── handlers.textfield.ts      # Event handlers
```

#### FC Props Convention

```typescript
// All FC props follow this pattern:
interface Lf<Component>FCProps {
  // Required
  framework: LfFramework;
  
  // Props (no "lf" prefix in FC)
  value: T;
  label?: string;
  disabled?: boolean;
  // ...
  
  // Callbacks (not events)
  onChange?: (value: T) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  
  // Optional refs
  ref?: (el: HTMLElement) => void;
}
```

### 2.6 Styling Strategy

FCs don't have Shadow DOM, so their styles must be adopted into parent shadow roots via `GLOBAL_STYLES`. This is handled automatically by `theme.register()`.

#### 2.6.1 FC Style Architecture

```
packages/core/src/style/
├── global.scss              # Includes all FC styles
├── mixins/
│   ├── _fcomponents.scss    # FIcon and other utility FCs
│   ├── _fc-form-field.scss  # Shared form wrapper (ALL form FCs)
│   ├── _fc-slider.scss      # Slider-specific styles
│   ├── _fc-textfield.scss   # Textfield-specific (future)
│   └── _fc-toggle.scss      # Toggle-specific (future)
```

#### 2.6.2 Shared Form Field Pattern

**Critical Insight**: All form-based FCs (slider, textfield, toggle, checkbox, radio, select) share a common `.form-field` wrapper. This is centralized in `_fc-form-field.scss`:

```scss
// _fc-form-field.scss - ONE source of truth for ALL form FCs
.form-field {
  align-items: center;
  box-sizing: border-box;
  color: var(--lf-form-color-on-bg, var(--lf-color-on-bg));
  display: inline-flex;
  font-family: var(--lf-form-font-family, var(--lf-font-family-label));
  gap: var(--lf-form-gap, 0.5em);
  // ... common form styling
  
  &__label { /* Shared label styling */ }
  &--leading { /* Label-first modifier */ }
  &--disabled { /* Disabled state */ }
  &--error { /* Error state */ }
  &--success { /* Success state */ }
}
```

**Benefits**:

- **Consistency**: All forms look and behave identically
- **Smaller bundle**: No duplication of `.form-field` across FCs
- **Single theming surface**: `--lf-form-*` variables control all forms
- **Easy maintenance**: Fix once, applies everywhere

#### 2.6.3 Component-Specific Styles

Each FC has its own partial for component-specific styling:

```scss
// _fc-slider.scss - Slider-specific ONLY
.slider {
  &__track { ... }
  &__thumb { ... }
  &__value { ... }
  &__native-control { ... }
}
// Note: Does NOT include .form-field (comes from shared partial)
```

#### 2.6.4 CSS Custom Properties

FC styles use two naming conventions:

| Convention | Example | Scope |
|------------|---------|-------|
| `--lf-form-*` | `--lf-form-padding` | Shared across ALL form FCs |
| `--lf-<comp>-*` | `--lf-slider-thumb-height` | Component-specific |

#### 2.6.5 Global Style Inclusion

All FC styles are included via `global.scss`:

```scss
// global.scss
@use "./mixins/fcomponents";      // FIcon, etc.
@use "./mixins/fc-form-field";    // Shared form wrapper
@use "./mixins/fc-slider";        // Slider-specific
// @use "./mixins/fc-textfield";  // Future
// @use "./mixins/fc-toggle";     // Future
```

This generates `GLOBAL_STYLES` which is adopted into all shadow roots.

### 2.7 Benefits

| Metric | Current (WC only) | Proposed (WC + FC) |
|--------|-------------------|---------------------|
| Shapeeditor with 10 controls | 10 Shadow DOMs | 1 Shadow DOM |
| Memory per control instance | ~5KB | ~0.5KB |
| Event latency | CustomEvent dispatch | Direct callback |
| State sync complexity | Bidirectional | Unidirectional (parent owns) |
| Bundle size (composed) | Full WC × N | FC code shared |
| Detached element risk | High | None (no refs held) |

### 2.8 Migration Path

**Phase 1**: Create FC versions alongside existing WCs

- No breaking changes
- FCs are internal-only initially

**Phase 2**: Refactor WCs to use FCs internally

- WCs become thin wrappers
- Public API unchanged

**Phase 3**: Update `LfShape` to use FCs

- Shapes render via FC, not WC tag
- Major performance improvement

**Phase 4**: Export FCs for advanced users

- Optional: expose FCs in public API
- For users building custom compositions

### 2.9 Challenges & Mitigations

| Challenge | Mitigation |
|-----------|------------|
| SCSS duplication | Shared partials, adopted stylesheets |
| Two APIs to maintain | FC is source of truth, WC wraps it |
| Testing both modes | FC unit tests, WC integration tests |
| Documentation | Document FC props, WC adapts automatically |
| Ripple effects | FC accepts ripple ref, parent triggers effect |

### 2.10 Lessons Learned

Critical insights from the FC migration process:

#### 2.10.1 Preserve `@prop` JSDoc Comments

**Problem**: When migrating SCSS from WC to FC partials, `@prop` JSDoc comments were accidentally lost. These comments are **required** for README documentation generation.

**Original WC pattern**:

```scss
// In lf-slider.scss (WC)
/**
 * @prop --lf-slider-padding: Sets the padding for the slider component.
 *                            Defaults to => 2em
 */
padding: var(--lf-#{$comp}-padding, 2em 0.5em);
```

**Correct FC pattern** (must preserve comments):

```scss
// In _fc-slider.scss (FC partial)
/**
 * @prop --lf-slider-margin: Sets the margin for the slider component.
 *                           Defaults to => 0 0.75em
 */
margin: var(--lf-slider-margin, 0 0.75em);
```

**Lesson**: Always copy `@prop` comments verbatim when migrating styles. These populate the component's CSS custom properties documentation in the README.

#### 2.10.2 Positioned Children Require Positioned Parents

**Problem**: Removing `position: relative` from `.slider` caused `.slider__native-control` (which uses `position: absolute`) to misalign, positioning relative to the nearest positioned ancestor instead.

**Lesson**: When using flex layout with absolutely positioned children, ensure the flex container has `position: relative`:

```scss
.slider {
  display: flex;
  flex-direction: column;
  position: relative;  // REQUIRED for absolute children!
  // ...
  
  &__native-control {
    position: absolute;  // Positions relative to .slider
    top: 0;
    left: 0;
    // ...
  }
}
```

#### 2.10.3 Avoid Layout Hacks

**Problem**: Initial fix for value display overflow used `overflow: visible` on `.form-field` — a band-aid that didn't address root cause.

**Better Solution**: Proper flex layout with natural document flow:

```scss
// ❌ Band-aid fix
.form-field {
  overflow: visible;  // Allows overflow but bounding box is wrong
}

// ✅ Proper fix - use flex layout
.slider {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  
  &__track { order: 0; }  // Track first
  &__value { order: 1; text-align: center; }  // Value naturally flows below
}
```

**Lesson**: When elements overflow their containers, restructure the layout rather than allowing overflow. Proper flow ensures correct bounding boxes and predictable behavior.

#### 2.10.4 FC State/Size Props (Not CSS Cascade)

**Problem**: WCs use CSS-based state colors (`data-lf` attribute + `lf-fw-state-colors` mixin) and size scaling (`:host([lf-ui-size])` selector). This doesn't work for FCs because:

1. **Portals break DOM hierarchy** - portaled content lives outside the cascade
2. **Shadow boundaries** can interfere with CSS variable inheritance
3. **Composed FCs** (e.g., AutocompleteFC → TextfieldFC + ListFC) need explicit state propagation

**Solution**: FCs require explicit `uiState` and `uiSize` props:

```tsx
interface LfSliderFCProps {
  // ... other props
  uiState?: LfThemeUIState;  // "primary" | "success" | "danger" | etc.
  uiSize?: LfThemeUISize;    // "small" | "medium" | "large" | etc.
}

// FC applies these to root element:
<div
  class="form-field"
  data-lf={uiState}
  style={{ "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }}
>
```

**CSS Variable Fallback Chain**:

```scss
// FC SCSS uses 3-level fallback:
background-color: rgba(
  var(
    --lf-slider-color-primary,                    // 1. Component override
    var(--lf-fc-color-primary, var(--lf-color-primary))  // 2. FC state, 3. Global
  ),
  ...
);

// _fc-states.scss defines FC state colors:
[data-lf="success"] {
  --lf-fc-color-primary: var(--lf-color-success);
}
```

**Parent must propagate state to children (including portaled)**:

```tsx
// AutocompleteFC with error state
<AutocompleteFC uiState="error">
  <TextfieldFC uiState={uiState} />  // Explicit pass
  {framework.portal.render(
    <ListFC uiState={uiState} />,    // Portal also needs explicit state!
    container
  )}
</AutocompleteFC>
```

**Lesson**: CSS cascade is unreliable for composed FCs. Always use explicit props for state/size propagation. This is actually a benefit: predictable, type-safe, works with portals.

#### 2.10.5 Size Multiplier Pattern (Critical!)

**Problem**: The `--lf-ui-size-*` variables are **multipliers** (0.65 to 1.35), not font sizes. Using them directly as font-size produces tiny text.

**Wrong**:
```scss
font-size: var(--lf-fc-ui-size, var(--lf-font-size));  // 0.75 ≠ 0.75em!
```

**Correct**: Multiply base font-size by the multiplier:
```scss
font-size: calc(var(--lf-button-font-size, 0.775em) * var(--lf-fc-ui-size, 1));
```

**See**: WC_FC_MIGRATION_GUIDE.md Section 7.7 for full details.

#### 2.10.6 Ripple on Covered Elements

**Problem**: Native inputs covering ripple hosts (for accessibility) intercept `pointerdown` events.

**Solution**: Use `framework.effects.trigger.ripple(element, event)` to manually trigger ripple from the input's handler.

**See**: WC_FC_MIGRATION_GUIDE.md Section 7.8 for implementation details.

#### 2.10.7 Ripple Host Position Override

**Problem**: `[data-lf-ripple-host] { position: relative }` can override `position: absolute` on thumb underlays.

**Solution**: Use higher specificity: `&[data-lf-ripple-host] { position: absolute; }`

**See**: WC_FC_MIGRATION_GUIDE.md Section 7.9 for details.

### 2.11 Proof of Concept Priority

Start with these components (good FC candidates):

1. **lf-slider** - Stateless, just value + callbacks
2. **lf-toggle** - Binary state, simple
3. **lf-textfield** - Most commonly composed
4. **lf-button** - Simple, high usage in compositions
5. **lf-badge** - Pure display, no state

**Complexity**: High  
**Priority**: P1 (Architectural, Major Performance Impact)

---

## 3. Component Boilerplate Reduction

### 3.1 Repeated Lifecycle Pattern

> **Status**: ⏸️ DEFERRED - Stencil's class transformation makes traditional mixins unreliable. Each component interweaves common lifecycle code with component-specific logic. The boilerplate is small (3-4 lines per hook) and extracting it would require significant restructuring with minimal gain.

**Problem**: All 39 components repeat identical lifecycle code.

```typescript
// Repeated in EVERY component
async connectedCallback() {
  this.#framework = await awaitFramework();
  this.#framework.theme.register(this);
}

disconnectedCallback() {
  this.#framework?.theme.unregister(this);
}
```

**Proposed Solution**: Base mixin or decorator.

```typescript
// Option A: Mixin function
export function withLfLifecycle<T extends ComponentClass>(Base: T) {
  return class extends Base {
    #framework: LfFramework;
    
    async connectedCallback() {
      this.#framework = await awaitFramework();
      this.#framework.theme.register(this);
      super.connectedCallback?.();
    }
    
    disconnectedCallback() {
      this.#framework?.theme.unregister(this);
      super.disconnectedCallback?.();
    }
  };
}

// Option B: Stencil lifecycle decorator (if supported)
@LfComponent({ tag: 'lf-button', shadow: true })
export class LfButton { ... }
```

**Why Deferred**:

1. Stencil class transformation makes mixins unreliable
2. Each component has unique lifecycle logic alongside common parts
3. The boilerplate is small (3-4 lines) but interwoven with component-specific code
4. Risk/benefit ratio unfavorable for current architecture

**Files Affected**: All 39 component `.tsx` files  
**Complexity**: Medium  
**Priority**: P3 (Demoted from P1)

---

### 3.2 Event Emitter Boilerplate

**Problem**: Identical `@Event()` decorator config repeated 39 times.

```typescript
// Every component has this exact pattern
@Event({ eventName: "lf-button-event", ... })
lfEvent: EventEmitter<LfButtonEventPayload>;
```

**Proposed Solution**: Factory function or typed base.

```typescript
// Proposed: Generic event factory
function createLfEvent<T>(eventName: string) {
  return Event({
    eventName,
    composed: true,
    cancelable: false,
    bubbles: true,
  });
}
```

**Complexity**: Low  
**Priority**: P3 (Minor DRY improvement)

---

### 3.3 Manual Props Array Maintenance

**Problem**: Each component manually maintains a `PROPS` array that must sync with interface.

```typescript
// Must manually keep in sync with interface
const LF_BUTTON_PROPS = [
  "lfDisabled",
  "lfIcon", 
  "lfLabel",
  // ... easy to miss one
];
```

**Proposed Solution**: Generate from TypeScript interface using build-time script.

```typescript
// Build-time extraction from interface
// Input: LfButtonPropsInterface
// Output: const LF_BUTTON_PROPS = ["lfDisabled", "lfIcon", "lfLabel", ...];
```

**Files Affected**: Build scripts, component constants  
**Complexity**: Medium  
**Priority**: P2 (Automation, Error Prevention)

---

## 4. Type System Consolidation

### 4.1 Repeated Type Maps

> **Status**: ✅ DONE (December 2024)
>
> **Implementation**: Created `LF_COMPONENTS` constant in `components.constants.ts` as single source of truth. Derived types (`LfComponentName`, `LfComponentTagMap`, `LfComponentReverseTagMap`, `LfComponentKey`, `LfComponentEventName`, `LfComponentTagName`) are now computed from this constant using mapped types.

**Problem**: `components.declarations.ts` contains 6+ maps with 39 entries each.

```typescript
// All have identical 39 entries, different value types
type LfComponentTag = "lf-accordion" | "lf-autocomplete" | ...;
type LfComponentName = "LfAccordion" | "LfAutocomplete" | ...;
type LfComponentEventName = "lf-accordion-event" | "lf-autocomplete-event" | ...;

interface LfComponentPropsMap {
  "lf-accordion": LfAccordionPropsInterface;
  "lf-autocomplete": LfAutocompletePropsInterface;
  // ... 37 more
}

interface LfComponentElementMap {
  "lf-accordion": HTMLLfAccordionElement;
  // ... 38 more
}
```

**Implemented Solution**: Single source of truth with derived types.

```typescript
// Single definition in components.constants.ts
export const LF_COMPONENTS = {
  accordion: {
    name: "LfAccordion",
    tag: "lf-accordion",
    eventName: "lf-accordion-event",
  },
  // ... 38 more
} as const;

// Derived types (computed, not manually maintained)
export type LfComponentKey = keyof typeof LF_COMPONENTS;
export type LfComponentName = (typeof LF_COMPONENTS)[LfComponentKey]["name"];
export type LfComponentTagName = (typeof LF_COMPONENTS)[LfComponentKey]["tag"];
export type LfComponentEventName = (typeof LF_COMPONENTS)[LfComponentKey]["eventName"];

// In components.declarations.ts - derived mapped types
export type LfComponentTagMap = {
  [K in LfComponentKey as (typeof LF_COMPONENTS)[K]["name"]]: (typeof LF_COMPONENTS)[K]["tag"];
};
export type LfComponentReverseTagMap = {
  [K in LfComponentKey as (typeof LF_COMPONENTS)[K]["tag"]]: (typeof LF_COMPONENTS)[K]["name"];
};
```

**Files Changed**:

- `packages/foundations/src/foundations/components.constants.ts` - Added `LF_COMPONENTS` constant and derived union types
- `packages/foundations/src/foundations/components.declarations.ts` - Derived `LfComponentTagMap` and `LfComponentReverseTagMap` from constant

**Lines Removed**: ~160 lines of manual type entries replaced with computed types
**Complexity**: Medium  
**Priority**: P1 (Major DRY, Single Source of Truth)

---

### 4.2 Props Interface Inheritance

**Problem**: Common props duplicated across 30+ interfaces.

```typescript
// Repeated in many interfaces
interface LfButtonPropsInterface {
  lfStyle?: LfStyle;
  lfUiSize?: LfComponentUiSize;
  lfUiState?: LfUiState;
  // ... component-specific props
}

interface LfChipPropsInterface {
  lfStyle?: LfStyle;  // Duplicate
  lfUiSize?: LfComponentUiSize;  // Duplicate
  lfUiState?: LfUiState;  // Duplicate
  // ... component-specific props
}
```

**Proposed Solution**: Base interface with extension.

```typescript
// Base interface
interface LfBasePropsInterface {
  lfStyle?: LfStyle;
  lfUiSize?: LfComponentUiSize;
  lfUiState?: LfUiState;
}

// Extended interfaces
interface LfButtonPropsInterface extends LfBasePropsInterface {
  lfDisabled?: boolean;
  lfIcon?: string;
  lfLabel?: string;
}
```

**Files Affected**: All component declaration files in `packages/foundations/`  
**Complexity**: Low  
**Priority**: P2 (DRY, Maintainability)

---

## 5. Adapter Pattern Standardization

> **Status**: HOLY BIBLE - This section defines the canonical adapter architecture for v4.0.0+
>
> **Breaking Changes**: Yes - All existing adapters must be migrated
>
> **Philosophy**: "Consistency beats pragmatism in an AI-assisted codebase"

---

### 5.1 Base Interface Overhaul

**Problem**: The base `LfComponentAdapterGetters` only requires `compInstance`, but EVERY component needs:

- `blocks` - BEM class structure
- `cyAttributes` - Cypress testing attributes  
- `framework` (renamed from `manager`) - Framework services
- `ids` - Element IDs
- `lfAttributes` - Library attributes
- `parts` - CSS ::part() names

**Current State (Inconsistent)**:

```typescript
// Current base - only compInstance required
export type LfComponentAdapterGetters<C extends LfComponent, I = C> = {
  [key: string]: unknown;
  compInstance: I;  // Only this is enforced!
};

// Every component manually redeclares the same 6 getters:
interface LfButtonAdapterControllerGetters extends LfComponentAdapterGetters<...> {
  blocks: () => typeof LF_BUTTON_BLOCKS;      // Manual
  compInstance: () => LfButtonInterface;      // Manual
  cyAttributes: () => typeof CY_ATTRIBUTES;   // Manual
  ids: () => typeof LF_BUTTON_IDS;            // Manual
  lfAttributes: () => typeof LF_ATTRIBUTES;   // Manual
  manager: () => LfFrameworkInterface;        // Manual (wrong name!)
  parts: () => typeof LF_BUTTON_PARTS;        // Manual
  // ... component-specific getters
}
```

**Proposed Solution**: Promote common getters to base type with generics.

```typescript
/**
 * Base adapter getters - ALL adapters get these automatically.
 * 
 * @template C - Component interface
 * @template Blocks - typeof LF_<COMP>_BLOCKS 
 * @template Ids - typeof LF_<COMP>_IDS
 * @template Parts - typeof LF_<COMP>_PARTS
 */
export interface LfComponentAdapterGetters<
  C extends LfComponent,
  Blocks extends Record<string, unknown> = Record<string, unknown>,
  Ids extends Record<string, unknown> = Record<string, unknown>,
  Parts extends Record<string, unknown> = Record<string, unknown>,
> {
  /** BEM block structure for this component */
  blocks: () => Blocks;
  /** Live component instance accessor */
  compInstance: () => C;
  /** Cypress testing attributes */
  cyAttributes: () => typeof CY_ATTRIBUTES;
  /** Framework services (theme, data, effects, etc.) - RENAMED from manager */
  framework: () => LfFrameworkInterface;
  /** Component element IDs */
  ids: () => Ids;
  /** LF library attributes */
  lfAttributes: () => typeof LF_ATTRIBUTES;
  /** CSS ::part() names for external styling */
  parts: () => Parts;
}

// Component-specific getters ONLY need extras:
interface LfButtonAdapterControllerGetters extends LfComponentAdapterGetters<
  LfButtonInterface,
  typeof LF_BUTTON_BLOCKS,
  typeof LF_BUTTON_IDS,
  typeof LF_BUTTON_PARTS
> {
  // ONLY component-specific getters here!
  isDisabled: () => boolean;
  isDropdown: () => boolean;
  isOn: () => boolean;
  styling: () => LfButtonStyling;
}
```

**Key Change**: Rename `manager` → `framework` throughout. Clearer semantics.

**Files Affected**:

- `packages/foundations/src/foundations/adapter.declarations.ts`
- All 38 component declaration files
- All adapter implementation files

**Complexity**: High (many files)
**Priority**: P0 (Foundational)

---

### 5.2 Standardize All Getters as Functions

**Problem**: Massive inconsistency across components.

| Component | `blocks` | `framework` | `compInstance` |
|-----------|----------|-------------|----------------|
| button | `() => typeof` ✅ | `() => LfFrameworkInterface` ✅ | `() => LfButtonInterface` ✅ |
| badge | `typeof` ❌ | `LfFrameworkInterface` ❌ | `LfBadgeInterface` ❌ |
| tree | `typeof` ❌ | `LfFrameworkInterface` ❌ | `LfTreeInterface` ❌ |
| chat | `typeof` ❌ | `LfFrameworkInterface` ❌ | `LfChatInterface` ❌ |
| breadcrumbs | `typeof` ❌ | `() => LfFrameworkInterface` ✅ | via base |

**Canonical Rule**: ALL getters are functions `() => T`.

**Rationale**:

1. **Consistency** - Same API everywhere
2. **Dynamic capture** - Functions capture current state at call time
3. **Testability** - Easy to mock functions
4. **Future-proof** - "Static" values may become dynamic later

```typescript
// ✅ CORRECT: All getters are functions
controller: {
  get: {
    blocks: () => LF_BUTTON_BLOCKS,
    compInstance: () => this,
    cyAttributes: () => CY_ATTRIBUTES,
    framework: () => this.#framework,
    ids: () => LF_BUTTON_IDS,
    lfAttributes: () => LF_ATTRIBUTES,
    parts: () => LF_BUTTON_PARTS,
    // Component-specific:
    isDisabled: () => this.lfUiState === "disabled",
  },
}

// ❌ WRONG: Mixed direct values and functions
controller: {
  get: {
    blocks: LF_BUTTON_BLOCKS,           // Direct - NO!
    compInstance: this,                  // Direct - NO!
    framework: () => this.#framework,    // Function - yes
  },
}
```

**Files Affected**: All component declarations + implementations
**Complexity**: Medium
**Priority**: P0 (Consistency)

---

### 5.3 Eliminate Initializer Types (REMOVED)

**Problem**: `*AdapterInitializerGetters` and `*AdapterInitializerSetters` types are redundant boilerplate.

```typescript
// Current: 20+ lines of Pick<> per component
export type LfButtonAdapterInitializerGetters = Pick<
  LfButtonAdapterControllerGetters,
  | "blocks"
  | "compInstance"
  | "cyAttributes"
  | "ids"
  | "isDisabled"
  | "isDropdown"
  | "isOn"
  | "lfAttributes"
  | "manager"
  | "parts"
  | "styling"
>;

export type LfButtonAdapterInitializerSetters = Pick<
  LfButtonAdapterControllerSetters,
  "list"
>;
```

**Reality Check**:

- Components pass ALL getters anyway
- No component uses "partial initialization"
- The distinction adds cognitive overhead
- 40+ lines of boilerplate per component

**Decision**: **REMOVE** all `*AdapterInitializerGetters` and `*AdapterInitializerSetters` types.

**New Pattern**: Pass full interfaces directly.

```typescript
// BEFORE: Redundant initializer types
export const createAdapter = (
  getters: LfButtonAdapterInitializerGetters,  // Pick<...>
  setters: LfButtonAdapterInitializerSetters,  // Pick<...>
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapter => { ... };

// AFTER: Direct interfaces, inline definition
this.#adapter = {
  controller: {
    get: {
      // Base getters (type-enforced by base interface)
      blocks: () => this.#b,
      compInstance: () => this,
      cyAttributes: () => CY_ATTRIBUTES,
      framework: () => this.#framework,
      ids: () => this.#ids,
      lfAttributes: () => LF_ATTRIBUTES,
      parts: () => this.#p,
      // Component-specific
      isDisabled: () => this.lfUiState === "disabled",
      isDropdown: () => Boolean(this.lfDataset?.nodes?.[0]?.children?.length),
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

**Benefits**:

- Removes ~40 lines per component declaration
- No more syncing Pick<> lists with interface changes
- Code delocalization still achieved via `prep*()` imports
- Type safety from base interface, not manual picks

**Files Affected**: All `*.declarations.ts` files in foundations
**Complexity**: Low (deletion!)
**Priority**: P0 (Cleanup)

---

### 5.4 Controller Domain Separation (NEW)

**Problem**: Getters and setters have been used for more than just getting and setting.

**Audit of Complex Components**:

| Pattern | Example | Should Be |
|---------|---------|-----------|
| Simple state read | `filterValue: () => string` | **get** ✅ |
| Simple state write | `setFilterValue: (v) => void` | **set** ✅ |
| Computed predicate | `isExpanded: (node) => boolean` | **computed** |
| Object builder | `options.basic: () => EChartsOption` | **computed** |
| Multi-step action | `history.new: (shape) => void` | **actions** |
| UI state machine | `ui.panel: (p, v?) => boolean` | **actions** |
| Navigation logic | `character.next: () => Character` | **actions** |

**Current Mess (tree.declarations.ts)**:

```typescript
// Getters mixing state reads + predicates
interface LfTreeAdapterControllerGetters {
  filterValue: () => string;           // State read ✅
  isExpanded: (node) => boolean;       // Predicate - wrong place!
  isHidden: (node) => boolean;         // Predicate - wrong place!
  canSelectNode: (node) => boolean;    // Predicate - wrong place!
}

// Setters mixing assignments + actions
interface LfTreeAdapterControllerSetters {
  filter: {
    setValue: (value) => void;         // Setter ✅
    apply: (value) => void;            // Action - wrong place!
  };
  state: {
    expansion: {
      toggle: (node) => void;          // Action - wrong place!
      setNodes: (nodes) => void;       // Setter ✅
    };
  };
}
```

**Proposed Solution**: Four controller domains.

```typescript
export interface LfComponentAdapter<...> {
  controller: {
    /** Pure state accessors - read current values */
    get: CGet;
    /** Simple state mutations - single value assignments */
    set?: CSet;
    /** Derived/computed values - predicates, builders, factories */
    computed?: CComputed;
    /** Complex operations - multi-step logic, async, side effects */
    actions?: CActions;
  };
  dispatcher: LfComponentAdapterDispatcher<Payload>;
  elements: { jsx: J; refs: R; };
  handlers?: H;
}
```

**Domain Definitions**:

| Domain | Purpose | Returns | Side Effects | Example |
|--------|---------|---------|--------------|---------|
| `get` | Read current state | Value | None | `filterValue()`, `dataset()` |
| `set` | Write single value | void | Single assignment | `setFilterValue(v)` |
| `computed` | Derive from state | Value | None | `isExpanded(node)`, `canSelect(node)` |
| `actions` | Complex operations | void or result | Multiple changes | `toggleExpand(node)`, `applyFilter()` |

**Applied to Tree (Clean)**:

```typescript
interface LfTreeAdapterController {
  get: {
    dataset: () => LfDataDataset;
    expandedIds: () => string[];
    selectedIds: () => string[];
    filterValue: () => string;
  };
  
  set: {
    expandedIds: (ids: string[]) => void;
    selectedIds: (ids: string[]) => void;
    filterValue: (value: string) => void;
  };
  
  computed: {
    isExpanded: (node: LfDataNode) => boolean;
    isHidden: (node: LfDataNode) => boolean;
    canSelectNode: (node: LfDataNode) => boolean;
    visibleNodes: () => LfDataNode[];
  };
  
  actions: {
    expansion: {
      toggle: (node: LfDataNode) => void;
      expandAll: () => void;
      collapseAll: () => void;
    };
    selection: {
      select: (node: LfDataNode) => void;
      clear: () => void;
    };
    filter: {
      apply: (value: string) => void;
    };
  };
}
```

**Applied to Chart (Clean)**:

```typescript
interface LfChartAdapterController {
  get: {
    compInstance: () => LfChartInterface;
    framework: () => LfFrameworkInterface;
    // Simple state reads only
  };
  
  set: {
    // Simple assignments only
  };
  
  computed: {
    // Predicates and derived values
    mappedType: (type: LfChartType) => SeriesOption["type"];
    seriesData: () => LfChartSeriesData[];
    columnById: (id: string) => LfDataColumn;
    
    // Builders/factories - they compute complex objects
    options: {
      basic: () => EChartsOption;
      bubble: () => EChartsOption;
      calendar: () => EChartsOption;
      // ...
    };
    style: {
      axis: (type: LfChartAxesTypes) => AxisOption;
      theme: () => LfChartAdapterThemeStyle;
      // ...
    };
  };
  
  actions: {
    // Complex operations (if any)
  };
}
```

**Mandatory Categorization**:

In an AI-assisted codebase, **consistency beats pragmatism**. When agents scaffold new components, they find similar existing components, copy the structure, and adapt to new requirements. If operations are inconsistently categorized, agents produce inconsistent output.

**Rule**: Operations MUST be placed in the correct domain based on their behavior:

| Operation Type | Domain | Rationale |
|----------------|--------|-----------|
| Pure state read | `get` | No side effects, returns current value |
| Single assignment | `set` | One state change, void return |
| Derived value / predicate | `computed` | Computes from state, no side effects |
| Multi-step / toggle / batch | `actions` | Multiple changes, may have side effects |

**Not "optional"**: A component may not *have* any predicates (no `computed`) or multi-step operations (no `actions`), but if it DOES have them, they MUST go in the correct domain. The domains exist for all components; some may simply be empty.

**Files Affected**: Complex component declarations (chart, messenger, chat, shapeeditor, tree, list)
**Complexity**: Medium
**Priority**: P0 (Consistency is foundational)

---

### 5.5 Dispatcher as Mandatory Domain

**Problem**: Event emission is scattered with direct `this.lfEvent.emit()` calls.

```typescript
// Current: Direct emit scattered throughout component
onButtonClick() {
  this.lfEvent.emit({ 
    eventType: "click", 
    id: this.rootElement.id, 
    comp: this,
    value: this.value,
    valueAsBoolean: this.value === "on",
  });
}

// Problems:
// 1. Repeated boilerplate per event
// 2. No central debug logging
// 3. Easy to miss required fields
// 4. Inconsistent payload structure
```

**Solution**: `dispatcher` becomes a **required** adapter domain.

```typescript
// Canonical adapter structure
export interface LfComponentAdapter<
  C extends LfComponent,
  Payload extends LfEventPayload = LfEventPayload,
  // ...other generics
> {
  controller: { get: CGet; set?: CSet; computed?: CComputed; actions?: CActions; };
  dispatcher: LfComponentAdapterDispatcher<Payload>;  // REQUIRED!
  elements: { jsx: J; refs: R; };
  handlers?: H;
}

// Dispatcher interface
export interface LfComponentAdapterDispatcher<P extends LfEventPayload> {
  emit: <E extends P["eventType"]>(
    eventType: E,
    detail?: Partial<Omit<P, "comp" | "eventType" | "id">>,
  ) => void;
}
```

**Implementation Pattern**:

```typescript
// In component's #initAdapter()
dispatcher: {
  emit: (eventType, detail) => {
    // Optional: Debug logging
    this.#framework.debug?.logs.new(
      this,
      `Event: ${eventType}`,
      "informational",
    );
    
    // Emit with guaranteed structure
    this.lfEvent.emit({
      comp: this,
      eventType,
      id: this.rootElement.id,
      ...detail,
    });
  },
},
```

**Usage in Elements/Handlers**:

```typescript
// Clean, consistent event emission
<button
  onBlur={(e) => dispatcher.emit("blur", { originalEvent: e })}
  onClick={(e) => dispatcher.emit("click", { originalEvent: e })}
  onFocus={(e) => dispatcher.emit("focus", { originalEvent: e })}
  onPointerDown={(e) => dispatcher.emit("pointerdown", { originalEvent: e })}
>
```

**Benefits**:

| Aspect | Before | After |
|--------|--------|-------|
| Boilerplate per emit | ~80 chars | ~40 chars |
| Debug logging | Manual, inconsistent | Automatic, centralized |
| Payload validation | None | Type-enforced |
| Cross-cutting concerns | Impossible | Easy (analytics, etc.) |

**Files Affected**: All components
**Complexity**: Medium
**Priority**: P0 (Required for consistency)

---

### 5.6 All Adapters Must Extend Base Interface

**Problem**: Some adapters extend `LfComponentAdapter`, others don't.

```typescript
// ✅ CORRECT: Extends base
export interface LfButtonAdapter extends LfComponentAdapter<
  LfButtonInterface,
  LfButtonAdapterHandlers,
  LfButtonAdapterJsx,
  LfButtonAdapterRefs,
  LfButtonAdapterControllerGetters,
  LfButtonAdapterControllerSetters
> { ... }

// ❌ WRONG: Raw interface, no base
export interface LfListAdapter {
  controller: { ... };
  elements: { ... };
  handlers: { ... };
}
```

**Decision**: ALL adapters MUST extend `LfComponentAdapter`.

```typescript
// Canonical adapter declaration
export interface Lf<Comp>Adapter extends LfComponentAdapter<
  Lf<Comp>Interface,
  Lf<Comp>EventPayload,
  Lf<Comp>AdapterHandlers,
  Lf<Comp>AdapterJsx,
  Lf<Comp>AdapterRefs,
  Lf<Comp>AdapterControllerGetters,
  Lf<Comp>AdapterControllerSetters,
  Lf<Comp>AdapterControllerComputed,  // Optional
  Lf<Comp>AdapterControllerActions,    // Optional
> {
  // Only override if needed, base provides structure
}
```

**Files Affected**: autocomplete, list, multiinput, radio, select declarations
**Complexity**: Low
**Priority**: P1 (Type safety)

---

### 5.7 Explicit Null in Refs

**Problem**: `LfComponentAdapterRefs` allows `null` via recursion but doesn't make it explicit.

```typescript
// Current: null sneaks in via recursion
export type LfComponentAdapterRefs = {
  [key: string]:
    | Map<string, HTMLElement>
    | HTMLElement
    | LfComponentAdapterRefs;  // Recursive, but null?
};

// Actual usage: refs start as null
refs: {
  button: null,  // Assigned later via ref callback
  list: null,
}
```

**Solution**: Explicit `null` in union.

```typescript
export type LfComponentAdapterRefs = {
  [key: string]:
    | Map<string, HTMLElement>
    | HTMLElement
    | null  // EXPLICIT!
    | LfComponentAdapterRefs;
};
```

**Files Affected**: `adapter.declarations.ts`
**Complexity**: Trivial
**Priority**: P2 (Type clarity)

---

### 5.8 Adapter-Everywhere Philosophy

**Decision**: Every component MUST have an adapter, regardless of complexity.

**Current State**: ✅ ALL 39 components have v4.0.0 compliant adapters!

| All Components with Adapters (39) |
|-----------------------------------|
| accordion, article, autocomplete, badge, breadcrumbs |
| button, canvas, card, carousel, chart |
| chat, checkbox, chip, code, compare |
| drawer, header, image, list, masonry |
| messenger, multiinput, photoframe, placeholder, progressbar |
| radio, select, shapeeditor, slider, snackbar |
| spinner, splash, tabbar, textfield, toast |
| toggle, tree, typewriter, upload |

**Rationale**: In an AI-assisted codebase, **consistency beats pragmatism**.

When agents scaffold new components, they:

1. Find similar existing components
2. Copy the structure
3. Adapt to new requirements

If some components have adapters and some don't, agents produce inconsistent output.

**Rule**: All 39 components will have adapters following the canonical structure.

**Simple Component Adapter Example**:

```typescript
// Even simple components get the full structure
// lf-badge-adapter.ts
export const createAdapter = (
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapter => ({
  controller: {
    get: {
      // Base getters (type-enforced)
      blocks: () => LF_BADGE_BLOCKS,
      compInstance: () => getAdapter().controller.get.compInstance(),
      cyAttributes: () => CY_ATTRIBUTES,
      framework: () => getAdapter().controller.get.framework(),
      ids: () => LF_BADGE_IDS,
      lfAttributes: () => LF_ATTRIBUTES,
      parts: () => LF_BADGE_PARTS,
    },
    // set: empty for display-only components
  },
  dispatcher: createDispatcher(getAdapter),
  elements: {
    jsx: prepBadgeJsx(getAdapter),
    refs: { badge: null, image: null, label: null },
  },
  // handlers: empty for non-interactive components
});
```

**Files Affected**: ~~15 components need new adapters~~ ✅ ALL COMPLETE
**Complexity**: Medium (total effort)
**Priority**: ~~P1~~ ✅ DONE

---

## 6. Architecture Enforcement

### 6.1 Problem Statement

The `architecture.md` defines canonical patterns, but not all components follow them. This creates inconsistency, makes onboarding harder, and increases maintenance burden.

### 6.2 Components with Adapters

**Current State**: ✅ ALL 39 components have v4.0.0 compliant adapters!

| All Components with Adapters (39) |
|-----------------------------------|
| accordion, article, autocomplete, badge, breadcrumbs |
| button, canvas, card, carousel, chart |
| chat, checkbox, chip, code, compare |
| drawer, header, image, list, masonry |
| messenger, multiinput, photoframe, placeholder, progressbar |
| radio, select, shapeeditor, slider, snackbar |
| spinner, splash, tabbar, textfield, toast |
| toggle, tree, typewriter, upload |

**Impact**: Consistent internal structure across all components, easier maintenance, clear separation of concerns.

**Achievement**: Phase 1 (Adapter-Everywhere) completed December 2024!

### 6.3 BLOCKS Pattern Compliance Gap

**Context**: The `architecture.md` defines a canonical BLOCKS pattern, but most components don't fully implement it.

**Canonical Pattern** (from architecture.md):

```typescript
// Standard: Always have root block, sub-blocks only when needed
export const LF_<COMP>_BLOCKS = {
  <comp>: {           // Root block (always)
    _: "<comp>",      // BEM block name
    element1: "element1",  // Simple elements = strings
    subBlock: {       // Sub-block = object with `_`
      _: "sub-block", // Own BEM block name
      child: "child", // Its elements
    },
  },
} as const;
```

**Current Reality**:

| Component | Follows Canonical? | Pattern Used |
|-----------|-------------------|--------------|
| shapeeditor | ✅ Yes | Full nested structure with sub-blocks |
| messenger | ⚠️ Partial | Flat domains without root wrapper |
| badge | ⚠️ Partial | Flat structure, no sub-blocks |
| button | ⚠️ Partial | Flat structure, no sub-blocks |
| Most others | ⚠️ Partial | Basic flat structure |

**Pattern Variations in Practice**:

**Pattern A** (Flat - Most components):

```typescript
// badge.constants.ts - Simple flat structure
export const LF_BADGE_BLOCKS = {
  badge: { _: "badge", image: "image", label: "label" },
} as const;
```

**Pattern B** (Canonical Nested - shapeeditor only):

```typescript
// shapeeditor.constants.ts - Full canonical with sub-blocks
export const LF_SHAPEEDITOR_BLOCKS = {
  shapeeditor: {
    _: "shapeeditor",
    navigation: {
      _: "navigation",  // Sub-block with own BEM namespace
      explorer: {
        _: "explorer",  // Sub-sub-block
        tree: "tree",
      },
    },
  },
} as const;
```

**Pattern C** (Flat domains - messenger):

```typescript
// messenger.constants.ts - Domains as peers, no root wrapper
export const LF_MESSENGER_BLOCKS = {
  character: { _: "character", avatar: "avatar", ... },
  chat: { _: "chat", chat: "chat", ... },
  covers: { _: "covers", ... },
  // No parent "messenger" block wrapping these
} as const;
```

**Issues**:

1. Only `lf-shapeeditor` fully implements the canonical pattern
2. Most components use simplified flat structures
3. No validation that BLOCKS ↔ SCSS ↔ refs actually match
4. Agents copying from non-canonical components propagate simplified patterns

**Proposed Enforcement**:

1. **Audit all components** against canonical pattern
2. **Retrofit** components to match architecture.md specification
3. **Build-time validation** to ensure compliance (see 6.6)
4. **Update architecture.md** with clearer tier-based guidance:
   - Simple components: flat structure acceptable
   - Medium/Complex: must use nested sub-blocks

### 6.4 Missing DOM-Driven Alignment

Per architecture.md, these must align:

| Artifact | Should Match |
|----------|--------------|
| `LF_<COMP>_BLOCKS` | DOM hierarchy |
| `refs` interface | BLOCKS nesting |
| `LF_<COMP>_IDS` | BLOCKS structure |
| `LF_<COMP>_PARTS` | All exposed elements |
| SCSS blocks | Each `_` entry |
| Element files | Each sub-block (medium/complex) |

**Audit Needed**: Script to validate alignment across all components.

### 6.5 Components Requiring Architecture Retrofit

**Priority by Complexity**:

| Priority | Components | Reason |
|----------|------------|--------|
| P1 | textfield, slider, toggle | Core input controls, FC candidates |
| P1 | checkbox, tabbar, accordion | Medium complexity, used everywhere |
| P2 | image, badge, chip | Simple but high usage |
| P2 | code, progressbar, spinner | Display components |
| P3 | toast, snackbar, splash | Overlay components |
| P3 | drawer, header, placeholder | Layout utilities |

### 6.6 Enforcement Tooling Proposal

**Build-Time Validation Script**:

```typescript
// scripts/validateArchitecture.ts
// Checks per component:
// 1. Has adapter file if >1 @State or >100 lines
// 2. BLOCKS has root wrapper
// 3. BLOCKS._entries match SCSS blocks
// 4. refs interface nesting matches BLOCKS
// 5. IDS structure matches BLOCKS
// 6. All parts have corresponding BLOCKS entries
```

**Pre-Commit Hook**:

- Run validation on changed component files
- Fail if architecture rules violated

**Complexity**: Medium  
**Priority**: P1 (Consistency is foundational)

---

## 7. Testing Coverage

### 7.1 Current State

| Metric | Count |
|--------|-------|
| Components | 38 |
| Unit test files | 14 |
| Coverage | ~37% |

### 7.2 Missing Test Coverage

Components without dedicated unit tests:

- `lf-accordion`
- `lf-autocomplete`
- `lf-badge`
- `lf-breadcrumbs`
- `lf-button`
- `lf-canvas`
- `lf-card`
- `lf-carousel`
- ... (24 more)

### 7.3 Testing Strategy

**Framework Services** (Jest):

- Data utilities: `lf-data.spec.ts` ✅
- Color service: `lf-color.spec.ts` ✅
- Theme service: needs tests

**Component Behavior** (Jest):

- Props/state initialization
- Method return values
- Event emission

**User Flows** (Cypress E2E):

- Component interaction scenarios
- Integration with showcase examples

**Priority**: P3 (Quality, but not blocking release)

---

## 8. Implementation Priority Matrix

### Phase 0: Adapter Architecture Overhaul (IMMEDIATE - Breaks Builds)

> **Warning**: This phase will break ALL builds until completion. Must be done atomically.
>
> **Progress**: Phase 0 COMPLETE ✅ (2024-12-14)
>
> - `lf-shapeeditor` established as golden standard
> - All 24 adapter-enabled components migrated to v4.0.0 pattern
> - 1333/1333 unit tests passing

| Item | Section | Complexity | Impact | Dependencies | Status |
|------|---------|------------|--------|--------------|--------|
| 5.1 Base interface overhaul | 5.1 | High | Critical | None | ✅ Done |
| 5.2 Standardize getters as functions | 5.2 | Medium | Critical | 5.1 | ✅ Done |
| 5.3 Remove Initializer types | 5.3 | Low | High | 5.1, 5.2 | ✅ Done |
| 5.4 Add computed/actions domains | 5.4 | Medium | High | 5.1 | ✅ Done |
| 5.5 Make dispatcher mandatory | 5.5 | Medium | High | 5.1 | ✅ Done |
| 5.6 All adapters extend base | 5.6 | Low | High | 5.1 | ✅ Done |
| 5.7 Explicit null in refs | 5.7 | Trivial | Low | None | ✅ Done |
| Rename manager → framework | 5.1 | Medium | High | None | ✅ Done |

**Golden Standard**: `lf-shapeeditor` - use as reference for all migrations
**Silver Reference**: `lf-button` - use for simple component patterns

**Completed Work** (Phase 0 + Phase 1):

- ✅ ALL 39 components have v4.0.0 compliant adapters
- ✅ Base interface with 7 mandatory getters (blocks, compInstance, cyAttributes, framework, ids, lfAttributes, parts)
- ✅ Four controller domains (get/set/computed/actions) properly separated
- ✅ All getters are functions `() => T`
- ✅ Dispatcher is now REQUIRED (non-optional in type)
- ✅ 1333/1333 unit tests passing

**Migration Completed** (December 2024):

Phase 1 added adapters to all 15 remaining components:

- **Batch 1 (Simple Display)**: header, splash, progressbar
- **Batch 2 (Notifications)**: toast, snackbar
- **Batch 3 (Loading)**: placeholder, spinner
- **Batch 4 (Media)**: typewriter, image, photoframe
- **Batch 5 (Form Controls)**: slider, upload
- **Batch 6 (Complex)**: code, article, drawer

### Phase 1: Foundation (Before v4.0.0-alpha)

| Item | Complexity | Impact | Dependencies | Status |
|------|------------|--------|--------------|--------|
| 1.1 LfDataCell mapped types | Medium | High | None | ✅ DONE |
| 1.2 Flexible cells container | High | High | 1.1 | ✅ DONE |
| 1.4 LfDataCellContainer fix | Low | High | None | ✅ DONE |
| 4.1 Type map consolidation | Medium | High | None | ✅ DONE |
| 3.1 Lifecycle boilerplate | Medium | High | None | ⏸️ DEFERRED |
| 5.8 Adapter-everywhere (15 new adapters) | Medium | High | Phase 0 | ✅ DONE |
| 2.10 FC POC (slider, toggle) | Medium | High | None | |
| 6.x Architecture enforcement tooling | Medium | High | None | |

### Phase 2: Core (v4.0.0-beta)

| Item | Complexity | Impact | Dependencies | Status |
|------|------------|--------|--------------|--------|
| 2.x FC for all input controls | High | High | 2.10 POC | |
| 4.2 Props inheritance | Low | Medium | None | |

### Phase 3: Enhancement (v4.0.0-rc)

| Item | Complexity | Impact | Dependencies |
|------|------------|--------|--------------|
| 2.x FC for display components | High | Medium | 2.x input |
| 2.x LfShape uses FCs | High | High | 2.x all FCs |
| 1.3 Value/lfValue docs | Low | Low | None |
| 8.x Test coverage | Medium | Medium | None |

### Phase 4: Polish (v4.0.0)

| Item | Complexity | Impact | Dependencies |
|------|------------|--------|--------------|
| 3.2 Event boilerplate | Low | Low | None |
| 3.3 Props array generation | Medium | Low | Build tooling |
| 2.x Export FCs in public API | Low | Medium | All FC work |

---

## Breaking Changes Summary

| Change | Breaking Level | Migration Path | Status |
|--------|----------------|----------------|--------|
| Adapter architecture overhaul | **Internal Breaking** | Phase 0 atomic migration | ✅ Complete |
| `manager` → `framework` rename | **Internal Breaking** | Find/replace across codebase | ✅ Complete |
| Flexible cells container (1.2) | Major | `shape` property now required | ✅ Complete |
| LfDataCell mapped types (1.1) | Minor | Type-level only, cleaner errors | ✅ Complete |
| WC → FC internally | None | Internal refactor, public API unchanged | |
| LfShape uses FCs | None | Internal, shapes API unchanged | |
| FC public export | Minor (additive) | New exports, no removals | |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-12-14 | `lf-shapeeditor` as golden standard | Most complex component, fully migrated to v4.0.0, serves as reference for all other migrations |
| 2024-12-14 | `computed`/`actions` are MANDATORY when applicable | "Optional" framing was misleading—operations MUST go in correct domain. A component may not *have* any predicates, but if it does, they go in `computed`. Consistency > pragmatism in AI-assisted codebases |
| 2024-12-14 | Shapeeditor implements all four controller domains | Full get/set/computed/actions separation as reference for other components |
| 2024-12-13 | Promote common getters to base type | All adapters need blocks/cyAttributes/framework/ids/lfAttributes/parts - enforce at type level |
| 2024-12-13 | Standardize all getters as functions `() => T` | Consistency, dynamic capture, testability, future-proof |
| 2024-12-13 | Rename `manager` → `framework` | Clearer semantics; `manager` was vague |
| 2024-12-13 | Remove Initializer types | Redundant boilerplate; components pass full interfaces anyway |
| 2024-12-13 | Add `computed` controller domain | Separate predicates/builders from simple state reads |
| 2024-12-13 | Add `actions` controller domain | Separate complex multi-step operations from simple setters |
| 2024-12-13 | Make dispatcher mandatory | Centralized event emission, debug logging, type safety |
| 2024-12-13 | All adapters extend base interface | Type safety, consistency |
| 2024-12-13 | Explicit null in refs type | Type clarity for ref initialization pattern |
| 2024-12-13 | Adapter-everywhere philosophy | Consistency > pragmatism; AI-assisted codebase pattern matching |
| TBD | LfDataCell mapped types | Maintainability over raw conditional |
| TBD | Flexible cells with shape discriminator | Real-world need for multiple same-type cells |
| TBD | Dual-mode components (WC + FC) | WC for standalone, FC for composition |
| TBD | All shapes render via FC | Major performance win for composed usage |
| TBD | State always in parent | Unidirectional data flow, simpler mental model |
| TBD | value→lfValue is mapping, not duplication | Clarifies data layer vs UI layer separation |

---

## References

- [copilot.instructions.md](.github/instructions/copilot.instructions.md) - Project coding guidelines
- [SHAPEEDITOR_ARCHITECTURE.md](./SHAPEEDITOR_ARCHITECTURE.md) - Shapeeditor design patterns
- [TESTING.md](./TESTING.md) - Testing strategy

---

## Appendix A: Current Component State Count

```plaintext
Component                @State fields
-----------------------------------------
lf-shapeeditor           19  ← Most stateful
lf-messenger             11
lf-showcase              8
lf-tree                  4
lf-masonry               4
lf-compare               3
lf-photoframe            4
lf-image                 4
lf-typewriter            4
lf-list                  4
lf-carousel              3
lf-textfield             3
lf-select                3
lf-multiinput            3
lf-spinner               3
lf-slider                2
lf-splash                2
lf-toggle                2
lf-tabbar                2
lf-radio                 2
lf-code                  2
lf-placeholder           2
(remaining: 1 each - debugInfo only)
```

---

## Appendix B: File Impact Summary

| Package | Files Affected | Type of Change |
|---------|----------------|----------------|
| foundations | ~15 | Type definitions, FC prop interfaces |
| framework | ~2 | Service interfaces |
| core | ~80 | Component implementations + new FC files |
| shapes | ~5 | LfShape refactored to use FCs |
| showcase | ~5 | Examples/docs |
| react-* | ~2 | Generated (automatic) |

---

## Appendix C: FC Migration Checklist

For each component migrating to dual-mode (WC + FC):

- [ ] Create `lf-<comp>-fc.tsx` with FC implementation
- [ ] Define `Lf<Comp>FCProps` interface (no `lf` prefix on props)
- [ ] Move core JSX from WC to FC
- [ ] Refactor WC to call FC in render()
- [ ] Update SCSS to work in both contexts (shadow + adopted)
- [ ] Add `theme.adoptStylesheet()` support for composed usage
- [ ] Update shapes.tsx to use FC instead of WC tag
- [ ] Add FC unit tests
- [ ] Verify standalone WC still works
- [ ] Verify composed usage (e.g., in shapeeditor) works
- [ ] Update documentation

---

## Appendix D: Shape-to-FC Mapping (Target State)

```typescript
// Current: shapes.tsx renders WC tags
case "textfield":
  return <lf-textfield lfValue={...} />;

// Target: shapes.tsx renders FCs
case "textfield":
  return <LfTextfieldFC value={...} onChange={handler} />;
```

| Shape | FC Name | Notes |
|-------|---------|-------|
| badge | `LfBadgeFC` | Pure display |
| button | `LfButtonFC` | With ripple support |
| canvas | `LfCanvasFC` | Complex, may need WC |
| card | `LfCardFC` | Pure display |
| chart | `LfChartFC` | Complex, may need WC |
| chat | `LfChatFC` | Complex, may keep WC |
| chip | `LfChipFC` | Pure display |
| code | `LfCodeFC` | Highlight lib integration |
| image | `LfImageFC` | Pure display |
| number | N/A | Primitive, inline |
| photoframe | `LfPhotoframeFC` | Pure display |
| slot | N/A | Primitive, inline |
| text | N/A | Primitive, inline |
| toggle | `LfToggleFC` | Input control |
| typewriter | `LfTypewriterFC` | Animation state |
| upload | `LfUploadFC` | Input control |

---

## Appendix E: architecture.md Review (Holy Bible Audit)

The `architecture.md` is intended to be the canonical reference for all component development. This audit identifies gaps, inconsistencies, and areas for improvement.

### E.1 Strengths ✅

| Section | Assessment |
|---------|------------|
| Monorepo Structure | Clear diagram, well explained |
| Package Overview | Comprehensive, good separation |
| Framework Initialization | Excellent flowchart |
| Adapter Pattern | Well documented with Mermaid diagram |
| Component Tiers | Clear categorization |
| DOM-Driven Architecture | Detailed with good examples |
| Ripple Pattern | Actionable code example |
| Glassmorphism | Complete with alpha tier system |
| Backdrop-Filter | Excellent edge case documentation |

### E.2 Gaps & Missing Sections 🔴

| Missing Topic | Impact | Recommendation |
|---------------|--------|----------------|
| **Functional Components** | High | Add section once FC architecture is finalized |
| **Shape Rendering** | High | Document `LfShape`, `shapes.tsx`, cell→component mapping |
| **Data Layer** | High | Document `LfDataDataset`, `LfDataNode`, `LfDataCell` contracts |
| **Event System** | Medium | Document `onLfEvent`, `lf-<comp>-event` pattern, payload structure |
| **Testing Patterns** | Medium | Document Jest vs Cypress split, TDD workflow |
| **Error Handling** | Medium | Document error boundaries, fallback patterns |
| **Accessibility** | Medium | Document ARIA patterns, keyboard navigation |
| **Performance** | Low | Document lazy loading, virtualization patterns |
| **Debugging** | Low | Document `LfDebug` service, lifecycle logging |

### E.3 Inconsistencies 🟡

| Issue | Location | Fix |
|-------|----------|-----|
| TOC doesn't match actual sections | Table of Contents | Update TOC to reflect all subsections |
| "Advanced component architecture" lowercase | Section heading | Capitalize to match other headings |
| Examples cite `lf-chip` as simple | Tier table | But `lf-chip` has no adapter - clarify tier criteria |
| `lf-radio` cited as simple | Tier table | Has adapter, correct |
| DOM-Driven subsection in wrong place | Under "Advanced" | Should be its own top-level section |

### E.4 Accuracy Issues 🟠

| Claim | Reality | Fix |
|-------|---------|-----|
| "Simple components have adapter" | Many simple components lack adapters | Clarify: adapter is recommended, not required |
| Tier examples | `lf-breadcrumbs`, `lf-chip` listed as simple with adapter | Only `lf-breadcrumbs` has adapter |
| All handlers grouped by panel | Some components have flat handlers | Document both patterns |

### E.5 Recommended TOC for architecture.md v2

```markdown
## Table of Contents

1. Introduction
2. Monorepo Structure
3. Packages Overview
   - Assets
   - Foundations  
   - Framework
   - Core
   - Showcase
   - React Wrappers
4. Inter-Package Relationships
5. Framework Services
   - Initialization Flow
   - Theme Service
   - Data Service
   - Effects Service
   - Portal Service
   - Debug Service
6. Component Architecture
   - Complexity Tiers
   - Adapter Pattern
   - Controller (get/set)
   - Elements (jsx/refs)
   - Handlers
   - DOM-Driven Structure (BLOCKS)
7. Data Layer
   - LfDataDataset & LfDataNode
   - LfDataCell & Shapes
   - Cell Container
8. Shape Rendering
   - LfShape Component
   - Shape-to-Component Mapping
   - Event Dispatcher Pattern
9. Functional Components (NEW)
   - Dual-Mode Architecture
   - FC Props Convention
   - Styling Strategy
10. Styling Patterns
    - BEM Convention
    - Glassmorphism & Alpha Tiers
    - Backdrop-Filter Considerations
11. Event System
    - Single Event Pattern
    - Event Payload Structure
    - Composition Handlers
12. Testing Strategy
    - Unit Tests (Jest)
    - E2E Tests (Cypress)
    - TDD Workflow
13. Build & Scripts
14. Best Practices Checklist
```

### E.6 Quick Fixes for Current architecture.md

1. **Add "Data Layer" section** before "Advanced component architecture"
2. **Add "Shape Rendering" section** after adapter pattern
3. **Rename** "Advanced component architecture" → "Component Architecture"
4. **Promote** DOM-Driven Architecture to its own top-level section
5. **Add** event system documentation
6. **Update** tier examples to match reality
7. **Add** "Functional Components" placeholder section
8. **Fix** TOC to include all subsections

### E.7 Critical Additions for v4.0.0

Before v4.0.0, architecture.md MUST document:

- [ ] Functional Component architecture (Section 2 of this document)
- [ ] FC + WC dual-mode pattern
- [ ] Shape rendering via FC
- [ ] Flexible cells container (if implemented)
- [ ] Updated BLOCKS conventions

---

*Last Updated: 2024-12-14*
*Authors: Luca Foscili, Claude*

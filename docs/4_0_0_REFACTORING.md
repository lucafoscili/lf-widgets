# LF Widgets v4.0.0 Architectural Refactoring Proposal

> **Status**: Proposal  
> **Branch**: Already has 200+ files edited  
> **Timeline**: Must be addressed before v4.0.0 release  
> **Philosophy**: "This might be the last chance for an architectural overhaul"

---

## Executive Summary

This document catalogs architectural improvements for the v4.0.0 major release. Items are prioritized by impact and complexity. The goal is to reduce technical debt, improve developer experience, and ensure long-term maintainability before the API surface grows too large.

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
5. [Adapter Pattern Standardization](#5-adapter-pattern-standardization)
   - 5.1 Inconsistent Factory Signatures
   - 5.2 Getter Invocation Inconsistency
   - 5.3 Dispatcher Pattern for Event Emission
   - 5.4 Adapter-Everywhere Philosophy
6. [Architecture Enforcement](#6-architecture-enforcement)
7. [Testing Coverage](#7-testing-coverage)
8. [Implementation Priority Matrix](#8-implementation-priority-matrix)

---

## 1. Data Layer Simplification

### 1.1 LfDataCell Type Refactoring

**Problem**: The `LfDataCell` type in `data.declarations.ts` uses a 120-line nested conditional type with 17 levels of nesting.

```typescript
// Current: Deeply nested ternary (lines 77-196)
export type LfDataCell<S extends LfDataShapeMap = "text"> =
  S extends "badge" ? { ... } :
  S extends "button" ? { ... } :
  // ... 15+ more branches
```

**Impact**:

- Hard to maintain and extend
- TypeScript performance degradation
- Error messages are cryptic

**Proposed Solution**: Use mapped types with a shape-to-props lookup table.

```typescript
// Proposed: Mapped type approach (~15 lines)
interface LfDataCellPropsMap {
  badge: LfBadgePropsInterface;
  button: LfButtonPropsInterface;
  canvas: LfCanvasPropsInterface;
  card: LfCardPropsInterface;
  chart: LfChartPropsInterface;
  chat: LfChatPropsInterface;
  chip: LfChipPropsInterface;
  code: LfCodePropsInterface;
  image: LfImagePropsInterface;
  number: {};
  photoframe: LfPhotoframePropsInterface;
  slot: {};
  text: {};
  toggle: LfTogglePropsInterface;
  typewriter: LfTypewriterPropsInterface;
  upload: LfUploadPropsInterface;
}

// Cell is always: base fields + shape-specific props
export type LfDataCell<S extends LfDataShapeMap = "text"> = 
  LfDataCellBase & LfDataCellPropsMap[S];
```

**Files Affected**: `packages/foundations/src/data/data.declarations.ts`

**Complexity**: Medium  
**Priority**: P0 (High Impact, Foundational)

---

### 1.2 Flexible Cells Container

**Problem**: `LfDataCellContainer` uses rigid `lf<Shape>` key naming, limiting to one cell per shape type.

```typescript
// Current: Only one cell per shape type allowed
type LfDataCellContainer = {
  lfBadge?: LfDataCell<"badge">;
  lfButton?: LfDataCell<"button">;
  // ...
};

// Problem: Can't have two buttons or two images in same container
```

**Proposed Solution**: Allow any key, use `shape` property as discriminator.

```typescript
// Proposed: Flexible keys with shape discriminator
type LfDataCellContainer = {
  [key: string]: LfDataCell<LfDataShapeMap>;  // Any key allowed
};

// Usage example
const cells: LfDataCellContainer = {
  primaryAction: { shape: "button", value: "Submit", lfIcon: "check" },
  secondaryAction: { shape: "button", value: "Cancel", lfIcon: "close" },
  avatar: { shape: "image", value: "/user.jpg" },
  background: { shape: "image", value: "/bg.jpg" },
};
```

**Benefits**:

- Multiple cells of same shape type
- Semantic naming (`avatar` vs `background` instead of generic `lfImage`)
- Removes need for `LF_DATA_SHAPE_MAP` key-to-shape mapping

**Breaking Change**: Yes - existing code using `cells.lfImage` must migrate to semantic keys.

**Migration Path**:

1. Add `shape` property to all cells (required)
2. Deprecate `lf<Shape>` key convention
3. Provide codemod or migration script

**Files Affected**:

- `packages/foundations/src/data/data.declarations.ts`
- `packages/foundations/src/data/data.constants.ts` (remove `LF_DATA_SHAPE_MAP`)
- All shape consumers in `packages/core/`

**Complexity**: High  
**Priority**: P1 (Breaking, Major Impact)

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

### 1.4 LfDataCellContainer Duplicate Definition

**Problem**: `LfDataCellContainer` is defined twice in `data.declarations.ts` (lines 579-604), causing TypeScript interface merging.

```typescript
// First definition (lines 579-598): Typed interface
export interface LfDataCellContainer {
  lfAccordion?: LfDataCellFromName<"lfAccordion">;
  lfBadge?: LfDataCellFromName<"lfBadge">;
  lfButton?: LfDataCellFromName<"lfButton">;
  // ... 15 more typed entries
}

// Second definition (lines 602-604): Index signature
export interface LfDataCellContainer {
  [index: string]: LfDataCell<LfDataShapes>;
}
```

**Impact**: The index signature effectively nullifies the typed keys above it. TypeScript merges interfaces, so any string key is valid—defeating the purpose of explicit typing.

**Additionally Missing**: `lfTypewriter` is not present in the typed interface, despite `typewriter` being a valid shape (defined in `LfDataCell` at lines 554-559).

**Proposed Solution**:

```typescript
// Option A: Remove index signature, keep strict typing (BREAKING)
export interface LfDataCellContainer {
  lfAccordion?: LfDataCellFromName<"lfAccordion">;
  lfBadge?: LfDataCellFromName<"lfBadge">;
  // ... all typed entries including lfTypewriter
  lfTypewriter?: LfDataCellFromName<"lfTypewriter">;  // ADD THIS
}

// Option B: Keep flexible (aligns with 1.2 proposal)
// Remove typed interface entirely, use only index signature
export interface LfDataCellContainer {
  [key: string]: LfDataCell<LfDataShapes>;
}
```

**Recommendation**: Since Section 1.2 proposes flexible cells with semantic keys, Option B aligns with that direction. The typed interface becomes unnecessary once `shape` is the discriminator.

**Pre-Refactoring Fix**: Add `lfTypewriter` to the typed interface for consistency until 1.2 is implemented.

**Files Affected**: `packages/foundations/src/framework/data.declarations.ts`

**Complexity**: Low
**Priority**: P1 (Type Safety Bug)

---

## 2. Functional Components Architecture

### 2.1 Vision: Dual-Mode Components

**Ideal End State**:

1. Every Web Component has a Functional Component (FC) counterpart
2. Web Components are thin wrappers around FCs (for standalone usage)
3. When composed inside other components, always use the FC version
4. All shapes render via FCs, not Web Components
5. State always lives in the parent, FCs are purely presentational

```
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

```
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

FCs don't have Shadow DOM, so they inherit parent's styles:

```scss
// lf-textfield.scss is imported by:
// 1. Web Component (via styleUrl) - for standalone usage
// 2. Parent component (via @import) - for composed usage

// The SCSS structure remains the same:
.textfield {
  &__label { ... }
  &__input { ... }
}
```

**Adopted Stylesheets** (for non-Shadow DOM contexts):

```typescript
// Parent component adopts child styles
this.#framework.theme.adoptStylesheet(this.el.shadowRoot, "textfield");
```

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

### 2.10 Proof of Concept Priority

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

**Problem**: All 38 components repeat identical lifecycle code.

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

**Files Affected**: All 38 component `.tsx` files  
**Complexity**: Medium  
**Priority**: P1 (DRY, Maintainability)

---

### 3.2 Event Emitter Boilerplate

**Problem**: Identical `@Event()` decorator config repeated 38 times.

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

**Problem**: `components.declarations.ts` contains 6+ maps with 38 entries each.

```typescript
// All have identical 38 entries, different value types
type LfComponentTag = "lf-accordion" | "lf-autocomplete" | ...;
type LfComponentName = "LfAccordion" | "LfAutocomplete" | ...;
type LfComponentEventName = "lf-accordion-event" | "lf-autocomplete-event" | ...;

interface LfComponentPropsMap {
  "lf-accordion": LfAccordionPropsInterface;
  "lf-autocomplete": LfAutocompletePropsInterface;
  // ... 36 more
}

interface LfComponentElementMap {
  "lf-accordion": HTMLLfAccordionElement;
  // ... 37 more
}
```

**Proposed Solution**: Single source of truth with derived types.

```typescript
// Single definition
const LF_COMPONENTS = {
  accordion: {
    tag: "lf-accordion",
    name: "LfAccordion",
    event: "lf-accordion-event",
  },
  autocomplete: { ... },
  // ... 36 more
} as const;

// Derived types (computed, not manually maintained)
type LfComponentTag = typeof LF_COMPONENTS[keyof typeof LF_COMPONENTS]["tag"];
type LfComponentName = typeof LF_COMPONENTS[keyof typeof LF_COMPONENTS]["name"];
type LfComponentEventName = typeof LF_COMPONENTS[keyof typeof LF_COMPONENTS]["event"];
```

**Files Affected**: `packages/foundations/src/components/components.declarations.ts`  
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

### 5.1 Inconsistent Factory Signatures

**Problem**: Different components use different adapter factory patterns.

```typescript
// Pattern A (newer)
createAdapter(getters, setters, getAdapter)

// Pattern B (older)
createAdapter(component)

// Pattern C (messenger-style)
createAdapter(getters, setters, getAdapter) with domain segmentation
```

**Proposed Standard**: All components should follow the canonical pattern.

```typescript
// Standard factory signature
export const createAdapter = (
  getters: LfComponentAdapterInitializerGetters,
  setters: LfComponentAdapterInitializerSetters,
  getAdapter: () => LfComponentAdapter,
): LfComponentAdapter => ({
  controller: { 
    get: createGetters(getters), 
    set: createSetters(setters) 
  },
  elements: { 
    jsx: createJsx(getAdapter), 
    refs: createRefs() 
  },
  handlers: createHandlers(getAdapter),
});
```

**Files Affected**: ~20 adapter files in `packages/core/src/components/*/`  
**Complexity**: Medium  
**Priority**: P2 (Consistency)

---

### 5.2 Getter Invocation Inconsistency

**Problem**: Some getters return values directly, others return functions.

```typescript
// Inconsistent: direct value
get: {
  framework: this.#framework,  // Direct
  compInstance: this,  // Direct
}

// Canonical: always functions for dynamic values
get: {
  framework: () => this.#framework,  // Function
  compInstance: () => this,  // Function
}
```

**Reasoning**: Dynamic values must be functions to capture current state. Static values can be direct.

**Proposed Rule**:

- Always use functions for values that can change
- Direct access only for truly constant values

**Files Affected**: All adapter getters
**Complexity**: Low
**Priority**: P3 (Consistency)

---

### 5.3 Dispatcher Pattern for Event Emission

**Problem**: Event emission is scattered throughout components with direct `this.lfEvent.emit()` calls.

```typescript
// Current: Direct emit scattered throughout component
onButtonClick() {
  this.lfEvent.emit({ eventType: "click", id: this.rootId, comp: "LfButton" });
}

onButtonFocus() {
  this.lfEvent.emit({ eventType: "focus", id: this.rootId, comp: "LfButton" });
}

// Problems:
// 1. Repeated id/comp boilerplate
// 2. No central place for logging/debugging
// 3. Easy to miss required fields
// 4. Inconsistent payload structure across components
```

**Proposed Solution**: Add `dispatcher` as fourth adapter domain.

```typescript
// Adapter structure becomes:
export interface LfComponentAdapter {
  controller: { get: Getters; set: Setters };
  elements: { jsx: JsxFactories; refs: Refs };
  handlers: Handlers;
  dispatcher: Dispatcher;  // NEW
}

// Dispatcher implementation
export const createDispatcher = (
  getAdapter: () => LfButtonAdapter,
): LfButtonAdapterDispatcher => {
  return {
    emit: (eventType: LfButtonEventType, detail?: Partial<LfButtonEventPayload>) => {
      const { compInstance, framework, rootId } = getAdapter().controller.get;

      // Optional: Debug logging
      framework().debug?.log("event", { comp: "LfButton", eventType, id: rootId() });

      // Emit with guaranteed structure
      compInstance().lfEvent.emit({
        eventType,
        id: rootId(),
        comp: "LfButton",
        ...detail,
      });
    },
  };
};
```

**Usage in Handlers**:

```typescript
// Before: scattered, verbose
onButtonClick() {
  this.lfEvent.emit({ eventType: "click", id: this.rootId, comp: "LfButton", value: this.lfValue });
}

// After: centralized, clean
onButtonClick() {
  this.#adapter.dispatcher.emit("click", { value: this.lfValue });
}
```

**Benefits**:

| Aspect | Before | After |
|--------|--------|-------|
| Boilerplate per emit | ~50 chars | ~20 chars |
| Debug logging | Manual, inconsistent | Automatic, centralized |
| Payload validation | None | Can add runtime checks |
| Cross-cutting concerns | Impossible | Easy (analytics, etc.) |
| Agent replication | Must understand emit pattern | Copy dispatcher.emit() |

**Standard Adapter Interface (Updated)**:

```typescript
// Canonical adapter with all 4 domains
export interface LfComponentAdapter<C extends LfComponentName> {
  controller: {
    get: LfComponentAdapterGetters<C>;
    set: LfComponentAdapterSetters<C>;
  };
  elements: {
    jsx: LfComponentAdapterJsx<C>;
    refs: LfComponentAdapterRefs<C>;
  };
  handlers: LfComponentAdapterHandlers<C>;
  dispatcher: LfComponentAdapterDispatcher<C>;
}

// Dispatcher interface per component
export interface LfComponentAdapterDispatcher<C extends LfComponentName> {
  emit: (
    eventType: LfEventType<C>,
    detail?: Partial<Omit<LfEventPayload<C>, "eventType" | "id" | "comp">>,
  ) => void;
}
```

**Files Affected**: All 18 existing adapter files + 21 new adapters
**Complexity**: Low (per adapter), Medium (total effort)
**Priority**: P1 (Consistency, Agent-Friendliness)

---

### 5.4 Adapter-Everywhere Philosophy

**Decision**: Every component MUST have an adapter, regardless of complexity.

**Rationale**:

| Argument | Counter-Argument | Resolution |
|----------|------------------|------------|
| "Badge is too simple" | Simple today, may grow tomorrow | Adapter provides structure for growth |
| "Adds unnecessary indirection" | ~50 lines per simple component | Small cost for architectural consistency |
| "Overkill for display-only" | Agents pattern-match on structure | Consistency enables mechanical replication |

**Key Insight**: In an AI-assisted codebase, **consistency beats pragmatism**.

When agents scaffold new components, they:

1. Find similar existing components
2. Copy the structure
3. Adapt to new requirements

If some components have adapters and some don't, agents will:

- Sometimes copy adapter-based components
- Sometimes copy non-adapter components
- Produce inconsistent output

**Rule**: All 39 components will have adapters following the canonical 4-domain structure.

**Simple Component Adapter Example (Badge)**:

```typescript
// Even simple components get full adapter structure
export const createAdapter = (
  getters: LfBadgeAdapterInitializerGetters,
  setters: LfBadgeAdapterInitializerSetters,
  getAdapter: () => LfBadgeAdapter,
): LfBadgeAdapter => ({
  controller: {
    get: createGetters(getters),
    set: {},  // Empty but present
  },
  elements: {
    jsx: createJsx(getAdapter),
    refs: createRefs(),
  },
  handlers: {},  // Empty but present
  dispatcher: createDispatcher(getAdapter),
});
```

**Complexity**: N/A (Philosophy)
**Priority**: P0 (Foundational Decision)

---

## 6. Architecture Enforcement

### 6.1 Problem Statement

The `architecture.md` defines canonical patterns, but not all components follow them. This creates inconsistency, makes onboarding harder, and increases maintenance burden.

### 6.2 Components Missing Adapters

**Current State**: 18 of 39 components have adapters.

| Has Adapter (18) | Missing Adapter (21) |
|------------------|---------------------|
| autocomplete, badge, breadcrumbs, button | accordion, article, checkbox |
| canvas, card, carousel, chart | chip, code, drawer |
| chat, compare, list, masonry | header, image, photoframe |
| messenger, multiinput, radio | placeholder, progressbar, slider |
| select, shapeeditor, tree | snackbar, spinner, splash |
| | tabbar, textfield, toast |
| | toggle, typewriter, upload |

**Impact**: Inconsistent internal structure, harder to maintain, no clear separation of concerns.

**Recommendation**: Retrofit adapters to all components, starting with high-complexity ones.

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

### Phase 1: Foundation (Before v4.0.0-alpha)

| Item | Complexity | Impact | Dependencies |
|------|------------|--------|--------------|
| 1.1 LfDataCell mapped types | Medium | High | None |
| 1.4 LfDataCellContainer fix | Low | High | None |
| 4.1 Type map consolidation | Medium | High | None |
| 3.1 Lifecycle boilerplate | Medium | High | None |
| 5.3 Dispatcher pattern | Medium | High | None |
| 5.4 Adapter-everywhere | Medium | High | 5.3 |
| 2.10 FC POC (slider, toggle) | Medium | High | None |
| 6.x Architecture enforcement tooling | Medium | High | None |

### Phase 2: Core (v4.0.0-beta)

| Item | Complexity | Impact | Dependencies |
|------|------------|--------|--------------|
| 1.2 Flexible cells container | High | High | 1.1 |
| 2.x FC for all input controls | High | High | 2.10 POC |
| 7.x Retrofit adapters (P1 components) | Medium | High | 7.x tooling |
| 4.2 Props inheritance | Low | Medium | None |
| 5.1 Adapter standardization | Medium | Medium | None |

### Phase 3: Enhancement (v4.0.0-rc)

| Item | Complexity | Impact | Dependencies |
|------|------------|--------|--------------|
| 2.x FC for display components | High | Medium | 2.x input |
| 2.x LfShape uses FCs | High | High | 2.x all FCs |
| 7.x Retrofit adapters (P2/P3 components) | Medium | Medium | 7.x P1 |
| 1.3 Value/lfValue docs | Low | Low | None |
| 8.x Test coverage | Medium | Medium | None |

### Phase 4: Polish (v4.0.0)

| Item | Complexity | Impact | Dependencies |
|------|------------|--------|--------------|
| 3.2 Event boilerplate | Low | Low | None |
| 3.3 Props array generation | Medium | Low | Build tooling |
| 5.2 Getter consistency | Low | Low | 5.1 |
| 2.x Export FCs in public API | Low | Medium | All FC work |

---

## Breaking Changes Summary

| Change | Breaking Level | Migration Path |
|--------|----------------|----------------|
| Flexible cells container | Major | Codemod + deprecation warnings |
| WC → FC internally | None | Internal refactor, public API unchanged |
| LfShape uses FCs | None | Internal, shapes API unchanged |
| FC public export | Minor (additive) | New exports, no removals |
| Adapter standardization | None | Internal only |
| Props inheritance | None | Additive |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| TBD | LfDataCell mapped types | Maintainability over raw conditional |
| TBD | Flexible cells with shape discriminator | Real-world need for multiple same-type cells |
| TBD | Dual-mode components (WC + FC) | WC for standalone, FC for composition |
| TBD | All shapes render via FC | Major performance win for composed usage |
| TBD | State always in parent | Unidirectional data flow, simpler mental model |
| TBD | Adapter-everywhere | Consistency > pragmatism; enables mechanical agent replication |
| TBD | Dispatcher as 4th adapter domain | Centralized event emission, debug logging, cross-cutting concerns |
| TBD | value→lfValue is mapping, not duplication | Clarifies data layer vs UI layer separation |

---

## References

- [copilot.instructions.md](.github/instructions/copilot.instructions.md) - Project coding guidelines
- [SHAPEEDITOR_ARCHITECTURE.md](./SHAPEEDITOR_ARCHITECTURE.md) - Shapeeditor design patterns
- [TESTING.md](./TESTING.md) - Testing strategy

---

## Appendix A: Current Component State Count

```
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

*Last Updated: 2025-12-13*
*Authors: Luca Foscili, Claude*

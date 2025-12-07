# LF Shape Editor Architecture

> **Status**: Implementation Complete
> **Last Updated**: December 7, 2025
> **Breaking Change**: `lf-imageviewer` → `lf-shapeeditor`
> **Affected Consumers**: ComfyUI LF Nodes (internal)

---

## Executive Summary

The `lf-shapeeditor` is a **universal 4-panel interactive explorer** that transforms any `LfShape` type into an explorable, configurable, and previewable experience. It acts as a **"dumb" exoskeleton** - providing UI structure and event bubbling while leaving all domain logic to the consumer.

The component itself remains **simple and generic** - the power comes from:

1. **Fixtures** (datasets) that configure it for each use case
2. **DSL-driven configuration** (`LfShapeeditorConfigDsl`) for dynamic control panels
3. **Event bubbling** via Matryoshka pattern for consumer integration

---

## Architecture Overview

### The 4-Panel Pattern

```plaintext
┌──────────────────┬─────────────────────────────────────────┐
│                  │                                         │
│    NAVIGATION    │              PREVIEW                    │
│    (Masonry)     │           (Any LfShape)                 │
│                  │                                         │
│  Browse items    │   Visual result of current state        │
│  Select shapes   │   - image, chart, card, code, etc.      │
│  Filter content  │   - consumer controls updates           │
│                  │                                         │
├──────────────────┤                                         │
│                  ├─────────────────────────────────────────┤
│    TREE          │                                         │
│    (optional)    │          CONFIGURATION                  │
│                  │          (DSL-driven)                   │
│  Folder browser  │                                         │
│  Categories      │   Dynamic controls from DSL             │
│  Presets         │   - sliders, toggles, selects           │
│                  │   - grouped in accordion                │
│                  │                                         │
└──────────────────┴─────────────────────────────────────────┘
```

### Panel Components

| Panel | Component | Role | Data Source |
|-------|-----------|------|-------------|
| **Navigation** | `lf-masonry` + `lf-textfield` | Browse/select shapes | `lfDataset.nodes` |
| **Tree** | `lf-tree` (optional) | Folder/category browsing | `lfNavigation.treeProps` |
| **Preview** | `<LfShape>` | Visual output | `lfValue` + `lfShape` |
| **Config** | DSL-driven accordion | Parameter editing | `LfShapeeditorConfigDsl` |

---

## Core Concepts

### 1. The "Dumb Exoskeleton" Pattern

The shapeeditor does **NOT**:

- Know what effects/filters exist
- Apply changes to the preview
- Understand domain-specific logic
- Store business state

The shapeeditor **DOES**:

- Render a 4-panel UI layout
- Display DSL-driven configuration controls
- Manage history (undo/redo/snapshots)
- Bubble events to the consumer
- Provide `getComponents()` for DOM access
- Provide `getSettings()`/`setSettings()` for config state

### 2. DSL-Driven Configuration

Configuration panels are defined declaratively via `LfShapeeditorConfigDsl`:

```typescript
interface LfShapeeditorConfigDsl {
  controls: LfShapeeditorControlConfig[];   // Control definitions
  defaultSettings?: LfShapeeditorConfigSettings;  // Initial values
  layout?: LfShapeeditorLayout;             // Accordion grouping
}
```

### 3. Control Types

| Type | Component | Value Type | Use Case |
|------|-----------|------------|----------|
| `checkbox` | `lf-checkbox` | `boolean` | Simple on/off |
| `toggle` | `lf-toggle` | `boolean` | Feature switches |
| `slider` | `lf-slider` | `number` | Range values |
| `number` | `lf-textfield` | `number` | Precise numeric input |
| `textfield` | `lf-textfield` | `string` | Text input |
| `select` | `lf-select` | `string` | Dropdown options |
| `colorpicker` | `<input type="color">` | `string` | Color selection |
| `multiinput` | `lf-multiinput` | `string` | Tags/history input |

### 4. Event Flow (Matryoshka Pattern)

Events bubble up through nested components, preserving full context:

```plaintext
lf-slider (change)
    └─→ lf-accordion (lf-event)
        └─→ lf-shapeeditor (lf-event)
            └─→ Consumer handler
                    │
                    ├─→ Extract: e.detail.originalEvent.detail.comp
                    ├─→ Get value: comp.lfValue
                    └─→ Apply to preview via LfEffects API
```

**Consumer Access Pattern**:

```typescript
shapeeditor.addEventListener('lf-shapeeditor-event', (e) => {
  if (e.detail.eventType === 'lf-event') {
    const originalEvent = e.detail.originalEvent;
    const controlComp = originalEvent.detail.comp;
    const controlId = controlComp.id;
    const value = controlComp.lfValue;

    // Apply to your domain logic
    applyEffect(controlId, value);
  }
});
```

---

## Public API

### Props

```typescript
interface LfShapeeditorPropsInterface {
  /** Dataset for navigation masonry */
  lfDataset?: LfDataDataset;

  /** Callback when load button is clicked */
  lfLoadCallback?: LfShapeeditorLoadCallback;

  /** Navigation panel configuration */
  lfNavigation?: LfShapeeditorNavigation;

  /** Shape type for preview ("image", "chart", "card", etc.) */
  lfShape?: LfDataShapes;

  /** Custom CSS styles */
  lfStyle?: string;

  /** Current value to render in preview */
  lfValue?: LfDataDataset;
}
```

### Methods

```typescript
interface LfShapeeditorInterface {
  /** Add a snapshot to history */
  addSnapshot(value: string): Promise<void>;

  /** Clear history (optionally from specific index) */
  clearHistory(index?: number): Promise<void>;

  /** Clear current selection */
  clearSelection(): Promise<void>;

  /** Get references to all internal components */
  getComponents(): Promise<LfShapeeditorAdapterRefs>;

  /** Get current snapshot state */
  getCurrentSnapshot(): Promise<{ shape: LfMasonrySelectedShape; value: string }>;

  /** Get current configuration settings */
  getSettings(): Promise<LfShapeeditorConfigSettings>;

  /** Set configuration settings */
  setSettings(settings: LfShapeeditorConfigSettings, replace?: boolean): Promise<void>;

  /** Reset component state */
  reset(): Promise<void>;

  /** Control spinner visibility */
  setSpinnerStatus(status: boolean): Promise<void>;
}
```

### Component References (`getComponents()`)

```typescript
interface LfShapeeditorAdapterRefs {
  details: {
    clearHistory: LfButtonElement;
    deleteShape: LfButtonElement;
    redo: LfButtonElement;
    save: LfButtonElement;
    settings: HTMLElement;       // Config panel container
    shape: HTMLElement;          // Preview container
    spinner: LfSpinnerElement;
    tree: LfTreeElement;
    undo: LfButtonElement;
  };
  navigation: {
    load: LfButtonElement;
    masonry: LfMasonryElement;
    navToggle: LfButtonElement;
    tree: LfTreeElement;
    textfield: LfTextfieldElement;
  };
}
```

---

## Configuration DSL Reference

### Control Definition

```typescript
interface LfShapeeditorControlConfigBase<T> {
  id: string;           // Unique identifier (used in settings map)
  type: T;              // Control type discriminator
  label: string;        // Display label
  description?: string; // Tooltip/help text
}
```

### Control-Specific Options

```typescript
// Slider
interface LfShapeeditorSliderConfig {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;  // e.g., "px", "%", "ms"
}

// Select
interface LfShapeeditorSelectConfig {
  options: Array<{ value: string; label: string }>;
  defaultValue: string;
}

// Toggle/Checkbox
interface LfShapeeditorToggleConfig {
  defaultValue: boolean;
}

// Textfield
interface LfShapeeditorTextfieldConfig {
  defaultValue: string;
  placeholder?: string;
  pattern?: string;
}

// Colorpicker
interface LfShapeeditorColorpickerConfig {
  defaultValue: string;
  swatches?: string[];
}

// Number
interface LfShapeeditorNumberConfig {
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number;
}

// Multiinput
interface LfShapeeditorMultiinputConfig {
  defaultValue: string;
  placeholder?: string;
}
```

### Layout Grouping

```typescript
interface LfShapeeditorLayoutGroup {
  id: string;           // Accordion section ID
  label: string;        // Section header
  icon?: LfIconType;    // Optional icon
  controlIds: string[]; // Controls in this group
}

type LfShapeeditorLayout = LfShapeeditorLayoutGroup[];
```

### Complete DSL Example

```typescript
const SPOTLIGHT_DSL: LfShapeeditorConfigDsl = {
  controls: [
    {
      id: "beam",
      type: "select",
      label: "Beam Shape",
      description: "The shape and spread pattern of the light beam",
      options: [
        { value: "cone", label: "Cone" },
        { value: "narrow", label: "Narrow" },
        { value: "diffuse", label: "Diffuse" },
      ],
      defaultValue: "cone",
    },
    {
      id: "intensity",
      type: "slider",
      label: "Intensity",
      min: 0,
      max: 1,
      step: 0.05,
      defaultValue: 0.8,
    },
    {
      id: "surfaceGlow",
      type: "toggle",
      label: "Surface Glow",
      defaultValue: true,
    },
  ],
  defaultSettings: {
    beam: "cone",
    intensity: 0.8,
    surfaceGlow: true,
  },
  layout: [
    {
      id: "appearance",
      label: "Appearance",
      icon: "palette",
      controlIds: ["beam", "intensity"],
    },
    {
      id: "effects",
      label: "Effects",
      icon: "auto_awesome",
      controlIds: ["surfaceGlow"],
    },
  ],
};
```

---

## Consumer Integration Guide

### Step 1: Define the DSL

Create a configuration DSL for your domain (effects, filters, etc.):

```typescript
// effects.ts
export const SPOTLIGHT_EFFECT: EffectDefinition = {
  id: "spotlight",
  name: "Spotlight",
  controls: [...],
  defaultSettings: {...},
  layout: [...],
};
```

### Step 2: Set Up the Shapeeditor

Pass the DSL to the shapeeditor's adapter:

```typescript
// In your consumer component
const adapter = this.shapeeditorRef.getAdapter();
adapter.controller.set.config.controls(SPOTLIGHT_EFFECT.controls);
adapter.controller.set.config.settings(SPOTLIGHT_EFFECT.defaultSettings);
adapter.controller.set.config.layout(SPOTLIGHT_EFFECT.layout);
```

### Step 3: Handle Events

Listen for `lf-event` and apply changes to your preview:

```typescript
shapeeditor.addEventListener('lf-shapeeditor-event', async (e) => {
  const { eventType, originalEvent } = e.detail;

  if (eventType === 'lf-event') {
    // Get current settings
    const settings = await shapeeditor.getSettings();

    // Apply effect to preview element
    const { shape } = await shapeeditor.getComponents().details;
    const previewEl = shape.querySelector('lf-image');

    lfEffects.register.spotlight(previewEl, {
      beam: settings.beam,
      intensity: settings.intensity,
      surfaceGlow: settings.surfaceGlow,
    });
  }
});
```

### Step 4: Programmatic Updates

Use `setSettings()` for preset loading:

```typescript
// Load a preset
const preset = SPOTLIGHT_EFFECT.presets.find(p => p.id === 'dramatic');
await shapeeditor.setSettings(preset.settings);

// Merge partial updates
await shapeeditor.setSettings({ intensity: 0.5 }, false);

// Replace all settings
await shapeeditor.setSettings(newSettings, true);
```

---

## History Management

### Snapshot System

The shapeeditor maintains a history of shape selections:

```typescript
type LfShapeeditorHistory = {
  [index: number]: Array<LfMasonrySelectedShape>;
};
```

### History Operations

| Action | Method | Description |
|--------|--------|-------------|
| Add snapshot | `addSnapshot(value)` | Save current state |
| Undo | Undo button / Ctrl+Z | Go to previous snapshot |
| Redo | Redo button / Ctrl+Y | Go to next snapshot |
| Clear | `clearHistory(index?)` | Remove history entries |
| Save | Save button | Commit current snapshot |

### History Events

```typescript
// Listen for history changes
shapeeditor.addEventListener('lf-shapeeditor-event', (e) => {
  switch (e.detail.eventType) {
    case 'lf-event':
      // Control changed, consider auto-snapshot
      break;
  }
});
```

---

## Accordion State Persistence

The accordion state (which groups are expanded) is preserved across re-renders using ID-based tracking:

```typescript
// Internal state
@State() expandedSettingsGroups: string[] = [];

// Passed to accordion
<lf-accordion
  lfExpanded={expandedGroups}
  onLf-accordion-event={accordionToggle}
>
```

This solves the "accordion collapse on value change" issue by using stable string IDs rather than object references.

---

## Comparison: Shapeeditor vs ImageEditor PoC

| Aspect | ImageEditor (ComfyUI PoC) | Shapeeditor |
|--------|---------------------------|-------------|
| **Rendering** | Imperative DOM manipulation | Reactive JSX |
| **Settings** | Hardcoded filter definitions | DSL-driven `LfShapeeditorConfigDsl` |
| **Logic** | Tightly coupled to backend | "Dumb" exoskeleton |
| **Preview updates** | Internal callbacks | Consumer handles via events |
| **State ownership** | Component owns filter state | Consumer owns domain state |
| **Flexibility** | Image-specific | Any LfShape type |

---

## Use Case Matrix

| Use Case | Navigation | Preview | Config | Consumer Logic |
|----------|------------|---------|--------|----------------|
| **Effects Playground** | Effect presets | Image with effect | Effect params | Apply LfEffects API |
| **Theme Editor** | Theme variants | Any component | CSS variables | Apply theme changes |
| **Data API Explorer** | API endpoints | JSON output | Request params | Execute API calls |
| **Component Showcase** | Components | Live component | Props editor | Update component props |
| **Chart Builder** | Chart types | Chart | Chart options | Update chart config |

---

## File Structure

```plaintext
packages/core/src/components/lf-shapeeditor/
├── lf-shapeeditor.tsx           # Main Stencil component
├── lf-shapeeditor.scss          # Styles
├── lf-shapeeditor-adapter.ts    # Adapter factory
├── elements.details.tsx         # Details panel JSX (preview, config)
├── elements.navigation.tsx      # Navigation panel JSX (masonry, tree)
├── handlers.details.ts          # Details panel event handlers
├── handlers.navigation.ts       # Navigation panel event handlers
├── helpers.utils.ts             # Shared utilities
└── readme.md                    # Auto-generated docs

packages/foundations/src/components/
├── shapeeditor.constants.ts     # Block names, events, IDs, parts
└── shapeeditor.declarations.ts  # TypeScript interfaces
```

---

## Debugging Tips

### 1. Inspect Component References

```typescript
const components = await shapeeditor.getComponents();
console.log('Masonry:', components.navigation.masonry);
console.log('Settings container:', components.details.settings);
```

### 2. Check Current Settings

```typescript
const settings = await shapeeditor.getSettings();
console.log('Current config:', settings);
```

### 3. Monitor Events

```typescript
shapeeditor.addEventListener('lf-shapeeditor-event', (e) => {
  console.log('Event:', e.detail.eventType);
  console.log('Original:', e.detail.originalEvent?.detail);
});
```

### 4. Force Re-render

```typescript
// Trigger settings update to force re-render
const current = await shapeeditor.getSettings();
await shapeeditor.setSettings(current, true);
```

---

## Migration from lf-imageviewer

### Import Changes

```typescript
// Before
import { LfImageviewerInterface } from "@lf-widgets/foundations";

// After
import { LfShapeeditorInterface } from "@lf-widgets/foundations";
```

### Event Name Changes

```typescript
// Before
element.addEventListener('lf-imageviewer-event', handler);

// After
element.addEventListener('lf-shapeeditor-event', handler);
```

### New Capabilities

- `getSettings()` / `setSettings()` for programmatic config access
- DSL-driven configuration instead of hardcoded slots
- `getComponents()` for full internal component access
- Accordion state persistence across re-renders

---

## Success Criteria

- [x] 4-panel layout with masonry, tree, preview, and config
- [x] DSL-driven configuration controls (8 types)
- [x] Event bubbling via Matryoshka pattern
- [x] History management (undo/redo/snapshots)
- [x] `getComponents()` for DOM access
- [x] `getSettings()` / `setSettings()` for config state
- [x] Accordion state persistence
- [ ] Effects Playground pilot (in progress)
- [ ] ComfyUI migration (pending pilot validation)

---

## References

- `packages/showcase/src/components/lf-showcase/assets/data/effects.ts` - Effect DSL definitions
- `packages/core/src/components/lf-shapeeditor/` - Component implementation
- `packages/foundations/src/components/shapeeditor.*` - Type definitions
- `docs/web/src/helpers/imageEditor/` - ComfyUI PoC reference (deprecated)

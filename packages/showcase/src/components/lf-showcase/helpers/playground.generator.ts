import {
  LF_THEME_ICONS,
  LF_THEME_UI_SIZES,
  LF_THEME_UI_STATES,
  LfComponentName,
  LfComponentTag,
  LfDataCell,
  LfDataCellContainer,
  LfDataDataset,
  LfDataNode,
  LfDataShapes,
  LfIconType,
  LfShapeeditorConfigDsl,
  LfShapeeditorConfigSettings,
  LfShapeeditorControlConfig,
  LfShapeeditorElement,
  LfShapeeditorNumberConfig,
  LfShapeeditorPropsInterface,
  LfShapeeditorSelectConfig,
  LfShapeeditorTextfieldConfig,
  LfShapeeditorToggleConfig,
} from "@lf-widgets/foundations";
import { LF_DOC } from "../assets/doc";
import {
  LfShowcaseDocMethod,
  LfShowcaseDocProp,
  LfShowcaseDocStyle,
  LfShowcasePlayground,
} from "../lf-showcase-declarations";

//#region Control Factory Types
interface ToggleOptions {
  defaultValue: boolean;
  label?: string;
  description?: string;
}
interface SelectOptions {
  options: { value: string; label: string }[];
  defaultValue: string;
  label?: string;
  description?: string;
}
interface NumberOptions {
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
}
interface TextfieldOptions {
  defaultValue: string;
  placeholder?: string;
  label?: string;
  description?: string;
}

const idToLabel = (id: string): string =>
  id
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Inline control factory for playground generation.
 */
const control = {
  toggle: (id: string, opts: ToggleOptions): LfShapeeditorToggleConfig => ({
    id,
    type: "toggle",
    label: opts.label ?? idToLabel(id),
    description: opts.description,
    defaultValue: opts.defaultValue,
  }),
  select: (id: string, opts: SelectOptions): LfShapeeditorSelectConfig => ({
    id,
    type: "select",
    label: opts.label ?? idToLabel(id),
    description: opts.description,
    options: opts.options,
    defaultValue: opts.defaultValue,
  }),
  number: (id: string, opts: NumberOptions): LfShapeeditorNumberConfig => ({
    id,
    type: "number",
    label: opts.label ?? idToLabel(id),
    description: opts.description,
    min: opts.min,
    max: opts.max,
    step: opts.step,
    defaultValue: opts.defaultValue,
  }),
  textfield: (
    id: string,
    opts: TextfieldOptions,
  ): LfShapeeditorTextfieldConfig => ({
    id,
    type: "textfield",
    label: opts.label ?? idToLabel(id),
    description: opts.description,
    defaultValue: opts.defaultValue,
    placeholder: opts.placeholder,
  }),
};
//#endregion

//#region Shape Mapping
/**
 * Maps a component name to a shapeeditor shape.
 */
export const componentToShape = (
  componentName: LfComponentName,
): LfDataShapes | null => {
  const mapping: Partial<Record<LfComponentName, LfDataShapes>> = {
    LfAccordion: "accordion",
    LfBadge: "badge",
    LfButton: "button",
    LfCanvas: "canvas",
    LfCard: "card",
    LfChart: "chart",
    LfChat: "chat",
    LfChip: "chip",
    LfCode: "code",
    LfImage: "image",
    LfPhotoframe: "photoframe",
    LfProgressbar: "progressbar",
    LfTextfield: "textfield",
    LfToggle: "toggle",
    LfTypewriter: "typewriter",
    LfUpload: "upload",
  };
  return mapping[componentName] ?? null;
};
//#endregion

//#region Sync Utilities
/**
 * Creates a mapping from control IDs (prop names) to prop keys.
 * Used for bidirectional sync between controls and shape cells.
 */
export const createPropMapping = (
  props: LfShowcaseDocProp[],
): Map<string, string> => {
  const mapping = new Map<string, string>();
  for (const prop of props) {
    const ctrl = propToControl(prop);
    if (ctrl) {
      // Control ID equals prop name (e.g., "lfLabel" → "lfLabel")
      mapping.set(ctrl.id, prop.name);
    }
  }
  return mapping;
};

/**
 * Syncs shapeeditor controls FROM a selected shape's cell.
 * Reads the cell's props and calls setSettings() to update control values.
 *
 * @param shapeeditor - The shapeeditor element
 * @param cell - The selected shape's cell data
 * @param mapping - Map from control IDs to prop keys
 */
export const syncControlsFromShape = async (
  shapeeditor: LfShapeeditorElement,
  cell: LfDataCell<LfDataShapes>,
  mapping: Map<string, string>,
): Promise<void> => {
  const settings: LfShapeeditorConfigSettings = {};

  for (const [controlId, propKey] of mapping) {
    const value = cell[propKey as keyof typeof cell];
    if (value !== undefined) {
      // Only sync values that exist in the cell
      settings[controlId] = value as string | number | boolean;
    }
  }

  // Replace all settings to ensure clean state
  await shapeeditor.setSettings(settings, true);
};

/**
 * Syncs a shape's cell FROM control settings.
 * Returns a new dataset with the updated cell (immutable update).
 *
 * @param dataset - The current dataset
 * @param nodeIndex - Index of the node to update
 * @param settings - Current control settings
 * @param mapping - Map from control IDs to prop keys
 * @param cellKey - The cell key (e.g., "lfButton")
 * @returns New dataset with updated cell
 */
export const syncShapeFromControls = (
  dataset: LfDataDataset,
  nodeIndex: number,
  settings: LfShapeeditorConfigSettings,
  mapping: Map<string, string>,
  cellKey: string,
): LfDataDataset => {
  const nodes = [...dataset.nodes];
  const node = nodes[nodeIndex];

  if (!node?.cells?.[cellKey]) {
    console.warn(
      `[Playground] Node at index ${nodeIndex} has no cell "${cellKey}"`,
    );
    return dataset;
  }

  // Clone the cell and update props from settings
  const updatedCell = { ...node.cells[cellKey] };
  for (const [controlId, propKey] of mapping) {
    const value = settings[controlId];
    if (value !== undefined) {
      (updatedCell as Record<string, unknown>)[propKey] = value;
    }
  }

  // Immutable update: new node with new cells
  nodes[nodeIndex] = {
    ...node,
    cells: {
      ...node.cells,
      [cellKey]: updatedCell,
    },
  };

  return { ...dataset, nodes };
};

/**
 * Updates a node's cell in the dataset (for undo/redo operations).
 * Returns a new dataset with the updated cell (immutable update).
 *
 * @param dataset - The current dataset
 * @param nodeIndex - Index of the node to update
 * @param cellKey - The cell key (e.g., "lfButton")
 * @param newCell - The new cell data
 * @returns New dataset with updated cell
 */
export const updateNodeCell = (
  dataset: LfDataDataset,
  nodeIndex: number,
  cellKey: string,
  newCell: LfDataCell<LfDataShapes>,
): LfDataDataset => {
  const nodes = [...dataset.nodes];
  const node = nodes[nodeIndex];

  if (!node) {
    console.warn(`[Playground] No node at index ${nodeIndex}`);
    return dataset;
  }

  nodes[nodeIndex] = {
    ...node,
    cells: {
      ...node.cells,
      [cellKey]: newCell,
    },
  };

  return { ...dataset, nodes };
};

/**
 * Extracts the cell key from a component name.
 * "LfButton" → "lfButton", "LfCanvas" → "lfCanvas"
 */
export const getCellKeyFromComponent = (
  componentName: LfComponentName,
): string => {
  const shape = componentToShape(componentName);
  if (!shape) {
    return "";
  }
  return `lf${shape.charAt(0).toUpperCase()}${shape.slice(1)}`;
};

/**
 * Updates the current snapshot's cell props from control settings.
 * This creates a new snapshot with the updated props, allowing the preview
 * to update without modifying the dataset.
 * The dataset is only updated when "Save Snapshot" is clicked.
 *
 * @param shapeeditor - The shapeeditor element
 * @param settings - Current control settings
 * @param mapping - Map from control IDs to prop keys
 */
export const updatePreviewFromSettings = async (
  shapeeditor: LfShapeeditorElement,
  settings: LfShapeeditorConfigSettings,
  mapping: Map<string, string>,
): Promise<void> => {
  // Build props object from settings using the mapping
  const props: Record<string, unknown> = {};
  for (const [controlId, propKey] of mapping) {
    const value = settings[controlId];
    if (value !== undefined) {
      props[propKey] = value;
    }
  }

  // Add a new snapshot with the updated props
  await shapeeditor.addSnapshot(props);
};
//#endregion

//#region Types
/**
 * Playground tree category identifiers.
 */
export type PlaygroundCategory = "props" | "apis" | "events" | "css" | "debug";

/**
 * Context for generating playground configuration.
 */
export interface PlaygroundContext<
  C extends LfComponentName = LfComponentName,
> {
  componentName: C;
  tag: LfComponentTag<C>;
  props: LfShowcaseDocProp[];
  methods: LfShowcaseDocMethod[];
  styles: LfShowcaseDocStyle[];
  eventTypes: readonly string[];
}

/**
 * Generated playground configuration.
 */
export interface PlaygroundConfig {
  settingsDataset: LfDataDataset;
}
//#endregion

//#region Type Parsing
/**
 * Parses a TypeScript union type string into its constituent values.
 * @example parseUnionType('"flat" | "outlined" | "raised"') // ["flat", "outlined", "raised"]
 */
const parseUnionType = (typeStr: string): string[] => {
  const matches = typeStr.match(/["']([^"']+)["']/g);
  if (matches) {
    return matches.map((m) => m.replace(/["']/g, ""));
  }
  return [];
};

const isBooleanType = (typeStr: string): boolean =>
  typeStr === "boolean" ||
  typeStr === "true | false" ||
  typeStr === "false | true";

const isNumberType = (typeStr: string): boolean => typeStr === "number";

const isStringType = (typeStr: string): boolean => typeStr === "string";

const isStringUnionType = (typeStr: string): boolean =>
  typeStr.includes("|") && typeStr.includes('"');

const isComplexType = (typeStr: string): boolean =>
  typeStr.includes("{") ||
  typeStr.includes("[]") ||
  typeStr.includes("=>") ||
  typeStr.includes("Dataset") ||
  typeStr.includes("Interface") ||
  typeStr.startsWith("Lf");
//#endregion

//#region Control Mapping
/**
 * Prop names that should use specific control types.
 */
const PROP_CONTROL_OVERRIDES: Record<
  string,
  (prop: LfShowcaseDocProp) => LfShapeeditorControlConfig | null
> = {
  lfIcon: (prop) => {
    const icons = Object.values(LF_THEME_ICONS).slice(0, 50);
    const opts: SelectOptions = {
      options: [
        { value: "", label: "(none)" },
        ...icons.map((icon) => ({ value: icon, label: icon })),
      ],
      defaultValue: "",
      description: prop.docs,
    };
    return control.select(prop.name, opts);
  },
  lfIconOff: (prop) => {
    const icons = Object.values(LF_THEME_ICONS).slice(0, 50);
    const opts: SelectOptions = {
      options: [
        { value: "", label: "(none)" },
        ...icons.map((icon) => ({ value: icon, label: icon })),
      ],
      defaultValue: "",
      description: prop.docs,
    };
    return control.select(prop.name, opts);
  },
  lfUiSize: (prop) => {
    const opts: SelectOptions = {
      options: Object.values(LF_THEME_UI_SIZES).map((size) => ({
        value: size,
        label: size,
      })),
      defaultValue: "medium",
      description: prop.docs,
    };
    return control.select(prop.name, opts);
  },
  lfUiState: (prop) => {
    const opts: SelectOptions = {
      options: [
        { value: "", label: "(none)" },
        ...Object.values(LF_THEME_UI_STATES).map((state) => ({
          value: state,
          label: state,
        })),
      ],
      defaultValue: "",
      description: prop.docs,
    };
    return control.select(prop.name, opts);
  },
  // Skip complex props
  lfDataset: () => null,
  lfValue: () => null,
};

/**
 * Maps a prop to a control configuration.
 * Returns null if the prop cannot be mapped to a simple control.
 */
export const propToControl = (
  prop: LfShowcaseDocProp,
): LfShapeeditorControlConfig | null => {
  const { name, type, docs } = prop;

  if (PROP_CONTROL_OVERRIDES[name]) {
    return PROP_CONTROL_OVERRIDES[name](prop);
  }

  if (isComplexType(type)) {
    return null;
  }

  if (isBooleanType(type)) {
    const opts: ToggleOptions = { defaultValue: false, description: docs };
    return control.toggle(name, opts);
  }

  if (isNumberType(type)) {
    const opts: NumberOptions = { defaultValue: 0, description: docs };
    return control.number(name, opts);
  }

  if (isStringUnionType(type)) {
    const values = parseUnionType(type);
    if (values.length > 0 && values.length <= 20) {
      const opts: SelectOptions = {
        options: values.map((v) => ({ value: v, label: v })),
        defaultValue: values[0],
        description: docs,
      };
      return control.select(name, opts);
    }
    const opts: TextfieldOptions = {
      defaultValue: "",
      placeholder: `Enter ${name}`,
      description: docs,
    };
    return control.textfield(name, opts);
  }

  if (isStringType(type)) {
    const opts: TextfieldOptions = {
      defaultValue: "",
      placeholder: `Enter ${name}`,
      description: docs,
    };
    return control.textfield(name, opts);
  }

  return null;
};
//#endregion

//#region DSL Generation
/**
 * Creates a DSL configuration for a single control.
 * Each prop gets its own DSL so clicking the leaf shows only that control.
 */
const createSingleControlDsl = (
  ctrl: LfShapeeditorControlConfig,
): LfShapeeditorConfigDsl => ({
  controls: [ctrl],
  layout: [
    {
      id: `${ctrl.id}_group`,
      label: ctrl.label,
      controlIds: [ctrl.id],
    },
  ],
  defaultSettings: {
    [ctrl.id]: ctrl.defaultValue,
  },
  behavior: "live",
  enablePreview: true,
});
//#endregion

//#region Tree Generation
/**
 * Creates a leaf node with DSL configuration embedded in cells.lfCode.
 */
const createDslLeafNode = (
  id: string,
  label: string,
  icon: LfIconType | undefined,
  dsl: LfShapeeditorConfigDsl,
  description?: string,
): LfDataNode => ({
  id,
  value: label,
  icon,
  description,
  cells: {
    lfCode: {
      shape: "code",
      value: JSON.stringify(dsl),
    },
  },
});

/**
 * Creates a Props category node with individual leaf children per prop.
 * Each prop leaf has its own DSL with a single control.
 */
const createPropsCategoryNode = (
  props: LfShowcaseDocProp[],
): LfDataNode | null => {
  const children: LfDataNode[] = [];

  for (const prop of props) {
    const ctrl = propToControl(prop);
    if (ctrl) {
      const dsl = createSingleControlDsl(ctrl);
      children.push(
        createDslLeafNode(
          `prop_${prop.name}`,
          prop.name,
          getIconForControlType(ctrl.type),
          dsl,
          prop.docs,
        ),
      );
    }
  }

  if (children.length === 0) {
    return null;
  }

  return {
    id: "props",
    value: "Props",
    icon: "settings" as LfIconType,
    description: "Modify component properties",
    children,
  };
};

/**
 * Maps control type to an appropriate icon.
 */
const getIconForControlType = (type: string): LfIconType => {
  const iconMap: Record<string, LfIconType> = {
    toggle: "toggle-right",
    checkbox: "checkbox",
    select: "list",
    number: "numbers",
    slider: "adjustments-horizontal",
    textfield: "forms",
    colorpicker: "palette",
    multiinput: "list-tree",
  };
  return iconMap[type] || "settings";
};

/**
 * Creates a CSS Variables category node with individual leaf children per style.
 */
const createCssCategoryNode = (
  styles: LfShowcaseDocStyle[],
): LfDataNode | null => {
  if (styles.length === 0) {
    return null;
  }

  const children: LfDataNode[] = styles.map((style) => {
    const opts: TextfieldOptions = {
      defaultValue: "",
      placeholder: "e.g., red, #fff, 2px",
      description: style.docs,
    };
    const ctrl = control.textfield(style.name, opts);
    const dsl = createSingleControlDsl(ctrl);

    return createDslLeafNode(
      `css_${style.name}`,
      style.name,
      "palette" as LfIconType,
      dsl,
      style.docs,
    );
  });

  return {
    id: "css",
    value: "CSS Variables",
    icon: "palette" as LfIconType,
    description: "Customize component styling",
    children,
  };
};

/**
 * Creates an events category node (no controls, just informational).
 */
const createEventsCategoryNode = (
  eventTypes: readonly string[],
): LfDataNode | null => {
  if (eventTypes.length === 0) {
    return null;
  }

  // Events don't have controls - they're just listed for reference
  const children: LfDataNode[] = eventTypes.map((eventType) => ({
    id: `event_${eventType}`,
    value: eventType,
    description: `Fired on ${eventType}`,
    icon: "bell-ringing" as LfIconType,
  }));

  return {
    id: "events",
    value: "Events",
    icon: "bell-ringing" as LfIconType,
    description: "Component events",
    children,
  };
};

/**
 * Creates an APIs category node.
 */
const createApisCategoryNode = (
  methods: LfShowcaseDocMethod[],
): LfDataNode | null => {
  const excluded = ["getDebugInfo", "getProps", "refresh", "unmount"];
  const filtered = methods.filter((m) => !excluded.includes(m.name));

  if (filtered.length === 0) {
    return null;
  }

  // APIs are informational - methods that can be invoked
  const children: LfDataNode[] = filtered.map((method) => ({
    id: `api_${method.name}`,
    value: method.name,
    description: method.docs,
    icon: "code" as LfIconType,
  }));

  return {
    id: "apis",
    value: "APIs",
    icon: "code" as LfIconType,
    description: "Component methods",
    children,
  };
};
//#endregion

//#region Main Generator
/**
 * Creates a playground context from a component tag.
 */
export const createPlaygroundContext = <C extends LfComponentName>(
  componentName: C,
  tag: LfComponentTag<C>,
  eventTypes: readonly string[],
): PlaygroundContext<C> => {
  const doc = LF_DOC[tag] as {
    methods: LfShowcaseDocMethod[];
    props: LfShowcaseDocProp[];
    styles: LfShowcaseDocStyle[];
  };

  return {
    componentName,
    tag,
    props: doc.props || [],
    methods: doc.methods || [],
    styles: doc.styles || [],
    eventTypes,
  };
};

/**
 * Generates a complete playground configuration for a component.
 *
 * The settings dataset contains leaf nodes with DSL configurations
 * that the shapeeditor can parse and render as controls.
 */
export const generatePlaygroundConfig = <C extends LfComponentName>(
  ctx: PlaygroundContext<C>,
): PlaygroundConfig => {
  const nodes: LfDataNode[] = [];

  // Props category - main leaf with all prop controls
  const propsNode = createPropsCategoryNode(ctx.props);
  if (propsNode) {
    nodes.push(propsNode);
  }

  // CSS Variables category
  const cssNode = createCssCategoryNode(ctx.styles);
  if (cssNode) {
    nodes.push(cssNode);
  }

  // Events category (informational only)
  const eventsNode = createEventsCategoryNode(ctx.eventTypes);
  if (eventsNode) {
    nodes.push(eventsNode);
  }

  // APIs category (informational only)
  const apisNode = createApisCategoryNode(ctx.methods);
  if (apisNode) {
    nodes.push(apisNode);
  }

  return {
    settingsDataset: { nodes },
  };
};

/**
 * Shape variant configuration for multi-shape playgrounds.
 */
export interface PlaygroundShapeVariant {
  id: string;
  label: string;
  props: Record<string, unknown>;
}

/**
 * Creates a complete LfShowcasePlayground configuration for a component.
 * Supports single or multiple shape variants in the preview masonry.
 *
 * @example
 * ```typescript
 * import { LF_BUTTON_EVENTS } from "@lf-widgets/foundations";
 *
 * // Single shape
 * const playground = createComponentPlayground({
 *   componentName: "LfButton",
 *   tag: "lf-button",
 *   eventTypes: LF_BUTTON_EVENTS,
 *   initialProps: { lfLabel: "Click Me", lfStyling: "raised" },
 * });
 *
 * // Multiple shapes
 * const playground = createComponentPlayground({
 *   componentName: "LfButton",
 *   tag: "lf-button",
 *   eventTypes: LF_BUTTON_EVENTS,
 *   variants: [
 *     { id: "raised", label: "Raised", props: { lfLabel: "Raised", lfStyling: "raised" } },
 *     { id: "flat", label: "Flat", props: { lfLabel: "Flat", lfStyling: "flat" } },
 *   ],
 * });
 * ```
 */
export const createComponentPlayground = <C extends LfComponentName>(options: {
  componentName: C;
  tag: LfComponentTag<C>;
  eventTypes: readonly string[];
  initialProps?: Record<string, unknown>;
  variants?: PlaygroundShapeVariant[];
  description?: string;
}): LfShowcasePlayground | null => {
  const {
    componentName,
    tag,
    eventTypes,
    initialProps = {},
    variants,
    description,
  } = options;

  const shape = componentToShape(componentName);
  if (!shape) {
    console.warn(
      `[Playground] Component ${componentName} does not have a shape mapping`,
    );
    return null;
  }

  const ctx = createPlaygroundContext(componentName, tag, eventTypes);
  const config = generatePlaygroundConfig(ctx);

  // Generate the cell key: shape "button" → "lfButton", "canvas" → "lfCanvas"
  const cellKey = `lf${shape.charAt(0).toUpperCase()}${shape.slice(1)}`;

  // Create preview dataset with single or multiple shapes
  const nodes: LfDataNode[] = variants
    ? variants.map((variant) => ({
        id: variant.id,
        value: variant.label,
        cells: {
          [cellKey]: {
            shape,
            value: variant.label,
            ...variant.props,
          },
        } as LfDataCellContainer,
      }))
    : [
        {
          id: "component-preview",
          value: componentName,
          cells: {
            [cellKey]: {
              shape,
              value: componentName,
              ...initialProps,
            },
          } as LfDataCellContainer,
        },
      ];

  const previewDataset: LfDataDataset = { nodes };

  const props: LfShapeeditorPropsInterface = {
    lfDataset: previewDataset,
    lfShape: shape,
    lfValue: config.settingsDataset,
  };

  return {
    description:
      description ??
      `Interactive playground for ${componentName}. ` +
        (variants
          ? `Select a ${componentName.replace("Lf", "")} variant to edit its props.`
          : `Select "Props" to modify component properties in real-time.`),
    props,
  };
};
//#endregion

import {
  CY_ATTRIBUTES,
  LfComponentName,
  LfComponentRootElement,
  LfFrameworkInterface,
  LfDataCell,
  LfDataDataset,
  LfDataNode,
  LfDataShapeCallback,
  LfDataShapeEventDispatcher,
  LfDataShapeRefCallback,
  LfDataShapes,
  LfDataShapesMap,
  LfEvent,
  LfEventPayload,
} from "@lf-widgets/foundations";
import { h, VNode } from "@stencil/core";
import { nodeExists } from "./helpers.node";

//#region cellDecorateShapes
/**
 * Creates an array of virtual nodes based on the provided shape and items configuration.
 *
 * @template C - Type extending LfComponentName
 * @template S - Type extending LfDataShapes or "text"
 *
 * @param {LfFramework} lfFramework - Manager instance containing data and sanitization utilities
 * @param {C} component - The component name
 * @param {S} shape - The shape type to render ("slot", "number", "text" or other LfDataShapes)
 * @param {Partial<LfDataCell<S>>[]} items - Array of cell data items to render
 * @param {LfDataShapeEventDispatcher} eventDispatcher - Function to dispatch shape events
 * @param {Partial<LfDataCell<S>>[]} [defaultProps] - Optional array of default properties for each item
 * @param {LfDataShapeCallback<C, S>} [defaultCb] - Optional default callback for shape events (not applicable for "text" shape)
 * @param {Array<LfDataShapeRefCallback<C>>} [refsCb] - Optional array of ref callbacks for each item
 *
 * @returns {VNode[]} Array of virtual nodes representing the rendered shapes
 *
 * @description
 * This function handles the creation of different types of elements based on the shape parameter:
 * - For "slot" shape: Creates slot elements with name attribute
 * - For "number" or "text" shapes: Creates div elements with the value
 * - For other shapes: Creates custom elements with event handling and ref binding
 */
export const cellDecorateShapes = <
  C extends LfComponentName,
  S extends LfDataShapes | "text",
>(
  lfFramework: LfFrameworkInterface,
  component: C,
  shape: S,
  items: Partial<LfDataCell<S>>[],
  eventDispatcher: LfDataShapeEventDispatcher,
  defaultProps?: Partial<LfDataCell<S>>[],
  defaultCb?: S extends "text" ? never : LfDataShapeCallback<C, S>,
  refsCb?: Array<LfDataShapeRefCallback<C>>,
) => {
  const { data, sanitizeProps } = lfFramework;
  const { stringify } = data.cell;

  const elements: VNode[] = [];

  switch (shape) {
    case "slot":
      for (let index = 0; items && index < items.length; index++) {
        elements.push(
          <slot
            key={`${shape}${index}`}
            name={stringify(items[index].value)}
          ></slot>,
        );
      }
      break;
    case "number":
    case "text":
      for (let index = 0; items && index < items.length; index++) {
        elements.push(
          <div id={`${shape}${index}`} key={`${shape}${index}`}>
            {items[index].value}
          </div>,
        );
      }
      break;
    default:
      for (let index = 0; items && index < items.length; index++) {
        const props = items[index];
        const toSpread = {};
        if (defaultProps?.[index]) {
          decorateSpreader(toSpread, defaultProps[index] as LfDataCell);
        }
        decorateSpreader(toSpread, props as LfDataCell);

        const TagName = "lf-" + shape;
        const eventHandler = {
          ["onLf-" + shape + "-event"]: (e: LfEvent<LfEventPayload<C>>) => {
            if (defaultCb) {
              defaultCb(e);
            }
            eventDispatcher(e);
          },
        };

        elements.push(
          h(
            TagName,
            {
              "data-component": component,
              "data-cy": CY_ATTRIBUTES.shape,
              id: `${shape}${index}`,
              key: `${shape}${index}`,
              ref: (el: LfComponentRootElement<C>) => {
                if (el && Array.isArray(refsCb) && refsCb[index]) {
                  const cb = refsCb[index];
                  cb(el);
                }
              },
              ...eventHandler,
              ...sanitizeProps(toSpread, component),
            },
            null,
          ),
        );
      }
      break;
  }

  return elements;
};
//#endregion

//#region cellExists
/**
 * Checks if a data node has any cells defined.
 * @param node - The node to check for cells existence
 * @returns {boolean} True if the node has at least one cell, false otherwise
 */
export const cellExists = (node: LfDataNode) => {
  return !!(node && node.cells && Object.keys(node.cells).length);
};
//#endregion

//#region cellGetShape
/**
 * Extracts and processes shape properties from a data cell, with an option for deep copying.
 *
 * @template T - Type extending LfDataShapes
 * @param {LfDataCell<T>} cell - The source data cell to extract properties from
 * @param {boolean} deepCopy - Flag to determine if a deep copy should be performed
 * - If true, creates a new object with processed properties
 * - If false, returns the original cell object
 *
 * @returns {Partial<LfDataCell<T>>} An object containing the processed cell properties:
 * - Merges htmlProps directly into the result
 * - Skips the 'shape' property
 * - For other properties:
 *   - Keeps properties already prefixed with 'lf'
 *   - Adds 'lf' prefix to non-prefixed properties with capitalized first letter
 */
export const cellGetShape = <T extends LfDataShapes>(
  cell: LfDataCell<T>,
  deepCopy: boolean,
): Partial<LfDataCell<T>> => {
  if (!deepCopy) {
    return cell;
  }
  const prefix = "lf";
  const shapeProps: Partial<LfDataCell<T>> = {};
  for (const prop in cell) {
    switch (prop) {
      case "htmlProps":
        Object.assign(shapeProps, cell[prop]);
        break;
      case "shape":
        break;
      default:
        if (prop.indexOf(prefix) === 0) {
          shapeProps[prop] = cell[prop];
        } else {
          const prefixedProp =
            prefix + prop.charAt(0).toUpperCase() + prop.slice(1);
          const k = prefixedProp as keyof Partial<LfDataCell<T>>;
          if (!shapeProps[k]) {
            shapeProps[k] = cell[prop];
          }
        }
        break;
    }
  }
  return shapeProps;
};
//#endregion

//#region cellGetAllShapes
/**
 * Extracts all shapes from a dataset's cells and organizes them into a map of shape types.
 * Traverses through all nodes in the dataset recursively to collect cell shapes.
 *
 * @param dataset - The dataset containing nodes with cells to process
 * @param deepCopy - Optional flag to determine if shapes should be deep copied (default: true)
 * @returns A map containing arrays of cells grouped by their shape type, or null if dataset doesn't exist
 *
 * @example
 * ```typescript
 * const shapes = cellGetAllShapes(myDataset);
 * // Returns: {
 * //   badge: LfDataCell<"badge">[],
 * //   button: LfDataCell<"button">[],
 * //   canvas: LfDataCell<"canvas">[],
 * //   ...
 * // }
 * ```
 *
 * @remarks
 * - Supports multiple shape types including badge, button, canvas, card, chart, etc.
 * - Shape types without explicit handling default to "text"
 * - Returns null if the input dataset is invalid or non-existent
 */
export const cellGetAllShapes = (dataset: LfDataDataset, deepCopy = true) => {
  if (!nodeExists(dataset)) {
    return null;
  }

  const shapes: LfDataShapesMap = {
    badge: [],
    button: [],
    canvas: [],
    card: [],
    chart: [],
    chat: [],
    chip: [],
    code: [],
    image: [],
    number: [],
    photoframe: [],
    slot: [],
    text: [],
    toggle: [],
    typewriter: [],
    upload: [],
  };
  const nodes = dataset.nodes;

  const browseCells = (node: LfDataNode) => {
    if (!cellExists(node)) {
      return;
    }
    const cells = node.cells;
    for (const key in cells) {
      if (Object.prototype.hasOwnProperty.call(cells, key)) {
        const cell = cells[key];
        const extracted = cellGetShape(cell, deepCopy);
        switch (cell.shape) {
          case "badge":
            shapes.badge.push(extracted as LfDataCell<"badge">);
            break;
          case "button":
            shapes.button.push(extracted as LfDataCell<"button">);
            break;
          case "canvas":
            shapes.canvas.push(extracted as LfDataCell<"canvas">);
            break;
          case "card":
            shapes.card.push(extracted as LfDataCell<"card">);
            break;
          case "chart":
            shapes.chart.push(extracted as LfDataCell<"chart">);
            break;
          case "chat":
            shapes.chat.push(extracted as LfDataCell<"chat">);
            break;
          case "chip":
            shapes.chip.push(extracted as LfDataCell<"chip">);
            break;
          case "code":
            shapes.code.push(extracted as LfDataCell<"code">);
            break;
          case "image":
            shapes.image.push(extracted as LfDataCell<"image">);
            break;
          case "photoframe":
            shapes.photoframe.push(extracted as LfDataCell<"photoframe">);
            break;
          case "toggle":
            shapes.toggle.push(extracted as LfDataCell<"toggle">);
            break;
          case "typewriter":
            shapes.typewriter.push(extracted as LfDataCell<"typewriter">);
            break;
          case "number":
            shapes.number.push(cell as LfDataCell<"number">);
            break;
          case "upload":
            shapes.upload.push(extracted as LfDataCell<"upload">);
            break;
          case "slot":
            shapes.slot.push(cell);
            break;
          case "text":
          default:
            shapes.text.push(cell);
            break;
        }
      }
    }
  };
  const recursive = (node: LfDataNode) => {
    for (
      let index = 0;
      node.children && index < node.children.length;
      index++
    ) {
      recursive(node.children[index]);
    }
  };
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    browseCells(node);
    recursive(node);
  }
  return shapes;
};
//#endregion

//#region cellStringify
/**
 * Converts a value of any type into its string representation.
 *
 * @param value - The value to be converted to string
 * @returns A string representation of the input value:
 * - For null/undefined: returns "null"/"undefined"
 * - For Date objects: returns ISO string format
 * - For objects: returns JSON stringified format (indented with 2 spaces)
 * - For other types: returns their string value
 *
 * @throws Does not throw - catches and handles JSON.stringify errors by returning "[object Object]"
 *
 * @example
 * cellStringify(null)           // returns "null"
 * cellStringify(new Date())     // returns "2023-12-21T10:30:00.000Z"
 * cellStringify({a: 1})         // returns "{\n  "a": 1\n}"
 * cellStringify("test")         // returns "test"
 */
export const cellStringify = (value: unknown) => {
  if (value === null || value === undefined) {
    return String(value).valueOf();
  } else if (value instanceof Date) {
    return value.toISOString();
  } else if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch (error) {
      console.error("Failed to stringify object:", error);
      return "[object Object]";
    }
  } else {
    return String(value).valueOf();
  }
};
//#endregion

const decorateSpreader = (
  toSpread: Record<string, unknown>,
  props: Partial<LfDataCell<LfDataShapes>> & {
    htmlProps?: Record<string, any>;
  },
) => {
  const clean = () => {
    if (toSpread["value"] && !toSpread["lfValue"]) {
      toSpread["lfValue"] = toSpread["value"];
    } else if (toSpread["lfValue"] && !toSpread["value"]) {
      toSpread["value"] = toSpread["lfValue"];
    }
    delete toSpread["htmlProps"];
    delete toSpread["shape"];
    delete toSpread["value"];
  };
  if (props.htmlProps) {
    for (const key in props.htmlProps) {
      const prop = props.htmlProps[key];
      if (key === "className") {
        toSpread["class"] = prop;
      } else {
        toSpread[key] = prop;
      }
      if (key === "dataset") {
        for (const k in prop) {
          toSpread[`data-${k}`] = prop[k];
        }
      }
    }
  }
  for (const key in props) {
    const k = key as keyof (Partial<LfDataCell<LfDataShapes>> & {
      htmlProps?: Record<string, any>;
    });
    const prop = props[k];
    toSpread[key] = prop;
  }

  clean();
};

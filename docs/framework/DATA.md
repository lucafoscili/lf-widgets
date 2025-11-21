# LfData

The **LfData** module is a central part of LF Widgets that handles dynamic data and tree structures. It is responsible for managing cells (the smallest data units that can render as dynamic shapes), columns, and hierarchical nodes. These capabilities are used by several components to render dynamic shapes (such as badges, buttons, cards, charts, etc.) and to manipulate and query datasets.

> **Note:**  
> This module makes use of types and interfaces declared in the Foundations package (see `foundations/data.declarations.ts`). Key types include:
>
> - **LfDataDataset** – Represents a dataset containing nodes and (optionally) columns.
> - **LfDataColumn** – Represents a column definition.
> - **LfDataNode** – Represents a node in the hierarchical data structure.
> - **LfDataCell** – Represents a cell that contains a value and a shape, with specific properties based on the shape type.
> - Plus various types for callbacks, filtering ranges, and shape mappings.

---

## Overview

The **LfData** class encapsulates three main groups of operations:

1. **Cell Operations** – Manage cell existence, shape decoration, extraction, and string conversion.
2. **Column Operations** – Provide a way to search for and filter columns in a dataset.
3. **Node Operations** – Offer utilities to manage hierarchical node structures (e.g., checking existence, filtering, reassigning IDs, finding parents, flattening trees).

Internally, **LfData** relies on several helper functions (such as `cellDecorateShapes`, `cellGetShape`, `nodeFilter`, etc.) to implement its features.

A simplified diagram of the data structure is shown below:

```mermaid
graph TD
    A[LfDataDataset]
    A --> B[LfDataColumn]
    A --> C[LfDataNode]
    C --> D[LfDataCell]
    C --> E[LfDataNode]  %% Represents child nodes
```

---

## The LfData Class

### Constructor

```ts
constructor(lfFramework: LfFrameworkInterface)
```

- **Purpose:** Initializes an `LfData` instance by saving a reference to the global framework. This reference is later used for debugging, data sanitization, and event dispatching.
- **Usage Example:**

  ```ts
  import { getLfFramework } from "@lf-widgets/framework";
  import { LfData } from "./lf-data";

  const lfFramework = getLfFramework();
  const dataManager = new LfData(lfFramework);
  ```

---

### Exposed Properties & Operations

#### 1. **Cell Operations**

The `cell` property groups methods that deal with cell-level management.

```ts
cell: {
  exists: (node: LfDataNode) => boolean;
  shapes: {
    decorate: <C extends LfComponentName, S extends LfDataShapes | "text">(
      shape: S,
      items: Partial<LfDataCell<S>>[],
      eventDispatcher: LfDataShapeEventDispatcher,
      defaultProps?: Partial<LfDataCell<S>>[],
      defaultCb?: S extends "text" ? never : LfDataShapeCallback<C, S>,
      refsCb?: Array<LfDataShapeRefCallback<C>>,
    ) => VNode[];
    get: (cell: LfDataCell<LfDataShapes>, deepCopy?: boolean) => LfDataCell<LfDataShapes>;
    getAll: (dataset: LfDataDataset, deepCopy?: boolean) => LfDataShapesMap;
  };
  stringify: (value: LfDataCell<LfDataShapes>["value"]) => string;
}
```

- **`cell.exists(node)`** _Checks if a node has any cells defined._

  - **Example:**

    ```ts
    const hasCells = dataManager.cell.exists(someNode);
    ```

- **`cell.shapes.decorate(...)`** _Renders an array of virtual nodes (VNodes) based on the provided shape and items configuration._
  - It handles different shape types:
    - For `"slot"`, it creates `<slot>` elements.
    - For `"text"` or `"number"`, it creates simple `<div>` elements.
    - For other shapes, it creates custom elements (e.g., `<lf-card>`, `<lf-button>`, etc.) and binds event handlers and references.
  - **Usage Example:**

    ```ts
    const vnodes = dataManager.cell.shapes.decorate(
      "card",
      cellItems,
      eventDispatcher,
      defaultProps,
      defaultCallback,
      refCallbacks,
    );
    ```

- **`cell.shapes.get(cell, deepCopy?)`** _Extracts and processes a cell’s shape properties._

  - If `deepCopy` is true, returns a new object with properties merged and prefixed; otherwise, returns the original cell.
  - **Example:**

    ```ts
    const processedCell = dataManager.cell.shapes.get(someCell);
    ```

- **`cell.shapes.getAll(dataset, deepCopy?)`** _Traverses a dataset and returns a map (grouped by shape type) of all cell shapes found across nodes._
  - **Example:**

    ```ts
    const shapesMap = dataManager.cell.shapes.getAll(myDataset);
    ```

- **`cell.stringify(value)`** _Converts any cell value into a string._
  - Handles special cases (like dates, objects, null/undefined).
  - **Example:**

    ```ts
    const stringValue = dataManager.cell.stringify(someValue);
    ```

---

#### 2. **Column Operations**

The `column` property contains methods to operate on dataset columns.

```ts
column: {
  find: (
    dataset: LfDataDataset | LfDataColumn[],
    filters: Partial<LfDataColumn>,
  ) => LfDataColumn[];
}
```

- **`column.find(dataset, filters)`** _Searches for columns in a dataset (or array of columns) matching the specified filter criteria._
  - **Example:**

    ```ts
    const idColumns = dataManager.column.find(myDataset, { id: "someId" });
    ```

---

#### 3. **Node Operations**

The `node` property provides a suite of methods to manipulate and query hierarchical data structures.

```ts
node: LfDataNodeOperations = {
  exists: (dataset) => boolean,
  filter: (dataset, filters, partialMatch?) => { matchingNodes, remainingNodes, ancestorNodes },
  findNodeByCell: (dataset, cell) => LfDataNode,
  fixIds: (nodes) => LfDataNode[],
  getParent: (nodes, child) => LfDataNode,
  pop: (nodes, node2remove) => LfDataNode,
  toStream: (nodes) => LfDataNode[],
  traverseVisible: (nodes, predicates) => LfDataNode[],
  find: (dataset, predicate) => LfDataNode | undefined,
  resolveTargets: (dataset, target) => LfDataNode[],
  sanitizeIds: (dataset, candidates, options?) => string[],
  extractCellMetadata: (node, cellId, schema?) => unknown,
}
```

- **`node.exists(dataset)`** _Checks if a dataset contains any nodes._

  - **Example:**

    ```ts
    const hasNodes = dataManager.node.exists(myDataset);
    ```

- **`node.filter(dataset, filters, partialMatch?)`** _Filters nodes based on given criteria and returns a set of matching nodes, the remaining nodes, and ancestor nodes of matches._

  - **Example:**

    ```ts
    const { matchingNodes, remainingNodes, ancestorNodes } =
      dataManager.node.filter(myDataset, { description: "test" }, true);
    ```

- **`node.findNodeByCell(dataset, cell)`** _Recursively searches for and returns the node that contains the specified cell._

  - **Example:**

    ```ts
    const foundNode = dataManager.node.findNodeByCell(myDataset, targetCell);
    ```

- **`node.fixIds(nodes)`** _Normalizes node IDs by assigning each node an ID representing its path in the tree (e.g., "0.1.2")._

  - **Example:**

    ```ts
    const fixedNodes = dataManager.node.fixIds(myNodes);
    ```

- **`node.getParent(nodes, child)`** _Finds the parent node of a specified child node within the tree._

  - **Example:**

    ```ts
    const parentNode = dataManager.node.getParent(myNodes, someChildNode);
    ```

- **`node.pop(nodes, node2remove)`** _Removes a specified node from the tree and returns a copy of the removed node._

  - **Example:**

    ```ts
    const removedNode = dataManager.node.pop(myNodes, nodeToRemove);
    ```

- **`node.toStream(nodes)`** _Flattens a hierarchical node structure into a single array (depth-first order)._
  - **Example:**

    ```ts
    const flatNodes = dataManager.node.toStream(myNodes);
    ```

- **`node.traverseVisible(nodes, predicates)`** _Walks the dataset honouring UI predicates such as isExpanded, isHidden, isSelected._
  - **Example:**

    ```ts
    const visibleNodes = dataManager.node.traverseVisible(myNodes, {
      isExpanded: (node) => node.expanded,
      isHidden: (node) => node.hidden,
      isSelected: (node) => node.selected,
    });
    ```

- **`node.find(dataset, predicate)`** _Finds the first node matching the predicate._
  - **Example:**

    ```ts
    const foundNode = dataManager.node.find(myDataset, (node) => node.id === "target");
    ```

- **`node.resolveTargets(dataset, target)`** _Resolves targets to nodes based on various criteria._
  - **Example:**

    ```ts
    const targetNodes = dataManager.node.resolveTargets(myDataset, { ids: ["1", "2"] });
    ```

- **`node.sanitizeIds(dataset, candidates, options?)`** _Sanitizes and validates node IDs._
  - **Example:**

    ```ts
    const validIds = dataManager.node.sanitizeIds(myDataset, ["1", "2"], { allowPartial: true });
    ```

- **`node.extractCellMetadata(node, cellId, schema?)`** _Extracts metadata from a cell with optional validation and transformation._
  - **Example:**

    ```ts
    const metadata = dataManager.node.extractCellMetadata(node, "cellId", {
      validate: (v) => typeof v === "string",
      transform: (v) => v.toUpperCase(),
    });
    ```

---

## Helper Functions

The functionality in **LfData** is implemented via several helper functions. Here’s a brief overview of the key ones:

- ### **cellExists**

  - **Purpose:** Checks whether a given node has any cells defined (i.e., non-empty `cells` object).

- ### **cellGetShape**

  - **Purpose:** Extracts and optionally deep-copies a cell’s properties. It merges any HTML properties into the result and adds a prefix (e.g., `lfValue`) for properties that aren’t already prefixed.

- ### **cellGetAllShapes**

  - **Purpose:** Traverses a dataset’s nodes recursively, grouping cells by their shape type into a map.
  - **Example Return:**

    ```json
    {
      "badge": [ ... ],
      "button": [ ... ],
      "text": [ ... ],
      // etc.
    }
    ```

- ### **cellStringify**

  - **Purpose:** Converts any input value into its string representation, handling special cases such as `null`, `undefined`, `Date` objects, and JSON objects.

- ### **columnFind**

  - **Purpose:** Searches a dataset or an array of columns and returns columns that match a set of filter criteria.

- ### **extractCellMetadata**

  - **Purpose:** Extracts metadata from a cell with optional validation and transformation.

- ### **findNodeByCell**

  - **Purpose:** Recursively finds and returns the node that contains the specified cell.

- ### **nodeExists**

  - **Purpose:** Validates that a dataset contains nodes (i.e., that the `nodes` array is non-empty).

- ### **nodeFilter**

  - **Purpose:** Recursively traverses nodes to filter them by provided criteria. It returns three sets:
    - `matchingNodes`: Nodes that satisfy the filters.
    - `remainingNodes`: Nodes that do not satisfy the filters.
    - `ancestorNodes`: Ancestor nodes of matching leaf nodes.

- ### **nodeFind**

  - **Purpose:** Finds the first node matching a predicate.

- ### **nodeFixIds**

  - **Purpose:** Updates node IDs to represent their location in the tree (e.g., "0", "0.1", "0.1.2").

- ### **nodeGetParent**

  - **Purpose:** Finds the parent node of a given node by traversing the tree structure.

- ### **nodePop**

  - **Purpose:** Recursively searches for and removes a node from the tree, returning a copy of the removed node.

- ### **nodeResolveTargets**

  - **Purpose:** Resolves targets to nodes based on various criteria.

- ### **nodeSanitizeIds**

  - **Purpose:** Sanitizes and validates node IDs.

- ### **nodeToStream**

  - **Purpose:** Flattens the nested node tree into a single array (depth-first traversal).

- ### **nodeTraverseVisible**

  - **Purpose:** Walks the dataset honouring UI predicates.

---

## Example Usage

Below is an example that demonstrates how to use the **LfData** module to work with a dataset, decorate cell shapes, and manipulate nodes:

```ts
import { getLfFramework } from "@lf-widgets/framework";

const lfFramework = getLfFramework();
const dataManager = lfFramework.data;

// Example: Check if a node has any cells
if (dataManager.cell.exists(someNode)) {
  console.log("Node contains cells.");
}

// Example: Decorate a set of cells with a custom shape
const decoratedShapes = dataManager.cell.shapes.decorate(
  "card", // shape type
  cellItems, // array of cell items (Partial<LfDataCell<"card">>[])
  eventDispatcher, // event dispatcher function
  defaultProps, // (optional) default properties
  defaultCallback, // (optional) default event callback
  refCallbacks, // (optional) ref callbacks
);

// Example: Get all cell shapes from a dataset
const shapesMap = dataManager.cell.shapes.getAll(myDataset);
console.log("Extracted Shapes Map:", shapesMap);

// Example: Filter nodes in the dataset
const { matchingNodes, remainingNodes, ancestorNodes } =
  dataManager.node.filter(
    myDataset,
    { description: "Test" },
    true, // enable partial matching
  );
console.log("Matching Nodes:", Array.from(matchingNodes));

// Example: Remove a node by a specific cell reference
const removedNode = dataManager.node.removeNodeByCell(myDataset, targetCell);
if (removedNode) {
  console.log("Node removed:", removedNode);
}
```

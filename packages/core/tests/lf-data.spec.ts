// Import from the built framework runtime (CJS) instead of source helpers to
// mirror production usage and avoid deep module resolution issues in Jest.
import { getLfFramework } from "@lf-widgets/framework";
import type { LfFrameworkInterface } from "@lf-widgets/foundations";

// Framework runtime reference populated in beforeAll; helpers read the mutable `data` binding at invocation time.
let framework: LfFrameworkInterface | undefined;
let data: any; // runtime service bag (typed loosely for test resilience)
beforeAll(async () => {
  framework = await getLfFramework();
  data = framework.data;
});

// Helper wrappers (access `data` lazily; safe after beforeAll)
const cellExists = (node: any) => data?.cell.exists(node);
const cellGetShape = (cell: any, deep?: boolean) =>
  data?.cell.shapes.get(cell, deep);
const cellGetAllShapes = (dataset: any, deep?: boolean) =>
  data?.cell.shapes.getAll(dataset, deep);
const cellStringify = (value: any) => data?.cell.stringify(value);
const columnFind = (dataset: any, filters: any) =>
  data?.column.find(dataset, filters);
const nodeExists = (dataset: any) => data?.node.exists(dataset);
const nodeFilter = (dataset: any, filters: any, partial?: boolean) =>
  data?.node.filter(dataset, filters, partial);
const nodeFind = (dataset: any, predicate: (n: any) => boolean) =>
  data?.node.find(dataset, predicate);
const nodeGetParent = (nodes: any[], child: any) =>
  data?.node.getParent(nodes, child);

// Test data fixtures
const createTestDataset = (): any => ({
  nodes: [
    {
      id: "root1",
      value: "Root 1",
      cells: {
        name: { value: "John", shape: "text" as const },
        age: { value: 30, shape: "number" as const },
        active: { value: true, shape: "toggle" as const },
        badge: { value: "VIP", shape: "badge" as const, lfColor: "primary" },
      },
      children: [
        {
          id: "child1",
          value: "Child 1",
          cells: {
            name: { value: "Jane", shape: "text" as const },
            age: { value: 25, shape: "number" as const },
          },
        },
        {
          id: "child2",
          value: "Child 2",
          cells: {
            name: { value: "Bob", shape: "text" as const },
            age: { value: 35, shape: "number" as const },
            button: {
              value: "Click me",
              shape: "button" as const,
              lfColor: "secondary",
            },
          },
        },
      ],
    },
    {
      id: "root2",
      value: "Root 2",
      cells: {
        name: { value: "Alice", shape: "text" as const },
        age: { value: 28, shape: "number" as const },
      },
    },
  ],
  columns: [
    { id: "name", title: "Name" },
    { id: "age", title: "Age" },
    { id: "active", title: "Active" },
  ],
});

const createEmptyDataset = (): any => ({
  nodes: [],
  columns: [],
});

const createMalformedDataset = (): any => ({
  nodes: null,
  columns: undefined,
});

describe("Data Cell Helpers", () => {
  const dataset = createTestDataset();
  const rootNode = dataset.nodes[0];

  describe("cellExists", () => {
    it("should return false for null node", () => {
      expect(cellExists(null)).toBe(false);
    });

    it("should return false for undefined node", () => {
      expect(cellExists(undefined)).toBe(false);
    });

    it("should return false for node without cells", () => {
      const node = { id: "test", value: "test" };
      expect(cellExists(node)).toBe(false);
    });

    it("should return false for node with empty cells object", () => {
      const node = { id: "test", value: "test", cells: {} };
      expect(cellExists(node)).toBe(false);
    });

    it("should return true for node with cells", () => {
      expect(cellExists(rootNode)).toBe(true);
    });
  });

  describe("cellGetShape", () => {
    it("should return shape properties for deep copy", () => {
      const shape = cellGetShape(rootNode.cells.name, true);
      expect(shape).toHaveProperty("lfValue", "John");
    });

    it("should return original cell for no deep copy", () => {
      const shape = cellGetShape(rootNode.cells.name, false);
      expect(shape).toEqual(rootNode.cells.name);
    });

    it("should handle cells with additional properties", () => {
      const shape = cellGetShape(rootNode.cells.badge, true);
      expect(shape).toHaveProperty("lfValue", "VIP");
      expect(shape).toHaveProperty("lfColor", "primary");
    });

    it("should handle null/undefined cells", () => {
      expect(cellGetShape(null as any, true)).toEqual({});
      expect(cellGetShape(undefined as any, true)).toEqual({});
    });
  });

  describe("cellGetAllShapes", () => {
    it("should return all shapes for dataset", () => {
      const shapes = cellGetAllShapes(dataset);
      expect(shapes).toBeDefined();
      expect(shapes.text).toBeDefined();
      expect(shapes.number).toBeDefined();
      expect(shapes.toggle).toBeDefined();
      expect(shapes.badge).toBeDefined();
      expect(shapes.button).toBeDefined();
    });

    it("should handle empty dataset", () => {
      const emptyDataset = createEmptyDataset();
      const shapes = cellGetAllShapes(emptyDataset);
      expect(shapes).toBeNull();
    });

    it("should handle malformed dataset", () => {
      const malformedDataset = createMalformedDataset();
      const shapes = cellGetAllShapes(malformedDataset);
      expect(shapes).toBeNull();
    });
  });

  describe("cellStringify", () => {
    it("should stringify text values", () => {
      const result = cellStringify(rootNode.cells.name.value);
      expect(result).toBe("John");
    });

    it("should stringify number values", () => {
      const result = cellStringify(rootNode.cells.age.value);
      expect(result).toBe("30");
    });

    it("should stringify boolean values", () => {
      const result = cellStringify(rootNode.cells.active.value);
      expect(result).toBe("true");
    });

    it("should handle null/undefined values", () => {
      expect(cellStringify(null)).toBe("null");
      expect(cellStringify(undefined)).toBe("undefined");
    });

    it("should handle objects", () => {
      const result = cellStringify({ test: "value" });
      expect(result).toContain('"test": "value"');
    });
  });

  describe("Data Column Helpers", () => {
    describe("columnFind", () => {
      const dataset = createTestDataset();
      it("should find column by id", () => {
        const columns = columnFind(dataset, { id: "name" });
        expect(columns).toHaveLength(1);
        expect(columns[0]).toEqual({ id: "name", title: "Name" });
      });

      it("should find columns by title", () => {
        const columns = columnFind(dataset, { title: "Name" });
        expect(columns).toHaveLength(1);
        expect(columns[0].id).toBe("name");
      });

      it("should return empty array for non-existing column", () => {
        const columns = columnFind(dataset, { id: "nonexistent" });
        expect(columns).toEqual([]);
      });

      it("should handle dataset without columns", () => {
        const datasetWithoutColumns: any = { nodes: [], columns: null };
        const columns = columnFind(datasetWithoutColumns, { id: "name" });
        expect(columns).toEqual([]);
      });
    });
  });
});

describe("Data Node Helpers", () => {
  const dataset = createTestDataset();
  const rootNode = dataset.nodes[0];
  const childNode = rootNode.children[0];

  describe("nodeExists", () => {
    it("should return true for dataset with nodes", () => {
      expect(nodeExists(dataset)).toBe(true);
    });

    it("should return false for dataset without nodes", () => {
      const emptyDataset = createEmptyDataset();
      expect(nodeExists(emptyDataset)).toBe(false);
    });

    it("should return false for null/undefined dataset", () => {
      expect(nodeExists(null)).toBe(false);
      expect(nodeExists(undefined)).toBe(false);
    });

    it("should return false for dataset with empty nodes array", () => {
      const datasetWithEmptyNodes: any = { nodes: [], columns: [] };
      expect(nodeExists(datasetWithEmptyNodes)).toBe(false);
    });
  });

  describe("nodeFind", () => {
    it("should find node by predicate", () => {
      const node = nodeFind(dataset, (n: any) => n.id === "child1");
      expect(node).toEqual(childNode);
    });

    it("should find node by value", () => {
      const node = nodeFind(dataset, (n: any) => n.value === "Root 2");
      expect(node).toEqual(dataset.nodes[1]);
    });

    it("should return undefined for non-existing node", () => {
      const node = nodeFind(dataset, (n: any) => n.id === "nonexistent");
      expect(node).toBeUndefined();
    });

    it("should handle null/undefined dataset", () => {
      expect(nodeFind(null, (n: any) => n.id === "root1")).toBeUndefined();
      expect(nodeFind(undefined, (n: any) => n.id === "root1")).toBeUndefined();
    });
  });

  describe("nodeGetParent", () => {
    it("should return parent node", () => {
      const parent = nodeGetParent(dataset.nodes, childNode);
      expect(parent).toEqual(rootNode);
    });

    it("should return null for root node", () => {
      const parent = nodeGetParent(dataset.nodes, rootNode);
      expect(parent).toBeNull();
    });

    it("should return null for non-existing node", () => {
      const fakeNode = { id: "fake", value: "fake" };
      const parent = nodeGetParent(dataset.nodes, fakeNode);
      expect(parent).toBeNull();
    });

    it("should handle null/undefined nodes array", () => {
      expect(() => nodeGetParent(null, childNode)).toThrow();
      expect(() => nodeGetParent(undefined, childNode)).toThrow();
    });
  });

  describe("nodeFilter", () => {
    it("should filter nodes by exact match", () => {
      const filtered = nodeFilter(dataset, { id: "root1" }, false);
      expect(filtered.matchingNodes.size).toBe(1);
      expect(Array.from(filtered.matchingNodes)[0]).toEqual(rootNode);
    });

    it("should filter nodes by partial match", () => {
      const filtered = nodeFilter(dataset, { value: "Child" }, true);
      expect(filtered.matchingNodes.size).toBe(2);
      const matchingIds = Array.from(filtered.matchingNodes).map(
        (n: any) => (n as any).id,
      );
      expect(matchingIds.sort()).toEqual(["child1", "child2"]);
    });

    it("should return empty result when no matches", () => {
      const filtered = nodeFilter(dataset, { value: "nonexistent" }, false);
      expect(filtered.matchingNodes.size).toBe(0);
    });

    it("should handle null/undefined dataset", () => {
      expect(() => nodeFilter(null, { id: "root1" }, false)).toThrow();
      expect(() => nodeFilter(undefined, { id: "root1" }, false)).toThrow();
    });
  });
});

describe("Article helpers", () => {
  it("builder creates section and card leaf with hierarchical structure", () => {
    const article = data?.article;

    const builder = article.builder.create({
      id: "article-root",
      title: "Weather Article",
    });

    const section = builder.addSection({
      id: "weather-section",
      title: "Today",
    });

    builder.addLeaf({
      sectionId: section.id,
      node: article.shapes.card({
        id: "weather-card",
        dataset: { nodes: [] },
        layout: "weather",
      }),
    });

    const dataset = builder.getDataset();

    expect(dataset).toBeDefined();
    expect(Array.isArray(dataset.nodes)).toBe(true);
    expect(dataset.nodes!.length).toBe(1);

    const rootNode = dataset.nodes![0];
    expect(rootNode.id).toBe("article-root");
    expect(rootNode.value).toBe("Weather Article");
    expect(rootNode.children?.length).toBe(1);

    const sectionNode = rootNode.children![0];
    expect(sectionNode.id).toBe("weather-section");
    expect(sectionNode.value).toBe("Today");
    expect(sectionNode.children?.length).toBe(1);

    const paragraphNode = sectionNode.children![0];
    expect(paragraphNode.children?.length).toBe(1);

    const cardNode = paragraphNode.children![0];
    expect(cardNode.cells?.lfCard).toBeDefined();
  });

  it("builder paragraphs attach text as leaf content", () => {
    const article = data?.article;

    const builder = article.builder.create({
      id: "article-root-text",
      title: "Docs Article",
    });

    const section = builder.addSection({
      id: "docs-section",
      title: "Overview",
    });

    const paragraph = builder.addParagraph(section.id, {
      id: "intro-paragraph",
      title: "Introduction",
      text: "Hello world",
    });

    const dataset = builder.getDataset();

    expect(dataset.nodes).toBeDefined();
    const rootNode = dataset.nodes![0];
    const sectionNode = rootNode.children![0];
    const paragraphNode = sectionNode.children![0];

    expect(paragraphNode.id).toBe(paragraph.id);
    expect(paragraphNode.value).toBe("Introduction");
    expect(paragraphNode.children?.[0].value).toBe("Hello world");
  });

  it("builder addSectionWithText creates section and paragraph in one call", () => {
    const article = data?.article;

    const builder = article.builder.create({
      id: "article-root-section-text",
      title: "Tool Article",
    });

    const { section, paragraph } = builder.addSectionWithText({
      sectionId: "tool-section",
      sectionTitle: "Details",
      text: "This is a summary.",
    });

    const dataset = builder.getDataset();

    const rootNode = dataset.nodes![0];
    expect(rootNode.children?.[0]).toBe(section);

    const sectionNode = rootNode.children![0];
    expect(sectionNode.id).toBe("tool-section");
    expect(sectionNode.value).toBe("Details");
    expect(sectionNode.children?.[0]).toBe(paragraph);

    const paragraphNode = sectionNode.children![0];
    expect(paragraphNode.children?.[0].value).toBe("This is a summary.");
  });

  it("builder addSectionWithLeaf composes section, paragraph and leaf", () => {
    const article = data?.article;

    const builder = article.builder.create({
      id: "article-root-section-leaf",
      title: "Tool Article With Card",
    });

    const cardNode = article.shapes.card({
      id: "tool-card",
      dataset: { nodes: [] },
      layout: "weather",
    });

    const { section, paragraph, leaf } = builder.addSectionWithLeaf({
      sectionId: "tool-section",
      sectionTitle: "Result",
      text: "Summary text",
      leaf: cardNode,
    });

    const dataset = builder.getDataset();

    const rootNode = dataset.nodes![0];
    expect(rootNode.children?.[0]).toBe(section);

    const sectionNode = rootNode.children![0];
    expect(sectionNode.id).toBe("tool-section");
    expect(sectionNode.value).toBe("Result");

    const paragraphNode = sectionNode.children![0];
    expect(paragraphNode).toBe(paragraph);
    expect(paragraphNode.children).toBeDefined();
    expect(paragraphNode.children!.length).toBeGreaterThanOrEqual(1);

    // The returned leaf should be appended to the paragraph children.
    expect(paragraphNode.children).toContain(leaf);
    expect(leaf.cells?.lfCard).toBeDefined();
  });
});

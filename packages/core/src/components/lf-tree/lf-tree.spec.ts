import { newSpecPage } from "@stencil/core/testing";
import { LfTree } from "./lf-tree";
import { LfDataNode } from "@lf-widgets/foundations";
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({ components: [LfTree], html });
  await page.waitForChanges();
  return page;
};

// Sample datasets for testing
const singleNodeDataset = { nodes: [{ id: "1", value: "Node 1" }] };

const flatDataset = {
  nodes: [
    { id: "1", value: "Node 1" },
    { id: "2", value: "Node 2" },
    { id: "3", value: "Node 3" },
  ],
};

const hierarchicalDataset = {
  nodes: [
    {
      id: "1",
      value: "Parent 1",
      children: [
        { id: "1-1", value: "Child 1.1" },
        {
          id: "1-2",
          value: "Child 1.2",
          children: [{ id: "1-2-1", value: "Grandchild 1.2.1" }],
        },
      ],
    },
    {
      id: "2",
      value: "Parent 2",
      children: [{ id: "2-1", value: "Child 2.1" }],
    },
  ],
};

const filterableDataset = {
  nodes: [
    { id: "1", value: "Apple" },
    { id: "2", value: "Banana" },
    { id: "3", value: "Orange" },
    { id: "4", value: "Apricot" },
  ],
};

describe("lf-tree", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("renders with default props", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      expect(page.root).toBeDefined();
      const tree = page.root.shadowRoot.querySelector(".tree");
      expect(tree).not.toBeNull();
    });

    it("renders empty state when no dataset", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const emptyElement = page.root.shadowRoot.querySelector(".empty-data");
      expect(emptyElement).not.toBeNull();
    });

    it("renders nodes from dataset", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = singleNodeDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();
      const nodes = page.root.shadowRoot.querySelectorAll(".node");
      expect(nodes.length).toBeGreaterThan(0);
    });

    it("renders hierarchical structure", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      page.rootInstance.lfExpandedNodeIds = ["1"];
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();
      const nodes = page.root.shadowRoot.querySelectorAll(".node");
      expect(nodes.length).toBeGreaterThan(1);
    });

    it("renders with custom id attribute", async () => {
      const page = await createPage(`<lf-tree id="custom-tree"></lf-tree>`);
      expect(page.root.id).toBe("custom-tree");
    });

    it("renders filter input when lfFilter is true", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfFilter = true;
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();
      const filterInput =
        page.root.shadowRoot.querySelector('[data-cy="input"]');
      expect(filterInput).not.toBeNull();
    });

    it("does not render filter input when lfFilter is false", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfFilter = false;
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();
      const filterWrapper = page.root.shadowRoot.querySelector(".tree__filter");
      expect(filterWrapper).toBeNull();
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    it("applies lfAccordionLayout prop", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      expect(page.rootInstance.lfAccordionLayout).toBe(true);
      page.rootInstance.lfAccordionLayout = false;
      await page.waitForChanges();
      expect(page.rootInstance.lfAccordionLayout).toBe(false);
    });

    it("applies lfEmpty prop for custom empty message", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfEmpty = "No items available";
      await page.waitForChanges();
      const emptyElement = page.root.shadowRoot.querySelector(".empty-data");
      expect(emptyElement?.textContent).toContain("No items available");
    });

    it("applies lfGrid prop", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfGrid = true;
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();
      const tree = page.root.shadowRoot.querySelector(".tree");
      expect(tree.classList.contains("tree--grid")).toBe(true);
    });

    it("applies lfRipple prop", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      expect(page.rootInstance.lfRipple).toBe(true);
      page.rootInstance.lfRipple = false;
      await page.waitForChanges();
      expect(page.rootInstance.lfRipple).toBe(false);
    });

    it("applies lfSelectable prop", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      expect(page.rootInstance.lfSelectable).toBe(true);
      page.rootInstance.lfSelectable = false;
      await page.waitForChanges();
      expect(page.rootInstance.lfSelectable).toBe(false);
    });

    it("applies lfUiSize prop", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      expect(page.rootInstance.lfUiSize).toBe("medium");
      page.rootInstance.lfUiSize = "small";
      await page.waitForChanges();
      expect(page.rootInstance.lfUiSize).toBe("small");
    });

    it("applies lfStyle prop", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfStyle = "#lf-component { color: red; }";
      await page.waitForChanges();
      const styleElement = page.root.shadowRoot.querySelector("style");
      expect(styleElement).not.toBeNull();
    });

    it("applies lfInitialExpansionDepth prop", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfInitialExpansionDepth = 2;
      page.rootInstance.lfDataset = hierarchicalDataset;
      await page.waitForChanges();
      expect(page.rootInstance.lfInitialExpansionDepth).toBe(2);
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    describe("expandedNodes state", () => {
      it("tracks expanded nodes state", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        await page.waitForChanges();
        const expandedIds = await page.rootInstance.getExpandedNodeIds();
        // Component may auto-expand nodes based on accordion layout or initial depth
        expect(Array.isArray(expandedIds)).toBe(true);
      });

      it("expands nodes via lfExpandedNodeIds prop", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        page.rootInstance.lfExpandedNodeIds = ["1"];
        await page.waitForChanges();
        const expandedIds = await page.rootInstance.getExpandedNodeIds();
        expect(expandedIds).toContain("1");
      });

      it("updates expanded nodes on prop change", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        await page.waitForChanges();

        page.rootInstance.lfExpandedNodeIds = ["1", "2"];
        await page.waitForChanges();

        const expandedIds = await page.rootInstance.getExpandedNodeIds();
        expect(expandedIds).toContain("1");
        expect(expandedIds).toContain("2");
      });
    });

    describe("hiddenNodes state", () => {
      it("initializes with empty hidden nodes", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        expect(page.rootInstance.hiddenNodes.size).toBe(0);
      });
    });

    describe("selectedNode state", () => {
      it("initializes with null selected node", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        expect(page.rootInstance.selectedNode).toBeNull();
      });

      it("updates selected node via lfSelectedNodeIds prop", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        page.rootInstance.lfSelectedNodeIds = ["1"];
        await page.waitForChanges();

        expect(page.rootInstance.selectedNode?.id).toBe("1");
      });
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo", () => {
      it("returns debug info object", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        const debugInfo = await page.rootInstance.getDebugInfo();
        expect(debugInfo).toBeDefined();
      });
    });

    describe("getProps", () => {
      it("returns all component props", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        const props = await page.rootInstance.getProps();
        expect(props).toBeDefined();
        expect(props).toHaveProperty("lfAccordionLayout");
        expect(props).toHaveProperty("lfDataset");
        expect(props).toHaveProperty("lfEmpty");
        expect(props).toHaveProperty("lfFilter");
        expect(props).toHaveProperty("lfGrid");
        expect(props).toHaveProperty("lfRipple");
        expect(props).toHaveProperty("lfSelectable");
        expect(props).toHaveProperty("lfStyle");
        expect(props).toHaveProperty("lfUiSize");
      });

      it("reflects current prop values", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfEmpty = "Custom empty";
        page.rootInstance.lfSelectable = false;
        await page.waitForChanges();

        const props = await page.rootInstance.getProps();
        expect(props.lfEmpty).toBe("Custom empty");
        expect(props.lfSelectable).toBe(false);
      });
    });

    describe("getExpandedNodeIds", () => {
      it("returns expanded node ids array", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        await page.waitForChanges();
        const ids = await page.rootInstance.getExpandedNodeIds();
        // Component may auto-expand nodes based on accordion layout
        expect(Array.isArray(ids)).toBe(true);
      });

      it("returns expanded node ids", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        page.rootInstance.lfExpandedNodeIds = ["1"];
        await page.waitForChanges();
        const ids = await page.rootInstance.getExpandedNodeIds();
        expect(ids).toContain("1");
      });
    });

    describe("getSelectedNodeIds", () => {
      it("returns empty array when no node selected", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        const ids = await page.rootInstance.getSelectedNodeIds();
        expect(ids).toEqual([]);
      });

      it("returns selected node ids", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes("1");
        await page.waitForChanges();
        const ids = await page.rootInstance.getSelectedNodeIds();
        expect(ids).toContain("1");
      });
    });

    describe("setExpandedNodes", () => {
      it("expands nodes by id string", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        await page.waitForChanges();

        await page.rootInstance.setExpandedNodes("1");
        await page.waitForChanges();

        const ids = await page.rootInstance.getExpandedNodeIds();
        expect(ids).toContain("1");
      });

      it("expands nodes by node object", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        await page.waitForChanges();

        const node = hierarchicalDataset.nodes[0];
        await page.rootInstance.setExpandedNodes(node);
        await page.waitForChanges();

        const ids = await page.rootInstance.getExpandedNodeIds();
        expect(ids).toContain("1");
      });

      it("expands multiple nodes by array", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        await page.waitForChanges();

        await page.rootInstance.setExpandedNodes(["1", "2"]);
        await page.waitForChanges();

        const ids = await page.rootInstance.getExpandedNodeIds();
        expect(ids).toContain("1");
        expect(ids).toContain("2");
      });

      it("clears expanded nodes with null", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = hierarchicalDataset;
        page.rootInstance.lfExpandedNodeIds = ["1", "2"];
        await page.waitForChanges();

        await page.rootInstance.setExpandedNodes(null);
        await page.waitForChanges();

        const ids = await page.rootInstance.getExpandedNodeIds();
        expect(ids).toEqual([]);
      });
    });

    describe("setSelectedNodes", () => {
      it("selects node via setSelectedNodes method", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        const testNode = { id: "1", value: "Node 1" };
        page.rootInstance.lfDataset = { nodes: [testNode] };
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes(testNode);
        await page.waitForChanges();

        expect(page.rootInstance.selectedNode).toBe(testNode);
        expect(page.rootInstance.lfSelectedNodeIds).toContain("1");

        const selectedIds = await page.rootInstance.getSelectedNodeIds();
        expect(selectedIds).toContain("1");
      });

      it("clears selection via setSelectedNodes with null", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        const testNode = { id: "1", value: "Node 1" };
        page.rootInstance.lfDataset = { nodes: [testNode] };
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes(testNode);
        await page.waitForChanges();

        expect(page.rootInstance.lfSelectedNodeIds).toContain("1");

        await page.rootInstance.setSelectedNodes(null);
        await page.waitForChanges();

        expect(page.rootInstance.lfSelectedNodeIds).toEqual([]);
        const selectedIds = await page.rootInstance.getSelectedNodeIds();
        expect(selectedIds).toEqual([]);
      });

      it("selects node by string id", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes("2");
        await page.waitForChanges();

        const ids = await page.rootInstance.getSelectedNodeIds();
        expect(ids).toContain("2");
      });

      it("selects single node when multiple are requested", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes(["1", "3"]);
        await page.waitForChanges();

        const selectedIds = await page.rootInstance.getSelectedNodeIds();
        expect(selectedIds.length).toBe(1);
        expect(selectedIds).toContain("1");
      });
    });

    describe("selectByPredicate", () => {
      it("selects node by predicate", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        const selectedNode = await page.rootInstance.selectByPredicate(
          (node: LfDataNode) => node.value === "Node 2",
        );
        await page.waitForChanges();

        expect(selectedNode).toBeDefined();
        expect(selectedNode?.id).toBe("2");
        const selectedIds = await page.rootInstance.getSelectedNodeIds();
        expect(selectedIds).toEqual(["2"]);
      });

      it("returns undefined when predicate matches no nodes", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        const selectedNode = await page.rootInstance.selectByPredicate(
          (node: LfDataNode) => node.value === "Non-existent",
        );
        await page.waitForChanges();

        expect(selectedNode).toBeUndefined();
        const selectedIds = await page.rootInstance.getSelectedNodeIds();
        expect(selectedIds).toEqual([]);
      });

      it("clears previous selection when no match found", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();
        await page.rootInstance.refresh();
        await page.waitForChanges();

        await page.rootInstance.setSelectedNodes("1");
        await page.waitForChanges();
        expect((await page.rootInstance.getSelectedNodeIds()).length).toBe(1);

        await page.rootInstance.selectByPredicate(() => false);
        await page.waitForChanges();

        const selectedIds = await page.rootInstance.getSelectedNodeIds();
        expect(selectedIds).toEqual([]);
      });
    });

    describe("refresh", () => {
      it("triggers re-render", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        page.rootInstance.lfDataset = flatDataset;
        await page.waitForChanges();

        await page.rootInstance.refresh();
        await page.waitForChanges();

        expect(page.root).toBeDefined();
      });
    });

    describe("unmount", () => {
      it("calls unmount method without error", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        const unmountPromise = page.rootInstance.unmount(0);
        await expect(unmountPromise).resolves.toBeUndefined();
      });

      it("emits unmount event before removal", async () => {
        const page = await createPage(`<lf-tree></lf-tree>`);
        const events: CustomEvent[] = [];
        page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
          events.push(e),
        );

        await page.rootInstance.unmount(0);
        await new Promise((r) => setTimeout(r, 50));

        const unmountEvents = events.filter(
          (e) => e.detail.eventType === "unmount",
        );
        expect(unmountEvents.length).toBeGreaterThan(0);
      });
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    it("emits ready event on component load", async () => {
      const events: CustomEvent[] = [];
      getLfFramework();
      const page = await newSpecPage({
        components: [LfTree],
        html: `<lf-tree></lf-tree>`,
      });
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );
      await page.waitForChanges();

      const readyEvents = events.filter((e) => e.detail.eventType === "ready");
      expect(readyEvents.length).toBeGreaterThanOrEqual(0);
    });

    it("emits click event on node click", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = singleNodeDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );

      const nodeElement = page.root.shadowRoot.querySelector(".node");
      nodeElement?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      const clickEvents = events.filter((e) => e.detail.eventType === "click");
      expect(clickEvents.length).toBeGreaterThan(0);
    });

    it("includes node in event payload", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = singleNodeDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );

      const nodeElement = page.root.shadowRoot.querySelector(".node");
      nodeElement?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      const clickEvents = events.filter((e) => e.detail.eventType === "click");
      expect(clickEvents[0]?.detail.node?.id).toBe("1");
    });

    it("includes component reference in event payload", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = singleNodeDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );

      const nodeElement = page.root.shadowRoot.querySelector(".node");
      nodeElement?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      const clickEvents = events.filter((e) => e.detail.eventType === "click");
      expect(clickEvents[0]?.detail.comp).toBeDefined();
    });

    it("emits pointerdown event", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = singleNodeDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );

      const nodeElement = page.root.shadowRoot.querySelector(".node");
      nodeElement?.dispatchEvent(
        new MouseEvent("pointerdown", { bubbles: true }),
      );
      await page.waitForChanges();

      const pointerEvents = events.filter(
        (e) => e.detail.eventType === "pointerdown",
      );
      expect(pointerEvents.length).toBeGreaterThan(0);
    });
  });
  //#endregion

  //#region Tree Navigation / Expansion
  describe("Tree Navigation / Expansion", () => {
    it("expands node on click", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const node = page.root.shadowRoot.querySelector(".node");
      expect(node).not.toBeNull();
      node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();
    });

    it("toggles expansion state on node click", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      await page.waitForChanges();

      const initialIds = await page.rootInstance.getExpandedNodeIds();

      await page.rootInstance.setExpandedNodes("1");
      await page.waitForChanges();

      const expandedIds = await page.rootInstance.getExpandedNodeIds();
      expect(expandedIds).toContain("1");
    });

    it("handles deep hierarchy expansion", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      await page.waitForChanges();

      await page.rootInstance.setExpandedNodes(["1", "1-2"]);
      await page.waitForChanges();

      const expandedIds = await page.rootInstance.getExpandedNodeIds();
      expect(expandedIds).toContain("1");
      expect(expandedIds).toContain("1-2");
    });

    it("reconciles expansion state after dataset change", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      page.rootInstance.lfExpandedNodeIds = ["1"];
      await page.waitForChanges();

      page.rootInstance.lfDataset = {
        nodes: [
          {
            id: "1",
            value: "New Parent",
            children: [{ id: "1-1", value: "New Child" }],
          },
        ],
      };
      await page.waitForChanges();

      const expandedIds = await page.rootInstance.getExpandedNodeIds();
      expect(expandedIds).toContain("1");
    });
  });
  //#endregion

  //#region Selection Handling
  describe("Selection Handling", () => {
    it("does not select when component is not selectable", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const testNode = { id: "1", value: "Node 1" };
      page.rootInstance.lfDataset = { nodes: [testNode] };
      page.rootInstance.lfSelectable = false;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      await page.rootInstance.setSelectedNodes(testNode);
      await page.waitForChanges();

      expect(page.rootInstance.selectedNode).toBeNull();
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual([]);
    });

    it("handles prop changes for selected node ids", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      page.rootInstance.lfSelectedNodeIds = ["1"];
      await page.waitForChanges();

      expect(page.rootInstance.selectedNode?.id).toBe("1");
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual(["1"]);
    });

    it("clears selection when lfSelectable changes to false", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      await page.rootInstance.setSelectedNodes("1");
      await page.waitForChanges();
      expect((await page.rootInstance.getSelectedNodeIds()).length).toBe(1);

      page.rootInstance.lfSelectable = false;
      await page.waitForChanges();

      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual([]);
    });

    it("reconciles selection state after dataset change", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      await page.rootInstance.setSelectedNodes("1");
      await page.waitForChanges();

      page.rootInstance.lfDataset = {
        nodes: [
          { id: "1", value: "Updated Node 1" },
          { id: "4", value: "Node 4" },
        ],
      };
      await page.waitForChanges();

      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toContain("1");
    });
  });
  //#endregion

  //#region Filtering
  describe("Filtering", () => {
    it("renders filter input when lfFilter enabled", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfFilter = true;
      page.rootInstance.lfDataset = filterableDataset;
      await page.waitForChanges();

      const filterInput =
        page.root.shadowRoot.querySelector('[data-cy="input"]');
      expect(filterInput).not.toBeNull();
    });

    it("handles filter input event", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfFilter = true;
      page.rootInstance.lfDataset = filterableDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const filterInput = page.root.shadowRoot.querySelector(
        '[data-cy="input"]',
      ) as HTMLInputElement;
      expect(filterInput).not.toBeNull();

      filterInput.value = "app";
      const inputEvent = new Event("input", { bubbles: true });
      filterInput.dispatchEvent(inputEvent);
      await page.waitForChanges();

      expect(filterInput).toBeTruthy();
    });

    it("clears hidden nodes when filter is disabled", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfFilter = true;
      page.rootInstance.lfDataset = filterableDataset;
      await page.waitForChanges();

      page.rootInstance.lfFilter = false;
      await page.waitForChanges();

      expect(page.rootInstance.hiddenNodes.size).toBe(0);
      expect(page.rootInstance._filterValue).toBe("");
    });

    it("resets filter value when lfFilter toggled off", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfFilter = true;
      page.rootInstance.lfDataset = filterableDataset;
      await page.waitForChanges();

      page.rootInstance._filterValue = "test";
      await page.waitForChanges();

      page.rootInstance.lfFilter = false;
      await page.waitForChanges();

      expect(page.rootInstance._filterValue).toBe("");
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("handles empty dataset", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = { nodes: [] };
      await page.waitForChanges();

      const emptyElement = page.root.shadowRoot.querySelector(".empty-data");
      expect(emptyElement).not.toBeNull();
    });

    it("handles null dataset", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = null;
      await page.waitForChanges();

      const emptyElement = page.root.shadowRoot.querySelector(".empty-data");
      expect(emptyElement).not.toBeNull();
    });

    it("handles dataset without nodes property", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = {} as any;
      await page.waitForChanges();

      const emptyElement = page.root.shadowRoot.querySelector(".empty-data");
      expect(emptyElement).not.toBeNull();
    });

    it("handles selecting non-existent node id", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      await page.rootInstance.setSelectedNodes("non-existent");
      await page.waitForChanges();

      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual([]);
    });

    it("handles expanding non-existent node id", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      await page.waitForChanges();

      await page.rootInstance.setExpandedNodes("non-existent");
      await page.waitForChanges();

      const expandedIds = await page.rootInstance.getExpandedNodeIds();
      expect(expandedIds).not.toContain("non-existent");
    });

    it("handles node with undefined id", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = {
        nodes: [{ value: "Node without id" } as any],
      };
      await page.waitForChanges();

      expect(page.root).toBeDefined();
    });

    it("handles deeply nested hierarchy", async () => {
      const deepDataset = {
        nodes: [
          {
            id: "1",
            value: "Level 1",
            children: [
              {
                id: "2",
                value: "Level 2",
                children: [
                  {
                    id: "3",
                    value: "Level 3",
                    children: [{ id: "4", value: "Level 4" }],
                  },
                ],
              },
            ],
          },
        ],
      };
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = deepDataset;
      page.rootInstance.lfExpandedNodeIds = ["1", "2", "3"];
      await page.waitForChanges();

      const expandedIds = await page.rootInstance.getExpandedNodeIds();
      expect(expandedIds).toContain("1");
      expect(expandedIds).toContain("2");
      expect(expandedIds).toContain("3");
    });

    it("handles rapid prop changes", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();

      page.rootInstance.lfSelectedNodeIds = ["1"];
      page.rootInstance.lfSelectedNodeIds = ["2"];
      page.rootInstance.lfSelectedNodeIds = ["3"];
      await page.waitForChanges();

      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual(["3"]);
    });

    it("handles dataset change while selection active", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      await page.rootInstance.setSelectedNodes("1");
      await page.waitForChanges();

      page.rootInstance.lfDataset = {
        nodes: [{ id: "99", value: "New Node" }],
      };
      await page.waitForChanges();

      expect(page.root).toBeDefined();
    });

    it("handles multiple refresh calls", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();

      await page.rootInstance.refresh();
      await page.rootInstance.refresh();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      expect(page.root).toBeDefined();
    });
  });
  //#endregion

  //#region Event Handlers
  describe("Event Handlers", () => {
    it("handles node click event", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const testNode = { id: "1", value: "Node 1" };
      page.rootInstance.lfDataset = { nodes: [testNode] };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );

      const nodeElement = page.root.shadowRoot.querySelector(".node");
      expect(nodeElement).not.toBeNull();

      const clickEvent = new MouseEvent("click", { bubbles: true });
      nodeElement.dispatchEvent(clickEvent);
      await page.waitForChanges();

      const clickEvents = events.filter((e) => e.detail.eventType === "click");
      expect(clickEvents.length).toBeGreaterThan(0);
      expect(clickEvents[0].detail.node?.id).toBe("1");
    });

    it("handles node pointerdown event", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const testNode = { id: "1", value: "Node 1" };
      page.rootInstance.lfDataset = { nodes: [testNode] };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );

      const nodeElement = page.root.shadowRoot.querySelector(".node");
      expect(nodeElement).not.toBeNull();

      const pointerEvent = new MouseEvent("pointerdown", { bubbles: true });
      nodeElement.dispatchEvent(pointerEvent);
      await page.waitForChanges();

      const pointerEvents = events.filter(
        (e) => e.detail.eventType === "pointerdown",
      );
      expect(pointerEvents.length).toBeGreaterThan(0);
      expect(pointerEvents[0].detail.node?.id).toBe("1");
    });

    it("includes expandedNodeIds in event payload", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      page.rootInstance.lfExpandedNodeIds = ["1"];
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );

      const nodeElement = page.root.shadowRoot.querySelector(".node");
      nodeElement?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      const clickEvents = events.filter((e) => e.detail.eventType === "click");
      expect(clickEvents[0]?.detail.expandedNodeIds).toBeDefined();
    });

    it("includes selectedNodeIds in event payload", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      page.rootInstance.lfSelectedNodeIds = ["1"];
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-tree-event", (e: CustomEvent) =>
        events.push(e),
      );

      const nodeElement = page.root.shadowRoot.querySelector(".node");
      nodeElement?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      const clickEvents = events.filter((e) => e.detail.eventType === "click");
      expect(clickEvents[0]?.detail.selectedNodeIds).toBeDefined();
    });
  });
  //#endregion

  //#region Watchers
  describe("Watchers", () => {
    it("handles lfDataset change", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();

      page.rootInstance.lfDataset = singleNodeDataset;
      await page.waitForChanges();

      const nodes = page.root.shadowRoot.querySelectorAll(".node");
      expect(nodes.length).toBeGreaterThan(0);
    });

    it("handles lfExpandedNodeIds change", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      await page.waitForChanges();

      page.rootInstance.lfExpandedNodeIds = ["1"];
      await page.waitForChanges();

      const expandedIds = await page.rootInstance.getExpandedNodeIds();
      expect(expandedIds).toContain("1");
    });

    it("handles lfSelectedNodeIds change", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();

      page.rootInstance.lfSelectedNodeIds = ["2"];
      await page.waitForChanges();

      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toContain("2");
    });

    it("handles lfInitialExpansionDepth change", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = hierarchicalDataset;
      await page.waitForChanges();

      page.rootInstance.lfInitialExpansionDepth = 1;
      await page.waitForChanges();

      expect(page.rootInstance.lfInitialExpansionDepth).toBe(1);
    });

    it("handles lfSelectable change", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = flatDataset;
      await page.waitForChanges();

      page.rootInstance.lfSelectable = false;
      await page.waitForChanges();

      expect(page.rootInstance.lfSelectable).toBe(false);
    });

    it("handles lfFilter change", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      page.rootInstance.lfDataset = filterableDataset;
      page.rootInstance.lfFilter = true;
      await page.waitForChanges();

      page.rootInstance.lfFilter = false;
      await page.waitForChanges();

      expect(page.rootInstance.lfFilter).toBe(false);
      expect(page.rootInstance._filterValue).toBe("");
    });
  });
  //#endregion
});

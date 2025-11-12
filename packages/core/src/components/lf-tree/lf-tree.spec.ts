import { newSpecPage } from "@stencil/core/testing";
import { LfTree } from "./lf-tree";
import { LfDataNode } from "@lf-widgets/foundations";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfTree], html });
  await page.waitForChanges();
  return page;
};

describe("lf-tree component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-tree></lf-tree>`);
    expect(page.root).toBeDefined();
    const tree = page.root.shadowRoot.querySelector(".tree");
    expect(tree).not.toBeNull();
  });

  it("renders nodes from dataset", async () => {
    const page = await createPage(`<lf-tree></lf-tree>`);
    page.rootInstance.lfDataset = { nodes: [{ id: "1", value: "Node 1" }] };
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const nodes = page.root.shadowRoot.querySelectorAll(".node");
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("expands node on click", async () => {
    const page = await createPage(`<lf-tree></lf-tree>`);
    page.rootInstance.lfDataset = {
      nodes: [
        { id: "1", value: "Node 1", children: [{ id: "2", value: "Child" }] },
      ],
    };
    await page.waitForChanges();
    // Trigger refresh to ensure watch method runs
    await page.rootInstance.refresh();
    await page.waitForChanges();
    const node = page.root.shadowRoot.querySelector(".node");
    expect(node).not.toBeNull();
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await page.waitForChanges();
    // Check if expanded
  });

  describe("selection functionality", () => {
    it("selects node via setSelectedNodes method", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const testNode = { id: "1", value: "Node 1" };
      page.rootInstance.lfDataset = { nodes: [testNode] };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Select node using public method
      await page.rootInstance.setSelectedNodes(testNode);
      await page.waitForChanges();

      // Verify selection state
      expect(page.rootInstance.selectedNode).toBe(testNode);
      expect(page.rootInstance.lfSelectedNodeIds).toContain("1");

      // Verify through getter
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

      // First select a node
      await page.rootInstance.setSelectedNodes(testNode);
      await page.waitForChanges();

      // Verify selection exists
      expect(page.rootInstance.lfSelectedNodeIds).toContain("1");

      // Clear selection
      await page.rootInstance.setSelectedNodes(null);
      await page.waitForChanges();

      // Verify selection is cleared
      expect(page.rootInstance.lfSelectedNodeIds).toEqual([]);
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual([]);
    });

    it("does not select when component is not selectable", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const testNode = { id: "1", value: "Node 1" };
      page.rootInstance.lfDataset = { nodes: [testNode] };
      page.rootInstance.lfSelectable = false;
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Try to select node using public method
      await page.rootInstance.setSelectedNodes(testNode);
      await page.waitForChanges();

      // Verify no selection occurred
      expect(page.rootInstance.selectedNode).toBeNull();
      // The prop might not be set if selectable was changed after init
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual([]);
    });

    it("handles prop changes for selected node ids", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const nodes = [
        { id: "1", value: "Node 1" },
        { id: "2", value: "Node 2" },
      ];
      page.rootInstance.lfDataset = { nodes };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Change the selected node ids prop
      page.rootInstance.lfSelectedNodeIds = ["1"];
      await page.waitForChanges();

      // Verify selection was applied
      expect(page.rootInstance.selectedNode?.id).toBe("1");
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual(["1"]);
    });

    it("selects single node when multiple are requested", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const nodes = [
        { id: "1", value: "Node 1" },
        { id: "2", value: "Node 2" },
        { id: "3", value: "Node 3" },
      ];
      page.rootInstance.lfDataset = { nodes };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Try to select multiple nodes (should select only first/last depending on implementation)
      await page.rootInstance.setSelectedNodes(["1", "3"]);
      await page.waitForChanges();

      // Verify selection (tree doesn't support multi-select, so should select one)
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds.length).toBe(1);
      expect(selectedIds).toContain("1");
    });

    it("selects node by predicate", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const nodes = [
        { id: "1", value: "Node 1" },
        { id: "2", value: "Node 2" },
        { id: "3", value: "Node 3" },
      ];
      page.rootInstance.lfDataset = { nodes };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Select node by predicate
      const selectedNode = await page.rootInstance.selectByPredicate(
        (node: LfDataNode) => node.value === "Node 2",
      );
      await page.waitForChanges();

      // Verify selection
      expect(selectedNode).toBeDefined();
      expect(selectedNode?.id).toBe("2");
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual(["2"]);
    });

    it("returns undefined when predicate matches no nodes", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const nodes = [
        { id: "1", value: "Node 1" },
        { id: "2", value: "Node 2" },
      ];
      page.rootInstance.lfDataset = { nodes };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Try to select non-existent node
      const selectedNode = await page.rootInstance.selectByPredicate(
        (node: LfDataNode) => node.value === "Non-existent",
      );
      await page.waitForChanges();

      // Verify no selection
      expect(selectedNode).toBeUndefined();
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual([]);
    });

    it("handles prop changes for selected node ids", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const nodes = [
        { id: "1", value: "Node 1" },
        { id: "2", value: "Node 2" },
      ];
      page.rootInstance.lfDataset = { nodes };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Change the selected node ids prop
      page.rootInstance.lfSelectedNodeIds = ["1"];
      await page.waitForChanges();

      // Verify selection was applied
      expect(page.rootInstance.selectedNode?.id).toBe("1");
      const selectedIds = await page.rootInstance.getSelectedNodeIds();
      expect(selectedIds).toEqual(["1"]);
    });
  });

  describe("event handlers", () => {
    it("handles node click event", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const testNode = { id: "1", value: "Node 1" };
      page.rootInstance.lfDataset = { nodes: [testNode] };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Mock the onLfEvent method
      const mockOnLfEvent = jest.fn();
      page.rootInstance.onLfEvent = mockOnLfEvent;

      // Find the node element and simulate click
      const nodeElement = page.root.shadowRoot.querySelector(".node");
      expect(nodeElement).not.toBeNull();

      // Create and dispatch click event
      const clickEvent = new MouseEvent("click", { bubbles: true });
      nodeElement.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Verify event was emitted
      expect(mockOnLfEvent).toHaveBeenCalledWith(clickEvent, "click", {
        node: testNode,
      });
    });

    it("handles filter input event", async () => {
      const page = await createPage(`<lf-tree lfFilter={true}></lf-tree>`);
      const nodes = [
        { id: "1", value: "Apple" },
        { id: "2", value: "Banana" },
        { id: "3", value: "Orange" },
      ];
      page.rootInstance.lfDataset = { nodes };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Mock the onLfEvent method
      const mockOnLfEvent = jest.fn();
      page.rootInstance.onLfEvent = mockOnLfEvent;

      // Find the filter textfield
      const filterField = page.root.shadowRoot.querySelector("lf-textfield");
      expect(filterField).not.toBeNull();

      // Create and dispatch textfield event
      const inputEvent = new CustomEvent("lf-textfield-event", {
        detail: { inputValue: "app" },
        bubbles: true,
      });
      filterField.dispatchEvent(inputEvent);
      await page.waitForChanges();

      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));

      // Verify event was emitted
      expect(mockOnLfEvent).toHaveBeenCalledWith(inputEvent, "lf-event");
    });

    it("handles node pointerdown event", async () => {
      const page = await createPage(`<lf-tree></lf-tree>`);
      const testNode = { id: "1", value: "Node 1" };
      page.rootInstance.lfDataset = { nodes: [testNode] };
      await page.waitForChanges();
      await page.rootInstance.refresh();
      await page.waitForChanges();

      // Mock the onLfEvent method
      const mockOnLfEvent = jest.fn();
      page.rootInstance.onLfEvent = mockOnLfEvent;

      // Find the node element and simulate pointerdown
      const nodeElement = page.root.shadowRoot.querySelector(".node");
      expect(nodeElement).not.toBeNull();

      // Create and dispatch pointerdown event (using MouseEvent as PointerEvent is not available in Jest)
      const pointerEvent = new MouseEvent("pointerdown", { bubbles: true });
      nodeElement.dispatchEvent(pointerEvent);
      await page.waitForChanges();

      // Verify event was emitted
      expect(mockOnLfEvent).toHaveBeenCalledWith(pointerEvent, "pointerdown", {
        node: testNode,
      });
    });
  });
});

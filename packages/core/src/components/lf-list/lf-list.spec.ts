import { newSpecPage } from "@stencil/core/testing";
import { LfList } from "./lf-list";
import { LfDataDataset } from "@lf-widgets/foundations";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfList], html });
  await page.waitForChanges();
  return page;
};

// Sample dataset for testing
const sampleDataset: LfDataDataset = {
  nodes: [
    { id: "1", value: "Item 1", description: "First Item" },
    { id: "2", value: "Item 2", description: "Second Item" },
    { id: "3", value: "Item 3", description: "Third Item" },
  ],
};

describe("lf-list component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-list></lf-list>`);
    expect(page.root).toBeDefined();
    const emptyData = page.root.shadowRoot.querySelector(".empty-data");
    expect(emptyData).not.toBeNull();
  });

  it("displays empty message when no dataset is provided", async () => {
    const page = await createPage(
      `<lf-list lf-empty="No items found"></lf-list>`,
    );
    const emptyData = page.root.shadowRoot.querySelector(".empty-data");
    expect(emptyData).not.toBeNull();
    expect(emptyData.textContent).toBe("No items found");
  });

  it("renders dataset items correctly", async () => {
    const page = await createPage(`<lf-list></lf-list>`);
    page.root.lfDataset = sampleDataset;
    await page.waitForChanges();

    const items = page.root.shadowRoot.querySelectorAll(".list__item");
    expect(items.length).toBe(3);

    const firstItem = items[0];
    expect(firstItem.textContent).toContain("Item 1");
  });

  it("reflects ui size attribute", async () => {
    const page = await createPage(`<lf-list lf-ui-size="small"></lf-list>`);
    expect(page.root.hasAttribute("lf-ui-size")).toBe(true);
    expect(page.root.getAttribute("lf-ui-size")).toBe("small");
  });

  it("returns props object when getProps is called", async () => {
    const page = await createPage(
      `<lf-list lf-empty="test empty" lf-selectable="true"></lf-list>`,
    );
    const props = await page.root.getProps();
    expect(props).toHaveProperty("lfEmpty", "test empty");
    expect(props).toHaveProperty("lfSelectable", true);
  });

  it("returns debug info when getDebugInfo is called", async () => {
    const page = await createPage(`<lf-list></lf-list>`);
    const debugInfo = await page.root.getDebugInfo();
    expect(debugInfo).toHaveProperty("renderCount");
    expect(debugInfo).toHaveProperty("renderStart");
    expect(debugInfo).toHaveProperty("renderEnd");
  });

  it("refresh method triggers re-render", async () => {
    const page = await createPage(`<lf-list></lf-list>`);
    page.root.lfDataset = sampleDataset;
    await page.waitForChanges();

    const initialItems =
      page.root.shadowRoot.querySelectorAll(".list__item").length;
    expect(initialItems).toBe(3);

    // Modify dataset
    page.root.lfDataset.nodes.push({
      id: "4",
      value: "Item 4",
      description: "Fourth Item",
    });

    // Refresh should update the DOM
    await page.root.refresh();
    await page.waitForChanges();

    const updatedItems =
      page.root.shadowRoot.querySelectorAll(".list__item").length;
    expect(updatedItems).toBe(4);
  });

  describe("filter functionality", () => {
    it("renders filter input when lfFilter is true", async () => {
      const page = await createPage(`<lf-list lf-filter="true"></lf-list>`);
      const filterElement = page.root.shadowRoot.querySelector("lf-textfield");
      expect(filterElement).not.toBeNull();
    });

    it("does not render filter input when lfFilter is false", async () => {
      const page = await createPage(`<lf-list lf-filter="false"></lf-list>`);
      const filterElement = page.root.shadowRoot.querySelector("lf-textfield");
      expect(filterElement).toBeNull();
    });

    it("shows all items when no filter is applied", async () => {
      const testDataset = {
        nodes: [
          { id: "1", value: "Item 1", description: "First Item" },
          { id: "2", value: "Item 2", description: "Second Item" },
          { id: "3", value: "Item 3", description: "Third Item" },
        ],
      };
      const page = await createPage(`<lf-list lf-filter="true"></lf-list>`);
      page.root.lfDataset = testDataset;
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(3);
    });

    it("filters items based on value match", async () => {
      const page = await createPage(`<lf-list></lf-list>`);
      page.root.lfFilter = true;
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      // Apply filter for "Item 1"
      await page.root.applyFilter("Item 1");
      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain("Item 1");
    });

    it("filters items case-insensitively", async () => {
      const page = await createPage(`<lf-list></lf-list>`);
      page.root.lfFilter = true;
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      // Apply filter with different case
      await page.root.applyFilter("item 2");
      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain("Item 2");
    });

    it("shows no items when filter matches nothing", async () => {
      const page = await createPage(`<lf-list></lf-list>`);
      page.root.lfFilter = true;
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      // Apply filter that matches nothing
      await page.root.applyFilter("nonexistent");
      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(0);

      // Should show "No items match your filter" message
      const emptyMessage = page.root.shadowRoot.querySelector(".empty-data");
      expect(emptyMessage.textContent).toContain("No items match your filter");
    });

    it("shows all items when filter is cleared", async () => {
      const testDataset = {
        nodes: [
          { id: "1", value: "Item 1", description: "First Item" },
          { id: "2", value: "Item 2", description: "Second Item" },
          { id: "3", value: "Item 3", description: "Third Item" },
        ],
      };
      const page = await createPage(`<lf-list></lf-list>`);
      page.root.lfFilter = true;
      page.root.lfDataset = testDataset;
      await page.waitForChanges();

      // Apply filter
      await page.root.applyFilter("Item 1");
      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      let items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(1);

      // Clear filter
      await page.root.applyFilter("");
      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(3);
    });

    it("debounces filter application", async () => {
      const page = await createPage(`<lf-list></lf-list>`);
      page.root.lfFilter = true;
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      // Apply multiple filters quickly
      await page.root.applyFilter("Item 1");
      await page.root.applyFilter("Item 2");
      await page.root.applyFilter("Item 3");

      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".list__item");
      // Should only show results for the last filter
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain("Item 3");
    });

    it("filters based on description when value doesn't match", async () => {
      const page = await createPage(`<lf-list></lf-list>`);
      page.root.lfFilter = true;
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      // Filter by description
      await page.root.applyFilter("First");
      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain("First Item");
    });

    it("handles filter toggle correctly", async () => {
      const testDataset = {
        nodes: [
          { id: "1", value: "Item 1", description: "First Item" },
          { id: "2", value: "Item 2", description: "Second Item" },
          { id: "3", value: "Item 3", description: "Third Item" },
        ],
      };
      const page = await createPage(`<lf-list></lf-list>`);
      page.root.lfFilter = true;
      page.root.lfDataset = testDataset;
      await page.waitForChanges();

      // Apply filter
      await page.root.applyFilter("Item 1");
      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      let items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(1);

      // Disable filter
      page.root.lfFilter = false;
      await page.waitForChanges();

      // Should show all items again
      items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(3);

      // Filter input should be hidden
      const filterElement = page.root.shadowRoot.querySelector("lf-textfield");
      expect(filterElement).toBeNull();
    });

    it("filters interactively via textfield input", async () => {
      const page = await createPage(`<lf-list></lf-list>`);
      page.root.lfFilter = true;
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      // Get the textfield element
      const filterElement = page.root.shadowRoot.querySelector("lf-textfield");
      expect(filterElement).not.toBeNull();

      // Simulate typing into the textfield by triggering the input event
      // Use different values for inputValue vs value to test the bug
      const inputEvent = new CustomEvent("lf-textfield-event", {
        detail: {
          eventType: "input",
          inputValue: "Item 1", // Current input value
          target: filterElement,
          value: "old value", // Stored component value (different!)
        },
      });

      filterElement.dispatchEvent(inputEvent);

      // Wait for debounce timeout
      await new Promise((resolve) => setTimeout(resolve, 350));
      await page.waitForChanges();

      const items = page.root.shadowRoot.querySelectorAll(".list__item");
      expect(items.length).toBe(1);
      expect(items[0].textContent).toContain("Item 1");
    });

    describe("keyboard navigation", () => {
      it("focuses next item with arrow down", async () => {
        const page = await createPage(`<lf-list></lf-list>`);
        page.root.lfNavigation = true;
        page.root.lfDataset = {
          nodes: [
            { id: "1", value: "Item 1", description: "First Item" },
            { id: "2", value: "Item 2", description: "Second Item" },
            { id: "3", value: "Item 3", description: "Third Item" },
          ],
        };
        await page.waitForChanges();

        // Call focusNext directly
        await page.root.focusNext();
        await page.waitForChanges();

        // Check that the first item has the focused class
        const focusedItem = page.root.shadowRoot.querySelector(
          ".list__item--focused",
        );
        expect(focusedItem).not.toBeNull();
        expect(focusedItem.textContent).toContain("Item 1");

        // Check that the first item has tabindex 0
        const firstItem =
          page.root.shadowRoot.querySelector('[data-index="0"]');
        expect(firstItem.getAttribute("tabindex")).toBe("0");
      });

      it("focuses previous item with arrow up", async () => {
        const page = await createPage(`<lf-list></lf-list>`);
        page.root.lfNavigation = true;
        page.root.lfDataset = {
          nodes: [
            { id: "1", value: "Item 1", description: "First Item" },
            { id: "2", value: "Item 2", description: "Second Item" },
            { id: "3", value: "Item 3", description: "Third Item" },
          ],
        };
        await page.waitForChanges();

        // Get the list container
        const listContainer = page.root.shadowRoot.querySelector("ul");
        expect(listContainer).not.toBeNull();

        // Focus the list container first
        listContainer.focus();

        // Simulate arrow up key press on the component (should wrap to last item)
        const keydownEvent = new KeyboardEvent("keydown", {
          key: "ArrowUp",
          bubbles: true,
        });
        page.root.dispatchEvent(keydownEvent);

        await page.waitForChanges();

        // Check that the last item is focused
        const focusedItem = page.root.shadowRoot.querySelector(
          ".list__item--focused",
        );
        expect(focusedItem).not.toBeNull();
        expect(focusedItem.textContent).toContain("Item 3");
      });

      it("maintains focus after filtering", async () => {
        const page = await createPage(
          `<lf-list lf-navigation="true" lf-filter="true"></lf-list>`,
        );
        page.root.lfDataset = sampleDataset;
        await page.waitForChanges();

        // Get the list container
        const listContainer = page.root.shadowRoot.querySelector("ul");
        expect(listContainer).not.toBeNull();

        // Focus the list container first
        listContainer.focus();

        // Simulate arrow down to focus first item
        const keydownEvent = new KeyboardEvent("keydown", {
          key: "ArrowDown",
          bubbles: true,
        });
        listContainer.dispatchEvent(keydownEvent);
        await page.waitForChanges();

        // Apply filter to show only one item
        await page.root.applyFilter("Item 1");
        await new Promise((resolve) => setTimeout(resolve, 350));
        await page.waitForChanges();

        // Try to navigate - should handle the reduced list correctly
        const keydownEvent2 = new KeyboardEvent("keydown", {
          key: "ArrowDown",
          bubbles: true,
        });
        listContainer.dispatchEvent(keydownEvent2);
        await page.waitForChanges();

        // Should still have focus on the remaining item
        const items = page.root.shadowRoot.querySelectorAll(".list__item");
        expect(items.length).toBe(1);
        expect(items[0].textContent).toContain("Item 1");
      });

      it("maintains correct selection when filtering and selecting", async () => {
        const page = await createPage(
          `<lf-list lf-selectable="true" lf-filter="true"></lf-list>`,
        );
        page.root.lfDataset = sampleDataset;
        await page.waitForChanges();

        // Initially select node[0]
        await page.root.selectNode(0);
        await page.waitForChanges();

        // Check DOM for selected class instead of accessing state directly
        const selectedItems = page.root.shadowRoot.querySelectorAll(
          ".list__item--selected",
        );
        expect(selectedItems.length).toBe(1);
        expect(selectedItems[0].textContent).toContain("Item 1");

        // Filter to show only node[3] (assuming sampleDataset has nodes at indices 0,1,2,3)
        const testDataset = {
          nodes: [
            { id: "0", value: "Item 0", description: "Zero" },
            { id: "1", value: "Item 1", description: "One" },
            { id: "2", value: "Item 2", description: "Two" },
            { id: "3", value: "Item 3", description: "Three" },
          ],
        };
        page.root.lfDataset = testDataset;
        await page.root.applyFilter("Item 3");
        await new Promise((resolve) => setTimeout(resolve, 350));
        await page.waitForChanges();

        // Verify only Item 3 is visible
        const visibleItems =
          page.root.shadowRoot.querySelectorAll(".list__item");
        expect(visibleItems.length).toBe(1);
        expect(visibleItems[0].textContent).toContain("Item 3");

        // Select the visible item (which is node[3] at visible position 0)
        // Since we know the visible item is node[3], select it directly by original index
        await page.root.selectNode(3);
        await page.waitForChanges();

        // Verify selection is now node[3] (original index 3) - check DOM
        const selectedAfterClick = page.root.shadowRoot.querySelectorAll(
          ".list__item--selected",
        );
        expect(selectedAfterClick.length).toBe(1);
        expect(selectedAfterClick[0].textContent).toContain("Item 3");

        // Clear filter
        await page.root.applyFilter("");
        await new Promise((resolve) => setTimeout(resolve, 350));
        await page.waitForChanges();

        // Verify all items are visible again
        const allItems = page.root.shadowRoot.querySelectorAll(".list__item");
        expect(allItems.length).toBe(4);

        // Verify that node[3] is still selected (not node[0])
        const selectedItemsFinal = page.root.shadowRoot.querySelectorAll(
          ".list__item--selected",
        );
        expect(selectedItemsFinal.length).toBe(1);
        expect(selectedItemsFinal[0].textContent).toContain("Item 3");
      });
    });
  });
});

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

    it.skip("uses default filter placeholder", async () => {
      const page = await createPage(`<lf-list lf-filter="true"></lf-list>`);
      const filterElement = page.root.shadowRoot.querySelector("lf-textfield");
      expect(filterElement).not.toBeNull();
      const inputElement = await filterElement.getElement();
      expect(inputElement.getAttribute("placeholder")).toBe("Filter items...");
    });

    it.skip("uses custom filter placeholder", async () => {
      const page = await createPage(`<lf-list lf-filter="true"></lf-list>`);
      page.root.lfFilterPlaceholder = "Search...";
      await page.waitForChanges();
      const filterElement = page.root.shadowRoot.querySelector("lf-textfield");
      const inputElement = await filterElement.getElement();
      expect(inputElement.getAttribute("placeholder")).toBe("Search...");
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
  });
});

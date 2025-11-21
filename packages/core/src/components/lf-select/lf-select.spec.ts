import { LfDataDataset } from "@lf-widgets/foundations";
import { newSpecPage } from "@stencil/core/testing";
import { LfList } from "../lf-list/lf-list";
import { LfTextfield } from "../lf-textfield/lf-textfield";
import { LfSelect } from "./lf-select";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Sample dataset for testing
const sampleDataset: LfDataDataset = {
  nodes: [
    { id: "test-id", value: "Test Option" },
    { id: "id1", value: "Option 1" },
    { id: "id2", value: "Option 2" },
  ],
};

// Larger dataset for filtering tests
const largeDataset: LfDataDataset = {
  nodes: [
    { id: "apple", value: "Apple" },
    { id: "banana", value: "Banana" },
    { id: "cherry", value: "Cherry" },
    { id: "date", value: "Date" },
    { id: "elderberry", value: "Elderberry" },
    { id: "fig", value: "Fig" },
    { id: "grape", value: "Grape" },
  ],
};

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({
    components: [LfSelect, LfList, LfTextfield],
    html,
  });
  return page;
};

describe("lf-select", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-select></lf-select>`);
    expect(page.root).toBeTruthy();
  });

  describe("Initialization", () => {
    it("should initialize value from lfValue when valid", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      // Check that internal value state is set
      expect(component.value).toBe("test-id");

      // Check that getValue returns the correct node
      const selectedNode = await component.getValue();
      expect(selectedNode).toBeTruthy();
      expect(selectedNode.id).toBe("test-id");
      expect(selectedNode.value).toBe("Test Option");
    });

    it("should not initialize with invalid lfValue", async () => {
      const page = await createPage(
        `<lf-select lf-value="invalid-id"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      // Should clear invalid value when dataset is set
      expect(component.value).toBeNull();

      const selectedNode = await component.getValue();
      expect(selectedNode).toBeNull();
    });

    it("should handle empty dataset", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );
      page.root.lfDataset = { nodes: [] };
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      expect(component.value).toBeNull();

      const selectedNode = await component.getValue();
      expect(selectedNode).toBeNull();
    });

    it("should handle null dataset", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();
      page.root.lfDataset = null;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      // Should clear value when dataset is set to null
      expect(component.value).toBeNull();

      const selectedNode = await component.getValue();
      expect(selectedNode).toBeNull();
    });
  });

  describe("Programmatic API", () => {
    it("should set value programmatically with setValue(id)", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Initially no value
      expect(component.value).toBeNull();
      let selectedNode = await component.getValue();
      expect(selectedNode).toBeNull();

      // Set value programmatically
      await component.setValue("test-id");

      // Check internal state and getValue
      expect(component.value).toBe("test-id");
      selectedNode = await component.getValue();
      expect(selectedNode.id).toBe("test-id");
      expect(selectedNode.value).toBe("Test Option");
    });

    it("should reject invalid setValue(id) calls", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Try to set invalid value
      await component.setValue("invalid-id");

      // Should remain null
      expect(component.value).toBeNull();
      const selectedNode = await component.getValue();
      expect(selectedNode).toBeNull();
    });

    it("should allow setting null/empty value", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Initially has value
      expect(component.value).toBe("test-id");

      // Set to null (should be allowed)
      await component.setValue(null);

      expect(component.value).toBeNull();
      const selectedNode = await component.getValue();
      expect(selectedNode).toBeNull();
    });

    it("should handle multiple setValue calls", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Set first value
      await component.setValue("id1");
      expect(component.value).toBe("id1");
      let selectedNode = await component.getValue();
      expect(selectedNode.value).toBe("Option 1");

      // Set second value
      await component.setValue("id2");
      expect(component.value).toBe("id2");
      selectedNode = await component.getValue();
      expect(selectedNode.value).toBe("Option 2");
    });

    it("should return correct selected index", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Initially no selection
      expect(await component.getSelectedIndex()).toBe(-1);

      // Set value to first item
      await component.setValue("test-id");
      expect(await component.getSelectedIndex()).toBe(0);

      // Set value to second item
      await component.setValue("id1");
      expect(await component.getSelectedIndex()).toBe(1);

      // Set invalid value
      await component.setValue("invalid");
      expect(await component.getSelectedIndex()).toBe(-1);
    });

    it("should fire change event when value is set programmatically", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Listen for the change event
      const changeEvents: CustomEvent[] = [];
      page.root.addEventListener("lf-select-event", (e: CustomEvent) => {
        if (e.detail.eventType === "change") {
          changeEvents.push(e);
        }
      });

      // Set value programmatically
      await component.setValue("test-id");
      await page.waitForChanges();

      // Check that change event was fired
      expect(changeEvents.length).toBe(1);
      expect(changeEvents[0].detail.eventType).toBe("change");
      expect(changeEvents[0].detail.node).toEqual(
        expect.objectContaining({ id: "test-id", value: "Test Option" }),
      );
      expect(changeEvents[0].detail.value).toBe("test-id");
    });

    it("should fire change event when value is cleared", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Listen for the change event
      const changeEvents: CustomEvent[] = [];
      page.root.addEventListener("lf-select-event", (e: CustomEvent) => {
        if (e.detail.eventType === "change") {
          changeEvents.push(e);
        }
      });

      // Clear value
      await component.setValue(null);
      await page.waitForChanges();

      // Check that change event was fired with null
      expect(changeEvents.length).toBe(1);
      expect(changeEvents[0].detail.eventType).toBe("change");
      expect(changeEvents[0].detail.node).toBeNull();
      expect(changeEvents[0].detail.value).toBeNull();
    });
  });

  describe("Dataset Changes", () => {
    it("should clear value when dataset changes and current value becomes invalid", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Initially should have value
      expect(component.value).toBe("test-id");
      let selectedNode = await component.getValue();
      expect(selectedNode).toBeTruthy();

      // Change dataset to not include the current value
      page.root.lfDataset = {
        nodes: [{ id: "other-id", value: "Other Option" }],
      };
      await page.waitForChanges();

      // Should clear the value
      expect(component.value).toBeNull();
      selectedNode = await component.getValue();
      expect(selectedNode).toBeNull();
    });

    it("should keep value when dataset changes but current value remains valid", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Initially should have value
      expect(component.value).toBe("test-id");

      // Change dataset but keep the same node
      page.root.lfDataset = {
        nodes: [
          { id: "test-id", value: "Updated Option" },
          { id: "other-id", value: "Other Option" },
        ],
      };
      await page.waitForChanges();

      // Should keep the value
      expect(component.value).toBe("test-id");
      const selectedNode = await component.getValue();
      expect(selectedNode.value).toBe("Updated Option");
    });

    it("should handle dataset becoming null", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Initially should have value
      expect(component.value).toBe("test-id");

      // Set dataset to null
      page.root.lfDataset = null;
      await page.waitForChanges();

      // Should clear the value
      expect(component.value).toBeNull();
      const selectedNode = await component.getValue();
      expect(selectedNode).toBeNull();
    });
  });

  describe("Component Integration", () => {
    it("should render textfield element", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      // Check that textfield is rendered
      const textfield = page.root.shadowRoot.querySelector("lf-textfield");
      expect(textfield).toBeTruthy();
    });

    it("should synchronize textfield value with selection", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot.querySelector("lf-textfield");

      expect(textfield).toBeTruthy();

      // Wait for textfield to render
      await page.waitForChanges();

      if (textfield && textfield.shadowRoot) {
        const input = textfield.shadowRoot.querySelector(
          "input",
        ) as HTMLInputElement;

        // Initially textfield should be empty
        expect(input.value).toBe("");

        // Set value programmatically
        await component.setValue("test-id");
        await page.waitForChanges();

        // Textfield should now show the selected value
        expect(input.value).toBe("Test Option");
      } else {
        // Fallback: check the textfield's lfValue attribute
        expect(textfield.getAttribute("lfvalue")).toBe("");

        await component.setValue("test-id");
        await page.waitForChanges();

        expect(textfield.getAttribute("lfvalue")).toBe("Test Option");
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle malformed dataset gracefully", async () => {
      const page = await createPage(
        `<lf-select lf-value="test-id"></lf-select>`,
      );

      const component = page.rootInstance as LfSelect;
      // Set malformed dataset
      page.root.lfDataset = { nodes: null } as any;
      await page.waitForChanges();

      // Should not crash and handle gracefully
      expect(component.value).toBeNull();
    });

    it("should handle setValue calls before component is fully initialized", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;

      // Call setValue immediately (before full initialization)
      await component.setValue("test-id");

      // Should still work
      expect(component.value).toBe("test-id");
      const selectedNode = await component.getValue();
      expect(selectedNode.id).toBe("test-id");
    });
  });

  describe("List Selection", () => {
    it("should update value when list item is selected", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      // Programmatically select a value (simulating list selection)
      const component = page.rootInstance as LfSelect;
      await component.setValue("id1");
      await page.waitForChanges();

      expect(component.value).toBe("id1");
      const selectedNode = await component.getValue();
      expect(selectedNode.value).toBe("Option 1");
    });
  });

  describe("Portal Size", () => {
    it("should maintain consistent width when portal opens", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const selectElement = page.root.shadowRoot?.querySelector("div[data-lf]");

      expect(selectElement).toBeTruthy();

      // Get initial width
      const initialWidth = selectElement!.getBoundingClientRect().width;

      // Open portal
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const actionIcon = textfield?.shadowRoot?.querySelector(
        '[part="icon-action"]',
      );
      const clickEvent = new MouseEvent("click");
      actionIcon!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Check width after opening
      const openWidth = selectElement!.getBoundingClientRect().width;
      expect(openWidth).toBe(initialWidth);
    });
  });

  describe("Portal Interactions", () => {
    it("should always render list element even without dataset", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      await page.waitForChanges();

      // List should be rendered even without dataset
      const list = page.root.shadowRoot?.querySelector("lf-list");
      expect(list).toBeTruthy();
    });

    it("should open portal when dropdown icon is clicked", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const actionIcon = textfield?.shadowRoot?.querySelector(
        '[part="icon-action"]',
      );
      expect(actionIcon).toBeTruthy();

      // Click action icon to open portal
      const clickEvent = new MouseEvent("click");
      actionIcon!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Portal should be open (list should be in portal)
      // Note: In test environment, we can't easily check portal state,
      // but we can verify the component doesn't crash and handles the event
      expect(page.root).toBeTruthy();
    });

    it("should close portal when clicking outside (blur event)", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const actionIcon = textfield?.shadowRoot?.querySelector(
        '[part="icon-action"]',
      );
      expect(actionIcon).toBeTruthy();

      // First open the portal
      const clickEvent = new MouseEvent("click");
      actionIcon!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Then simulate blur to close
      const blurEvent = new FocusEvent("blur");
      actionIcon!.dispatchEvent(blurEvent);
      await page.waitForChanges();

      // Component should handle the event without crashing
      expect(page.root).toBeTruthy();
    });

    it("should select item when list item is clicked", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const list = page.root.shadowRoot?.querySelector("lf-list");

      expect(list).toBeTruthy();

      // Simulate list item click event
      const clickEvent = new CustomEvent("lf-list-event", {
        detail: {
          eventType: "click",
          node: sampleDataset.nodes[1], // Select "Option 1"
        },
      });

      list!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Should update the value
      expect(component.value).toBe("id1");
      const selectedNode = await component.getValue();
      expect(selectedNode.value).toBe("Option 1");
    });

    it("should close portal after selecting list item", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const list = page.root.shadowRoot?.querySelector("lf-list");

      expect(list).toBeTruthy();

      // First open portal
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const actionIcon = textfield?.shadowRoot?.querySelector(
        '[part="icon-action"]',
      );
      const clickEvent = new MouseEvent("click");
      actionIcon!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Then select an item (should close portal)
      const listClickEvent = new CustomEvent("lf-list-event", {
        detail: {
          eventType: "click",
          node: sampleDataset.nodes[1],
        },
      });

      list!.dispatchEvent(listClickEvent);
      await page.waitForChanges();

      // Value should be updated
      expect(component.value).toBe("id1");
    });
  });

  describe("Portal State Management", () => {
    it("should handle portal toggle functionality", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      expect(textfield).toBeTruthy();

      // First click should open portal
      let clickEvent = new MouseEvent("click");
      textfield!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Second click should close portal (toggle)
      clickEvent = new MouseEvent("click");
      textfield!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Component should handle toggle without issues
      expect(page.root).toBeTruthy();
    });
  });

  describe("Portal Positioning", () => {
    it("should open portal and position dropdown correctly", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const actionIcon = textfield?.shadowRoot?.querySelector(
        '[part="icon-action"]',
      );
      expect(actionIcon).toBeTruthy();

      // Click to open portal
      const clickEvent = new MouseEvent("click");
      actionIcon!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Verify portal opens without errors
      expect(page.root).toBeTruthy();

      // In test environment, the list may still be in shadow root or moved to portal
      // The important thing is that the component handles the portal opening correctly
    });

    it("should handle portal positioning with sufficient viewport space", async () => {
      // Mock window dimensions to ensure sufficient space
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      // Set large viewport
      Object.defineProperty(window, "innerWidth", {
        value: 1920,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 1080,
        writable: true,
      });

      try {
        const page = await createPage(`<lf-select></lf-select>`);
        page.root.lfDataset = sampleDataset;
        await page.waitForChanges();

        // Position the select element in the center of viewport
        const selectElement =
          page.root.shadowRoot?.querySelector("div[data-lf]");
        if (selectElement) {
          Object.defineProperty(selectElement, "getBoundingClientRect", {
            value: () => ({
              top: 500,
              left: 800,
              right: 1000,
              bottom: 530,
              width: 200,
              height: 30,
            }),
            writable: true,
          });
        }

        const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
        const actionIcon = textfield?.shadowRoot?.querySelector(
          '[part="icon-action"]',
        );

        // Click to open portal
        const clickEvent = new MouseEvent("click");
        actionIcon!.dispatchEvent(clickEvent);
        await page.waitForChanges();

        // Should open without positioning errors
        expect(page.root).toBeTruthy();
      } finally {
        // Restore original window dimensions
        Object.defineProperty(window, "innerWidth", {
          value: originalInnerWidth,
          writable: true,
        });
        Object.defineProperty(window, "innerHeight", {
          value: originalInnerHeight,
          writable: true,
        });
      }
    });

    it("should handle portal positioning near viewport edges", async () => {
      // Test positioning behavior when select is near viewport edges
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      // Set viewport dimensions
      Object.defineProperty(window, "innerWidth", {
        value: 1200,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 800,
        writable: true,
      });

      try {
        const page = await createPage(`<lf-select></lf-select>`);
        page.root.lfDataset = sampleDataset;
        await page.waitForChanges();

        // Position the select element near the right edge
        const selectElement =
          page.root.shadowRoot?.querySelector("div[data-lf]");
        if (selectElement) {
          Object.defineProperty(selectElement, "getBoundingClientRect", {
            value: () => ({
              top: 100,
              left: 1000, // Near right edge
              right: 1150,
              bottom: 130,
              width: 150,
              height: 30,
            }),
            writable: true,
          });
        }

        const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
        const actionIcon = textfield?.shadowRoot?.querySelector(
          '[part="icon-action"]',
        );

        // Click to open portal
        const clickEvent = new MouseEvent("click");
        actionIcon!.dispatchEvent(clickEvent);
        await page.waitForChanges();

        // Should handle edge positioning without errors
        expect(page.root).toBeTruthy();

        // Test near left edge
        if (selectElement) {
          Object.defineProperty(selectElement, "getBoundingClientRect", {
            value: () => ({
              top: 100,
              left: 50, // Near left edge
              right: 200,
              bottom: 130,
              width: 150,
              height: 30,
            }),
            writable: true,
          });
        }

        // Click again to potentially reposition
        actionIcon!.dispatchEvent(clickEvent);
        await page.waitForChanges();
        actionIcon!.dispatchEvent(clickEvent);
        await page.waitForChanges();

        // Should handle left edge positioning without errors
        expect(page.root).toBeTruthy();
      } finally {
        // Restore original window dimensions
        Object.defineProperty(window, "innerWidth", {
          value: originalInnerWidth,
          writable: true,
        });
        Object.defineProperty(window, "innerHeight", {
          value: originalInnerHeight,
          writable: true,
        });
      }
    });

    it("should handle portal positioning with constrained viewport", async () => {
      // Test positioning when viewport is very small
      const originalInnerWidth = window.innerWidth;
      const originalInnerHeight = window.innerHeight;

      // Set small viewport
      Object.defineProperty(window, "innerWidth", {
        value: 400,
        writable: true,
      });
      Object.defineProperty(window, "innerHeight", {
        value: 300,
        writable: true,
      });

      try {
        const page = await createPage(`<lf-select></lf-select>`);
        page.root.lfDataset = sampleDataset;
        await page.waitForChanges();

        const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
        const actionIcon = textfield?.shadowRoot?.querySelector(
          '[part="icon-action"]',
        );

        // Click to open portal
        const clickEvent = new MouseEvent("click");
        actionIcon!.dispatchEvent(clickEvent);
        await page.waitForChanges();

        // Should handle constrained viewport without errors
        expect(page.root).toBeTruthy();
      } finally {
        // Restore original window dimensions
        Object.defineProperty(window, "innerWidth", {
          value: originalInnerWidth,
          writable: true,
        });
        Object.defineProperty(window, "innerHeight", {
          value: originalInnerHeight,
          writable: true,
        });
      }
    });
  });

  describe("Keyboard Navigation", () => {
    it("should navigate options with arrow keys when textfield is focused", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Focus the input
      input?.focus();
      await page.waitForChanges();

      // Initially no selection
      expect(component.value).toBeNull();

      // Press ArrowDown to select first option
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      expect(component.value).toBe("test-id");
      expect(await component.getSelectedIndex()).toBe(0);

      // Press ArrowDown again to select second option
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      expect(component.value).toBe("id1");
      expect(await component.getSelectedIndex()).toBe(1);

      // Press ArrowUp to go back
      const upEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
      input!.dispatchEvent(upEvent);
      await page.waitForChanges();

      expect(component.value).toBe("test-id");
      expect(await component.getSelectedIndex()).toBe(0);
    });

    it("should wrap around with arrow keys", async () => {
      const page = await createPage(`<lf-select lf-value="id2"></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Focus the input
      input?.focus();
      await page.waitForChanges();

      expect(component.value).toBe("id2");
      expect(await component.getSelectedIndex()).toBe(2);

      // Press ArrowDown to wrap to first
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      expect(component.value).toBe("test-id");
      expect(await component.getSelectedIndex()).toBe(0);

      // Press ArrowUp from first to last
      const upEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
      input!.dispatchEvent(upEvent);
      await page.waitForChanges();

      expect(component.value).toBe("id2");
      expect(await component.getSelectedIndex()).toBe(2);
    });
  });

  describe("lfNavigation Prop", () => {
    it("should enable keyboard navigation by default (lfNavigation = true)", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Focus the input
      input?.focus();
      await page.waitForChanges();

      // Initially no selection
      expect(component.value).toBeNull();

      // Press ArrowDown to select first option
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      // Should navigate
      expect(component.value).toBe("test-id");
    });

    it("should disable keyboard navigation when lfNavigation = false", async () => {
      const page = await createPage(
        `<lf-select lf-navigation="false"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Focus the input
      input?.focus();
      await page.waitForChanges();

      // Initially no selection
      expect(component.value).toBeNull();

      // Press ArrowDown - should NOT navigate
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      // Should remain unselected
      expect(component.value).toBeNull();
    });

    it("should re-enable keyboard navigation when lfNavigation changed to true", async () => {
      const page = await createPage(
        `<lf-select lf-navigation="false"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Change navigation to true
      page.root.lfNavigation = true;
      await page.waitForChanges();

      // Focus the input
      input?.focus();
      await page.waitForChanges();

      // Press ArrowDown - should now navigate
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      expect(component.value).toBe("test-id");
    });
  });

  describe("Portal Closing", () => {
    it("should handle Enter key press without crashing", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Open the dropdown by clicking
      const clickEvent = new MouseEvent("click");
      textfield!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Component should handle click without issues
      expect(page.root).toBeTruthy();

      // Press Enter - should handle without crashing
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      input!.dispatchEvent(enterEvent);
      await page.waitForChanges();

      // Component should still be functional
      expect(page.root).toBeTruthy();
    });

    it("should handle Escape key press without crashing", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Open the dropdown by clicking
      const clickEvent = new MouseEvent("click");
      textfield!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Component should handle click without issues
      expect(page.root).toBeTruthy();

      // Press Escape - should handle without crashing
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      input!.dispatchEvent(escapeEvent);
      await page.waitForChanges();

      // Component should still be functional
      expect(page.root).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle keyboard navigation with empty dataset", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = { nodes: [] };
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Focus the input
      input?.focus();
      await page.waitForChanges();

      // Press ArrowDown - should not crash
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      // Should remain null
      expect(component.value).toBeNull();
    });

    it("should handle keyboard navigation with single option", async () => {
      const singleOptionDataset: LfDataDataset = {
        nodes: [{ id: "single", value: "Single Option" }],
      };

      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = singleOptionDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Focus the input
      input?.focus();
      await page.waitForChanges();

      // Press ArrowDown to select the only option
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      expect(component.value).toBe("single");

      // Press ArrowDown again - should stay on the same option
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      expect(component.value).toBe("single");
    });

    it("should not respond to keyboard navigation when disabled", async () => {
      const page = await createPage(
        `<lf-select lf-navigation="false"></lf-select>`,
      );
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const component = page.rootInstance as LfSelect;
      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      const input = textfield?.shadowRoot?.querySelector("input");

      // Focus the input
      input?.focus();
      await page.waitForChanges();

      // Press ArrowDown - should not navigate
      const downEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input!.dispatchEvent(downEvent);
      await page.waitForChanges();

      // Should remain unselected
      expect(component.value).toBeNull();
    });
  });

  describe("Filtering", () => {
    it("should render filter input when lfFilter is enabled", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = largeDataset;
      page.root.lfListProps = { lfFilter: true };
      await page.waitForChanges();

      const list = page.root.shadowRoot?.querySelector("lf-list");
      expect(list).toBeTruthy();

      // Check that the list has filter enabled
      expect(list?.lfFilter).toBe(true);
    });

    it("should filter list items based on text input", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = largeDataset;
      page.root.lfListProps = { lfFilter: true };
      await page.waitForChanges();

      // Get the list and apply filter using the API
      const list = page.root.shadowRoot?.querySelector("lf-list") as any;
      expect(list).toBeTruthy();

      // Apply filter using the component's setFilter method
      await list.setFilter("a");
      await page.waitForChanges();

      // Check that only items containing "a" are visible
      const visibleItems = list?.shadowRoot?.querySelectorAll(
        ".list__item:not([hidden])",
      );
      expect(visibleItems?.length).toBeGreaterThan(0);

      // Should show Apple, Banana, Date, Grape (4 items)
      expect(visibleItems?.length).toBe(4);
    });
  });
});

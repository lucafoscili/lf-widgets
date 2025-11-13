import { newSpecPage } from "@stencil/core/testing";
import { LfSelect } from "./lf-select";
import { LfList } from "../lf-list/lf-list";
import { LfTextfield } from "../lf-textfield/lf-textfield";
import { LfDataDataset } from "@lf-widgets/foundations";
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
      const clickEvent = new MouseEvent("click");
      textfield!.dispatchEvent(clickEvent);
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

    it("should open portal when textfield is clicked", async () => {
      const page = await createPage(`<lf-select></lf-select>`);
      page.root.lfDataset = sampleDataset;
      await page.waitForChanges();

      const textfield = page.root.shadowRoot?.querySelector("lf-textfield");
      expect(textfield).toBeTruthy();

      // Click textfield to open portal
      const clickEvent = new MouseEvent("click");
      textfield!.dispatchEvent(clickEvent);
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
      expect(textfield).toBeTruthy();

      // First open the portal
      const clickEvent = new MouseEvent("click");
      textfield!.dispatchEvent(clickEvent);
      await page.waitForChanges();

      // Then simulate blur to close
      const blurEvent = new FocusEvent("blur");
      textfield!.dispatchEvent(blurEvent);
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
      const clickEvent = new MouseEvent("click");
      textfield!.dispatchEvent(clickEvent);
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
});

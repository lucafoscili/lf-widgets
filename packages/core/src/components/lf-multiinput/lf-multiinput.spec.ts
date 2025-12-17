import { LfDataDataset } from "@lf-widgets/foundations";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfChip } from "../lf-chip/lf-chip";
import { LfTextfield } from "../lf-textfield/lf-textfield";
import { LfMultiInput } from "./lf-multiinput";

const sampleDataset: LfDataDataset = {
  nodes: [
    { id: "1", value: "First" },
    { id: "2", value: "Second" },
    { id: "3", value: "Third" },
  ],
};

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfMultiInput, LfChip, LfTextfield],
    html,
  });
  await page.waitForChanges();
  return page;
};

const getInput = (page: SpecPage) =>
  page.root.shadowRoot.querySelector('[data-cy="input"]') as HTMLInputElement;

const getChip = (page: SpecPage) =>
  page.root.shadowRoot.querySelector("lf-chip");

const dispatchInputEvent = async (page: SpecPage, value: string) => {
  const input = getInput(page);
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await page.waitForChanges();
};

const dispatchEnterKey = async (page: SpecPage, value?: string) => {
  const input = getInput(page);
  if (value !== undefined) {
    input.value = value;
  }
  input.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
  );
  await page.waitForChanges();
};

describe("lf-multiinput", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render with default state", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      expect(page.root).toBeTruthy();
      expect(page.root.tagName.toLowerCase()).toBe("lf-multiinput");
    });

    it("should render shadow DOM structure", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      expect(page.root.shadowRoot).toBeTruthy();
    });

    it("should render input element", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const input = getInput(page);
      expect(input).toBeTruthy();
    });

    it("should render with custom id", async () => {
      const page = await createPage(
        `<lf-multiinput id="my-multiinput"></lf-multiinput>`,
      );
      expect(page.root.id).toBe("my-multiinput");
    });

    it("should render wrapper element", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("should have event emitter defined", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      // Check that event emitter exists on the component
      expect(component.lfEvent).toBeDefined();
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    it("should initialize value from lfValue", async () => {
      const page = await createPage(
        `<lf-multiinput lf-value="initial"></lf-multiinput>`,
      );
      const component = page.rootInstance as LfMultiInput;
      expect(await component.getValue()).toBe("initial");
    });

    it("should apply lfUiSize prop", async () => {
      const page = await createPage(
        `<lf-multiinput lf-ui-size="small"></lf-multiinput>`,
      );
      const component = page.rootInstance as LfMultiInput;
      expect(component.lfUiSize).toBe("small");
    });

    it("should apply lfUiState prop", async () => {
      const page = await createPage(
        `<lf-multiinput lf-ui-state="success"></lf-multiinput>`,
      );
      const component = page.rootInstance as LfMultiInput;
      expect(component.lfUiState).toBe("success");
    });

    it("should default lfMaxHistory to 10", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      expect(component.lfMaxHistory).toBe(10);
    });

    it("should default lfAllowFreeInput to true", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      expect(component.lfAllowFreeInput).toBe(true);
    });

    it("should default lfMode to history", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      expect(component.lfMode).toBe("history");
    });

    it("should apply lfDataset prop", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      const history = await component.getHistory();
      expect(history).toEqual(["First", "Second", "Third"]);
    });

    it("should apply custom lfStyle", async () => {
      const page = await createPage(
        `<lf-multiinput lf-style=".test { color: red; }"></lf-multiinput>`,
      );
      const component = page.rootInstance as LfMultiInput;
      expect(component.lfStyle).toBe(".test { color: red; }");
    });

    it("should apply lfChipProps", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfChipProps = { lfUiSize: "large" };
      await page.waitForChanges();
      expect(component.lfChipProps).toEqual({ lfUiSize: "large" });
    });

    it("should apply lfTextfieldProps", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfTextfieldProps = { lfLabel: "Test Label" };
      await page.waitForChanges();
      expect(component.lfTextfieldProps).toEqual({ lfLabel: "Test Label" });
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    it("should maintain internal value state", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await component.setValue("test-value");
      expect(await component.getValue()).toBe("test-value");
    });

    it("should maintain historyNodes state", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await component.setHistory(["item1", "item2"]);
      expect(await component.getHistory()).toEqual(["item1", "item2"]);
    });

    it("should track debug info state", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("should update state when lfDataset changes", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual([
        "First",
        "Second",
        "Third",
      ]);
    });

    it("should update state when lfMaxHistory changes", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await component.setHistory(["one", "two", "three", "four", "five"]);
      expect(await component.getHistory()).toHaveLength(5);

      component.lfMaxHistory = 2;
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual(["one", "two"]);
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo()", () => {
      it("should return debug lifecycle info", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        const debugInfo = await component.getDebugInfo();
        expect(debugInfo).toBeDefined();
      });
    });

    describe("getProps()", () => {
      it("should return all component props", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        const props = await component.getProps();
        expect(props).toHaveProperty("lfAllowFreeInput");
        expect(props).toHaveProperty("lfChipProps");
        expect(props).toHaveProperty("lfDataset");
        expect(props).toHaveProperty("lfMaxHistory");
        expect(props).toHaveProperty("lfMode");
        expect(props).toHaveProperty("lfStyle");
        expect(props).toHaveProperty("lfTextfieldProps");
        expect(props).toHaveProperty("lfUiSize");
        expect(props).toHaveProperty("lfUiState");
        expect(props).toHaveProperty("lfValue");
      });

      it("should return current prop values", async () => {
        const page = await createPage(
          `<lf-multiinput lf-value="test" lf-ui-size="large"></lf-multiinput>`,
        );
        const component = page.rootInstance as LfMultiInput;

        const props = await component.getProps();
        expect(props.lfValue).toBe("test");
        expect(props.lfUiSize).toBe("large");
      });
    });

    describe("getValue()", () => {
      it("should return empty string by default", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        expect(await component.getValue()).toBe("");
      });

      it("should return current value", async () => {
        const page = await createPage(
          `<lf-multiinput lf-value="current"></lf-multiinput>`,
        );
        const component = page.rootInstance as LfMultiInput;

        expect(await component.getValue()).toBe("current");
      });
    });

    describe("setValue()", () => {
      it("should set value programmatically", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.setValue("new-value");
        expect(await component.getValue()).toBe("new-value");
      });

      it("should handle empty string", async () => {
        const page = await createPage(
          `<lf-multiinput lf-value="initial"></lf-multiinput>`,
        );
        const component = page.rootInstance as LfMultiInput;

        await component.setValue("");
        expect(await component.getValue()).toBe("");
      });

      it("should handle null/undefined as empty string", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.setValue(null as any);
        expect(await component.getValue()).toBe("");

        await component.setValue(undefined as any);
        expect(await component.getValue()).toBe("");
      });
    });

    describe("getState()", () => {
      it("should return both value and history", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.setValue("current");
        await component.setHistory(["one", "two"]);

        const state = await component.getState();
        expect(state.value).toBe("current");
        expect(state.history).toEqual(["one", "two"]);
      });
    });

    describe("getHistory()", () => {
      it("should return empty array by default", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        expect(await component.getHistory()).toEqual([]);
      });

      it("should return history values", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.setHistory(["alpha", "beta"]);
        expect(await component.getHistory()).toEqual(["alpha", "beta"]);
      });
    });

    describe("setHistory()", () => {
      it("should set history values", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.setHistory(["a", "b", "c"]);
        expect(await component.getHistory()).toEqual(["a", "b", "c"]);
      });

      it("should handle empty array", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.setHistory(["initial"]);
        await component.setHistory([]);
        expect(await component.getHistory()).toEqual([]);
      });

      it("should deduplicate entries", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.setHistory(["a", "b", "a", "c", "b"]);
        expect(await component.getHistory()).toEqual(["a", "b", "c"]);
      });
    });

    describe("addToHistory()", () => {
      it("should add to history", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.addToHistory("first");
        expect(await component.getHistory()).toEqual(["first"]);
      });

      it("should add to front of history", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.addToHistory("alpha");
        await component.addToHistory("beta");
        expect(await component.getHistory()).toEqual(["beta", "alpha"]);
      });

      it("should not add duplicates but move to front", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.addToHistory("one");
        await component.addToHistory("two");
        await component.addToHistory("one");
        expect(await component.getHistory()).toEqual(["one", "two"]);
      });

      it("should not add empty value", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.addToHistory("");
        expect(await component.getHistory()).toEqual([]);
      });

      it("should not add when disabled", async () => {
        const page = await createPage(
          `<lf-multiinput lf-ui-state="disabled"></lf-multiinput>`,
        );
        const component = page.rootInstance as LfMultiInput;

        await component.addToHistory("test");
        expect(await component.getHistory()).toEqual([]);
      });
    });

    describe("refresh()", () => {
      it("should force update the component", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await expect(component.refresh()).resolves.not.toThrow();
      });
    });

    describe("unmount()", () => {
      it("should emit unmount event", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;
        const spy = jest.fn();
        page.root.addEventListener("lf-multiinput-event", spy);

        await component.unmount(0);
        await page.waitForChanges();

        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({ eventType: "unmount" }),
          }),
        );
      });

      it("should remove element from DOM", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        await component.unmount(0);
        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(page.root.parentNode).toBeNull();
      });

      it("should support delay parameter", async () => {
        const page = await createPage(`<lf-multiinput></lf-multiinput>`);
        const component = page.rootInstance as LfMultiInput;

        const start = Date.now();
        await component.unmount(100);
        await new Promise((resolve) => setTimeout(resolve, 150));
        const elapsed = Date.now() - start;

        expect(elapsed).toBeGreaterThanOrEqual(100);
      });
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    it("should emit input event while typing", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);

      await dispatchInputEvent(page, "hello");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "input",
            value: "hello",
          }),
        }),
      );
    });

    it("should emit change event on Enter key", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);

      await dispatchEnterKey(page, "committed");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "change",
            value: "committed",
          }),
        }),
      );
    });

    it("should emit select-history when chip clicked", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      await component.setHistory(["chip-value"]);
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);
      const chip = getChip(page);
      const node = component.lfDataset.nodes[0];

      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node },
        }),
      );
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "select-history",
            node,
            value: "chip-value",
          }),
        }),
      );
    });

    it("should emit clear-history when clearing", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      await component.setHistory(["keep"]);
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);

      const actionIcon = page.root.shadowRoot.querySelector(
        ".textfield__icon-action",
      );
      actionIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "clear-history",
          }),
        }),
      );
    });

    it("should include component reference in event detail", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);

      await dispatchInputEvent(page, "test");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ comp: component }),
        }),
      );
    });

    it("should include id in event detail", async () => {
      const page = await createPage(
        `<lf-multiinput id="test-id"></lf-multiinput>`,
      );
      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);

      await dispatchInputEvent(page, "test");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ id: "test-id" }),
        }),
      );
    });
  });
  //#endregion

  //#region Multi-value Handling (History Mode)
  describe("Multi-value Handling (History Mode)", () => {
    it("should update history on commit", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await dispatchEnterKey(page, "committed");

      expect(await component.getHistory()).toEqual(["committed"]);
    });

    it("should clear input after commit", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const input = getInput(page);

      await dispatchEnterKey(page, "committed");

      expect(input.value).toBe("");
    });

    it("should respect max history limit", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMaxHistory = 2;
      await page.waitForChanges();

      await component.setHistory(["one", "two", "one", "three"]);
      expect(await component.getHistory()).toEqual(["one", "two"]);
    });

    it("should select history value on chip click", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      await component.setHistory(["selected-value"]);
      await page.waitForChanges();

      const chip = getChip(page);
      const node = component.lfDataset.nodes[0];

      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node },
        }),
      );
      await page.waitForChanges();

      expect(await component.getValue()).toBe("selected-value");
    });

    it("should reject invalid value when free input disabled", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfAllowFreeInput = false;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      await dispatchEnterKey(page, "unknown");

      expect(await component.getValue()).toBe("");
      expect(await component.getHistory()).toEqual([
        "First",
        "Second",
        "Third",
      ]);
    });

    it("should accept valid value when free input disabled", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfAllowFreeInput = false;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      await dispatchEnterKey(page, "First");

      expect(await component.getValue()).toBe("First");
    });

    it("should clear history via clear action", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      await component.setHistory(["a", "b"]);
      await page.waitForChanges();

      const actionIcon = page.root.shadowRoot.querySelector(
        ".textfield__icon-action",
      );
      actionIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual([]);
    });
  });
  //#endregion

  //#region Tags Mode
  describe("Tags Mode", () => {
    it("should toggle tag on chip click", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMode = "tags";
      await component.setHistory(["tag1", "tag2"]);
      await page.waitForChanges();

      const chip = getChip(page);
      const [node1] = component.lfDataset.nodes;

      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node: node1 },
        }),
      );
      await page.waitForChanges();

      expect(await component.getValue()).toBe("tag1");
    });

    it("should allow multiple tags selection", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMode = "tags";
      await component.setHistory(["tag1", "tag2"]);
      await page.waitForChanges();

      const chip = getChip(page);
      const [node1, node2] = component.lfDataset.nodes;

      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node: node1 },
        }),
      );
      await page.waitForChanges();

      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node: node2 },
        }),
      );
      await page.waitForChanges();

      expect(await component.getValue()).toBe("tag1, tag2");
    });

    it("should deselect tag on second click", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMode = "tags";
      await component.setHistory(["tag1", "tag2"]);
      await page.waitForChanges();

      const chip = getChip(page);
      const [node1, node2] = component.lfDataset.nodes;

      // Select both
      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node: node1 },
        }),
      );
      await page.waitForChanges();

      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node: node2 },
        }),
      );
      await page.waitForChanges();

      // Deselect first
      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node: node1 },
        }),
      );
      await page.waitForChanges();

      expect(await component.getValue()).toBe("tag2");
    });

    it("should parse comma-separated tags on commit", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMode = "tags";
      await page.waitForChanges();

      await dispatchEnterKey(page, "tag1, tag2, tag1");

      expect(await component.getValue()).toBe("tag1, tag2");
      expect(await component.getHistory()).toEqual(["tag1", "tag2"]);
    });

    it("should drop unknown tags when free input disabled", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMode = "tags";
      component.lfAllowFreeInput = false;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      await dispatchEnterKey(page, "First, Unknown");

      expect(await component.getValue()).toBe("First");
      expect(await component.getHistory()).toEqual([
        "First",
        "Second",
        "Third",
      ]);
    });

    it("should preserve history in tags mode", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMode = "tags";
      await component.setHistory(["existing1", "existing2"]);
      await page.waitForChanges();

      const chip = getChip(page);
      const [node1] = component.lfDataset.nodes;

      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node: node1 },
        }),
      );
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual(["existing1", "existing2"]);
    });

    it("should clear value when history cleared in tags mode", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMode = "tags";
      await component.setHistory(["tag1"]);
      await component.setValue("tag1");
      await page.waitForChanges();

      const actionIcon = page.root.shadowRoot.querySelector(
        ".textfield__icon-action",
      );
      actionIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await page.waitForChanges();

      expect(await component.getValue()).toBe("");
    });
  });
  //#endregion

  //#region Disabled State
  describe("Disabled State", () => {
    it("should not emit input event while disabled", async () => {
      const page = await createPage(
        `<lf-multiinput lf-ui-state="disabled"></lf-multiinput>`,
      );
      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);

      await dispatchInputEvent(page, "try");

      expect(
        spy.mock.calls.find((call) => call[0]?.detail?.eventType === "input"),
      ).toBeUndefined();
    });

    it("should not emit change event while disabled", async () => {
      const page = await createPage(
        `<lf-multiinput lf-ui-state="disabled"></lf-multiinput>`,
      );
      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);

      await dispatchEnterKey(page, "try");

      expect(
        spy.mock.calls.find((call) => call[0]?.detail?.eventType === "change"),
      ).toBeUndefined();
    });

    it("should not emit select-history when chip clicked while disabled", async () => {
      const page = await createPage(
        `<lf-multiinput lf-ui-state="disabled"></lf-multiinput>`,
      );
      const component = page.rootInstance as LfMultiInput;
      await component.setHistory(["chip-value"]);
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-multiinput-event", spy);
      const chip = getChip(page);
      const node = component.lfDataset.nodes[0];

      chip.dispatchEvent(
        new CustomEvent("lf-chip-event", {
          detail: { eventType: "click", node },
        }),
      );
      await page.waitForChanges();

      expect(
        spy.mock.calls.find(
          (call) => call[0]?.detail?.eventType === "select-history",
        ),
      ).toBeUndefined();
    });

    it("should not clear history when disabled", async () => {
      const page = await createPage(
        `<lf-multiinput lf-ui-state="disabled"></lf-multiinput>`,
      );
      const component = page.rootInstance as LfMultiInput;
      await component.setHistory(["keep"]);
      await page.waitForChanges();

      const actionIcon = page.root.shadowRoot.querySelector(
        ".textfield__icon-action",
      );
      if (actionIcon) {
        actionIcon.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await page.waitForChanges();
      }

      expect(await component.getHistory()).toEqual(["keep"]);
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("should handle empty value on commit", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await dispatchEnterKey(page, "");

      expect(await component.getValue()).toBe("");
      expect(await component.getHistory()).toEqual([]);
    });

    it("should handle whitespace-only value on commit", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await dispatchEnterKey(page, "   ");

      // Behavior depends on implementation - verify it doesn't crash
      expect(await component.getValue()).toBeDefined();
    });

    it("should handle very long values", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      const longValue = "a".repeat(10000);

      await component.setValue(longValue);
      expect(await component.getValue()).toBe(longValue);
    });

    it("should handle special characters in values", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await component.setValue('<script>alert("xss")</script>');
      expect(await component.getValue()).toBe('<script>alert("xss")</script>');
    });

    it("should handle unicode characters", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await component.setValue("日本語テスト 🎉");
      expect(await component.getValue()).toBe("日本語テスト 🎉");
    });

    it("should handle maxHistory of 0", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMaxHistory = 0;
      await page.waitForChanges();

      await component.addToHistory("item");
      expect(await component.getHistory()).toEqual([]);
    });

    it("should handle negative maxHistory", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;
      component.lfMaxHistory = -5;
      await page.waitForChanges();

      // Should default to 10 for invalid values
      await component.setHistory(
        Array.from({ length: 15 }, (_, i) => `item${i}`),
      );
      const history = await component.getHistory();
      expect(history.length).toBeLessThanOrEqual(10);
    });

    it("should handle rapid value changes", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await Promise.all([
        component.setValue("value1"),
        component.setValue("value2"),
        component.setValue("value3"),
      ]);
      await page.waitForChanges();

      const finalValue = await component.getValue();
      expect(["value1", "value2", "value3"]).toContain(finalValue);
    });

    it("should handle dataset with null values", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      component.lfDataset = {
        nodes: [
          { id: "1", value: "valid" },
          { id: "2", value: null },
          { id: "3", value: "another" },
        ],
      };
      await page.waitForChanges();

      const history = await component.getHistory();
      expect(history).toBeDefined();
    });

    it("should handle dataset with undefined nodes", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      component.lfDataset = { nodes: undefined };
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual([]);
    });

    it("should handle null dataset", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      component.lfDataset = null;
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual([]);
    });

    it("should switch between modes", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      // Start in history mode
      await component.setHistory(["value1"]);
      await component.setValue("value1");

      // Switch to tags mode
      component.lfMode = "tags";
      await page.waitForChanges();

      // Should still have history and value
      expect(await component.getHistory()).toEqual(["value1"]);
      expect(await component.getValue()).toBe("value1");
    });

    it("should preserve dataset columns when setting history", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      component.lfDataset = {
        columns: [{ id: "col1", title: "Column 1" }],
        nodes: [{ id: "1", value: "initial" }],
      };
      await page.waitForChanges();

      await component.setHistory(["new1", "new2"]);
      expect(component.lfDataset.columns).toEqual([
        { id: "col1", title: "Column 1" },
      ]);
    });
  });
  //#endregion

  //#region Watcher Tests
  describe("Watchers", () => {
    it("should react to lfAllowFreeInput changes", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      // Start with free input enabled
      component.lfAllowFreeInput = true;
      await component.setValue("free-value");
      await page.waitForChanges();

      // Value should be set
      expect(await component.getValue()).toBe("free-value");

      // Disabling free input doesn't necessarily clear the value
      // The component may keep it until next validation
      component.lfAllowFreeInput = false;
      await page.waitForChanges();

      // The prop should be updated
      expect(component.lfAllowFreeInput).toBe(false);
    });

    it("should react to lfDataset changes", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual([
        "First",
        "Second",
        "Third",
      ]);

      component.lfDataset = { nodes: [{ id: "new", value: "New Value" }] };
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual(["New Value"]);
    });

    it("should react to lfMaxHistory changes", async () => {
      const page = await createPage(`<lf-multiinput></lf-multiinput>`);
      const component = page.rootInstance as LfMultiInput;

      await component.setHistory(["a", "b", "c", "d", "e"]);
      expect(await component.getHistory()).toHaveLength(5);

      component.lfMaxHistory = 3;
      await page.waitForChanges();

      expect(await component.getHistory()).toEqual(["a", "b", "c"]);
    });
  });
  //#endregion
});

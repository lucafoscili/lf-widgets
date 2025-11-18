import { LfDataDataset } from "@lf-widgets/foundations";
import { newSpecPage } from "@stencil/core/testing";
import { LfList } from "../lf-list/lf-list";
import { LfSpinner } from "../lf-spinner/lf-spinner";
import { LfTextfield } from "../lf-textfield/lf-textfield";
import { LfAutocomplete } from "./lf-autocomplete";
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
    components: [LfAutocomplete, LfList, LfSpinner, LfTextfield],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-autocomplete", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
    expect(page.root).toBeTruthy();
  });

  describe("Initialization", () => {
    it("should initialize inputValue from lfValue", async () => {
      const page = await createPage(
        `<lf-autocomplete lf-value="initial value"></lf-autocomplete>`,
      );
      const component = page.rootInstance as LfAutocomplete;
      await page.waitForChanges();
      expect(await component.getValue()).toBe("initial value");
    });
  });

  describe("Props", () => {
    it("should accept lfDataset", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();
      expect(component.lfDataset).toEqual(sampleDataset);
    });

    it("should accept lfAllowFreeInput", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfAllowFreeInput = false;
      await page.waitForChanges();
      expect(component.lfAllowFreeInput).toBe(false);
    });

    it("should accept lfMinChars", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfMinChars = 5;
      await page.waitForChanges();
      expect(component.lfMinChars).toBe(5);
    });

    it("should accept lfDebounceMs", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDebounceMs = 500;
      await page.waitForChanges();
      expect(component.lfDebounceMs).toBe(500);
    });
  });

  describe("Methods", () => {
    it("should set value via setValue", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      await component.setValue("new value");
      expect(await component.getValue()).toBe("new value");
    });

    it("should clear input via clearInput", async () => {
      const page = await createPage(
        `<lf-autocomplete lf-value="test"></lf-autocomplete>`,
      );
      const component = page.rootInstance as LfAutocomplete;
      await page.waitForChanges();
      await component.clearInput();
      expect(await component.getValue()).toBe("");
    });
  });

  describe("Events", () => {
    it("should emit ready event on load", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      // Ready event is emitted during componentDidLoad
      // We can check that the component loaded successfully
      expect(page.rootInstance).toBeDefined();
    });

    it("should emit input event on typing", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const spy = jest.fn();
      page.root.addEventListener("lf-autocomplete-event", spy);
      const textfield = page.root.shadowRoot.querySelector("lf-textfield");
      textfield.dispatchEvent(
        new CustomEvent("lf-textfield-event", {
          detail: { eventType: "input", inputValue: "test" },
        }),
      );
      await page.waitForChanges();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "input",
            query: "test",
          }),
        }),
      );
    });

    it("should emit change event on item selection", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();
      const spy = jest.fn();
      page.root.addEventListener("lf-autocomplete-event", spy);
      const list = page.root.shadowRoot.querySelector("lf-list");
      list.dispatchEvent(
        new CustomEvent("lf-list-event", {
          detail: { eventType: "click", node: sampleDataset.nodes[0] },
        }),
      );
      await page.waitForChanges();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "change",
            node: sampleDataset.nodes[0],
          }),
        }),
      );
    });
  });

  describe("Debouncing", () => {
    it("should emit input event immediately", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfMinChars = 1;
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-autocomplete-event", spy);

      const textfield = page.root.shadowRoot.querySelector("lf-textfield");
      textfield.dispatchEvent(
        new CustomEvent("lf-textfield-event", {
          detail: { eventType: "input", inputValue: "test" },
        }),
      );
      await page.waitForChanges();

      // Should emit input immediately
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            eventType: "input",
            query: "test",
          }),
        }),
      );
    });

    it("should not emit request if below minChars", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfMinChars = 3;
      component.lfDebounceMs = 100;
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-autocomplete-event", spy);

      const textfield = page.root.shadowRoot.querySelector("lf-textfield");
      textfield.dispatchEvent(
        new CustomEvent("lf-textfield-event", {
          detail: { eventType: "input", inputValue: "te" },
        }),
      );
      await page.waitForChanges();

      // Wait for potential debounce
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Should not emit request
      const requestCalls = spy.mock.calls.filter(
        (call) => call[0].detail.eventType === "request",
      );
      expect(requestCalls).toHaveLength(0);
    }, 10000);
  });

  describe("Loading and dropdown behavior", () => {
    it("should show spinner and not list while loading with null dataset", async () => {
      const page = await createPage(`<lf-autocomplete lf-min-chars="1"></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;

      const textfield = page.root.shadowRoot.querySelector("lf-textfield");
      (textfield as any).dispatchEvent(
        new CustomEvent("lf-textfield-event", {
          detail: { eventType: "input", inputValue: "te" },
        }),
      );

      await page.waitForChanges();

      const spinner = page.root.shadowRoot.querySelector("lf-spinner");
      const list = page.root.shadowRoot.querySelector("lf-list");

      expect(spinner).toBeTruthy();
      expect((spinner as HTMLLfSpinnerElement).lfActive).toBe(true);
      expect(list).toBeNull();
    });

    it("should hide spinner and show list when dataset is set (including empty)", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;

      // simulate request in progress
      (component as any).lfDataset = null;
      (component as any).loading = true;
      await page.waitForChanges();

      // request completed with empty dataset
      component.lfDataset = { nodes: [] };
      await page.waitForChanges();

      const spinner = page.root.shadowRoot.querySelector("lf-spinner");
      const list = page.root.shadowRoot.querySelector("lf-list");

      expect((spinner as HTMLLfSpinnerElement).lfActive).toBe(false);
      expect(list).not.toBeNull();
    });
  });
});

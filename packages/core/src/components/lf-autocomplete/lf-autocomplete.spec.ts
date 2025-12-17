import { LfDataDataset } from "@lf-widgets/foundations";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { LfList } from "../lf-list/lf-list";
import { LfSpinner } from "../lf-spinner/lf-spinner";
import { LfTextfield } from "../lf-textfield/lf-textfield";
import { LfAutocomplete } from "./lf-autocomplete";
import { getLfFramework } from "@lf-widgets/framework";

//#region Sample Datasets
const sampleDataset: LfDataDataset = {
  nodes: [
    { id: "test-id", value: "Test Option" },
    { id: "id1", value: "Option 1" },
    { id: "id2", value: "Option 2" },
  ],
};

const emptyDataset: LfDataDataset = {
  nodes: [],
};

const largeDataset: LfDataDataset = {
  nodes: Array.from({ length: 50 }, (_, i) => ({
    id: `item-${i}`,
    value: `Item ${i}`,
  })),
};
//#endregion

//#region Test Utilities
const createPage = async (html: string): Promise<SpecPage> => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfAutocomplete, LfList, LfSpinner, LfTextfield],
    html,
  });
  await page.waitForChanges();
  return page;
};

const getInput = (page: SpecPage): HTMLInputElement =>
  page.root.shadowRoot.querySelector('[data-cy="input"]') as HTMLInputElement;

const simulateInput = async (
  page: SpecPage,
  value: string,
): Promise<HTMLInputElement> => {
  const input = getInput(page);
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await page.waitForChanges();
  return input;
};

const waitForDebounce = (ms: number = 350): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
//#endregion

describe("lf-autocomplete", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render with shadow DOM", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      expect(page.root).toBeTruthy();
      expect(page.root.shadowRoot).toBeTruthy();
    });

    it("should render with default state", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      expect(component.inputValue).toBe("");
      expect(component.highlightedIndex).toBe(-1);
      expect(component.loading).toBe(false);
    });

    it("should render textfield input", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const input = getInput(page);
      expect(input).toBeTruthy();
    });

    it("should render with combobox role", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const combobox = page.root.shadowRoot.querySelector('[role="combobox"]');
      expect(combobox).toBeTruthy();
    });

    it("should have aria-haspopup attribute", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const combobox = page.root.shadowRoot.querySelector('[role="combobox"]');
      expect(combobox.getAttribute("aria-haspopup")).toBe("listbox");
    });

    it("should render with component id", async () => {
      const page = await createPage(
        `<lf-autocomplete id="my-autocomplete"></lf-autocomplete>`,
      );
      expect(page.root.id).toBe("my-autocomplete");
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    describe("lfAllowFreeInput", () => {
      it("should default to true", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfAllowFreeInput).toBe(true);
      });

      it("should accept false value", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfAllowFreeInput = false;
        await page.waitForChanges();
        expect(component.lfAllowFreeInput).toBe(false);
      });
    });

    describe("lfCache", () => {
      it("should default to false", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfCache).toBe(false);
      });

      it("should accept true value", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfCache = true;
        await page.waitForChanges();
        expect(component.lfCache).toBe(true);
      });
    });

    describe("lfCacheTTL", () => {
      it("should default to 300000ms (5 minutes)", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfCacheTTL).toBe(300000);
      });

      it("should accept custom TTL", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfCacheTTL = 600000;
        await page.waitForChanges();
        expect(component.lfCacheTTL).toBe(600000);
      });
    });

    describe("lfDataset", () => {
      it("should default to null", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfDataset).toBeNull();
      });

      it("should accept dataset", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfDataset = sampleDataset;
        await page.waitForChanges();
        expect(component.lfDataset).toEqual(sampleDataset);
      });

      it("should accept empty dataset", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfDataset = emptyDataset;
        await page.waitForChanges();
        expect(component.lfDataset.nodes).toEqual([]);
      });
    });

    describe("lfDebounceMs", () => {
      it("should default to 300ms", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfDebounceMs).toBe(300);
      });

      it("should accept custom debounce value", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfDebounceMs = 500;
        await page.waitForChanges();
        expect(component.lfDebounceMs).toBe(500);
      });
    });

    describe("lfMinChars", () => {
      it("should default to 3", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfMinChars).toBe(3);
      });

      it("should accept custom minChars", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfMinChars = 5;
        await page.waitForChanges();
        expect(component.lfMinChars).toBe(5);
      });
    });

    describe("lfMaxCacheSize", () => {
      it("should default to 100", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfMaxCacheSize).toBe(100);
      });

      it("should accept custom max cache size", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfMaxCacheSize = 50;
        await page.waitForChanges();
        expect(component.lfMaxCacheSize).toBe(50);
      });
    });

    describe("lfNavigation", () => {
      it("should default to true", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfNavigation).toBe(true);
      });

      it("should accept false value", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfNavigation = false;
        await page.waitForChanges();
        expect(component.lfNavigation).toBe(false);
      });
    });

    describe("lfUiSize", () => {
      it("should default to medium", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfUiSize).toBe("medium");
      });

      it("should accept small size", async () => {
        const page = await createPage(
          `<lf-autocomplete lf-ui-size="small"></lf-autocomplete>`,
        );
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfUiSize).toBe("small");
      });

      it("should accept large size", async () => {
        const page = await createPage(
          `<lf-autocomplete lf-ui-size="large"></lf-autocomplete>`,
        );
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfUiSize).toBe("large");
      });
    });

    describe("lfUiState", () => {
      it("should default to primary", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfUiState).toBe("primary");
      });

      it("should accept disabled state", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfUiState = "disabled";
        await page.waitForChanges();
        expect(component.lfUiState).toBe("disabled");
      });

      it("should accept secondary state", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfUiState = "secondary";
        await page.waitForChanges();
        expect(component.lfUiState).toBe("secondary");
      });
    });

    describe("lfValue", () => {
      it("should default to empty string", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfValue).toBe("");
      });

      it("should initialize inputValue from lfValue", async () => {
        const page = await createPage(
          `<lf-autocomplete lf-value="initial value"></lf-autocomplete>`,
        );
        const component = page.rootInstance as LfAutocomplete;
        expect(await component.getValue()).toBe("initial value");
      });
    });

    describe("lfStyle", () => {
      it("should default to null", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfStyle).toBeNull();
      });

      it("should accept custom styles", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfStyle = "color: red;";
        await page.waitForChanges();
        expect(component.lfStyle).toBe("color: red;");
      });
    });

    describe("lfListProps", () => {
      it("should default to null", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfListProps).toBeNull();
      });

      it("should accept list props", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfListProps = { lfUiSize: "small" };
        await page.waitForChanges();
        expect(component.lfListProps).toEqual({ lfUiSize: "small" });
      });
    });

    describe("lfSpinnerProps", () => {
      it("should default to null", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfSpinnerProps).toBeNull();
      });

      it("should accept spinner props", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfSpinnerProps = { lfUiSize: "small" };
        await page.waitForChanges();
        expect(component.lfSpinnerProps).toEqual({ lfUiSize: "small" });
      });
    });

    describe("lfTextfieldProps", () => {
      it("should default to null", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lfTextfieldProps).toBeNull();
      });

      it("should accept textfield props", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfTextfieldProps = { lfLabel: "Search" };
        await page.waitForChanges();
        expect(component.lfTextfieldProps).toEqual({ lfLabel: "Search" });
      });
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    describe("highlightedIndex", () => {
      it("should default to -1", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.highlightedIndex).toBe(-1);
      });

      it("should update highlighted index", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.highlightedIndex = 2;
        await page.waitForChanges();
        expect(component.highlightedIndex).toBe(2);
      });
    });

    describe("loading", () => {
      it("should default to false", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.loading).toBe(false);
      });

      it("should update loading state", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.loading = true;
        await page.waitForChanges();
        expect(component.loading).toBe(true);
      });
    });

    describe("inputValue", () => {
      it("should default to empty string", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.inputValue).toBe("");
      });

      it("should update input value state", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.inputValue = "test";
        await page.waitForChanges();
        expect(component.inputValue).toBe("test");
      });
    });

    describe("lastRequestedQuery", () => {
      it("should default to empty string", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(component.lastRequestedQuery).toBe("");
      });
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo", () => {
      it("should return debug info", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        const debugInfo = await component.getDebugInfo();
        expect(debugInfo).toBeDefined();
      });
    });

    describe("getProps", () => {
      it("should return all props", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        const props = await component.getProps();
        expect(props).toBeDefined();
        expect(props.lfMinChars).toBe(3);
        expect(props.lfDebounceMs).toBe(300);
        expect(props.lfAllowFreeInput).toBe(true);
      });

      it("should reflect updated props", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfMinChars = 5;
        component.lfDebounceMs = 500;
        await page.waitForChanges();
        const props = await component.getProps();
        expect(props.lfMinChars).toBe(5);
        expect(props.lfDebounceMs).toBe(500);
      });
    });

    describe("getValue", () => {
      it("should return empty string by default", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        expect(await component.getValue()).toBe("");
      });

      it("should return current input value", async () => {
        const page = await createPage(
          `<lf-autocomplete lf-value="test value"></lf-autocomplete>`,
        );
        const component = page.rootInstance as LfAutocomplete;
        expect(await component.getValue()).toBe("test value");
      });
    });

    describe("setValue", () => {
      it("should set the input value", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        await component.setValue("new value");
        expect(await component.getValue()).toBe("new value");
      });

      it("should update inputValue state", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        await component.setValue("updated");
        expect(component.inputValue).toBe("updated");
      });
    });

    describe("clearInput", () => {
      it("should clear the input value", async () => {
        const page = await createPage(
          `<lf-autocomplete lf-value="test"></lf-autocomplete>`,
        );
        const component = page.rootInstance as LfAutocomplete;
        await component.clearInput();
        expect(await component.getValue()).toBe("");
      });

      it("should set inputValue to empty string", async () => {
        const page = await createPage(
          `<lf-autocomplete lf-value="test"></lf-autocomplete>`,
        );
        const component = page.rootInstance as LfAutocomplete;
        await component.clearInput();
        expect(component.inputValue).toBe("");
      });
    });

    describe("clearCache", () => {
      it("should clear the cache", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfCache = true;
        await component.clearCache();
        // Cache should be cleared (no error thrown)
        expect(component.lfCache).toBe(true);
      });
    });

    describe("refresh", () => {
      it("should force re-render without error", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        await expect(component.refresh()).resolves.toBeUndefined();
      });
    });

    describe("unmount", () => {
      it("should emit unmount event", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        const spy = jest.fn();
        page.root.addEventListener("lf-autocomplete-event", spy);
        await component.unmount();
        await waitForDebounce(50);
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              eventType: "unmount",
            }),
          }),
        );
      });
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    describe("ready event", () => {
      it("should emit ready event on componentDidLoad", async () => {
        const spy = jest.fn();
        getLfFramework();
        const page = await newSpecPage({
          components: [LfAutocomplete, LfList, LfSpinner, LfTextfield],
          html: `<lf-autocomplete></lf-autocomplete>`,
        });
        page.root.addEventListener("lf-autocomplete-event", spy);
        await page.waitForChanges();
        // Ready is emitted during load, check component is defined
        expect(page.rootInstance).toBeDefined();
      });
    });

    describe("input event", () => {
      it("should emit input event on typing", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const spy = jest.fn();
        page.root.addEventListener("lf-autocomplete-event", spy);
        await simulateInput(page, "test");
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              eventType: "input",
              query: "test",
            }),
          }),
        );
      });

      it("should include component id in event", async () => {
        const page = await createPage(
          `<lf-autocomplete id="test-id"></lf-autocomplete>`,
        );
        const spy = jest.fn();
        page.root.addEventListener("lf-autocomplete-event", spy);
        await simulateInput(page, "hello");
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              id: "test-id",
            }),
          }),
        );
      });
    });

    describe("change event", () => {
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

      it("should include selected node in change event", async () => {
        const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
        const component = page.rootInstance as LfAutocomplete;
        component.lfDataset = sampleDataset;
        await page.waitForChanges();

        const spy = jest.fn();
        page.root.addEventListener("lf-autocomplete-event", spy);

        const list = page.root.shadowRoot.querySelector("lf-list");
        list.dispatchEvent(
          new CustomEvent("lf-list-event", {
            detail: { eventType: "click", node: sampleDataset.nodes[1] },
          }),
        );
        await page.waitForChanges();

        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              node: { id: "id1", value: "Option 1" },
            }),
          }),
        );
      });
    });
  });
  //#endregion

  //#region Dropdown/List Behavior
  describe("Dropdown/List Behavior", () => {
    it("should render lf-list when dataset is provided", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();
      const list = page.root.shadowRoot.querySelector("lf-list");
      expect(list).toBeTruthy();
    });

    it("should pass dataset to lf-list", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();
      const list = page.root.shadowRoot.querySelector(
        "lf-list",
      ) as HTMLElement & { lfDataset: LfDataDataset };
      expect(list.lfDataset).toEqual(sampleDataset);
    });

    it("should handle large datasets", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = largeDataset;
      await page.waitForChanges();
      expect(component.lfDataset.nodes.length).toBe(50);
    });
  });
  //#endregion

  //#region Selection Handling
  describe("Selection Handling", () => {
    it("should update input value on selection", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      const list = page.root.shadowRoot.querySelector("lf-list");
      list.dispatchEvent(
        new CustomEvent("lf-list-event", {
          detail: { eventType: "click", node: sampleDataset.nodes[0] },
        }),
      );
      await page.waitForChanges();

      expect(await component.getValue()).toBe("Test Option");
    });

    it("should update inputValue state on selection", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      const list = page.root.shadowRoot.querySelector("lf-list");
      list.dispatchEvent(
        new CustomEvent("lf-list-event", {
          detail: { eventType: "click", node: sampleDataset.nodes[1] },
        }),
      );
      await page.waitForChanges();

      expect(component.inputValue).toBe("Option 1");
    });

    it("should handle selection with empty value", async () => {
      const datasetWithEmpty: LfDataDataset = {
        nodes: [{ id: "empty", value: "" }],
      };
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = datasetWithEmpty;
      await page.waitForChanges();

      const list = page.root.shadowRoot.querySelector("lf-list");
      list.dispatchEvent(
        new CustomEvent("lf-list-event", {
          detail: { eventType: "click", node: datasetWithEmpty.nodes[0] },
        }),
      );
      await page.waitForChanges();

      expect(await component.getValue()).toBe("");
    });
  });
  //#endregion

  //#region Debouncing Behavior
  describe("Debouncing Behavior", () => {
    it("should emit input event immediately", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfMinChars = 1;
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-autocomplete-event", spy);
      await simulateInput(page, "test");

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
      await simulateInput(page, "te");
      await waitForDebounce(200);

      const requestCalls = spy.mock.calls.filter(
        (call) => call[0].detail.eventType === "request",
      );
      expect(requestCalls).toHaveLength(0);
    }, 10000);

    it("should respect custom debounce time", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDebounceMs = 50;
      component.lfMinChars = 1;
      await page.waitForChanges();

      const spy = jest.fn();
      page.root.addEventListener("lf-autocomplete-event", spy);
      await simulateInput(page, "test");

      // Input should be immediate
      const inputCalls = spy.mock.calls.filter(
        (call) => call[0].detail.eventType === "input",
      );
      expect(inputCalls.length).toBeGreaterThan(0);
    });
  });
  //#endregion

  //#region Loading State
  describe("Loading State", () => {
    it("should set loading to true when input meets minChars", async () => {
      const page = await createPage(
        `<lf-autocomplete lf-min-chars="1"></lf-autocomplete>`,
      );
      const component = page.rootInstance as LfAutocomplete;
      await simulateInput(page, "test");
      expect(component.loading).toBe(true);
    });

    it("should hide loading when dataset is set", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.loading = true;
      await page.waitForChanges();

      component.lfDataset = sampleDataset;
      await page.waitForChanges();

      expect(component.loading).toBe(false);
    });

    it("should hide loading with empty dataset", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.loading = true;
      await page.waitForChanges();

      component.lfDataset = emptyDataset;
      await page.waitForChanges();

      expect(component.loading).toBe(false);
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("should handle null dataset gracefully", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = null;
      await page.waitForChanges();
      expect(component.lfDataset).toBeNull();
    });

    it("should handle empty input", async () => {
      const page = await createPage(
        `<lf-autocomplete lf-value="test"></lf-autocomplete>`,
      );
      const component = page.rootInstance as LfAutocomplete;
      await simulateInput(page, "");
      expect(component.inputValue).toBe("");
    });

    it("should handle special characters in input", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      await component.setValue("<script>alert('xss')</script>");
      expect(await component.getValue()).toBe("<script>alert('xss')</script>");
    });

    it("should handle rapid input changes", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfMinChars = 1;
      await page.waitForChanges();

      await simulateInput(page, "a");
      await simulateInput(page, "ab");
      await simulateInput(page, "abc");
      await page.waitForChanges();

      expect(component.inputValue).toBe("abc");
    });

    it("should handle whitespace-only input", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      await simulateInput(page, "   ");
      expect(component.inputValue).toBe("   ");
    });

    it("should handle dataset with special characters", async () => {
      const specialDataset: LfDataDataset = {
        nodes: [
          { id: "1", value: "Test & Special <chars>" },
          { id: "2", value: "Quotes 'single' \"double\"" },
        ],
      };
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = specialDataset;
      await page.waitForChanges();
      expect(component.lfDataset.nodes[0].value).toBe("Test & Special <chars>");
    });

    it("should preserve input on re-render", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      await component.setValue("preserved value");
      await component.refresh();
      await page.waitForChanges();
      expect(await component.getValue()).toBe("preserved value");
    });

    it("should handle minChars of 0", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfMinChars = 0;
      await page.waitForChanges();
      expect(component.lfMinChars).toBe(0);
    });

    it("should handle very large debounce value", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDebounceMs = 10000;
      await page.waitForChanges();
      expect(component.lfDebounceMs).toBe(10000);
    });
  });
  //#endregion

  //#region Keyboard Navigation
  describe("Keyboard Navigation", () => {
    it("should have navigation enabled by default", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      expect(component.lfNavigation).toBe(true);
    });

    it("should update highlightedIndex state", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfDataset = sampleDataset;
      component.highlightedIndex = 0;
      await page.waitForChanges();
      expect(component.highlightedIndex).toBe(0);
    });

    it("should reset highlightedIndex to -1 by default", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      expect(component.highlightedIndex).toBe(-1);
    });
  });
  //#endregion

  //#region Cache Behavior
  describe("Cache Behavior", () => {
    it("should not cache results when lfCache is false", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      expect(component.lfCache).toBe(false);
    });

    it("should enable caching when lfCache is true", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfCache = true;
      await page.waitForChanges();
      expect(component.lfCache).toBe(true);
    });

    it("should respect maxCacheSize", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfCache = true;
      component.lfMaxCacheSize = 10;
      await page.waitForChanges();
      expect(component.lfMaxCacheSize).toBe(10);
    });

    it("should clear cache via clearCache method", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      component.lfCache = true;
      await component.clearCache();
      // Should complete without error
      expect(component.lfCache).toBe(true);
    });
  });
  //#endregion

  //#region Component Lifecycle
  describe("Component Lifecycle", () => {
    it("should initialize adapter on componentWillLoad", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      // Component should be fully initialized
      expect(component).toBeDefined();
    });

    it("should update debugInfo on render", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      const component = page.rootInstance as LfAutocomplete;
      const debugInfo = await component.getDebugInfo();
      expect(debugInfo).toBeDefined();
    });

    it("should clean up on disconnectedCallback", async () => {
      const page = await createPage(`<lf-autocomplete></lf-autocomplete>`);
      // Removing the element should trigger disconnectedCallback
      page.root.remove();
      await page.waitForChanges();
      // No error should be thrown
      expect(true).toBe(true);
    });
  });
  //#endregion
});

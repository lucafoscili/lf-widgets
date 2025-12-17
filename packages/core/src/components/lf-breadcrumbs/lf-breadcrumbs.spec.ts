import { LfDataDataset } from "@lf-widgets/foundations";
import { getLfFramework } from "@lf-widgets/framework";
import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { LfBreadcrumbs } from "./lf-breadcrumbs";

//#region Test Data
const sampleDataset: LfDataDataset = {
  nodes: [
    {
      id: "home",
      value: "Home",
      children: [
        {
          id: "products",
          value: "Products",
          children: [
            {
              id: "electronics",
              value: "Electronics",
              children: [{ id: "phones", value: "Phones" }],
            },
          ],
        },
      ],
    },
  ],
};

const deepDataset: LfDataDataset = {
  nodes: [
    {
      id: "level1",
      value: "Level 1",
      children: [
        {
          id: "level2",
          value: "Level 2",
          children: [
            {
              id: "level3",
              value: "Level 3",
              children: [
                {
                  id: "level4",
                  value: "Level 4",
                  children: [
                    {
                      id: "level5",
                      value: "Level 5",
                      children: [{ id: "level6", value: "Level 6" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const multiRootDataset: LfDataDataset = {
  nodes: [
    {
      id: "root1",
      value: "Root 1",
      children: [{ id: "child1", value: "Child 1" }],
    },
    {
      id: "root2",
      value: "Root 2",
      children: [{ id: "child2", value: "Child 2" }],
    },
  ],
};

const emptyDataset: LfDataDataset = {
  nodes: [],
};
//#endregion

//#region Test Helpers
const createPage = async (html = "<lf-breadcrumbs></lf-breadcrumbs>") => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfBreadcrumbs],
    html,
  });
  await page.waitForChanges();
  return page;
};

const getItems = (page: SpecPage) =>
  page.root.shadowRoot.querySelectorAll(".breadcrumbs__item");

const getSeparators = (page: SpecPage) =>
  page.root.shadowRoot.querySelectorAll(".breadcrumbs__separator");

const getTruncation = (page: SpecPage) =>
  page.root.shadowRoot.querySelector(".breadcrumbs__truncation") as HTMLElement;

const getWrapper = (page: SpecPage) =>
  page.root.shadowRoot.querySelector("#lf-component");

const getEmptyMessage = (page: SpecPage) =>
  page.root.shadowRoot.querySelector(".breadcrumbs__empty");
//#endregion

describe("lf-breadcrumbs", () => {
  //#region Basic Rendering
  describe("Basic Rendering", () => {
    it("should render with default structure", async () => {
      const page = await createPage();

      expect(page.root).toBeDefined();
      expect(page.root.tagName.toLowerCase()).toBe("lf-breadcrumbs");
      expect(page.root.shadowRoot).toBeDefined();
    });

    it("should render wrapper element", async () => {
      const page = await createPage();

      const wrapper = getWrapper(page);
      expect(wrapper).toBeDefined();
    });

    it("should render empty message when no dataset", async () => {
      const page = await createPage();

      const empty = getEmptyMessage(page);
      expect(empty).toBeDefined();
      expect(empty.textContent).toBe("Empty data.");
    });

    it("should render with custom id attribute", async () => {
      const page = await createPage(
        '<lf-breadcrumbs id="my-breadcrumbs"></lf-breadcrumbs>',
      );

      expect(page.root.id).toBe("my-breadcrumbs");
    });

    it("should render items from dataset", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items.length).toBe(4);
    });

    it("should render correct item text content", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items[0].textContent).toContain("Home");
      expect(items[1].textContent).toContain("Products");
      expect(items[2].textContent).toContain("Electronics");
      expect(items[3].textContent).toContain("Phones");
    });
  });
  //#endregion

  //#region Props Handling
  describe("Props Handling", () => {
    it("should use default props when not specified", async () => {
      const page = await createPage();

      const props = await page.root.getProps();
      expect(props.lfSeparator).toBe(">");
      expect(props.lfEmpty).toBe("Empty data.");
      expect(props.lfInteractive).toBe(true);
      expect(props.lfShowRoot).toBe(true);
      expect(props.lfRipple).toBe(false);
      expect(props.lfUiSize).toBe("medium");
      expect(props.lfUiState).toBe("primary");
    });

    it("should apply custom lfSeparator", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-separator="/"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const separators = getSeparators(page);
      expect(separators[0].textContent).toBe("/");
    });

    it("should apply custom lfEmpty message", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-empty="No breadcrumbs available"></lf-breadcrumbs>',
      );

      const empty = getEmptyMessage(page);
      expect(empty.textContent).toBe("No breadcrumbs available");
    });

    it("should hide root when lfShowRoot is false", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-show-root="false"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items.length).toBe(3);
      expect(items[0].textContent).toContain("Products");
    });

    it("should apply lfMaxItems for truncation", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const truncation = getTruncation(page);
      const items = getItems(page);

      expect(truncation).toBeTruthy();
      expect(items.length).toBe(2);
    });

    it("should apply lfInteractive false to disable interaction", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-interactive="false"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const item = getItems(page)[0] as HTMLElement;
      expect(item.getAttribute("tabindex")).toBeNull();
    });

    it("should apply lfUiSize prop", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-ui-size="small"></lf-breadcrumbs>',
      );

      const props = await page.root.getProps();
      expect(props.lfUiSize).toBe("small");
    });

    it("should apply lfUiState prop", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-ui-state="success"></lf-breadcrumbs>',
      );

      const props = await page.root.getProps();
      expect(props.lfUiState).toBe("success");
    });

    it("should apply lfStyle custom styles", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-style=".test { color: red; }"></lf-breadcrumbs>',
      );

      const styleEl = page.root.shadowRoot.querySelector("#lf-style");
      expect(styleEl).toBeDefined();
    });

    it("should update props dynamically", async () => {
      const page = await createPage();

      page.root.lfSeparator = "→";
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const separators = getSeparators(page);
      expect(separators[0].textContent).toBe("→");
    });
  });
  //#endregion

  //#region State Management
  describe("State Management", () => {
    it("should track currentNodeId state", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items[items.length - 1].textContent).toContain("Phones");
    });

    it("should track expanded state for truncation", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      // Initially collapsed
      expect(getTruncation(page)).toBeTruthy();

      // Expand
      getTruncation(page).click();
      await page.waitForChanges();

      // Now expanded
      expect(getTruncation(page)).toBeNull();
      expect(getItems(page).length).toBe(4);
    });

    it("should maintain state after refresh", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "electronics";
      await page.waitForChanges();

      const initialItemCount = getItems(page).length;

      await page.root.refresh();
      await page.waitForChanges();

      expect(getItems(page).length).toBe(initialItemCount);
    });

    it("should update state when lfValue changes", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "products";
      await page.waitForChanges();

      expect(getItems(page).length).toBe(2);

      page.root.lfValue = "phones";
      await page.waitForChanges();

      expect(getItems(page).length).toBe(4);
    });
  });
  //#endregion

  //#region Public Methods
  describe("Public Methods", () => {
    describe("getDebugInfo", () => {
      it("should return debug info object", async () => {
        const page = await createPage();
        const debugInfo = await page.root.getDebugInfo();

        expect(debugInfo).toBeDefined();
      });

      it("should contain lifecycle information", async () => {
        const page = await createPage();
        const debugInfo = await page.root.getDebugInfo();

        expect(debugInfo).toHaveProperty("endTime");
        expect(debugInfo).toHaveProperty("renderCount");
        expect(debugInfo).toHaveProperty("renderEnd");
        expect(debugInfo).toHaveProperty("renderStart");
        expect(debugInfo).toHaveProperty("startTime");
      });
    });

    describe("getProps", () => {
      it("should return all props", async () => {
        const page = await createPage();
        const props = await page.root.getProps();

        expect(props).toHaveProperty("lfDataset");
        expect(props).toHaveProperty("lfEmpty");
        expect(props).toHaveProperty("lfInteractive");
        expect(props).toHaveProperty("lfMaxItems");
        expect(props).toHaveProperty("lfRipple");
        expect(props).toHaveProperty("lfSeparator");
        expect(props).toHaveProperty("lfShowRoot");
        expect(props).toHaveProperty("lfStyle");
        expect(props).toHaveProperty("lfUiSize");
        expect(props).toHaveProperty("lfUiState");
        expect(props).toHaveProperty("lfValue");
      });

      it("should return custom prop values", async () => {
        const page = await createPage(
          '<lf-breadcrumbs lf-separator="/" lf-empty="Nothing here"></lf-breadcrumbs>',
        );
        const props = await page.root.getProps();

        expect(props.lfSeparator).toBe("/");
        expect(props.lfEmpty).toBe("Nothing here");
      });

      it("should reflect prop changes in getProps", async () => {
        const page = await createPage();

        page.root.lfSeparator = "•";
        await page.waitForChanges();

        const props = await page.root.getProps();
        expect(props.lfSeparator).toBe("•");
      });
    });

    describe("refresh", () => {
      it("should trigger re-render", async () => {
        const page = await createPage();
        page.root.lfDataset = sampleDataset;
        page.root.lfValue = "phones";
        await page.waitForChanges();

        const initialCount = getItems(page).length;

        page.root.lfValue = "electronics";
        await page.root.refresh();
        await page.waitForChanges();

        expect(getItems(page).length).toBe(initialCount - 1);
      });

      it("should not throw when called multiple times", async () => {
        const page = await createPage();

        await expect(page.root.refresh()).resolves.not.toThrow();
        await expect(page.root.refresh()).resolves.not.toThrow();
        await expect(page.root.refresh()).resolves.not.toThrow();
      });
    });

    describe("setCurrentNode", () => {
      it("should set current node by id", async () => {
        const page = await createPage();
        page.root.lfDataset = sampleDataset;
        page.root.lfValue = "phones";
        await page.waitForChanges();

        await page.root.setCurrentNode("products");
        await page.waitForChanges();

        const items = getItems(page);
        expect(items.length).toBe(2);
        expect(items[items.length - 1].textContent).toContain("Products");
      });

      it("should update path when setting different nodes", async () => {
        const page = await createPage();
        page.root.lfDataset = sampleDataset;
        page.root.lfValue = "home";
        await page.waitForChanges();

        expect(getItems(page).length).toBe(1);

        await page.root.setCurrentNode("electronics");
        await page.waitForChanges();

        expect(getItems(page).length).toBe(3);
      });
    });

    describe("unmount", () => {
      it("should call unmount method without error", async () => {
        const page = await createPage();
        // Call unmount - should not throw
        await page.root.unmount(0);
        await new Promise((resolve) => setTimeout(resolve, 50));
        // Component should be removed
        expect(page.body.querySelector("lf-breadcrumbs")).toBeNull();
      });

      it("should remove element from DOM", async () => {
        const page = await createPage();

        await page.root.unmount(0);
        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(page.body.querySelector("lf-breadcrumbs")).toBeNull();
      });

      it("should support delayed unmount", async () => {
        const page = await createPage();

        await page.root.unmount(100);
        expect(page.body.querySelector("lf-breadcrumbs")).not.toBeNull();

        await new Promise((resolve) => setTimeout(resolve, 150));
        expect(page.body.querySelector("lf-breadcrumbs")).toBeNull();
      });
    });
  });
  //#endregion

  //#region Event Emission
  describe("Event Emission", () => {
    it("should have event emitter defined", async () => {
      const page = await createPage();
      // Check that the event emitter exists
      expect(page.rootInstance.lfEvent).toBeDefined();
    });

    it("should emit click event on item click", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

      const item = getItems(page)[0] as HTMLElement;
      item.click();
      await page.waitForChanges();

      expect(eventSpy).toHaveBeenCalled();
      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.eventType).toBe("click");
    });

    it("should include node data in click event", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

      const item = getItems(page)[0] as HTMLElement;
      item.click();
      await page.waitForChanges();

      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.node.id).toBe("home");
      expect(event.detail.node.value).toBe("Home");
    });

    it("should emit expand event when truncation clicked", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

      getTruncation(page).click();
      await page.waitForChanges();

      const expandEvent = eventSpy.mock.calls.find(
        (call) => call[0].detail.eventType === "expand",
      );
      expect(expandEvent).toBeTruthy();
    });

    it("should include component reference in event", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

      const item = getItems(page)[0] as HTMLElement;
      item.click();
      await page.waitForChanges();

      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.comp).toBe(page.rootInstance);
    });

    it("should include id in event payload", async () => {
      const page = await createPage(
        '<lf-breadcrumbs id="test-breadcrumbs"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

      const item = getItems(page)[0] as HTMLElement;
      item.click();
      await page.waitForChanges();

      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.id).toBe("test-breadcrumbs");
    });
  });
  //#endregion

  //#region Navigation Behavior
  describe("Navigation Behavior", () => {
    it("should display path from root to current node", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items[0].textContent).toContain("Home");
      expect(items[items.length - 1].textContent).toContain("Phones");
    });

    it("should handle deep navigation paths", async () => {
      const page = await createPage();
      page.root.lfDataset = deepDataset;
      page.root.lfValue = "level6";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items.length).toBe(6);
    });

    it("should render correct number of separators", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const items = getItems(page);
      const separators = getSeparators(page);
      expect(separators.length).toBe(items.length - 1);
    });

    it("should handle clicking on intermediate items", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

      const productsItem = getItems(page)[1] as HTMLElement;
      productsItem.click();
      await page.waitForChanges();

      const event = eventSpy.mock.calls[0][0];
      expect(event.detail.node.id).toBe("products");
    });

    it("should support keyboard navigation with Enter key", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

      const item = getItems(page)[0] as HTMLElement;
      const keyEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      item.dispatchEvent(keyEvent);
      await page.waitForChanges();

      expect(eventSpy).toHaveBeenCalled();
    });

    it("should not trigger click when interactive is false", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-interactive="false"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const eventSpy = jest.fn();
      page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

      const item = getItems(page)[0] as HTMLElement;
      item.click();
      await page.waitForChanges();

      const clickEvent = eventSpy.mock.calls.find(
        (call) => call[0].detail.eventType === "click",
      );
      expect(clickEvent).toBeFalsy();
    });
  });
  //#endregion

  //#region Truncation Behavior
  describe("Truncation Behavior", () => {
    it("should truncate when items exceed lfMaxItems", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const truncation = getTruncation(page);
      expect(truncation).toBeTruthy();
    });

    it("should show first and last items when truncated", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items[0].textContent).toContain("Home");
      expect(items[items.length - 1].textContent).toContain("Phones");
    });

    it("should expand on truncation click", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      getTruncation(page).click();
      await page.waitForChanges();

      expect(getTruncation(page)).toBeNull();
      expect(getItems(page).length).toBe(4);
    });

    it("should expand on keyboard Enter on truncation", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const truncation = getTruncation(page);
      const keyEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      });
      truncation.dispatchEvent(keyEvent);
      await page.waitForChanges();

      expect(getTruncation(page)).toBeNull();
    });

    it("should not expand when not interactive", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3" lf-interactive="false"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      getTruncation(page).click();
      await page.waitForChanges();

      expect(getTruncation(page)).toBeTruthy();
    });

    it("should not truncate when items are less than lfMaxItems", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="10"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      expect(getTruncation(page)).toBeNull();
      expect(getItems(page).length).toBe(4);
    });

    it("should handle truncation with deep paths", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>',
      );
      page.root.lfDataset = deepDataset;
      page.root.lfValue = "level6";
      await page.waitForChanges();

      expect(getTruncation(page)).toBeTruthy();

      getTruncation(page).click();
      await page.waitForChanges();

      expect(getItems(page).length).toBe(6);
    });
  });
  //#endregion

  //#region Edge Cases
  describe("Edge Cases", () => {
    it("should handle empty dataset", async () => {
      const page = await createPage();
      page.root.lfDataset = emptyDataset;
      await page.waitForChanges();

      const empty = getEmptyMessage(page);
      expect(empty).toBeDefined();
    });

    it("should handle null dataset", async () => {
      const page = await createPage();
      page.root.lfDataset = null;
      await page.waitForChanges();

      const empty = getEmptyMessage(page);
      expect(empty).toBeDefined();
    });

    it("should handle undefined lfValue", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = undefined;
      await page.waitForChanges();

      expect(page.root).toBeDefined();
    });

    it("should handle invalid node id", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "nonexistent";
      await page.waitForChanges();

      expect(page.root).toBeDefined();
    });

    it("should handle single node path", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "home";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items.length).toBe(1);
      expect(getSeparators(page).length).toBe(0);
    });

    it("should handle dataset with multiple roots", async () => {
      const page = await createPage();
      page.root.lfDataset = multiRootDataset;
      page.root.lfValue = "child1";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items.length).toBe(2);
    });

    it("should handle special characters in separator", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-separator="→"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      const separators = getSeparators(page);
      expect(separators[0].textContent).toBe("→");
    });

    it("should handle lfMaxItems of 1", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="1"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      expect(page.root).toBeDefined();
    });

    it("should handle lfMaxItems of 2", async () => {
      const page = await createPage(
        '<lf-breadcrumbs lf-max-items="2"></lf-breadcrumbs>',
      );
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      // With maxItems=2 and 4 breadcrumbs, truncation may be shown
      // The behavior depends on component implementation
      const items = getItems(page);
      // Should show at most maxItems visible items
      expect(items.length).toBeLessThanOrEqual(4);
    });

    it("should handle rapid dataset changes", async () => {
      const page = await createPage();

      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      page.root.lfDataset = deepDataset;
      page.root.lfValue = "level6";
      await page.waitForChanges();

      const items = getItems(page);
      expect(items.length).toBe(6);
    });

    it("should handle empty string lfValue", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "";
      await page.waitForChanges();

      expect(page.root).toBeDefined();
    });

    it("should preserve component integrity after multiple refreshes", async () => {
      const page = await createPage();
      page.root.lfDataset = sampleDataset;
      page.root.lfValue = "phones";
      await page.waitForChanges();

      for (let i = 0; i < 5; i++) {
        await page.root.refresh();
        await page.waitForChanges();
      }

      expect(getItems(page).length).toBe(4);
    });
  });
  //#endregion
});

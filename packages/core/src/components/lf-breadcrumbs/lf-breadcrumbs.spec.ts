import { LfDataDataset } from "@lf-widgets/foundations";
import { getLfFramework } from "@lf-widgets/framework";
import { newSpecPage } from "@stencil/core/testing";
import { LfBreadcrumbs } from "./lf-breadcrumbs";

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

const createPage = async (html = "<lf-breadcrumbs></lf-breadcrumbs>") => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfBreadcrumbs],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-breadcrumbs component", () => {
  it("renders with default props", async () => {
    const page = await createPage();
    expect(page.root).toBeDefined();

    const props = await page.root.getProps();
    expect(props.lfSeparator).toBe(">");
    expect(props.lfEmpty).toBe("Empty data.");
  });

  it("displays path correctly from dataset", async () => {
    const page = await createPage();
    page.root.lfDataset = sampleDataset;
    page.root.lfCurrentNodeId = "phones";
    await page.waitForChanges();

    const items = page.root.shadowRoot.querySelectorAll(".breadcrumbs__item");
    expect(items.length).toBe(4);
    expect(items[items.length - 1].textContent).toContain("Phones");
  });

  it("renders separator between items and supports custom separator", async () => {
    const page = await createPage('<lf-breadcrumbs lf-separator="/"></lf-breadcrumbs>');
    page.root.lfDataset = sampleDataset;
    page.root.lfCurrentNodeId = "phones";
    await page.waitForChanges();

    const separators =
      page.root.shadowRoot.querySelectorAll(".breadcrumbs__separator");
    expect(separators.length).toBe(3);
    expect(separators[0].textContent).toBe("/");
  });

  it("hides root when lfShowRoot is false", async () => {
    const page = await createPage('<lf-breadcrumbs lf-show-root="false"></lf-breadcrumbs>');
    page.root.lfDataset = sampleDataset;
    page.root.lfCurrentNodeId = "phones";
    await page.waitForChanges();

    const items = page.root.shadowRoot.querySelectorAll(".breadcrumbs__item");
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain("Products");
  });

  it("truncates middle items when lfMaxItems is set", async () => {
    const page = await createPage('<lf-breadcrumbs lf-max-items="3"></lf-breadcrumbs>');
    page.root.lfDataset = sampleDataset;
    page.root.lfCurrentNodeId = "phones";
    await page.waitForChanges();

    const truncation = page.root.shadowRoot.querySelector(
      ".breadcrumbs__truncation",
    );
    const items = page.root.shadowRoot.querySelectorAll(".breadcrumbs__item");

    expect(truncation).toBeTruthy();
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain("Home");
    expect(items[items.length - 1].textContent).toContain("Phones");
  });

  it("disables interactivity when lfInteractive is false", async () => {
    const page = await createPage('<lf-breadcrumbs lf-interactive="false"></lf-breadcrumbs>');
    page.root.lfDataset = sampleDataset;
    page.root.lfCurrentNodeId = "phones";
    await page.waitForChanges();

    const item = page.root.shadowRoot.querySelector(
      ".breadcrumbs__item",
    ) as HTMLElement;
    expect(item.getAttribute("tabindex")).toBeNull();
  });

  it("emits lf-breadcrumbs-event on item click", async () => {
    const page = await createPage();
    page.root.lfDataset = sampleDataset;
    page.root.lfCurrentNodeId = "phones";
    await page.waitForChanges();

    const eventSpy = jest.fn();
    page.root.addEventListener("lf-breadcrumbs-event", eventSpy);

    const item = page.root.shadowRoot.querySelector(
      ".breadcrumbs__item",
    ) as HTMLElement;
    item.click();
    await page.waitForChanges();

    expect(eventSpy).toHaveBeenCalled();
    const event = eventSpy.mock.calls[0][0];
    expect(event.detail.eventType).toBe("click");
    expect(event.detail.node.id).toBe("home");
  });

  it("returns props via getProps", async () => {
    const page = await createPage('<lf-breadcrumbs lf-separator="/"></lf-breadcrumbs>');
    const props = await page.root.getProps();
    expect(props.lfSeparator).toBe("/");
  });

  it("returns debug info via getDebugInfo", async () => {
    const page = await createPage();
    const debugInfo = await page.root.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("refresh triggers re-render", async () => {
    const page = await createPage();
    page.root.lfDataset = sampleDataset;
    page.root.lfCurrentNodeId = "phones";
    await page.waitForChanges();

    const initialCount = page.root.shadowRoot.querySelectorAll(
      ".breadcrumbs__item",
    ).length;

    page.root.lfCurrentNodeId = "electronics";
    await page.root.refresh();
    await page.waitForChanges();

    const updatedCount = page.root.shadowRoot.querySelectorAll(
      ".breadcrumbs__item",
    ).length;
    expect(updatedCount).toBe(initialCount - 1);
  });
});

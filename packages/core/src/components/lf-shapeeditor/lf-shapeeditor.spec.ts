import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfShapeeditor } from "./lf-shapeeditor";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfShapeeditor],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-shapeeditor", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    expect(component.lfDataset).toEqual({});
    expect(component.lfLoadCallback).toBeNull();
    expect(component.lfNavigation).toBeUndefined();
    expect(component.lfShape).toBe("image");
    expect(component.lfStyle).toBe("");
    expect(component.lfValue).toEqual({});
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-shapeeditor lf-style="color: red;"></lf-shapeeditor>`,
    );
    const component = page.rootInstance as LfShapeeditor;

    expect(component.lfStyle).toBe("color: red;");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    const props = await component.getProps();
    expect(props.lfDataset).toEqual({});
    expect(props.lfStyle).toBe("");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });

  it("should get components", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    const components = await component.getComponents();
    expect(components).toBeDefined();
  });

  it("should get current snapshot", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    const snapshot = await component.getCurrentSnapshot();
    expect(snapshot).toBeDefined();
  });

  it("should set spinner status", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    await component.setSpinnerStatus(true);
    expect(page.root).toBeTruthy();
  });

  it("should clear selection", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    await component.clearSelection();
    expect(page.root).toBeTruthy();
  });

  it("should clear history", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    await component.clearHistory();
    expect(page.root).toBeTruthy();
  });

  it("should reset", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    await component.reset();
    expect(page.root).toBeTruthy();
  });

  it("should add snapshot", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    await component.addSnapshot("test");
    expect(page.root).toBeTruthy();
  });

  it("should unmount", async () => {
    const page = await createPage(`<lf-shapeeditor></lf-shapeeditor>`);
    const component = page.rootInstance as LfShapeeditor;

    await component.unmount();
    expect(page.root).toBeTruthy();
  });
});

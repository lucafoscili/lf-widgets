import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfMasonry } from "./lf-masonry";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfMasonry],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-masonry", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    const component = page.rootInstance as LfMasonry;

    expect(component.lfActions).toBe(false);
    expect(component.lfCollapseColumns).toBe(true);
    expect(component.lfDataset).toBeNull();
    expect(component.lfSelectable).toBe(false);
    expect(component.lfShape).toBe("image");
    expect(component.lfStyle).toBe("");
    expect(component.lfView).toBe("main");
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-masonry lf-actions lf-selectable lf-shape="badge" lf-style="color: red;"></lf-masonry>`,
    );
    const component = page.rootInstance as LfMasonry;

    expect(component.lfActions).toBe(true);
    expect(component.lfSelectable).toBe(true);
    expect(component.lfShape).toBe("badge");
    expect(component.lfStyle).toBe("color: red;");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    const component = page.rootInstance as LfMasonry;

    const props = await component.getProps();
    expect(props.lfActions).toBe(false);
    expect(props.lfShape).toBe("image");
    expect(props.lfStyle).toBe("");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    const component = page.rootInstance as LfMasonry;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    const component = page.rootInstance as LfMasonry;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });

  it("should get selected shape", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    const component = page.rootInstance as LfMasonry;

    const selectedShape = await component.getSelectedShape();
    expect(selectedShape).toBeDefined();
  });

  it("should redecorate shapes", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    const component = page.rootInstance as LfMasonry;

    await component.redecorateShapes();
    expect(page.root).toBeTruthy();
  });

  it("should set selected shape", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    const component = page.rootInstance as LfMasonry;

    await component.setSelectedShape(0);
    expect(page.root).toBeTruthy();
  });

  it("should unmount", async () => {
    const page = await createPage(`<lf-masonry></lf-masonry>`);
    const component = page.rootInstance as LfMasonry;

    await component.unmount();
    expect(page.root).toBeTruthy();
  });
});

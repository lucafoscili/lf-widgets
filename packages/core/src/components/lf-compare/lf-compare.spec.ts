import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfCompare } from "./lf-compare";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfCompare],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-compare", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-compare></lf-compare>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-compare></lf-compare>`);
    const component = page.rootInstance as LfCompare;

    expect(component.lfDataset).toBeNull();
    expect(component.lfShape).toBe("image");
    expect(component.lfStyle).toBe("");
    expect(component.lfView).toBe("main");
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-compare lf-shape="video" lf-view="split"></lf-compare>`,
    );
    const component = page.rootInstance as LfCompare;

    expect(component.lfShape).toBe("video");
    expect(component.lfView).toBe("split");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-compare></lf-compare>`);
    const component = page.rootInstance as LfCompare;

    const props = await component.getProps();
    expect(props.lfShape).toBe("image");
    expect(props.lfView).toBe("main");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-compare></lf-compare>`);
    const component = page.rootInstance as LfCompare;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-compare></lf-compare>`);
    const component = page.rootInstance as LfCompare;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });
});

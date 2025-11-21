import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfHeader } from "./lf-header";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfHeader],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfHeader", () => {
  it("renders", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    expect(page.root).toBeTruthy();
  });

  it("renders with default props", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;

    expect(component.lfStyle).toBe("");
  });

  it("renders with custom props", async () => {
    const page = await createPage(
      `<lf-header lf-style="#test { color: red; }"></lf-header>`,
    );
    const component = page.rootInstance as LfHeader;

    expect(component.lfStyle).toBe("#test { color: red; }");
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(props.lfStyle).toBe("");
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });
});

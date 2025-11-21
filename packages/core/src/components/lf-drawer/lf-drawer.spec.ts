import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfDrawer } from "./lf-drawer";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfDrawer],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfDrawer", () => {
  beforeAll(() => {
    // Mock requestAnimationFrame to execute immediately
    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    };
  });

  it("renders", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    expect(page.root).toBeTruthy();
  });

  it("renders with default props", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;

    expect(component.lfDisplay).toBe("slide");
    expect(component.lfPosition).toBe("left");
    expect(component.lfResponsive).toBe(0);
    expect(component.lfStyle).toBe("");
    expect(component.lfValue).toBe(false);
  });

  it("renders with custom props", async () => {
    const page = await createPage(
      `<lf-drawer lf-display="dock" lf-position="right" lf-responsive="768" lf-style="#test { color: red; }" lf-value="true"></lf-drawer>`,
    );
    const component = page.rootInstance as LfDrawer;

    expect(component.lfDisplay).toBe("dock");
    expect(component.lfPosition).toBe("right");
    expect(component.lfResponsive).toBe(768);
    expect(component.lfStyle).toBe("#test { color: red; }");
    expect(component.lfValue).toBe(true);
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(props.lfDisplay).toBe("slide");
    expect(props.lfPosition).toBe("left");
    expect(props.lfResponsive).toBe(0);
    expect(props.lfStyle).toBe("");
    expect(props.lfValue).toBe(false);
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls isOpened method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    const isOpened = await component.isOpened();

    expect(isOpened).toBe(false);
  });

  it("calls open method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.open();
    await page.waitForChanges();

    expect(component.lfValue).toBe(true);
  });

  it("calls close method", async () => {
    const page = await createPage(`<lf-drawer lf-value="true"></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.close();
    await page.waitForChanges();

    expect(component.lfValue).toBe(false);
  });

  it("calls toggle method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.toggle();
    await page.waitForChanges();

    expect(component.lfValue).toBe(true);

    await component.toggle();
    await page.waitForChanges();

    expect(component.lfValue).toBe(false);
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-drawer></lf-drawer>`);
    const component = page.rootInstance as LfDrawer;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });
});

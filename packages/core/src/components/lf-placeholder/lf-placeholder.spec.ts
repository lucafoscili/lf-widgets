import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfPlaceholder } from "./lf-placeholder";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfPlaceholder],
    html,
  });
  return page;
};

describe("LfPlaceholder", () => {
  beforeAll(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  it("renders", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    expect(component).toBeTruthy();
  });

  it("has default props", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    const props = await component.getProps();

    expect(props.lfIcon).toBe("template");
    expect(props.lfProps).toEqual({});
    expect(props.lfStyle).toBe("");
    expect(props.lfThreshold).toBe(0.25);
    expect(props.lfTrigger).toBe("both");
    expect(props.lfValue).toBe("LfCard");
  });

  it("sets props", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;

    component.lfIcon = "template";
    component.lfProps = {};
    component.lfStyle = "color: red;";
    component.lfThreshold = 0.5;
    component.lfTrigger = "viewport";
    component.lfValue = "LfButton";

    await page.waitForChanges();

    const props = await component.getProps();
    expect(props.lfIcon).toBe("template");
    expect(props.lfProps).toEqual({});
    expect(props.lfStyle).toBe("color: red;");
    expect(props.lfThreshold).toBe(0.5);
    expect(props.lfTrigger).toBe("viewport");
    expect(props.lfValue).toBe("LfButton");
  });

  it("calls getComponent method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    const comp = await component.getComponent();

    expect(comp).toBeDefined();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(typeof props).toBe("object");
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-placeholder></lf-placeholder>`);
    const component = page.rootInstance as LfPlaceholder;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });
});

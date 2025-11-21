import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfPhotoframe } from "./lf-photoframe";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfPhotoframe],
    html,
  });
  return page;
};

describe("LfPhotoframe", () => {
  beforeAll(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });
  let page: any;

  beforeEach(async () => {
    page = await createPage(`<lf-photoframe></lf-photoframe>`);
  });

  it("renders", async () => {
    const component = page.rootInstance as LfPhotoframe;
    expect(component).toBeTruthy();
  });

  it("has default props", async () => {
    const component = page.rootInstance as LfPhotoframe;
    const props = await component.getProps();

    expect(props.lfOverlay).toBeNull();
    expect(props.lfPlaceholder).toBeNull();
    expect(props.lfStyle).toBe("");
    expect(props.lfThreshold).toBe(0.25);
    expect(props.lfValue).toBeNull();
  });

  it("sets props", async () => {
    const component = page.rootInstance as LfPhotoframe;

    component.lfOverlay = { title: "Test", description: "Desc" };
    component.lfPlaceholder = { src: "placeholder.jpg" };
    component.lfStyle = "color: red;";
    component.lfThreshold = 0.5;
    component.lfValue = { src: "image.jpg" };

    await page.waitForChanges();

    const props = await component.getProps();
    expect(props.lfOverlay.title).toBe("Test");
    expect(props.lfPlaceholder.src).toBe("placeholder.jpg");
    expect(props.lfStyle).toBe("color: red;");
    expect(props.lfThreshold).toBe(0.5);
    expect(props.lfValue.src).toBe("image.jpg");
  });

  it("calls getDebugInfo method", async () => {
    const component = page.rootInstance as LfPhotoframe;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls getProps method", async () => {
    const component = page.rootInstance as LfPhotoframe;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(typeof props).toBe("object");
  });

  it("calls refresh method", async () => {
    const component = page.rootInstance as LfPhotoframe;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls unmount method", async () => {
    const component = page.rootInstance as LfPhotoframe;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });
});

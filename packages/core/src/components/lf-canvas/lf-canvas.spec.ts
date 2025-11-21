import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfCanvas } from "./lf-canvas";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfCanvas],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-canvas", () => {
  beforeAll(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });
  it("should render", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    const component = page.rootInstance as LfCanvas;

    expect(component.lfBrush).toBe("round");
    expect(component.lfColor).toBe("#ff0000");
    expect(component.lfCursor).toBe("preview");
    expect(component.lfImageProps).toBeNull();
    expect(component.lfOpacity).toBe(1.0);
    expect(component.lfPreview).toBe(true);
    expect(component.lfStrokeTolerance).toBeNull();
    expect(component.lfSize).toBe(10);
    expect(component.lfStyle).toBe("");
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-canvas lf-brush="square" lf-color="#00ff00" lf-size="20"></lf-canvas>`,
    );
    const component = page.rootInstance as LfCanvas;

    expect(component.lfBrush).toBe("square");
    expect(component.lfColor).toBe("#00ff00");
    expect(component.lfSize).toBe(20);
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    const component = page.rootInstance as LfCanvas;

    const props = await component.getProps();
    expect(props.lfBrush).toBe("round");
    expect(props.lfColor).toBe("#ff0000");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    const component = page.rootInstance as LfCanvas;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-canvas></lf-canvas>`);
    const component = page.rootInstance as LfCanvas;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });
});

import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfChart } from "./lf-chart";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfChart],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-chart", () => {
  beforeAll(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });
  it("should render", async () => {
    const page = await createPage(`<lf-chart></lf-chart>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-chart></lf-chart>`);
    const component = page.rootInstance as LfChart;

    expect(component.lfAxis).toEqual([]);
    expect(component.lfColors).toEqual([]);
    expect(component.lfDataset).toBeNull();
    expect(component.lfLegend).toBe("bottom");
    expect(component.lfSeries).toEqual([]);
    expect(component.lfSizeX).toBe("100%");
    expect(component.lfSizeY).toBe("100%");
    expect(component.lfStyle).toBe("");
    expect(component.lfTypes).toEqual(["line"]);
    expect(component.lfXAxis).toBeNull();
    expect(component.lfYAxis).toBeNull();
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-chart lf-legend="top" lf-size-x="200px"></lf-chart>`,
    );
    const component = page.rootInstance as LfChart;

    expect(component.lfLegend).toBe("top");
    expect(component.lfSizeX).toBe("200px");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-chart></lf-chart>`);
    const component = page.rootInstance as LfChart;

    const props = await component.getProps();
    expect(props.lfLegend).toBe("bottom");
    expect(props.lfTypes).toEqual(["line"]);
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-chart></lf-chart>`);
    const component = page.rootInstance as LfChart;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-chart></lf-chart>`);
    const component = page.rootInstance as LfChart;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });
});

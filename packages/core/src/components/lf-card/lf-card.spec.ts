import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfCard } from "./lf-card";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfCard],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-card", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-card></lf-card>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-card></lf-card>`);
    const component = page.rootInstance as LfCard;

    expect(component.lfDataset).toBeNull();
    expect(component.lfLayout).toBe("material");
    expect(component.lfSizeX).toBe("100%");
    expect(component.lfSizeY).toBe("100%");
    expect(component.lfStyle).toBe("");
    expect(component.lfUiSize).toBe("medium");
    expect(component.lfUiState).toBe("primary");
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-card lf-layout="debug" lf-size-x="200px" lf-ui-size="small"></lf-card>`,
    );
    const component = page.rootInstance as LfCard;

    expect(component.lfLayout).toBe("debug");
    expect(component.lfSizeX).toBe("200px");
    expect(component.lfUiSize).toBe("small");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-card></lf-card>`);
    const component = page.rootInstance as LfCard;

    const props = await component.getProps();
    expect(props.lfLayout).toBe("material");
    expect(props.lfSizeX).toBe("100%");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-card></lf-card>`);
    const component = page.rootInstance as LfCard;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-card></lf-card>`);
    const component = page.rootInstance as LfCard;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });

  it("should get shapes", async () => {
    const page = await createPage(`<lf-card></lf-card>`);
    const component = page.rootInstance as LfCard;

    const shapes = await component.getShapes();
    expect(shapes).toBeDefined();
  });
});

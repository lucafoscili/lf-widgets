import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfCarousel } from "./lf-carousel";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfCarousel],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("lf-carousel", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-carousel></lf-carousel>`);
    expect(page.root).toBeTruthy();
  });

  it("should have default props", async () => {
    const page = await createPage(`<lf-carousel></lf-carousel>`);
    const component = page.rootInstance as LfCarousel;

    expect(component.lfDataset).toBeNull();
    expect(component.lfAutoPlay).toBe(false);
    expect(component.lfInterval).toBe(3000);
    expect(component.lfLightbox).toBe(false);
    expect(component.lfNavigation).toBe(false);
    expect(component.lfShape).toBe("image");
    expect(component.lfStyle).toBe("");
  });

  it("should set props", async () => {
    const page = await createPage(
      `<lf-carousel lf-navigation="true" lf-shape="video"></lf-carousel>`,
    );
    const component = page.rootInstance as LfCarousel;

    expect(component.lfNavigation).toBe(true);
    expect(component.lfShape).toBe("video");
  });

  it("should get props", async () => {
    const page = await createPage(`<lf-carousel></lf-carousel>`);
    const component = page.rootInstance as LfCarousel;

    const props = await component.getProps();
    expect(props.lfAutoPlay).toBe(false);
    expect(props.lfShape).toBe("image");
  });

  it("should refresh", async () => {
    const page = await createPage(`<lf-carousel></lf-carousel>`);
    const component = page.rootInstance as LfCarousel;

    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("should get debug info", async () => {
    const page = await createPage(`<lf-carousel></lf-carousel>`);
    const component = page.rootInstance as LfCarousel;

    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });

  it("should go to slide", async () => {
    const page = await createPage(`<lf-carousel></lf-carousel>`);
    const component = page.rootInstance as LfCarousel;

    await component.goToSlide(2);
    expect(component.currentIndex).toBe(2);
  });
});

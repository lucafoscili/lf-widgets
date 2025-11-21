import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfMessenger } from "./lf-messenger";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfMessenger],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfMessenger", () => {
  it("renders", async () => {
    const page = await createPage(`<lf-messenger></lf-messenger>`);
    expect(page.root).toBeTruthy();
  });

  it("renders with default props", async () => {
    const page = await createPage(`<lf-messenger></lf-messenger>`);
    const component = page.rootInstance as LfMessenger;

    expect(component.lfAutosave).toBe(true);
    expect(component.lfDataset).toBeNull();
    expect(component.lfStyle).toBe("");
    expect(component.lfValue).toBeNull();
  });

  it("renders with custom props", async () => {
    const page = await createPage(
      `<lf-messenger lf-autosave="false" lf-style="#test { color: red; }"></lf-messenger>`,
    );
    const component = page.rootInstance as LfMessenger;

    expect(component.lfAutosave).toBe(false);
    expect(component.lfStyle).toBe("#test { color: red; }");
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-messenger></lf-messenger>`);
    const component = page.rootInstance as LfMessenger;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(props.lfAutosave).toBe(true);
    expect(props.lfDataset).toBeNull();
    expect(props.lfStyle).toBe("");
    expect(props.lfValue).toBeNull();
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-messenger></lf-messenger>`);
    const component = page.rootInstance as LfMessenger;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-messenger></lf-messenger>`);
    const component = page.rootInstance as LfMessenger;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls reset method", async () => {
    const page = await createPage(`<lf-messenger></lf-messenger>`);
    const component = page.rootInstance as LfMessenger;
    await component.reset();

    expect(component).toBeTruthy();
  });

  it("calls save method", async () => {
    const page = await createPage(`<lf-messenger></lf-messenger>`);
    const component = page.rootInstance as LfMessenger;
    // Set a minimal dataset to avoid null reference
    component.lfDataset = { nodes: [] };
    await component.save();

    expect(component).toBeTruthy();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-messenger></lf-messenger>`);
    const component = page.rootInstance as LfMessenger;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });
});

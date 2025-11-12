import { newSpecPage } from "@stencil/core/testing";
import { LfSelect } from "./lf-select";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfSelect], html });
  await page.waitForChanges();
  return page;
};

describe("lf-select", () => {
  it("should render", async () => {
    const page = await createPage(`<lf-select></lf-select>`);
    expect(page.root).toBeTruthy();
  });

  it("should initialize value from lfValue when valid", async () => {
    const page = await createPage(
      `<lf-select lf-dataset='{"nodes":[{"id":"test-id","value":"Test Option"}]}' lf-value="test-id"></lf-select>`,
    );

    const component = page.rootInstance as LfSelect;
    // Check that internal value state is set
    expect(component.value).toBe("test-id");

    // Check that getValue returns the correct node
    const selectedNode = await component.getValue();
    expect(selectedNode).toBeTruthy();
    expect(selectedNode.id).toBe("test-id");
    expect(selectedNode.value).toBe("Test Option");
  });

  it("should set value programmatically with setValue(id)", async () => {
    const page = await createPage(
      `<lf-select lf-dataset='{"nodes":[{"id":"test-id","value":"Test Option"}]}'></lf-select>`,
    );

    const component = page.rootInstance as LfSelect;

    // Initially no value
    expect(component.value).toBeNull();
    let selectedNode = await component.getValue();
    expect(selectedNode).toBeNull();

    // Set value programmatically
    await component.setValue("test-id");

    // Check internal state and getValue
    expect(component.value).toBe("test-id");
    selectedNode = await component.getValue();
    expect(selectedNode.id).toBe("test-id");
  });

  it("should reject invalid setValue(id) calls", async () => {
    const page = await createPage(
      `<lf-select lf-dataset='{"nodes":[{"id":"test-id","value":"Test Option"}]}'></lf-select>`,
    );

    const component = page.rootInstance as LfSelect;

    // Try to set invalid value
    await component.setValue("invalid-id");

    // Should remain null
    expect(component.value).toBeNull();
    const selectedNode = await component.getValue();
    expect(selectedNode).toBeNull();
  });

  it("should clear value when dataset changes and current value becomes invalid", async () => {
    const page = await createPage(
      `<lf-select lf-dataset='{"nodes":[{"id":"test-id","value":"Test Option"}]}' lf-value="test-id"></lf-select>`,
    );

    const component = page.rootInstance as LfSelect;

    // Initially should have value
    expect(component.value).toBe("test-id");
    let selectedNode = await component.getValue();
    expect(selectedNode).toBeTruthy();

    // Change dataset to not include the current value
    component.lfDataset = {
      nodes: [{ id: "other-id", value: "Other Option" }],
    };
    await page.waitForChanges();

    // Should clear the value
    expect(component.value).toBeNull();
    selectedNode = await component.getValue();
    expect(selectedNode).toBeNull();
  });
});

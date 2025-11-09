import { newSpecPage } from "@stencil/core/testing";
import { LfSpinner } from "./lf-spinner";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfSpinner], html });
  await page.waitForChanges();
  return { page };
};

describe("lf-spinner component", () => {
  it("renders with default props", async () => {
    const { page } = await createPage(`<lf-spinner></lf-spinner>`);
    expect(page.root).toBeDefined();
    const spinner = page.root.shadowRoot.querySelector(".spinner-v1");
    expect(spinner).not.toBeNull();
  });

  it("shows spinner when lfActive is true", async () => {
    const { page } = await createPage(
      `<lf-spinner lf-active="true"></lf-spinner>`,
    );
    expect(page.root.getAttribute("lf-active")).toBe("true");
  });

  it("renders bar variant when lfBarVariant is true", async () => {
    const { page } = await createPage(
      `<lf-spinner lf-bar-variant="true"></lf-spinner>`,
    );
    const spinner = page.root.shadowRoot.querySelector(
      "#loading-wrapper-master",
    );
    expect(spinner).not.toBeNull();
  });

  it("has progress state", async () => {
    const { page } = await createPage(
      `<lf-spinner lf-active="true"></lf-spinner>`,
    );
    expect(await page.root.getProgress()).toBe(0);
  });
});

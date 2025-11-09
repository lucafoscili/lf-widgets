import { newSpecPage } from "@stencil/core/testing";
import { LfUpload } from "./lf-upload";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfUpload], html });
  await page.waitForChanges();
  return page;
};

describe("lf-upload component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-upload></lf-upload>`);
    expect(page.root).toBeDefined();
    const upload = page.root.shadowRoot.querySelector(".upload");
    expect(upload).not.toBeNull();
  });

  it("displays label when lfLabel is set", async () => {
    const page = await createPage(
      `<lf-upload lf-label="Choose file"></lf-upload>`,
    );
    const label = page.root.shadowRoot.querySelector(".file-upload__text");
    expect(label).not.toBeNull();
    expect(label.textContent.trim()).toBe("Choose file");
  });

  it("has input element", async () => {
    const page = await createPage(`<lf-upload></lf-upload>`);
    const input = page.root.shadowRoot.querySelector("input");
    expect(input).not.toBeNull();
    expect(input.getAttribute("type")).toBe("file");
  });

  it("emits event on file selection", async () => {
    const page = await createPage(`<lf-upload></lf-upload>`);
    const spy = jest.fn();
    page.root.addEventListener("lf-upload-event", spy);
    const input = page.root.shadowRoot.querySelector("input");
    const file = new File(["content"], "test.txt", { type: "text/plain" });
    input.files = [file] as any;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await page.waitForChanges();
    expect(spy).toHaveBeenCalled();
  });
});

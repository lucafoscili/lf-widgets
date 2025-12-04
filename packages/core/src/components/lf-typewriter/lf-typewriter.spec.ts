import { newSpecPage } from "@stencil/core/testing";
import { LfTypewriter } from "./lf-typewriter";
// Ensure framework initializes so component's awaitFramework() resolves
import { getLfFramework } from "@lf-widgets/framework";

// Helper ensuring framework is initialized prior to component instantiation
const createPage = async (html: string) => {
  // Trigger framework creation / markFrameworkReady
  getLfFramework();
  const page = await newSpecPage({ components: [LfTypewriter], html });
  await page.waitForChanges();
  return page;
};

describe("lf-typewriter component", () => {
  it("renders with default props", async () => {
    const page = await createPage(`<lf-typewriter></lf-typewriter>`);
    expect(page.root).toBeDefined();
    const typewriter = page.root.shadowRoot.querySelector(".typewriter");
    expect(typewriter).not.toBeNull();
  });

  it("displays text when lfValue is set", async () => {
    const page = await createPage(
      `<lf-typewriter lf-value="Hello World"></lf-typewriter>`,
    );
    const text = page.root.shadowRoot.querySelector(".typewriter__text");
    expect(text).not.toBeNull();
    // Text animates, so just check presence
  });

  it("loops through array when lfLoop is true", async () => {
    const page = await createPage(
      `<lf-typewriter lf-value='["First","Second"]' lf-loop="true"></lf-typewriter>`,
    );
    expect(page.root).toBeDefined();
    // Check if it has loop attribute
    expect(page.root.getAttribute("lf-loop")).toBe("true");
  });

  it("sets props programmatically", async () => {
    const page = await createPage(`<lf-typewriter></lf-typewriter>`);
    const component = page.rootInstance as LfTypewriter;

    component.lfValue = "Typed text";
    component.lfLoop = true;
    component.lfSpeed = 50;
    component.lfStyle = "font-size: 20px;";
    await page.waitForChanges();

    const props = await component.getProps();
    expect(props.lfValue).toBe("Typed text");
    expect(props.lfLoop).toBe(true);
    expect(props.lfSpeed).toBe(50);
    expect(props.lfStyle).toBe("font-size: 20px;");
  });

  it("handles array values", async () => {
    const page = await createPage(`<lf-typewriter></lf-typewriter>`);
    const component = page.rootInstance as LfTypewriter;

    component.lfValue = ["Hello", "World", "Typewriter"];
    await page.waitForChanges();

    const props = await component.getProps();
    expect(props.lfValue).toEqual(["Hello", "World", "Typewriter"]);
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-typewriter></lf-typewriter>`);
    const component = page.rootInstance as LfTypewriter;
    const debugInfo = await component.getDebugInfo();
    expect(debugInfo).toBeDefined();
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-typewriter></lf-typewriter>`);
    const component = page.rootInstance as LfTypewriter;
    await component.refresh();
    expect(page.root).toBeTruthy();
  });

  it("has event emitter configured", async () => {
    const page = await createPage(
      `<lf-typewriter lf-value="Test"></lf-typewriter>`,
    );
    const component = page.rootInstance as LfTypewriter;

    // Verify the component has the event emitter configured
    expect(component.lfEvent).toBeDefined();
    expect(page.root).toBeDefined();
  });
});

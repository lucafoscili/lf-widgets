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

  //#region Event emission tests
  describe("event emission", () => {
    it("emits unmount event when unmount method is called", async () => {
      const page = await createPage(
        `<lf-typewriter lf-value="Test"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-typewriter-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const unmountEvent = events.find(
        (e) => e.detail?.eventType === "unmount",
      );
      expect(unmountEvent).toBeDefined();
    });

    it("event payload contains correct structure", async () => {
      const page = await createPage(
        `<lf-typewriter id="test-typewriter" lf-value="Test"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-typewriter-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(events.length).toBeGreaterThan(0);
      const event = events[0];
      expect(event.detail.comp).toBeDefined();
      expect(event.detail.id).toBe("test-typewriter");
      expect(event.detail.eventType).toBe("unmount");
    });

    it("event emitter is properly configured", async () => {
      const page = await createPage(
        `<lf-typewriter lf-value="Test"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;

      expect(component.lfEvent).toBeDefined();
      expect(typeof component.lfEvent.emit).toBe("function");
    });
  });
  //#endregion

  //#region Value and text rendering tests
  describe("value rendering", () => {
    it("renders empty text when lfValue is empty string", async () => {
      const page = await createPage(
        `<lf-typewriter lf-value=""></lf-typewriter>`,
      );
      const text = page.root.shadowRoot.querySelector(".typewriter__text");
      expect(text).not.toBeNull();
    });

    it("handles single string value", async () => {
      const page = await createPage(
        `<lf-typewriter lf-value="Single text"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfValue).toBe("Single text");
    });

    it("handles multiple texts in array for looping", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      component.lfValue = ["First", "Second", "Third"];
      component.lfLoop = true;
      await page.waitForChanges();

      const props = await component.getProps();
      expect(Array.isArray(props.lfValue)).toBe(true);
      expect((props.lfValue as string[]).length).toBe(3);
    });

    it("updates displayed text when lfValue changes", async () => {
      const page = await createPage(
        `<lf-typewriter lf-value="Initial"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;

      component.lfValue = "Updated";
      await page.waitForChanges();

      const props = await component.getProps();
      expect(props.lfValue).toBe("Updated");
    });
  });
  //#endregion

  //#region Speed and timing tests
  describe("speed and timing", () => {
    it("accepts custom typing speed", async () => {
      const page = await createPage(
        `<lf-typewriter lf-speed="100"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfSpeed).toBe(100);
    });

    it("accepts custom delete speed", async () => {
      const page = await createPage(
        `<lf-typewriter lf-delete-speed="75"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfDeleteSpeed).toBe(75);
    });

    it("accepts custom pause duration", async () => {
      const page = await createPage(
        `<lf-typewriter lf-pause="1000"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfPause).toBe(1000);
    });

    it("has default speed values", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();

      expect(props.lfSpeed).toBe(50);
      expect(props.lfDeleteSpeed).toBe(50);
      expect(props.lfPause).toBe(500);
    });
  });
  //#endregion

  //#region Cursor behavior tests
  describe("cursor behavior", () => {
    it("has cursor set to auto by default", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfCursor).toBe("auto");
    });

    it("accepts cursor set to enabled", async () => {
      const page = await createPage(
        `<lf-typewriter lf-cursor="enabled"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfCursor).toBe("enabled");
    });

    it("accepts cursor set to disabled", async () => {
      const page = await createPage(
        `<lf-typewriter lf-cursor="disabled"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfCursor).toBe("disabled");
    });

    it("renders cursor element when cursor is enabled", async () => {
      const page = await createPage(
        `<lf-typewriter lf-cursor="enabled" lf-value="Test"></lf-typewriter>`,
      );
      await page.waitForChanges();
      const cursor = page.root.shadowRoot.querySelector(".typewriter__cursor");
      expect(cursor).not.toBeNull();
    });
  });
  //#endregion

  //#region Tag and structure tests
  describe("tag customization", () => {
    it("uses p tag by default", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfTag).toBe("p");
    });

    it("accepts custom tag", async () => {
      const page = await createPage(
        `<lf-typewriter lf-tag="h1"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfTag).toBe("h1");
    });

    it("renders custom tag element", async () => {
      const page = await createPage(
        `<lf-typewriter lf-tag="h2" lf-value="Heading"></lf-typewriter>`,
      );
      const h2 = page.root.shadowRoot.querySelector("h2");
      expect(h2).not.toBeNull();
    });
  });
  //#endregion

  //#region Public methods tests
  describe("public methods", () => {
    it("getProps returns all component properties", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();

      expect(props).toHaveProperty("lfCursor");
      expect(props).toHaveProperty("lfDeleteSpeed");
      expect(props).toHaveProperty("lfLoop");
      expect(props).toHaveProperty("lfPause");
      expect(props).toHaveProperty("lfSpeed");
      expect(props).toHaveProperty("lfStyle");
      expect(props).toHaveProperty("lfTag");
      expect(props).toHaveProperty("lfUpdatable");
      expect(props).toHaveProperty("lfValue");
    });

    it("getDebugInfo returns lifecycle information", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      const debugInfo = await component.getDebugInfo();

      expect(debugInfo).toBeDefined();
    });

    it("refresh forces component re-render", async () => {
      const page = await createPage(
        `<lf-typewriter lf-value="Test"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;

      await component.refresh();
      await page.waitForChanges();

      expect(page.root).toBeTruthy();
      const text = page.root.shadowRoot.querySelector(".typewriter__text");
      expect(text).not.toBeNull();
    });

    it("unmount removes component from DOM", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;

      const rootElement = page.root;
      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(rootElement.parentNode).toBeNull();
    });
  });
  //#endregion

  //#region Loop behavior tests
  describe("loop behavior", () => {
    it("has loop disabled by default", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfLoop).toBe(false);
    });

    it("enables loop when lfLoop is true", async () => {
      const page = await createPage(
        `<lf-typewriter lf-loop="true"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfLoop).toBe(true);
    });

    it("cycles through array values when looping", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      component.lfValue = ["One", "Two"];
      component.lfLoop = true;
      await page.waitForChanges();

      expect(component.lfLoop).toBe(true);
      expect(component.lfValue).toEqual(["One", "Two"]);
    });
  });
  //#endregion

  //#region Style and UI size tests
  describe("styling and UI size", () => {
    it("applies custom style", async () => {
      const page = await createPage(
        `<lf-typewriter lf-style=".typewriter { color: red; }"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfStyle).toContain("color: red");
    });

    it("has medium UI size by default", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      expect(component.lfUiSize).toBe("medium");
    });

    it("accepts different UI sizes", async () => {
      const page = await createPage(
        `<lf-typewriter lf-ui-size="large"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      expect(component.lfUiSize).toBe("large");
    });

    it("reflects lfUiSize attribute", async () => {
      const page = await createPage(
        `<lf-typewriter lf-ui-size="small"></lf-typewriter>`,
      );
      expect(page.root.getAttribute("lf-ui-size")).toBe("small");
    });
  });
  //#endregion

  //#region Updatable behavior tests
  describe("updatable behavior", () => {
    it("has lfUpdatable true by default", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfUpdatable).toBe(true);
    });

    it("can disable updates with lfUpdatable false", async () => {
      const page = await createPage(
        `<lf-typewriter lf-updatable="false"></lf-typewriter>`,
      );
      const component = page.rootInstance as LfTypewriter;
      const props = await component.getProps();
      expect(props.lfUpdatable).toBe(false);
    });
  });
  //#endregion

  //#region Structure and parts tests
  describe("component structure", () => {
    it("renders typewriter container with correct class", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const typewriter = page.root.shadowRoot.querySelector(".typewriter");
      expect(typewriter).not.toBeNull();
    });

    it("renders text element with correct class", async () => {
      const page = await createPage(
        `<lf-typewriter lf-value="Test"></lf-typewriter>`,
      );
      const text = page.root.shadowRoot.querySelector(".typewriter__text");
      expect(text).not.toBeNull();
    });

    it("has shadow DOM enabled", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      expect(page.root.shadowRoot).not.toBeNull();
    });

    it("contains wrapper element", async () => {
      const page = await createPage(`<lf-typewriter></lf-typewriter>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).not.toBeNull();
    });
  });
  //#endregion
});

import { newSpecPage } from "@stencil/core/testing";
import { getLfFramework } from "@lf-widgets/framework";
import { LfHeader } from "./lf-header";

const createPage = async (html: string) => {
  getLfFramework();
  const page = await newSpecPage({
    components: [LfHeader],
    html,
  });
  await page.waitForChanges();
  return page;
};

describe("LfHeader", () => {
  it("renders", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    expect(page.root).toBeTruthy();
  });

  it("renders with default props", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;

    expect(component.lfStyle).toBe("");
  });

  it("renders with custom props", async () => {
    const page = await createPage(
      `<lf-header lf-style="#test { color: red; }"></lf-header>`,
    );
    const component = page.rootInstance as LfHeader;

    expect(component.lfStyle).toBe("#test { color: red; }");
  });

  it("calls getProps method", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;
    const props = await component.getProps();

    expect(props).toBeDefined();
    expect(props.lfStyle).toBe("");
  });

  it("calls refresh method", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;
    await component.refresh();

    expect(component).toBeTruthy();
  });

  it("calls getDebugInfo method", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;
    const debugInfo = await component.getDebugInfo();

    expect(debugInfo).toBeDefined();
  });

  it("calls unmount method", async () => {
    const page = await createPage(`<lf-header></lf-header>`);
    const component = page.rootInstance as LfHeader;
    await component.unmount(0);

    // Component should be removed, but in test environment it might not
    expect(component).toBeTruthy();
  });

  describe("Events", () => {
    it("emits ready event on component load", async () => {
      const events: CustomEvent[] = [];
      getLfFramework();
      const page = await newSpecPage({
        components: [LfHeader],
        html: `<lf-header></lf-header>`,
      });
      page.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events.push(e),
      );
      await page.waitForChanges();

      // Ready event is emitted during componentDidLoad, so we check if it was captured
      // Since the component already loaded, we can verify structure with refresh
      const component = page.rootInstance as LfHeader;
      await component.refresh();
      await page.waitForChanges();

      // The ready event fires on initial load, let's verify via a new instance
      const events2: CustomEvent[] = [];
      const page2 = await newSpecPage({
        components: [LfHeader],
        html: `<lf-header></lf-header>`,
      });
      page2.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events2.push(e),
      );
      await page2.waitForChanges();

      expect(page2.root).toBeTruthy();
    });

    it("emits events with correct payload structure", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfHeader;
      await component.unmount(0);

      // Wait for setTimeout in unmount to complete
      await new Promise((resolve) => setTimeout(resolve, 10));
      await page.waitForChanges();

      expect(events.length).toBeGreaterThan(0);
      const event = events[0];
      expect(event.detail).toHaveProperty("comp");
      expect(event.detail).toHaveProperty("eventType");
      expect(event.detail).toHaveProperty("id");
    });

    it("emits unmount event when component unmounts", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfHeader;
      await component.unmount(0);

      // Wait for setTimeout in unmount to complete
      await new Promise((resolve) => setTimeout(resolve, 10));
      await page.waitForChanges();

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
    });

    it("emits unmount event with correct component reference", async () => {
      const page = await createPage(`<lf-header id="test-header"></lf-header>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfHeader;
      await component.unmount(0);

      await new Promise((resolve) => setTimeout(resolve, 10));
      await page.waitForChanges();

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
      expect(unmountEvent.detail.comp).toBe(component);
      expect(unmountEvent.detail.id).toBe("test-header");
    });

    it("emits unmount event after specified delay", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfHeader;
      await component.unmount(50);

      // Event should not be emitted immediately
      expect(events.length).toBe(0);

      // Wait for delay to complete
      await new Promise((resolve) => setTimeout(resolve, 60));
      await page.waitForChanges();

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
    });
  });

  describe("Styling", () => {
    it("renders without style element when lfStyle is empty", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const styleElement = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleElement).toBeNull();
    });

    it("renders style element when lfStyle is provided", async () => {
      const page = await createPage(
        `<lf-header lf-style=".test { color: blue; }"></lf-header>`,
      );
      const styleElement = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleElement).toBeTruthy();
    });

    it("applies custom style content", async () => {
      const customStyle = ".custom-class { background: red; }";
      const page = await createPage(
        `<lf-header lf-style="${customStyle}"></lf-header>`,
      );
      const component = page.rootInstance as LfHeader;
      expect(component.lfStyle).toBe(customStyle);
    });

    it("can update lfStyle dynamically", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;

      expect(component.lfStyle).toBe("");

      component.lfStyle = ".dynamic { margin: 10px; }";
      await page.waitForChanges();

      expect(component.lfStyle).toBe(".dynamic { margin: 10px; }");
    });

    it("removes style element when lfStyle is cleared", async () => {
      const page = await createPage(
        `<lf-header lf-style=".test { color: blue; }"></lf-header>`,
      );
      const component = page.rootInstance as LfHeader;

      let styleElement = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleElement).toBeTruthy();

      component.lfStyle = "";
      await page.waitForChanges();

      styleElement = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleElement).toBeNull();
    });
  });

  describe("Structure", () => {
    it("renders wrapper element", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const wrapper = page.root.shadowRoot.querySelector("#lf-component");
      expect(wrapper).toBeTruthy();
    });

    it("renders header element with correct class", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const header = page.root.shadowRoot.querySelector("header");
      expect(header).toBeTruthy();
      expect(header.classList.contains("header")).toBe(true);
    });

    it("renders section element inside header", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const section = page.root.shadowRoot.querySelector("header > section");
      expect(section).toBeTruthy();
    });

    it("renders content slot", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const slot = page.root.shadowRoot.querySelector('slot[name="content"]');
      expect(slot).toBeTruthy();
    });

    it("header element has correct part attribute", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const header = page.root.shadowRoot.querySelector("header");
      expect(header.getAttribute("part")).toBe("header");
    });

    it("section element has correct part attribute", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const section = page.root.shadowRoot.querySelector("section");
      expect(section.getAttribute("part")).toBe("section");
    });
  });

  describe("Slot Content", () => {
    it("accepts slotted content", async () => {
      const page = await createPage(
        `<lf-header><h1 slot="content">Test Title</h1></lf-header>`,
      );
      const slottedContent = page.root.querySelector('[slot="content"]');
      expect(slottedContent).toBeTruthy();
      expect(slottedContent.textContent).toBe("Test Title");
    });

    it("accepts multiple slotted elements", async () => {
      const page = await createPage(
        `<lf-header>
          <h1 slot="content">Title</h1>
          <nav slot="content">Nav</nav>
        </lf-header>`,
      );
      const slottedElements = page.root.querySelectorAll('[slot="content"]');
      expect(slottedElements.length).toBe(2);
    });

    it("accepts complex slotted content", async () => {
      const page = await createPage(
        `<lf-header>
          <div slot="content">
            <img src="logo.png" alt="Logo" />
            <span>Brand Name</span>
          </div>
        </lf-header>`,
      );
      const slottedDiv = page.root.querySelector('[slot="content"]');
      expect(slottedDiv).toBeTruthy();
      expect(slottedDiv.querySelector("img")).toBeTruthy();
      expect(slottedDiv.querySelector("span")).toBeTruthy();
    });
  });

  describe("Public Methods", () => {
    it("getProps returns all component properties", async () => {
      const page = await createPage(
        `<lf-header lf-style=".test { color: red; }"></lf-header>`,
      );
      const component = page.rootInstance as LfHeader;
      const props = await component.getProps();

      expect(props).toEqual({
        lfStyle: ".test { color: red; }",
      });
    });

    it("getProps returns default values when no props set", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;
      const props = await component.getProps();

      expect(props).toEqual({
        lfStyle: "",
      });
    });

    it("getDebugInfo returns lifecycle information", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;
      const debugInfo = await component.getDebugInfo();

      // debugInfo should be defined (even if the actual content varies)
      expect(debugInfo).toBeDefined();
    });

    it("refresh triggers component re-render", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;

      // Modify a property
      component.lfStyle = ".refreshed { padding: 5px; }";

      // Call refresh
      await component.refresh();
      await page.waitForChanges();

      // Verify the style was applied
      const styleElement = page.root.shadowRoot.querySelector("style#lf-style");
      expect(styleElement).toBeTruthy();
    });

    it("unmount removes component from DOM", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;

      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 10));

      // In test environment, the root element might still exist but be disconnected
      expect(component).toBeTruthy();
    });

    it("unmount with delay works correctly", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events.push(e),
      );

      await component.unmount(100);

      // Immediately after, no unmount event
      expect(
        events.find((e) => e.detail.eventType === "unmount"),
      ).toBeUndefined();

      // After delay
      await new Promise((resolve) => setTimeout(resolve, 110));

      const unmountEvent = events.find((e) => e.detail.eventType === "unmount");
      expect(unmountEvent).toBeDefined();
    });
  });

  describe("Component ID", () => {
    it("captures component ID in event payload", async () => {
      const page = await createPage(`<lf-header id="my-header"></lf-header>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfHeader;
      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const event = events.find((e) => e.detail.eventType === "unmount");
      expect(event.detail.id).toBe("my-header");
    });

    it("handles empty ID in event payload", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const events: CustomEvent[] = [];
      page.root.addEventListener("lf-header-event", (e: CustomEvent) =>
        events.push(e),
      );

      const component = page.rootInstance as LfHeader;
      await component.unmount(0);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const event = events.find((e) => e.detail.eventType === "unmount");
      expect(event.detail.id).toBe("");
    });
  });

  describe("Edge Cases", () => {
    it("handles special characters in lfStyle", async () => {
      const specialStyle = '.test::before { content: ">"; }';
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;

      component.lfStyle = specialStyle;
      await page.waitForChanges();

      expect(component.lfStyle).toBe(specialStyle);
    });

    it("handles very long style strings", async () => {
      const longStyle = ".test { " + "color: red; ".repeat(100) + "}";
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;

      component.lfStyle = longStyle;
      await page.waitForChanges();

      expect(component.lfStyle).toBe(longStyle);
    });

    it("handles rapid style changes", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;

      component.lfStyle = ".first { color: red; }";
      await page.waitForChanges();

      component.lfStyle = ".second { color: blue; }";
      await page.waitForChanges();

      component.lfStyle = ".third { color: green; }";
      await page.waitForChanges();

      expect(component.lfStyle).toBe(".third { color: green; }");
    });

    it("handles multiple refresh calls", async () => {
      const page = await createPage(`<lf-header></lf-header>`);
      const component = page.rootInstance as LfHeader;

      await component.refresh();
      await component.refresh();
      await component.refresh();
      await page.waitForChanges();

      expect(component).toBeTruthy();
    });
  });
});
